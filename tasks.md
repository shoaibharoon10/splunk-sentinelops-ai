# Splunk SentinelOps AI - Implementation Tasks Checklist

This document details the step-by-step implementation tasks for building **Splunk SentinelOps AI**.
Tasks are prioritized into:
*   **P0**: Core must-have requirements for a working demo and submission.
*   **P1**: Important polish, UI refinement, and real Splunk REST mode.
*   **P2**: Bonus capabilities (MCP server client integration, advanced anomaly rules, multi-AI provider).

---

## 1. Project Setup and Repository Hygiene

### T001 — Initialize Repository Structure
Priority: P0
Phase: Project Setup
Files/Folders:
* `backend/`
* `frontend/`
* `scripts/`
* `demo-data/`
* `submission/`
Description: Ensure all target folders are created in the workspace. Add a standard open-source LICENSE file to the root.
Acceptance Criteria:
* Root folder contains folders: `backend`, `frontend`, `scripts`, `demo-data`, `submission`.
* `LICENSE` file exists in root.
Dependencies:
* `constitution.md`
Notes/Constraints: No code or packages installed yet.

---

## 2. Demo Data Creation

### T002 — Create Synthetic Log Datasets
Priority: P0
Phase: Demo Data Creation
Files/Folders:
* `demo-data/auth_logs.csv`
* `demo-data/endpoint_logs.csv`
* `demo-data/firewall_logs.csv`
* `demo-data/web_logs.csv`
Description: Write static CSV seed records modeling the primary attack sequence (failed logins -> successful login -> suspicious PowerShell execution -> high-volume outbound network bytes).
Acceptance Criteria:
* File `auth_logs.csv` contains failed login attempts and a success log.
* File `endpoint_logs.csv` contains command line events with PowerShell logs.
* File `firewall_logs.csv` contains high byte-count transfers.
Dependencies:
* `spec.md`

### T003 — Create Base Seed Alerts
Priority: P0
Phase: Demo Data Creation
Files/Folders:
* `demo-data/alerts.json`
Description: Create seed security alerts, including `alert-001` matching the primary multi-stage scenario.
Acceptance Criteria:
* File `alerts.json` has valid JSON format.
* Includes details for `alert-001` (title, user, host, IP, severity="Critical").
Dependencies:
* `spec.md`

---

## 3. Backend Foundation

### T004 — Backend Dependencies & Requirements
Priority: P0
Phase: Backend Foundation
Files/Folders:
* `backend/requirements.txt`
Description: List essential backend requirements (FastAPI, Uvicorn, Pydantic, python-dotenv, Requests, Pandas).
Acceptance Criteria:
* `requirements.txt` has no nested or unneeded frameworks.
Dependencies:
* `spec.md`

### T005 — Environment Configuration Template
Priority: P0
Phase: Backend Foundation
Files/Folders:
* `backend/.env.example`
Description: Create template configuration specifying default port, mock toggles, optional AI keys, and Splunk credentials.
Acceptance Criteria:
* Contains placeholders for `SPLUNK_URL`, `SPLUNK_TOKEN`, `AI_PROVIDER`, `OPENAI_API_KEY`, `GEMINI_API_KEY`.
* Default state runs in mock mode.
Dependencies:
* `plan.md`

### T006 — FastAPI Application Base
Priority: P0
Phase: Backend Foundation
Files/Folders:
* `backend/app/main.py`
Description: Bootstrap the core FastAPI server with configuration loading, routers, and CORS middleware enabled.
Acceptance Criteria:
* CORS supports origins `http://localhost:3000` and `http://127.0.0.1:3000`.
* App loads configurations from env or fallbacks cleanly.
Dependencies:
* T004, T005

---

## 4. Backend Schemas and API Contracts

### T007 — Formulate Data Schemas
Priority: P0
Phase: Backend Foundation
Files/Folders:
* `backend/app/schemas.py`
Description: Declare Pydantic models for data interchange: Alert, SPLQuery, EvidenceItem, TimelineEvent, RiskFactor, Recommendation, InvestigationRequest, and InvestigationResponse.
Acceptance Criteria:
* All schemas map perfectly to the contracts specified in Section 4 of `spec.md`.
Dependencies:
* T006

---

## 5. Mock Data Service

