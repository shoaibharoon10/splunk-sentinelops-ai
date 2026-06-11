# Architecture Diagram — Splunk SentinelOps AI

This document provides a visual and structural representation of the **Splunk SentinelOps AI** application architecture, highlighting the data flow, pluggable service interfaces, multi-agent pipeline, and the human-in-the-loop safety model.

---

## 🎨 System Architecture & Data Flow

```mermaid
graph TD
    %% Frontend Components
    subgraph Frontend [Next.js Dashboard UI]
        Dashboard[SOC Command Center]
        AlertQueue[Alert Queue Page]
        Workspace[Triage Workspace]
        ReportPreview[Report Export UI]
        HITLPanel[Human Analyst Approval Panel]
    end

    %% Backend Components
    subgraph Backend [FastAPI Application Service]
        Main[Main API Router]
        Config[App Settings & Env config]
        
        subgraph Orchestrator [Agent Orchestrator Pipeline]
            Parser[1. Alert Parser Agent]
            Planner[2. SPL Query Planner Agent]
            Collector[3. Evidence Collector Agent]
            Scorer[4. Risk Scorer Agent]
            Timeline[5. Timeline Builder Agent]
            Recs[6. Recommendation Agent]
            Writer[7. Report Writer Agent]
        end
        
        SplunkClient{Splunk Client Interface}
        AIClient{AI Provider Gateway}
    end

    %% External & Ingestion Resources
    subgraph Splunk [Splunk Enterprise Indexer]
        RealSplunk[(Splunk Index: sentinelops)]
        MockCSVs[(Mock CSV Log Tables)]
    end
    
    subgraph AIEngines [AI / LLM API Providers]
        Gemini[Google Gemini API]
        OpenAI[OpenAI API]
        MockAI[Deterministic Mock LLM]
    end

    subgraph MCP [Model Context Protocol]
        MCPApp[MCP-ready Splunk App Configs]
    end

    %% Flows & Interactions
    Dashboard -->|Load Alerts / Status| Main
    Workspace -->|Trigger Investigation POST| Main
    Main --> Orchestrator
    
    %% Agent Steps
    Parser -->|Extract Context: host/user/IP| Planner
    Planner -->|Formulate SPL queries| Collector
    
    %% Splunk Gateway Flow
    Collector --> SplunkClient
    SplunkClient -->|connected=true / SPLUNK_MODE=real| RealSplunk
    SplunkClient -->|connected=false / SPLUNK_MODE=mock fallback| MockCSVs
    
    %% AI Gateway Flow
    Orchestrator --> AIClient
    AIClient -->|AI_PROVIDER=gemini| Gemini
    AIClient -->|AI_PROVIDER=openai| OpenAI
    AIClient -->|AI_PROVIDER=mock fallback| MockAI
    
    %% Processing and Aggregation
    RealSplunk -->|Raw splunk rows| Collector
    MockCSVs -->|Mock log strings| Collector
    
    Collector -->|Evidence logs list| Scorer
    Scorer -->|Deterministic Risk Score 0-100| Timeline
    Timeline -->|Chronological Timeline Event List| Recs
    Recs -->|Simulated Remediation Actions| Writer
    Writer -->|Executive Markdown Report| Main
    
    Main -->|InvestigationResponse JSON| Workspace
    
    %% HITL Flow
    Workspace -->|Display investigation results| HITLPanel
    HITLPanel -->|Manual Approve/Reject Action| Main
    Main -->|NO DESTRUCTIVE ACTIONS executed directly| Main
    Main -->|Audited Action Status| Workspace
    Workspace -->|Download report_markdown| ReportPreview

    %% MCP reference
    RealSplunk -.-> MCPApp
    Planner -.-> MCPApp
```

---

## 🔍 Core Component Descriptions

### 1. Frontend Command Center (Next.js & React)
*   **SOC Dashboard**: Renders overall security posture counters, integration connectivity health check badges, and settings profiles.
*   **Triage Workspace**: Displays generated SPL queries, formatted Splunk logs (Evidence Cards), a vertical chronological incident timeline, and an interactive Executive Report preview.
*   **HITL (Human-in-the-Loop) Panel**: Enforces security safety. Destructive remediation actions (like credential rotation or blocking traffic) are queued for review; clicking "Approve" updates the backend audit log without running live destructions.

### 2. FastAPI Gateway Router
*   Exposes endpoints `/alerts`, `/investigate`, `/export-report`, and `/splunk/status`.
*   Directs configuration checks, validates models via Pydantic schemas, and manages background execution.

### 3. Cooperative Multi-Agent Pipeline
*   **Alert Parser**: Extracts key threat properties (user, host, source_ip, timestamp).
*   **SPL Query Planner**: Formulates precise SPL search queries based on the extracted context.
*   **Evidence Collector**: Queries the live Splunk index or fallbacks to parsing mock CSVs.
*   **Risk Scorer**: Evaluates threat factors deterministically (failed logins, PowerScript execution, and egress traffic volumes) and returns a score up to `100` (Critical).
*   **Timeline Builder**: Chronologically threads all auth, firewall, and endpoint logs.
*   **Recommendation Agent**: Generates tailored response playbooks.
*   **Report Writer**: Synthesizes all data into an executive incident report.

### 4. Pluggable Connectors & Resilient Fallbacks
*   **Splunk Client**: Executes search jobs via `/services/search/jobs` using Username/Password or API Tokens. If Splunk is offline or the mode is set to mock, it falls back to reading static CSV datasets.
*   **AI Provider Gateway**: Routes language requests to OpenAI or Gemini. If API keys are missing, the system utilizes a rule-based mock AI pipeline to guarantee zero-dependency developer execution.
*   **MCP-ready App Assets**: Configuration skeleton mapping saved searches to MCP tools for model integration (see [splunk-app/SplunkSentinelOps/](file:///g:/DevHack/Splunk_SentinelOps_AI/splunk-app/SplunkSentinelOps/)).
