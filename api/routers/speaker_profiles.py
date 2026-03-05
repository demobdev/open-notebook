from typing import Any, Dict, List, Optional

from fastapi import APIRouter, HTTPException, Request
from loguru import logger
from pydantic import BaseModel, Field

from api.auth import check_owner, get_current_user_id, is_admin
from open_notebook.podcasts.models import SpeakerProfile

router = APIRouter()


class SpeakerProfileResponse(BaseModel):
    id: str
    name: str
    description: str
    voice_model: Optional[str] = None
    speakers: List[Dict[str, Any]]
    # Legacy fields
    tts_provider: Optional[str] = None
    tts_model: Optional[str] = None


def _profile_to_response(profile: SpeakerProfile) -> SpeakerProfileResponse:
    return SpeakerProfileResponse(
        id=str(profile.id),
        name=profile.name,
        description=profile.description or "",
        voice_model=str(profile.voice_model) if profile.voice_model else None,
        speakers=profile.speakers,
        tts_provider=profile.tts_provider,
        tts_model=profile.tts_model,
    )


@router.get("/speaker-profiles", response_model=List[SpeakerProfileResponse])
async def list_speaker_profiles(request: Request):
    """List all available speaker profiles"""
    user_id = get_current_user_id(request)
    try:
        profiles = await SpeakerProfile.get_all(
            order_by="name asc", user_id=user_id
        )

        return [_profile_to_response(p) for p in profiles]

    except Exception as e:
        logger.error(f"Failed to fetch speaker profiles: {e}")
        raise HTTPException(
            status_code=500, detail="Failed to fetch speaker profiles"
        )


@router.get("/speaker-profiles/{profile_name}", response_model=SpeakerProfileResponse)
async def get_speaker_profile(request: Request, profile_name: str):
    """Get a specific speaker profile by name"""
    user_id = get_current_user_id(request)
    try:
        profile = await SpeakerProfile.get_by_name(profile_name)

        if not profile:
            raise HTTPException(
                status_code=404, detail=f"Speaker profile '{profile_name}' not found"
            )

        check_owner(user_id, profile)

        return _profile_to_response(profile)

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to fetch speaker profile '{profile_name}': {e}")
        raise HTTPException(
            status_code=500, detail="Failed to fetch speaker profile"
        )


class SpeakerProfileCreate(BaseModel):
    name: str = Field(..., description="Unique profile name")
    description: str = Field("", description="Profile description")
    voice_model: Optional[str] = Field(None, description="Model record ID for TTS")
    speakers: List[Dict[str, Any]] = Field(
        ..., description="Array of speaker configurations"
    )

    # Legacy fields (accepted but not required)
    tts_provider: Optional[str] = None
    tts_model: Optional[str] = None


@router.post("/speaker-profiles", response_model=SpeakerProfileResponse)
async def create_speaker_profile(request: Request, profile_data: SpeakerProfileCreate):
    """Create a new speaker profile"""
    user_id = get_current_user_id(request)
    try:
        profile = SpeakerProfile(
            name=profile_data.name,
            description=profile_data.description,
            voice_model=profile_data.voice_model,
            tts_provider=profile_data.tts_provider,
            tts_model=profile_data.tts_model,
            speakers=profile_data.speakers,
            user_id=user_id,
        )

        await profile.save()
        return _profile_to_response(profile)

    except Exception as e:
        logger.error(f"Failed to create speaker profile: {e}")
        raise HTTPException(
            status_code=500, detail="Failed to create speaker profile"
        )


@router.put("/speaker-profiles/{profile_id}", response_model=SpeakerProfileResponse)
async def update_speaker_profile(
    request: Request, profile_id: str, profile_data: SpeakerProfileCreate
):
    """Update an existing speaker profile"""
    user_id = get_current_user_id(request)
    try:
        profile = await SpeakerProfile.get(profile_id)

        if not profile:
            raise HTTPException(
                status_code=404, detail=f"Speaker profile '{profile_id}' not found"
            )

        check_owner(user_id, profile)

        # Update fields
        profile.name = profile_data.name
        profile.description = profile_data.description
        profile.voice_model = profile_data.voice_model
        profile.tts_provider = profile_data.tts_provider
        profile.tts_model = profile_data.tts_model
        profile.speakers = profile_data.speakers

        await profile.save()
        return _profile_to_response(profile)

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to update speaker profile: {e}")
        raise HTTPException(
            status_code=500, detail="Failed to update speaker profile"
        )


@router.delete("/speaker-profiles/{profile_id}")
async def delete_speaker_profile(request: Request, profile_id: str):
    """Delete a speaker profile"""
    user_id = get_current_user_id(request)
    try:
        profile = await SpeakerProfile.get(profile_id)

        if not profile:
            raise HTTPException(
                status_code=404, detail=f"Speaker profile '{profile_id}' not found"
            )

        check_owner(user_id, profile)

        await profile.delete()

        return {"message": "Speaker profile deleted successfully"}

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to delete speaker profile: {e}")
        raise HTTPException(
            status_code=500, detail="Failed to delete speaker profile"
        )


@router.post(
    "/speaker-profiles/{profile_id}/duplicate", response_model=SpeakerProfileResponse
)
async def duplicate_speaker_profile(request: Request, profile_id: str):
    """Duplicate a speaker profile"""
    user_id = get_current_user_id(request)
    try:
        original = await SpeakerProfile.get(profile_id)

        if not original:
            raise HTTPException(
                status_code=404, detail=f"Speaker profile '{profile_id}' not found"
            )

        check_owner(user_id, original)

        # Create duplicate with modified name
        duplicate = SpeakerProfile(
            name=f"{original.name} - Copy",
            description=original.description,
            voice_model=original.voice_model,
            tts_provider=original.tts_provider,
            tts_model=original.tts_model,
            speakers=original.speakers,
            user_id=user_id,
        )

        await duplicate.save()
        return _profile_to_response(duplicate)

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to duplicate speaker profile: {e}")
        raise HTTPException(
            status_code=500, detail="Failed to duplicate speaker profile"
        )
