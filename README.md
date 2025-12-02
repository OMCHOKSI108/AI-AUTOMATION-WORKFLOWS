# AI Agents Automation (n8n)

This repository will host an AI-powered Food Delivery Automation project built on n8n (workflow automation). The goal: run n8n locally (Docker), import the project's workflows, and connect AI agents for customer interaction (Telegram/WhatsApp) and Google Sheets.

## What this repo contains
- Project demo video: `src/food_delivery_automation.mp4` (download / external-host recommended)
- n8n workflow(s) (importable JSON) — see `workflow.json` when added
- Docker convenience files to run n8n locally: `docker-compose.yml` and `.env.example`

## Quick start — Docker Compose (recommended)

1. Copy `.env.example` to `.env` and edit credentials as needed.

2. Start n8n:

```powershell
docker-compose up -d
```

3. Open the editor at: http://localhost:5678
## Documentation Moved

All markdown documentation has been relocated to the `docs/` directory for organization.

### Quick Links
- Main index: `docs/index.md`
- Updated overview: `docs/DATA_CLEANING_WORKFLOW/README_new.md`
- Production details: `docs/DATA_CLEANING_WORKFLOW/README_PRODUCTION.md`
- Quick start: `docs/DATA_CLEANING_WORKFLOW/QUICKSTART.md`
- API endpoints: `docs/api_endpoints.txt`

### Legacy Blueprint
Previous architecture blueprint retained at `docs/README_ROOT_LEGACY.md`.

### Next Actions
Consider merging duplicate READMEs and converting `api_endpoints.txt` to richer markdown.
```

