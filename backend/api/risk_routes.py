import logging
from typing import List, Dict, Optional
from pydantic import BaseModel
from fastapi import APIRouter, HTTPException, status
from backend.schemas.risk import RiskAnalysisRequest, RiskAnalysisResponse
from backend.risk_engine.risk_calculator import calculate_risk
from backend.agents.chat_assistant import ask_insurance_chat

logger = logging.getLogger(__name__)

router = APIRouter(tags=["Risk Analysis & AI Assistant"])


class ChatMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    message: str
    history: Optional[List[ChatMessage]] = []


class ChatResponse(BaseModel):
    reply: str


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


@router.post(
    "/chat",
    response_model=ChatResponse,
    status_code=status.HTTP_200_OK,
    summary="AI Insurance Copilot Chat",
    description="Interactive AI Assistant answering user questions grounded in RAG underwriting guidelines."
)
def chat_assistant_endpoint(request: ChatRequest) -> ChatResponse:
    try:
        history_dicts = [{"role": m.role, "content": m.content} for m in request.history] if request.history else []
        reply_text = ask_insurance_chat(message=request.message, history=history_dicts)
        return ChatResponse(reply=reply_text)
    except Exception as exc:
        logger.error(f"Error in chat assistant: {exc}", exc_info=True)
        return ChatResponse(reply="I am here to help! Feel free to ask about Health, Auto, or Life insurance guidelines.")
