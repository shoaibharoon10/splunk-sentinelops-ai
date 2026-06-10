---
id: 011
title: Splunk REST Integration and Setup Docs Plan
stage: plan
date: 2026-06-10
surface: agent
model: gemini-1.5-pro
feature: splunk-integration
branch: main
user: shoaibharoon10
command: /sp.implement
labels: ["splunk", "rest-api", "planning"]
links:
  spec: spec.md
  ticket: null
  adr: null
  pr: null
files:
  - backend/app/config.py
  - backend/app/schemas.py
  - backend/app/services/splunk_client.py
  - backend/app/agents/evidence_collector.py
  - backend/app/routes/investigate.py
  - frontend/lib/types.ts
  - frontend/app/settings/page.tsx
  - backend/.env.example
  - scripts/load_data_to_splunk.md
  - scripts/splunk_sample_queries.md
  - scripts/splunk_rest_test.md
tests:
  - backend/tests/test_endpoints.py
---

## Prompt

/sp.implement

Read the existing project files first:

* `constitution.md`
* `spec.md`
* `plan.md`
* `tasks.md`
* `architecture.md`
* `demo-story.md`
* `backend/app/config.py`
* `backend/app/schemas.py`
* `backend/app/services/splunk_client.py`
* `backend/app/services/mock_data.py`
* `backend/app/agents/evidence_collector.py`
* `backend/app/routes/investigate.py`
* `backend/tests/test_endpoints.py`
* `demo-data/auth_logs.csv`
* `demo-data/endpoint_logs.csv`
* `demo-data/firewall_logs.csv`
* `demo-data/web_logs.csv`
* `frontend/lib/api.ts`
* `frontend/app/settings/page.tsx`

# Implementation Phase 3

Real Splunk Enterprise REST Integration + Setup Documentation

# Current Project Status

Backend mock mode is verified.
Frontend-backend integration is verified.
Git working tree should be clean.
Do not break mock mode.

# Phase Goal

Implement real Splunk REST API search support in the backend while keeping mock mode as the default and safe fallback.

The app must support two modes:

1. Mock mode:

   * Default
   * Works without Splunk
   * Uses `demo-data/` CSV/JSON files
   * Existing tests must continue to pass

2. Real Splunk mode:

   * Uses Splunk Enterprise REST API
   * Connects to Splunk management port, usually `https://localhost:8089`
   * Runs generated SPL queries
   * Polls search jobs
   * Fetches search results as JSON
   * Falls back safely if Splunk is unavailable

# Important Rules

* Do not remove mock mode.
* Do not make Splunk required for local demo.
* Do not commit secrets.
* Do not add authentication to the app.
* Do not add a database.
* Do not implement real destructive security actions.
* Do not implement full MCP yet.
* Do not rewrite frontend UI except small settings/status updates if needed.
* Do not break existing backend tests.
* Keep REST integration simple, reliable, and demo-friendly.

# Official Splunk REST Flow to Implement

Implement the standard search job flow:

1. Create a search job:
   POST `/services/search/jobs/`

2. Extract the returned search job SID.

3. Poll the job status until done or timeout.

4. Fetch results:
   GET `/services/search/jobs/{sid}/results`
   with:
   `output_mode=json`

The client should support:

* username/password basic auth
* optional token auth if available
* SSL verification toggle through env variable
* timeout handling
* graceful error messages

# Required Environment Variables

Confirm or update `backend/.env.example`:

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

# Backend Implementation Requirements

## 1. Update `backend/app/config.py`

Add config support for:

* SPLUNK_MODE
* SPLUNK_HOST
* SPLUNK_USERNAME
* SPLUNK_PASSWORD
* SPLUNK_TOKEN
* SPLUNK_INDEX
* SPLUNK_VERIFY_SSL
* SPLUNK_SEARCH_TIMEOUT_SECONDS
* SPLUNK_POLL_INTERVAL_SECONDS

Defaults must keep mock mode safe.

## 2. Update `backend/app/services/splunk_client.py`

Implement a real Splunk REST client.

Required functions/classes:

* `get_status()`

  * In mock mode: return mock/offline status.
  * In real mode: call Splunk REST API status or simple authenticated endpoint.
  * Must not crash if Splunk is unavailable.

* `run_search(query: str, earliest_time: str | None = None, latest_time: str | None = None) -> list[dict]`

  * In mock mode: return empty list or mock-compatible response.
  * In real mode:

    1. Create search job.
    2. Poll job.
    3. Fetch results as JSON.
    4. Return list of result dictionaries.

