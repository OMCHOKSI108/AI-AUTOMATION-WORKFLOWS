# AI Automation Workflows (n8n)

Collection of AI-powered automation workflows built on n8n, featuring web scraping, data processing, and AI agent integrations.

## Projects

### 🤖 AI Dataset Creator (`AI_READY_DATASET/`)
Automated pipeline for creating AI training datasets from web content:
- Web scraping with BrightData
- AI-powered content extraction and formatting
- Vector database storage with Pinecone
- Web interface for easy dataset creation

### 🍕 Food Delivery Automation (Legacy)
- AI agents for customer interaction (Telegram/WhatsApp)
- Google Sheets integration
- Project demo video: `src/food_delivery_automation.mp4`

## What this repo contains
- Multiple n8n workflow JSON files (importable)
- Web interfaces and API servers
- Docker convenience files: `docker-compose.yml` and `.env.example`

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

