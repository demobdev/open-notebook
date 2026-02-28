import os
import uuid
import httpx
from pathlib import Path
from loguru import logger
from surreal_commands import command, CommandInput, CommandOutput

from content_core.common import ProcessSourceState
from content_core import extract_content
from open_notebook.ai.key_provider import get_api_key
from open_notebook.config import DATA_FOLDER

class ExpressGenerationInput(CommandInput):
    type: str
    voice_id: str
    user_id: str
    input_file_path: str
    original_filename: str

class ExpressGenerationOutput(CommandOutput):
    success: bool
    audio_file_path: str
    audio_url: str
    error_message: str | None = None

@command("generate_express_audio", app="open_notebook", retry={"max_attempts": 1})
async def generate_express_command(
    input_data: ExpressGenerationInput,
) -> ExpressGenerationOutput:
    """
    Process an Express TTS/STS generation in the background.
    """
    user_id = input_data.user_id
    voice_id = input_data.voice_id
    workflow_type = input_data.type
    input_path = input_data.input_file_path
    
    # Update progress: started
    if input_data.execution_context:
        await input_data.execution_context.update_progress(0.1, "Initializing generation...")

    api_key = await get_api_key("elevenlabs")
    if not api_key:
        raise ValueError("ElevenLabs API key not configured. Add it in Settings → API Keys.")

    express_dir = Path(DATA_FOLDER) / "express" / user_id
    express_dir.mkdir(parents=True, exist_ok=True)
    
    output_filename = f"express_{uuid.uuid4()}.mp3"
    output_path = express_dir / output_filename
    
    try:
        async with httpx.AsyncClient(timeout=300.0) as client:
            headers = {
                "xi-api-key": api_key,
                "Accept": "audio/mpeg"
            }
            
            if workflow_type == "text":
                if input_data.execution_context:
                    await input_data.execution_context.update_progress(0.2, "Extracting text from document...")
                    
                # Extract text using content_core
                state = ProcessSourceState(file_path=input_path, output_format="markdown")
                extracted = await extract_content(state)
                
                if not extracted.content or not extracted.content.strip():
                    raise ValueError("Could not extract any text from the provided file.")
                
                # Truncate text for MVP to avoid token limits 
                text = extracted.content[:4500]
                
                if input_data.execution_context:
                    await input_data.execution_context.update_progress(0.5, f"Generating text-to-speech for {len(text)} characters...")
                
                logger.info(f"Generating TTS for {len(text)} characters...")
                
                tts_url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}"
                payload = {
                    "text": text,
                    "model_id": "eleven_turbo_v2_5", 
                    "voice_settings": {"stability": 0.5, "similarity_boost": 0.75}
                }
                
                response = await client.post(tts_url, headers=headers, json=payload)
                if response.status_code != 200:
                    logger.error(f"ElevenLabs TTS Error: {response.text}")
                    raise ValueError(f"TTS generation failed: {response.text}")
                    
                with open(output_path, "wb") as f:
                    f.write(response.content)

            elif workflow_type == "audio":
                if input_data.execution_context:
                    await input_data.execution_context.update_progress(0.4, "Uploading audio for speech-to-speech translation...")
                    
                logger.info("Generating STS from audio clip...")
                sts_url = f"https://api.elevenlabs.io/v1/speech-to-speech/{voice_id}"
                
                with open(input_path, "rb") as audio_file:
                    files = {
                        "audio": (input_data.original_filename, audio_file, "audio/mpeg")
                    }
                    data = {
                        "model_id": "eleven_english_sts_v2"
                    }
                    
                    response = await client.post(sts_url, headers=headers, data=data, files=files)
                    
                if response.status_code != 200:
                    logger.error(f"ElevenLabs STS Error: {response.text}")
                    raise ValueError(f"STS generation failed: {response.text}")
                    
                if input_data.execution_context:
                    await input_data.execution_context.update_progress(0.8, "Saving generated audio...")
                    
                with open(output_path, "wb") as f:
                    f.write(response.content)

            else:
                raise ValueError("Invalid workflow type. Must be 'text' or 'audio'.")

        # Clean up the temporary input file
        if os.path.exists(input_path):
            os.unlink(input_path)
            
        if input_data.execution_context:
            await input_data.execution_context.update_progress(1.0, "Generation complete!")

        audio_url = f"/api/express/audio/{user_id}/{output_filename}"
        
        return ExpressGenerationOutput(
            success=True,
            audio_file_path=str(output_path),
            audio_url=audio_url
        )

    except Exception as e:
        logger.exception("Express background generation failed")
        
        # Ensure cleanup still happens on failure
        if os.path.exists(input_path):
            try:
                os.unlink(input_path)
            except Exception:
                pass
                
        error_msg = str(e)
        if hasattr(e, "response") and hasattr(e.response, "text"):
            error_msg += f" - {e.response.text}"
            
        raise RuntimeError(error_msg) from e
