# Implementation Plan - Splunk SentinelOps AI

This document establishes the step-by-step implementation plan for **Splunk SentinelOps AI** to ensure a successful, high-quality, and robust delivery within the 5–6 day hackathon development limit.

---

## 1. Technical Architecture Validation

*   **Frontend**: Next.js 14 App Router, TypeScript, and Tailwind CSS. The UI will look like a premium, dark-themed Security Operations Center dashboard.
*   **Backend**: FastAPI, Pydantic, python-dotenv, Requests, and Pandas (for parsing CSV mock logs).
*   **Splunk Integration**: Real Splunk REST API queries for logs, with a zero-dependency mock mode targeting `sentinelops` index indexes.
*   **AI Integration**: OpenAI and Gemini support using a pluggable client layer, with deterministic fallbacks when API keys are absent.
*   **No DB / No Auth**: All session data (remediation status, alert states) is stored in-memory in the FastAPI application.

---

## 2. Implementation Phases

```mermaid
gantt
    title Hackathon Build Timeline (5-6 Days)
    dateFormat  D
    axisFormat Day %d
    
    section Foundation & Data
    Phase 1: Mock Data & FastAPI Root :active, p1, 1, 1
    Phase 2: Mock Agent Pipeline       :p2, after p1, 1
    
    section Frontend
    Phase 2B: SOC Dashboard UI & Workspace :p2b, after p2, 1
    
    section Integration & MCP
    Phase 3: Splunk REST & MCP Assets  :p3, after p2b, 1
    
    section AI Layer
    Phase 4: AI Client Gateway         :p4, after p3, 1
    
    section Submission
    Phase 5: README & Devpost Submission :p5, after p4, 1
```

*   **Phase 1: Backend foundation and mock data (Day 1)**: Set up the FastAPI framework, write CSV seed log files in `demo-data/`, and establish the mock query service.
*   **Phase 2: Mock agentic investigation pipeline (Day 1)**: Draft FastAPI routes, Pydantic schemas, and the 7-agent modules running in mock mode.
*   **Phase 2B: Frontend dashboard and alert UI (Day 2-3)**: Construct the Next.js App Router workspace, dashboard metric cards, timeline streams, risk score gauges, and recommendations panel.
*   **Phase 3: Real Splunk REST integration and MCP-ready assets (Day 4)**: Implement search job flow in `splunk_client.py`, create setup documents (`load_data_to_splunk.md`, `splunk_sample_queries.md`, `splunk_rest_test.md`), and build a lightweight MCP-ready Splunk App config folder.
*   **Phase 4: AI summary layer and mock AI fallback (Day 5)**: Interface Gemini/OpenAI API gateways with secure prompt templates and fallback strategies.
*   **Phase 5: Devpost, README, and final validation (Day 6)**: Finalize Devpost presentation, master README, record the 3-minute video, and run final end-to-end checks.

---

## 3. File-Level Implementation Plan

| Path | Purpose | Timing | Dependencies | Acceptance Criteria |
| --- | --- | --- | --- | --- |
| `demo-data/*.csv` | Source synthetic threat logs | Phase 1 | None | Parsing functions retrieve records without schema failures |
| `backend/app/main.py` | App entry, middleware, routers | Phase 1 | FastAPI | Server starts on port 8000 and responds to `/health` |
| `backend/app/services/mock_data.py` | In-memory query engine | Phase 1 | CSV files | Performs local column filters matching user, host, IP |
| `backend/app/routes/alerts.py` | Alert listing routes | Phase 2 | Mock Data | `GET /alerts` returns 100% valid JSON payload |
| `backend/app/routes/investigate.py` | Runs investigation pipeline | Phase 2 | Agent schemas | Returns mock payload matching Pydantic response contract |
| `backend/app/agents/*.py` | The 7 security agents | Phase 2 | Pluggable models | Each class performs designated parsing, planning, or scoring task |
| `frontend/app/page.tsx` | Dashboard view | Phase 2B | Next.js, TS | Static page displays grids, counters, and mock connection status |
| `frontend/app/alerts/[alertId]/page.tsx` | Workspace detail view | Phase 2B | API Client | Dynamically fetches investigation results and displays components |
| `backend/app/services/splunk_client.py` | Communicates with Splunk | Phase 3 | requests | Polling logic parses search status SID and collects events |
| `splunk-app/SplunkSentinelOps/*` | MCP-ready Splunk app skeleton | Phase 3 | None | Formulates saved searches and tools.conf mappings |
| `backend/app/services/ai_client.py` | Calls LLM APIs | Phase 4 | openai/google-generativeai | Converts structured prompts to Pydantic objects or uses mock templates |

---

## 4. Backend Architecture & Route Plan

*   **CORS Configuration**: Allow origins `http://localhost:3000` (frontend local host) with methods `GET, POST, OPTIONS` and headers `Content-Type, Authorization`.
*   **State Management**: Store the status of active recommendations and alert triage status in global in-memory dictionaries:
    ```python
    remediation_store = {}  # Format: {alert_id: {recommendation_id: status}}
    alert_store = {}        # Format: {alert_id: triage_status}
    ```
*   **Error Boundaries**:
    *   Uncaught exceptions map to `500 Internal Server Error` with JSON layout `{"detail": "Internal error occurred during investigation"}`.
    *   Splunk connection timeout drops cleanly to mock mode after a 3-second connect timeout.

