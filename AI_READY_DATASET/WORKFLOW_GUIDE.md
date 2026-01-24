# 📋 Workflow Execution Guide

## Step-by-Step Instructions for Running the Ultimate Web Scraper

### 🚀 Initial Setup

#### 1. Environment Preparation
```bash
# Navigate to project directory
cd AI-AUTOMATION-WORKFLOWS

# Start all services
docker-compose up -d

# Verify all containers are running
docker ps
```

#### 2. Download AI Models (First Time Only)
```bash
# Download phi3:mini model (lightweight chat model)
docker exec ai-automation-workflows-ollama-1 ollama pull phi3:mini

# Download llama3.2-vision model (vision analysis)
docker exec ai-automation-workflows-ollama-1 ollama pull llama3.2-vision:11b

# Verify models are installed
docker exec ai-automation-workflows-ollama-1 ollama list
```

#### 3. n8n Workflow Setup
1. Open n8n dashboard: `http://localhost:5678`
2. Click "Import from file" 
3. Select: `AI-ready Datasets for fine-tuning, RAG, or domain-specific training.json`
4. Click "Import"
5. **Activate the workflow** (toggle switch in top-right)

#### 4. Configure Credentials
1. In n8n, go to **Settings** → **Credentials**
2. Add **BrightData** credentials:
   - Name: "BrightData account"
   - API Token: `[Your BrightData API Key]`
   - Zone: "web_unlocker3" (or your zone)

### 🎯 Execution Workflow

#### Method 1: Direct URL Scraping
Use when you have a specific page URL to scrape:

```bash
curl -X POST http://localhost:5678/webhook-test/67d77918-2d5b-48c1-ae73-2004b32125f0 \
-H "Content-Type: application/json" \
-d '{
  "Target Url": "https://github.com/microsoft/vscode",
  "Target data": [
    {
      "DataName": "Stars",
      "description": "Number of GitHub stars"
    },
    {
      "DataName": "Language",
      "description": "Primary programming language"
    },
    {
      "DataName": "Last Updated",
      "description": "Last commit date"
    }
  ]
}'
```

#### Method 2: Search-Based Scraping
Use when you want to find pages about a specific subject:

```bash
curl -X POST http://localhost:5678/webhook-test/67d77918-2d5b-48c1-ae73-2004b32125f0 \
-H "Content-Type: application/json" \
-d '{
  "subject": "Tesla Model 3",
  "Url": "tesla.com",
  "Target data": [
    {
      "DataName": "Price",
      "description": "Current starting price"
    },
    {
      "DataName": "Range",
      "description": "EPA estimated range"
    }
  ]
}'
```

#### Method 3: Authenticated Scraping (with cookies)
Use when the target site requires login:

```bash
curl -X POST http://localhost:5678/webhook-test/67d77918-2d5b-48c1-ae73-2004b32125f0 \
-H "Content-Type: application/json" \
-d '{
  "Target Url": "https://example.com/dashboard",
  "Target data": [
    {
      "DataName": "Account Balance",
      "description": "Current account balance"
    }
  ],
  "cookies": [
    {
      "cookie": {
        "name": "session_id",
        "value": "abc123xyz",
        "domain": ".example.com",
        "path": "/",
        "secure": true,
        "httpOnly": true,
        "sameSite": "Lax"
      }
    }
  ]
}'
```

### 📊 Workflow Execution Flow

#### Stage 1: Request Processing
- **Input Validation**: Checks request format and required fields
- **URL Processing**: Determines if direct URL or search-based extraction
- **Data Structure Setup**: Prepares extraction templates

#### Stage 2: Content Discovery  
- **Google Search** (if search mode): Finds relevant pages on target domain
- **URL Extraction**: Identifies the best page for data extraction
- **AI-Powered Selection**: Uses Ollama to choose most relevant URL

#### Stage 3: Browser Automation
- **Selenium Session**: Creates isolated browser instance
- **Anti-Detection**: Applies browser fingerprint masking
- **Navigation**: Loads target page with JavaScript execution

#### Stage 4: Authentication (if needed)
- **Cookie Injection**: Applies session cookies for authenticated access
- **Session Validation**: Ensures successful authentication

#### Stage 5: Content Analysis
- **Screenshot Capture**: Takes visual snapshot of the page
- **AI Vision Analysis**: Ollama vision model analyzes content
- **Content Extraction**: Identifies relevant data based on specifications

#### Stage 6: Data Processing
- **Intelligent Parsing**: Extracts structured data using AI
- **Format Validation**: Ensures data meets specified requirements
- **Response Generation**: Creates formatted JSON output

### 🔧 Configuration Options

#### Proxy Settings
To use proxy (add to Selenium session creation):
```json
"goog:chromeOptions": {
  "args": [
    "--proxy-server=your-proxy:port",
    "--disable-blink-features=AutomationControlled"
  ]
}
```

#### Custom Data Fields
Maximum 5 target data fields per request:
```json
"Target data": [
  {
    "DataName": "Field1",
    "description": "Clear description of what to extract"
  },
  {
    "DataName": "Field2", 
    "description": "Another data point to extract"
  }
]
```

#### Debug Mode
To watch browser automation in real-time:
1. Open VNC viewer: `http://localhost:7900`
2. Watch Selenium browser automation live
3. No password required

### 🔍 Response Format

Successful response:
```json
{
  "output": {
    "Stars": "45,230",
    "Language": "TypeScript", 
    "Last Updated": "2 hours ago"
  }
}
```

Error response:
```json
{
  "Error": "Page crash on the extracted url"
}
```

### 🚨 Troubleshooting Guide

#### Common Issues & Solutions

**1. "HTTP 404: Not Found"**
- **Cause**: Workflow not active or incorrect webhook URL
- **Solution**: Activate workflow in n8n, verify webhook path

**2. "Error fetching options from Ollama"**
- **Cause**: Ollama not running or models not downloaded
- **Solution**: Check `docker ps`, download models with `ollama pull`

**3. "Selenium session creation failed"**
- **Cause**: Insufficient resources or container issues
- **Solution**: Restart containers, ensure 8GB+ RAM available

**4. "Cookies are not for the targeted url"**
- **Cause**: Cookie domain mismatch
- **Solution**: Ensure cookie domain matches target URL domain

**5. "Can't find url"**
- **Cause**: Search couldn't find relevant pages
- **Solution**: Use direct URL method or refine search terms

#### Performance Optimization

1. **Resource Allocation**: Ensure adequate RAM (8GB+) for AI models
2. **Network Settings**: Use fast, stable internet connection
3. **Batch Processing**: Process multiple URLs in separate requests
4. **Rate Limiting**: Add delays between requests to avoid blocking

#### Monitoring & Logs

Monitor execution:
```bash
# Watch all container logs
docker-compose logs -f

# Monitor specific service
docker-compose logs -f ollama
docker-compose logs -f selenium_chrome
docker-compose logs -f n8n
```

### 📈 Advanced Usage

#### Scaling Operations
- Run multiple n8n instances for parallel processing
- Use proxy rotation for large-scale operations
- Implement request queuing for high-volume scenarios

#### Custom Extensions
- Modify workflow for specific site requirements
- Add custom JavaScript execution nodes
- Implement specialized data transformation logic

### 🔐 Security Considerations

- Store sensitive credentials securely in n8n credential manager
- Use HTTPS webhooks in production environments  
- Implement request authentication for public deployments
- Regularly update container images for security patches

### 📞 Support

If you encounter issues:
1. Check this guide first
2. Review container logs for errors
3. Test with simple requests before complex ones
4. Verify all prerequisites are met