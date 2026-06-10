# Splunk SentinelOps AI - Project Constitution

This constitution governs the design, architecture, implementation, and submission of **Splunk SentinelOps AI** for the Splunk Agentic Ops Hackathon (Security Track). Every specification, task list, and code change must comply with this document.

---

## 1. Core Development Principles

1. **Demo-First Development**: Every feature must directly support the final 3-minute hackathon demo. Features that do not improve the demo narrative, judging criteria, or submission quality are strictly out of scope.
2. **Splunk-Centric UI**: The application must visibly leverage Splunk data. The interface must highlight generated SPL queries and evidence retrieved from Splunk (or Splunk-compatible mock data). It must not look like a generic chatbot.
3. **Visible Agentic Workflow**: The UI must display the distinct stages of the AI agent investigation pipeline (Alert Parser, SPL Planner, Evidence Collector, Risk Scorer, Timeline Builder, Recommender, Report Writer).
4. **Human-in-the-Loop (HITL) Safety**: AI is advisory only. High-impact response actions (disabling accounts, blocking IPs, force password resets) must require manual analyst approval via the UI.
5. **Mock-First, Integration-Second**: All services must implement a robust mock mode. Development and frontend styling should be done using mock data first to guarantee a working demo, then Splunk and AI integrations added.
6. **Ultra-Simple Architecture**: Avoid unnecessary databases, authentication systems, mobile apps, or enterprise-grade deployment setups. Keep state in-memory or in local files.
7. **Deterministic & Explainable Scoring**: Risk scores must be calculated using deterministic, explainable rules. AI recommendations and summaries must cite specific log lines or security events as evidence.
8. **Pluggable & Failure-Safe**: If Splunk is unreachable or AI API keys are missing, the system must gracefully fall back to mock modes so the application and demo flow remain fully operational.
9. **UI/UX Excellence**: The frontend must look like a premium, high-tech dark-themed Security Operations Center (SOC) dashboard.

---

## 2. Technology Stack

*   **Frontend**: Next.js, TypeScript, Tailwind CSS
*   **Backend**: FastAPI (Python 3.10+), Pydantic, Python-dotenv, Requests
*   **Splunk**: Splunk Enterprise (Trial or cloud instance), Splunk REST API integration, and Splunk MCP Server / MCP-ready abstraction.
*   **AI**: OpenAI and Gemini SDKs via pluggable client abstraction with env-configured keys.

---

## 3. Repository Structure

Every contributor and agent must maintain the following folder structure:

```
splunk-sentinelops-ai/
├── README.md                           # Comprehensive documentation
├── LICENSE                             # MIT or Apache License
├── constitution.md                     # This document
├── spec.md                             # System specification
├── tasks.md                            # Checklist of tasks and test cases
├── architecture.md                     # Architecture overview
├── demo-story.md                       # Script and visual cue list for the demo
├── submission/
│   ├── devpost-description.md          # Pitch and summary for Devpost
│   ├── demo-video-script.md            # Script for the 3-minute video
│   └── final-checklist.md              # Submission pre-flight checks
├── demo-data/
│   ├── auth_logs.csv                   # Failed/successful log attempts
│   ├── endpoint_logs.csv               # Process spawning, commands run
│   ├── firewall_logs.csv               # Outbound network volumes
│   ├── web_logs.csv                    # Web traffic details
│   └── alerts.json                     # Seed security alerts
├── backend/
│   ├── app/
│   │   ├── main.py                     # App entrypoint
│   │   ├── config.py                   # Environment configuration
│   │   ├── schemas.py                  # Pydantic schemas (Contracts)
│   │   ├── routes/
│   │   │   ├── alerts.py               # Alert query endpoints
│   │   │   └── investigate.py          # AI agent execution endpoint
│   │   ├── agents/
│   │   │   ├── alert_parser.py         # Extract alert metadata
│   │   │   ├── spl_query_planner.py    # Generate SPL queries
│   │   │   ├── evidence_collector.py   # Retrieve logs matching queries
│   │   │   ├── risk_scorer.py          # Deterministic risk evaluation
│   │   │   ├── timeline_builder.py     # Collate logs into chronological events
│   │   │   ├── recommender.py          # Generate response suggestions
│   │   │   └── report_writer.py        # Format markdown summary
│   │   ├── services/
│   │   │   ├── splunk_client.py        # Real Splunk REST client
│   │   │   ├── mcp_client.py           # Splunk MCP connection
│   │   │   ├── ai_client.py            # AI model wrapper (OpenAI/Gemini)
│   │   │   └── mock_data.py            # Mock fallbacks for all services
│   │   └── utils/
│   │       └── time_utils.py           # Datetime parsing/formatting
│   ├── requirements.txt                # Python dependencies
│   └── .env.example                    # Template environment variables
├── frontend/
│   ├── app/                            # Pages and routing
│   ├── components/                     # Reusable widgets (cards, panels)
│   ├── lib/                            # API fetchers, config, utils
│   ├── package.json                    # Node dependencies
│   └── .env.example                    # Template frontend config
└── scripts/
    ├── generate_demo_logs.py           # Script to generate synthetic logs
    ├── load_data_to_splunk.md          # Walkthrough for log ingestion
    └── splunk_sample_queries.md        # Reference SPL queries
```

