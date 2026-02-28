import time
from pathlib import Path
from typing import Optional

from loguru import logger
from pydantic import BaseModel
from surreal_commands import CommandInput, CommandOutput, command

from open_notebook.config import DATA_FOLDER
from open_notebook.database.repository import ensure_record_id, repo_query
from open_notebook.podcasts.models import EpisodeProfile, PodcastEpisode, SpeakerProfile

try:
    from podcast_creator import configure, create_podcast
    import podcast_creator.core as _pc_core
    from open_notebook.utils.text_utils import extract_json_from_model_output

    # Patch so outline/transcript parsing gets robust JSON extraction (strip <think> + ``` code blocks)
    _pc_core.clean_thinking_content = extract_json_from_model_output
except ImportError as e:
    logger.error(f"Failed to import podcast_creator: {e}")
    raise ValueError("podcast_creator library not available")


def full_model_dump(model):
    if isinstance(model, BaseModel):
        return model.model_dump()
    elif isinstance(model, dict):
        return {k: full_model_dump(v) for k, v in model.items()}
    elif isinstance(model, list):
        return [full_model_dump(item) for item in model]
    else:
        return model


class PodcastGenerationInput(CommandInput):
    episode_profile: str
    speaker_profile: str
    episode_name: str
    content: str
    briefing_suffix: Optional[str] = None
    user_id: Optional[str] = None


class PodcastGenerationOutput(CommandOutput):
    success: bool
    episode_id: Optional[str] = None
    audio_file_path: Optional[str] = None
    transcript: Optional[dict] = None
    outline: Optional[dict] = None
    processing_time: float
    error_message: Optional[str] = None


