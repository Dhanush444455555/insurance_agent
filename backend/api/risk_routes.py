import logging
from fastapi import APIRouter, HTTPException, status
from backend.schemas.risk import RiskAnalysisRequest, RiskAnalysisResponse
from backend.risk_engine.risk_calculator import calculate_risk

logger = logging.getLogger(__name__)

router = APIRouter(tags=["Risk Analysis"])


@router.post(
    "/analyze-risk",
    response_model=RiskAnalysisResponse,
    status_code=status.HTTP_200_OK,
    summary="Analyze Insurance Risk Profile",
    description="Calculates deterministic risk scores (0-100), risk levels (LOW/MEDIUM/HIGH), "
                "and explainable risk factors across HEALTH, AUTOMOBILE, and LIFE insurance lines.",
)
def analyze_risk_endpoint(request: RiskAnalysisRequest) -> RiskAnalysisResponse:
    """Analyze customer risk profile based on transparent business rules.

    The numerical score is computed purely deterministically without LLM intervention.
    """
    try:
        response = calculate_risk(request)
        return response
    except ValueError as val_err:
        logger.warning(f"Validation error in risk analysis: {val_err}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(val_err)
        )
    except Exception as exc:
        logger.error(f"Unexpected error in risk calculation: {exc}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while calculating the risk profile."
        )
