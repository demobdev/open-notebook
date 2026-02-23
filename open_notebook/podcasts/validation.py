"""
Podcast configuration validation.

Validates episode profiles and speaker profiles for compatibility
before podcast generation starts. Catches mismatches early with
clear, actionable error messages instead of failing silently.
"""

from dataclasses import dataclass, field
from typing import List, Optional

VALID_TTS_MODELS = {
    "openai": {"tts-1", "tts-1-hd"},
    "elevenlabs": {
        "eleven_multilingual_v2",
        "eleven_turbo_v2_5",
        "eleven_flash_v2_5",
        "eleven_multilingual_v1",
        "eleven_monolingual_v1",
        "eleven_english_sts_v2",
    },
    "google": {"en-US-Casual-K", "en-US-Journey-D", "en-US-Neural2-A"},
    "vertex": set(),
}

VALID_OPENAI_VOICES = {
    "alloy", "echo", "fable", "onyx", "nova", "shimmer",
    "ash", "ballad", "coral", "sage", "verse",
}

INCOMPATIBLE_OPENAI_TTS_MODELS = {
    "gpt-4o-mini-tts",
    "gpt-4o-mini-tts-2025-12-15",
    "gpt-4o-audio-preview",
    "gpt-audio-mini-2025-12-15",
}


@dataclass
class ValidationIssue:
    level: str  # "error" or "warning"
    field: str
    message: str


@dataclass
class ValidationResult:
    issues: List[ValidationIssue] = field(default_factory=list)

    @property
    def has_errors(self) -> bool:
        return any(i.level == "error" for i in self.issues)

    @property
    def has_warnings(self) -> bool:
        return any(i.level == "warning" for i in self.issues)

    @property
    def errors(self) -> List[ValidationIssue]:
        return [i for i in self.issues if i.level == "error"]

    @property
    def warnings(self) -> List[ValidationIssue]:
        return [i for i in self.issues if i.level == "warning"]

    def error_summary(self) -> str:
        parts = []
        for issue in self.errors:
            parts.append(f"[{issue.field}] {issue.message}")
        return " | ".join(parts)

    def to_dict(self) -> dict:
        return {
            "valid": not self.has_errors,
            "errors": [
                {"field": i.field, "message": i.message} for i in self.errors
            ],
            "warnings": [
                {"field": i.field, "message": i.message} for i in self.warnings
            ],
        }


def validate_speaker_profile(profile: dict) -> ValidationResult:
    """Validate a speaker profile's TTS configuration."""
    result = ValidationResult()

    tts_provider = profile.get("tts_provider", "").lower()
    tts_model = profile.get("tts_model", "")
    speakers = profile.get("speakers", [])
    profile_name = profile.get("name", "unknown")

    if not tts_provider:
        result.issues.append(ValidationIssue(
            level="error",
            field="tts_provider",
            message=f"Speaker profile '{profile_name}' has no TTS provider set.",
        ))
        return result

    if not tts_model:
        result.issues.append(ValidationIssue(
            level="error",
            field="tts_model",
            message=f"Speaker profile '{profile_name}' has no TTS model set.",
        ))
        return result

    if tts_provider == "openai":
        if tts_model in INCOMPATIBLE_OPENAI_TTS_MODELS:
            result.issues.append(ValidationIssue(
                level="error",
                field="tts_model",
                message=(
                    f"Speaker profile '{profile_name}' uses OpenAI model "
                    f"'{tts_model}' which is a chat-audio model, not a TTS model. "
                    f"Use 'tts-1' or 'tts-1-hd' for OpenAI TTS, or switch to "
                    f"ElevenLabs (e.g. 'eleven_multilingual_v2')."
                ),
            ))

        if tts_model in VALID_TTS_MODELS.get("openai", set()):
            for i, speaker in enumerate(speakers):
                voice_id = speaker.get("voice_id", "")
                sp_override = speaker.get("tts_provider")
                if sp_override and sp_override.lower() != "openai":
                    continue
                if voice_id and voice_id not in VALID_OPENAI_VOICES:
                    result.issues.append(ValidationIssue(
                        level="error",
                        field=f"speakers[{i}].voice_id",
                        message=(
                            f"Speaker '{speaker.get('name', f'#{i}')}' has voice_id "
                            f"'{voice_id}' which is not a valid OpenAI voice. "
                            f"Valid OpenAI voices: {', '.join(sorted(VALID_OPENAI_VOICES))}. "
                            f"If this is an ElevenLabs voice ID, change the speaker profile's "
                            f"tts_provider to 'elevenlabs'."
                        ),
                    ))

    elif tts_provider == "elevenlabs":
        for i, speaker in enumerate(speakers):
            voice_id = speaker.get("voice_id", "")
            sp_override = speaker.get("tts_provider")
            if sp_override and sp_override.lower() != "elevenlabs":
                continue
            if voice_id and voice_id in VALID_OPENAI_VOICES:
                result.issues.append(ValidationIssue(
                    level="error",
                    field=f"speakers[{i}].voice_id",
                    message=(
                        f"Speaker '{speaker.get('name', f'#{i}')}' has voice_id "
                        f"'{voice_id}' which looks like an OpenAI voice name, but "
                        f"the TTS provider is set to ElevenLabs. ElevenLabs voice IDs "
                        f"are alphanumeric strings (e.g. 'wbZYPUM3zIb4exd1P7a0'). "
                        f"Either update the voice_id to a valid ElevenLabs ID, or "
                        f"change the tts_provider to 'openai' and use a compatible model."
                    ),
                ))

    if tts_provider in VALID_TTS_MODELS:
        valid_models = VALID_TTS_MODELS[tts_provider]
        if valid_models and tts_model not in valid_models and tts_model not in INCOMPATIBLE_OPENAI_TTS_MODELS:
            result.issues.append(ValidationIssue(
                level="warning",
                field="tts_model",
                message=(
                    f"TTS model '{tts_model}' is not in the known list for provider "
                    f"'{tts_provider}'. Known models: {', '.join(sorted(valid_models))}. "
                    f"Generation may fail if the model is invalid."
                ),
            ))

    if not speakers:
        result.issues.append(ValidationIssue(
            level="error",
            field="speakers",
            message=f"Speaker profile '{profile_name}' has no speakers configured.",
        ))

    return result


def validate_episode_profile(profile: dict) -> ValidationResult:
    """Validate an episode profile's LLM configuration."""
    result = ValidationResult()
    profile_name = profile.get("name", "unknown")

    for role in ("outline", "transcript"):
        model = profile.get(f"{role}_model", "")
        provider = profile.get(f"{role}_provider", "")

        if not model:
            result.issues.append(ValidationIssue(
                level="error",
                field=f"{role}_model",
                message=f"Episode profile '{profile_name}' has no {role} model set.",
            ))
        if not provider:
            result.issues.append(ValidationIssue(
                level="error",
                field=f"{role}_provider",
                message=f"Episode profile '{profile_name}' has no {role} provider set.",
            ))

    return result


def validate_podcast_config(
    episode_profile: dict,
    speaker_profile: dict,
) -> ValidationResult:
    """
    Full pre-flight validation for podcast generation.
    Returns all issues found across both profiles.
    """
    result = ValidationResult()

    ep_result = validate_episode_profile(episode_profile)
    result.issues.extend(ep_result.issues)

    sp_result = validate_speaker_profile(speaker_profile)
    result.issues.extend(sp_result.issues)

    return result
