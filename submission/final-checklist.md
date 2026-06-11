# Final Submission Checklist — Splunk SentinelOps AI

This checklist verifies all development and submission requirements are satisfied before submitting to the Splunk Agentic Ops Hackathon on Devpost.

---

## 📋 Hackathon Requirements Checklist

### Repo & Metadata
- [ ] **GitHub Repository Public**: Verify that the GitHub repository is public and readable.
- [ ] **LICENSE File**: A standard open-source license file exists in the root directory.
- [ ] **No Secrets Committed**: Checked that no real API keys, Splunk passwords, or session tokens are checked into git history. Only `.env.example` templates exist.
- [ ] **Clean Working Tree**: Verify that `git status` reports a clean workspace before submission.

### Code & Execution
- [ ] **Backend Run Check**: Backend starts successfully using `uvicorn app.main:app --reload --port 8000` (or similar commands) and health routes respond.
- [ ] **Frontend Run Check**: Next.js dashboard builds without TS/Lint errors and starts on port 3000.
- [ ] **Backend Tests Pass**: Verify that running `python -m pytest tests/test_endpoints.py` results in all tests passing.
- [ ] **Frontend Lint Pass**: Verify that running `npm run lint` in the `frontend` folder passes without errors.
- [ ] **Frontend Build Pass**: Verify that running `npm run build` in the `frontend` folder successfully optimizes and creates the production bundle.
- [ ] **Pluggable AI Fallback**: The app has been verified to start and run investigations in Mock AI Mode when OpenAI/Gemini keys are absent.
- [ ] **Splunk Fallback**: The app functions in Mock Splunk Mode using the demo CSVs when the real Splunk instance is offline or disabled.

### Datasets & Setup
- [ ] **Demo Datasets In Repo**: Synthetic logs (`auth_logs.csv`, `endpoint_logs.csv`, `firewall_logs.csv`, `web_logs.csv`, `alerts.json`) exist under `demo-data/`.
- [ ] **Splunk Setup Instructions**: Setup instructions on how to create indices and ingest CSV files into Splunk are documented in the README.
- [ ] **Environment Variables**: `.env.example` files are present in both `/backend` and `/frontend` with instructions for key configurations.

### UI & Features
- [ ] **SPL Queries Displayed**: The detail UI prints the exact generated SPL query blocks.
- [ ] **Interactive Timeline**: A visual vertical incident timeline displays logs in chronological order.
- [ ] **Evidence Cards**: Splunk search hits are rendered clearly as evidence cards.
- [ ] **Explainable Risk Gauge**: Risk score is displayed dynamically with its contributing risk factors.
- [ ] **Human-in-the-Loop Actions**: The UI has working simulated Approve/Reject buttons for mitigation recommendations.
- [ ] **Markdown Export**: Incident report exports successfully from the frontend as a downloadable markdown document.

### Submission Media & Writeup
- [ ] **Architecture Diagram**: A graphic or Mermaid block representing the Next.js/FastAPI/Splunk/AI flow is displayed in `docs/architecture-diagram.md` and the README.
- [ ] **Devpost Description Complete**: Project description matches requirements (Inspiration, what it does, how we built it, Splunk usage, AI usage, challenges, etc.).
- [ ] **Demo Video Recorded**: A video under 3 minutes showing the dashboard, alert selection, agent investigation flow, timeline, risk scoring, and HITL action approval is recorded and ready for upload.
- [ ] **Screenshots Captured**: Necessary screenshot captures are completed according to `submission/screenshots-checklist.md`.
- [ ] **GitHub Pushed**: All commits are pushed to the remote repository.
- [ ] **Devpost Submitted**: Form submitted on Devpost before the hackathon deadline.
