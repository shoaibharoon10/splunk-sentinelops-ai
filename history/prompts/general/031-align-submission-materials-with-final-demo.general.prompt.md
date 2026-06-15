---
id: 031
title: Align Submission Materials with Final Demo
stage: misc
date: 2026-06-15
surface: agent
model: Gemini 3.5 Flash
feature: general
branch: main
user: Shoaib Haroon
command: N/A
labels: ["documentation", "devpost", "video-script", "checklists"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - demo-story.md
  - docs/adr/001-splunk-rest-first-mcp-ready-assets.md
  - docs/adr/002-optional-pluggable-ai-gateway.md
  - docs/appinspect-notes.md
  - history/adr/001-splunk-rest-first-mcp-ready-assets.md
  - history/adr/002-optional-pluggable-ai-gateway.md
  - plan.md
  - submission/demo-video-script.md
  - submission/devpost-description.md
  - submission/final-checklist.md
  - submission/screenshots-checklist.md
  - tasks.md
tests:
  - python -m pytest backend/tests/test_endpoints.py
---

## Prompt

You are working inside my existing project:

Project name: Splunk SentinelOps AI
Repository path: G:\DevHack\Splunk_SentinelOps_AI
Branch: main
Hackathon: Splunk Agentic Ops Hackathon
Track: Security
YouTube demo video link: https://www.youtube.com/watch?v=yfrEUxkrPWU&t=30s

I need you to update the stale submission documentation files so they accurately match the final implemented project and the final recorded demo video.

Important: This is a documentation-only task.
Do NOT change backend logic.
Do NOT change frontend logic.
Do NOT change environment files.
Do NOT expose secrets.
Do NOT force push.
Do NOT rewrite git history.

Please inspect and update these files if present:

* submission/demo-video-script.md
* submission/devpost-description.md
* submission/final-checklist.md
* submission/screenshots-checklist.md
* demo-story.md
* submission/demo-story.md if present
* any other submission-related markdown file that repeats outdated demo claims

Final verified project status:

* Final track: Security
* Frontend: Next.js 16 App Router, React, TypeScript, Tailwind CSS
* Backend: FastAPI, Python, Pydantic
* Splunk integration: Splunk Enterprise REST API is the live verified integration path
* Splunk REST management endpoint: https://localhost:8089
* Splunk index: sentinelops
* Sourcetypes: sentinelops:auth, sentinelops:endpoint, sentinelops:firewall, sentinelops:web
* AI mode: Mock AI Mode active for stable local judging and zero-dependency execution
* External OpenAI/Gemini keys are not configured or verified in the final demo
* MCP-ready assets are included only as a future-ready blueprint
* Live Splunk MCP Server execution is not implemented
* Splunk Hosted Models are not implemented
* KV Store blocker wording must be honest and safe:
  “The live integration path is Splunk Enterprise REST API. MCP-ready assets are included as a future-ready blueprint, but live MCP execution was not enabled because the local development Splunk KV Store had a certificate-chain validation blocker.”

Main demo case:

* alert_id: alert-001
* title: Suspicious Login and Command Execution Cascade
* user: admin
* host: win-dc-01
* suspicious source IP: 185.21.44.10
* scenario: repeated failed logins, successful admin login, suspicious PowerShell execution, privileged backup_admin account creation, and high outbound data movement
* risk_score: 100
* risk_level: Critical
* human_approval_required: true
* evidence sources: authentication logs, endpoint process logs, firewall logs
* report_markdown generated successfully

Update the documentation to remove or correct these outdated/wrong claims:

1. Replace “Next.js 14” with “Next.js 16 App Router”.
2. Replace any risk score of 95 with 100.
3. Replace “four failed login attempts” with safer wording: “repeated failed login attempts” or “21 failed login attempts” if referring to backend evidence.
4. Do not say “30-second response” if the final demo investigation takes longer. Use “faster triage workflow” instead.
5. Do not say alert status returns to “Resolved” unless the UI actually does that in the recorded demo.
6. Do not say “active AI gateways” if the final demo shows Mock AI Mode. Use “AI Gateway running in Mock AI Mode”.
7. Do not say OpenAI/Gemini are active. Say “provider-ready architecture” only.
8. Do not say live MCP is working. Say MCP-ready assets are included as a future-ready blueprint.
9. Do not over-explain KV Store failure in the Devpost text. Keep it concise, honest, and non-defensive.
10. Do not mention “host quarantine” or “active blocking in infrastructure” as real execution. HITL approval is a controlled approval/audit workflow, not destructive production execution.

Use the following final demo video script as the source of truth for demo-video-script.md and demo-story.md:

Hi, this is Splunk SentinelOps AI, an agentic SOC investigation assistant built for the Splunk Agentic Ops Hackathon Security track.

... (full verbatim prompt) ...

## Response snapshot

Aligned all project submission documentation, checklists, timelines, and architectural/design documents with the final verified implementation (Next.js 16 App Router, FastAPI backend, live Splunk REST integration path, Mock AI Mode gateway, and risk score 100 Critical on alert-001 with repeated failed logins). Corrected outdated claims, removed file:///g:/ absolute links, updated checklists, verified git remote, staged/committed changes, and successfully pushed main to GitHub.

## Outcome

- ✅ Impact: Submission documentation matches the final recorded demo video and implementation details precisely.
- 🧪 Tests: Pytest passed cleanly (10/10).
- 📁 Files: Aligned 12 markdown files including `demo-story.md`, checklists, Devpost descriptions, ADRs, AppInspect notes, plan, and tasks.
- 🔁 Next prompts: None.
- 🧠 Reflection: Clear, consistent, and honest documentation is crucial for hackathon evaluations and developer onboarding.

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): PASS
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): N/A
