# Screenshots Checklist — Splunk SentinelOps AI

Use this checklist to capture and organize visual assets for the hackathon submission gallery and demonstration documentation.

---

## 🖥️ Splunk Web & REST Console
- [ ] **Splunk Enterprise Search**: Capture the Splunk search page showing the results for search `index=sentinelops` to prove active data indexing.
- [ ] **Authentication Log Search**: Capture SPL search and events for sourcetype `sentinelops:auth`.
- [ ] **Endpoint Sysmon Search**: Capture SPL search and events for sourcetype `sentinelops:endpoint` (showing PowerShell commands).
- [ ] **Firewall Egress Search**: Capture SPL search and events for sourcetype `sentinelops:firewall` (showing large byte-out sockets).
- [ ] **Status API Payload**: Screenshot the raw JSON output of the connection ping endpoint `http://127.0.0.1:8001/splunk/status` (showing `connected: true` and `mode: "real"`).

---

## 🎨 SentinelOps Web App Dashboard
- [ ] **Command Center Dashboard**: Capture the main landing dashboard page showing the Critical/High alert counts, the green **API Endpoint: Online** status badge, and the pluggable gateway statuses.
- [ ] **Alert Queue**: Capture the full queue listing showing all alerts (alert-001 through alert-004) with their respective severities and triage states.

---

## 🔎 Investigation Workspace & Agent Output
- [ ] **Workspace Top Header**: Capture the top of the investigation page for `alert-001` showing the **Environment: Real Splunk REST** status header, the alert details metadata card, and the circular **Risk Score Gauge** (100 / Critical).
- [ ] **Generated SPL Queries Block**: Capture the section displaying the precise generated Splunk Search Language queries showing the `extracted_host` conditional filters.
- [ ] **Evidence Cards Grid**: Capture the evidence section showing the parsed log contents returned by Splunk REST.
- [ ] **Chronological Attack Timeline**: Capture the vertical timeline showing the chronological attack progression nodes (failed login attempts, successful login, PowerShell execution, and firewall egress).

---

## 🛡️ Remediation Safety & Executive Reporting
- [ ] **Human Analyst Approval Panel**: Capture the recommendations section showing the pending actions ("Block source IP" and "Reset compromised admin credentials") with active **Approve** buttons.
- [ ] **Incident Report Preview**: Capture the modal/drawer displaying the formatted Markdown executive report ready for export.

---

## 📂 Developer Code & MCP Assets
- [ ] **MCP-ready Config Folder**: Capture the editor sidebar displaying the App configuration directory `splunk-app/SplunkSentinelOps/` (specifically showing the `default/tools.conf` file structure).
- [ ] **Clean Git Workspace**: Screenshot the output of `git status` inside a terminal verifying a clean repository with all verification commits logged.
