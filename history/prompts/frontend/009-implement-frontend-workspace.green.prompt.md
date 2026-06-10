---
id: 009
title: Implement Frontend Dashboard and Workspace
stage: green
date: 2026-06-10
surface: agent
model: Gemini 3.5 Flash
feature: frontend
branch: main
user: Muhammmad Shoaib
command: git commit -m "feat: add frontend dashboard and investigation workspace"
labels: ["frontend", "nextjs", "triage", "workspace"]
links:
  spec: spec.md
  ticket: null
  adr: null
  pr: null
files:
  - frontend/.gitignore
  - frontend/.env.example
  - frontend/.env.local.example
  - frontend/package.json
  - frontend/tsconfig.json
  - frontend/lib/types.ts
  - frontend/lib/api.ts
  - frontend/components/StatusBadge.tsx
  - frontend/components/LoadingState.tsx
  - frontend/components/AlertCard.tsx
  - frontend/components/MetricCard.tsx
  - frontend/components/SPLQueryBlock.tsx
  - frontend/components/EvidenceCard.tsx
  - frontend/components/Timeline.tsx
  - frontend/components/RiskScore.tsx
  - frontend/components/RecommendationPanel.tsx
  - frontend/components/ReportPreview.tsx
  - frontend/components/AppShell.tsx
  - frontend/app/layout.tsx
  - frontend/app/globals.css
  - frontend/app/page.tsx
  - frontend/app/alerts/page.tsx
  - frontend/app/alerts/[alertId]/page.tsx
  - frontend/app/settings/page.tsx
  - frontend/app/about/page.tsx
tests:
  - npm run lint
  - npm run build
---

## Prompt

Approved. Proceed with executing Phase 2 frontend implementation now.

Read the Phase 2 `implementation_plan.md` you just created, then implement it fully.

# Phase 2 Goal

Build the Next.js TypeScript Tailwind frontend for Splunk SentinelOps AI and connect it to the verified FastAPI backend.

# Current Backend Status

Backend is verified and ready.

Backend commands:
cd backend
uvicorn app.main:app --reload

Backend base URL:
http://127.0.0.1:8000

Backend tests passed:
8 passed

# Important Rules

* Do not stop after planning.
* Do not ask for another approval unless a destructive or unsafe action is required.
* Implement Phase 2 now.
* Do not change backend unless a tiny API-contract fix is absolutely necessary.
* Do not add authentication.
* Do not add database.
* Do not implement real destructive security actions.
* Do not connect real Splunk yet.
* Do not implement MCP yet.
* Do not implement final README yet.
* Keep the frontend focused on mock-mode backend integration.

# Frontend Setup

If the `frontend/` folder is empty or not initialized, initialize a Next.js project using TypeScript, Tailwind CSS, ESLint, and App Router.

Use a non-interactive setup where possible.

Create or complete:

frontend/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── alerts/
│   │   ├── page.tsx
│   │   └── [alertId]/
│   │       └── page.tsx
│   ├── settings/
│   │   └── page.tsx
│   └── about/
│       └── page.tsx
├── components/
│   ├── AppShell.tsx
│   ├── StatusBadge.tsx
│   ├── AlertCard.tsx
│   ├── MetricCard.tsx
│   ├── SPLQueryBlock.tsx
│   ├── EvidenceCard.tsx
│   ├── Timeline.tsx
│   ├── RiskScore.tsx
│   ├── RecommendationPanel.tsx
│   ├── ReportPreview.tsx
│   └── LoadingState.tsx
├── lib/
│   ├── api.ts
│   └── types.ts
└── .env.example

# Environment

Create:

frontend/.env.example

with:

NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000

If helpful, also create:

frontend/.env.local.example

with the same value.

# API Client

Create `frontend/lib/api.ts` with:

* getHealth()
* getAlerts()
* getAlert(alertId: string)
* investigateAlert(alertId: string)
* exportReport(alertId: string)
* getSplunkStatus()
* updateRecommendation(alertId: string, recommendationId: string, status: "approved" | "rejected")

Use:
NEXT_PUBLIC_API_BASE_URL

Default fallback:
http://127.0.0.1:8000

# Types

Create `frontend/lib/types.ts` matching the backend exactly.

The investigation response must include:

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

Do not rename backend fields.

# Pages

## Dashboard: app/page.tsx

Show:

* Project title: Splunk SentinelOps AI
* Subtitle: Agentic SOC Investigation Assistant
* Backend health status
* Splunk status
* Total alerts
* Critical/high/medium alert counters
* Open Alert Queue button
* Workflow summary:
  Alert → AI Investigation → SPL Queries → Evidence → Timeline → Risk Score → Human Approval → Report

