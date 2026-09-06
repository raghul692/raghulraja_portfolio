# Portfolio Database & Services Architecture

## Primary Database: Supabase PostgreSQL 17 + pgvector

The portfolio application uses a unified Supabase PostgreSQL database for persistent storage, user analytics, and AI vector search.

### Core Tables:
1. `contact_submissions` — Stores contact form inquiries with visitor metadata.
2. `visitor_analytics` — Tracks site interactions and performance metrics.
3. `portfolio_documents` & `document_chunks` — Knowledge base chunks with `vector(768)` HNSW embeddings for RAG queries.
4. `ats_analyses` — AI ATS resume score reports.
5. `generated_resumes` — IEEE/Standard generated resume records.
6. `placement_attempts` — Interview assessment history.
7. `github_sync_events` — Webhook sync history.

## Email Delivery Service: Resend API

Contact notifications are dispatched via **Resend REST API** (HTTPS Port 443) to `raghulraja2006@gmail.com` with automatic reply-to set to the submitter's email address. SMTP (SSL 465) is maintained as a fallback.

## Setup Instructions

1. Configure `backend/.env` with your Supabase and Resend credentials (see `backend/.env.example`).
2. Run migrations: `backend/migrations/02_unified_supabase_schema.sql` (already active in production Supabase).
3. Run backend: `uvicorn main:app --reload`