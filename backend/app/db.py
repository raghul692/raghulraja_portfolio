import os
import json
import logging
import uuid
import time
from contextlib import contextmanager
from typing import Optional, List, Dict, Any

import psycopg2
from psycopg2.pool import ThreadedConnectionPool
import pgvector.psycopg2
from app.config import settings

logger = logging.getLogger("portfolio_db")

_pool: Optional[ThreadedConnectionPool] = None

def get_connection_pool() -> ThreadedConnectionPool:
    """Lazily initializes and returns the ThreadedConnectionPool for Supabase PostgreSQL."""
    global _pool
    if _pool is None or _pool.closed:
        try:
            logger.info("Initializing PostgreSQL Connection Pool...")
            dsn = settings.DATABASE_URL
            # Fallback if dsn is empty, missing password (e.g. '://user:@' or '://user@'), or invalid
            if not dsn or ":@" in dsn or "@" not in dsn:
                pwd = settings.SUPABASE_DB_PASSWORD or "raghulraja2006"
                user = settings.SUPABASE_DB_USER or "postgres.brmafvpjvdgieelcgivi"
                host = settings.SUPABASE_DB_HOST or "aws-0-ap-south-1.pooler.supabase.com"
                port = settings.SUPABASE_DB_PORT or 5432
                dbname = settings.SUPABASE_DB_NAME or "postgres"
                dsn = f"postgresql://{user}:{pwd}@{host}:{port}/{dbname}?sslmode=require"

            _pool = ThreadedConnectionPool(
                minconn=1,
                maxconn=10,
                dsn=dsn,
                connect_timeout=10
            )
            logger.info("PostgreSQL Connection Pool successfully initialized.")
        except Exception as e:
            logger.error(f"Failed to initialize PostgreSQL Connection Pool: {e}")
            raise
    return _pool

@contextmanager
def get_db():
    """Context manager yielding a validated psycopg2 connection from the pool."""
    pool = get_connection_pool()
    conn = pool.getconn()
    try:
        # Register pgvector on the connection
        pgvector.psycopg2.register_vector(conn)
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        pool.putconn(conn)

def init_db():
    """Validates connectivity to Supabase PostgreSQL database."""
    try:
        with get_db() as conn:
            with conn.cursor() as cur:
                cur.execute("SELECT 1;")
                res = cur.fetchone()
                if res and res[0] == 1:
                    logger.info("Supabase PostgreSQL connectivity verified successfully.")
    except Exception as e:
        logger.error(f"Supabase PostgreSQL initialization check failed: {e}")
        raise

def supabase_headers() -> dict:
    """Headers for Supabase REST API calls."""
    return {
        "apikey": settings.SUPABASE_ANON_KEY,
        "Authorization": f"Bearer {settings.SUPABASE_ANON_KEY}",
        "Content-Type": "application/json",
        "Prefer": "return=representation"
    }

# -------------------------------------------------------------
# Contact Submissions
# -------------------------------------------------------------
def insert_contact_submission(
    name: str,
    email: str,
    subject: Optional[str],
    message: str,
    ip_address: Optional[str] = None,
    user_agent: Optional[str] = None
) -> int:
    """Inserts a new contact submission into Supabase PostgreSQL and returns the assigned ID."""
    query = """
    INSERT INTO contact_submissions (name, email, subject, message, ip_address, user_agent, status)
    VALUES (%s, %s, %s, %s, %s, %s, 'new')
    RETURNING id;
    """
    with get_db() as conn:
        with conn.cursor() as cur:
            cur.execute(query, (name, email, subject, message, ip_address, user_agent))
            row = cur.fetchone()
            return row[0] if row else 0

# -------------------------------------------------------------
# Vector Similarity Search (pgvector)
# -------------------------------------------------------------
def search_chunks_vector(
    query_embedding: list[float],
    match_threshold: float = 0.2,
    match_count: int = 5
) -> List[Dict[str, Any]]:
    """
    Executes native semantic vector search using pgvector and match_portfolio_chunks function
    in Supabase PostgreSQL.
    """
    query = """
    SELECT id, document_id, document_key, title, category, chunk_index, chunk_text, metadata, similarity
    FROM match_portfolio_chunks(%s::vector, %s::float, %s::int);
    """
    try:
        # Convert embedding to vector string format: '[0.1, 0.2, ...]'
        if hasattr(query_embedding, "to_text"):
            emb_str = query_embedding.to_text()
        elif isinstance(query_embedding, str) and query_embedding.startswith("["):
            emb_str = query_embedding
        else:
            emb_str = f"[{','.join(str(float(x)) for x in query_embedding)}]"

        with get_db() as conn:
            with conn.cursor() as cur:
                cur.execute(query, (emb_str, float(match_threshold), int(match_count)))
                rows = cur.fetchall()
                results = []
                for r in rows:
                    results.append({
                        "chunk_id": str(r[0]),
                        "document_id": str(r[1]),
                        "document_key": r[2],
                        "title": r[3],
                        "category": r[4],
                        "chunk_index": r[5],
                        "chunk_text": r[6],
                        "metadata": r[7] if isinstance(r[7], dict) else json.loads(r[7] or "{}"),
                        "similarity": float(r[8])
                    })
                return results
    except Exception as e:
        logger.error(f"Error executing pgvector similarity search: {e}")
        return []

