# Insight Weaver — Setup Guide

**Time to Setup:** ~30 minutes  
**Difficulty:** Intermediate  
**Prerequisites:** Node.js, Docker, Tableau Cloud account, Salesforce Dev Org

---

## Quick Start

```bash
# Clone → Install → Configure → Run
git clone https://github.com/your-org/insight-weaver.git
cd insight-weaver
cp .env.example .env.local
# Edit .env.local with your credentials
docker-compose up --build
```

Open http://localhost:3000 — you're live.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Repository Setup](#repository-setup)
3. [Tableau Cloud Configuration](#tableau-cloud-configuration)
4. [Salesforce Configuration](#salesforce-configuration)
5. [Environment Variables](#environment-variables)
6. [Local Development](#local-development)
7. [Docker Deployment](#docker-deployment)
8. [Slack Integration](#slack-integration)
9. [Verification Checklist](#verification-checklist)
10. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### System Requirements

| Requirement | Minimum Version | Check Command |
|-------------|-----------------|---------------|
| Node.js | 18.0.0 | `node --version` |
| npm | 9.0.0 | `npm --version` |
| Python | 3.10 | `python3 --version` |
| Docker | 24.0.0 | `docker --version` |
| Docker Compose | 2.20.0 | `docker-compose --version` |
| Git | 2.40.0 | `git --version` |

### Required Accounts

| Service | Purpose | Sign Up |
|---------|---------|---------|
| Tableau Cloud | Analytics + Embedding | [tableau.com/products/cloud](https://www.tableau.com/products/cloud) |
| Salesforce Developer Org | Data Cloud + Auth | [developer.salesforce.com](https://developer.salesforce.com/signup) |
| Slack Workspace | Alert routing | [slack.com](https://slack.com/get-started) |
| GitHub | Source control | [github.com](https://github.com/signup) |

---

## Repository Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/insight-weaver.git
cd insight-weaver
```

### 2. Install Dependencies

```bash
# Frontend (Narrative Hub)
cd narrative-hub
npm install

# Backend (API Server)
cd ../api-server
npm install

# Python data prep scripts
cd ../data-prep
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Return to root
cd ..
```

### 3. Verify Installation

```bash
# Check all packages installed correctly
cd narrative-hub && npm list --depth=0
cd ../api-server && npm list --depth=0
```

---

## Tableau Cloud Configuration

### Step 1: Create a Connected App

1. Log in to **Tableau Cloud** → Settings → Connected Apps
2. Click **New Connected App** → Select **Direct Trust**
3. Fill in the details:
   - **Name:** `Insight Weaver Dev`
   - **Access Level:** Select workbooks/data sources you want to expose
4. Click **Create**
5. Copy these values (you'll need them for `.env.local`):
   - **Client ID**
   - **Secret ID**
   - **Secret Value**

### Step 2: Note Your Site Details

1. Your Tableau Cloud URL: `https://<your-site>.online.tableau.com`
2. Site ID: Found in URL or Admin → Site Settings
3. Content URL: Usually your site name (lowercase, no spaces)

### Step 3: Enable Embedding API

1. Go to Settings → General
2. Under **Embedding**, enable:
   - [x] Allow embedding
   - [x] Allow embedding with Connected Apps

### Step 4: Configure CORS (Optional for local dev)

1. Settings → Connected Apps → Your App
2. Add allowed origins:
   - `http://localhost:3000`
   - `http://localhost:3001`

---

## Salesforce Configuration

### Step 1: Enable Data Cloud

1. Log in to your **Salesforce Developer Org**
2. Setup → Data Cloud → Get Started
3. Complete the Data Cloud provisioning wizard
4. Note your **Org ID** (Setup → Company Information)

### Step 2: Create a Connected App

1. Setup → App Manager → New Connected App
2. Fill in:
   - **Connected App Name:** `Insight Weaver`
   - **API Name:** `Insight_Weaver`
   - **Contact Email:** Your email
3. Enable OAuth Settings:
   - **Callback URL:** `http://localhost:3001/auth/salesforce/callback`
   - **Selected OAuth Scopes:**
     - `Access and manage your data (api)`
     - `Access Data Cloud (cdp_api)`
     - `Perform requests at any time (refresh_token, offline_access)`
4. Click **Save** → Wait 2-10 minutes for propagation
5. Copy:
   - **Consumer Key** (Client ID)
   - **Consumer Secret** (Client Secret)

### Step 3: Get Security Token

1. Your Profile → Settings → Reset My Security Token
2. Check email for token
3. Your password for API = `password + security_token`

---

## Environment Variables

### Create Your Config File

```bash
cp .env.example .env.local
```

### Edit `.env.local`

```bash
# ===========================================
# TABLEAU CLOUD CONFIGURATION
# ===========================================

# Your Tableau Cloud site URL (no trailing slash)
TABLEAU_CLOUD_URL=https://your-site.online.tableau.com

# Site ID from Tableau Cloud admin settings
TABLEAU_SITE_ID=your-site-id

# Content URL (usually your site name, lowercase)
TABLEAU_CONTENT_URL=your-site-name

# Connected App credentials (from Step 1 above)
TABLEAU_CLIENT_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
TABLEAU_SECRET_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
TABLEAU_SECRET_VALUE=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# ===========================================
# SALESFORCE DATA CLOUD CONFIGURATION
# ===========================================

# Login URL (use test.salesforce.com for sandboxes)
SF_LOGIN_URL=https://login.salesforce.com

# Connected App credentials
SF_CLIENT_ID=3MVG9xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
SF_CLIENT_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Your Salesforce username
SF_USERNAME=your.email@example.com

# Password + Security Token (no space between them)
SF_PASSWORD=yourpasswordYOURSECURITYTOKEN

# Data Cloud Org ID
SF_DATA_CLOUD_ORG=00Dxxxxxxxxxxxxxxx

# ===========================================
# SLACK INTEGRATION (OPTIONAL)
# ===========================================

# Incoming Webhook URL for alert routing
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX

# Signing secret for webhook verification
SLACK_SIGNING_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# ===========================================
# APPLICATION SETTINGS
# ===========================================

# Environment (development | staging | production)
NODE_ENV=development

# API Server port
PORT=3001

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# Session secret (generate a random string)
SESSION_SECRET=your-random-secret-key-here-make-it-long

# JWT secret for token signing
JWT_SECRET=another-random-secret-key-here

# ===========================================
# DATABASE (OPTIONAL - for local persistence)
# ===========================================

# PostgreSQL connection (if not using Salesforce for storage)
# DATABASE_URL=postgresql://user:password@localhost:5432/insight_weaver

# Redis connection (for session/cache)
# REDIS_URL=redis://localhost:6379
```

### Generate Secrets

```bash
# Generate random secrets for SESSION_SECRET and JWT_SECRET
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## Local Development

### Option 1: Run Separately (Recommended for Development)

**Terminal 1 — API Server:**

```bash
cd api-server
npm run dev

# Output:
# 🚀 API Server running on http://localhost:3001
# 📚 API Docs: http://localhost:3001/api/docs
```

**Terminal 2 — Frontend:**

```bash
cd narrative-hub
npm run dev

# Output:
# ▲ Next.js 14.x
# - Local: http://localhost:3000
```

**Terminal 3 — Python Scripts (Optional):**

```bash
cd data-prep
source venv/bin/activate
python scripts/watch.py  # Hot-reload data transformations
```

### Option 2: Run Everything with Docker

```bash
docker-compose up --build
```

This starts:
- Frontend: http://localhost:3000
- API Server: http://localhost:3001
- API Docs: http://localhost:3001/api/docs

### Development Commands

| Command | Location | Description |
|---------|----------|-------------|
| `npm run dev` | narrative-hub | Start frontend dev server |
| `npm run dev` | api-server | Start API with hot reload |
| `npm run build` | narrative-hub | Production build |
| `npm run test` | any | Run test suite |
| `npm run lint` | any | Lint code |
| `npm run typecheck` | any | TypeScript check |

---

## Docker Deployment

### Development

```bash
# Build and run all services
docker-compose up --build

# Run in background
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

### Production

```bash
# Build production images
docker-compose -f docker-compose.prod.yml build

# Run with production config
docker-compose -f docker-compose.prod.yml up -d

# Scale API servers
docker-compose -f docker-compose.prod.yml up -d --scale api-server=3
```

### Docker Compose Services

```yaml
services:
  narrative-hub:    # React frontend (port 3000)
  api-server:       # Node.js API (port 3001)
  redis:            # Session cache (port 6379)
```

---

## Slack Integration

### Step 1: Create Slack App

1. Go to [api.slack.com/apps](https://api.slack.com/apps)
2. Click **Create New App** → **From scratch**
3. Name: `Insight Weaver Alerts`
4. Select your workspace

### Step 2: Enable Incoming Webhooks

1. Features → Incoming Webhooks → **On**
2. Click **Add New Webhook to Workspace**
3. Select channel (e.g., `#analytics-alerts`)
4. Copy the Webhook URL → add to `.env.local`

### Step 3: Configure Alert Formatting

The Inspector Agent sends alerts in this format:

```json
{
  "blocks": [
    {
      "type": "header",
      "text": { "type": "plain_text", "text": "🚨 Anomaly Detected" }
    },
    {
      "type": "section",
      "fields": [
        { "type": "mrkdwn", "text": "*Metric:*\nSDG 11 Progress" },
        { "type": "mrkdwn", "text": "*Change:*\n-19.4%" }
      ]
    },
    {
      "type": "actions",
      "elements": [
        {
          "type": "button",
          "text": { "type": "plain_text", "text": "View Details" },
          "url": "https://app.insightweaver.io/alerts/..."
        }
      ]
    }
  ]
}
```

### Step 4: Test Webhook

```bash
curl -X POST -H 'Content-type: application/json' \
  --data '{"text":"Test from Insight Weaver 🎉"}' \
  YOUR_SLACK_WEBHOOK_URL
```

---

## Verification Checklist

Run through this checklist to verify everything is working:

### Environment

```bash
# Check Node version
node --version  # Should be >= 18.0.0

# Check Docker
docker --version
docker-compose --version

# Verify env file exists
cat .env.local | head -5
```

### Tableau Connection

```bash
# Test Tableau API connection
cd api-server
npm run test:tableau

# Expected output:
# ✓ Connected to Tableau Cloud
# ✓ Retrieved 12 workbooks
# ✓ Embedding API accessible
```

### Salesforce Connection

```bash
# Test Salesforce connection
npm run test:salesforce

# Expected output:
# ✓ Authenticated to Salesforce
# ✓ Data Cloud accessible
# ✓ Retrieved org metadata
```

### Full Stack Test

```bash
# Start all services
docker-compose up -d

# Run integration tests
npm run test:integration

# Expected output:
# ✓ Frontend loads
# ✓ API health check passes
# ✓ OAuth flow works
# ✓ Tableau embed renders
# ✓ Slack webhook delivers
```

### Manual Verification

- [ ] http://localhost:3000 loads login page
- [ ] OAuth redirects to Tableau
- [ ] After login, dashboard shows data sources
- [ ] Chat interface accepts queries
- [ ] Tableau visualization embeds correctly
- [ ] Export to PDF generates valid file
- [ ] Slack receives test alert

---

## Troubleshooting

### Common Issues

#### "Cannot connect to Tableau Cloud"

```bash
# Check your credentials
echo $TABLEAU_CLOUD_URL
echo $TABLEAU_CLIENT_ID

# Verify Connected App is enabled
# Tableau Cloud → Settings → Connected Apps → Status: Enabled

# Check CORS settings include localhost
```

#### "Salesforce authentication failed"

```bash
# Verify password includes security token
# Password should be: yourpassword + securitytoken (no space)

# Check Connected App callback URL matches exactly:
# http://localhost:3001/auth/salesforce/callback

# Wait 2-10 minutes after creating Connected App
```

#### "Docker container won't start"

```bash
# Check for port conflicts
lsof -i :3000
lsof -i :3001

# Kill conflicting processes
kill -9 <PID>

# Rebuild containers
docker-compose down
docker-compose up --build
```

#### "Slack webhook not receiving alerts"

```bash
# Test webhook directly
curl -X POST -H 'Content-type: application/json' \
  --data '{"text":"Test"}' \
  $SLACK_WEBHOOK_URL

# Check webhook URL format
# Should start with: https://hooks.slack.com/services/

# Verify channel permissions
```

#### "TypeScript errors on build"

```bash
# Clear caches
rm -rf node_modules/.cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules
npm install

# Check TypeScript version
npx tsc --version
```

### Debug Mode

```bash
# Run API with verbose logging
DEBUG=insight-weaver:* npm run dev

# Run frontend with debug
NEXT_DEBUG=true npm run dev
```

### Get Help

- **GitHub Issues:** [github.com/your-org/insight-weaver/issues](https://github.com/your-org/insight-weaver/issues)
- **Tableau Community:** [community.tableau.com](https://community.tableau.com)
- **Salesforce Stack Exchange:** [salesforce.stackexchange.com](https://salesforce.stackexchange.com)

---

## Next Steps

Once setup is complete:

1. **Read the PRD** — Understand the 7-day sprint plan
2. **Run the demo** — `npm run demo` to see sample data flow
3. **Start Day 1** — Begin with authentication flow
4. **Join Slack** — `#insight-weaver-dev` for team comms

---

## File Structure Reference

```
insight-weaver/
├── .env.example              # Template for environment variables
├── .env.local                # Your local config (git-ignored)
├── docker-compose.yml        # Development containers
├── docker-compose.prod.yml   # Production containers
├── narrative-hub/            # React frontend
│   ├── package.json
│   ├── next.config.js
│   └── src/
├── api-server/               # Node.js backend
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
├── data-prep/                # Python scripts
│   ├── requirements.txt
│   └── scripts/
└── docs/
    ├── setup.md              # This file
    ├── prd.md                # Product requirements
    └── api-reference.md      # API documentation
```

---

**Setup complete. Now go build something incredible.** 🚀