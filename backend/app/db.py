import requests
import sqlite3
import json
import logging
import uuid
from app.config import settings

logger = logging.getLogger("portfolio_ai_db")

def init_local_db():
    """Initializes local SQLite database for offline vector fallback."""
    conn = sqlite3.connect(settings.LOCAL_DB_PATH)
    cur = conn.cursor()
    
    cur.execute("""
    CREATE TABLE IF NOT EXISTS portfolio_documents (
        id TEXT PRIMARY KEY,
        document_key TEXT UNIQUE NOT NULL,
        title TEXT NOT NULL,
        category TEXT NOT NULL,
        source_type TEXT DEFAULT 'portfolio',
        source_ref TEXT,
        content TEXT NOT NULL,
        metadata TEXT DEFAULT '{}',
        content_hash TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    cur.execute("""
    CREATE TABLE IF NOT EXISTS document_chunks (
        id TEXT PRIMARY KEY,
        document_id TEXT REFERENCES portfolio_documents(id) ON DELETE CASCADE,
        chunk_index INTEGER NOT NULL,
        chunk_text TEXT NOT NULL,
        embedding TEXT, -- JSON array of floats
        metadata TEXT DEFAULT '{}',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    cur.execute("""
    CREATE TABLE IF NOT EXISTS ats_analyses (
        id TEXT PRIMARY KEY,
        session_id TEXT,
        target_role TEXT NOT NULL,
        overall_score REAL NOT NULL,
        category_scores TEXT NOT NULL,
        matched_keywords TEXT DEFAULT '[]',
        missing_keywords TEXT DEFAULT '[]',
        actionable_recommendations TEXT DEFAULT '[]',
        raw_summary TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    cur.execute("""
    CREATE TABLE IF NOT EXISTS generated_resumes (
        id TEXT PRIMARY KEY,
        session_id TEXT,
        target_role TEXT NOT NULL,
        resume_title TEXT NOT NULL,
        content_json TEXT NOT NULL,
        docx_url TEXT,
        pdf_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    cur.execute("""
    CREATE TABLE IF NOT EXISTS placement_attempts (
        id TEXT PRIMARY KEY,
        module_type TEXT NOT NULL,
        question_or_topic TEXT NOT NULL,
        user_answer TEXT,
        score REAL,
        feedback TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    conn.commit()
    conn.close()

# Initialize SQLite database on module import
try:
    init_local_db()
except Exception as e:
    logger.warning(f"Local SQLite init warning: {e}")


def supabase_headers():
    return {
        "apikey": settings.SUPABASE_ANON_KEY,
        "Authorization": f"Bearer {settings.SUPABASE_ANON_KEY}",
        "Content-Type": "application/json",
        "Prefer": "return=representation"
    }


def insert_document(doc_key: str, title: str, category: str, content: str, metadata: dict = None, source_type: str = "portfolio"):
    """Inserts a document into Supabase REST API & Local SQLite."""
    if metadata is None:
        metadata = {}
    doc_id = str(uuid.uuid4())
    import hashlib
    content_hash = hashlib.sha256(content.encode("utf-8")).hexdigest()

    doc_payload = {
        "id": doc_id,
        "document_key": doc_key,
        "title": title,
        "category": category,
        "source_type": source_type,
        "content": content,
        "metadata": metadata,
        "content_hash": content_hash
    }

    # 1. Supabase REST Call
    try:
        url = f"{settings.SUPABASE_URL}/rest/v1/portfolio_documents"
        res = requests.post(url, headers=supabase_headers(), json=doc_payload, timeout=5)
        if res.status_code in (200, 201):
            logger.info(f"Inserted document '{doc_key}' into Supabase.")
    except Exception as e:
        logger.warning(f"Supabase document insert failed: {e}")

    # 2. Local SQLite Call
    try:
        conn = sqlite3.connect(settings.LOCAL_DB_PATH)
        cur = conn.cursor()
        cur.execute("""
        INSERT OR REPLACE INTO portfolio_documents 
        (id, document_key, title, category, source_type, content, metadata, content_hash)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, (doc_id, doc_key, title, category, source_type, content, json.dumps(metadata), content_hash))
        conn.commit()
        conn.close()
    except Exception as e:
        logger.error(f"Local SQLite document insert error: {e}")

    return doc_id


def insert_chunk(doc_id: str, chunk_index: int, chunk_text: str, embedding: list[float] = None, metadata: dict = None):
    """Inserts a document chunk with vector embedding into Supabase REST & Local SQLite."""
    if metadata is None:
        metadata = {}
    chunk_id = str(uuid.uuid4())

    chunk_payload = {
        "id": chunk_id,
        "document_id": doc_id,
        "chunk_index": chunk_index,
        "chunk_text": chunk_text,
        "metadata": metadata
    }
    if embedding:
        chunk_payload["embedding"] = embedding

    # 1. Supabase REST Call
    try:
        url = f"{settings.SUPABASE_URL}/rest/v1/document_chunks"
        res = requests.post(url, headers=supabase_headers(), json=chunk_payload, timeout=5)
        if res.status_code in (200, 201):
            logger.info(f"Inserted chunk #{chunk_index} into Supabase.")
    except Exception as e:
        logger.warning(f"Supabase chunk insert failed: {e}")

    # 2. Local SQLite Call
    try:
        conn = sqlite3.connect(settings.LOCAL_DB_PATH)
        cur = conn.cursor()
        cur.execute("""
        INSERT INTO document_chunks (id, document_id, chunk_index, chunk_text, embedding, metadata)
        VALUES (?, ?, ?, ?, ?, ?)
        """, (chunk_id, doc_id, chunk_index, chunk_text, json.dumps(embedding or []), json.dumps(metadata)))
        conn.commit()
        conn.close()
    except Exception as e:
        logger.error(f"Local SQLite chunk insert error: {e}")

    return chunk_id


def get_all_chunks():
    """Fetches chunks from Supabase or fallback Local SQLite."""
    try:
        url = f"{settings.SUPABASE_URL}/rest/v1/document_chunks?select=*,portfolio_documents(title,category,document_key)"
        res = requests.get(url, headers=supabase_headers(), timeout=5)
        if res.status_code == 200 and len(res.json()) > 0:
            return res.json()
    except Exception as e:
        logger.warning(f"Supabase get_all_chunks failed: {e}")

    # Fallback to local SQLite
    try:
        conn = sqlite3.connect(settings.LOCAL_DB_PATH)
        conn.row_factory = sqlite3.Row
        cur = conn.cursor()
        rows = cur.execute("""
        SELECT c.*, d.title, d.category, d.document_key 
        FROM document_chunks c
        LEFT JOIN portfolio_documents d ON c.document_id = d.id
        """).fetchall()
        result = [dict(row) for row in rows]
        conn.close()
        return result
    except Exception as e:
        logger.error(f"Local SQLite get_all_chunks error: {e}")
        return []
