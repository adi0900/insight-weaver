# Insight Weaver — Product Requirements Document

**Version:** 1.0  
**Created:** January 7, 2026  
**Sprint Duration:** 7 Days  
**Status:** Ready for Development

---

## Executive Summary

Insight Weaver is an open analytics fabric that bridges the gap between raw data and actionable insights. Built on Tableau Cloud APIs and Salesforce Data Cloud, it transforms fragmented enterprise data into collaborative, AI-driven narratives that drive decisions.

**Core Value Proposition:** Replace the weeks of manual data wrangling, report building, and cross-team alignment with a conversational interface that queries data, generates visualizations, and produces defensible narratives—all in seconds.

**7-Day Goal:** Ship an MVP that demonstrates the complete data-to-narrative pipeline with core agent functionality, embedded analytics, and Salesforce integration.

---

## Problem Statement

Organizations face a critical bottleneck:

1. **Data Silos:** Snowflake doesn't talk to Salesforce. Departmental spreadsheets are disconnected from ERP systems. Government databases hide behind incompatible APIs.

2. **Reactive Decision-Making:** By the time analysts manually bridge these silos, opportunities have passed.

3. **No Narrative Layer:** Dashboards show data but don't create understanding. Insights die in screenshots and slide decks without proper provenance chains.

4. **Black Box AI:** When AI generates insights, stakeholders can't trace the reasoning back to source data—killing trust and adoption.

---

## Target Users

| User Type | Pain Point | Primary Use |
|-----------|------------|-------------|
| **Domain Experts** (City Planners, Analysts) | Hours spent hunting through multiple systems | Natural language queries, self-service analytics |
| **Executives** | Information overload, no time for deep dives | Narrative summaries with drill-down capability |
| **Data Teams** | Constant ad-hoc requests, repetitive reporting | Automated monitoring, proactive alerts |
| **Developers** | Building analytics into apps is painful | Drop-in embedded components |

---

## MVP Scope (7-Day Sprint)

### In Scope

- Narrative Hub frontend (React/TypeScript)
- Concierge Agent with natural language → visualization
- Inspector Agent with anomaly detection + alerts
- Tableau Cloud API integration (data connectivity)
- Salesforce Data Cloud semantic layer connection
- Basic webhook routing (Slack notifications)
- PDF/Markdown narrative export
- User authentication via OAuth 2.0

### Out of Scope (Post-MVP)

- Mobile apps
- Multi-agent debate/collaboration
- Custom connector marketplace
- HIPAA/GDPR compliance modules
- Advanced scenario modeling

---

