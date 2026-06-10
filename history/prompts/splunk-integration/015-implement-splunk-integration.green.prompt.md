---
id: 015
title: Implement Splunk REST Integration and MCP-ready Assets
stage: green
date: 2026-06-10
surface: agent
model: gemini-1.5-pro
feature: splunk-integration
branch: main
user: shoaibharoon10
command: /sp.implement
labels: ["splunk", "rest-api", "mcp-ready", "implementation"]
links:
  spec: spec.md
  ticket: null
  adr: docs/adr/001-splunk-rest-first-mcp-ready-assets.md
  pr: null
files:
  - backend/app/config.py
  - backend/.env.example
  - backend/app/schemas.py
  - backend/app/services/splunk_client.py
  - backend/app/agents/evidence_collector.py
  - backend/app/routes/investigate.py
  - frontend/lib/types.ts
  - frontend/app/settings/page.tsx
  - scripts/load_data_to_splunk.md
  - scripts/splunk_sample_queries.md
  - scripts/splunk_rest_test.md
  - splunk-app/SplunkSentinelOps/default/app.conf
  - splunk-app/SplunkSentinelOps/default/savedsearches.conf
  - splunk-app/SplunkSentinelOps/default/tools.conf
  - splunk-app/SplunkSentinelOps/default/tool_input_payload_signatures.json
  - splunk-app/SplunkSentinelOps/metadata/default.meta
  - splunk-app/SplunkSentinelOps/README.md
tests:
  - backend/tests/test_endpoints.py
---

## Prompt

/sp.implement

Approved. Execute updated Phase 3 now.

Read the existing project files first:

* `constitution.md`
* `spec.md`
* `plan.md`
* `tasks.md`
* `architecture.md`
* `demo-story.md`
* `docs/adr/001-splunk-rest-first-mcp-ready-assets.md`
* `backend/app/config.py`
* `backend/app/schemas.py`
* `backend/app/services/splunk_client.py`
* `backend/app/services/mock_data.py`
* `backend/app/agents/evidence_collector.py`
* `backend/app/agents/spl_query_planner.py`
* `backend/app/routes/investigate.py`
* `backend/tests/test_endpoints.py`
* `frontend/lib/api.ts`
* `frontend/app/settings/page.tsx`
* `demo-data/auth_logs.csv`
* `demo-data/endpoint_logs.csv`
* `demo-data/firewall_logs.csv`
* `demo-data/web_logs.csv`

# Implementation Phase 3

Real Splunk REST Integration + Splunk Setup Docs + MCP-ready Splunk App Assets

# Current Status

* Backend mock mode is verified.
* Backend tests passed.
* Frontend is verified.
* Frontend lint/build passed.
* Mock mode must remain default and must not break.
* ADR confirms REST-first with MCP-ready assets.

# Phase 3 Goal

Implement real Splunk Enterprise REST API support while keeping mock mode as default, then add documentation and MCP-ready Splunk app assets inspired by Splunk Developer Day 2026.

# Important Rules

* Do not remove mock mode.
* Do not make Splunk required for local demo.
* Do not commit secrets.
* Do not create real `.env`.
* Do not add app authentication.
* Do not add a database.
* Do not implement real destructive security actions.
* Do not implement full live MCP server integration yet.
* Do not add Splunk SDK agent runtime.
* Do not use AI Toolkit Agent Builder as a required dependency.
* Do not break frontend or backend tests.
* Keep the implementation simple, reliable, and demo-friendly.

# Phase 3A — Real Splunk REST API Client

Update `backend/app/config.py` and `backend/.env.example` to support:

APP_MODE=mock
AI_MODE=mock
SPLUNK_MODE=mock
SPLUNK_HOST=https://localhost:8089
SPLUNK_USERNAME=admin
SPLUNK_PASSWORD=
SPLUNK_TOKEN=
SPLUNK_INDEX=sentinelops
SPLUNK_VERIFY_SSL=false
SPLUNK_SEARCH_TIMEOUT_SECONDS=30
SPLUNK_POLL_INTERVAL_SECONDS=1

Do not create or commit real `.env`.

Update `backend/app/services/splunk_client.py`.

Implement:

1. `is_real_mode()`
2. `get_status()`
3. `run_search(query: str, earliest_time: str | None = None, latest_time: str | None = None) -> list[dict]`

Real Splunk REST flow:

1. Create search job:
   POST `/services/search/jobs/`
2. Extract SID.
3. Poll job status until complete or timeout.
4. Fetch results:
   GET `/services/search/jobs/{sid}/results`
   with `output_mode=json`
5. Return list of result dictionaries.

Support:

* username/password basic auth
* optional token auth if `SPLUNK_TOKEN` exists
* SSL verification toggle
* timeout handling
* polling interval
* connection refused handling
* bad credentials handling
* non-200 response handling
* empty results handling
* malformed JSON handling

Never return password or token in API responses.

`get_status()` must return structured data:

* mode
* configured
* connected
* host
* index
* auth_method
* message
* error if any

# Phase 3A Evidence Collector Integration

Update `backend/app/agents/evidence_collector.py`.

Behavior:

* If `SPLUNK_MODE=mock`, keep current CSV behavior unchanged.
* If `SPLUNK_MODE=real`, execute generated SPL queries using `splunk_client.run_search()`.
* Convert Splunk result rows into existing evidence card structure.
* If Splunk is unavailable, return a clear evidence/status note but do not crash.
* If Splunk returns no rows, return a clear no-results evidence item.
* Keep response schema stable.
* Generated SPL queries must still appear in investigation response.

If necessary, minimally update `backend/app/routes/investigate.py` so generated SPL queries are passed to evidence collector.

# Phase 3A Tests

Update tests so automated tests do not require real Splunk.

