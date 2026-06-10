# Final Submission Checklist - Splunk SentinelOps AI

This checklist verifies all submission requirements are met before submitting to the Splunk Agentic Ops Hackathon on Devpost.

---

## 📋 Hackathon Requirements Checklist

### Repo & Metadata
- [ ] **GitHub Repository Public**: The repository is public and accessible.
- [ ] **LICENSE File**: A standard open-source license file (MIT/Apache) exists in the root directory.
- [ ] **No Secrets Committed**: Validated that no real API keys, Splunk passwords, or session tokens are checked into git history. Only `.env.example` templates exist.

### Code & Execution
- [ ] **Backend Run Check**: Backend starts successfully using `uvicorn app.main:app --reload` (or similar commands) and health routes respond.
- [ ] **Frontend Run Check**: Next.js dashboard builds without TS/Lint errors and starts on port 3000.
- [ ] **Pluggable AI Fallback**: The app has been verified to start and run investigations in Mock AI Mode when OpenAI/Gemini keys are absent.
- [ ] **Splunk Fallback**: The app functions in Mock Splunk Mode using the demo CSVs when the real Splunk instance is offline.

### Datasets & Setup
- [ ] **Demo Datasets In Repo**: Synthetic logs (`auth_logs.csv`, `endpoint_logs.csv`, `firewall_logs.csv`, `web_logs.csv`, `alerts.json`) exist under `demo-data/`.
- [ ] **Splunk Setup Instructions**: Explicit instructions on how to set up indices and ingest CSV files into Splunk are documented in the README or setup files.
- [ ] **Environment Variables**: `.env.example` files are present in both `/backend` and `/frontend` with instructions for key configurations.

### UI & Features
- [ ] **SPL Queries Displayed**: The detail UI prints the exact generated SPL query blocks.
- [ ] **Interactive Timeline**: A visual vertical incident timeline displays logs in chronological order.
- [ ] **Evidence Cards**: Splunk search hits are rendered clearly as evidence cards.
- [ ] **Explainable Risk Gauge**: Risk score is displayed dynamically with its contributing risk factors.
- [ ] **Human-in-the-Loop Actions**: The UI has working simulated Approve/Reject buttons for mitigation recommendations.
- [ ] **Markdown Export**: Incident report exports successfully from the frontend as a downloadable markdown document.

### Submission Media & Writeup
- [ ] **Architecture Diagram**: A graphic or Mermaid block representing the Next.js/FastAPI/Splunk/AI flow is displayed in `architecture.md` and the README.
- [ ] **Devpost Description Drafted**: Project description matches requirements (Inspiration, what it does, how we built it, Splunk usage, AI usage, challenges, etc.).
- [ ] **Demo Video Uploaded**: A video under 3 minutes showing the dashboard, alert selection, agent investigation flow, timeline, risk scoring, and HITL action approval is recorded and link is ready.