# -------------------------------------------------------------
# Chunks & Documents Caching / Retrieval
# -------------------------------------------------------------
_CHUNKS_CACHE = None
_CHUNKS_CACHE_TIME = 0.0

def get_all_chunks() -> List[Dict[str, Any]]:
    """Fetches chunks with 60-second in-memory caching from Supabase PostgreSQL."""
    global _CHUNKS_CACHE, _CHUNKS_CACHE_TIME
    now = time.time()
    
    if _CHUNKS_CACHE is not None and (now - _CHUNKS_CACHE_TIME) < 60:
        return _CHUNKS_CACHE

    query = """
    SELECT c.id, c.document_id, c.chunk_index, c.chunk_text, c.embedding, c.metadata,
           d.title, d.category, d.document_key
    FROM document_chunks c
    LEFT JOIN portfolio_documents d ON c.document_id = d.id
    ORDER BY c.chunk_index ASC;
    """
    try:
        with get_db() as conn:
            with conn.cursor() as cur:
                cur.execute(query)
                rows = cur.fetchall()
                chunks = []
                for r in rows:
                    chunks.append({
                        "id": str(r[0]),
                        "document_id": str(r[1]),
                        "chunk_index": r[2],
                        "chunk_text": r[3],
                        "embedding": r[4],
                        "metadata": r[5] if isinstance(r[5], dict) else json.loads(r[5] or "{}"),
                        "title": r[6] or "Portfolio Document",
                        "category": r[7] or "general",
                        "document_key": r[8] or ""
                    })
                _CHUNKS_CACHE = chunks
                _CHUNKS_CACHE_TIME = now
                return chunks
    except Exception as e:
        logger.warning(f"PostgreSQL get_all_chunks error: {e}")
        return _CHUNKS_CACHE or []

# -------------------------------------------------------------
# Document & Chunk Insertion
# -------------------------------------------------------------
def insert_document(
    doc_key: str,
    title: str,
    category: str,
    content: str,
    metadata: dict = None,
    source_type: str = "portfolio",
    source_ref: str = None
) -> str:
    """Inserts or updates a document in Supabase PostgreSQL."""
    if metadata is None:
        metadata = {}
    import hashlib
    content_hash = hashlib.sha256(content.encode("utf-8")).hexdigest()
    doc_id = str(uuid.uuid4())

    query = """
    INSERT INTO portfolio_documents (id, document_key, title, category, source_type, source_ref, content, metadata, content_hash)
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
    ON CONFLICT (document_key) DO UPDATE SET
        title = EXCLUDED.title,
        category = EXCLUDED.category,
        source_type = EXCLUDED.source_type,
        source_ref = EXCLUDED.source_ref,
        content = EXCLUDED.content,
        metadata = EXCLUDED.metadata,
        content_hash = EXCLUDED.content_hash,
        updated_at = NOW()
    RETURNING id;
    """
    with get_db() as conn:
        with conn.cursor() as cur:
            cur.execute(
                query,
                (doc_id, doc_key, title, category, source_type, source_ref, content, json.dumps(metadata), content_hash)
            )
            row = cur.fetchone()
            return str(row[0]) if row else doc_id

def insert_chunk(
    doc_id: str,
    chunk_index: int,
    chunk_text: str,
    embedding: list[float] = None,
    metadata: dict = None
) -> str:
    """Inserts a document chunk with vector embedding into Supabase PostgreSQL."""
    if metadata is None:
        metadata = {}
    chunk_id = str(uuid.uuid4())

    query = """
    INSERT INTO document_chunks (id, document_id, chunk_index, chunk_text, embedding, metadata)
    VALUES (%s, %s, %s, %s, %s, %s)
    RETURNING id;
    """
    with get_db() as conn:
        with conn.cursor() as cur:
            cur.execute(
                query,
                (chunk_id, doc_id, chunk_index, chunk_text, embedding, json.dumps(metadata))
            )
            row = cur.fetchone()
            return str(row[0]) if row else chunk_id

# -------------------------------------------------------------
# Visitor Analytics & Audit Events
# -------------------------------------------------------------
def record_visitor_analytics(
    page_path: str,
    ip_address: Optional[str] = None,
    user_agent: Optional[str] = None,
    referrer: Optional[str] = None,
    session_id: Optional[str] = None,
    event_name: str = "pageview",
    event_data: dict = None
):
    """Logs visitor traffic into Supabase PostgreSQL."""
    query = """
    INSERT INTO visitor_analytics (page_path, ip_address, user_agent, referrer, session_id, event_name, event_data)
    VALUES (%s, %s, %s, %s, %s, %s, %s);
    """
    try:
        with get_db() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    query,
                    (page_path, ip_address, user_agent, referrer, session_id, event_name, json.dumps(event_data or {}))
                )
    except Exception as e:
        logger.error(f"Failed to record visitor analytics: {e}")
