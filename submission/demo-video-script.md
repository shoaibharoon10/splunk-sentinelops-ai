# Demo Video Script — Splunk SentinelOps AI

*   **Target Duration**: 2 minutes 45 seconds (compliant with 2.5 - 3 minute limits)
*   **Speaker Role**: SOC Lead Analyst

---

## ⏱️ Video Timeline & Scene Guide

### Scene 1: The Alert Storm (0:00 - 0:15)
*   **Visual**: Title slide and intro presenting the speaker. Show a screen filled with raw JSON logs and Splunk query cheat sheets.
*   **Action**: Speaker introduces the problem.
*   **Voiceover**:
    > "Security analysts face an uphill battle in today's SOCs. Triaging alerts requires writing complex search queries, parsing raw events, and correlating timelines across multiple sources. This manual process takes hours, giving attackers the time they need to compromise systems. Today, we're changing that."

### Scene 2: Dashboard Overview (0:15 - 0:25)
*   **Visual**: Switch to the Next.js Splunk SentinelOps AI Dashboard page.
*   **Action**: Hover over the alert queue indicators, showing threat counts and active AI gateways.
*   **Voiceover**:
    > "Introducing Splunk SentinelOps AI—an intelligent, human-in-the-loop triage assistant that orchestrates cooperative AI agents directly over Splunk Enterprise data. This is our Command Center dashboard, showing the active threat posture."

### Scene 3: Live Splunk Index Check (0:25 - 0:35)
*   **Visual**: Switch tab to the Splunk Enterprise Web UI showing `index=sentinelops`.
*   **Action**: Execute a quick search to show that security data is indexed with correct sourcetypes.
*   **Voiceover**:
    > "Here is our Splunk Enterprise instance. We've indexed our firewall, endpoint, and authentication logs under the `sentinelops` index, giving us a complete telemetry stream."

### Scene 4: Diagnostics Connection Check (0:35 - 0:45)
*   **Visual**: Switch back to SentinelOps UI and click the **Settings** page.
*   **Action**: Scroll down to display the Splunk Ingestion Diagnostics panel. Highlight the green `CONNECTED` status badge.
*   **Voiceover**:
    > "Looking at the Diagnostics panel, we can confirm our connection state. The backend is actively communicating with Splunk's REST API, verifying server reachability, configured authentication, and index record counts."

### Scene 5: Inspecting the Alert Queue (0:45 - 0:55)
*   **Visual**: Click on the **Alert Queue** tab in the sidebar navigation.
*   **Action**: Point to the list of raw alerts, highlighting `alert-001`.
*   **Voiceover**:
    > "Let's open our active Alert Queue. We see several threats flagged by Splunk's alert engine, including a critical multi-stage threat targeting our domain controller host."

### Scene 6: Opening Alert-001 Detail (0:55 - 1:05)
*   **Visual**: Click on the row for `alert-001` to open the investigation workspace.
*   **Action**: Show the alert details card: host `win-dc-01`, user `admin`, IP `185.21.44.10`, severity `Critical`.
*   **Voiceover**:
    > "We click into our target alert: 'Suspicious Login and Command Execution Cascade'. The metadata extracts our target host, user, source IP, and the detection timestamp."

### Scene 7: Triggering Agentic Investigation (1:05 - 1:15)
*   **Visual**: Click the pulsing green **"Investigate with AI"** button.
*   **Action**: Show the agent pipeline timeline indicator showing Alert Parser, SPL Planner, and Evidence Collector agents executing in sequence.
*   **Voiceover**:
    > "We trigger our investigation. Under the hood, a cooperative team of 7 AI agents begins triaging the alert. The pipeline extracts context, creates search playbooks, and queries our Splunk index automatically."

### Scene 8: Showing Generated SPL Queries (1:15 - 1:25)
*   **Visual**: Scroll down to the **Generated SPL Queries** code card block.
*   **Action**: Highlight the endpoint and firewall search queries.
*   **Voiceover**:
    > "The SPL Planner agent generates precise Splunk search queries tailored to the host. Notice that it checks both `extracted_host` and `host` to handle Splunk's CSV ingestion mapping quirks automatically."

### Scene 9: Reviewing Splunk Evidence Cards (1:25 - 1:35)
*   **Visual**: Scroll down to the **Evidence Cards** grid.
*   **Action**: Expand the endpoint and firewall evidence cards showing raw log records returned by Splunk REST.
*   **Voiceover**:
    > "Our Evidence Collector queries the index and retrieves matching events, rendering them as structured evidence cards displaying raw logs from our authentications, command executions, and socket egress tables."

### Scene 10: Mapping the Incident Timeline (1:35 - 1:50)
*   **Visual**: Scroll down to display the vertical **Incident Timeline**.
*   **Action**: Move cursor down along the timeline nodes: Failed Logins, Successful Login, Encoded PowerShell, and Large Firewall Egress.
*   **Voiceover**:
    > "The Timeline Builder agent threads these events chronologically. We see a brute-force attack: four failed login attempts followed by a successful admin session. Minutes later, the attacker executes an encoded PowerShell process and initiates a high-volume data exfiltration."

### Scene 11: Risk Score Assessment (1:50 - 2:00)
*   **Visual**: Scroll up slightly to point to the **Risk Score** circular gauge displaying **100 / Critical**.
*   **Action**: Highlight the list of rule-based risk factors explaining the score.
*   **Voiceover**:
    > "Our Risk Scorer evaluates this evidence deterministically, assigning a risk score of 100—categorizing this as a Critical threat based on multi-stage authentication cascades and large data egress."

### Scene 12: Human-in-the-Loop Approval Panel (2:00 - 2:15)
*   **Visual**: Scroll down to the **Analyst Action Panel**.
*   **Action**: Click the **Approve** button on the suggested response recommendations: "Block source IP" and "Reset compromised admin credentials".
*   **Voiceover**:
    > "SentinelOps AI enforces a strict human-in-the-loop safety model. AI-suggested mitigations remain pending in a simulated queue. We review the reasoning, click Approve to block the attacker IP, and Approve to rotate the admin credentials."

### Scene 13: Exporting the Incident Report (2:15 - 2:25)
*   **Visual**: Click the **"Export Incident Report"** button at the top of the workspace.
*   **Action**: Show the Markdown report preview drawer containing all SPL queries, raw log evidence, timeline events, and response approvals.
*   **Voiceover**:
    > "With our approvals recorded, the Report Writer compiles all queries, raw evidence, timelines, and audit logs into a clean, downloadable Markdown executive report."

### Scene 14: Splunk App MCP-ready Assets (2:25 - 2:35)
*   **Visual**: Open the VS Code editor showing the `splunk-app/SplunkSentinelOps/` folder.
*   **Action**: Open `tools.conf` and `tool_input_payload_signatures.json`.
*   **Voiceover**:
    > "For model integration, the repository includes MCP-ready Splunk App assets. These configurations define our search playbooks as standard Model Context Protocol tools, enabling external LLMs to run security queries securely."

### Scene 15: Outro & Pitch (2:35 - 2:45)
*   **Visual**: Return to the main dashboard showing the alert status updated to "Resolved".
*   **Action**: Final pitch to the judges.
*   **Voiceover**:
    > "By pairing Splunk's indexing power with agentic workflows and human-in-the-loop safety, we turn a multi-hour manual triage process into a 30-second response. This is Splunk SentinelOps AI. Thank you."
