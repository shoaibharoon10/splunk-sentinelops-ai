---
id: 022
title: Plan Live MCP Server and Hosted Models Bonus Sprint
stage: general
date: 2026-06-11
surface: agent
model: gemini-3.5-flash
feature: none
branch: main
user: shoaibharoon10
command: /sp.plan
labels: ["bonus-sprint", "mcp-server", "hosted-models", "licensing", "planning"]
links:
  spec: spec.md
  ticket: null
  adr: docs/adr/002-optional-pluggable-ai-gateway.md
  pr: null
files:
  - plan.md
  - tasks.md
tests:
  - none
---

## Prompt

Create a focused implementation plan for attempting Live Splunk MCP Server integration and Splunk Hosted Models integration, without changing code yet.

# Current Project Status

Splunk SentinelOps AI is already complete and verified with:

* Mock mode
* Real Splunk REST mode
* Real Splunk Enterprise local data
* Optional AI Gateway with mock/OpenAI/Gemini fallback
* MCP-ready Splunk app assets
* AppInspect documentation
* Frontend real-mode investigation flow

# Goal

Plan a controlled high-impact bonus sprint for:

1. Live Splunk MCP Server integration
2. Splunk Hosted Models integration

# Important Rules

* Do not implement code in this planning step.
* Do not run destructive commands.
* Do not modify existing stable REST behavior.
* Do not make MCP required for the demo.
* Do not make Hosted Models required for the demo.
* Do not expose or commit secrets.
* Do not overclaim features unless live verified.
* Any new integration must have fallback:

  * MCP failure falls back to Splunk REST
  * Hosted Model failure falls back to mock/OpenAI/Gemini/mock summary

# Required Plan Sections

## 1. Required Access / Prerequisites

List exactly what we need to verify for Live MCP Server:

* Splunk MCP Server app availability
* local Splunk Enterprise compatibility
* token generation
* MCP endpoint/server URL
* tool discovery
* saved search exposure from SplunkSentinelOps app

List exactly what we need to verify for Hosted Models:

* Splunk AI Toolkit access
* Hosted Models entitlement/access
* Foundation AI Security Model access
* Cisco Deep Time Series Model access
* endpoint/token/config requirements
* whether local Enterprise supports this or Splunk Cloud/access is needed

## 2. Time-boxed Decision Gates

Create gates:

* MCP Gate 1: app install/token generation, max 3 hours
* MCP Gate 2: tool discovery, max 4 hours
* MCP Gate 3: backend MCP call, max 4 hours
* Hosted Models Gate 1: access/endpoint verification, max 2 hours
* Hosted Models Gate 2: provider integration only if access is confirmed, max 6 hours

Each gate must say:

* proceed criteria
* stop criteria
* fallback path

## 3. Implementation Strategy If Access Is Available

For MCP:

* environment variables
* mcp_client.py changes
* /mcp/status or health fields
* fallback to REST
* frontend Settings proof
* investigation page proof
* tests with mocked MCP responses

For Hosted Models:

* AI_MODE=splunk_hosted or AI_MODE=splunk
* env vars
* ai_client.py provider branch
* fallback behavior
* frontend Settings proof
* tests with mocked hosted model responses

## 4. Documentation Strategy

Plan updates to:

* README.md
* submission/devpost-description.md
* submission/demo-video-script.md
* docs/architecture-diagram.md
* splunk-app/SplunkSentinelOps/README.md
* docs/appinspect-notes.md

Clarify honest claims:

* Real REST already verified
* Live MCP only if verified
* Hosted Models only if verified
* Otherwise label as future-ready

## 5. Final QA Required

Plan final validation:

* backend pytest
* frontend lint/build
* real Splunk REST retest
* MCP status test if implemented
* hosted model status test if implemented
* git status clean
* no .env committed

# Output Required

Update:

* plan.md
* tasks.md
* optionally docs/adr if new decisions are required
* PHR

Add section:
"Bonus Sprint: Live MCP Server and Hosted Models"

# Final Summary Required

Summarize:

1. prerequisites
2. decision gates
3. estimated time
4. proceed/stop rules
5. files planned for change
6. whether access checks should begin

#Before planning Live MCP Server and Hosted Models integration, include a prerequisite step for installing and verifying the Splunk 10GB Developer License.

Context:
The Splunk Developer Program sent a 10GB Splunk Developer Personal License by email. It is valid for six months and expires on Dec 07, 2026.

Add this prerequisite to the plan:

1. Download the attached Splunk developer license file from email.
2. Install it in Splunk Web:
   Settings → Licensing → Add license → Choose file → Install
3. Restart Splunk Enterprise if required.
4. Verify license status in:
   Settings → Licensing
5. Re-test existing project after license install:

   * Splunk Web localhost:8000
   * REST API https://localhost:8089
   * index=sentinelops
   * backend /splunk/status connected=True
   * /investigate alert-001 still returns risk_score=100 Critical

Important:
Do not start MCP or Hosted Models code until license install and existing REST demo are verified after restart.

## Response snapshot

Created the bonus sprint planning under plan.md and tasks.md outlining prerequisites for 10GB developer license, live MCP servers, and hosted models access. Set strict time-boxed decision gates and fallback strategies to avoid breaking the verified REST mode, updating the implementation plan artifact accordingly.

## Outcome

- ✅ Plan: Appended Section 13 (Bonus Sprint details) to plan.md.
- ✅ Tasks: Appended T045-T049 to tasks.md.
- ✅ Artifact: Created implementation_plan.md artifact for the bonus sprint.
- 📁 Files: Modified plan.md, tasks.md, and created implementation_plan.md and PHR-022.
