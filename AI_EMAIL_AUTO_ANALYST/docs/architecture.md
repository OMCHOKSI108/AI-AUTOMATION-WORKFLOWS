# AI Email Brain — n8n Architecture

## Overview
This project ingests incoming emails, auto-analyzes them (summarize, classify, extract tasks), stores them in a vector database for semantic search, and exposes a chatbot endpoint for natural-language queries like “Show me all urgent supplier emails this week.”

Core stack:
- Orchestrator: n8n
- Vector DB: Qdrant (Dockerized, local)
- LLM: Groq (Llama 3) via OpenAI-compatible API, or OpenAI/Anthropic as a drop-in
- Embeddings: Hugging Face Inference API (all-MiniLM-L6-v2, 384 dims)
- Email: IMAP (works for Gmail via app password) or Gmail OAuth (optional)

## High-Level Architecture
1) Ingestion & Analysis
- Trigger: IMAP (or Gmail) reads unread emails.
- Normalize: Extract subject, sender, body, message-id, date.
- LLM Classification: Summarize, intent, tags (Urgent/Invoice/Meeting/General).
- Embedding: Generate 384-d embedding for email text.
- Upsert to Vector DB: Store `vector` + metadata in Qdrant collection `email_brain`.
- Post-actions: Mark as read, label, and optionally notify Slack for ‘Urgent’.

2) Chat Q&A (RAG)
- Webhook: `/chat` receives a natural-language query.
- Embed Query: Same embedding model.
- Vector Search: Qdrant similarity search (top-k, optional filters by tag/date/sender).
- Compose Context: Build concise context (subjects, summaries, links).
- LLM Answer: Generate answer grounded in retrieved emails, include citations.

3) Reminders & Follow-ups (optional)
- Cron: Hourly/daily check for emails tagged ‘Meeting’/‘Action Required’.
- Conditions: Due date missing or pending follow-up.
- Notify: Email/Slack reminders; update metadata.

## Data Model (Qdrant payload)
- id: message-id (fallback to hash)
- text: truncated/cleaned email body (for debug)
- summary: LLM 1-liner
- intent: short phrase (e.g., “invoice submission”, “meeting request”)
- tags: ["Urgent"|"Invoice"|"Meeting"|"General"] plus team tags
- from, to, subject, date
- threadId (if available), link (message permalink or mailto draft)

## n8n Workflows
1) Email Ingest & Analyze (`workflows/email_ingest_http.json`)
- IMAP Email -> Function (normalize) -> HTTP (LLM classify) -> HTTP (HF embeddings) -> HTTP (Qdrant upsert) -> Conditional notify/label.
- Uses only base nodes + HTTP to keep it portable.

2) Chatbot RAG (`workflows/rag_chat_webhook.json`)
- Webhook -> Function (extract query) -> HTTP (HF embed) -> HTTP (Qdrant search) -> Function (compose context) -> HTTP (LLM answer) -> Respond to Webhook.

## Environment & Credentials
Set via `.env` (see `.env.example`):
- n8n: `N8N_HOST`, `N8N_PORT`, `N8N_PROTOCOL`, `WEBHOOK_URL`, `N8N_ENCRYPTION_KEY`
- Qdrant: `QDRANT_URL`, `QDRANT_COLLECTION`
- LLM: `GROQ_API_KEY` (or `OPENAI_API_KEY`)
- Embeddings: `HF_API_TOKEN`
- Email (IMAP): `EMAIL_IMAP_HOST`, `EMAIL_IMAP_PORT`, `EMAIL_IMAP_SSL`, `EMAIL_IMAP_USER`, `EMAIL_IMAP_PASSWORD`

## Running Locally
1) Copy env: `.env.example` -> `.env`, fill values.
2) Start services:
   - `docker compose up -d`
3) Open n8n: http://localhost:5678
4) Import workflows from `workflows/` and set node credentials using env vars.

## Observability & Reliability
- Retries: Enable in HTTP nodes (LLM, HF, Qdrant) with backoff.
- Dead-letter: On failure, push original item + error to a separate queue/file.
- Idempotency: Use message-id as Qdrant upsert id to avoid duplicates.
- PII: Remove signatures and quoted threads before embedding where possible.

## Known Pitfalls & Fixes
- Gmail OAuth complexity: Prefer IMAP + app password initially for simplicity.
- Empty embeddings: Ensure text fed into embedding node; don’t leave it unconnected.
- Qdrant collection mismatch: If created with wrong vector size, delete and recreate.
- Long emails: Truncate to ~2000-3000 chars before embedding; keep summary in payload.
- Timezones: Set `TZ` on containers and n8n default timezone to match your locale.

## Extensibility
- Add filters to Qdrant search (e.g., `tags contains 'Urgent'`, date >= this week).
- Add Slack/Teams integration for urgent alerts.
- Add Airbyte/Gmail backfill flow to ingest historical emails.
