import logging
from typing import List, Dict, Any
from app.db import search_chunks_vector, get_all_chunks
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


def search_portfolio_knowledge(query: str, top_k: int = 5) -> List[Dict[str, Any]]:
    """
    Retrieves relevant portfolio document chunks using Supabase PostgreSQL + pgvector.
    Workflow:
      User Query -> Gemini Embedding (768-dim) -> Supabase PostgreSQL (pgvector match_portfolio_chunks) -> Results
    """
    if not query or not query.strip():
        return []

    # 1. Generate query embedding (768 dimensions)
    try:
        query_vector = generate_embedding(query)
    except Exception as e:
        logger.error(f"Failed to generate query embedding: {e}")
        query_vector = None

    if not query_vector:
        logger.warning("No embedding generated. Falling back to keyword search.")
        return _fallback_keyword_search(query, top_k)

    # 2. Query Supabase PostgreSQL via pgvector match_portfolio_chunks
    try:
        results = search_chunks_vector(
            query_embedding=query_vector,
            match_threshold=0.25,
            match_count=top_k
        )
        if results:
            return results
        
        # If strict threshold returned 0 matches, retry with lower threshold
        results = search_chunks_vector(
            query_embedding=query_vector,
            match_threshold=0.10,
            match_count=top_k
        )
        if results:
            return results
    except Exception as e:
        logger.error(f"pgvector query failed: {e}. Falling back to cached chunks.")

    return _fallback_keyword_search(query, top_k)


def _fallback_keyword_search(query: str, top_k: int = 5) -> List[Dict[str, Any]]:
    """Fallback keyword matching over cached chunks if vector search is temporarily unreachable."""
    chunks = get_all_chunks()
    if not chunks:
        return []

    query_terms = set(query.lower().split())
    scored = []
    for c in chunks:
        text = c.get("chunk_text", "").lower()
        words = set(text.split())
        overlap = len(query_terms.intersection(words))
        if overlap > 0:
            score = overlap / (len(query_terms) + 1.0)
            scored.append({
                "chunk_id": c.get("id"),
                "document_id": c.get("document_id"),
                "document_key": c.get("document_key", ""),
                "title": c.get("title", "Portfolio Source"),
                "category": c.get("category", "General"),
                "chunk_index": c.get("chunk_index", 0),
                "chunk_text": c.get("chunk_text", ""),
                "similarity": score
            })

    scored.sort(key=lambda x: x["similarity"], reverse=True)
    return scored[:top_k]


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
            source_title = chunk.get("title") or chunk.get("document_key") or "Portfolio Reference"
            context_blocks.append(f"--- Chunk #{i} [Source: {source_title}] ---\n{chunk.get('chunk_text')}")
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