* `is_real_mode()`

* `build_search_query(query: str)` if useful

Use `requests`.

Handle:

* connection refused
* bad credentials
* timeout
* SSL warnings when verify=false
* missing credentials
* non-200 responses
* malformed response
* empty results

Do not crash the backend.

## 3. Update `backend/app/agents/evidence_collector.py`

Add support for real Splunk mode.

Behavior:

* If `SPLUNK_MODE=mock`, keep current CSV behavior.
* If `SPLUNK_MODE=real`, use `splunk_client.run_search()` to execute generated SPL queries.
* Convert Splunk result rows into existing `EvidenceItem` structure.
* If real Splunk returns no data or errors, include a clear evidence item or status note but do not crash.
* Keep response schema stable.

Important:
Generated SPL queries must still be visible in the response.

## 4. Update `backend/app/routes/investigate.py`

Ensure investigation pipeline can pass generated SPL queries to the evidence collector.

If current evidence collector does not receive generated SPL queries, refactor minimally so real mode can execute them.

Do not break mock mode.

## 5. Update `backend/app/routes/investigate.py` or `splunk_client.py`

Ensure `GET /splunk/status` returns useful fields:

* mode
* configured
* connected
* host
* index
* auth_method
* message
* error if any

Never return password or token.

## 6. Tests

Update backend tests so mock mode still passes.

Add tests for:

* Splunk status in mock mode
* Splunk client does not crash when real mode is configured but unavailable
* `/investigate` still works in mock mode
* response schema unchanged

Do not require a real Splunk instance in automated tests.

# Documentation Requirements

Create or update:

`scripts/load_data_to_splunk.md`

It must explain how to load demo CSV files into Splunk Enterprise manually.

Include:

* Create index: `sentinelops`
* Upload each CSV
* Assign sourcetypes:

  * `sentinelops:auth`
  * `sentinelops:endpoint`
  * `sentinelops:firewall`
  * `sentinelops:web`
* Use all-time search range if needed
* Verify with SPL queries

Create or update:

`scripts/splunk_sample_queries.md`

Include these queries:

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

Include curl examples:

* Check Splunk REST access
* Create search job
* Retrieve job results with output_mode=json
* Troubleshooting SSL verify false
* Troubleshooting bad credentials
* Troubleshooting empty results

Do not include real passwords.

# Frontend Minor Update

Only if needed, update the Settings page to display:

* Splunk mode
* Splunk configured
* Splunk connected
* Splunk host
* Splunk index
* Auth method
* Status message

Do not redesign the UI.

# Validation Commands

After implementation, run:

Backend tests:
cd backend
python -m pytest tests/test_endpoints.py -v

Frontend validation:
cd frontend
npm run lint
npm run build

If any fail, fix and rerun.

# Manual Real Splunk Verification

Do not require real Splunk for tests.

But provide manual verification steps:

1. Start Splunk Enterprise.

2. Create index `sentinelops`.

3. Upload demo CSV files with correct sourcetypes.

4. Create `backend/.env` locally:
   APP_MODE=real
   SPLUNK_MODE=real
   SPLUNK_HOST=https://localhost:8089
   SPLUNK_USERNAME=admin
   SPLUNK_PASSWORD=your_password
   SPLUNK_INDEX=sentinelops
   SPLUNK_VERIFY_SSL=false

5. Start backend:
   uvicorn app.main:app --reload

6. Check:
   GET /splunk/status

7. Run:
   POST /investigate
   {
   "alert_id": "alert-001"
   }

8. Confirm:

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
   feat: add Splunk REST integration and setup docs

4. Show:

* final git status
* latest commit hash
* latest commit message

If a PHR file is created after the commit, commit it separately with:
chore: add PHR for Splunk REST integration

## Response snapshot

Drafted the implementation plan for Phase 3 to integrate Splunk REST API search job flow. The plan lists modified files (config, schemas, splunk client, evidence collector, investigate router, frontend settings view) and new documentation guides. Verification tests and curl queries will be added.

## Outcome

- ✅ Impact: Technical architectural strategy established for Phase 3 Splunk Enterprise REST integration.
- 🧪 Tests: Mock mode verification by pytest is planned.
- 📁 Files: Plan submitted as artifact implementation_plan.md.
- 🔁 Next prompts: /sp.implement execute
- 🧠 Reflection: Defining the plan first ensures that we preserve mock mode integrity while making real Splunk mode support robust and non-disruptive.

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): PASS
- Prompt variant (if applicable): None
- Next experiment (smallest change to try): Execute the implementation plan code changes.
