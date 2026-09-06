import os
import json
import sqlite3
import psycopg2
from psycopg2.extras import execute_batch
import pgvector.psycopg2
import mysql.connector
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))

# Supabase connection parameters
PG_HOST = os.getenv("SUPABASE_DB_HOST", "db.brmafvpjvdgieelcgivi.supabase.co")
PG_USER = os.getenv("SUPABASE_DB_USER", "portfolio_app")
PG_PASSWORD = os.getenv("SUPABASE_DB_PASSWORD", "")
PG_DB = os.getenv("SUPABASE_DB_NAME", "postgres")
PG_PORT = int(os.getenv("SUPABASE_DB_PORT", "5432"))

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
BACKEND_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))

print("Connecting to Supabase PostgreSQL...")
pg_conn = psycopg2.connect(
    host=PG_HOST,
    user=PG_USER,
    password=PG_PASSWORD,
    dbname=PG_DB,
    port=PG_PORT,
    connect_timeout=10
)
pgvector.psycopg2.register_vector(pg_conn)
pg_cur = pg_conn.cursor()

# -------------------------------------------------------------
# 1. MIGRATE CONTACT SUBMISSIONS (MySQL 15 rows + SQLite 2 rows)
# -------------------------------------------------------------
print("\n>>> Phase 1: Migrating Contact Submissions...")

# Fetch MySQL records
mysql_conn = mysql.connector.connect(
    host="localhost",
    user="root",
    password="root",
    database="portfolio"
)
m_cur = mysql_conn.cursor(dictionary=True)
m_cur.execute("SELECT * FROM contact_submissions ORDER BY id ASC")
mysql_rows = m_cur.fetchall()
m_cur.close()
mysql_conn.close()
print(f"Loaded {len(mysql_rows)} records from MySQL contact_submissions.")

# Fetch SQLite records
root_portfolio_db = os.path.join(ROOT_DIR, "portfolio.db")
s_conn = sqlite3.connect(root_portfolio_db)
s_conn.row_factory = sqlite3.Row
s_cur = s_conn.cursor()
sqlite_rows = [dict(r) for r in s_cur.execute("SELECT * FROM contact_submissions ORDER BY id ASC").fetchall()]
s_cur.close()
s_conn.close()
print(f"Loaded {len(sqlite_rows)} records from SQLite portfolio.db.")

# Prepare contact records
contacts_to_insert = []
# MySQL records (IDs 1-15)
for r in mysql_rows:
    contacts_to_insert.append((
        r["id"],
        r["name"],
        r["email"],
        r.get("subject"),
        r["message"],
        r.get("status", "new"),
        r.get("ip_address"),
        r.get("user_agent"),
        r.get("created_at"),
        r.get("created_at")
    ))

# SQLite orphaned records (IDs 16, 17)
next_id = max([r["id"] for r in mysql_rows]) + 1
for r in sqlite_rows:
    contacts_to_insert.append((
        next_id,
        r["name"],
        r["email"],
        r.get("subject"),
        r["message"],
        r.get("status", "new"),
        r.get("ip_address"),
        r.get("user_agent"),
        r.get("created_at"),
        r.get("created_at")
    ))
    next_id += 1

print(f"Total contacts to insert into Supabase: {len(contacts_to_insert)}")

insert_contact_query = """
INSERT INTO contact_submissions (id, name, email, subject, message, status, ip_address, user_agent, created_at, updated_at)
VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    email = EXCLUDED.email,
    subject = EXCLUDED.subject,
    message = EXCLUDED.message,
    status = EXCLUDED.status,
    ip_address = EXCLUDED.ip_address,
    user_agent = EXCLUDED.user_agent,
    created_at = EXCLUDED.created_at,
    updated_at = EXCLUDED.updated_at;
"""

execute_batch(pg_cur, insert_contact_query, contacts_to_insert)
pg_conn.commit()

