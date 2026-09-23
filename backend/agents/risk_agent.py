"""Single LangGraph Agent for Insurance Risk Profile Summarization.

Supports:
- HEALTH
- AUTOMOBILE
- LIFE

Workflow:
START -> identify_insurance_type -> receive_risk_info -> retrieve_guidelines -> generate_explanation -> END
"""
import json
from typing import Dict, Any, List
from langgraph.graph import StateGraph, START, END

from backend.agents.state import InsuranceAgentState
from backend.rag.retriever import retrieve_guidelines, format_guidelines_for_prompt
from backend.llm.model import get_llm, FallbackRiskLLM, parse_llm_json_response
from backend.llm.prompts import SYSTEM_PROMPT, USER_PROMPT_TEMPLATE


def identify_insurance_type(state: InsuranceAgentState) -> Dict[str, Any]:
    """Step 1: Identify insurance type (HEALTH, AUTOMOBILE, LIFE)."""
    raw_type = state.get("insurance_type")
    customer = state.get("customer_profile", {})

    if raw_type:
        identified = raw_type.upper().strip()
    elif "vehicle_model" in customer or "driving_history" in customer or "vehicle_age" in customer:
        identified = "AUTOMOBILE"
    elif "tobacco_user" in customer or "pre_existing_conditions" in customer or "bmi" in customer:
        identified = "HEALTH"
    elif "sum_assured" in customer or "annual_income" in customer or "beneficiary" in customer:
        identified = "LIFE"
    else:
        identified = "HEALTH"

    # Normalize to one of 3 supported types
    if "AUTO" in identified or "CAR" in identified or "VEHICLE" in identified:
        final_type = "AUTOMOBILE"
    elif "LIFE" in identified or "TERM" in identified:
        final_type = "LIFE"
    else:
        final_type = "HEALTH"

    return {"insurance_type": final_type}


def receive_risk_info(state: InsuranceAgentState) -> Dict[str, Any]:
    """Step 2: Receive and validate deterministic risk information from Member 1's risk engine."""
    risk_info = state.get("risk_info", {})
    customer = state.get("customer_profile", {})
    ins_type = state.get("insurance_type", "HEALTH")

    # Ensure risk score and tier are preserved deterministically
    score = risk_info.get("risk_score", risk_info.get("score", 50.0))
    tier = risk_info.get("risk_tier", risk_info.get("tier", "MODERATE"))
    factors = risk_info.get("factors", risk_info.get("risk_factors", []))

    validated_risk = {
        "risk_score": float(score),
        "risk_tier": str(tier).upper(),
        "factors": factors
    }

    # Construct search query for RAG based on profile & risk indicators
    query_parts = [f"Insurance Type: {ins_type}"]
    if customer.get("age"):
        query_parts.append(f"Age: {customer['age']}")
    if customer.get("pre_existing_conditions"):
        query_parts.append(f"Pre-existing: {customer['pre_existing_conditions']}")
    if customer.get("smoker") or customer.get("tobacco_user"):
        query_parts.append("Tobacco user")
    if customer.get("driving_violations") or customer.get("accident_history"):
        query_parts.append("Traffic/accident history")
    if customer.get("vehicle_age"):
        query_parts.append(f"Vehicle age: {customer['vehicle_age']}")
    if customer.get("occupation"):
        query_parts.append(f"Occupation: {customer['occupation']}")

    search_query = "; ".join(query_parts)

    return {
        "risk_info": validated_risk,
        "query": search_query
    }


def retrieve_guidelines_node(state: InsuranceAgentState) -> Dict[str, Any]:
    """Step 3: Retrieve relevant guidelines filtered by insurance type."""
    ins_type = state.get("insurance_type", "HEALTH")
    query = state.get("query") or f"{ins_type} underwriting guidelines risk factors"

    retrieved = retrieve_guidelines(
        query=query,
        insurance_type=ins_type,
        top_k=3
    )

    formatted = format_guidelines_for_prompt(retrieved)

    return {
        "retrieved_guidelines": retrieved,
        "formatted_guidelines": formatted
    }


