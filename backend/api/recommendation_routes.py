from fastapi import APIRouter

router = APIRouter(prefix="/recommendations", tags=["Recommendations"])


@router.get("/status")
def recommendation_status():
    """Placeholder endpoint for policy recommendations service."""
    return {"status": "ready", "service": "Recommendations API"}
