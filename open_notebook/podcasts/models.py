from typing import Any, ClassVar, Dict, List, Optional, Union

from pydantic import ConfigDict, Field, field_validator
from surrealdb import RecordID

from open_notebook.database.repository import ensure_record_id, repo_query
from open_notebook.domain.base import ObjectModel


class EpisodeProfile(ObjectModel):
    """
    Episode Profile - Simplified podcast configuration.
    Replaces complex 15+ field configuration with user-friendly profiles.
    """

    table_name: ClassVar[str] = "episode_profile"
    mixed_ownership: ClassVar[bool] = True

    name: str = Field(..., description="Unique profile name")
    description: Optional[str] = Field(None, description="Profile description")
    speaker_config: str = Field(..., description="Reference to speaker profile name")
    outline_llm: Optional[Union[str, RecordID]] = Field(None, description="Model record ID for outline")
    transcript_llm: Optional[Union[str, RecordID]] = Field(
        None, description="Model record ID for transcript"
    )
    language: Optional[str] = Field(None, description="Podcast language code (BCP 47)")
    default_briefing: str = Field(..., description="Default briefing template")
    num_segments: int = Field(default=5, description="Number of podcast segments")

    # Legacy fields (for migration)
    outline_provider: Optional[str] = Field(None, description="Legacy outline provider")
    outline_model: Optional[str] = Field(None, description="Legacy outline model")
    transcript_provider: Optional[str] = Field(
        None, description="Legacy transcript provider"
    )
    transcript_model: Optional[str] = Field(None, description="Legacy transcript model")

    model_config = ConfigDict(arbitrary_types_allowed=True)

    @field_validator("num_segments")
    @classmethod
    def validate_segments(cls, v):
        if not 3 <= v <= 20:
            raise ValueError("Number of segments must be between 3 and 20")
        return v

    @field_validator("outline_llm", "transcript_llm", mode="before")
    @classmethod
    def parse_llm_records(cls, v):
        if isinstance(v, str) and v:
            return ensure_record_id(v)
        return v

    async def resolve_outline_config(self):
        """Resolve outline model to provider, name and credentials"""
        if not self.outline_llm:
            return None, None, None
        return await _resolve_model_config(str(self.outline_llm))

    async def resolve_transcript_config(self):
        """Resolve transcript model to provider, name and credentials"""
        if not self.transcript_llm:
            return None, None, None
        return await _resolve_model_config(str(self.transcript_llm))

    def _prepare_save_data(self) -> dict:
        """Override to ensure LLM fields are RecordID format for database"""
        from loguru import logger
        data = super()._prepare_save_data()
        
        for field in ["outline_llm", "transcript_llm"]:
            val = data.get(field)
            if val and isinstance(val, str) and ":" in val:
                logger.debug(f"Converting {field} to RecordID: {val}")
                data[field] = ensure_record_id(val)
            elif val:
                logger.debug(f"Field {field} is already {type(val)}: {val}")
        return data

    @classmethod
    async def get_by_name(cls, name: str) -> Optional["EpisodeProfile"]:
        """Get episode profile by name"""
        result = await repo_query(
            "SELECT * FROM episode_profile WHERE name = $name", {"name": name}
        )
        if result:
            return cls(**result[0])
        return None


