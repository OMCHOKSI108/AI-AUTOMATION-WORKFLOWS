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

Notes:
- This compose file uses a persisted `./n8n` folder for n8n data.
- Basic auth is enabled by default in `.env.example`.

## Quick start — single Docker container (Windows PowerShell)

Run a standalone container (good for quick tests):

```powershell
# create a local folder for persistence if you want
New-Item -Path . -Name "n8n" -ItemType Directory -Force
docker run -it --rm -p 5678:5678 -v ${PWD}\n8n:/home/node/.n8n `
	-e N8N_BASIC_AUTH_ACTIVE=true `
	-e N8N_BASIC_AUTH_USER=admin `
	-e N8N_BASIC_AUTH_PASSWORD=changeme `
	n8nio/n8n:latest
```

Open http://localhost:5678 and sign in with the credentials from the command.

## Importing the project's workflow
When a `workflow.json` file is present in this repository you can:

- In the n8n editor go to 'Import' and paste the JSON, or
- Use the 'Import from file' option and choose the workflow JSON.

## Recommended hosting for the demo video
GitHub READMEs don't reliably play MP4 inline. For a better user experience:

- Upload `src/food_delivery_automation.mp4` to YouTube and use a thumbnail link in the README.
- Or convert a short clip to an animated GIF (small, embedded preview).

See the converted-example and commands in the repo README if you need GIF conversion help.

## Files added
- `docker-compose.yml` — quick Docker Compose for n8n
- `.env.example` — example environment variables for n8n

## Next steps you can ask me to do
- Convert a short clip to GIF and add it to the repo (I can generate ffmpeg commands).
- Add a sample `workflow.json` with a minimal n8n workflow that triggers a simple AI agent (requires details on provider/API keys).
- Help with deploying to a public host or generating a YouTube upload description/title.

---