## Technical Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                         INSIGHT WEAVER                              │
├─────────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │
│  │   INGEST    │  │   REASON    │  │   NARRATE   │  │    ACT      │ │
│  │  (Tableau   │→ │  (Tableau   │→ │  (Narrative │→ │  (Webhooks/ │ │
│  │   Bridge)   │  │   Next)     │  │    Hub)     │  │   Flows)    │ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘ │
├─────────────────────────────────────────────────────────────────────┤
│                    EINSTEIN TRUST LAYER                             │
│              (Grounding, Citations, Audit Trail)                    │
└─────────────────────────────────────────────────────────────────────┘
```

### Tech Stack

| Layer | Technology | Rationale |
|-------|------------|-----------|
| **Frontend** | React 18, TypeScript, Tailwind CSS | Fast iteration, component reusability |
| **Backend** | Node.js, Express | JavaScript consistency, ecosystem maturity |
| **Database** | Salesforce Data Cloud, Tableau Hyper | Native Salesforce integration, live analytics |
| **AI/ML** | Tableau Next Agents, Einstein Trust Layer | Enterprise-grade, pre-built safety guardrails |
| **Auth** | OAuth 2.0, Tableau Connected Apps | Standard enterprise authentication |
| **Exports** | PDFKit, Marked | Lightweight, proven libraries |

### API Design

**Core Endpoints:**

```
POST   /api/v1/insights/generate     → Generate insight via Concierge
GET    /api/v1/insights/:id          → Retrieve specific insight
POST   /api/v1/inspector/subscribe   → Subscribe to metric alerts
GET    /api/v1/narratives            → List all narratives
GET    /api/v1/narratives/:id        → Get narrative with revisions
POST   /api/v1/narratives/:id/export → Export to PDF/MD/SF Knowledge
POST   /api/v1/webhooks/configure    → Set up Slack/webhook routing
```

---

## Feature Requirements

### F1: Narrative Hub (Frontend)

**Description:** React-based interface for viewing, creating, and managing analytical narratives.

**User Stories:**
- As a domain expert, I want to see a timeline of all insights so I can track how understanding evolved
- As an executive, I want to click any insight card and drill into the underlying data
- As a data team member, I want to export narratives to PDF for stakeholder presentations

**Acceptance Criteria:**
- [ ] Timeline view showing chronological narrative revisions
- [ ] Insight cards with embedded Tableau visualizations
- [ ] Revision history panel with author, timestamp, and diff view
- [ ] Export buttons for PDF and Markdown formats
- [ ] Responsive design (desktop + tablet)

**Technical Notes:**
- Use Tableau Embedding API v3 for viz components
- Implement zustand for client state management
- Use react-query for server state + caching

---

### F2: Concierge Agent (Conversational Analytics)

**Description:** Natural language interface that transforms questions into Tableau visualizations with full citation chains.

**User Stories:**
- As a city planner, I want to ask "How has the metro line impacted pollution in district 7?" and get an interactive chart
- As an analyst, I want follow-up questions to maintain context from previous queries
- As a compliance officer, I want every AI-generated insight to cite its data sources

**Acceptance Criteria:**
- [ ] Chat interface with message history
- [ ] Natural language → Tableau NLQ pipeline working
- [ ] Source citations displayed below each generated visualization
- [ ] Follow-up questions maintain session context
- [ ] "Add to Narrative" button logs insight to Narrative Hub

**Technical Notes:**
- Integrate with Tableau Next NLQ API
- Implement Einstein Trust Layer for grounding
- Store session context in memory (Redis optional for MVP)

---

### F3: Inspector Agent (Proactive Monitoring)

**Description:** Background agent that monitors configured KPIs and alerts when anomalies are detected.

**User Stories:**
- As a sustainability manager, I want automatic alerts when SDG metrics deviate by more than 15%
- As a sales ops lead, I want Slack notifications when pipeline metrics show risk patterns
- As a data engineer, I want to configure thresholds without writing code

**Acceptance Criteria:**
- [ ] Metric subscription configuration UI
- [ ] Threshold-based anomaly detection (percent change, absolute values)
- [ ] Auto-generated preliminary narrative for each alert
- [ ] Slack webhook integration for alert routing
- [ ] Alert dashboard showing recent detections

**Technical Notes:**
- Polling interval: 15 minutes for MVP (configurable)
- Store metric history for trend analysis
- Use statistical deviation (Z-score) for anomaly detection

---

### F4: Data Integration Layer

**Description:** Connectors for Tableau Cloud and Salesforce Data Cloud enabling real-time data access.

**User Stories:**
- As a developer, I want to connect our Snowflake warehouse via Tableau Bridge
- As an admin, I want to see connection status and data freshness indicators
- As a security officer, I want all credentials stored securely

**Acceptance Criteria:**
- [ ] Tableau Cloud API authentication working
- [ ] Data source listing and metadata display
- [ ] Query execution via Tableau NLQ
- [ ] Salesforce Data Cloud connection for semantic layer
- [ ] Connection health monitoring dashboard

**Technical Notes:**
- Use JWT authentication for Tableau Connected Apps
- Implement credential encryption at rest
- Cache metadata to reduce API calls

---

### F5: Export & Action Pipeline

**Description:** System for exporting narratives to multiple formats and triggering downstream actions.

**User Stories:**
- As a program manager, I want to export quarterly narratives as branded PDFs
- As a knowledge manager, I want insights auto-published to Salesforce Knowledge
- As a team lead, I want Slack alerts to include one-click drill-down links

**Acceptance Criteria:**
- [ ] PDF export with embedded visualization snapshots
- [ ] Markdown export for documentation systems
- [ ] Slack message formatting with action buttons
- [ ] Webhook payload schema documented
- [ ] Export queue handling for large narratives

**Technical Notes:**
- Use Puppeteer for visualization screenshots
- Implement pdfkit for PDF generation
- Queue exports to prevent timeout issues

---

## Data Models

### Narrative

```typescript
interface Narrative {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  status: 'draft' | 'review' | 'published';
  revisions: Revision[];
  collaborators: string[];
  tags: string[];
}
```

### Revision

```typescript
interface Revision {
  id: string;
  narrativeId: string;
  hypothesis: string;
  evidence: Evidence[];
  confidence: number; // 0-1
  sources: Source[];
  authorId: string;
  timestamp: Date;
}
```

### Evidence

```typescript
interface Evidence {
  type: 'visualization' | 'data_snapshot' | 'external_link';
  vizId?: string;
  snapshot?: string; // base64 image
  dataPoints?: Record<string, any>[];
  url?: string;
}
```

### Alert

```typescript
interface Alert {
  id: string;
  metric: string;
  dimension: string;
  previousValue: number;
  currentValue: number;
  percentChange: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  suggestedNarrative: string;
  relatedVizIds: string[];
  timestamp: Date;
  acknowledged: boolean;
}
```

---

## 7-Day Sprint Plan

### Day 1: Foundation & Infrastructure

**Morning (4 hrs)**
- [ ] Initialize monorepo structure (`narrative-hub/`, `api-server/`, `sdk/`)
- [ ] Set up React 18 + TypeScript + Tailwind CSS for frontend
- [ ] Configure Express server with TypeScript
- [ ] Set up environment variable management
- [ ] Create Docker Compose for local development

**Afternoon (4 hrs)**
- [ ] Implement OAuth 2.0 authentication flow
- [ ] Set up Tableau Connected App credentials
- [ ] Create authentication middleware
- [ ] Build login/logout UI components
- [ ] Test end-to-end auth flow

**Deliverable:** User can log in via Tableau OAuth and see authenticated dashboard shell.

---

### Day 2: Tableau Integration & Data Layer

**Morning (4 hrs)**
- [ ] Implement Tableau Cloud API client
- [ ] Build data source listing endpoint
- [ ] Create workbook/view metadata fetcher
- [ ] Implement Tableau Embedding API v3 integration
- [ ] Build EmbeddedViz React component

**Afternoon (4 hrs)**
- [ ] Connect to Salesforce Data Cloud
- [ ] Implement semantic layer query interface
- [ ] Build data source selector UI
- [ ] Create connection health indicator
- [ ] Write integration tests for API endpoints

**Deliverable:** User can view list of connected data sources and embed Tableau visualizations.

---

### Day 3: Concierge Agent (Core)

**Morning (4 hrs)**
- [ ] Design chat interface component
- [ ] Implement message history state management
- [ ] Build Tableau NLQ API integration
- [ ] Create query parsing service

**Afternoon (4 hrs)**
- [ ] Implement Einstein Trust Layer grounding
- [ ] Build citation extraction and display
- [ ] Add session context management
- [ ] Create "Add to Narrative" action
- [ ] Write unit tests for agent logic

**Deliverable:** User can ask natural language questions and receive Tableau visualizations with citations.

---

### Day 4: Inspector Agent & Monitoring

**Morning (4 hrs)**
- [ ] Design metric subscription data model
- [ ] Build subscription configuration UI
- [ ] Implement threshold configuration form
- [ ] Create anomaly detection algorithm (Z-score)

**Afternoon (4 hrs)**
- [ ] Build polling service for metric monitoring
- [ ] Implement alert generation logic
- [ ] Create preliminary narrative generator
- [ ] Build alert dashboard UI
- [ ] Test detection accuracy with sample data

**Deliverable:** System detects metric anomalies and generates alerts with suggested narratives.

---

### Day 5: Narrative Hub & Revision System

**Morning (4 hrs)**
- [ ] Build Narrative Timeline component
- [ ] Implement revision history panel
- [ ] Create Insight Card component
- [ ] Design narrative creation flow

**Afternoon (4 hrs)**
- [ ] Implement revision logging service
- [ ] Build evidence attachment system
- [ ] Create confidence scoring display
- [ ] Add source linking functionality
- [ ] Implement collaborative editing indicators

**Deliverable:** Full narrative lifecycle working—create, revise, view history, link evidence.

---

### Day 6: Export & Action Pipeline

**Morning (4 hrs)**
- [ ] Implement PDF export with pdfkit
- [ ] Build visualization screenshot service (Puppeteer)
- [ ] Create Markdown export formatter
- [ ] Design export queue system

**Afternoon (4 hrs)**
- [ ] Build Slack webhook integration
- [ ] Create alert message formatting
- [ ] Implement webhook configuration UI
- [ ] Add one-click drill-down links
- [ ] Test end-to-end alert routing

**Deliverable:** Narratives exportable to PDF/MD. Alerts route to Slack with action buttons.

---

### Day 7: Polish, Testing & Documentation

**Morning (4 hrs)**
- [ ] Fix critical bugs from testing
- [ ] Improve error handling and edge cases
- [ ] Add loading states and skeleton UI
- [ ] Implement responsive design fixes
- [ ] Performance optimization pass

**Afternoon (4 hrs)**
- [ ] Write API documentation
- [ ] Create README with setup instructions
- [ ] Record demo video walkthrough
- [ ] Deploy to staging environment
- [ ] Final QA pass and sign-off

**Deliverable:** Production-ready MVP with documentation, deployed to staging.

---

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Tableau API rate limits | Medium | High | Implement caching, batch requests |
| Einstein Trust Layer latency | Medium | Medium | Add loading indicators, async processing |
| OAuth flow complexity | Low | High | Use proven library (passport.js) |
| Visualization screenshot failures | Medium | Medium | Fallback to static images, retry logic |
| Scope creep | High | High | Strict MVP boundaries, defer features |

---

## Success Metrics

**MVP Launch Criteria:**
- [ ] User can authenticate and view data sources
- [ ] Natural language query returns Tableau visualization
- [ ] At least one anomaly type detected and alerted
- [ ] Narrative created with revision history
- [ ] PDF export generates valid document
- [ ] Slack alert delivered with drill-down link

**Post-Launch KPIs:**
- Time from question → insight < 30 seconds
- Alert detection accuracy > 85%
- Narrative export success rate > 99%
- User satisfaction score > 4.0/5.0

---

## Dependencies

### External Services
- Tableau Cloud account with API access
- Salesforce Developer Org with Data Cloud
- Slack workspace for webhook testing

### Development Tools
- Node.js >= 18.0.0
- Python >= 3.10 (data prep scripts)
- Docker Desktop
- GitHub account

### Third-Party Libraries
- `@tableau/embedding-api-v3` — Embedded analytics
- `jsforce` — Salesforce API interactions
- `react-query` — Server state management
- `zustand` — Client state management
- `pdfkit` — PDF generation
- `puppeteer` — Screenshot capture

---

## Definition of Done

A feature is complete when:
1. Code passes all unit tests
2. Integration tests verify end-to-end flow
3. UI matches design specifications
4. Error states handled gracefully
5. Loading states implemented
6. Mobile/tablet responsive (where applicable)
7. Documentation updated
8. Code reviewed and approved
9. Deployed to staging without errors

---

## Appendix A: Environment Variables

```bash
# Tableau Cloud
TABLEAU_CLOUD_URL=https://your-site.online.tableau.com
TABLEAU_SITE_ID=your-site-id
TABLEAU_CLIENT_ID=your-connected-app-client-id
TABLEAU_SECRET_ID=your-connected-app-secret-id
TABLEAU_SECRET_VALUE=your-connected-app-secret-value

