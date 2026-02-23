from fastapi import APIRouter, HTTPException, Request
from loguru import logger

from api.auth import check_owner, get_current_user_id, is_admin
from api.models import NoteResponse, SaveAsNoteRequest, SourceInsightResponse
from open_notebook.domain.notebook import SourceInsight
from open_notebook.exceptions import InvalidInputError

router = APIRouter()


@router.get("/insights/{insight_id}", response_model=SourceInsightResponse)
async def get_insight(request: Request, insight_id: str):
    """Get a specific insight by ID."""
    try:
        user_id = get_current_user_id(request)
        insight = await SourceInsight.get(insight_id)
        if not insight:
            raise HTTPException(status_code=404, detail="Insight not found")

        # Insights inherit ownership from parent source
        source = await insight.get_source()
        check_owner(user_id, source)

        return SourceInsightResponse(
            id=insight.id or "",
            source_id=source.id or "",
            insight_type=insight.insight_type,
            content=insight.content,
            created=str(insight.created),
            updated=str(insight.updated),
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching insight {insight_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Error fetching insight")


@router.delete("/insights/{insight_id}")
async def delete_insight(request: Request, insight_id: str):
    """Delete a specific insight."""
    try:
        user_id = get_current_user_id(request)
        insight = await SourceInsight.get(insight_id)
        if not insight:
            raise HTTPException(status_code=404, detail="Insight not found")

        # Insights inherit ownership from parent source
        source = await insight.get_source()
        check_owner(user_id, source)

        await insight.delete()

        return {"message": "Insight deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting insight {insight_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Error deleting insight")


@router.post("/insights/{insight_id}/save-as-note", response_model=NoteResponse)
async def save_insight_as_note(
    request: Request, insight_id: str, body: SaveAsNoteRequest
):
    """Convert an insight to a note."""
    try:
        user_id = get_current_user_id(request)
        insight = await SourceInsight.get(insight_id)
        if not insight:
            raise HTTPException(status_code=404, detail="Insight not found")

        # Insights inherit ownership from parent source
        source = await insight.get_source()
        check_owner(user_id, source)

        # Use the existing save_as_note method from the domain model
        note = await insight.save_as_note(body.notebook_id)

        return NoteResponse(
            id=note.id or "",
            title=note.title,
            content=note.content,
            note_type=note.note_type,
            created=str(note.created),
            updated=str(note.updated),
        )
    except HTTPException:
        raise
    except InvalidInputError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Error saving insight {insight_id} as note: {str(e)}")
        raise HTTPException(
            status_code=500, detail="Error saving insight as note"
        )
