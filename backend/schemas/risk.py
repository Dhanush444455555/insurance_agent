from enum import Enum
from typing import List, Optional, Any, Dict, Union
from pydantic import BaseModel, Field, ConfigDict


class InsuranceType(str, Enum):
    HEALTH = "HEALTH"
    AUTOMOBILE = "AUTOMOBILE"
    LIFE = "LIFE"


class RiskLevel(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"


class RiskAnalysisRequest(BaseModel):
    model_config = ConfigDict(extra="allow", use_enum_values=True)

    # Core required identifiers
    customer_id: str = Field(..., description="Unique customer identifier", example="C1001")
    insurance_type: InsuranceType = Field(..., description="Type of insurance: HEALTH, AUTOMOBILE, or LIFE", example="HEALTH")

    # Common financial and demographic profile fields
    age: Optional[int] = Field(None, ge=0, le=120, description="Customer age in years", example=42)
    income: Optional[float] = Field(None, ge=0, description="Annual income of the customer", example=800000.0)
    claims_count: Optional[int] = Field(0, ge=0, description="Total number of past claims filed", example=3)
    total_claim_amount: Optional[float] = Field(0.0, ge=0, description="Aggregate monetary value of past claims", example=450000.0)
    coverage_amount: Optional[float] = Field(0.0, ge=0, description="Requested or existing policy coverage amount", example=1000000.0)

    # Health-specific parameters
    previous_claim_history: Optional[Union[str, int, bool]] = Field(
        None, 
        description="Summary flag or description of past health claims",
        example="Frequent hospitalization"
    )
    pre_existing_conditions: Optional[List[str]] = Field(
        default_factory=list, 
        description="List of diagnosed pre-existing chronic conditions",
        example=["Hypertension"]
    )
    smoking_status: Optional[Union[str, bool]] = Field(
        None, 
        description="Whether customer smokes or tobacco consumption status",
        example=False
    )
    bmi: Optional[float] = Field(None, ge=10, le=60, description="Body Mass Index", example=26.4)

    # Automobile-specific parameters
    vehicle_age: Optional[int] = Field(None, ge=0, le=50, description="Age of the vehicle in years", example=5)
    vehicle_value: Optional[float] = Field(None, ge=0, description="Market value or insured declared value of vehicle", example=650000.0)
    accident_count: Optional[int] = Field(0, ge=0, description="Number of past traffic accidents recorded", example=1)
    location_risk: Optional[str] = Field("MEDIUM", description="Geographic accident/theft risk tier (LOW, MEDIUM, HIGH)", example="HIGH")
    annual_mileage: Optional[float] = Field(None, ge=0, description="Estimated annual kilometers/miles driven", example=15000.0)

    # Life-specific parameters
    occupation_risk: Optional[str] = Field("LOW", description="Occupational hazard classification (LOW, MEDIUM, HIGH)", example="MEDIUM")
    policy_term: Optional[int] = Field(None, ge=1, le=50, description="Duration of life policy in years", example=20)
    tobacco_use: Optional[bool] = Field(None, description="Direct indicator of tobacco usage", example=False)
    family_medical_history: Optional[str] = Field(None, description="History of hereditary conditions", example="Clean")


class RiskAnalysisResponse(BaseModel):
    model_config = ConfigDict(extra="allow", use_enum_values=True)

    customer_id: str = Field(..., description="Customer identifier matching the request", example="C1001")
    insurance_type: InsuranceType = Field(..., description="Insurance line analyzed", example="HEALTH")
    risk_score: int = Field(..., ge=0, le=100, description="Calculated deterministic risk score between 0 and 100", example=72)
    risk_level: RiskLevel = Field(..., description="Categorical risk classification: LOW, MEDIUM, HIGH", example="HIGH")
    risk_factors: List[str] = Field(
        ..., 
        description="Explainable list of contributory risk factors identified by rules",
        example=["High claim frequency", "High claim amount"]
    )
    details: Optional[Dict[str, Any]] = Field(
        default_factory=dict,
        description="Detailed metric breakdown providing mathematical transparency for downstream AI agents"
    )

    # Extended fields seamlessly supporting React frontend and LangGraph agent integration
    ai_summary: Optional[str] = Field(None, description="Agentic AI narrative summary of risk evaluation")
    retrieved_guidelines: Optional[List[Any]] = Field(default_factory=list, description="RAG retrieved policy guidelines")
    dimensionScores: Optional[List[Any]] = Field(default_factory=list, description="Dimensional scores for radar/bar charts")
    exposureDistribution: Optional[List[Any]] = Field(default_factory=list, description="Factor weight distribution for charts")
    plans: Optional[List[Any]] = Field(default_factory=list, description="Recommended insurance policies with predicted suitability")
    timestamp: Optional[str] = Field(None, description="ISO timestamp of analysis")


class ChatRequest(BaseModel):
    message: str = Field(..., description="User question or prompt for InsureAI Copilot")
    history: Optional[List[Any]] = Field(default_factory=list, description="Conversation history")


class ChatResponse(BaseModel):
    reply: str = Field(..., description="AI Copilot response text")
