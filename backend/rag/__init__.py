"""RAG module for Insurance Underwriting Guidelines."""
from backend.rag.embeddings import get_embedding_function
from backend.rag.vector_store import get_vector_collection, load_and_index_documents
from backend.rag.retriever import retrieve_guidelines, format_guidelines_for_prompt

__all__ = [
    "get_embedding_function",
    "get_vector_collection",
    "load_and_index_documents",
    "retrieve_guidelines",
    "format_guidelines_for_prompt"
]
