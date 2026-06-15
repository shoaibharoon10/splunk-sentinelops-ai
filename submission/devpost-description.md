# Devpost Submission — Splunk SentinelOps AI

## 💡 Inspiration
Modern Security Operations Centers (SOCs) are overwhelmed. Analysts face thousands of alerts daily. Triaging a single incident requires querying multiple indexes, correlating timestamps across diverse log sources (authentication, firewall, endpoints), compiling timelines, and deciding on remediation steps. This manual, slow investigation process takes hours—giving threat actors the critical time they need to compromise systems. 

We built **Splunk SentinelOps AI** to bridge the gap between Splunk's industry-leading search indexer and the reasoning capabilities of cooperative AI agent pipelines—creating an assistant that investigates alerts, generates SPL, correlates evidence, and coordinates human-approved responses in seconds.

---

## ⚙️ What It Does
Splunk SentinelOps AI is an agentic SOC investigation assistant for the Security track.
*   **Security Command Center**: Displays overall threat severity distributions, active AI gateway status, and Splunk Enterprise diagnostics.
*   **Agentic Investigation**: Dispatches a cooperative team of 7 AI agents (Alert Parser, SPL Planner, Evidence Collector, Risk Scorer, Timeline Builder, Recommendation Agent, and Report Writer) to triage incoming threats.
*   **Transparent SPL Generation**: Displays the exact generated Splunk Search Language (SPL) queries directly in the UI for analyst verification.
*   **Vertical Threat Timeline**: Merges authentication logs, process commands, and egress network bytes into a single chronological incident storyboard.
*   **Rule-Based Risk Scoring**: Calculates a deterministic, rule-based threat risk score (0-100) and displays contributing factors clearly.
*   **Human-in-the-Loop Remediation**: Suggests response recommendations (like blocking IPs or rotating keys) that remain pending in a simulated queue until explicitly approved by an analyst to maintain control.
*   **Report Generation**: Compiles the investigations, queries, timelines, and action approvals into a downloadable Markdown incident report.

---

## 🛠️ How We Built It
*   **Frontend**: Next.js 16 App Router, React, TypeScript, Tailwind CSS
*   **Backend**: FastAPI, Python, Pydantic
*   **Splunk**: Enterprise REST API, SPL, sentinelops index
*   **AI Gateway**: Mock AI Mode active, provider-ready architecture for OpenAI/Gemini when keys are configured and verified
*   **Testing**: pytest, ESLint, Next.js build checks when applicable

---

## 🔎 How It Uses Splunk
Splunk is the core source of truth for SentinelOps AI:
1.  **Alert Source**: Triages security alerts index tables.
2.  **SPL Query Planner**: Formulates queries checking custom index tables (e.g. `index=sentinelops`) and filtering by extracted context.
3.  **Search Job Execution**: Backend initiates search jobs on Splunk Enterprise (`/services/search/jobs?output_mode=json`), polls the SID state (`entry[0].content.isDone`), and collects rows.
4.  **Field Mapping & Normalization**: Dynamically handles ingestion field overrides (like mapping the original host to `extracted_host` and ingestion hostname to `host`) to ensure query accuracy.

---

## 🧠 How It Uses AI/Agents
We constructed a sequential cooperative pipeline containing 7 specialized agents:
1.  **Alert Parser**: Extracts target user, target host, source IP, and timestamps from the alert.
2.  **SPL Query Planner**: Generates SPL queries tailored to the alert timeline.
3.  **Evidence Collector**: Queries the live Splunk index and pulls matching events.
4.  **Risk Scorer**: Evaluates evidence and applies deterministic rules to calculate threat severity.
5.  **Timeline Builder**: Arranges log events chronologically.
6.  **Recommendation Agent**: Suggests response recommendations based on threat factors.
7.  **Report Writer**: Synthesizes details into an executive Markdown summary.

---

## 💥 Challenges We Ran Into
*   **Asynchronous Splunk Searching**: Search jobs on Splunk are asynchronous. We solved this by developing a polling loop in our backend client that queries the job SID status before calling results.
*   **Field Ingestion Differences**: Uploading CSV files to Splunk automatically maps the CSV host header to the `extracted_host` field. We fixed this by modifying our generated SPL queries to check `(extracted_host="{host}" OR host="{host}")` and normalizing keys in our evidence collector.
*   **Zero-Dependency Resilience**: Building the application so it works out-of-the-box for judges required implementing fallback mock modes for both Splunk data retrieval and AI provider text generation.
*   **KV Store Validation Blocker**: We integrated MCP-ready configurations, but encountered a certificate-chain validation issue with the local Splunk KV Store when trying to enable live token persistence. Rather than risk the stable REST connection, we safely isolated the MCP assets as a future-ready blueprint and proceeded with our direct REST API implementation.

---

## 🎉 Accomplishments That We’re Proud Of
*   **End-to-End SOC Workflow**: Implemented a complete investigation workspace, moving beyond static dashboards to a dynamic, interactive triage workbench.
*   **Live Splunk REST Search Dispatch**: Built robust backend job scheduling, polling, and data retrieval from the live Splunk Enterprise REST API.
*   **Generated SPL Transparency**: Rendered the generated SPL queries directly in the UI, ensuring analysts can audit and verify exactly how evidence is gathered.
*   **Evidence-Backed Risk Score**: Calculated a clear, deterministic threat score of 100 (Critical) for the main demo case based on correlated telemetry.
*   **Chronological Attack Timeline**: Aggregated and stitched diverse log sourcetypes into a clean, intuitive vertical progression chart.
*   **Human-in-the-Loop Safety**: Maintained analyst command control by routing recommendations through a verification queue.
*   **Markdown Incident Report Export**: Generated a formatted markdown summary download in one click.
*   **Honest MCP-Ready Blueprint**: Packaged clean Splunk App configuration files to align with the Model Context Protocol.

---

## 📚 What We Learned
*   **Security Needs Guardrails**: Autopilot AI is dangerous. Keeping the analyst in the loop is a core architecture pattern for critical environments.
*   **Splunk REST Versatility**: Splunk's job APIs are highly responsive and versatile once auth and polling states are properly coordinated.
*   **Technical Transparency**: Displaying intermediate steps (like SPL queries) builds trust with analysts.

---

## 🚀 What’s Next for Splunk SentinelOps AI
*   **Active SOAR Integration**: Connect approved actions directly to cloud APIs (e.g. AWS IAM, Okta, Palo Alto) to execute active mitigations.
*   **Advanced Prompt Shielding**: Add prompt injection safety barriers at the Alert Parser level.

---

## 🔌 Honest Implementation Status
*   **Verified Live Path**: The project uses Splunk Enterprise REST API as the verified live evidence path.
*   **AI Gateway Mode**: For stable local judging and zero-dependency execution, the AI gateway runs in Mock AI Mode.
*   **Triage and Remediation**: The investigation itself uses real Splunk REST evidence, deterministic risk scoring, and human-in-the-loop remediation.
*   **MCP Integration**: MCP-ready assets are included as a future-ready blueprint, but live MCP execution was not enabled because the local Splunk KV Store had a certificate-chain validation blocker.
