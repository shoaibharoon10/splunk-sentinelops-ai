---
id: 012
title: Create Splunk Integration ADR
stage: misc
date: 2026-06-10
surface: agent
model: gemini-1.5-pro
feature: splunk-integration
branch: main
user: shoaibharoon10
command: /sp.adr splunk-rest-integration
labels: ["splunk", "adr", "architecture"]
links:
  spec: spec.md
  ticket: null
  adr: docs/adr/001-splunk-rest-first-mcp-ready-assets.md
  pr: null
files:
  - docs/adr/001-splunk-rest-first-mcp-ready-assets.md
  - history/adr/001-splunk-rest-first-mcp-ready-assets.md
tests:
  - None
---

## Prompt

/sp.adr splunk-rest-integration

Create an Architecture Decision Record for the Splunk SentinelOps AI project.

# ADR Title

Splunk REST API First with MCP-ready Tooling Assets

# Context

We are building Splunk SentinelOps AI for the Splunk Agentic Ops Hackathon.

The project is a Security-track, human-in-the-loop, agentic SOC investigation assistant. It already has:

* Verified FastAPI backend mock mode
* Verified Next.js frontend
* Generated SPL query display
* Mock evidence collection
* Risk scoring
* Human approval workflow
* Markdown report export

We are now moving toward real Splunk integration.

Splunk Developer Day 2026 learnings indicate that:

* Apps can expose functionality as Splunk MCP tools.
* MCP tool definitions can be packaged using files such as `tools.conf` and `tool_input_payload_signatures.json`.
* Saved searches or REST endpoints can be exposed through the Splunk MCP Server.
* Splunk MCP Server provides platform-level benefits such as authentication, rate limiting, discovery, role-based access controls, monitoring, and admin dashboards.
* AI agents can also live inside Splunk apps using Python SDK app capabilities, but that path has more runtime and packaging complexity.
* AI Toolkit Agent Builder is promising but may not be generally available to all hackathon participants.

# Decision

For this hackathon timeline, implement Splunk integration in three layers:

1. Mock mode remains default and fully working.
2. Real Splunk REST API search job flow is implemented as the primary live integration path.
3. MCP-ready Splunk app/tool assets are added as a bonus-ready layer, including:

   * `splunk-app/SplunkSentinelOps/default/app.conf`
   * `splunk-app/SplunkSentinelOps/default/savedsearches.conf`
   * `splunk-app/SplunkSentinelOps/default/tools.conf`
   * `splunk-app/SplunkSentinelOps/default/tool_input_payload_signatures.json`
   * `splunk-app/SplunkSentinelOps/metadata/default.meta`
   * `splunk-app/SplunkSentinelOps/README.md`

# Rationale

REST API first is the safest and fastest way to demonstrate real Splunk data integration in the limited hackathon timeline.

MCP-ready assets improve alignment with the Best Use of Splunk MCP Server bonus prize without making the whole demo dependent on MCP setup or private-preview access.

Mock mode keeps the app reliable for judges even if local Splunk, credentials, or MCP setup fails.

# Consequences

Positive:

* Working demo remains stable.
* Real Splunk integration is still possible.
* Project has stronger Splunk developer ecosystem alignment.
* MCP bonus story becomes credible.
* Saved searches make the SPL layer more reusable.

Negative:

* Full live MCP Server integration may remain optional.
* Splunk app package may be a documented/skeleton asset rather than a fully certified app.
* AppInspect may be P2 unless time remains.

# Non-Goals

Do not implement:

* Real destructive security actions
* Authentication for the web app
* Database persistence
* Full Splunk SDK agent runtime
* Full AI Toolkit Agent Builder integration
* Full Splunkbase-certified app packaging

# Validation

The ADR is accepted if:

* REST integration remains Phase 3 primary implementation.
* MCP-ready app/tool assets are added to the plan.
* Mock mode remains default.
* No secrets are committed.
* Existing backend and frontend tests still pass.
* Documentation explains REST mode, MCP-ready assets, and future MCP live integration.

Create the ADR file under the appropriate ADR/history/docs location used by this repository. If no ADR folder exists, create:

docs/adr/

and write:

docs/adr/001-splunk-rest-first-mcp-ready-assets.md

Do not implement code in this ADR step.

## Response snapshot

Created the Architecture Decision Record (ADR-001) outlining the Splunk REST API first strategy with MCP-ready tooling assets, saving the document under `docs/adr/` and `history/adr/` folders. No code changes were implemented in this stage.

## Outcome

- ✅ Impact: Architectural alignment confirmed to support REST-first strategy with MCP-ready skeleton tooling assets.
- 🧪 Tests: None.
- 📁 Files: Created docs/adr/001-splunk-rest-first-mcp-ready-assets.md and history/adr/001-splunk-rest-first-mcp-ready-assets.md.
- 🔁 Next prompts: Implement Phase 3.
- 🧠 Reflection: The ADR formalizes the decision boundaries, constraints, and consequences of introducing Splunk app configuration assets alongside the REST client, satisfying evaluation and hackathon bonus points criteria.

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): PASS
- Prompt variant (if applicable): None
- Next experiment (smallest change to try): Proceed to Phase 3 implementation.