def generate_explanation_node(state: InsuranceAgentState) -> Dict[str, Any]:
    """Step 4: Generate summary, key risk factors, explanation, and guidelines used via LLM."""
    ins_type = state.get("insurance_type", "HEALTH")
    customer = state.get("customer_profile", {})
    risk_info = state.get("risk_info", {})
    retrieved = state.get("retrieved_guidelines", [])
    formatted_guidelines = state.get("formatted_guidelines", "")

    llm = get_llm()
    fallback = FallbackRiskLLM()
    fallback_output = fallback.generate(
        insurance_type=ins_type,
        customer_profile=customer,
        risk_info=risk_info,
        retrieved_guidelines=retrieved
    )

    if isinstance(llm, FallbackRiskLLM):
        final_dict = fallback_output
    else:
        try:
            from langchain_core.messages import SystemMessage, HumanMessage
            prompt_content = USER_PROMPT_TEMPLATE.format(
                insurance_type=ins_type,
                customer_profile=json.dumps(customer, indent=2),
                risk_score=risk_info.get("risk_score", 50.0),
                risk_tier=risk_info.get("risk_tier", "MODERATE"),
                risk_flags=", ".join(risk_info.get("factors", [])) or "None",
                retrieved_guidelines=formatted_guidelines
            )

            messages = [
                SystemMessage(content=SYSTEM_PROMPT),
                HumanMessage(content=prompt_content)
            ]

            response = llm.invoke(messages)
            raw_text = response.content if hasattr(response, "content") else str(response)
            final_dict = parse_llm_json_response(raw_text, fallback_data=fallback_output)
        except Exception:
            final_dict = fallback_output

    # Ensure final output strictly contains required keys and types
    summary = str(final_dict.get("summary", fallback_output["summary"]))
    key_factors = list(final_dict.get("key_factors", fallback_output["key_factors"]))
    explanation = str(final_dict.get("explanation", fallback_output["explanation"]))
    guidelines_used = list(final_dict.get("guidelines_used", fallback_output["guidelines_used"]))

    expected_output = {
        "summary": summary,
        "key_factors": key_factors,
        "guidelines_used": guidelines_used,
        "insurance_type": ins_type
    }

    return {
        "summary": summary,
        "key_factors": key_factors,
        "explanation": explanation,
        "guidelines_used": guidelines_used,
        "final_output": expected_output
    }


def build_insurance_risk_graph():
    """Builds and compiles the ONE SINGLE LangGraph Agent."""
    workflow = StateGraph(InsuranceAgentState)

    # Add workflow nodes
    workflow.add_node("identify_insurance_type", identify_insurance_type)
    workflow.add_node("receive_risk_info", receive_risk_info)
    workflow.add_node("retrieve_guidelines", retrieve_guidelines_node)
    workflow.add_node("generate_explanation", generate_explanation_node)

    # Define linear graph edges
    workflow.add_edge(START, "identify_insurance_type")
    workflow.add_edge("identify_insurance_type", "receive_risk_info")
    workflow.add_edge("receive_risk_info", "retrieve_guidelines")
    workflow.add_edge("retrieve_guidelines", "generate_explanation")
    workflow.add_edge("generate_explanation", END)

    return workflow.compile()


# Single agent instance
risk_agent = build_insurance_risk_graph()


def run_insurance_risk_agent(
    customer_profile: Dict[str, Any],
    risk_info: Dict[str, Any],
    insurance_type: str = "HEALTH"
) -> Dict[str, Any]:
    """Public execution entry point for Member 2's LangGraph Agent.

    Returns:
        Dict adhering to:
        {
          "summary": "...",
          "key_factors": [...],
          "guidelines_used": [...],
          "insurance_type": "HEALTH"
        }
    """
    initial_state: InsuranceAgentState = {
        "insurance_type": insurance_type,
        "customer_profile": customer_profile,
        "risk_info": risk_info,
        "query": None,
        "retrieved_guidelines": [],
        "formatted_guidelines": None,
        "summary": None,
        "key_factors": None,
        "explanation": None,
        "guidelines_used": None,
        "final_output": None,
        "error": None
    }

    result = risk_agent.invoke(initial_state)
    return result.get("final_output") or {
        "summary": result.get("summary", ""),
        "key_factors": result.get("key_factors", []),
        "guidelines_used": result.get("guidelines_used", []),
        "insurance_type": result.get("insurance_type", insurance_type.upper())
    }
