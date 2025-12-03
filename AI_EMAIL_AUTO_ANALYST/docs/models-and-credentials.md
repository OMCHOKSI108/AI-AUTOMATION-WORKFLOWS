# Models and Credentials

## Models
- Chat: OpenAI `gpt-4o-mini` (fast, capable; configurable per node).
- Embeddings:
  - OpenAI `text-embedding-3-small` (1536 dims) for official n8n AI nodes flow.
  - Hugging Face `sentence-transformers/all-MiniLM-L6-v2` (384 dims) for HTTP-based flow.

## Vector Store
- Qdrant collection names should reflect dimension:
  - `email_brain_1536` for OpenAI embeddings
  - `email_brain_384` for HF embeddings

## Credentials
- OpenAI:
  - `OPENAI_API_KEY`
- Hugging Face (optional):
  - `HF_API_TOKEN`
- Gmail:
  - For SMTP send: Gmail App Password (`SMTP_USER`, `SMTP_PASSWORD`) with `smtp.gmail.com:587` (STARTTLS) or `:465` (SSL).
  - For Gmail nodes: OAuth credential (Client ID/Secret) or use App Password where appropriate.
- Qdrant:
  - Local Docker service at `http://qdrant:6333` (no auth by default).
- Postgres (Chat Memory):
  - Host: `postgres` (Docker service name)
  - Port: `5432`
  - Database: `Email_ai`
  - User: `postgres`
  - Password: `tisha` (or per `.env`)

## Notes
- Ensure the embedding dimension matches the collection; otherwise recreate the Qdrant collection.
- Keep `.env` secrets out of version control unless necessary; rotate keys regularly.
- For corporate Gmail, prefer OAuth. App Passwords require 2FA and administrator allowance.
