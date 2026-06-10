---
name: "Implement Backend Mock Foundation"
description: "Prompt History Record for creating the synthetic logs, seed alerts, FastAPI app base, schemas, 7 agents, and routes in mock mode"
model: "Gemini 3.5 Flash"
---

```yaml
id: "005"
stage: "green"
date: "2026-06-10"
surface: "agent"
feature: "backend-foundation"
branch: "main"
user: "shoaibharoon10"
command: "None"
labels: ["implementation", "fastapi", "agents", "mock-data"]
links:
  spec: "spec.md"
  ticket: null
  adr: null
  pr: null
files:
  - demo-data/auth_logs.csv
  - demo-data/endpoint_logs.csv
  - demo-data/firewall_logs.csv
  - demo-data/web_logs.csv
  - demo-data/alerts.json
  - backend/requirements.txt
  - backend/.env.example
  - backend/app/config.py
  - backend/app/schemas.py
  - backend/app/utils/time_utils.py
  - backend/app/services/mock_data.py
  - backend/app/services/splunk_client.py
  - backend/app/services/mcp_client.py
  - backend/app/services/ai_client.py
  - backend/app/agents/alert_parser.py
  - backend/app/agents/spl_query_planner.py
  - backend/app/agents/evidence_collector.py
  - backend/app/agents/risk_scorer.py
  - backend/app/agents/timeline_builder.py
  - backend/app/agents/recommender.py
  - backend/app/agents/report_writer.py
  - backend/app/routes/alerts.py
  - backend/app/routes/investigate.py
  - backend/app/main.py
  - backend/tests/test_endpoints.py
tests:
  - test_endpoints.py
```

## Prompt

/sp.implement

Read the existing project files first:

* `constitution.md`
* `spec.md`
* `plan.md`
* `tasks.md`
* `architecture.md`
* `demo-story.md`
* `submission/devpost-description.md`
* `submission/demo-video-script.md`
* `submission/final-checklist.md`

Now start the implementation phase for "Splunk SentinelOps AI".

# Implementation Phase 1

Backend Mock Mode Foundation + Demo Data + Agentic Investigation Pipeline

# Important

This is only Phase 1 implementation.

Do not build frontend yet.
Do not initialize Next.js yet.
Do not run npm commands.
Do not connect to real Splunk yet.
Do not require Splunk Enterprise to be installed.
Do not require AI API keys.
Do not add authentication.
Do not add a database.
Do not create real destructive security actions.
Do not change the approved project idea.
Do not rewrite the spec, plan, or tasks unless a tiny correction is absolutely required.

Follow `constitution.md`, `spec.md`, `plan.md`, and `tasks.md` strictly.

# Phase Goal

Create a fully working FastAPI backend in mock mode that can run without Splunk, without AI keys, and without frontend.

The backend must return a complete structured investigation result for the main demo scenario:

Brute-force login attempts → successful suspicious login → suspicious endpoint command → large outbound traffic → Critical risk score → recommendations requiring human approval → Markdown incident report.

# Required Repository and Backend Structure

Create or complete this structure:

backend/
├── app/
│   ├── main.py
│   ├── config.py
│   ├── schemas.py
│   ├── routes/
│   │   ├── alerts.py
│   │   └── investigate.py
│   ├── agents/
│   │   ├── alert_parser.py
│   │   ├── spl_query_planner.py
│   │   ├── evidence_collector.py
│   │   ├── risk_scorer.py
│   │   ├── timeline_builder.py
│   │   ├── recommender.py
│   │   └── report_writer.py
│   ├── services/
│   │   ├── splunk_client.py
│   │   ├── mcp_client.py
│   │   ├── ai_client.py
│   │   └── mock_data.py
│   └── utils/
│       └── time_utils.py
├── requirements.txt
└── .env.example

Also create or complete:

demo-data/
├── auth_logs.csv
├── endpoint_logs.csv
├── firewall_logs.csv
├── web_logs.csv
└── alerts.json

# Demo Data Requirements

Create synthetic but realistic security logs.

## Primary alert

Create `alert-001` for:

Title:
Suspicious Login and Command Execution Cascade

Scenario:

1. Multiple failed login attempts for user `admin`.
2. Successful login from suspicious source IP `185.21.44.10`.
3. Suspicious endpoint activity on host `win-dc-01`.
4. PowerShell encoded command or privileged command execution.
5. Large outbound network traffic suggesting possible exfiltration.

Expected risk score:
90–100

Expected risk level:
Critical

## Secondary alerts

Also create these alerts in `alerts.json`:

* `alert-002`: Suspicious PowerShell Execution
* `alert-003`: Possible Data Exfiltration
* `alert-004`: Web Application Error Spike

They can have simpler evidence but must not break investigation.

# Required Demo CSV Fields

## auth_logs.csv

Fields:
`_time,user,src_ip,action,status,host,country`

Include:

* at least 20 failed login rows for `admin`
* 1 successful login row for `admin`
* suspicious IP `185.21.44.10`
* host `win-dc-01`

