---
name: "Create Project Specifications"
description: "Prompt History Record for establishing specifications, tasks, architecture, and submission guidelines"
model: "Gemini 3.5 Flash"
---

```yaml
id: "002"
stage: "general"
date: "2026-06-10"
surface: "agent"
feature: "none"
branch: "main"
user: "shoaibharoon10"
command: "None"
labels: ["specification", "architecture", "checklist", "submission"]
links:
  spec: "spec.md"
  ticket: null
  adr: null
  pr: null
files:
  - spec.md
  - tasks.md
  - architecture.md
  - demo-story.md
  - submission/devpost-description.md
  - submission/demo-video-script.md
  - submission/final-checklist.md
tests:
  - none
```

## Prompt

/sp.specify

Read the existing `constitution.md` file first and strictly follow it.

Now create a complete, detailed, hackathon-focused specification for the project:

# Project Name

Splunk SentinelOps AI

# Project Type

Security-track hackathon project for the Splunk Agentic Ops Hackathon.

# Core Idea

Build a human-in-the-loop agentic SOC investigation assistant that uses Splunk security data and AI agents to investigate security alerts, generate SPL queries, collect evidence, build attack timelines, calculate explainable risk scores, generate AI incident summaries, and recommend safe response actions that require analyst approval.

# Important Instruction

Do not write code yet.
Do not create frontend or backend implementation yet.
Only create the project specification and supporting planning documents.
The output must stay fully aligned with `constitution.md`.

# Required Files to Create or Update

Create or update these files in the repository root:

1. `spec.md`
2. `tasks.md`
3. `architecture.md`
4. `demo-story.md`
5. `submission/devpost-description.md`
6. `submission/demo-video-script.md`
7. `submission/final-checklist.md`

If the `submission/` folder does not exist, create it.

# Main Hackathon Track

Security

# Bonus Prize Target

Best Use of Splunk MCP Server

# Core Winning Formula

AI Agent + Splunk searchable data + generated SPL queries + explainable investigation + human approval + polished demo + clear README + architecture diagram.

# Final Demo Scenario

The main demo must focus on this attack flow:

1. Multiple failed login attempts for the `admin` user.
2. A successful login from a suspicious or new source IP.
3. Suspicious endpoint activity such as encoded PowerShell or privileged command execution.
4. Large outbound network traffic suggesting possible data exfiltration.
5. AI agents investigate the incident using Splunk data.
6. The system shows generated SPL queries, collected evidence, attack timeline, risk score, AI explanation, and recommended response actions.
7. The analyst approves or rejects simulated response actions.

# Secondary Demo Scenarios

Also include secondary scenarios for future/demo expansion:

1. Suspicious PowerShell execution.
2. Possible data exfiltration.
3. Web/application anomaly or suspicious 500 error spike.

# Technology Stack

Frontend:

* Next.js
* TypeScript
* Tailwind CSS
* App Router

Backend:

* FastAPI
* Python
* Pydantic
* python-dotenv
* requests
* pandas if needed for mock CSV data

Splunk:

* Splunk Enterprise trial
* Demo data indexed into Splunk
* Splunk REST API integration required
* Splunk MCP Server integration or MCP-ready abstraction should be included if possible
* Mock mode must work even if Splunk is unavailable

AI:

* Pluggable AI client
* Mock AI mode required
* Optional OpenAI/Gemini/other provider through environment variables
* App must not fail if no AI API key is available

# Required Core Features

The specification must include the following features:

1. Security Dashboard

   * Shows alert counts
   * Critical/high/medium alert summary
   * Splunk connection status
   * AI mode status
   * Human-in-the-loop safety badge

2. Alert List

   * Shows synthetic/demo alerts
   * Alert severity
   * Alert title
   * User, host, source IP, time
   * Status
   * Button to investigate

3. Alert Detail / Investigation Page

   * Alert summary
   * “Investigate with AI” button
   * Generated SPL queries
   * Splunk evidence cards
   * Attack timeline
   * Risk score and risk level
   * AI incident explanation
   * Human approval recommendation panel
   * Export incident report preview

