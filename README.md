# Insight Weaver

**AI-Driven Analytics Narratives** — Transform fragmented enterprise data into collaborative, actionable insights.

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org)
[![React](https://img.shields.io/badge/react-18.3-blue)](https://reactjs.org)
[![TypeScript](https://img.shields.io/badge/typescript-5.7-blue)](https://www.typescriptlang.org)

---

## 🚀 Quick Start

```bash
# Clone → Install → Configure → Run
git clone https://github.com/your-org/insight-weaver.git
cd insight-weaver
cp .env.example .env.local
# Edit .env.local with your credentials
docker-compose up --build
```

**Live Demo:** https://insight-weaver-six.vercel.app

---

## 🌐 Deployment Links

- **Frontend (Production):** https://insight-weaver-six.vercel.app
- **Backend API:** https://insight-weaver-tpgg.onrender.com
- **API Health Check:** https://insight-weaver-tpgg.onrender.com/health

---

## 📋 Overview

Insight Weaver bridges the gap between raw data and actionable insights. Built on **Tableau Cloud APIs** , it transforms fragmented enterprise data into AI-driven narratives.

### Core Features

| Feature | Description |
|---------|-------------|
| **Concierge Agent** | Natural language → Tableau visualizations with citations |
| **Inspector Agent** | Anomaly detection with automated alerts |
| **Narrative Hub** | Create, revise, and collaborate on analytical narratives |
| **Data Integration** | Connect Tableau Cloud |
| **Export Pipeline** | PDF, Markdown|

---

## 🏗️ Project Structure

```
insight-weaver/
├── narrative-hub/          # React 18 + Next.js frontend
│   ├── src/
│   │   ├── app/            # Next.js App Router pages
│   │   ├── components/     # React components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── services/       # API client services
│   │   ├── store/          # Zustand state stores
│   │   └── utils/          # Utility functions
│   └── package.json
├── api-server/             # Express + TypeScript backend
│   ├── src/
│   │   ├── routes/         # API route handlers
│   │   ├── services/       # Business logic services
│   │   ├── middleware/     # Express middleware
│   │   └── utils/          # Utility functions
│   └── package.json
├── data-prep/              # Python data scripts
│   ├── scripts/
│   └── requirements.txt
├── docker-compose.yml      # Development containers
└── .env.example            # Environment template
```

---

## 🛠️ Installation

### Prerequisites

| Requirement | Minimum Version |
|-------------|-----------------|
| Node.js | 18.0.0 |
| npm | 9.0.0 |
| Python | 3.10 |
| Docker | 24.0.0 |

### Step 1: Clone & Install

```bash
# Clone repository
git clone https://github.com/your-org/insight-weaver.git
cd insight-weaver

# Install frontend dependencies
cd narrative-hub && npm install

# Install backend dependencies
cd ../api-server && npm install

# Install Python dependencies (optional)
cd ../data-prep
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### Step 2: Configure Environment

```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials:
- Tableau Cloud (Connected App credentials)
- Slack (Webhook URL for alerts)

### Step 3: Run Development Servers

**Option A: Separate terminals**

```bash
# Terminal 1 — API Server
cd api-server && npm run dev

# Terminal 2 — Frontend
cd narrative-hub && npm run dev
```

**Option B: Docker Compose**

```bash
docker-compose up --build
```

---

## 📡 API Reference

### Base URL
```
http://localhost:3001/api/v1
```

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/insights/generate` | Generate insight from natural language |
| `GET` | `/narratives` | List all narratives |
| `POST` | `/narratives` | Create new narrative |
| `GET` | `/inspector/alerts` | List anomaly alerts |
| `POST` | `/webhooks/configure` | Configure webhook |
| `POST` | `/auth/login` | Authenticate user |

### Example: Generate Insight

```bash
curl -X POST http://localhost:3001/api/v1/insights/generate \
  -H "Content-Type: application/json" \
  -d '{"query": "Show me sales trends over the last quarter"}'
```

---

## 🧪 Development

### Available Scripts

| Command | Location | Description |
|---------|----------|-------------|
| `npm run dev` | narrative-hub | Start Next.js dev server |
| `npm run dev` | api-server | Start Express with hot reload |
| `npm run build` | any | Production build |
| `npm run lint` | any | Run ESLint |
| `npm run typecheck` | any | TypeScript check |

### Demo Credentials

For development, use these demo credentials:
- **Email:** `demo@insightweaver.io`
- **Password:** `demo123`

---

## 🔧 Configuration

### Tableau Cloud

1. Create a Connected App in Tableau Cloud
2. Copy Client ID, Secret ID, and Secret Value
3. Add to `.env.local`



### Slack Webhooks

1. Create a Slack App with Incoming Webhooks
2. Add webhook URL to `.env.local`

---

## 📝 License

MIT License — see [LICENSE](LICENSE) for details.

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

**Built with ❤️ for data-driven decisions.**
