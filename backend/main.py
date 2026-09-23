"""Main FastAPI Application Entry Point.

Insurance Risk AI Platform - Automated Multi-Line Risk Profile Summarizer.
Supports:
- HEALTH Insurance
- AUTOMOBILE Insurance
- LIFE Insurance
"""

import os
import sys

# Ensure repository root is in sys.path regardless of execution directory
REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if REPO_ROOT not in sys.path:
    sys.path.insert(0, REPO_ROOT)

import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.api.health_routes import router as health_router
from backend.api.risk_routes import router as risk_router
from backend.api.recommendation_routes import router as recommendation_router

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("insurance_agent.backend")

# Initialize FastAPI application
app = FastAPI(
    title="Insurance Risk AI Platform",
    description="Automated Insurance Risk Profile Summarizer API supporting Health, Automobile, and Life Insurance.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
)

# Enable Cross-Origin Resource Sharing (CORS) for React + Vite frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows frontend on localhost:5173, 3000, or any domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API routers under /api prefix
app.include_router(health_router, prefix="/api")
app.include_router(risk_router, prefix="/api")
app.include_router(recommendation_router, prefix="/api")


# Convenience root & health routes
@app.get("/", tags=["Root"])
def root():
    """Root welcoming endpoint with platform information and documentation links."""
    return {
        "message": "Welcome to the Insurance Risk AI Platform API",
        "documentation": "/docs",
        "endpoints": {
            "health": "/api/health",
            "analyze_risk": "/api/analyze-risk",
        },
        "supported_insurance_types": ["HEALTH", "AUTOMOBILE", "LIFE"],
    }


@app.get("/health", tags=["Health"], include_in_schema=False)
def root_health():
    """Convenience alias for /api/health."""
    return {
        "status": "ok",
        "service": "Insurance Risk AI Backend",
        "version": "1.0.0",
    }


if __name__ == "__main__":
    import uvicorn
    logger.info("Starting Insurance Risk AI Backend on http://127.0.0.1:8000")
    uvicorn.run(app, host="127.0.0.1", port=8000)
