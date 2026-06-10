---
name: "Refine Tasks Checklist"
description: "Prompt History Record for creating the comprehensive implementation-ready tasks checklist (tasks.md)"
model: "Gemini 3.5 Flash"
---

```yaml
id: "004"
stage: "general"
date: "2026-06-10"
surface: "agent"
feature: "none"
branch: "main"
user: "shoaibharoon10"
command: "None"
labels: ["checklists", "validation", "milestones", "priorities"]
links:
  spec: "spec.md"
  ticket: null
  adr: null
  pr: null
files:
  - tasks.md
tests:
  - none
```

## Prompt

/sp.tasks

Read the existing project files first:

* `constitution.md`
* `spec.md`
* `plan.md`
* `tasks.md`
* `architecture.md`
* `demo-story.md`
* `submission/devpost-description.md`
* `submission/demo-video-script.md`
* `submission/final-checklist.md`

Now refine and regenerate `tasks.md` according to Spec Driven Development.

# Important

Do not implement code yet.
Do not create backend code yet.
Do not create frontend code yet.
Do not install dependencies.
Do not run npm, pip, uvicorn, or any setup command.
Only refine the task list into an implementation-ready checklist.

# Project

Project Name: Splunk SentinelOps AI

Track: Security

Hackathon: Splunk Agentic Ops Hackathon

Core Idea:
A human-in-the-loop agentic SOC investigation assistant that uses Splunk security data and AI agents to investigate alerts, generate SPL queries, collect evidence, build attack timelines, calculate explainable risk scores, generate AI incident explanations, and recommend safe simulated response actions requiring analyst approval.

# Source of Truth Priority

Use these files in this priority order:

1. `constitution.md`
2. `spec.md`
3. `plan.md`
4. `architecture.md`
5. `demo-story.md`

If the existing `tasks.md` conflicts with `constitution.md`, `spec.md`, or `plan.md`, update `tasks.md` to match the latest approved plan.

# Goal of This Stage

Create a final, coding-ready `tasks.md` that can guide the implementation phase step-by-step without ambiguity.

The task list must be detailed enough that an implementation agent can build the project without changing scope or missing required hackathon deliverables.

# Task Priority System

Use this priority system:

* P0 = Must-have for working demo and submission
* P1 = Important polish and quality
* P2 = Bonus if time allows

# Required Task Groups

Regenerate `tasks.md` using these sections:

1. Project Setup and Repository Hygiene
2. Demo Data Creation
3. Backend Foundation
4. Backend Schemas and API Contracts
5. Mock Data Service
6. Agentic Investigation Pipeline
7. Backend Routes
8. Splunk Client and REST Integration Preparation
9. MCP-ready Abstraction
10. Mock AI Client and Optional AI Provider Preparation
11. Report Export
12. Backend Testing and Validation
13. Frontend Project Setup
14. Frontend API Client
15. Dashboard UI
16. Alerts List UI
17. Investigation Detail UI
18. SPL Query Display Components
19. Evidence, Timeline, Risk Score Components
20. Human Approval Recommendation Panel
21. Report Preview / Export UI
22. Settings and About Pages
23. Frontend Testing and Validation
24. Splunk Enterprise Setup Documentation
25. Real Splunk REST Mode
26. README and Documentation
27. Architecture Diagram Finalization
28. Demo Video Preparation
29. Devpost Submission Preparation
30. Final End-to-End Testing
31. P2 Bonus Enhancements

# Required Format for Each Task

Each task must include:

* Task ID
* Title
* Priority: P0, P1, or P2
* Phase
* Files/Folders affected
* Description
* Acceptance criteria
* Dependencies
* Notes/Constraints

Example format:

## T001 — Initialize Backend Folder Structure

Priority: P0
Phase: Backend Foundation
Files/Folders:

* `backend/app/main.py`
* `backend/app/config.py`
* `backend/requirements.txt`

