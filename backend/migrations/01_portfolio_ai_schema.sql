-- Portfolio AI Database Migration Schema
-- Extension pgvector is enabled via Supabase

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Document Registry Table
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

-- 2. Document Chunks with pgvector & Full-Text Search (FTS)
CREATE TABLE IF NOT EXISTS document_chunks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID REFERENCES portfolio_documents(id) ON DELETE CASCADE,
    chunk_index INT NOT NULL,
    chunk_text TEXT NOT NULL,
    embedding vector(768), -- Gemini text-embedding-004 vector dimension
    metadata JSONB DEFAULT '{}'::jsonb,
    fts_tokens tsvector GENERATED ALWAYS AS (to_tsvector('english', chunk_text)) STORED,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for fast vector search and full text search
CREATE INDEX IF NOT EXISTS idx_document_chunks_fts ON document_chunks USING gin(fts_tokens);
CREATE INDEX IF NOT EXISTS idx_document_chunks_document_id ON document_chunks(document_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_documents_category ON portfolio_documents(category);

-- HNSW Vector Index for Cosine Distance
CREATE INDEX IF NOT EXISTS idx_document_chunks_vector_hnsw 
ON document_chunks USING hnsw (embedding vector_cosine_ops);

-- 3. Knowledge Versions
CREATE TABLE IF NOT EXISTS knowledge_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    version_tag TEXT NOT NULL,
    commit_hash TEXT,
    total_documents INT NOT NULL DEFAULT 0,
    total_chunks INT NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. ATS Resume Analyses
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

-- 5. Generated Resumes
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

-- 6. Placement Attempts & Evaluations
CREATE TABLE IF NOT EXISTS placement_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module_type TEXT NOT NULL, -- aptitude, grammar, gd, hr, tech
    question_or_topic TEXT NOT NULL,
    user_answer TEXT,
    score NUMERIC(5,2),
    feedback JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. GitHub Webhook Audit Log
CREATE TABLE IF NOT EXISTS github_sync_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type TEXT NOT NULL,
    repository TEXT NOT NULL,
    commit_sha TEXT,
    status TEXT NOT NULL,
    log_details JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
