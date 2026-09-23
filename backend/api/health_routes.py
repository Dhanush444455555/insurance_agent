from datetime import datetime, timezone
from fastapi import APIRouter

router = APIRouter(tags=["Health"])


@router.get("/health", summary="Service Health Status")
def health_check():
    """System health check endpoint returning operational status and current timestamp."""
    return {
        "status": "ok",
        "service": "Insurance Risk AI Backend",
        "version": "1.0.0",
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }
