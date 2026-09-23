"""Vector store management for Simple RAG using ChromaDB."""
import os
from pathlib import Path
from typing import Optional
import chromadb
from backend.rag.embeddings import get_embedding_function

COLLECTION_NAME = "insurance_underwriting_guidelines"
DEFAULT_DB_DIR = Path(__file__).resolve().parent.parent.parent / "data" / "chroma_db"
DOCUMENTS_DIR = Path(__file__).resolve().parent / "documents"


def get_chroma_client(persist_directory: Optional[str] = None) -> chromadb.ClientAPI:
    """Initializes and returns a ChromaDB client."""
    db_path = persist_directory or str(DEFAULT_DB_DIR)
    os.makedirs(db_path, exist_ok=True)
    return chromadb.PersistentClient(path=db_path)


def get_vector_collection(client: Optional[chromadb.ClientAPI] = None, collection_name: str = COLLECTION_NAME):
    """Retrieves or creates the guidelines collection with embedding function."""
    client = client or get_chroma_client()
    embedding_fn = get_embedding_function()
    return client.get_or_create_collection(
        name=collection_name,
        embedding_function=embedding_fn,
        metadata={"hnsw:space": "cosine"}
    )


def load_and_index_documents(docs_base_dir: Optional[Path] = None, force_reload: bool = False):
    """Reads guideline files from health/, automobile/, life/ subfolders and indexes them in ChromaDB."""
    base_dir = docs_base_dir or DOCUMENTS_DIR
    collection = get_vector_collection()

    if collection.count() > 0 and not force_reload:
        return collection

    category_mapping = {
        "health": "HEALTH",
        "automobile": "AUTOMOBILE",
        "life": "LIFE"
    }

    documents = []
    metadatas = []
    ids = []

    # Iterate through insurance type directories
    for folder_name, ins_type in category_mapping.items():
        type_dir = base_dir / folder_name
        if not type_dir.exists():
            continue

        for file_path in type_dir.glob("*.txt"):
            try:
                content = file_path.read_text(encoding="utf-8").strip()
                if not content:
                    continue

                # Split by rules/guidelines or paragraphs
                paragraphs = [p.strip() for p in content.split("\n") if p.strip() and not p.strip().startswith("[")]

                for idx, para in enumerate(paragraphs):
                    doc_id = f"{folder_name}_{file_path.stem}_{idx}"
                    documents.append(para)
                    metadatas.append({
                        "insurance_type": ins_type,
                        "source": file_path.name,
                        "rule_index": idx
                    })
                    ids.append(doc_id)
            except Exception as e:
                print(f"Warning: Could not read {file_path}: {e}")

    # Also check if there are legacy root files in documents
    for file_path in base_dir.glob("*.txt"):
        if file_path.is_file():
            content = file_path.read_text(encoding="utf-8").strip()
            if not content:
                continue
            lines = [l.strip() for l in content.split("\n") if l.strip()]
            for idx, line in enumerate(lines):
                doc_id = f"general_{file_path.stem}_{idx}"
                documents.append(line)
                metadatas.append({
                    "insurance_type": "GENERAL",
                    "source": file_path.name,
                    "rule_index": idx
                })
                ids.append(doc_id)

    if documents:
        collection.upsert(
            documents=documents,
            metadatas=metadatas,
            ids=ids
        )

    return collection


if __name__ == "__main__":
    coll = load_and_index_documents(force_reload=True)
    print(f"Indexed {coll.count()} items into ChromaDB collection.")
