---
id: 019
title: Update Project Plan for Final Polish Sprint
stage: general
date: 2026-06-11
surface: agent
model: gemini-3.5-flash
feature: none
branch: main
user: shoaibharoon10
command: /sp.plan
labels: ["plan", "tasks", "polish", "ai-gateway", "appinspect", "mcp"]
links:
  spec: spec.md
  ticket: null
  adr: docs/adr/001-splunk-rest-first-mcp-ready-assets.md
  pr: null
files:
  - plan.md
  - tasks.md
tests:
  - none
---

## Prompt

Update the current project plan for the final winning polish sprint before screenshots and demo video recording.

# Project

Splunk SentinelOps AI

# Current Status

The core hackathon project is already complete and verified:

* Backend mock mode works
* Frontend dashboard works
* Real Splunk Enterprise REST integration works
* Real Splunk data is indexed in `sentinelops`
* `/splunk/status` returns connected=True in real mode
* `/investigate` for `alert-001` returns risk_score=100 and risk_level=Critical
* Frontend real-mode investigation flow works
* MCP-ready Splunk app assets exist
* README/submission polish has started

# Goal

Prepare a final priority-based technical polish plan before screenshots and demo video.

The goal is to increase winning potential without breaking the working demo.

# Important Rules

* Do not implement code in this planning step.
* Do not run npm, pytest, or build commands.
* Do not add database.
* Do not add authentication.
* Do not implement real destructive actions.
* Do not redesign the UI.
* Do not make AI keys required.
* Do not make Splunk MCP Server required for the live demo.
* Do not overclaim features that are only documented or future-ready.

# Final Polish Items to Plan

## P0 — Optional AI Gateway with Safe Fallback

Plan a safe AI gateway:

* Default remains `AI_MODE=mock`
* Optional `AI_MODE=openai`
* Optional `AI_MODE=gemini`
* Missing API key must fall back to mock
* Provider failure must fall back to mock
* Timeout must fall back to mock
* AI can improve explanation/summary/report text only
* AI must not change deterministic risk score
* AI must not approve or execute response actions
* No secrets exposed to frontend or API responses

Environment variables to plan:

AI_MODE=mock
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o-mini
GEMINI_API_KEY=
GEMINI_MODEL=gemini-1.5-flash
AI_REQUEST_TIMEOUT_SECONDS=20

## P1 — AppInspect / Splunk Developer Tools Note

Plan documentation:

`docs/appinspect-notes.md`

Must explain:

* Project includes a lightweight MCP-ready Splunk app skeleton
* It is hackathon-ready, not Splunkbase-certified
* AppInspect was not claimed as passed unless actually run
* Future work includes AppInspect validation, packaging metadata, icons, manifest, permissions, and Splunkbase listing polish
* Why AppInspect matters for Splunk developer-tool alignment

## P1 — MCP Documentation Polish

Plan updates to:

* `README.md`
* `submission/devpost-description.md`
* `splunk-app/SplunkSentinelOps/README.md`
* `docs/architecture-diagram.md` if present

Must clarify:

* Real live integration today is Splunk REST
* MCP-ready Splunk app assets are included
* `tools.conf`, `tool_input_payload_signatures.json`, and `savedsearches.conf` exist
* Saved searches can be exposed as MCP tools in future Splunk MCP Server deployment
* This supports Best Use of Splunk MCP Server bonus story
* Do not claim full live MCP Server integration unless actually implemented

## P2 — Live MCP Server Setup Decision Gate

Plan a decision gate only.

Do not implement live MCP Server now.

Decision:

* Try only if it can be completed quickly and safely
* Skip if setup is risky or time-consuming
* Document as future-ready if skipped

## Skip / Do Not Add

Explicitly keep these out of scope:

* Hosted Models
* Database
* Authentication
* Major UI redesign
* Real destructive response actions
* Full Splunk SDK agent runtime
* Private-preview Splunk Agent Builder dependency

# Plan Output Required

Update:

* plan.md
* tasks.md if needed
* active implementation_plan.md artifact if available
* prompt history if used

Add a clear section:

`Final Winning Polish Sprint`

Break it into:

* Phase 4A: AI Gateway
* Phase 4B: Developer Tools / AppInspect docs
* Phase 4C: MCP docs polish
* Phase 4D: Optional MCP decision gate
* Phase 4E: Final QA before screenshots/video

# Acceptance Criteria for Planning

Planning is complete when:

1. P0/P1/P2 priorities are clear.
2. Risky/time-consuming items have skip gates.
3. AI Gateway is optional and safe.
4. MCP claims are accurate.
5. AppInspect is documented without overclaiming.
6. The plan clearly says screenshots and demo video should happen only after this sprint.

# Final Summary Required

After updating the plan, summarize:

1. Files updated
2. New phases added
3. P0/P1/P2 priorities
4. Explicitly skipped items
5. Decision gates
6. Whether execution can proceed

## Response snapshot

Updated both the master checklist (tasks.md) and project plan (plan.md) by introducing the "Final Winning Polish Sprint" section. Integrated sub-phases Phase 4A-4E mapping prioritized tasks, safety constraints, documentation files, and decision gates before the demo record checkpoint. Created a matching implementation plan artifact detailing file-level changes and acceptance metrics.

## Outcome

- ✅ Plan: Appended Phase 4A-4E polish sprint to plan.md.
- ✅ Tasks: Appended T040-T044 to tasks.md.
- ✅ Artifact: Created implementation_plan.md artifact.
- 📁 Files: Modified plan.md, tasks.md, and created implementation_plan.md.

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): PASS
- Prompt variant (if applicable): default
- Next experiment (smallest change to try): proceed with implementing the optional AI gateway
