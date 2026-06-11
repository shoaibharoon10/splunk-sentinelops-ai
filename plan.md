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

---

## 12. Final Winning Polish Sprint

This sprint focuses on high-impact refinements to boost the project's winning potential while ensuring a bulletproof, zero-dependency demo.

### Phase 4A: AI Gateway (P0)
- **Status**: Default runs on `AI_MODE=mock`.
- **Additions**: Pluggable support for `AI_MODE=openai` and `AI_MODE=gemini` with robust error and timeout handling.
- **Resilient Fallback Rules**:
  - If keys are missing, provider fails, or a request times out (max 20s), the system must fall back to the mock AI generator without breaking.
  - LLM integration must *only* enhance explanations, summaries, and executive reports. It must *not* change deterministic risk scores, nor approve or execute actions.
  - Ensure zero secrets are exposed to the frontend or API JSON responses.
- **Planned Environment Settings**:
  ```ini
  AI_MODE=mock
  OPENAI_API_KEY=
  OPENAI_MODEL=gpt-4o-mini
  GEMINI_API_KEY=
  GEMINI_MODEL=gemini-1.5-flash
  AI_REQUEST_TIMEOUT_SECONDS=20
  ```

### Phase 4B: Developer Tools / AppInspect Documentation (P1)
- **Goal**: Create [docs/appinspect-notes.md](file:///g:/DevHack/Splunk_SentinelOps_AI/docs/appinspect-notes.md) to document developer tool alignment.
- **Required Content**:
  - Explain that the project includes a lightweight, MCP-ready Splunk app skeleton.
  - Clarify it is a hackathon proof-of-concept, not Splunkbase-certified.
  - State that AppInspect has not been run or claimed as passed unless actually executed.
  - Detail future work: AppInspect validation, manifest metadata, icons, permissions, and Splunkbase listing polish.
  - Explain the significance of AppInspect for aligning with Splunk developer tools.

### Phase 4C: MCP Documentation Polish (P1)
- **Goal**: Update existing documents to clarify the exact state of live integration versus MCP-ready assets.
- **Target Files**:
  - [README.md](file:///g:/DevHack/Splunk_SentinelOps_AI/README.md)
  - [submission/devpost-description.md](file:///g:/DevHack/Splunk_SentinelOps_AI/submission/devpost-description.md)
  - [splunk-app/SplunkSentinelOps/README.md](file:///g:/DevHack/Splunk_SentinelOps_AI/splunk-app/SplunkSentinelOps/README.md)
  - [docs/architecture-diagram.md](file:///g:/DevHack/Splunk_SentinelOps_AI/docs/architecture-diagram.md)
- **Required Clarifications**:
  - Clearly distinguish that the active integration today utilizes the Splunk REST API.
  - Clarify that MCP-ready Splunk app assets (`tools.conf`, `tool_input_payload_signatures.json`, `savedsearches.conf`) are included as future-ready integrations.
  - Explain how these saved searches can map to MCP tools when Splunk MCP Server is deployed.
  - Explicitly align this with the "Best Use of Splunk MCP Server" bonus track.
  - Do not claim a live, fully-functional Splunk MCP Server integration exists in the demo if it is not actually implemented.

### Phase 4D: Optional MCP Decision Gate (P2)
- **Goal**: Establish a clear gate for setting up a live Splunk MCP Server.
- **Gate Conditions**:
  - Evaluate setup complexity: Only attempt if it can be done within a very short, low-risk time box.
  - Skip setup if it is time-consuming or risky to the existing demo workspace.
  - If skipped, document the configuration requirements and design as future-ready.

### Phase 4E: Final QA before Screenshots / Video (P0/P1)
- **Goal**: Complete validation before recording.
- **Validation Checklist**:
  - [ ] P0/P1/P2 priorities are verified and aligned.
  - [ ] Skip gates for high-risk dependencies are activated.
  - [ ] AI Gateway is verified optional and handles key omissions and timeouts safely.
  - [ ] MCP claims are accurate and do not exaggerate functionality.
  - [ ] AppInspect is documented realistically.
  - [ ] Ensure screenshots and demo video recording are done only *after* completing these sprint tasks.

### Explicitly Out of Scope / Skipped Items
- Hosted/Production LLM Models (rely on local run keys or mocks)
- Database installation
- Authentication layers
- Major UI redesign
- Real destructive response actions (block IP, password resets must remain simulated)
- Full Splunk SDK agent runtime (use REST API)
- Private-preview Splunk Agent Builder dependency

---

## 13. Bonus Sprint: Live MCP Server and Hosted Models

This bonus sprint outlines a path for integrating live Model Context Protocol (MCP) server endpoints and Splunk Hosted Models, pre-conditioned on verifying the 10GB Splunk Developer License without breaking standard REST API capabilities.

### Prerequisites: Splunk Developer License Ingestion
- Download the 10GB developer personal license file (valid until Dec 07, 2026).
- Install license in Splunk Web Settings (Licensing → Add license → Choose file).
- Restart Splunk Enterprise.
- Re-validate the existing REST investigation demo to ensure zero regressions. Do not start coding bonus integrations until verification is complete.

### Time-boxed Decision Gates
1. **MCP Gate 1: Server and Token (Max 3 hrs)**: Install Splunk MCP Server app and generate token. If token generation fails, stop and document as future-ready.
2. **MCP Gate 2: Tool Discovery (Max 4 hrs)**: Query MCP endpoint to discover SentinelOps app searches. If returns errors, stop and fall back to Splunk REST client.
3. **MCP Gate 3: Integration (Max 4 hrs)**: Complete backend MCP query forwarding. If fails to execute, stop and fall back to REST.
4. **Hosted Models Gate 1: Access (Max 2 hrs)**: Check endpoint authorization response. If access is denied, stop and document as future-ready.
5. **Hosted Models Gate 2: Provider Integration (Max 6 hrs)**: Implement and format Splunk AI Toolkit narrative responses. If fails, stop and fall back to mock/Gemini/OpenAI.

### Proposed Architectures & Fallbacks
- **MCP Client**: Expose parameters `SPLUNK_MCP_URL` and `SPLUNK_MCP_TOKEN`. Route searches through MCP tool inputs, falling back cleanly to the raw Splunk REST API (`splunk_client.py`) on network failures or schema errors.
- **Hosted Models Client**: Expose provider selection `AI_MODE=splunk_hosted`. Query Splunk Cloud AI Toolkit or Cisco Deep Time Series models, falling back cleanly to mock or API gateways (OpenAI/Gemini) on any error.


