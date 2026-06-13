# Devpost Submission — Splunk SentinelOps AI

## 💡 Inspiration
Modern Security Operations Centers (SOCs) are overwhelmed. Analysts face thousands of alerts daily. Triaging a single incident requires querying multiple indexes, correlating timestamps across diverse log sources (auth, firewall, endpoints), compiling timelines, and deciding on remediation steps. This manual, slow investigation process takes hours—giving threat actors the critical time they need to compromise systems. 

We built **Splunk SentinelOps AI** to bridge the gap between Splunk's industry-leading search indexer and the reasoning capabilities of cooperative AI agent pipelines—creating an assistant that investigates alerts, generates SPL, correlates evidence, and coordinates human-approved responses in seconds.

---

## ⚙️ What It Does
**Splunk SentinelOps AI** is an intelligent, human-in-the-loop SOC triage and investigation assistant.
*   **Security Command Center**: Shows threat severity distributions, active AI gateways, and Splunk Enterprise diagnostics.
*   **Agentic Investigation**: Dispatches a cooperative team of 7 AI agents (Alert Parser, SPL Planner, Evidence Collector, Risk Scorer, Timeline Builder, Recommendation Agent, and Report Writer) to triage incoming threats.
*   **Transparent SPL Generation**: Displays the exact generated Splunk Search Language (SPL) queries directly in the UI.
*   **Vertical Threat Timeline**: Merges authentication logs, process commands, and egress network bytes into a single chronological incident storyboard.
*   **Rule-Based Risk Scoring**: Calculates a deterministic, rule-based threat risk score (0-100) and displays contributing factors clearly.
*   **Human-in-the-Loop Remediation**: Suggests response recommendations (like blocking IPs or rotating keys) that remain pending in a simulated queue until explicitly reviewed and approved by an analyst.
*   **Report Generation**: Compiles the investigations, queries, timelines, and action approvals into a downloadable Markdown report.

---

## 🛠️ How We Built It
*   **Frontend**: Built with **Next.js 14** (App Router), React, Tailwind CSS, TypeScript, and Lucide React icons.
*   **Backend**: Crafted with **FastAPI** (Python), Pydantic for strict data contracts, Requests, python-dotenv, and Urllib3.
*   **AI Providers**: Pluggable AI gateway with API support for OpenAI and Google Gemini models, alongside a rule-based Mock AI fallback for zero-dependency local runs.
*   **Splunk Client**: Developed a robust REST API client that manages the search job life cycle (creating jobs via POST, polling SID completion status, and fetching results). Includes a local mock CSV parser fallback.

---

## 🔎 How It Uses Splunk
Splunk is the core source of truth for SentinelOps AI:
1.  **Alert Source**: Triages security alerts index tables.
2.  **SPL Query Planner**: Formulates queries checking custom index tables (e.g. `index=sentinelops`) and filtering by extracted context.
3.  **Search Job Execution**: Backend initiates search jobs on Splunk Enterprise (`/services/search/jobs?output_mode=json`), polls the SID state (`entry[0].content.isDone`), and collects rows.
4.  **Field Mapping & Normalization**: Dynamically handles ingestion field overrides (like mapping the original host to `extracted_host` and ingestion hostname to `host`) to ensure query accuracy.

---

## 🧠 How It Uses AI Agents
We constructed a sequential cooperative pipeline containing 7 specialized agents:
1.  **Alert Parser**: Extracts target user, target host, source IP, and timestamps from the alert.
2.  **SPL Query Planner**: Generates SPL queries tailored to the alert timeline.
3.  **Evidence Collector**: Queries the live Splunk index and pulls matching events.
4.  **Risk Scorer**: Evaluates evidence and applies deterministic rules to calculate threat severity.
5.  **Timeline Builder**: Arranges log events chronologically.
6.  **Recommendation Agent**: Suggests response recommendations based on threat factors.
7.  **Report Writer**: Synthesizes details into an executive Markdown summary.

---

## 🎯 Best Use of Splunk MCP Server (Bonus Target Alignment)
To align with the Model Context Protocol (MCP) hackathon track, we built and packaged **MCP-Ready Splunk App Assets** located in `splunk-app/SplunkSentinelOps/`.