@command("generate_podcast", app="open_notebook", retry={"max_attempts": 1})
async def generate_podcast_command(
    input_data: PodcastGenerationInput,
) -> PodcastGenerationOutput:
    """
    Real podcast generation using podcast-creator library with Episode Profiles
    """
    start_time = time.time()

    try:
        # 0. Resolve credentials and models for all relevant profiles
        # This mapping ensures podcast-creator receives the resolved string names
        # but the actual keys are injected into the environment.
        outline_provider, outline_name, outline_creds = (
            await episode_profile.resolve_outline_config()
        )
        (
            transcript_provider,
            transcript_name,
            transcript_creds,
        ) = await episode_profile.resolve_transcript_config()
        tts_provider, tts_name, tts_creds = await speaker_profile.resolve_tts_config()

        # Merge credentials into environment for podcast-creator compatibility
        for creds in [outline_creds, transcript_creds, tts_creds]:
            if not creds:
                continue
            for k, v in creds.items():
                if v:
                    os.environ[k] = v

        # Fail fast if required models are missing (for newly created profiles)
        if not outline_provider or not transcript_provider or not tts_provider:
            raise ValueError(
                "Episode or Speaker profile is missing model configuration. "
                "Please configure models in Settings → Podcasts Profiles."
            )

        # 1. Load profiles again for modification (dump and override)
        ep_data = episode_profile.model_dump()
        ep_data["outline_provider"] = outline_provider
        ep_data["outline_model"] = outline_name
        ep_data["transcript_provider"] = transcript_provider
        ep_data["transcript_model"] = transcript_name

        sp_data = speaker_profile.model_dump()
        sp_data["tts_provider"] = tts_provider
        sp_data["tts_model"] = tts_name

        # Resolve per-speaker overrides if present
        from open_notebook.podcasts.models import _resolve_model_config

        for speaker in sp_data.get("speakers", []):
            if speaker.get("voice_model"):
                try:
                    p, n, c = await _resolve_model_config(speaker["voice_model"])
                    speaker["tts_provider"] = p
                    speaker["tts_model"] = n
                    # Merge speaker-specific credentials too
                    if c:
                        for k, v in c.items():
                            os.environ[k] = v
                except Exception:
                    logger.warning(
                        f"Failed to resolve override model for speaker {speaker.get('name')}"
                    )

        # 2b. Validate configuration before proceeding
        from open_notebook.podcasts.validation import validate_podcast_config

        validation = validate_podcast_config(
            ep_data,
            sp_data,
        )
        if validation.has_errors:
            error_detail = validation.error_summary()
            logger.error(f"Podcast config validation failed: {error_detail}")
            raise ValueError(
                f"Configuration error: {error_detail}"
            )
        for w in validation.warnings:
            logger.warning(f"Config warning: [{w.field}] {w.message}")

        episode_profiles_dict = {episode_profile.name: ep_data}
        speaker_profiles_dict = {speaker_profile.name: sp_data}

        # 4. Generate briefing
        briefing = episode_profile.default_briefing
        if input_data.briefing_suffix:
            briefing += f"\n\nAdditional instructions: {input_data.briefing_suffix}"

        # Create the a record for the episose and associate with the ongoing command
        episode = PodcastEpisode(
            name=input_data.episode_name,
            episode_profile=full_model_dump(ep_data),
            speaker_profile=full_model_dump(sp_data),
            command=ensure_record_id(input_data.execution_context.command_id)
            if input_data.execution_context
            else None,
            briefing=briefing,
            content=input_data.content,
            audio_file=None,
            transcript=None,
            outline=None,
            user_id=input_data.user_id,
        )
        await episode.save()

        configure("speakers_config", {"profiles": speaker_profiles_dict})
        configure("episode_config", {"profiles": episode_profiles_dict})

        logger.info("Configured podcast-creator with episode and speaker profiles")

        logger.info(f"Generated briefing (length: {len(briefing)} chars)")

        # 5. Create output directory
        output_dir = Path(f"{DATA_FOLDER}/podcasts/episodes/{input_data.episode_name}")
        output_dir.mkdir(parents=True, exist_ok=True)

        logger.info(f"Created output directory: {output_dir}")

        # 6. Generate podcast using podcast-creator
        logger.info("Starting podcast generation with podcast-creator...")

        result = await create_podcast(
            content=input_data.content,
            briefing=briefing,
            episode_name=input_data.episode_name,
            output_dir=str(output_dir),
            speaker_config=speaker_profile.name,
            episode_profile=episode_profile.name,
        )

        episode.audio_file = (
            str(result.get("final_output_file_path")) if result else None
        )
        episode.transcript = {
            "transcript": full_model_dump(result["transcript"]) if result else None
        }
        episode.outline = full_model_dump(result["outline"]) if result else None
        await episode.save()

        processing_time = time.time() - start_time
        logger.info(
            f"Successfully generated podcast episode: {episode.id} in {processing_time:.2f}s"
        )

        return PodcastGenerationOutput(
            success=True,
            episode_id=str(episode.id),
            audio_file_path=str(result.get("final_output_file_path"))
            if result
            else None,
            transcript={"transcript": full_model_dump(result["transcript"])}
            if result.get("transcript")
            else None,
            outline=full_model_dump(result["outline"])
            if result.get("outline")
            else None,
            processing_time=processing_time,
        )

    except ValueError:
        raise

    except Exception as e:
        logger.error(f"Podcast generation failed: {e}")
        logger.exception(e)

        error_msg = str(e).lower()
        if "invalid json output" in error_msg or "expecting value" in error_msg:
            error_msg = str(e) + (
                "\n\nNOTE: This error commonly occurs with GPT-5 models that use extended thinking. "
                "The model may be putting all output inside <think> tags, leaving nothing to parse. "
                "Try using gpt-4o, gpt-4o-mini, or gpt-4-turbo instead in your episode profile."
            )
        elif any(kw in error_msg for kw in (
            "quota", "subscription", "payment", "401", "402", "429",
            "invalid_api_key", "quota_exceeded", "insufficient", "billing",
            "insufficient_quota", "max_character_limit", "credits",
        )):
            error_msg = str(e) + (
                "\n\nThis is likely an API key or billing issue with your TTS provider "
                "(ElevenLabs, OpenAI, etc.), not a software bug. Check your provider account: "
                "verify your API key is valid and you have credits/quota remaining. "
                "ElevenLabs: elevenlabs.io/app/usage | OpenAI: platform.openai.com/usage"
            )
        else:
            error_msg = str(e)

        raise RuntimeError(error_msg) from e