### T008 — Construct Mock Database Engine
Priority: P0
Phase: Backend Foundation
Files/Folders:
* `backend/app/services/mock_data.py`
Description: Implement a query helper that reads local CSV/JSON logs and filters records relative to alert timestamp, IP, target user, or target host.
Acceptance Criteria:
* Reading methods return filtered lists matching specific alert variables.
Dependencies:
* T002, T003, T007

---

## 6. Agentic Investigation Pipeline

### T009 — Implement Core Investigation Agent Logic
Priority: P0
Phase: Agent Pipeline
Files/Folders:
* `backend/app/agents/alert_parser.py`
* `backend/app/agents/spl_query_planner.py`
* `backend/app/agents/evidence_collector.py`
* `backend/app/agents/risk_scorer.py`
* `backend/app/agents/timeline_builder.py`
* `backend/app/agents/recommender.py`
* `backend/app/agents/report_writer.py`
Description: Code the logic classes for the 7 pipeline agents. Collect alerts, build SPL, scan CSVs (mock), compile timestamps, determine risk points, draft markdown.
Acceptance Criteria:
* `Risk Scorer` applies the +25, +15, +20 rules deterministically.
* `Recommender` suggesting simulated actions with reasons and impact metrics.
Dependencies:
* T008

---

## 7. Backend Routes

### T010 — Implement FastAPI Endpoint Actions
Priority: P0
Phase: Backend Routes
Files/Folders:
* `backend/app/routes/alerts.py`
* `backend/app/routes/investigate.py`
Description: Code routes mapping `GET /health`, `GET /alerts`, `GET /alerts/{alert_id}`, and `POST /investigate` to return the schema blocks.
Acceptance Criteria:
* Routes validate inputs and return expected JSON payloads.
Dependencies:
* T007, T009

---

## 8. Splunk Client and REST Integration Preparation

### T011 — Prepare Splunk REST Client Stub
Priority: P0
Phase: Integration Prep
Files/Folders:
* `backend/app/services/splunk_client.py`
Description: Set up connection wrappers using requests. Implement mock routing checking if `SPLUNK_URL` is set, failing back to `mock_data.py` if missing.
Acceptance Criteria:
* Clean interface exposing `status()` and `search()`.
Dependencies:
* T006

---

## 9. MCP-ready Abstraction

### T012 — Prepare Splunk MCP Integration Hooks
Priority: P2
Phase: Integration Prep
Files/Folders:
* `backend/app/services/mcp_client.py`
Description: Construct function placeholders that model tool requests matching Model Context Protocol layouts.
Acceptance Criteria:
* Structure exists to pass search parameters to an external MCP client.
Dependencies:
* T006

---

## 10. Mock AI Client and Optional AI Provider Preparation

### T013 — Pluggable AI Client Base
Priority: P0
Phase: Integration Prep
Files/Folders:
* `backend/app/services/ai_client.py`
Description: Code pluggable model selection using environment key validations. When provider keys are missing, execute mock template rendering.
Acceptance Criteria:
* Pluggable client responds with generated summary text under mock and real modes.
Dependencies:
* T006

---

## 11. Report Export

### T014 — Report Markdown Generation Endpoint
Priority: P0
Phase: Backend Routes
Files/Folders:
* `backend/app/routes/investigate.py`
Description: Code the `POST /export-report` route to compile and stream down files containing incident markdown.
Acceptance Criteria:
* Resolves request with appropriate attachment content headers.
Dependencies:
* T010

---

## 12. Backend Testing and Validation

### T015 — Validate Mock Endpoint Contract
Priority: P0
Phase: Backend Validation
Files/Folders:
* `backend/tests/test_endpoints.py`
Description: Run pytest verification confirming that endpoints respond with standard schemas, threat scenario returns risk of 95, and fallbacks operate under missing variables.
Acceptance Criteria:
* Tests run and pass cleanly.
Dependencies:
* T010, T014

---

## 13. Frontend Project Setup

### T016 — Bootstrap Next.js App
Priority: P0
Phase: Frontend Setup
Files/Folders:
* `frontend/package.json`
* `frontend/postcss.config.js`
* `frontend/tailwind.config.ts`
Description: Initialize the Next.js TypeScript application. Set up Tailwind directives.
Acceptance Criteria:
* `npm run dev` starts without runtime compilation failures.
Dependencies:
* `spec.md`

### T017 — Frontend Configurations
Priority: P0
Phase: Frontend Setup
Files/Folders:
* `frontend/.env.example`
Description: Set base backend server URL endpoints.
Acceptance Criteria:
* Config maps to backend endpoints.
Dependencies:
* T016