4. Agentic Investigation Pipeline
   The spec must define these agents:

   * Alert Parser Agent
   * SPL Query Planner Agent
   * Evidence Collector Agent
   * Risk Scorer Agent
   * Timeline Builder Agent
   * Recommendation Agent
   * Report Writer Agent

5. Splunk Integration

   * Mock mode first
   * Real Splunk REST API mode second
   * MCP-ready abstraction through `mcp_client.py`
   * UI must clearly show generated SPL queries
   * Evidence must appear to come from Splunk-compatible data
   * Splunk status endpoint required

6. Human-in-the-Loop Safety

   * All response actions must be simulated
   * No real blocking, deleting, disabling, resetting, or destructive operations
   * Each recommendation must show reason, impact, requires_approval, and status

7. Report Export

   * Export or generate incident report in Markdown
   * Report must include alert summary, SPL queries, evidence, timeline, risk score, recommendations, and approval status

8. Demo Dataset
   Create specification for:

   * `demo-data/auth_logs.csv`
   * `demo-data/endpoint_logs.csv`
   * `demo-data/firewall_logs.csv`
   * `demo-data/web_logs.csv`
   * `demo-data/alerts.json`

# Required Backend API Specification

Define the exact API contract for these endpoints:

1. `GET /health`
2. `GET /alerts`
3. `GET /alerts/{alert_id}`
4. `POST /investigate`
5. `POST /export-report`
6. `GET /splunk/status`

For each endpoint, specify:

* Purpose
* Request body if any
* Response JSON schema
* Example response
* Error handling behavior

The `POST /investigate` response must include:

* `alert_id`
* `title`
* `summary`
* `generated_spl`
* `evidence`
* `timeline`
* `risk_score`
* `risk_level`
* `risk_factors`
* `recommendations`
* `human_approval_required`
* `report_markdown`
* `mode`
* `splunk_status`
* `ai_status`

# Risk Scoring Specification

Use deterministic and explainable risk scoring.

Example scoring:

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

Risk score must always include explanations through `risk_factors`.

# Recommendation Specification

Recommendations must include:

* `action`
* `reason`
* `impact`
* `requires_approval`
* `status`

Allowed simulated actions:

* Force password reset
* Temporarily disable account
* Block suspicious IP
* Review host activity
* Escalate to incident response
* Mark as false positive
* Export incident report

Forbidden actions:

* Do not actually disable users
* Do not actually block IPs
* Do not delete data
* Do not execute system-level commands
* Do not perform real destructive operations

# Required Repository Structure

The specification must use this target structure:

splunk-sentinelops-ai/
├── README.md
├── LICENSE
├── constitution.md
├── spec.md
├── tasks.md
├── architecture.md
├── demo-story.md
├── submission/
│   ├── devpost-description.md
│   ├── demo-video-script.md
│   └── final-checklist.md
├── demo-data/
│   ├── auth_logs.csv
│   ├── endpoint_logs.csv
│   ├── firewall_logs.csv
│   ├── web_logs.csv
│   └── alerts.json
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── config.py
│   │   ├── schemas.py
│   │   ├── routes/
│   │   │   ├── alerts.py
│   │   │   └── investigate.py
│   │   ├── agents/
│   │   │   ├── alert_parser.py
│   │   │   ├── spl_query_planner.py
│   │   │   ├── evidence_collector.py
│   │   │   ├── risk_scorer.py
│   │   │   ├── timeline_builder.py
│   │   │   ├── recommender.py
│   │   │   └── report_writer.py
│   │   ├── services/
│   │   │   ├── splunk_client.py
│   │   │   ├── mcp_client.py
│   │   │   ├── ai_client.py
│   │   │   └── mock_data.py
│   │   └── utils/
│   │       └── time_utils.py
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── app/
│   ├── components/
│   ├── lib/
│   ├── package.json
│   └── .env.example
└── scripts/
├── generate_demo_logs.py
├── load_data_to_splunk.md
└── splunk_sample_queries.md

# `tasks.md` Requirements

Create a detailed task breakdown using this priority system:

