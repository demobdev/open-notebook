import asyncio
import os
import uuid
from pathlib import Path

from fastapi import APIRouter, File, Form, HTTPException, Request, UploadFile
from fastapi.responses import JSONResponse
from loguru import logger
from surreal_commands import get_command_status, submit_command

from api.auth import get_current_user_id
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
    Handle express generation for TTS or STS workflows asynchronously.
    Returns a job_id for polling.
    """
    user_id = get_current_user_id(request)

    if not file:
        raise HTTPException(status_code=400, detail="A file is required for express generation.")
        
    logger.info(f"Received express {type} request from user {user_id} with voice {voice_id}")

    # Save input temporarily for the background worker to process
    input_path = await save_uploaded_file(file)
    
    try:
        # Import dynamically to ensure the module is registered before submission
        try:
            import commands.express_commands  # noqa: F401
        except ImportError as e:
            logger.error(f"Failed to import express commands: {e}")
            raise HTTPException(status_code=500, detail="Background worker disconnected")

        command_args = {
            "type": type,
            "voice_id": voice_id,
            "user_id": user_id,
            "input_file_path": input_path,
            "original_filename": file.filename or "unknown"
        }
        
        job_id = submit_command("open_notebook", "generate_express_audio", command_args)
        
        if not job_id:
            raise ValueError("Failed to obtain job ID from worker queue")
            
        return {
            "status": "success",
            "job_id": str(job_id),
            "message": "Generation task scheduled in the background."
        }

    except Exception as e:
        logger.exception("Express job submission failed")
        if os.path.exists(input_path):
            os.unlink(input_path)
            
        if isinstance(e, HTTPException):
            raise
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/express/jobs/{job_id}")
async def get_express_job_status(request: Request, job_id: str):
    """
    Get the status of an express generation job.
    """
    # ensure user is logged in
    get_current_user_id(request)
    
    try:
        status = await get_command_status(job_id)
        if not status:
            return {"job_id": job_id, "status": "unknown"}
            
        return {
            "job_id": job_id,
            "status": status.status,
            "result": status.result,
            "error_message": getattr(status, "error_message", None),
            "progress": getattr(status, "progress", None)
        }
    except Exception as e:
        import traceback
        traceback.print_exc()
        logger.error(f"Failed to fetch express job status: {e}")
        raise HTTPException(status_code=500, detail="Could not retrieve job status")


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