---

## 14. Frontend API Client

### T018 — Interface API Fetcher Utilities
Priority: P0
Phase: Frontend Setup
Files/Folders:
* `frontend/lib/api.ts`
Description: Create fetch wrappers communicating with FastAPI backend routes.
Acceptance Criteria:
* Handles timeouts and wraps server down errors gracefully.
Dependencies:
* T017

---

## 15. Dashboard UI

### T019 — Create Main Dashboard View
Priority: P0
Phase: Frontend UI
Files/Folders:
* `frontend/app/page.tsx`
Description: Design a dark SOC layout with severity counts (Critical, High, Medium, Low), connection state indicators, and safety information.
Acceptance Criteria:
* Shows actual status badges dynamically matching `/health` endpoints.
Dependencies:
* T018

---

## 16. Alerts List UI

### T020 — Build Alerts Table View
Priority: P0
Phase: Frontend UI
Files/Folders:
* `frontend/components/AlertsList.tsx`
Description: Present pending alerts with status categories and action buttons routing analysts to triage page.
Acceptance Criteria:
* Clicking "Investigate" navigates to investigative workspace.
Dependencies:
* T019

---

## 17. Investigation Detail UI

### T021 — Alert Workspace Dashboard Layout
Priority: P0
Phase: Frontend UI
Files/Folders:
* `frontend/app/investigate/[alert_id]/page.tsx`
Description: Structure the main multi-card investigative page displaying metadata, timeline nodes, and recommendations.
Acceptance Criteria:
* Dynamically fetches alert details on initialization.
Dependencies:
* T018

### T022 — Pipeline Progress Indicator
Priority: P1
Phase: Frontend UI
Files/Folders:
* `frontend/components/PipelineTracker.tsx`
Description: Add a visual stepper checking off active agents in real-time execution.
Acceptance Criteria:
* Shows distinct parser, planner, collector, and scorer stages.
Dependencies:
* T021

---

## 18. SPL Query Display Components

### T023 — SPL Query Block
Priority: P0
Phase: Frontend UI
Files/Folders:
* `frontend/components/SPLQueryBlock.tsx`
Description: Present generated query blocks in styled code containers with clipboard copy.
Acceptance Criteria:
* Query strings copy successfully on action triggers.
Dependencies:
* T021

---

## 19. Evidence, Timeline, Risk Score Components

### T024 — Visual Evidence Cards
Priority: P0
Phase: Frontend UI
Files/Folders:
* `frontend/components/EvidenceCard.tsx`
Description: Present search hits extracted from indices as individual visual log widgets.
Acceptance Criteria:
* Renders indices source badge (`auth`, `endpoint`, `firewall`).
Dependencies:
* T021

### T025 — Timeline Chronology Stream
Priority: P0
Phase: Frontend UI
Files/Folders:
* `frontend/components/Timeline.tsx`
Description: Create vertical connected nodes mapping brute-force, PowerShell commands, and bytes exfiltration events.
Acceptance Criteria:
* Items map correctly by chronological timestamp order.
Dependencies:
* T021

### T026 — Risk Score Circular Gauge
Priority: P0
Phase: Frontend UI
Files/Folders:
* `frontend/components/RiskScore.tsx`
Description: Design dynamic color SVG spinner displaying risk metrics alongside factor details.
Acceptance Criteria:
* Color switches strictly by severity limits.
Dependencies:
* T021

---

## 20. Human Approval Recommendation Panel

### T027 — Action Review Interactive Form
Priority: P0
Phase: Frontend UI
Files/Folders:
* `frontend/components/RecommendationPanel.tsx`
Description: Present proposed mitigation items with status tags. Implement click triggers for Approve/Reject requests.
Acceptance Criteria:
* User clicks update UI state and post updates to backend session dictionary.
Dependencies:
* T021

---

## 21. Report Preview / Export UI

### T028 — Markdown Preview and Export Buttons
Priority: P0
Phase: Frontend UI
Files/Folders:
* `frontend/components/ReportPreview.tsx`
Description: Present draft summary blocks. Implement document trigger download button.
Acceptance Criteria:
* Triggers markdown document download on click.
Dependencies:
* T021

---

## 22. Settings and About Pages

### T029 — Setup About & Diagnostic Configurations
Priority: P1
Phase: Frontend UI
Files/Folders:
* `frontend/app/settings/page.tsx`
* `frontend/app/about/page.tsx`
Description: Add pages explaining Splunk usage, security track criteria, and Splunk server configuration targets.
Acceptance Criteria:
* Renders description summaries cleanly.
Dependencies:
* T016

