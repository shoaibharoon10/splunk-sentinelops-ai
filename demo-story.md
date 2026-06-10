# Splunk SentinelOps AI - Demo Story Script

This document details the live demonstration story for the 3-minute submission video of **Splunk SentinelOps AI**.

---

## 1. Demo Narrative Breakdown

*   **Target Duration**: 2 minutes 50 seconds
*   **Presenter Role**: Lead Security Analyst
*   **Objective**: Show how an analyst triages, investigates, and responds to a multi-stage security threat in under 3 minutes using Splunk data and AI.

---

## 2. Audio & Visual Script

### Segment 1: The Alert Storm (0:00 - 0:25)
*   **Visual**: Show the Next.js Dashboard. Point to the "Critical" alert counters and the green status badge indicating connection to Splunk Enterprise.
*   **Voiceover**:
    > "In a busy Security Operations Center, analysts are flooded with security alerts, spending hours writing search queries and digging through raw logs. Today, we're introducing **Splunk SentinelOps AI**—an intelligent, human-in-the-loop investigation assistant designed to cut triage time down to seconds. Let's look at this active Critical alert: 'Suspicious Login & Command Execution Cascade'."

### Segment 2: Triggering the Agentic Pipeline (0:25 - 0:50)
*   **Visual**: Click on the alert in the list. On the detail page, point out the metadata cards, then click the **"Investigate with AI"** button. Show the pipeline indicator pulsing as it flows through the 7 backend agents.
*   **Voiceover**:
    > "With one click, our team of AI agents starts querying Splunk. First, the Alert Parser extracts host and user context. Then, the SPL Planner generates targeted search queries, passing them to our Evidence Collector to search our active Splunk indices. The entire pipeline executes in seconds, retrieving raw security events directly."

### Segment 3: Reviewing the Evidence & Timeline (0:50 - 1:40)
*   **Visual**: Scroll down. Show the **Generated SPL Queries** block, then highlight the **Splunk Evidence Cards** and the vertical **Incident Timeline**.
*   **Voiceover**:
    > "Here is our threat timeline. We see a multi-stage brute force attack: four failed login attempts from a external IP, immediately followed by a successful admin login. Moments later, the compromised user executed an encoded PowerShell process. Finally, the firewall registered a massive 1.5 gigabyte outbound data transmission to a suspicious destination. All of these logs were indexed in Splunk, correlation queries were run automatically, and the timeline was built for us instantly."

### Segment 4: Explaining the Risk & HITL Decisions (1:40 - 2:20)
*   **Visual**: Point to the Risk Gauge showing **95 / Critical** and hover over the list of contributing risk factors. Scroll to the **Human Approval Recommendation Panel**.
*   **Voiceover**:
    > "Based on this evidence, the Risk Scorer calculates a deterministic risk score of 95, categorizing it as Critical. Underneath, we see AI-suggested response actions. Because safety is non-negotiable, SentinelOps AI uses a human-in-the-loop safety model. High-risk actions—like resetting the admin credentials and blocking the source IP—are simulated here. I will review the reasoning, click 'Approve' to block the IP, and 'Approve' to force password reset."

### Segment 5: Report Export & Summary (2:20 - 2:45)
*   **Visual**: Click **"Export Incident Report"**. Show the Markdown download starting. Display a quick slide of the system architecture.
*   **Voiceover**:
    > "With our approval, the mitigations are queued, and the Report Writer generates a comprehensive markdown incident report documenting the timeline, evidence, SPL queries, and approved actions. Under the hood, FastAPI coordinates these agents, connecting directly to Splunk using REST APIs and pluggable LLM wrappers."

### Segment 6: Outro (2:45 - 3:00)
*   **Visual**: Return to dashboard. The alert state has updated to 'Resolved' and the risk graph has flattened.
*   **Voiceover**:
    > "By combining Splunk's powerful search analytics with the reasoning of agentic workflows and the guardrails of human validation, we turn a multi-hour manual search into a 30-second triage. This is Splunk SentinelOps AI—securing the future, one agent at a time. Thank you."
