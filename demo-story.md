# Splunk SentinelOps AI - Demo Story Script

This document details the live demonstration story for the submission video of **Splunk SentinelOps AI**.

*   **Target Duration**: Under 3 minutes
*   **Video Link**: [YouTube Demo Video](https://www.youtube.com/watch?v=yfrEUxkrPWU&t=30s)
*   **Presenter Role**: Lead Security Analyst

---

## ⏱️ Video Timeline & Scene Guide

### Scene 1: Dashboard + Problem Statement (0:00 - 0:20)
*   **Visual**: Show the Splunk SentinelOps AI Dashboard landing page.
*   **Action**: Present the main dashboard view, highlighting the threat landscape.
*   **Voiceover**:
    > "Hi, this is Splunk SentinelOps AI, an agentic SOC investigation assistant built for the Splunk Agentic Ops Hackathon Security track. Security teams face alert fatigue. Analysts must manually search logs, correlate evidence, build timelines, score risk, approve actions, and write incident reports. Splunk SentinelOps AI automates that first investigation workflow using Splunk data."

### Scene 2: Splunk REST and Mock AI Status (0:20 - 0:35)
*   **Visual**: Zoom in on the connection status cards showing backend health and active gateway modes.
*   **Action**: Hover over the Splunk index connectivity and AI Gateway indicators.
*   **Voiceover**:
    > "Here on the dashboard, the backend is online, the Splunk index is connected, and the live integration path is Splunk Enterprise REST API. For stable local judging and zero-dependency execution, the AI gateway is running in Mock AI Mode. The investigation itself uses real Splunk REST evidence, deterministic risk scoring, and human-in-the-loop remediation."

### Scene 3: Alert Queue (0:35 - 0:48)
*   **Visual**: Navigate to the **Alert Queue** page in the sidebar.
*   **Action**: Point to the alert list, locating `alert-001`.
*   **Voiceover**:
    > "Now I will open the Alert Queue. The main demo case is alert zero zero one: a suspicious login and command execution cascade involving the admin user, the host win D C zero one, and the suspicious external IP address, one eighty five dot twenty one dot forty four dot ten."

### Scene 4: Alert-001 Triage Workspace (0:48 - 0:55)
*   **Visual**: Click on `alert-001` to open its dedicated workspace.
*   **Action**: Navigate to the triage workspace showing metadata and empty results prior to running the agent pipeline.
*   **Voiceover**:
    > "I will open the triage workspace and start the investigation."

### Scene 5: Investigate with AI (0:55 - 1:10)
*   **Visual**: Click the green **"Investigate with AI"** button.
*   **Action**: Show the progress indicator of the agent pipeline executing through Alert Parser, SPL Planner, and Evidence Collector stages.
*   **Voiceover**:
    > "The agentic pipeline now parses the alert, plans Splunk SPL searches, collects evidence from Splunk, calculates risk, builds the timeline, recommends analyst-approved actions, and generates a markdown incident report."

### Scene 6: Backend Terminal Showing Splunk REST Dispatch/Retrieval (1:10 - 1:20)
*   **Visual**: Switch to the backend console terminal view.
*   **Action**: Highlight the live console logging output showing SPL searches dispatched to Splunk REST API and the returned data.
*   **Voiceover**:
    > "On the backend terminal, we can see live Splunk REST searches being dispatched and results being retrieved from the sentinelops index."

### Scene 7: Risk Score 100 Critical (1:20 - 1:30)
*   **Visual**: Return to the workspace web UI. Scroll to the **Risk Score** circular gauge.
*   **Action**: Point to the gauge showing **100 / Critical**.
*   **Voiceover**:
    > "Now let’s return to the investigation result. The system calculated an evidence-backed risk score of one hundred, marked as Critical."

### Scene 8: Generated SPL Queries (1:30 - 1:40)
*   **Visual**: Scroll down to the **Generated SPL Queries** code card block.
*   **Action**: Show the planned search queries tailored to check host and user tables.
*   **Voiceover**:
    > "The generated SPL queries are visible, so the analyst can verify exactly how the evidence was collected."

### Scene 9: Evidence Cards (1:40 - 2:05)
*   **Visual**: Scroll down to the **Evidence Cards** grid.
*   **Action**: Display the structured cards parsing the raw log details from authentication, process execution, and firewall connections.
*   **Voiceover**:
    > "The evidence cards show correlated events from authentication logs, endpoint process logs, and firewall logs. The attack starts with repeated failed logins against the admin account. Then a successful login occurs from the same suspicious IP. After that, the system detects suspicious PowerShell execution, privileged account creation, and high outbound data movement."

### Scene 10: Timeline (2:05 - 2:18)
*   **Visual**: Scroll down to the vertical interactive **Incident Timeline**.
*   **Action**: Walk down the chronological milestones of the attack chain.
*   **Voiceover**:
    > "The timeline converts these separate logs into a clear attack chain: brute force, successful login, command execution, privilege escalation, and possible data exfiltration."

### Scene 11: Human-in-the-Loop Approval (2:18 - 2:32)
*   **Visual**: Scroll to the **Remediation Action Panel** at the bottom of the workspace.
*   **Action**: Click the **Approve** button on the "Block source IP" recommendation card.
*   **Voiceover**:
    > "For safety, all high-impact response actions are human-in-the-loop. SentinelOps AI recommends remediation, but the analyst remains in control. I will approve one recommendation to demonstrate the analyst approval workflow."

### Scene 12: Markdown Report (2:32 - 2:42)
*   **Visual**: Click the **"Export Report"** button to open the markdown report drawer.
*   **Action**: Review the structured preview of the incident summary, SPL queries, and approved actions.
*   **Voiceover**:
    > "Finally, the system generates a markdown incident report with the summary, risk factors, SPL queries, raw evidence, timeline, and containment recommendations."

### Scene 13: Architecture and MCP-ready Note (2:42 - 2:58)
*   **Visual**: Display the system architecture overview / concluding dashboard status.
*   **Action**: Point out the final integration architecture.
*   **Voiceover**:
    > "The final architecture uses Next.js, FastAPI, and Splunk Enterprise REST API. MCP-ready assets are included as a future-ready blueprint, but live MCP execution was not enabled because the local Splunk KV Store had a certificate-chain validation blocker. Splunk SentinelOps AI helps SOC teams investigate faster, explain risk with evidence, preserve analyst control, and turn raw Splunk data into an actionable incident report."