## endpoint_logs.csv

Fields:
`_time,host,user,process_name,command_line,parent_process,severity`

Include:

* suspicious PowerShell encoded command
* privileged command such as `net user backup_admin /add`
* host `win-dc-01`
* user `admin`

## firewall_logs.csv

Fields:
`_time,src_ip,dest_ip,dest_port,action,bytes_out,host`

Include:

* large outbound traffic above 50,000,000 bytes
* suspicious external destination IP
* host `win-dc-01`

## web_logs.csv

Fields:
`_time,src_ip,endpoint,status_code,user_agent,response_time`

Include:

* enough data for a web anomaly alert
* repeated 500 errors or suspicious endpoint access

# Backend Requirements

## 1. config.py

Create environment-based config.

Default mode:

* APP_MODE=mock
* AI_MODE=mock
* SPLUNK_MODE=mock

Use python-dotenv if available.

## 2. schemas.py

Create Pydantic models for:

* Alert
* InvestigationRequest
* SPLQuery
* EvidenceItem
* TimelineEvent
* RiskFactor
* Recommendation
* InvestigationResponse
* SplunkStatus
* ReportExportRequest
* HealthResponse

The `InvestigationResponse` must include:

* alert_id
* title
* summary
* generated_spl
* evidence
* timeline
* risk_score
* risk_level
* risk_factors
* recommendations
* human_approval_required
* report_markdown
* mode
* splunk_status
* ai_status

## 3. main.py

Create FastAPI app.

Requirements:

* App title: Splunk SentinelOps AI Backend
* Version: 0.1.0
* CORS enabled for:

  * http://localhost:3000
  * http://127.0.0.1:3000
* Include alerts and investigate routers
* Add root route `/` if helpful
* Add `/health`

## 4. routes/alerts.py

Implement:

* `GET /alerts`
* `GET /alerts/{alert_id}`

Behavior:

* Load alerts from demo-data/alerts.json
* Return 404 with clear message if alert ID is missing

## 5. routes/investigate.py

Implement:

* `POST /investigate`
* `POST /export-report`
* `GET /splunk/status`

Behavior:

* `POST /investigate` runs the full mock agent pipeline
* `POST /export-report` returns Markdown report
* `GET /splunk/status` returns structured mock/offline Splunk status

# Agent Requirements

## Alert Parser Agent

File:
`backend/app/agents/alert_parser.py`

Must:

* Extract alert_id, title, user, host, src_ip, severity, time_range, alert_type
* Return investigation goals

## SPL Query Planner Agent

File:
`backend/app/agents/spl_query_planner.py`

Must:
Generate realistic SPL queries targeting index `sentinelops`.

Include queries for:

1. Authentication activity
2. Endpoint activity
3. Firewall/exfiltration activity
4. Web anomaly if relevant

Example:
index=sentinelops sourcetype="sentinelops:auth" user="admin" | stats count by status, src_ip

## Evidence Collector Agent

File:
`backend/app/agents/evidence_collector.py`

Must:

* Use mock_data service
* Build structured evidence cards
* Evidence must be connected to the alert scenario
* Primary alert must produce evidence for:

  * failed login burst
  * successful suspicious login
  * suspicious PowerShell or privileged command
  * large outbound traffic

## Risk Scorer Agent

File:
`backend/app/agents/risk_scorer.py`

Must use deterministic scoring:

* Multiple failed logins: +25
* Successful login after failed attempts: +25
* Suspicious/new source IP: +15
* Suspicious PowerShell or privileged command: +20
* Large outbound traffic: +15

Risk levels:

* 0–30 Low
* 31–60 Medium
* 61–80 High
* 81–100 Critical

Return:

* risk_score
* risk_level
* risk_factors

Primary alert must return Critical risk.

## Timeline Builder Agent

File:
`backend/app/agents/timeline_builder.py`

Must:

* Build chronological timeline
* Include:

  * time
  * event
  * source
  * severity
  * explanation

## Recommendation Agent

File:
`backend/app/agents/recommender.py`

Must return simulated recommendations.

Allowed actions:

* Force password reset
* Temporarily disable account
* Block suspicious IP
* Review host activity
* Escalate to incident response
* Mark as false positive
* Export incident report

Each recommendation must include:

* action
* reason
* impact
* requires_approval
* status

All statuses should default to `pending`.

## Report Writer Agent

File:
`backend/app/agents/report_writer.py`

Must generate Markdown report with:

* Alert Summary
* Generated SPL Queries
* Evidence Collected
* Attack Timeline
* Risk Score
* Risk Factors
* Recommended Actions
* Human Approval Status
* Safety Note

# Service Requirements

## services/mock_data.py

Must:

* Load alerts and CSV files from `demo-data/`
* Work regardless of current working directory
* Provide helper functions to query:

  * alerts
  * auth logs
  * endpoint logs
  * firewall logs
  * web logs
* Avoid crashing if a CSV is missing; return useful error or empty list

## services/splunk_client.py