---

## 5. Frontend UI & Component Plan

*   **Modern Premium Theme**: Deep charcoal backgrounds (`bg-zinc-950`), custom borders (`border-zinc-800`), active green accents (`text-emerald-500`), and clean text hierarchies.
*   **Core Panels & Layout**:
    *   **Pipeline Status Tree**: Sidebar stepper displaying agent checklist status as they process.
    *   **Timeline Node Trees**: Flex flow mapping user logins, terminal command parameters, and byte counts.
    *   **Risk Score Gauge**: Circular SVG spinner dynamically coloring by severity (Emerald for Low, Amber for Medium, Orange for High, Rose for Critical).

---

## 6. Splunk Setup & Fallback Specifications

*   **Target Index**: `sentinelops`
*   **Data Types**:
    *   `sentinelops:auth` -> Authentication logs.
    *   `sentinelops:endpoint` -> Sysmon/Process creation command lines.
    *   `sentinelops:firewall` -> Outbound socket volumes.
    *   `sentinelops:web` -> Web request traffic and status code anomalies.
*   **Splunk Client Connection**:
    ```python
    # Connection logic configuration parameters
    SPLUNK_HOST = os.getenv("SPLUNK_HOST", "https://localhost:8089")
    SPLUNK_USERNAME = os.getenv("SPLUNK_USERNAME", "admin")
    SPLUNK_PASSWORD = os.getenv("SPLUNK_PASSWORD", "")
    SPLUNK_TOKEN = os.getenv("SPLUNK_TOKEN", "")
    SPLUNK_VERIFY_SSL = os.getenv("SPLUNK_VERIFY_SSL", "False").lower() == "true"
    ```
*   **Mock Fallback**: If connection fails or credentials parameters are blank, the client routes search commands to the CSV engine, logging `Splunk client offline - executing search via Mock Client`.
*   **MCP-ready Splunk App Assets (`splunk-app/SplunkSentinelOps/`)**:
    - `default/app.conf`: App package configurations (ID, author, version).
    - `default/savedsearches.conf`: Configures pre-defined hunts matching the four target indexes (`SentinelOps Auth/Endpoint/Firewall/Web Investigation`).
    - `default/tools.conf`: Configures MCP-ready security threat analysis tools exposed through the Splunk MCP Server.
    - `default/tool_input_payload_signatures.json`: Maps standard JSON Schema validation inputs (user, host, src_ip, earliest, latest, threshold_bytes).
    - `metadata/default.meta`: Role permissions for searches and tools.
    - `README.md`: Explains integration of SentinelOps tools into Splunk MCP Server.

---

## 7. Pluggable AI Client Plan

*   **API Model Gate**:
    ```python
    # Dynamic client configuration
    AI_PROVIDER = os.getenv("AI_PROVIDER", "mock")  # openai | gemini | mock
    ```
*   **Fail-Safe Summaries**: When `AI_PROVIDER` is set to `mock` or credentials fail, the `report_writer.py` and `recommender.py` load predefined markdown summaries that format the findings generated by the `Timeline Builder` and `Risk Scorer` agents.

---

## 8. Deterministic Risk Score Logic

Risk scoring is computed inside `backend/app/agents/risk_scorer.py`:

```python
score = 0
factors = []

if failed_logins_detected > 3:
    score += 25
    factors.append("Brute-force attempts detected (failed login count: {})".format(failed_logins_detected))

if success_after_failed_logins:
    score += 25
    factors.append("Successful authentication immediately following brute-force attempts")

if new_source_ip:
    score += 15
    factors.append("Access originated from new/unrecognized IP: {}".format(source_ip))

if privilege_commands_detected:
    score += 20
    factors.append("Execution of high-privilege/encoded PowerShell command")

if data_exfiltration_detected:
    score += 15
    factors.append("Anomalous outbound traffic volume: {} MB".format(exfiltrated_mb))

# Max score capped at 100
risk_score = min(score, 100)
```

---

## 9. Human-in-the-Loop Operations

*   **Action Simulation Route**:
    *   `POST /alerts/{alert_id}/actions/{recommendation_id}`: Accepts status `approved` or `rejected`. Updates the global in-memory state dictionary and returns the updated recommendations array.
*   **Simulated Operations**:
    *   *Block IP*: Marks IP as "IP blocked in SentinelOps Firewall Rule (Simulated)".
    *   *Password Reset*: Marks credentials as "Password expired and forced change triggered (Simulated)".

---

## 10. Verification Plan

### Automated Checks
*   `pytest backend/tests/test_endpoints.py`: Verifies endpoints respond with correct schemas in mock mode.
*   `npm run build` (in `/frontend`): Verifies Next.js app builds cleanly.

### Manual Verification
*   Verify mock mode run: Run app with zero env variables and check if detail page shows the 95 risk timeline.
*   Verify Splunk loading: Load CSV files into Splunk Enterprise and confirm queries display search hits in the UI.

---

## 11. Definition of Done (DoD)

Implementation is complete when:
1.  All code runs cleanly without compiler errors or uncaught exceptions.
2.  The mock modes function out-of-the-box with zero configuration files.
3.  The frontend is styled as a premium dashboard.
4.  All documentation files in the repository structure are fully written and committed.
5.  No secret tokens are checked in.