---

## 4. API & Interface Contracts

### Backend Endpoints
*   `GET /health`: Returns service, Splunk, and AI client status.
*   `GET /alerts`: Lists active security alerts.
*   `GET /alerts/{alert_id}`: Retrieves details for a specific alert.
*   `POST /investigate`: Executes the multi-agent investigation pipeline.
*   `POST /export-report`: Generates and downloads the PDF/Markdown incident report.
*   `GET /splunk/status`: Returns detailed Splunk connection and indices status.

### Investigation Response Schema
The `POST /investigate` endpoint must return a structured JSON object containing:
```json
{
  "alert_id": "string",
  "title": "string",
  "summary": "string",
  "generated_spl": [
    {
      "description": "string",
      "query": "string"
    }
  ],
  "evidence": [
    {
      "source": "string",
      "description": "string",
      "raw_log": "string"
    }
  ],
  "timeline": [
    {
      "timestamp": "ISO-8601 string",
      "source": "string",
      "event": "string",
      "severity": "string",
      "details": "string"
    }
  ],
  "risk_score": 0,
  "risk_level": "Low | Medium | High | Critical",
  "recommendations": [
    {
      "id": "string",
      "action": "string",
      "reason": "string",
      "impact": "string",
      "requires_approval": true,
      "status": "pending | approved | rejected"
    }
  ],
  "human_approval_required": true,
  "report_markdown": "string"
}
```

---

## 5. Security & Threat Scenario Modeling

### The Primary Demo Scenario (Multi-Stage Attack Flow)
The application must explicitly simulate and detect the following chronological sequence of events:
1.  **Stage 1: Recon & Brute Force**: Multiple failed login attempts (`failed_login` events) for `admin` user from a new/unrecognized IP.
2.  **Stage 2: Compromise**: A successful login (`successful_login` event) from that same source IP within a brief window.
3.  **Stage 3: Privilege Command Execution**: Execution of a suspicious, high-privilege PowerShell command (e.g., `EncodedCommand` or modifying execution policy) logged in endpoint logs.
4.  **Stage 4: Exfiltration**: A large, anomalies outbound network connection to a suspicious destination IP logged in firewall/network logs.

### Deterministic Risk Scoring Rules
Risk scoring must be explainable and calculated as follows:
*   Multiple failed login attempts: **+25**
*   Successful login following failure from same IP: **+25**
*   New/unrecognized source IP address: **+15**
*   Suspicious PowerShell or admin command execution: **+20**
*   Abnormal outbound network traffic: **+15**

**Risk Levels:**
*   `0 – 30`: Low
*   `31 – 60`: Medium
*   `61 – 80`: High
*   `81 – 100`: Critical

### Human Approval & Safe Response Recommendations
The AI must suggest response actions that the analyst can approve or reject. Under no circumstances may the app execute destructive commands. All actions are simulated and updated inside the mock state:
*   **Force password reset** (Simulated)
*   **Temporarily disable account** (Simulated)
*   **Block suspicious IP** (Simulated)
*   **Review host activity** (Navigate to detailed logs)
*   **Escalate to incident response** (Simulated)
*   **Mark as false positive** (Simulated)
*   **Export incident report** (Generate PDF/Markdown)

---

## 6. Definition of Done (DoD)

A task or feature is considered **Done** only when:
1.  The backend starts, routes respond, and tests run successfully.
2.  The frontend builds without compilation errors and connects to the backend.
3.  Mock investigation mode produces correct mock schemas matching the demo attack scenario.
4.  Splunk REST client integrates and correctly fails back to mock mode if Splunk is offline.
5.  The UI demonstrates the visual step-by-step agent workflow, SPL query blocks, evidence cards, incident timeline, risk score indicators, recommendations panel, and report export.
6.  An architecture diagram (`architecture.md` and graphic in root) is present.
7.  `README.md` is complete with detailed setup, run, loading, and demo instructions.
8.  No secrets or API keys are committed to the codebase (enforced by `.env.example`).

---
**Version**: 1.0.0 | **Ratified**: 2026-06-10 | **Status**: Active / Strictly Enforced