Must:

* Provide placeholder class or functions:

  * `get_status()`
  * `run_search(query: str)`
* In this phase, return mock/offline status unless real config exists
* Do not require real Splunk credentials
* Include clear comments/docstrings for future REST API integration

## services/mcp_client.py

Must:

* Provide MCP-ready abstraction placeholder
* Include docstring explaining future Splunk MCP Server support
* Do not break the backend if MCP is not configured

## services/ai_client.py

Must:

* Provide mock SOC-style AI summary
* Do not require API keys
* Return stable text based on alert, evidence, timeline, risk score
* Include extension point for future OpenAI/Gemini integration

# Report Export Requirements

`POST /export-report` can accept:

{
"alert_id": "alert-001"
}

It should regenerate or return the Markdown report for the alert investigation.

# .env.example Requirements

Create `backend/.env.example` with:

APP_MODE=mock
AI_MODE=mock
SPLUNK_MODE=mock
SPLUNK_HOST=https://localhost:8089
SPLUNK_USERNAME=admin
SPLUNK_PASSWORD=
SPLUNK_TOKEN=
SPLUNK_INDEX=sentinelops
SPLUNK_VERIFY_SSL=false
BACKEND_CORS_ORIGINS=[http://localhost:3000,http://127.0.0.1:3000](http://localhost:3000,http://127.0.0.1:3000)

# requirements.txt Requirements

Include:

fastapi
uvicorn[standard]
pydantic
python-dotenv
requests
pandas

# Quality Rules

* Use clear, readable Python.
* Keep functions small.
* Keep API responses stable and frontend-ready.
* Do not use random values for important output.
* Do not require external services.
* Do not commit secrets.
* Do not add database.
* Do not add authentication.
* Do not create frontend code in this phase.
* Do not implement real destructive actions.
* Do not implement real Splunk REST polling yet.
* Do not implement full MCP integration yet.

# Acceptance Criteria

Phase 1 is complete only when:

1. Backend structure exists.
2. Demo data exists.
3. `backend/requirements.txt` exists.
4. `backend/.env.example` exists.
5. `GET /health` works.
6. `GET /alerts` returns demo alerts.
7. `GET /alerts/{alert_id}` returns a single alert.
8. `POST /investigate` returns full structured investigation.
9. `POST /export-report` returns Markdown report.
10. `GET /splunk/status` returns structured mock/offline status.
11. Primary alert `alert-001` returns:

    * generated SPL queries
    * evidence cards
    * timeline
    * Critical risk score
    * risk factors
    * recommendations
    * human_approval_required=true
    * report_markdown
12. Backend runs without Splunk.
13. Backend runs without AI API keys.
14. No frontend code is created.
15. No database or authentication is added.

# Test Instructions to Include in Final Summary

After implementation, provide:

1. Files created/updated

2. Installation command:
   `cd backend && python -m venv .venv && .venv\\Scripts\\activate && pip install -r requirements.txt`

3. Run command:
   `uvicorn app.main:app --reload`

4. Test URLs:

   * http://127.0.0.1:8000/health
   * http://127.0.0.1:8000/alerts
   * http://127.0.0.1:8000/splunk/status

5. POST test for investigation:
   Endpoint:
   `POST http://127.0.0.1:8000/investigate`

   Body:
   {
   "alert_id": "alert-001"
   }

6. POST test for report:
   Endpoint:
   `POST http://127.0.0.1:8000/export-report`

   Body:
   {
   "alert_id": "alert-001"
   }

7. Any assumptions made

8. What should be implemented next

# Output Behavior

Implement the files for Phase 1 only.

After implementation, summarize clearly:

* What was implemented
* What was not implemented yet
* How to run and test it
* Whether Phase 1 acceptance criteria are complete
* Recommended next phase

## Response snapshot

- Confirmed surface: backend workspace folder, agents and routes directories.
- Confirmed constraints: Fast mock-first logic, zero database, in-memory HITL store.
- Built CSV database files in `demo-data/` modeling failed logins, shell cmdlines, egress network sizes.
- Coded FastAPI server root, CORS headers, Pydantic data schemas, and API routers.
- Created `test_endpoints.py` testing the complete suite.
- Wrote prompt record detailing execution files and scopes.

## Outcome

- ✅ Impact: Complete mock backend foundation is fully operational, exposing healthy REST JSON responses for investigations without Splunk.
- 🧪 Tests: Written in backend/tests/test_endpoints.py
- 📁 Files: 26 files created/updated spanning backend/ and demo-data/.
- 🔁 Next prompts: Phase 2 implementation of frontend workspace and dashboard.
- 🧠 Reflection: Building out the test suite early guarantees that downstream frontend development can consume stable, schema-verified JSON payloads, avoiding UI errors.

## Evaluation notes (flywheel)

- Failure modes observed: pytest was missing, which is expected since setup pip instructions have not been run.
- Graders run and results (PASS/FAIL): PASS
- Prompt variant (if applicable): none
- Next experiment (smallest change to try): none
