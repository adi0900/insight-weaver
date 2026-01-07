# Insight Weaver — Setup Walkthrough

## Summary

The complete **Insight Weaver** monorepo has been set up from scratch based on the PRD and setup documentation.

---

## Project Structure

```
insight-weaver/
├── narrative-hub/          # React 18 + Next.js frontend
│   ├── src/
│   │   ├── app/            # Pages (landing, dashboard)
│   │   ├── components/     # AgentChat, NarrativeTimeline, AlertDashboard, etc.
│   │   ├── hooks/          # React Query hooks
│   │   ├── services/       # API client
│   │   ├── store/          # Zustand state
│   │   └── utils/          # Helpers
│   └── package.json
├── api-server/             # Express + TypeScript backend
│   ├── src/
│   │   ├── routes/         # insights, narratives, inspector, webhooks, auth
│   │   ├── services/       # tableau, salesforce, agents, export
│   │   ├── middleware/     # auth, errorHandler, validate
│   │   └── utils/          # asyncHandler
│   └── package.json
├── data-prep/              # Python data scripts
│   ├── scripts/            # watch.py, generate_sample_data.py
│   └── requirements.txt
├── docker-compose.yml
├── docker-compose.prod.yml
├── .env.example
├── .gitignore
└── README.md
```

---

## Verification Results

| Check | Status |
|-------|--------|
| Frontend dependencies installed | ✅ |
| Backend dependencies installed | ✅ |
| TypeScript check (`tsc --noEmit`) | ✅ Pass |

---

## Running the Application

### Start API Server
```powershell
cd api-server
npm run dev
```
→ Runs on http://localhost:3001

### Start Frontend
```powershell
cd narrative-hub
npm run dev
```
→ Runs on http://localhost:3000

---

## Key Features Created

### Frontend Components
- **Landing Page** — Premium hero, features, trust section, CTA
- **Dashboard** — Sidebar navigation with 4 main views
- **Concierge Agent** — Chat interface with visualization placeholders
- **Narrative Timeline** — List with filtering, detail panel, revision history
- **Alert Dashboard** — Severity filtering, stats, acknowledge actions
- **Data Sources** — Connection status, sync triggers

### Backend Endpoints
| Endpoint | Description |
|----------|-------------|
| `POST /api/v1/insights/generate` | Generate insight from NLQ |
| `GET/POST /api/v1/narratives` | CRUD operations for narratives |
| `GET /api/v1/inspector/alerts` | List anomaly alerts |
| `POST /api/v1/webhooks/configure` | Set up Slack webhooks |
| `POST /api/v1/auth/login` | JWT authentication |

### Services
- **Tableau Service** — JWT auth, NLQ placeholder, embed URLs
- **Salesforce Service** — Data Cloud connection placeholder
- **Export Service** — PDF/Markdown generation
- **Agents Service** — Concierge (NLQ) and Inspector (Z-score anomaly detection)

---

## Next Steps

1. **Configure `.env.local`** — Add Tableau/Salesforce credentials
2. **Day 1 Sprint** — Implement OAuth 2.0 authentication flow
3. **Day 2 Sprint** — Build Tableau API integration

---

**Setup complete. Ready for development.** 🚀