class SpeakerProfile(ObjectModel):
    """
    Speaker Profile - Voice and personality configuration.
    Supports 1-4 speakers for flexible podcast formats.
    """

    table_name: ClassVar[str] = "speaker_profile"
    mixed_ownership: ClassVar[bool] = True

    name: str = Field(..., description="Unique profile name")
    description: Optional[str] = Field(None, description="Profile description")
    voice_model: Optional[Union[str, RecordID]] = Field(None, description="Model record ID for TTS")
    speakers: List[Dict[str, Any]] = Field(
        ..., description="Array of speaker configurations"
    )

    # Legacy fields (for migration)
    tts_provider: Optional[str] = Field(None, description="Legacy TTS provider")
    tts_model: Optional[str] = Field(None, description="Legacy tts model")

    model_config = ConfigDict(arbitrary_types_allowed=True)

    @field_validator("voice_model", mode="before")
    @classmethod
    def parse_voice_model(cls, v):
        if isinstance(v, str) and v:
            return ensure_record_id(v)
        return v

    @field_validator("speakers", mode="before")
    @classmethod
    def validate_speakers(cls, v):
        if not isinstance(v, list):
            return v
        if not 1 <= len(v) <= 4:
            raise ValueError("Must have between 1 and 4 speakers")

        required_fields = ["name", "voice_id", "backstory", "personality"]
        for speaker in v:
            for field in required_fields:
                if field not in speaker:
                    raise ValueError(f"Speaker missing required field: {field}")
            # Ensure voice_id is a RecordID if it looks like one
            if "voice_id" in speaker and speaker["voice_id"] and ":" in str(speaker["voice_id"]):
                 speaker["voice_id"] = ensure_record_id(speaker["voice_id"])
        return v

    async def resolve_tts_config(self):
        """Resolve TTS model to provider, name and credentials"""
        if not self.voice_model:
            return None, None, None
        return await _resolve_model_config(str(self.voice_model))

    @classmethod
    async def get_by_name(cls, name: str) -> Optional["SpeakerProfile"]:
        """Get speaker profile by name"""
        result = await repo_query(
            "SELECT * FROM speaker_profile WHERE name = $name", {"name": name}
        )
        if result:
            return cls(**result[0])
        return None

    def _prepare_save_data(self) -> dict:
        """Override to ensure voice_model and speakers are RecordID format for database"""
        from loguru import logger
        data = super()._prepare_save_data()
        
        vm = data.get("voice_model")
        if vm and isinstance(vm, str) and ":" in vm:
            logger.debug(f"Converting voice_model to RecordID: {vm}")
            data["voice_model"] = ensure_record_id(vm)
            
        if data.get("speakers"):
            for i, speaker in enumerate(data["speakers"]):
                vid = speaker.get("voice_id")
                if vid and isinstance(vid, str) and ":" in vid:
                    logger.debug(f"Converting speaker {i} voice_id to RecordID: {vid}")
                    speaker["voice_id"] = ensure_record_id(vid)
        return data


async def _resolve_model_config(model_id: str):
    """Resolve model record ID to provider, name and credentials"""
    try:
        from open_notebook.ai.models import Model

        model = await Model.get(model_id)
        if not model:
            raise ValueError(f"Model '{model_id}' not found in registry")

        # Get credentials for this provider
        from open_notebook.domain.credential import Credential

        creds = await Credential.get_by_provider(model.provider)
        # credentials should be extracted from the first valid credential
        creds_data = creds[0].to_esperanto_config() if creds else {}

        return model.provider, model.name, creds_data
    except Exception as e:
        from loguru import logger

        logger.error(f"Failed to resolve model config for {model_id}: {e}")
        raise


class PodcastEpisode(ObjectModel):
    """Enhanced PodcastEpisode with job tracking and metadata"""

    table_name: ClassVar[str] = "episode"
    user_owned: ClassVar[bool] = True

    name: str = Field(..., description="Episode name")
    episode_profile: Dict[str, Any] = Field(
        ..., description="Episode profile used (stored as object)"
    )
    speaker_profile: Dict[str, Any] = Field(
        ..., description="Speaker profile used (stored as object)"
    )
    briefing: str = Field(..., description="Full briefing used for generation")
    content: str = Field(..., description="Source content")
    audio_file: Optional[str] = Field(
        default=None, description="Path to generated audio file"
    )
    transcript: Optional[Dict[str, Any]] = Field(
        default_factory=dict, description="Generated transcript"
    )
    outline: Optional[Dict[str, Any]] = Field(
        default_factory=dict, description="Generated outline"
    )
    command: Optional[Union[str, RecordID]] = Field(
        default=None, description="Link to surreal-commands job"
    )

    model_config = ConfigDict(arbitrary_types_allowed=True)

    async def get_job_status(self) -> Optional[str]:
        """Get the status of the associated command"""
        if not self.command:
            return None

        try:
            from surreal_commands import get_command_status

            status = await get_command_status(str(self.command))
            return status.status if status else "unknown"
        except Exception:
            return "unknown"

    async def get_job_detail(self) -> dict:
        """Get status and error_message of the associated command"""
        if not self.command:
            return {"status": None, "error_message": None}

        try:
            from surreal_commands import get_command_status

            status = await get_command_status(str(self.command))
            if not status:
                return {"status": "unknown", "error_message": None}
            return {
                "status": status.status,
                "error_message": getattr(status, "error_message", None),
            }
        except Exception:
            return {"status": "unknown", "error_message": None}

    @field_validator("command", mode="before")
    @classmethod
    def parse_command(cls, value):
        if isinstance(value, str):
            return ensure_record_id(value)
        return value

    def _prepare_save_data(self) -> dict:
        """Override to ensure command field is always RecordID format for database"""
        data = super()._prepare_save_data()

        # Ensure command field is RecordID format if not None
        if data.get("command") is not None:
            data["command"] = ensure_record_id(data["command"])

        return data
