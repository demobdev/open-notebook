import asyncio
import os
import uuid
from pathlib import Path

import httpx
from fastapi import APIRouter, File, Form, HTTPException, Request, UploadFile
from fastapi.responses import JSONResponse
from loguru import logger

from api.auth import get_current_user_id
from content_core.common import ProcessSourceState
from content_core import extract_content
from open_notebook.ai.key_provider import get_api_key
from open_notebook.config import DATA_FOLDER, UPLOADS_FOLDER

router = APIRouter()


async def save_uploaded_file(upload_file: UploadFile, prefix="express_") -> str:
    """Save uploaded file to uploads folder and return file path."""
    if not upload_file.filename:
        upload_file.filename = "unknown_file.bin"

    file_path = Path(UPLOADS_FOLDER) / f"{prefix}{uuid.uuid4()}_{upload_file.filename}"
    file_path.parent.mkdir(parents=True, exist_ok=True)

    with open(file_path, "wb") as f:
        content = await upload_file.read()
        f.write(content)
        
    # Reset file pointer for subsequent reads if necessary
    await upload_file.seek(0)
    return str(file_path)


@router.post("/express/generate")
async def generate_express_audio(
    request: Request,
    type: str = Form(...),
    voice_id: str = Form(...),
    file: UploadFile = File(None),
):
    """
    Handle express generation for TTS or STS workflows.
    Returns the URL to the generated audio file.
    """
    user_id = get_current_user_id(request)

    if not file:
        raise HTTPException(status_code=400, detail="A file is required for express generation.")
        
    api_key = await get_api_key("elevenlabs")
    if not api_key:
        raise HTTPException(
            status_code=400, 
            detail="ElevenLabs API key not configured. Please add it in Settings → API Keys."
        )

    logger.info(f"Received express {type} request from user {user_id} with voice {voice_id}")

    # Output directory for express files
    express_dir = Path(DATA_FOLDER) / "express" / str(user_id)
    express_dir.mkdir(parents=True, exist_ok=True)
    
    output_filename = f"express_{uuid.uuid4()}.mp3"
    output_path = express_dir / output_filename
    
    file_bytes = await file.read()
    
    try:
        async with httpx.AsyncClient(timeout=120.0) as client:
            headers = {
                "xi-api-key": api_key,
                "Accept": "audio/mpeg"
            }
            
            if type == "text":
                # Save input temporarily for extraction
                input_path = await save_uploaded_file(file)
                
                # Extract text using content_core
                state = ProcessSourceState(file_path=input_path, output_format="markdown")
                extracted = await extract_content(state)
                
                if not extracted.content or not extracted.content.strip():
                    raise HTTPException(status_code=400, detail="Could not extract text from the provided file.")
                
                # Truncate text for MVP to avoid token limits (ElevenLabs is usually 5000 chars per API call on lower tiers)
                text = extracted.content[:4500] 
                
                logger.info(f"Generating TTS for {len(text)} characters...")
                
                # ElevenLabs TTS API
                tts_url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}"
                payload = {
                    "text": text,
                    "model_id": "eleven_turbo_v2_5", 
                    "voice_settings": {"stability": 0.5, "similarity_boost": 0.75}
                }
                
                response = await client.post(tts_url, headers=headers, json=payload)
                if response.status_code != 200:
                    logger.error(f"ElevenLabs TTS Error: {response.text}")
                    raise HTTPException(status_code=500, detail=f"TTS generation failed: {response.text}")
                    
                with open(output_path, "wb") as f:
                    f.write(response.content)
                    
                # Clean up extracted temp file
                if os.path.exists(input_path):
                    os.unlink(input_path)

            elif type == "audio":
                logger.info("Generating STS from audio clip...")
                
                # ElevenLabs STS API
                sts_url = f"https://api.elevenlabs.io/v1/speech-to-speech/{voice_id}"
                
                files = {
                    "audio": (file.filename, file_bytes, file.content_type or "audio/mpeg")
                }
                data = {
                    "model_id": "eleven_english_sts_v2"
                }
                
                response = await client.post(sts_url, headers=headers, data=data, files=files)
                if response.status_code != 200:
                    logger.error(f"ElevenLabs STS Error: {response.text}")
                    raise HTTPException(status_code=500, detail=f"STS generation failed: {response.text}")
                    
                with open(output_path, "wb") as f:
                    f.write(response.content)

            else:
                raise HTTPException(status_code=400, detail="Invalid workflow type. Must be 'text' or 'audio'.")

        logger.info(f"Successfully generated Express audio: {output_path}")
        
        # We need an endpoint to serve this file to the frontend, but we'll return the location for now
        # Creating a static download URL mechanism might be needed, or serving the file directly.
        # Let's return the relative URL if we have an endpoint for it, or just return the audio inline?
        # A common pattern is /api/express/download/{filename}?user_id=...
        
        return {
            "status": "success",
            "message": f"Successfully generated {type} audio.",
            "audio_url": f"/api/express/audio/{user_id}/{output_filename}"
        }
        
    except httpx.RequestError as e:
        logger.error(f"Network error communicating with ElevenLabs: {e}")
        raise HTTPException(status_code=500, detail="Network error communicating with Voice provider.")
    except Exception as e:
        logger.exception("Express generation failed")
        if isinstance(e, HTTPException):
            raise
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/express/audio/{user_id}/{filename}")
async def get_express_audio(request: Request, user_id: str, filename: str):
    """
    Serve the generated express audio file.
    """
    from fastapi.responses import FileResponse
    current_user_id = get_current_user_id(request)
    
    if current_user_id != user_id:
        raise HTTPException(status_code=403, detail="Unauthorized access to this file.")
        
    file_path = Path(DATA_FOLDER) / "express" / user_id / filename
    
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="Audio file not found.")
        
    return FileResponse(
        path=str(file_path),
        filename=filename,
        media_type="audio/mpeg"
    )
