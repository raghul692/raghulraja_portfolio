-- ====================================================================
-- Unified Supabase PostgreSQL + pgvector Migration Schema
-- Architecture: Portfolio AI System & Persistent Production Database
-- ====================================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS vector;

-- 1. Contact Submissions Table (Migrated from MySQL & SQLite)
CREATE TABLE IF NOT EXISTS contact_submissions (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(255),
    message TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'new',
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contact_submissions_email ON contact_submissions(email);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at ON contact_submissions(created_at DESC);

-- 2. Visitor Analytics Table
CREATE TABLE IF NOT EXISTS visitor_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page_path TEXT NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    referrer TEXT,
    session_id TEXT,
    event_name TEXT DEFAULT 'pageview',
    event_data JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_visitor_analytics_created_at ON visitor_analytics(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_visitor_analytics_session_id ON visitor_analytics(session_id);

-- 3. Portfolio Documents Registry
CREATE TABLE IF NOT EXISTS portfolio_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_key TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    category TEXT NOT NULL, -- project, skill, experience, education, cert, bio, contact
    source_type TEXT NOT NULL DEFAULT 'portfolio', -- portfolio, github_repo, manual
    source_ref TEXT,
    content TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    content_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_portfolio_documents_category ON portfolio_documents(category);
CREATE INDEX IF NOT EXISTS idx_portfolio_documents_doc_key ON portfolio_documents(document_key);

-- 4. Document Chunks with pgvector & Full-Text Search (FTS)
CREATE TABLE IF NOT EXISTS document_chunks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID NOT NULL REFERENCES portfolio_documents(id) ON DELETE CASCADE,
    chunk_index INT NOT NULL,
    chunk_text TEXT NOT NULL,
    embedding vector(768), -- Gemini text-embedding-004 vector dimension
    metadata JSONB DEFAULT '{}'::jsonb,
    fts_tokens tsvector GENERATED ALWAYS AS (to_tsvector('english', chunk_text)) STORED,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_document_chunks_document_id ON document_chunks(document_id);
CREATE INDEX IF NOT EXISTS idx_document_chunks_fts ON document_chunks USING gin(fts_tokens);
CREATE INDEX IF NOT EXISTS idx_document_chunks_vector_hnsw ON document_chunks USING hnsw (embedding vector_cosine_ops);

-- 5. ATS Resume Analyses
CREATE TABLE IF NOT EXISTS ats_analyses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id TEXT,
    target_role TEXT NOT NULL,
    overall_score NUMERIC(5,2) NOT NULL,
    category_scores JSONB NOT NULL,
    matched_keywords JSONB DEFAULT '[]'::jsonb,
    missing_keywords JSONB DEFAULT '[]'::jsonb,
    actionable_recommendations JSONB DEFAULT '[]'::jsonb,
    raw_summary TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ats_analyses_created_at ON ats_analyses(created_at DESC);

-- 6. Generated Resumes
CREATE TABLE IF NOT EXISTS generated_resumes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id TEXT,
    target_role TEXT NOT NULL,
    resume_title TEXT NOT NULL,
    content_json JSONB NOT NULL,
    docx_url TEXT,
    pdf_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_generated_resumes_created_at ON generated_resumes(created_at DESC);

-- 7. Placement Attempts & Evaluations
CREATE TABLE IF NOT EXISTS placement_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module_type TEXT NOT NULL, -- aptitude, grammar, gd, hr, tech
    question_or_topic TEXT NOT NULL,
    user_answer TEXT,
    score NUMERIC(5,2),
    feedback JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_placement_attempts_module ON placement_attempts(module_type);
CREATE INDEX IF NOT EXISTS idx_placement_attempts_created_at ON placement_attempts(created_at DESC);

-- 8. GitHub Webhook Audit Log
CREATE TABLE IF NOT EXISTS github_sync_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type TEXT NOT NULL,
    repository TEXT NOT NULL,
    commit_sha TEXT,
    status TEXT NOT NULL,
    log_details JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_github_sync_events_created_at ON github_sync_events(created_at DESC);

-- 9. Semantic Vector Search Function
CREATE OR REPLACE FUNCTION match_portfolio_chunks (
    query_embedding vector(768),
    match_threshold float DEFAULT 0.2,
    match_count int DEFAULT 5
)
RETURNS TABLE (
    id UUID,
    document_id UUID,
    document_key TEXT,
    title TEXT,
    category TEXT,
    chunk_index INT,
    chunk_text TEXT,
    metadata JSONB,
    similarity float
)
LANGUAGE plpgsql
STABLE
AS $$
BEGIN
    RETURN QUERY
    SELECT
        c.id,
        c.document_id,
        d.document_key,
        d.title,
        d.category,
        c.chunk_index,
        c.chunk_text,
        c.metadata,
        (1 - (c.embedding <=> query_embedding))::float AS similarity
    FROM document_chunks c
    JOIN portfolio_documents d ON c.document_id = d.id
    WHERE c.embedding IS NOT NULL
      AND (1 - (c.embedding <=> query_embedding)) > match_threshold
    ORDER BY c.embedding <=> query_embedding
    LIMIT match_count;
END;
$$;
