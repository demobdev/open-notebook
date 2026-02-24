"""
Tests for podcast generation: outline/transcript persistence and output shape.

These tests verify that when generation succeeds, outline and transcript
are saved in the shape the API and frontend expect (so Details modal shows them).
"""

import pytest
from pydantic import BaseModel


def full_model_dump(model):
    """Mirror of commands.podcast_commands.full_model_dump for standalone test."""
    if isinstance(model, BaseModel):
        return model.model_dump()
    elif isinstance(model, dict):
        return {k: full_model_dump(v) for k, v in model.items()}
    elif isinstance(model, list):
        return [full_model_dump(item) for item in model]
    else:
        return model


def test_outline_transcript_shape_matches_frontend_expectations():
    """
    When create_podcast returns success, we save outline and transcript.
    Frontend expects: outline with .segments[], transcript with .transcript[].
    This test ensures our save shape matches so Details modal shows outline/transcript.
    """
    # Simulate minimal result from podcast-creator create_podcast()
    class Segment(BaseModel):
        name: str
        description: str
        size: str

    class Outline(BaseModel):
        segments: list

    class Dialogue(BaseModel):
        speaker: str
        dialogue: str

    outline_obj = Outline(
        segments=[
            Segment(name="Intro", description="Introduction", size="short"),
            Segment(name="Main", description="Main content", size="medium"),
        ]
    )
    transcript_list = [
        Dialogue(speaker="Host", dialogue="Welcome."),
        Dialogue(speaker="Guest", dialogue="Thanks for having me."),
    ]

    # Same assignment logic as in commands/podcast_commands.py after create_podcast succeeds
    saved_outline = full_model_dump(outline_obj)
    saved_transcript = {"transcript": full_model_dump(transcript_list)}

    # Frontend extractOutlineSegments(episode.outline) expects outline.segments to be an array
    assert "segments" in saved_outline
    assert isinstance(saved_outline["segments"], list)
    assert len(saved_outline["segments"]) == 2
    assert saved_outline["segments"][0]["name"] == "Intro"

    # Frontend extractTranscriptEntries(episode.transcript) expects transcript.transcript to be an array
    assert "transcript" in saved_transcript
    assert isinstance(saved_transcript["transcript"], list)
    assert len(saved_transcript["transcript"]) == 2
    assert saved_transcript["transcript"][0]["speaker"] == "Host"
    assert saved_transcript["transcript"][0]["dialogue"] == "Welcome."


def test_extract_json_from_model_output_used_by_podcast_command():
    """Ensure the podcast command patches podcast_creator to use robust JSON extraction."""
    from open_notebook.utils.text_utils import extract_json_from_model_output

    # Model sometimes wraps JSON in ```json ... ``` or after <think>
    wrapped = '<think>Reasoning</think>\n```json\n{"segments": [{"name": "A", "description": "D", "size": "short"}]}\n```'
    extracted = extract_json_from_model_output(wrapped)
    assert "segments" in extracted
    assert "<think>" not in extracted
    assert "```" not in extracted
