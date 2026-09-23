"""State definition for LangGraph Insurance Risk Agent."""
from typing import TypedDict, List, Dict, Any, Optional


class InsuranceAgentState(TypedDict):
    # Inputs
    insurance_type: Optional[str]
    customer_profile: Dict[str, Any]
    risk_info: Dict[str, Any]
    
    # Internal agent pipeline state
    query: Optional[str]
    retrieved_guidelines: List[Dict[str, Any]]
    formatted_guidelines: Optional[str]
    
    # Generated outputs
    summary: Optional[str]
    key_factors: Optional[List[str]]
    explanation: Optional[str]
    guidelines_used: Optional[List[str]]
    
    # Final consolidated dictionary matching expected schema
    final_output: Optional[Dict[str, Any]]
    error: Optional[str]