# Reset sequence
pg_cur.execute("SELECT setval('contact_submissions_id_seq', (SELECT MAX(id) FROM contact_submissions));")
pg_conn.commit()
print("[OK] Contact submissions migrated and sequence updated.")

# -------------------------------------------------------------
# 2. MIGRATE PORTFOLIO DOCUMENTS (17 records from portfolio_ai.db)
# -------------------------------------------------------------
print("\n>>> Phase 2: Migrating Portfolio Documents...")
root_ai_db = os.path.join(ROOT_DIR, "portfolio_ai.db")
ai_conn = sqlite3.connect(root_ai_db)
ai_conn.row_factory = sqlite3.Row
ai_cur = ai_conn.cursor()

docs = [dict(r) for r in ai_cur.execute("SELECT * FROM portfolio_documents ORDER BY created_at ASC").fetchall()]
print(f"Loaded {len(docs)} documents from SQLite portfolio_ai.db.")

docs_to_insert = []
for d in docs:
    meta = d.get("metadata")
    if isinstance(meta, str):
        try:
            meta = json.loads(meta)
        except:
            meta = {}
    docs_to_insert.append((
        d["id"],
        d["document_key"],
        d["title"],
        d["category"],
        d.get("source_type", "portfolio"),
        d.get("source_ref"),
        d["content"],
        json.dumps(meta),
        d["content_hash"],
        d.get("created_at"),
        d.get("updated_at")
    ))

insert_doc_query = """
INSERT INTO portfolio_documents (id, document_key, title, category, source_type, source_ref, content, metadata, content_hash, created_at, updated_at)
VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
ON CONFLICT (document_key) DO UPDATE SET
    title = EXCLUDED.title,
    category = EXCLUDED.category,
    source_type = EXCLUDED.source_type,
    source_ref = EXCLUDED.source_ref,
    content = EXCLUDED.content,
    metadata = EXCLUDED.metadata,
    content_hash = EXCLUDED.content_hash,
    updated_at = EXCLUDED.updated_at;
"""

execute_batch(pg_cur, insert_doc_query, docs_to_insert)
pg_conn.commit()
print(f"[OK] {len(docs_to_insert)} portfolio documents migrated.")

# -------------------------------------------------------------
# 3. MIGRATE DOCUMENT CHUNKS (17 chunks with 768-dim embeddings)
# -------------------------------------------------------------
print("\n>>> Phase 3: Migrating Document Chunks & Vector Embeddings...")
chunks = [dict(r) for r in ai_cur.execute("SELECT * FROM document_chunks ORDER BY chunk_index ASC").fetchall()]
ai_cur.close()
ai_conn.close()
print(f"Loaded {len(chunks)} chunks from SQLite portfolio_ai.db.")

chunks_to_insert = []
for c in chunks:
    meta = c.get("metadata")
    if isinstance(meta, str):
        try:
            meta = json.loads(meta)
        except:
            meta = {}
    
    emb = c.get("embedding")
    if isinstance(emb, str):
        try:
            emb = json.loads(emb)
        except:
            emb = None

    chunks_to_insert.append((
        c["id"],
        c["document_id"],
        c["chunk_index"],
        c["chunk_text"],
        emb,
        json.dumps(meta),
        c.get("created_at")
    ))

insert_chunk_query = """
INSERT INTO document_chunks (id, document_id, chunk_index, chunk_text, embedding, metadata, created_at)
VALUES (%s, %s, %s, %s, %s, %s, %s)
ON CONFLICT (id) DO UPDATE SET
    document_id = EXCLUDED.document_id,
    chunk_index = EXCLUDED.chunk_index,
    chunk_text = EXCLUDED.chunk_text,
    embedding = EXCLUDED.embedding,
    metadata = EXCLUDED.metadata;
"""

execute_batch(pg_cur, insert_chunk_query, chunks_to_insert)
pg_conn.commit()
print(f"[OK] {len(chunks_to_insert)} document chunks & vectors migrated.")

pg_cur.close()
pg_conn.close()
print("\nDATA MIGRATION FINISHED SUCCESSFULLY!")
