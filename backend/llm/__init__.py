"""LLM and Prompt management for Insurance Risk Profile."""
from backend.llm.model import get_llm, FallbackRiskLLM
from backend.llm.prompts import SYSTEM_PROMPT, USER_PROMPT_TEMPLATE

__all__ = ["get_llm", "FallbackRiskLLM", "SYSTEM_PROMPT", "USER_PROMPT_TEMPLATE"]