## Alerts Page: app/alerts/page.tsx

Fetch alerts from backend and show:

* alert title
* severity
* user
* host
* source IP
* time
* status
* Investigate button

## Investigation Page: app/alerts/[alertId]/page.tsx

This is the main demo page.

Before investigation:

* Show alert details
* Show “Investigate with AI” button
* Explain that the backend will run the agentic pipeline

After clicking:

* Show loading state
* Show generated SPL queries
* Show evidence cards
* Show attack timeline
* Show risk score
* Show risk factors
* Show AI summary
* Show human approval recommendations
* Show report preview

## Settings Page

Show:

* API base URL
* backend mode if available
* AI mode if available
* Splunk mode if available
* note that mock mode is default
* no secrets

## About Page

Show:

* What the project does
* Security track
* How Splunk is used
* How AI agents are used
* Human-in-the-loop safety
* Architecture summary
* Bonus target: Splunk MCP Server

# Components

Implement:

* AppShell
* StatusBadge
* AlertCard
* MetricCard
* SPLQueryBlock
* EvidenceCard
* Timeline
* RiskScore
* RecommendationPanel
* ReportPreview
* LoadingState

# UI Style

Use a dark premium SOC/security dashboard style.

Requirements:

* Clean enterprise look
* Dark background
* Good spacing
* Clear cards
* Clear severity badges
* SPL query code blocks must be readable
* Risk score must be visually prominent
* Human approval safety note must be visible

# Error and Loading States

Implement:

* backend offline error
* loading alerts
* loading investigation
* alert not found
* API failure message
* empty fallback states

# Human Approval

RecommendationPanel must show:

* action
* reason
* impact
* requires_approval
* status
* Approve button
* Reject button

Use backend endpoint:
POST /alerts/{alert_id}/actions/{recommendation_id}

If backend action endpoint fails, show a clear error and do not crash.

Show safety note:
“All response actions are simulated. No real users, IPs, or systems are modified.”

# Validation

After implementation, run:

cd frontend
npm install
npm run lint
npm run build

If lint or build fails, fix errors and rerun.

If `npm run lint` is not available in this Next.js version, explain that clearly and run the available validation command.

# Git Commit

After successful implementation and validation:

1. Run:
   git status
   git diff --stat

2. Stage safe frontend files only.

3. Commit with message:
   feat: add frontend dashboard and investigation workspace

4. Show:

* final git status
* latest commit hash
* latest commit message

# Final Summary

After completion, summarize:

1. Files created/updated
2. Commands run
3. Whether lint/build passed
4. Pages created
5. Components created
6. API functions created
7. How to run backend
8. How to run frontend
9. Any known issues
10. Commit hash and message
11. Recommended next phase

Proceed with implementation now.

Do not create another plan. Execute the Phase 2 implementation now and commit after successful build.

## Response snapshot

Created the `frontend` folder and bootstrapped the Next.js project. Configured `.env.example`, `.env.local.example`, and `.gitignore` file properties. Coded TypeScript model schemas (`types.ts`) and API client handlers (`api.ts`). Created all 11 requested UI dashboard widgets and navigation panels (`AppShell`, `StatusBadge`, `AlertCard`, `MetricCard`, `SPLQueryBlock`, `EvidenceCard`, `Timeline`, `RiskScore`, `RecommendationPanel`, `ReportPreview`, `LoadingState`). Completed 5 main page components (`page.tsx`, `alerts/page.tsx`, `alerts/[alertId]/page.tsx`, `settings/page.tsx`, `about/page.tsx`). Tested static checking and build compilation, resolved all ESLint warnings and dynamic rendering side-effects, and successfully committed all files to git.

## Outcome

- ✅ Impact: Full security investigation workspace frontend is fully operational and verified, matching the FastAPI backend contracts perfectly.
- 🧪 Tests: `npm run lint` and `npm run build` executed and passed cleanly.
- 📁 Files: Created 25+ frontend files spanning pages, components, client libraries, configs, and ignore directories.
- 🔁 Next prompts: Phase 3: Integration with real Splunk search jobs API endpoints.
- 🧠 Reflection: Resolving set-state-in-effect and typing warnings proactively ensures zero Next.js worker crash issues in production.

## Evaluation notes (flywheel)

- Failure modes observed: initially caught `react-hooks/set-state-in-effect` and type errors during build. Corrected them by performing fetches inside asynchronous blocks and resolving type checks.
- Graders run and results (PASS/FAIL): pass
- Prompt variant (if applicable): none
- Next experiment (smallest change to try): none