*   **Active REST API Integration**: The primary, live integration executes searches directly via the Splunk Enterprise REST API — verified end-to-end (`risk_score=100 Critical` for `alert-001`).
*   **MCP-Ready Blueprint**: We include `tools.conf`, `tool_input_payload_signatures.json`, and `savedsearches.conf`. Once a **Splunk MCP Server** is deployed in your Splunk environment, these assets allow the saved searches to be automatically discovered and exposed as LLM tools.
*   **Honest MCP Status**: The Splunk MCP Server app (v1.2.0) was installed on our local Splunk Enterprise instance. However, **live MCP Server execution was not completed**. The local KV Store (MongoDB) failed to start due to an SSL certificate chain incompatibility introduced by the Splunk 10.x → MongoDB 7.0 upgrade. Without a working KV Store, the MCP Server cannot persist authentication tokens or register tool configurations. Five controlled repair attempts were made and rolled back safely to preserve the working REST integration. Full technical diagnostics are recorded in `docs/bonus-access-check.md`.
*   **Strategic Alignment**: This demonstrates how enterprise Splunk search playbooks can be packaged as Model Context Protocol tools, supporting the bonus track without overclaiming live MCP execution.

---


## 🧪 Real Splunk Manual Verification Statement
We verified the integration against a local **Splunk Enterprise** instance under the following settings:
*   **Splunk Web Console**: http://localhost:8000
*   **Splunk REST API Management Port**: https://localhost:8089 (Port 8089, verified basic auth connection)
*   **Live Index**: `sentinelops`
*   **Custom Sourcetypes**: `sentinelops:auth`, `sentinelops:endpoint`, `sentinelops:firewall`, `sentinelops:web`
*   **Status Connection Endpoint (`GET /splunk/status`)**: Returned `connected=true`, `mode=real`, `configured=true`, and `auth_method=Basic`.
*   **Pipeline Run (`POST /investigate`)**: Successfully processed `alert-001` in real mode, returning a risk score of `100` (Critical), mapping real Splunk rows to evidence cards, and outputting the chronological incident timeline.

---

## 🛡️ Human-in-the-Loop Safety Statement
Safety is a core constraint in critical security sectors. SentinelOps AI enforces a strict **Human-in-the-Loop (HITL)** safety model:
*   **No Autopilot Mitigations**: The AI agents are restricted from directly triggering destructive API commands (like resetting passwords or blocking traffic) in target infrastructure.
*   **Analyst Verification**: Mitigation actions are queued in a pending state on the UI dashboard. They require an analyst's explicit review and approval.
*   **Auditing**: All approved and rejected response actions are stamped with analyst decisions and logged inside the final report.

---

## 💥 Challenges We Faced
*   **Asynchronous Splunk Searching**: Search jobs on Splunk are asynchronous. We solved this by developing a polling loop in our backend client that queries the job SID status before calling results.
*   **Field Ingestion Differences**: Uploading CSV files to Splunk automatically maps the CSV host header to the `extracted_host` field. We fixed this by modifying our generated SPL queries to check `(extracted_host="{host}" OR host="{host}")` and normalizing keys in our evidence collector.
*   **Zero-Dependency Resilience**: Building the application so it works out-of-the-box for judges required implementing fallback mock modes for both Splunk data retrieval and AI provider text generation.
*   **KV Store SSL Incompatibility (Splunk 10.x / MongoDB 7.0)**: After installing the Splunk MCP Server app, the local KV Store (MongoDB) failed to start due to an X.509 certificate chain issue introduced by the Splunk 10.x upgrade to MongoDB 7.0. The new MongoDB engine requires Extended Key Usage extensions (`clientAuth` + `serverAuth`) and a valid Authority Key Identifier — absent from the auto-generated default `server.pem`. We performed five controlled repair attempts (cert regeneration, sslPassword refresh, CA chain repair) and a full backup-restore rollback, ultimately preserving the working Splunk REST integration as the verified demo path.

---

## 🎉 Accomplishments That We're Proud Of
*   Developing a high-fidelity dark-themed SOC workspace dashboard.
*   Constructing a zero-configuration mock mode that simulates the complete brute-force to exfiltration threat storyboard.
*   Packaging compliant, MCP-ready Splunk App configuration assets to demonstrate Model Context Protocol readiness.

---

## 📚 What We Learned
*   **Security Needs Guardrails**: Autopilot AI is dangerous. Human analyst validation remains a core architecture pattern.
*   **Splunk REST Versatility**: Splunk's jobs endpoints are highly responsive once auth and search job SID polling loops are properly handled.

---

## 🚀 What's Next for Splunk SentinelOps AI
*   **Active SOAR Integration**: Connect approved actions directly to cloud APIs (e.g. AWS IAM, Okta, Palo Alto) to execute active mitigations.
*   **Advanced Prompt Shielding**: Add prompt injection safety barriers at the Alert Parser level.
