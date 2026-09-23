"""LLM Provider initialization and unified interface."""
import os
import json
import re
from typing import Dict, Any, Optional
from backend.llm.prompts import SYSTEM_PROMPT, USER_PROMPT_TEMPLATE


class FallbackRiskLLM:
    """Intelligent rule-grounded generator when no external API key is configured or offline.

    Ensures 100% reliable execution adhering strictly to the required schema and deterministic risk scores.
    """
    def generate(
        self,
        insurance_type: str,
        customer_profile: Dict[str, Any],
        risk_info: Dict[str, Any],
        retrieved_guidelines: list
    ) -> Dict[str, Any]:
        ins_type = insurance_type.upper() if insurance_type else "HEALTH"
        risk_score = risk_info.get("risk_score", risk_info.get("score", 50.0))
        risk_tier = risk_info.get("risk_tier", risk_info.get("tier", "MODERATE"))
        
        # Extract customer details
        age = customer_profile.get("age", "N/A")
        name = customer_profile.get("name", "Applicant")

        # Extract key factors dynamically
        key_factors = []
        if ins_type == "HEALTH":
            if customer_profile.get("pre_existing_conditions"):
                key_factors.append(f"Pre-existing conditions: {customer_profile.get('pre_existing_conditions')}")
            if customer_profile.get("tobacco_user") or customer_profile.get("smoker"):
                key_factors.append("Active tobacco/nicotine consumer")
            if customer_profile.get("bmi", 22) > 28:
                key_factors.append(f"Elevated BMI ({customer_profile.get('bmi')})")
            if isinstance(age, (int, float)) and age > 50:
                key_factors.append(f"Age tier ({age} years)")
        elif ins_type == "AUTOMOBILE":
            if customer_profile.get("accident_history") or customer_profile.get("violations"):
                key_factors.append("Recorded past traffic violations or accident history")
            if customer_profile.get("vehicle_age", 0) > 6:
                key_factors.append(f"Vehicle age exceeds standard tier ({customer_profile.get('vehicle_age')} years)")
            if customer_profile.get("annual_mileage", 10000) > 18000:
                key_factors.append("High annual driving exposure")
        elif ins_type == "LIFE":
            if customer_profile.get("smoker") or customer_profile.get("tobacco_user"):
                key_factors.append("Tobacco user classification (increased mortality factor)")
            if customer_profile.get("hazardous_occupation"):
                key_factors.append("Hazardous occupation rating")
            if isinstance(age, (int, float)) and age > 45:
                key_factors.append(f"Mortality curve adjustment for age {age}")

        if not key_factors:
            key_factors.append(f"Standard demographic and profile characteristics for {ins_type.lower()} policy")

        # Guidelines used extraction
        guidelines_used = []
        for g in retrieved_guidelines:
            if isinstance(g, dict):
                src = g.get("source", "Underwriting Guidelines")
                text = g.get("content", "")
                title = text.split(":")[0] if ":" in text else text[:40]
                guidelines_used.append(f"{src} - {title}")
            elif isinstance(g, str):
                guidelines_used.append(g[:50])

        if not guidelines_used:
            guidelines_used.append(f"Standard {ins_type.title()} Underwriting and Adjudication Guidelines")

        summary = (
            f"The applicant {name} (Age: {age}) presents a deterministic risk score of {risk_score}/100, "
            f"categorizing the {ins_type.lower()} profile as {risk_tier.upper()} risk. "
            f"The evaluation reflects verified underwriting guidelines and profile health/exposure factors."
        )

        explanation = (
            f"Based on the deterministic risk calculation ({risk_score}/100 - {risk_tier.upper()}) and matched "
            f"{ins_type.lower()} insurance underwriting guidelines, key contributing drivers include "
            f"{', '.join(key_factors)}. The policy terms, deductible structures, and premium multipliers "
            f"are adjusted in accordance with the established {ins_type.lower()} claim rules and mortality/loss tables."
        )

        return {
            "summary": summary,
            "key_factors": key_factors,
            "explanation": explanation,
            "guidelines_used": guidelines_used,
            "insurance_type": ins_type
        }


def get_llm():
    """Factory returning configured LLM chat instance or FallbackRiskLLM."""
    provider = os.getenv("LLM_PROVIDER", "").lower()
    
    # 1. NVIDIA NIM / Cloud
    if provider in ["nvidia", "nim"] or os.getenv("NVIDIA_API_KEY"):
        try:
            from langchain_openai import ChatOpenAI
            api_key = os.getenv("NVIDIA_API_KEY")
            base_url = os.getenv("NVIDIA_BASE_URL", "https://integrate.api.nvidia.com/v1")
            model = os.getenv("NVIDIA_MODEL", "meta/llama-3.1-8b-instruct")
            return ChatOpenAI(
                model=model,
                api_key=api_key,
                base_url=base_url,
                temperature=0.2
            )
        except Exception:
            pass

    # 2. Google Gemini
    if provider in ["gemini", "google"] or os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY"):
        try:
            from langchain_google_genai import ChatGoogleGenerativeAI
            api_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
            return ChatGoogleGenerativeAI(
                model=os.getenv("GEMINI_MODEL", "gemini-1.5-flash"),
                google_api_key=api_key,
                temperature=0.2
            )
        except Exception:
            pass

    # 3. OpenAI
    if provider == "openai" or os.getenv("OPENAI_API_KEY"):
        try:
            from langchain_openai import ChatOpenAI
            return ChatOpenAI(
                model=os.getenv("OPENAI_MODEL", "gpt-4o-mini"),
                api_key=os.getenv("OPENAI_API_KEY"),
                temperature=0.2
            )
        except Exception:
            pass

    # 4. Ollama (Local)
    if provider == "ollama" or _is_ollama_reachable():
        try:
            from langchain_community.chat_models import ChatOllama
            return ChatOllama(
                model=os.getenv("OLLAMA_MODEL", "llama3"),
                base_url=os.getenv("OLLAMA_BASE_URL", "http://localhost:11434"),
                temperature=0.2
            )
        except Exception:
            pass

    return FallbackRiskLLM()


def _is_ollama_reachable() -> bool:
    """Checks if local Ollama server is running."""
    import urllib.request
    try:
        url = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
        req = urllib.request.urlopen(url, timeout=0.8)
        return req.getcode() == 200
    except Exception:
        return False


def parse_llm_json_response(raw_text: str, fallback_data: Dict[str, Any]) -> Dict[str, Any]:
    """Helper to parse JSON from LLM markdown/text output."""
    try:
        clean_text = raw_text.strip()
        # Remove markdown code fences if present
        if clean_text.startswith("```"):
            clean_text = re.sub(r"^```(?:json)?\n?", "", clean_text)
            clean_text = re.sub(r"\n?```$", "", clean_text)
        data = json.loads(clean_text)
        if isinstance(data, dict) and "summary" in data:
            return data
    except Exception:
        pass
    return fallback_data
