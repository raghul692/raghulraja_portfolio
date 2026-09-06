import google.generativeai as genai
import math
import logging
from app.config import settings

logger = logging.getLogger("portfolio_ai_embeddings")

if settings.GEMINI_API_KEY:
    try:
        genai.configure(api_key=settings.GEMINI_API_KEY)
    except Exception as e:
        logger.warning(f"Failed to configure genai in embeddings: {e}")

def generate_embedding(text: str) -> list[float]:
    """Generates normalized vector embedding for input text."""
    if settings.GEMINI_API_KEY:
        try:
            result = genai.embed_content(
                model="models/text-embedding-004",
                content=text,
                task_type="retrieval_document"
            )
            embedding = result.get("embedding", [])
            if embedding:
                return embedding
        except Exception as e:
            try:
                result = genai.embed_content(
                    model="models/embedding-001",
                    content=text,
                    task_type="retrieval_document"
                )
                embedding = result.get("embedding", [])
                if embedding:
                    return embedding
            except Exception:
                logger.warning(f"Gemini embedding error: {e}. Falling back to deterministic embedding.")


    # Deterministic local fallback embedding generator (768 dimensions)
    return compute_local_hash_embedding(text, dim=768)


def compute_local_hash_embedding(text: str, dim: int = 768) -> list[float]:
    """Computes a normalized pseudo-random vector based on text hash for offline testing."""
    import hashlib
    words = text.lower().split()
    vector = [0.0] * dim
    
    for i, word in enumerate(words):
        h = hashlib.sha256(f"{word}_{i}".encode("utf-8")).digest()
        for idx in range(dim):
            byte_val = h[idx % len(h)]
            vector[idx] += (byte_val / 255.0) - 0.5

    # Normalize vector to unit length
    magnitude = math.sqrt(sum(x * x for x in vector))
    if magnitude > 0:
        vector = [x / magnitude for x in vector]
    else:
        vector = [1.0 / math.sqrt(dim)] * dim

    return vector
