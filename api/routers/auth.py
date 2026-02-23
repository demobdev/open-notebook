"""
Authentication router for Audioprism API.
Provides endpoints to check authentication status and current user info.
"""

from fastapi import APIRouter, Request

from api.auth import get_current_user_id

router = APIRouter(prefix="/auth", tags=["auth"])


@router.get("/status")
async def get_auth_status():
    """Check authentication provider status."""
    return {
        "auth_enabled": True,
        "provider": "clerk",
        "message": "Authentication is managed by Clerk",
    }


@router.get("/me")
async def get_current_user(request: Request):
    """Return the currently authenticated user's ID from the Clerk JWT."""
    user_id = get_current_user_id(request)
    return {"user_id": user_id}
