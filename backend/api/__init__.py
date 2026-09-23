from backend.api.health_routes import router as health_router
from backend.api.risk_routes import router as risk_router
from backend.api.recommendation_routes import router as recommendation_router

__all__ = [
    "health_router",
    "risk_router",
    "recommendation_router",
]
