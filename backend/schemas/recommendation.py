from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


class RecommendationItem(BaseModel):
    policy_id: Optional[str] = Field(None, description="Recommended policy identifier")
    title: str = Field(..., description="Policy or action recommendation title")
    description: str = Field(..., description="Detailed recommendation description")
    suggested_coverage: Optional[float] = Field(None, description="Suggested optimal coverage amount")
    estimated_premium: Optional[float] = Field(None, description="Estimated premium range or value")


class RecommendationResponse(BaseModel):
    customer_id: str = Field(..., description="Customer identifier")
    insurance_type: str = Field(..., description="Insurance type (HEALTH, AUTOMOBILE, LIFE)")
    recommendations: List[RecommendationItem] = Field(default_factory=list)
    metadata: Optional[Dict[str, Any]] = Field(default_factory=dict)
