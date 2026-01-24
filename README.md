# AI Automation Workflows (n8n)

Collection of AI-powered automation workflows built on n8n, featuring web scraping, data processing, and AI agent integrations.

## Projects Overview

| Project Name | Description | Category | Link |
|-------------|-------------|----------|------|
| **AI Dataset Creator** | Automated pipeline for creating AI training datasets from web content using BrightData, Ollama models, and Pinecone vector storage | Data Collection, AI Processing | [AI_READY_DATASET/](AI_READY_DATASET/) |
| **Ultimate Web Scraper** | Advanced Selenium-based web scraper with anti-detection, cookie support, and AI-powered content analysis using local Ollama models | Web Scraping, Automation | [AI_READY_DATASET/](AI_READY_DATASET/) |
| **Data Cleaning Workflow** | Comprehensive data processing pipeline with frontend interface, backend API, and automated data validation and cleaning | Data Processing, API | [DATA_CLEANING_WORKFLOW/](DATA_CLEANING_WORKFLOW/) |
| **Email Communication System** | Automated email processing and communication workflows with AI-powered analysis and response generation | Communication, AI | [EMAIL_COMMUNICATION/](EMAIL_COMMUNICATION/) |
| **Multi-Agent Research System** | AI research agents that collaborate to gather, analyze, and synthesize information from multiple sources | AI Research, Multi-Agent | [MULTI_AGENT_RESEARCH_SYSTEM/](MULTI_AGENT_RESEARCH_SYSTEM/) |
| **Multi-Modal RAG Agent** | Retrieval-Augmented Generation system supporting text, images, and documents with vector search capabilities | RAG, Multi-Modal AI | [MULTI_MODEL_RAG_AGENT/](MULTI_MODEL_RAG_AGENT/) |
| **Food Delivery Automation** | AI agents for customer interaction via Telegram/WhatsApp with Google Sheets integration (Legacy Demo) | Customer Service, Legacy | [FOOD_DELIVERY_WORKFLOW/](FOOD_DELIVERY_WORKFLOW/) |

## Quick start — Docker Compose (recommended)

1. Copy `.env.example` to `.env` and edit credentials as needed.

2. Start n8n:

```powershell
docker-compose up -d
```

3. Open the n8n editor at: http://localhost:5678