---

## 23. Frontend Testing and Validation

### T030 — Build Verification Checks
Priority: P0
Phase: Frontend Validation
Files/Folders:
* `frontend/`
Description: Verify frontend compilation and validation routines.
Acceptance Criteria:
* `npm run build` exits without syntax or TypeScript errors.
Dependencies:
* T028, T029

---

## 24. Splunk Enterprise Setup Documentation

### T031 — Splunk Log Ingestion Documentation
Priority: P0
Phase: Documentation
Files/Folders:
* `scripts/load_data_to_splunk.md`
Description: Detail steps to import synthetic CSV datasets and assign target indices (`sentinelops`).
Acceptance Criteria:
* Document outlines setup steps clearly.
Dependencies:
* T002

---

## 25. Real Splunk REST Mode

### T032 — Splunk REST Client Query Job Execution
Priority: P1
Phase: Splunk Integration
Files/Folders:
* `backend/app/services/splunk_client.py`
Description: Implement search API posting (`/services/search/jobs`), SID poll checking, and result collection.
Acceptance Criteria:
* Client retrieves index hits when credentials exist, fallbacks cleanly to CSV parsing when credentials fail.
Dependencies:
* T011

---

## 26. README and Documentation

### T033 — Master README Documentation
Priority: P0
Phase: Documentation
Files/Folders:
* `README.md`
Description: Draft complete details outlining project tagline, setup workflow, environment parameters, agent models, and troubleshooting options.
Acceptance Criteria:
* README covers all non-negotiable hackathon details.
Dependencies:
* `spec.md`

---

## 27. Architecture Diagram Finalization

### T034 — Finalize Architecture Diagrams
Priority: P0
Phase: Documentation
Files/Folders:
* `architecture.md`
* `README.md`
Description: Embed visual flows in documents.
Acceptance Criteria:
* Renders flow schemas clearly.
Dependencies:
* `architecture.md`

---

## 28. Demo Video Preparation

### T035 — Demo Video Runbook
Priority: P0
Phase: Submission Prep
Files/Folders:
* `demo-story.md`
Description: Perform timed visual walks of the investigation page in mock mode to ensure narrative meets strict 3-minute video constraints.
Acceptance Criteria:
* Practice run completes within 3 minutes.
Dependencies:
* T021, T028

---

## 29. Devpost Submission Preparation

### T036 — Devpost Pitch Verification
Priority: P0
Phase: Submission Prep
Files/Folders:
* `submission/devpost-description.md`
* `submission/demo-video-script.md`
Description: Validate submission text formatting and upload scripts.
Acceptance Criteria:
* Texts have no placeholders.
Dependencies:
* `submission/devpost-description.md`

---

## 30. Final End-to-End Testing

### T037 — Final Verification Integration Walkthrough
Priority: P0
Phase: End-to-End Validation
Files/Folders:
* Root Workspace
Description: Run backend and frontend simultaneously with zero env settings. Verify Triage page completes timeline and HITL approval generates report.
Acceptance Criteria:
* Triage is fully functional with zero initial config.
Dependencies:
* T015, T030

---

## 31. P2 Bonus Enhancements

### T038 — Splunk MCP Server Integration
Priority: P2
Phase: Bonus Enhancements
Files/Folders:
* `backend/app/services/mcp_client.py`
Description: Build model parser actions utilizing Splunk MCP tool definitions.
Acceptance Criteria:
* Executes client connection loops when active.
Dependencies:
* T012

---

## 32. MCP-ready Splunk App Assets

### T039 — MCP-ready Splunk App Packaging
Priority: P1
Phase: Integration
Files/Folders:
* `splunk-app/SplunkSentinelOps/default/app.conf`
* `splunk-app/SplunkSentinelOps/default/savedsearches.conf`
* `splunk-app/SplunkSentinelOps/default/tools.conf`
* `splunk-app/SplunkSentinelOps/default/tool_input_payload_signatures.json`
* `splunk-app/SplunkSentinelOps/metadata/default.meta`
* `splunk-app/SplunkSentinelOps/README.md`
Description: Create lightweight, MCP-ready Splunk App configuration files mapping saved searches and tooling payload schemas.
Acceptance Criteria:
* Skeleton config files exist and contain appropriate parameters without hardcoded credentials.
Dependencies:
* T032