# Salesforce
SF_LOGIN_URL=https://login.salesforce.com
SF_CLIENT_ID=your-connected-app-client-id
SF_CLIENT_SECRET=your-connected-app-client-secret
SF_USERNAME=your-username
SF_DATA_CLOUD_ORG=your-org-id

# Webhooks
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...
ALERT_WEBHOOK_SECRET=your-webhook-signing-secret

# App
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:3000
```

---

## Appendix B: Project Structure

```
insight-weaver/
├── narrative-hub/                 # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── NarrativeTimeline/
│   │   │   ├── InsightCard/
│   │   │   ├── AgentChat/
│   │   │   └── EmbeddedViz/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── store/
│   │   └── utils/
│   ├── public/
│   └── package.json
├── api-server/                    # Node.js backend
│   ├── src/
│   │   ├── routes/
│   │   │   ├── insights.ts
│   │   │   ├── narratives.ts
│   │   │   ├── inspector.ts
│   │   │   └── webhooks.ts
│   │   ├── services/
│   │   │   ├── tableau/
│   │   │   ├── salesforce/
│   │   │   ├── agents/
│   │   │   └── export/
│   │   ├── middleware/
│   │   └── utils/
│   └── package.json
├── sdk/                           # SDK package
│   └── src/
├── docs/
├── docker-compose.yml
└── README.md
```

---

## Appendix C: API Response Examples

### Generate Insight Response

```json
{
  "success": true,
  "data": {
    "insightId": "ins_7x9k2m",
    "query": "How has the metro line impacted air quality?",
    "visualization": {
      "vizId": "viz_air_quality_trend",
      "embedUrl": "https://tableau.example.com/embed/...",
      "type": "line_chart"
    },
    "narrative": "Analysis indicates a 12% improvement in air quality index following the metro line opening...",
    "citations": [
      {
        "source": "EPA Environmental Data",
        "field": "aqi_daily_average",
        "timeRange": "2024-01-01 to 2025-01-07"
      }
    ],
    "confidence": 0.87
  }
}
```

### Inspector Alert Webhook Payload

```json
{
  "event": "inspector.anomaly.detected",
  "timestamp": "2025-01-07T14:32:00Z",
  "payload": {
    "alertId": "alert_7x9k2m",
    "metric": "sdg_11_progress_score",
    "dimension": "district-7",
    "previousValue": 72,
    "currentValue": 58,
    "percentChange": -19.4,
    "severity": "high",
    "suggestedNarrative": "SDG 11 progress in District 7 declined significantly...",
    "drillDownUrl": "https://app.insightweaver.io/alerts/alert_7x9k2m"
  }
}
```

---

## Sign-Off

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Product Owner | | | |
| Tech Lead | | | |
| Design Lead | | | |
| Engineering | | | |

---

*This PRD is a living document. Updates will be tracked via version control.*