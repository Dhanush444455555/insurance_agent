from typing import Optional
from pydantic import BaseModel, Field


class CustomerBase(BaseModel):
    customer_id: str = Field(..., description="Unique customer ID", example="C1001")
    name: Optional[str] = Field(None, description="Full customer name", example="John Doe")
    age: Optional[int] = Field(None, ge=0, le=120, description="Age of customer", example=42)
    income: Optional[float] = Field(None, ge=0, description="Annual income", example=800000.0)
    location: Optional[str] = Field(None, description="City / Region", example="New York")


class CustomerProfile(CustomerBase):
    credit_score: Optional[int] = Field(None, ge=300, le=850, description="Credit score", example=720)
    claims_count: Optional[int] = Field(0, ge=0, description="Historical claim count", example=1)
    total_claim_amount: Optional[float] = Field(0.0, ge=0, description="Total historical claim sum", example=50000.0)