Tests must confirm:

* mock mode still works
* `/investigate` still works
* `/splunk/status` works in mock mode
* Splunk client does not crash when real mode is configured but unavailable
* response schema remains unchanged

# Phase 3B — Splunk Setup Documentation

Create or update:

`scripts/load_data_to_splunk.md`

Include:

* how to install/start Splunk Enterprise
* how to create index `sentinelops`
* how to upload each demo CSV
* sourcetypes:

  * `sentinelops:auth`
  * `sentinelops:endpoint`
  * `sentinelops:firewall`
  * `sentinelops:web`
* how to search with all-time range
* how to verify indexed data

Create or update:

`scripts/splunk_sample_queries.md`

Include:

1. Verify all indexed data:
   index=sentinelops

2. Auth logs:
   index=sentinelops sourcetype="sentinelops:auth" user="admin"

3. Failed vs successful logins:
   index=sentinelops sourcetype="sentinelops:auth" user="admin"
   | stats count by status, src_ip

4. Endpoint suspicious activity:
   index=sentinelops sourcetype="sentinelops:endpoint" user="admin"
   | search process_name="powershell.exe" OR command_line="*net user*"
   | table _time host user process_name command_line

5. Firewall exfiltration:
   index=sentinelops sourcetype="sentinelops:firewall"
   | where bytes_out > 50000000
   | table _time src_ip dest_ip dest_port bytes_out action host

6. Web anomaly:
   index=sentinelops sourcetype="sentinelops:web"
   | stats count by status_code endpoint

Create or update:

`scripts/splunk_rest_test.md`

Include curl examples for:

* checking Splunk REST access
* creating a search job
* checking job status
* retrieving results with `output_mode=json`
* using basic auth
* using token auth
* troubleshooting SSL verify false
* troubleshooting bad credentials
* troubleshooting empty results

Do not include real passwords.

# Phase 3C — MCP-ready Splunk App Assets

Create this folder:

splunk-app/SplunkSentinelOps/
├── default/
│   ├── app.conf
│   ├── savedsearches.conf
│   ├── tools.conf
│   └── tool_input_payload_signatures.json
├── metadata/
│   └── default.meta
└── README.md

Purpose:

* Provide saved searches for the same investigation logic used by the app.
* Provide MCP-ready tool definitions for future Splunk MCP Server exposure.
* Make the project stronger for the Best Use of Splunk MCP Server bonus.
* Clearly document that this is a hackathon-ready MCP tooling asset and not a fully certified Splunkbase app.

Create saved searches for:

1. SentinelOps Auth Investigation
2. SentinelOps Endpoint Investigation
3. SentinelOps Firewall Exfiltration Investigation
4. SentinelOps Web Anomaly Investigation
5. SentinelOps Full Investigation Summary

Create MCP-ready tool concepts:

1. sentinelops_auth_investigation
2. sentinelops_endpoint_investigation
3. sentinelops_firewall_exfiltration
4. sentinelops_web_anomaly
5. sentinelops_full_investigation_summary

Tool input payload signatures should include appropriate fields:

* user
* host
* src_ip
* earliest
* latest
* threshold_bytes

Do not include secrets.

# Phase 3D — Frontend Settings Minor Update

Only if needed, update the Settings page to display:

* Splunk mode
* configured
* connected
* host
* index
* auth method
* status message

Do not redesign the UI.

# Validation

Run backend tests:

cd backend
python -m pytest tests/test_endpoints.py -v

Run frontend validation:

cd frontend
npm run lint
npm run build

If anything fails, fix and rerun.

Do not require real Splunk for automated tests.

# Manual Real Splunk Verification Docs

In the final summary and docs, include manual test steps:

1. Start Splunk Enterprise.
2. Create index `sentinelops`.
3. Upload demo CSV files with correct sourcetypes.
4. Create local `backend/.env` manually, but do not commit it.
5. Set:
   APP_MODE=real
   SPLUNK_MODE=real
   SPLUNK_HOST=https://localhost:8089
   SPLUNK_USERNAME=admin
   SPLUNK_PASSWORD=your_password
   SPLUNK_INDEX=sentinelops
   SPLUNK_VERIFY_SSL=false
6. Start backend:
   uvicorn app.main:app --reload
7. Check:
   GET /splunk/status
8. Run:
   POST /investigate
   {
   "alert_id": "alert-001"
   }
9. Confirm:

* generated SPL queries visible
* real Splunk evidence appears if data is indexed
* fallback message appears if no data is found
* app does not crash

# Git Commit

After successful implementation and validation:

1. Run:
   git status
   git diff --stat

2. Stage safe files only.

3. Commit with message:
   feat: add Splunk REST integration and MCP-ready assets

If a PHR file is created after that, commit it separately with:
chore: add PHR for Splunk REST integration

4. Final working tree must be clean.

## Response snapshot

Implemented the Splunk REST API search job client, integrated it into the Pydantic-modeled EvidenceCollectorAgent, created manual loading and REST Curl guides, packaged the Splunk app configuration directory, updated settings diagnostics card views, verified pytest logs, compiled production page builds, and committed implementation files.

## Outcome

- ✅ Impact: Complete Phase 3 features successfully created, verified, and committed.
- 🧪 Tests: Pytest check passed 8/8. Eslint and Turbopack compiler checks returned zero errors.
- 📁 Files: Over 17 integration, setup, and config files written and checked in.
- 🔁 Next prompts: /sp.implement Phase 4.
- 🧠 Reflection: Wrapping endpoints in secure SSL/connection exception boundaries ensures the app functions dynamically in both simulated and production modes without runtime failures.

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): PASS
- Prompt variant (if applicable): None
- Next experiment (smallest change to try): Implement Phase 4 (AI Client Gateway).
