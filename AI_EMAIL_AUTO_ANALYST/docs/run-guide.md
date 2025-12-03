# Run Guide (Docker + Windows PowerShell)

This guide shows precise steps to run the AI Email Auto Analyst locally using Docker.

## Prerequisites
- Windows with PowerShell 5.1
- Docker Desktop installed and running
- OpenAI API key (or Hugging Face token if using HF embeddings)
- Gmail App Password (SMTP) or Gmail OAuth credentials (for Gmail nodes)

## 1) Configure Environment
Copy `.env.example` to `.env` and set values:

```
# n8n
N8N_HOST=localhost
N8N_PORT=5678
N8N_PROTOCOL=http
N8N_ENCRYPTION_KEY=replace_with_secure_key

# Qdrant
QDRANT_URL=http://qdrant:6333
QDRANT_COLLECTION=email_brain_1536

# OpenAI
OPENAI_API_KEY=sk-...

# Hugging Face (optional)
HF_API_TOKEN=hf_...

# Postgres (Chat Memory)
POSTGRES_USER=postgres
POSTGRES_PASSWORD=tisha
POSTGRES_DB=Email_ai

# Gmail SMTP (optional for send)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your@gmail.com
SMTP_PASSWORD=your_app_password
```

## 2) Start Services
Run from the project root:

```powershell
# pull images and start stack
docker compose pull; docker compose up -d

# verify containers
docker compose ps
```

Open n8n: `http://localhost:5678/`

## 3) Import Workflows
- In n8n, import JSON workflows from the `workflows/` folder:
  - Gmail Ingest + Vector Upsert
  - RAG Chat Webhook
  - Official AI nodes variant (OpenAI Chat + Embeddings + Qdrant)

## 4) Bind Credentials
- OpenAI: API key
- Gmail: App Password (SMTP) or OAuth credentials for Gmail Trigger/Get/Send nodes
- Postgres: Host `postgres`, Port `5432`, DB `Email_ai`, User `postgres`, Password `tisha`
- Qdrant: Base URL `http://qdrant:6333` (no auth by default)

## 5) Activate and Test
- Activate workflows in n8n.
- Send a test email to your Gmail.
- Confirm classification and Qdrant upsert.
- Hit the RAG webhook and verify grounded answers.

## 6) Troubleshooting
- Qdrant vector size mismatch: Recreate the collection with correct dimension (1536 for OpenAI, 384 for HF).
- Network checks (inside n8n container):

```powershell
# check Postgres reachability
docker exec -it n8n-email-brain sh -c "nc -zv postgres 5432 || echo blocked"

# check Gmail SMTP ports
docker exec -it n8n-email-brain sh -c "nc -zv smtp.gmail.com 587 || echo blocked; nc -zv smtp.gmail.com 465 || echo blocked"
```

- Missing credentials: Ensure `.env` is filled and n8n credentials are bound to nodes.
- Timezone drift: Set `TZ` in `.env` and n8n settings.

## 7) Stop Services
```powershell
docker compose down
```
