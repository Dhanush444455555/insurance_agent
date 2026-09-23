"""Embedding functions for Simple RAG with ChromaDB."""
import os
from typing import Any, List


class SimpleFallbackEmbeddingFunction:
    """Lightweight deterministic embedding function for offline/local environments."""
    def __init__(self, dimension: int = 64):
        self.dimension = dimension

    def __call__(self, input: Any) -> List[List[float]]:
        if isinstance(input, str):
            texts = [input]
        else:
            texts = list(input)
        embeddings = []
        for text in texts:
            vec = [0.0] * self.dimension
            for i, ch in enumerate(text):
                vec[i % self.dimension] += (ord(ch) * 0.01)
            # Normalize vector
            norm = sum(x * x for x in vec) ** 0.5 or 1.0
            embeddings.append([x / norm for x in vec])
        return embeddings

    def embed_documents(self, texts: List[str]) -> List[List[float]]:
        return self(texts)

    def embed_query(self, text: str) -> List[float]:
        return self([text])[0]


def get_embedding_function():
    """Returns an embedding function.

    Uses ChromaDB default embedding function or falls back to SimpleFallbackEmbeddingFunction.
    """
    try:
        import chromadb.utils.embedding_functions as ef
        # DefaultEmbeddingFunction uses all-MiniLM-L6-v2 via onnxruntime
        return ef.DefaultEmbeddingFunction()
    except Exception:
        return SimpleFallbackEmbeddingFunction()