Description:
Create the backend folder structure exactly as defined in the spec.

Acceptance Criteria:

* Folder structure exists.
* Required files exist.
* No frontend code is created.
* No database/authentication is added.

Dependencies:

* `constitution.md`
* `spec.md`
* `plan.md`

Notes/Constraints:
Follow mock-first development.

# Required Backend Tasks

The backend task list must cover:

1. Create backend folder structure
2. Create `requirements.txt`
3. Create `.env.example`
4. Configure FastAPI app
5. Enable CORS for:

   * `http://localhost:3000`
   * `http://127.0.0.1:3000`
6. Create Pydantic schemas for:

   * Alert
   * InvestigationRequest
   * SPLQuery
   * EvidenceItem
   * TimelineEvent
   * RiskFactor
   * Recommendation
   * InvestigationResponse
   * SplunkStatus
   * ReportExportRequest
   * HealthResponse
7. Create demo data files:

   * `demo-data/auth_logs.csv`
   * `demo-data/endpoint_logs.csv`
   * `demo-data/firewall_logs.csv`
   * `demo-data/web_logs.csv`
   * `demo-data/alerts.json`
8. Implement mock data service
9. Implement Alert Parser Agent
10. Implement SPL Query Planner Agent
11. Implement Evidence Collector Agent
12. Implement Risk Scorer Agent
13. Implement Timeline Builder Agent
14. Implement Recommendation Agent
15. Implement Report Writer Agent
16. Implement mock AI client
17. Implement Splunk client placeholder and status
18. Implement MCP-ready client placeholder
19. Implement:

* `GET /health`
* `GET /alerts`
* `GET /alerts/{alert_id}`
* `POST /investigate`
* `POST /export-report`
* `GET /splunk/status`

20. Validate primary alert returns Critical risk score
21. Validate backend works in mock mode with no Splunk and no AI key

# Required Frontend Tasks

The frontend task list must cover:

1. Initialize Next.js TypeScript Tailwind frontend
2. Configure environment variables
3. Create API client
4. Create dashboard page
5. Create alerts list page
6. Create alert detail/investigation page
7. Create settings page
8. Create about/architecture page
9. Create components:

   * AlertCard
   * StatusBadge
   * SPLQueryBlock
   * EvidenceCard
   * Timeline
   * RiskScore
   * RecommendationPanel
   * ReportPreview
10. Implement loading states
11. Implement error states
12. Implement “Investigate with AI” action
13. Display generated SPL queries
14. Display evidence cards
15. Display attack timeline
16. Display risk score and risk factors
17. Display AI explanation
18. Display human approval panel
19. Simulate approve/reject action state
20. Display/export report preview

# Required Splunk Tasks

The Splunk-related tasks must cover:

1. Document Splunk Enterprise setup
2. Document index name:

   * `sentinelops`
3. Document sourcetypes:

   * `sentinelops:auth`
   * `sentinelops:endpoint`
   * `sentinelops:firewall`
   * `sentinelops:web`
4. Provide sample SPL queries
5. Prepare Splunk REST API client
6. Add environment variables for Splunk
7. Implement fallback if Splunk is unavailable
8. Keep mock mode as default
9. Add real mode only after mock mode works

# Required AI Tasks

The AI-related tasks must cover:

1. Mock AI summary generation
2. Optional provider-based AI through env variables
3. Deterministic backend response structure
4. No frontend dependency on unpredictable LLM output
5. SOC-style explanation generation
6. Safety note for human approval

# Risk Scoring Tasks

The task list must preserve this scoring model:

* Multiple failed logins: +25
* Successful login after failed attempts: +25
* Suspicious/new source IP: +15
* Suspicious PowerShell or privileged command: +20
* Large outbound traffic: +15

Risk levels:

* 0–30 Low
* 31–60 Medium
* 61–80 High
* 81–100 Critical

# Human-in-the-Loop Tasks

The task list must include:

