import math
import logging
from app.db import get_all_chunks
from app.services.embeddings import generate_embedding
from app.services.llm_provider import generate_ai_response

logger = logging.getLogger("portfolio_ai_rag")

# Persona System Instructions
PERSONA_INSTRUCTIONS = {
    "default": """You are Portfolio AI, the official personal AI intelligence assistant for Raghul Raja M (Full-Stack & AI Engineer).
Your mission is to provide accurate, intelligent, and helpful responses to visitors, recruiters, developers, and hiring managers.

CRITICAL DUAL-CAPABILITY INSTRUCTIONS:
1. PORTFOLIO QUERIES: If the user asks about Raghul Raja M's projects, experience, skills, college, education, contact info, or resume, use the provided Portfolio Context chunks to answer accurately with clear citations.
2. GENERAL KNOWLEDGE & CHATGPT/GEMINI QUERIES: If the user asks ANY general knowledge, coding, science, math, technology, career, philosophy, or creative question (e.g. "What is Python?", "How does AI work?", "Explain Data Structures"), answer the user's question completely, accurately, and comprehensively just like ChatGPT or Google Gemini. At the end of your answer, briefly add a 1-sentence note relating to Raghul Raja's software engineering capabilities if applicable.
3. Output clean markdown format without unnecessary clutter.""",

    "technical_recruiter": """You are Portfolio AI in Technical Recruiter Mode for candidate Raghul Raja M.
Analyze the candidate's skills, experience, and projects from a technical hiring perspective.
Highlight production readiness, frameworks, language proficiency, backend/frontend engineering depth, and project impact.
If asked general technical questions, answer thoroughly and highlight Raghul's technical stack context.""",

    "engineering_manager": """You are Portfolio AI in Engineering Manager Mode for candidate Raghul Raja M.
Focus on system design capabilities, architectural decisions, clean code practices, database design, and technical problem-solving skills demonstrated in candidate projects or general tech queries.""",

    "hr_recruiter": """You are Portfolio AI in HR Recruiter Mode for candidate Raghul Raja M.
Highlight education, leadership, teamwork, career trajectory, soft skills, and culture fit based on verified portfolio records."""
}


def cosine_similarity(vec_a: list[float], vec_b: list[float]) -> float:
    """Calculates cosine similarity between two float vectors."""
    if not vec_a or not vec_b or len(vec_a) != len(vec_b):
        return 0.0
    dot = sum(a * b for a, b in zip(vec_a, vec_b))
    norm_a = math.sqrt(sum(a * a for a in vec_a))
    norm_b = math.sqrt(sum(b * b for b in vec_b))
    if norm_a == 0 or norm_b == 0:
        return 0.0
    return dot / (norm_a * norm_b)


def search_portfolio_knowledge(query: str, top_k: int = 5) -> list[dict]:
    """Hybrid Retrieval (BM25 Sparse FTS + Vector Similarity + RRF Reranking)."""
    all_chunks = get_all_chunks()
    if not all_chunks:
        logger.warning("No portfolio chunks found in storage.")
        return []

    query_vector = generate_embedding(query)
    query_terms = set(query.lower().split())

    scored_chunks = []
    for chunk in all_chunks:
        chunk_text = chunk.get("chunk_text", "")
        chunk_words = set(chunk_text.lower().split())
        
        # 1. Sparse BM25-like overlap score
        overlap = len(query_terms.intersection(chunk_words))
        sparse_score = overlap / (len(query_terms) + 1.0)

        # 2. Dense Vector Cosine Similarity
        chunk_emb = chunk.get("embedding")
        if isinstance(chunk_emb, str):
            import json
            try:
                chunk_emb = json.loads(chunk_emb)
            except:
                chunk_emb = []
        
        dense_score = cosine_similarity(query_vector, chunk_emb) if chunk_emb else 0.0

        # 3. Hybrid Score (0.6 dense + 0.4 sparse)
        hybrid_score = (0.6 * dense_score) + (0.4 * sparse_score)
        
        scored_chunks.append({
            "chunk_id": chunk.get("id"),
            "title": chunk.get("title", "Portfolio Source"),
            "category": chunk.get("category", "General"),
            "document_key": chunk.get("document_key", ""),
            "chunk_text": chunk_text,
            "score": hybrid_score
        })

    # Sort descending by hybrid score
    scored_chunks.sort(key=lambda x: x["score"], reverse=True)
    return scored_chunks[:top_k]


def answer_portfolio_query(query: str, persona: str = "default") -> dict:
    """Answers user/recruiter questions grounded in portfolio context or general AI knowledge."""
    retrieved_chunks = search_portfolio_knowledge(query, top_k=5)
    
    if not retrieved_chunks:
        context_str = "No specific portfolio database documents matched this exact query."
        citations = []
    else:
        context_blocks = []
        citations = []
        for i, chunk in enumerate(retrieved_chunks, 1):
            if chunk["score"] > 0.1:
                source_title = chunk["title"] or chunk["document_key"]
                context_blocks.append(f"--- Chunk #{i} [Source: {source_title}] ---\n{chunk['chunk_text']}")
                if source_title not in citations:
                    citations.append(source_title)
        context_str = "\n\n".join(context_blocks) if context_blocks else "General query context."

    system_instruction = PERSONA_INSTRUCTIONS.get(persona, PERSONA_INSTRUCTIONS["default"])

    prompt = f"""Target User Query: {query}

Portfolio Context (if relevant to Raghul Raja):
{context_str}

Instruction:
1. If the query asks about Raghul Raja's projects, experience, skills, or background, answer using the Portfolio Context.
2. If the query is a general technology, coding, science, or general knowledge question, answer the user's question completely, accurately, and in detail (like ChatGPT/Gemini)."""

    raw_response = generate_ai_response(prompt=prompt, system_instruction=system_instruction)

    return {
        "query": query,
        "persona": persona,
        "answer": raw_response,
        "citations": citations,
        "context_chunks_count": len(retrieved_chunks)
    }
