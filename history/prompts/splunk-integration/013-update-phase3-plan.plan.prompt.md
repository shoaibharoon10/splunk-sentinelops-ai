---
id: 013
title: Update Phase 3 Implementation Plan
stage: plan
date: 2026-06-10
surface: agent
model: gemini-1.5-pro
feature: splunk-integration
branch: main
user: shoaibharoon10
command: /sp.plan
labels: ["splunk", "planning", "mcp-ready"]
links:
  spec: spec.md
  ticket: null
  adr: docs/adr/001-splunk-rest-first-mcp-ready-assets.md
  pr: null
files:
  - plan.md
  - tasks.md
  - C:/Users/Shoaib Haroon/.gemini/antigravity-ide/brain/e9988761-99f4-4f62-a152-1ed51c523def/implementation_plan.md
tests:
  - None
---

## Prompt

/sp.plan

Update the existing Phase 3 implementation plan for Splunk SentinelOps AI based on Splunk Developer Day 2026 learnings.

# Important

Do not implement code yet.
Do not run npm, pip, pytest, or build commands.
Only update the Phase 3 plan and tasks if needed.

# Context

Current Phase 3 was planned as Real Splunk Enterprise REST Integration.

Before executing it, update the plan to include MCP-ready Splunk app/tool assets inspired by Splunk Developer Day 2026.

Developer Day learnings:

* Apps can expose functionality as Splunk MCP tools.
* MCP tool definitions can be packaged using files such as `tools.conf` and `tool_input_payload_signatures.json`.
* Saved searches or REST endpoints can be exposed through the Splunk MCP Server.
* Splunk MCP Server provides authentication, rate limiting, tool discovery, role-based access controls, monitoring, and admin dashboard benefits.
* AI agents inside Splunk apps through Python SDK are useful but too risky for this short hackathon build.
* AI Toolkit Agent Builder is private preview, so it should not be a required dependency.

# Update Phase 3 Plan

Phase 3 should now include:

## Phase 3A — Real Splunk REST Integration

* Implement `splunk_client.py` real REST job flow:

  * create search job
  * poll SID
  * fetch results with `output_mode=json`
* Keep mock mode default.
* Add timeout/error handling.
* Add `/splunk/status` structured response.
* Do not require real Splunk for automated tests.

## Phase 3B — Splunk Setup Docs

Create/update:

* `scripts/load_data_to_splunk.md`
* `scripts/splunk_sample_queries.md`
* `scripts/splunk_rest_test.md`

## Phase 3C — MCP-ready Splunk App Assets

Create a lightweight Splunk app/tooling skeleton:

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

* Saved searches for SentinelOps investigation queries.
* MCP-ready tool definitions for future exposure through Splunk MCP Server.
* Clear documentation that this is a hackathon-ready MCP tooling asset, not a full certified Splunkbase app.

## Saved Searches to Include

Add saved searches for:

1. SentinelOps Auth Investigation
2. SentinelOps Endpoint Investigation
3. SentinelOps Firewall Exfiltration Investigation
4. SentinelOps Web Anomaly Investigation

## MCP Tool Concepts to Include

Define MCP-ready conceptual tools:

1. sentinelops_auth_investigation
2. sentinelops_endpoint_investigation
3. sentinelops_firewall_exfiltration
4. sentinelops_web_anomaly
5. sentinelops_full_investigation_summary

Each tool should have clear input payload signatures such as:

* user
* host
* src_ip
* earliest
* latest
* threshold_bytes

Do not include secrets.

## Phase 3D — Tests and Validation

* Backend mock tests must still pass.
* Frontend lint/build must still pass.
* Real Splunk mode must not be required for automated tests.
* Documentation must explain manual real Splunk verification.

## Phase 3E — Git Commit

After implementation later, commit message should be:
feat: add Splunk REST integration and MCP-ready assets

# Update Files

Update:

* `plan.md`
* `tasks.md` only if needed
* `implementation_plan.md` if the active artifact plan exists
* Any ADR index if applicable

# Output

After updating, summarize:

1. Files updated
2. What changed from the previous Phase 3 plan
3. New MCP-ready assets planned
4. What remains P0/P1/P2
5. Whether Phase 3 execution is ready

Do not implement code yet.

## Response snapshot

Updated the master implementation schedule `plan.md`, tasks file `tasks.md`, and active implementation plan `implementation_plan.md` to incorporate the restructured Phase 3: Real Splunk Enterprise REST Integration & MCP-ready Assets (consisting of Phases 3A through 3E).

## Outcome

- ✅ Impact: Architectural planning artifacts aligned to include MCP-ready assets and detailed Splunk REST polling timeouts.
- 🧪 Tests: None.
- 📁 Files: Modified plan.md, tasks.md, and implementation_plan.md.
- 🔁 Next prompts: /sp.implement
- 🧠 Reflection: Consolidating real REST client work, loading docs, and the MCP tooling skeleton under Phase 3 provides a unified, structured integration checkpoint before AI features are enabled.

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): PASS
- Prompt variant (if applicable): None
- Next experiment (smallest change to try): Execution of Phase 3 files.
