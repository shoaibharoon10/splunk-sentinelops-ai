---
id: 021
title: Implement AI Gateway and Developer Polish
stage: general
date: 2026-06-11
surface: agent
model: gemini-3.5-flash
feature: none
branch: main
user: shoaibharoon10
command: /sp.implement
labels: ["ai-gateway", "appinspect", "mcp", "tests", "frontend", "git"]
links:
  spec: spec.md
  ticket: null
  adr: docs/adr/002-optional-pluggable-ai-gateway.md
  pr: null
files:
  - README.md
  - backend/.env.example
  - backend/app/config.py
  - backend/app/main.py
  - backend/app/routes/investigate.py
  - backend/app/schemas.py
  - backend/app/services/ai_client.py
  - backend/tests/test_endpoints.py
  - docs/architecture-diagram.md
  - docs/appinspect-notes.md
  - frontend/app/settings/page.tsx
  - frontend/lib/types.ts
  - splunk-app/SplunkSentinelOps/README.md
  - submission/devpost-description.md
tests:
  - pytest backend/tests/test_endpoints.py -v
  - npm run lint (frontend)
  - npm run build (frontend)
---

## Prompt

Implement Phase 4A final technical winning polish for Splunk SentinelOps AI.

# Goal

Add safe optional AI Gateway, AppInspect/developer tooling documentation, and MCP documentation polish before final screenshots and demo video.

# Current State

The project already works in:

* Mock mode
* Real Splunk REST mode
* Frontend real-mode investigation flow

Do not break existing behavior.

# Scope

Implement:

1. Optional AI Gateway with fallback
2. AppInspect / Splunk developer tools documentation
3. MCP-ready documentation polish
4. Validation and commits

# Hard Rules

* Do not break mock mode.
* Do not break real Splunk REST mode.
* Do not redesign the frontend.
* Do not add database.
* Do not add authentication.
* Do not execute real destructive actions.
* Do not make AI keys required.
* Do not expose API keys.
* Do not commit `.env` or secrets.
* Do not implement full live MCP Server unless only documented as future-ready.
* Do not use private-preview Splunk Agent Builder.
* Risk scoring must remain deterministic.
* AI must not change risk score or approve recommendations.

# Part 1 — AI Gateway

Inspect and update as needed:

* backend/app/services/ai_client.py
* backend/app/config.py
* backend/.env.example
* backend/app/agents/report_writer.py
* backend/app/routes/investigate.py
* backend/app/schemas.py
* frontend/app/settings/page.tsx
* frontend/lib/types.ts

Required behavior:

* Default AI_MODE=mock
* Optional AI_MODE=openai
* Optional AI_MODE=gemini
* Missing key => fallback to mock
* Provider error => fallback to mock
* Timeout => fallback to mock
* Investigation must never fail because of AI provider failure
* AI only improves summary/explanation/report text
* Deterministic risk score stays unchanged
* HITL recommendations stay unchanged

Add/update env vars:

AI_MODE=mock
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o-mini
GEMINI_API_KEY=
GEMINI_MODEL=gemini-1.5-flash
AI_REQUEST_TIMEOUT_SECONDS=20

Prefer simple HTTP requests over heavy SDKs if provider calls are implemented.

Add AI status output if appropriate:

* ai_mode
* ai_provider_configured
* ai_status

Do not expose secrets.

# Part 2 — Tests

Add/update tests so automated tests do not require external AI keys.

Required checks:

* mock AI mode still works
* missing OpenAI key falls back to mock
* missing Gemini key falls back to mock
* /investigate returns summary
* /investigate returns report_markdown
* risk_score remains deterministic

Run:

cd backend
python -m pytest tests/test_endpoints.py -v

# Part 3 — AppInspect / Developer Tools Docs

Create:

docs/appinspect-notes.md

Include:

* Splunk app skeleton exists under splunk-app/SplunkSentinelOps/
* It is hackathon-ready, not Splunkbase-certified yet
* AppInspect has not been claimed as passed unless actually run
* Future work: run AppInspect before Splunkbase packaging
* Future work: packaging metadata, icons, manifest, permissions, Splunkbase listing polish
* Why AppInspect matters for Splunk developer-tool alignment

# Part 4 — MCP Documentation Polish

Update as needed:

* README.md
* submission/devpost-description.md
* splunk-app/SplunkSentinelOps/README.md
* docs/architecture-diagram.md
* docs/appinspect-notes.md

Clarify:

* Real live integration today is Splunk REST
* MCP-ready Splunk app assets are included
* tools.conf exists
* tool_input_payload_signatures.json exists
* savedsearches.conf exists
* Saved searches can be exposed as MCP tools in future Splunk MCP Server deployment
* This supports the Best Use of Splunk MCP Server bonus story
* Do not claim full live MCP integration if it is not actually running

# Part 5 — Frontend Validation

If frontend files are changed, run:

cd frontend
npm run lint
npm run build

# Part 6 — Final Real Mode Reminder

Do not require real Splunk for automated tests.

At the end, provide manual commands to re-check:

Invoke-RestMethod http://127.0.0.1:8001/splunk/status

Invoke-RestMethod `  -Uri http://127.0.0.1:8001/investigate`
-Method POST `  -ContentType "application/json"`
-Body '{"alert_id":"alert-001"}'

Expected:

* mode=real
* risk_score=100
* risk_level=Critical
* evidence present
* timeline present

# Git Commit

After all updates:

git status
git diff --stat
git add <safe files>
git commit -m "feat: add optional AI gateway and developer tooling polish"

If PHR is created after that, commit separately:

git commit -m "chore: add PHR for final technical polish"

Final working tree must be clean.

# Final Summary Required

Summarize:

1. Files updated
2. AI gateway behavior
3. Fallback behavior
4. AppInspect docs added
5. MCP docs polished
6. Backend test result
7. Frontend lint/build result
8. Commit hash and message
9. Final git status
10. Whether project is ready for final screenshots and demo recording

## Response snapshot

Implemented the pluggable AI gateway via raw HTTP requests with 20s timeouts and resilient mock fallbacks. Updated configuration bindings, endpoints schemas, diagnostics settings dashboards, and added mock gateway tests. Wrote standard AppInspect developers documentation, polished MCP references in multiple files, validated frontend compilation, and finalized commits.

## Outcome

- ✅ AI Gateway: Configured `AI_MODE`, direct request payloads, and diagnostics hooks.
- ✅ AppInspect Docs: Created `docs/appinspect-notes.md`.
- ✅ MCP Refinements: Updated README, Devpost descriptions, and App README.
- ✅ Validation: Pytest checks and production next builds completed with zero errors.
- 📁 Files: Modified 13 files and created 1 new file.
