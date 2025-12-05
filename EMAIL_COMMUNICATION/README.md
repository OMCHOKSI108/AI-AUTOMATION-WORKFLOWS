# Email Communication Automation

This project is an AI-powered autonomous email management system that automates email processing, categorization, extraction, and replies using n8n workflows and a React dashboard.

## Setup

1. Copy `.env.example` to `.env` and fill in your credentials (Gmail OAuth2, API keys).
2. Set up Gmail API credentials in Google Cloud Console.
3. Run `docker-compose up -d` to start all services.
4. Access the dashboard at `http://localhost:4173`.
5. Login with username: `omchoksi` or `omchoksi99@gmail.com`, password: `omchoksi`.
6. Access n8n at `http://localhost:5678` to manage workflows.

## Services

- **Frontend**: React dashboard for viewing email threads.
- **Server**: Node.js API for data access.
- **Postgres**: Database for emails, threads, and extractions.
- **n8n**: Workflow automation using official Gmail nodes.
- **Qdrant**: Vector database (if used).

## Workflow

The n8n workflow uses official Gmail nodes to:
- Monitor Gmail inbox for new emails
- Classify emails with AI (OpenAI GPT-4)
- Extract structured data
- Store in PostgreSQL database
- Send automated replies via Gmail

## Key Features

- **Official Gmail Integration**: Uses n8n's official Gmail Trigger and Send nodes
- **AI-Powered Classification**: GPT-4 for intelligent email categorization
- **Database Storage**: PostgreSQL with proper schema for email threads
- **React Dashboard**: Modern UI for viewing and managing email threads
- **Health Monitoring**: All services include health checks

## Security

- OAuth2 authentication for Gmail
- JWT tokens for API authentication
- Secure credential management in n8n