* P0 = must-have for working demo and submission
* P1 = important polish
* P2 = bonus if time allows

Tasks must be grouped into:

1. Project setup
2. Demo data
3. Backend mock mode
4. Agent pipeline
5. Frontend dashboard
6. Investigation UI
7. Splunk REST integration
8. MCP-ready abstraction
9. AI summary layer
10. Human approval workflow
11. Report export
12. README and docs
13. Architecture diagram
14. Demo video preparation
15. Testing checklist
16. Devpost submission

Each task must include:

* task title
* priority
* file/folder affected
* acceptance criteria

# `architecture.md` Requirements

Create a clear architecture document with:

1. High-level architecture explanation
2. Mermaid architecture diagram
3. Data flow
4. Agent flow
5. Splunk integration flow
6. Mock mode vs real Splunk mode
7. Human approval safety model
8. Failure fallback behavior

Include this flow:

SOC Analyst → Next.js Dashboard → FastAPI Agent Orchestrator → AI Agents → Splunk REST API / MCP-ready client → Splunk Enterprise Index → Investigation Result → Human Approval Panel → Incident Report

# `demo-story.md` Requirements

Create a strong 3-minute demo story:

1. Problem statement
2. Project introduction
3. Main attack scenario
4. Live demo flow
5. AI and Splunk explanation
6. Human approval explanation
7. Business value
8. Closing line

The demo must be under 3 minutes.

# `submission/devpost-description.md` Requirements

Create a polished Devpost-ready description with:

1. Inspiration
2. What it does
3. How we built it
4. How it uses Splunk
5. How it uses AI agents
6. Challenges
7. Accomplishments
8. What we learned
9. What’s next
10. Built with

# `submission/demo-video-script.md` Requirements

Create a timestamped video script:

* 0:00–0:20 problem
* 0:20–0:40 solution
* 0:40–1:40 live investigation demo
* 1:40–2:20 human approval and report
* 2:20–2:45 architecture
* 2:45–3:00 closing

# `submission/final-checklist.md` Requirements

Create a final checklist including:

* GitHub repo public
* LICENSE file
* README complete
* Setup instructions complete
* Dependencies listed
* .env.example files present
* Demo datasets present
* Architecture diagram present
* Generated SPL queries visible
* Splunk integration documented
* AI agents documented
* Human approval documented
* Demo video link ready
* Devpost description ready
* No secrets committed
* App tested in mock mode
* App tested in Splunk mode if available

# Important Constraints

Do not add authentication.
Do not add a database.
Do not build a mobile app.
Do not create real destructive security actions.
Do not over-engineer with unnecessary microservices.
Do not change the project idea.
Do not change the selected track.
Do not remove mock mode.
Do not remove Splunk REST API requirement.
Do not remove human-in-the-loop workflow.

# Output Behavior

After generating the files, summarize:

1. What files were created/updated
2. The final project scope
3. The main demo flow
4. Any assumptions made
5. What command/prompt should be run next

Do not start implementation coding yet.

## Response snapshot

- Confirmed surface: Root workspace directory and `submission/` subdirectory.
- Established constraints: No coding implementation in this phase, alignment with `constitution.md`.
- Created files: `spec.md`, `tasks.md`, `architecture.md`, `demo-story.md`, `submission/devpost-description.md`, `submission/demo-video-script.md`, and `submission/final-checklist.md`.
- Documented API schemas, agent structures, prioritized tasks, visual flow script, and submission descriptions.

## Outcome

- ✅ Impact: Created spec.md, tasks.md, architecture.md, demo-story.md, and Devpost submission draft materials, cementing the technical and logistical plan for the hackathon.
- 🧪 Tests: None (n/a for specification phase)
- 📁 Files: Created spec.md, tasks.md, architecture.md, demo-story.md, and submission/ files.
- 🔁 Next prompts: Setup backend folder structure and mock endpoints.
- 🧠 Reflection: Structuring specifications, architecture diagrams, and submission scripts before writing code ensures the development cycle remains locked strictly on demo criteria and hackathon deliverables.

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): PASS
- Prompt variant (if applicable): none
- Next experiment (smallest change to try): none
