"""AI Insurance Chat Assistant powered by RAG + LLM."""
import json
from typing import List, Dict, Any
from backend.rag.retriever import retrieve_guidelines, format_guidelines_for_prompt
from backend.llm.model import get_llm, FallbackRiskLLM

CHAT_SYSTEM_PROMPT = """You are InsureAI Assistant, an intelligent, friendly insurance expert co-pilot embedded directly into the Insurance Risk AI platform.
Your job is to answer any doubts or questions users have about:
1. Health Insurance (waiting periods, BMI, pre-existing diseases, claim rules)
2. Automobile Insurance (driver age, zero depreciation, NCB, high mileage, accident factors)
3. Life Insurance (term plans, mortality factors, smoking classification, suicide clause, contestability)
4. Underwriting guidelines, risk scores, and how policies work.

Instructions:
- Be clear, professional, concise, and helpful.
- Ground your answers in underwriting principles and insurance facts.
- Use bullet points where appropriate for readability.
"""


def ask_insurance_chat(message: str, history: List[Dict[str, str]] = None) -> str:
    """Answers insurance queries using RAG context and configured LLM."""
    query = message.strip()
    if not query:
        return "Please enter a question about insurance guidelines, risk assessment, or claim policies."

    # Detect context type from query
    query_lower = query.lower()
    if "car" in query_lower or "auto" in query_lower or "vehicle" in query_lower or "drive" in query_lower or "accident" in query_lower:
        ins_type = "AUTOMOBILE"
    elif "life" in query_lower or "death" in query_lower or "term" in query_lower or "mortality" in query_lower or "nominee" in query_lower:
        ins_type = "LIFE"
    else:
        ins_type = "HEALTH"

    # Retrieve relevant guidelines via RAG
    guidelines = retrieve_guidelines(query=query, insurance_type=ins_type, top_k=3)
    formatted_guidelines = format_guidelines_for_prompt(guidelines)

    llm = get_llm()

    # If using local fallback
    if isinstance(llm, FallbackRiskLLM):
        return (
            f"**Regarding your query on {ins_type.title()} Insurance:**\n\n"
            f"Based on our active underwriting guidelines:\n"
            f"• **Key Principle:** {guidelines[0]['content'] if guidelines else 'Standard underwriting evaluation applies.'}\n"
            f"• **Policy Note:** Risk tiering directly determines premium loading, deductible limits, and waiting periods.\n\n"
            f"If you have specific questions on Health, Auto, or Life profiles, feel free to ask!"
        )

    try:
        from langchain_core.messages import SystemMessage, HumanMessage, AIMessage

        messages = [
            SystemMessage(content=f"{CHAT_SYSTEM_PROMPT}\n\nRELEVANT GUIDELINES:\n{formatted_guidelines}")
        ]

        if history:
            for item in history[-4:]:  # last 4 conversation turns
                role = item.get("role", "user")
                content = item.get("content", "")
                if role == "assistant":
                    messages.append(AIMessage(content=content))
                else:
                    messages.append(HumanMessage(content=content))

        messages.append(HumanMessage(content=query))

        response = llm.invoke(messages)
        return response.content if hasattr(response, "content") else str(response)
    except Exception as e:
        return (
            f"Based on our underwriting database for {ins_type.title()} Insurance: "
            f"{guidelines[0]['content'] if guidelines else 'Policies are evaluated based on verified actuarial tables and risk factors.'}"
        )
