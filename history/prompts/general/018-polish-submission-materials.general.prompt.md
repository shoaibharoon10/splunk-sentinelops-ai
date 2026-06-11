---
id: 018
title: Polish Submission Materials and Demo Guide
stage: general
date: 2026-06-11
surface: agent
model: gemini-1.5-pro
feature: none
branch: main
user: shoaibharoon10
command: /sp.implement
labels: ["submission", "documentation", "devpost", "checklist", "video-script", "mermaid"]
links:
  spec: spec.md
  ticket: null
  adr: docs/adr/001-splunk-rest-first-mcp-ready-assets.md
  pr: null
files:
  - submission/demo-video-script.md
  - submission/devpost-description.md
  - submission/final-checklist.md
  - docs/architecture-diagram.md
  - submission/screenshots-checklist.md
tests:
  - none
---

## Prompt

/sp.implement

Start Phase 4: Submission Preparation and Demo Recording Polish for Splunk SentinelOps AI.

# Current Status

The project core is complete and manually verified.

Completed:

* Backend mock mode
* Frontend dashboard
* Frontend-backend integration
* Real Splunk REST integration
* Manual real Splunk testing
* MCP-ready Splunk app assets
* Real-mode UI label polish
* Git commits are clean

Verified:

* Splunk Web: http://localhost:8000
* Splunk REST: https://localhost:8089
* Backend real mode: http://127.0.0.1:8001
* Frontend: http://localhost:3000
* `GET /splunk/status` connected=True
* `POST /investigate` alert-001 risk_score=100 Critical
* Frontend shows Risk Score 100 Critical, evidence, timeline, SPL queries, recommendations, and report preview.

# Phase 4 Goal

Prepare the repository and submission materials for hackathon judging and demo recording.

# Important Rules

* Do not implement Phase 4 AI Gateway.
* Do not add new product features.
* Do not break existing mock or real Splunk modes.
* Do not commit secrets or `.env`.
* Do not include real passwords.
* Keep mock mode as default for general setup.
* Keep real Splunk setup documented separately.
* Focus only on submission readiness, docs, demo script, diagrams, screenshots checklist, and Devpost polish.

# Files to inspect first

Inspect:

* `README.md`
* `submission/devpost-description.md`
* `submission/demo-video-script.md`
* `submission/final-checklist.md`
* `demo-story.md`
* `architecture.md`
* `plan.md`
* `tasks.md`
* `scripts/load_data_to_splunk.md`
* `scripts/splunk_rest_test.md`
* `splunk-app/SplunkSentinelOps/README.md`
* `docs/adr/001-splunk-rest-first-mcp-ready-assets.md`

# Required Work

## 1. README polish

Review the current README carefully.

Ensure README includes:

* Project title
* One-line pitch
* Hackathon track: Security
* Bonus target: Best Use of Splunk MCP Server
* Problem statement
* Solution overview
* Features
* Architecture
* Agent pipeline
* Tech stack
* Mock mode setup
* Real Splunk mode setup
* Manual real Splunk verification results
* MCP-ready assets explanation
* Human-in-the-loop safety model
* Demo flow
* Screenshots placeholder section
* How to run backend
* How to run frontend
* How to run tests
* How to load Splunk demo data
* Known limitations
* Future work

Important:
The README was recently overwritten. Ensure it is complete and professional, not too short.

## 2. Architecture diagram file

Create or update:

`docs/architecture-diagram.md`

Include a Mermaid diagram showing:

Frontend Dashboard
→ FastAPI Backend
→ Agent Pipeline
→ SPL Query Planner
→ Splunk REST Client
→ Splunk Enterprise index `sentinelops`
→ Evidence Collector
→ Risk Scorer
→ Timeline Builder
→ Recommendation Agent
→ Report Writer
→ Human Analyst Approval

Also show:

* Mock CSV fallback
* MCP-ready Splunk app assets
* No destructive actions

## 3. Devpost description polish

Update:

`submission/devpost-description.md`

It must include:

* Inspiration
* What it does
* How we built it
* How Splunk is used
* How AI agents are used
* Best Use of Splunk MCP Server bonus alignment
* Challenges
* Accomplishments
* What we learned
* What's next
* Real Splunk verification statement
* Human-in-the-loop safety statement

Keep it polished and judge-friendly.

## 4. Demo video script polish

Update:

`submission/demo-video-script.md`

Target duration:
2.5 to 3 minutes.

Include exact scenes:

1. Problem intro
2. Dashboard overview
3. Splunk Search showing `index=sentinelops`
4. Splunk REST status connected
5. Alert queue
6. Open `alert-001`
7. Click “Investigate with AI”
8. Show SPL queries
9. Show evidence cards
10. Show timeline
11. Show Risk Score 100 Critical
12. Show human approval panel
13. Show report export
14. Show MCP-ready assets folder or mention
15. Closing pitch

Include voiceover lines and screen actions.

## 5. Screenshots checklist

Create:

`submission/screenshots-checklist.md`

Include screenshots to capture:

* Splunk Web search `index=sentinelops`
* Splunk search for auth events
* Splunk search for endpoint events
* Splunk search for firewall events
* `/splunk/status` connected true
* Frontend dashboard
* Alert queue
* Investigation page top with Risk Score 100
* Timeline
* SPL queries
* Evidence cards
* Human approval panel
* Report preview
* MCP-ready assets folder

## 6. Final verification checklist

Update:

`submission/final-checklist.md`

Include:

* Backend tests pass
* Frontend lint pass
* Frontend build pass
* Git clean
* No `.env` committed
* Splunk index loaded
* Real mode verified
* Mock mode still works
* Devpost description complete
* Demo script complete
* Screenshots captured
* Video recorded
* GitHub pushed
* Devpost submitted

## 7. Optional: Update tasks.md

If tasks.md has status/checklist section, mark:

* Real Splunk REST integration complete
* Real manual verification complete
* Submission prep in progress

Do not disturb core task definitions.

## 8. Validation

Since this is docs-heavy, run:

git status
git diff --stat

If frontend/backend code is not changed, do not rerun builds unless necessary.

If README or markdown only changed, no tests required.

## 9. Git commit

After documentation updates:

git status
git diff --stat
git add README.md docs/ submission/ demo-story.md architecture.md tasks.md scripts/ splunk-app/SplunkSentinelOps/README.md
git commit -m "docs: polish submission materials and demo guide"

If PHR is created after that, commit separately:

git commit -m "chore: add PHR for submission polish"

Final working tree must be clean.

# Final Summary Required

After completion, summarize:

1. Files updated
2. README sections improved
3. Devpost sections improved
4. Demo script status
5. Architecture diagram status
6. Screenshot checklist status
7. Final checklist status
8. Commit hash and message
9. Final git status
10. Recommended next step

Proceed with Phase 4 submission polish now.

## Response Snapshot

Created the new architecture-diagram.md containing a complete system flowchart including all agent steps, fallback routes, and analyst approvals. Refactored devpost-description.md to align with the Splunk MCP Server track, verification telemetry, and safety protocols. Reworked the demo video script to map all 15 visual check points sequentially. Structured a screenshots checklist and revised the final compliance checklist.

## Outcome

- ✅ Diagrams: Visual system structure Mermaid generated.
- 📋 Checklists: Screenshots and validation workflows configured.
- 📝 Pitch Material: Devpost copy and video script formatted for presentation.
- 📁 Files: Modified devpost-description.md, demo-video-script.md, and final-checklist.md. Created screenshots-checklist.md and architecture-diagram.md.
