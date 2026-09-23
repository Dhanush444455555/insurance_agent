"""Risk Calculator Service.

Orchestrates deterministic rule evaluations across all insurance lines
(HEALTH, AUTOMOBILE, LIFE). Designed for direct use by FastAPI routes
and downstream modules (e.g., LangGraph agents, RAG, ML modules).
"""

import logging
from typing import Dict, Any
from backend.schemas.risk import (
    RiskAnalysisRequest,
    RiskAnalysisResponse,
    InsuranceType,
    RiskLevel,
)
from backend.risk_engine.risk_rules import (
    evaluate_health_risk,
    evaluate_automobile_risk,
    evaluate_life_risk,
)

logger = logging.getLogger(__name__)


def calculate_risk(request: RiskAnalysisRequest) -> RiskAnalysisResponse:
    """Calculate deterministic risk score, level, and factors for a customer request.

    Args:
        request: Validated RiskAnalysisRequest instance containing customer demographics,
                 financials, and type-specific insurance parameters.

    Returns:
        RiskAnalysisResponse: Standardized response with score (0-100), level (LOW/MEDIUM/HIGH),
                              and explainable risk factors.
    """
    # Normalize insurance type string or enum
    raw_type = request.insurance_type
    if isinstance(raw_type, InsuranceType):
        insurance_type = raw_type
    else:
        insurance_type = InsuranceType(str(raw_type).upper())

    logger.info(
        f"Processing risk analysis: customer={request.customer_id}, type={insurance_type}"
    )

    if insurance_type == InsuranceType.HEALTH:
        score, level, factors, details = evaluate_health_risk(request)
    elif insurance_type == InsuranceType.AUTOMOBILE:
        score, level, factors, details = evaluate_automobile_risk(request)
    elif insurance_type == InsuranceType.LIFE:
        score, level, factors, details = evaluate_life_risk(request)
    else:
        raise ValueError(f"Unsupported insurance type: {insurance_type}")

    return RiskAnalysisResponse(
        customer_id=request.customer_id,
        insurance_type=insurance_type,
        risk_score=score,
        risk_level=level,
        risk_factors=factors,
        details=details,
    )
