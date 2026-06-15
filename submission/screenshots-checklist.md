# Screenshots Checklist — Splunk SentinelOps AI

Use this checklist to capture and organize visual assets for the hackathon submission gallery on Devpost.

> [!NOTE]
> If the local frontend environment becomes unstable or hard to run near the deadline, screenshots may be captured directly from the recorded demo video frames, as the video demonstrates the fully functional project.

---

## 🖥️ Devpost Gallery Screenshot Checklist

### 1. Command Center Dashboard
- [ ] **Dashboard Home**: Show the primary lander with status badges indicating Splunk Ready / REST Active / Mock AI Mode and the active threat counter.

### 2. Alert Queue
- [ ] **Alert Queue**: Show the listing of alerts with threat levels, specifically highlighting `alert-001`.

### 3. Triage Workspace & Risk Score
- [ ] **Triage workspace results**: Show `alert-001` details with the calculated **Risk Score of 100 (Critical)**.

### 4. Splunk Integration & Evidence
- [ ] **Generated SPL Queries & Evidence Cards**: Show the transparent SPL query planner block alongside the parsed Splunk evidence cards.

### 5. Incident Timeline
- [ ] **Stitched chronological timeline**: Show the vertical attack chain progression from brute-force to data exfiltration.

### 6. Human-in-the-Loop Safeguards
- [ ] **Remediation Action Panel**: Show the pending analyst response recommendations and approval buttons.

### 7. Executive Report Preview
- [ ] **Markdown Report Export**: Show the generated markdown incident report preview/drawer.

---

## 📂 Optional Diagnostic / Architecture Captures
- [ ] **Backend Terminal**: (Optional) Show FastAPI logs detailing live Splunk REST search job dispatch and result polling.
- [ ] **MCP-ready Blueprint**: (Optional) Show the configuration assets structure (`splunk-app/SplunkSentinelOps/`) inside the code editor.
- [ ] **Splunk Enterprise Search**: (Optional) Show the results of `index=sentinelops` inside the Splunk Web console.
