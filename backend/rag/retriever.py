"""Retriever module for filtering and retrieving insurance guidelines using ChromaDB."""
from typing import List, Dict, Any, Optional
from backend.rag.vector_store import get_vector_collection, load_and_index_documents


def retrieve_guidelines(
    query: str,
    insurance_type: Optional[str] = "HEALTH",
    top_k: int = 3
) -> List[Dict[str, Any]]:
    """Retrieves guidelines relevant to the query and filtered by insurance type.

    Args:
        query: Query string describing customer profile and risk factors.
        insurance_type: Insurance category ('HEALTH', 'AUTOMOBILE', 'LIFE').
        top_k: Number of relevant snippets to retrieve.

    Returns:
        List of dictionaries containing snippet text and metadata.
    """
    collection = get_vector_collection()
    if collection.count() == 0:
        collection = load_and_index_documents()

    norm_type = insurance_type.upper() if insurance_type else "HEALTH"
    
    where_filter = {"insurance_type": norm_type}

    try:
        results = collection.query(
            query_texts=[query],
            n_results=min(top_k, max(collection.count(), 1)),
            where=where_filter
        )

        retrieved_docs = []
        if results and results.get("documents") and len(results["documents"]) > 0:
            docs = results["documents"][0]
            metas = results["metadatas"][0] if results.get("metadatas") else [{}] * len(docs)
            for doc, meta in zip(docs, metas):
                retrieved_docs.append({
                    "content": doc,
                    "metadata": meta,
                    "source": meta.get("source", "guidelines.txt"),
                    "insurance_type": meta.get("insurance_type", norm_type)
                })

        # Fallback if no type-specific items were retrieved
        if not retrieved_docs:
            general_results = collection.query(
                query_texts=[query],
                n_results=top_k
            )
            if general_results and general_results.get("documents") and len(general_results["documents"]) > 0:
                docs = general_results["documents"][0]
                metas = general_results["metadatas"][0] if general_results.get("metadatas") else [{}] * len(docs)
                for doc, meta in zip(docs, metas):
                    retrieved_docs.append({
                        "content": doc,
                        "metadata": meta,
                        "source": meta.get("source", "guidelines.txt"),
                        "insurance_type": meta.get("insurance_type", norm_type)
                    })

        return retrieved_docs

    except Exception as e:
        # Graceful fallback: return direct guidelines without crashing
        return [
            {
                "content": f"Standard {norm_type} underwriting guidelines applied for risk assessment.",
                "metadata": {"insurance_type": norm_type, "source": "fallback_policy"},
                "source": "underwriting_rules.txt",
                "insurance_type": norm_type
            }
        ]


def format_guidelines_for_prompt(guidelines: List[Dict[str, Any]]) -> str:
    """Formats retrieved guideline dicts into a structured string for LLM prompting."""
    if not guidelines:
        return "No specific guidelines retrieved. Follow standard underwriting principles."
    
    formatted = []
    for idx, item in enumerate(guidelines, 1):
        content = item.get("content", "").strip()
        source = item.get("source", "guidelines.txt")
        formatted.append(f"{idx}. [{source}] {content}")
    return "\n".join(formatted)