1. Recommendations must be simulated only.
2. No real disabling, blocking, deleting, resetting, or destructive action.
3. Approve/reject state can be in-memory.
4. UI must show that actions require analyst approval.
5. Report must include approval status.

# Documentation Tasks

The task list must include:

1. Complete README.md
2. LICENSE file
3. Architecture diagram in root
4. Setup instructions
5. Backend run instructions
6. Frontend run instructions
7. Splunk setup instructions
8. Demo data explanation
9. Example SPL queries
10. Human-in-the-loop explanation
11. AI agents explanation
12. Devpost description
13. Demo video script
14. Final checklist

# Testing Tasks

The task list must include test steps for:

1. Backend mock mode
2. Backend endpoints
3. Primary alert investigation
4. Report export
5. Splunk status endpoint
6. Frontend dashboard
7. Frontend alerts page
8. Frontend investigation page
9. Human approval UI
10. End-to-end demo flow
11. README run instructions
12. No secrets committed
13. Devpost final checklist

# P0 Must-Have Definition

Mark these as P0:

* Backend mock mode
* Demo data
* Agent pipeline
* Required API endpoints
* Frontend dashboard
* Alerts list
* Investigation page
* Generated SPL display
* Evidence cards
* Timeline
* Risk score
* Recommendations
* Human approval panel
* Report export
* README
* LICENSE
* Architecture diagram
* Demo video script
* Final checklist

# P1 Definition

Mark these as P1:

* UI polish
* Better error handling
* Splunk REST mode
* Better README screenshots/placeholders
* Settings page polish
* About page polish
* Improved loading states
* Improved report formatting

# P2 Definition

Mark these as P2:

* Full Splunk MCP Server integration
* Splunk Hosted Models integration
* AppInspect or Splunk developer tools polish
* PDF export
* Advanced anomaly detection
* Multiple AI providers beyond mock mode
* Extra demo scenarios beyond the main one

# Implementation Order

The task list must make this order very clear:

1. Backend mock mode first
2. Demo data
3. Agent pipeline
4. Backend endpoint validation
5. Frontend setup
6. Frontend UI integration
7. Report export
8. Documentation
9. Splunk REST mode
10. MCP bonus attempt
11. Testing
12. Submission polish

# Constraints

Do not add:

* Authentication
* Database
* Mobile app
* Real destructive security actions
* Unnecessary microservices
* Complex deployment
* Features outside the project scope

Do not remove:

* Mock mode
* Splunk REST API requirement
* MCP-ready abstraction
* Human approval workflow
* Generated SPL display
* Risk scoring
* Report export

# Output Requirements

Update `tasks.md` only unless a small supporting note is necessary.

After updating `tasks.md`, summarize:

1. Files read
2. Files updated
3. Number of tasks generated
4. P0/P1/P2 distribution
5. First 10 implementation tasks
6. Whether the project is now ready for `/sp.implement` or `/sp.implementation`

Do not start coding. 
 Do not implement code. Only refine tasks.md.

## Response snapshot

- Confirmed surface: Workspace root `tasks.md` file.
- Established constraints: Refine `tasks.md` strictly into a coding-ready checklist without implementing code.
- Mapped all 31 requested sections, mapping priorities P0/P1/P2 matching project requirements.
- Regenerated and wrote `tasks.md` in the required detailed template.

## Outcome

- ✅ Impact: Refined tasks.md to provide a completely detailed, step-by-step checklist of 38 tasks covering setup, agents, UI widgets, REST clients, fallbacks, docs, and validation.
- 🧪 Tests: None (n/a for task phase)
- 📁 Files: Updated tasks.md
- 🔁 Next prompts: Ready for /sp.implement implementation commands.
- 🧠 Reflection: Creating highly granular task descriptions with distinct priority labels allows developers to quickly partition must-have features from subsequent integrations.

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): PASS
- Prompt variant (if applicable): none
- Next experiment (smallest change to try): none
