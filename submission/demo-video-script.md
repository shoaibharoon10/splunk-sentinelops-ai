# Demo Video Script - Splunk SentinelOps AI

This script outlines the speech, visual cues, and timestamps for the 3-minute demonstration video.

---

## ⏱️ Video Script Timeline

### 0:00 - 0:20 | The Problem
*   **Visual**: PPT slide or screen showing a wall of raw JSON logs and a calendar full of search syntax cheat sheets.
*   **Narrative (Speaker)**:
    > "Security analysts face an uphill battle. Triaging a single alert means searching index tables, typing custom SPL queries, mapping raw timelines, and deciding on responses. This manual process takes hours, giving attackers the time they need to compromise systems. Today, we're changing that."

### 0:20 - 0:40 | The Solution
*   **Visual**: Switch to the Next.js SentinelOps AI Dashboard. Show the alerts list, the Splunk Enterprise status badge, and the AI indicator.
*   **Narrative (Speaker)**:
    > "Introducing Splunk SentinelOps AI. We bridge the gap between Splunk's powerful data indexes and agentic AI. SentinelOps AI automatically correlates telemetry, designs SPL, gathers log evidence, calculates risk scores, and suggests safety-validated response actions—all in seconds."

### 0:40 - 1:40 | Live Investigation Demo
*   **Visual**: Click "Investigate with AI" on the Critical Alert. Show the pipeline indicator spinning. Scroll to show the Generated SPL queries block, then scroll down to the Evidence Cards and vertical Timeline.
*   **Narrative (Speaker)**:
    > "Let's investigate this Critical alert. When we click 'Investigate', 7 cooperative AI agents execute. Our SPL Planner generates search queries to inspect logs. The Evidence Collector queries our Splunk Enterprise index and pulls the events. 
    > As we look at the timeline, the story becomes clear. First, we detect a brute-force authentication attempt: multiple failed log-ins from a new IP followed immediately by a successful admin session. Minutes later, the endpoint registers an encoded PowerShell command. Finally, the network logs show a massive 1.5 gigabyte outbound transfer. The threat is real, and the timeline is mapped automatically."

### 1:40 - 2:20 | Human-in-the-Loop Actions & Report
*   **Visual**: Hover over the circular Risk Gauge showing 95. Move to the Recommendations Panel. Click "Approve" next to the actions: 'Force Password Reset' and 'Block Suspicious IP'.
*   **Narrative (Speaker)**:
    > "Our Risk Scorer rates this threat at 95—Critical severity. The system recommends response actions: blocking the attacker's IP and resetting admin credentials. SentinelOps AI enforces a strict human-in-the-loop safety model. No destructive command is run without our direct approval. We review the reasoning, click Approve to isolate the host, and Approve to rotate credentials, resolving the incident safely."

### 2:20 - 2:45 | Architecture & Fallbacks
*   **Visual**: Show a clean diagram of the application. Next.js, FastAPI, Pydantic, Splunk REST API, and Gemini/OpenAI API wrappers. Highlight the Mock Fallback engine.
*   **Narrative (Speaker)**:
    > "SentinelOps AI is built using Next.js and FastAPI. The backend orchestrates Pydantic-modeled agents. It connects directly to Splunk using the REST API. Most importantly, it includes an offline mock mode that parses local CSV logs if Splunk or the AI API keys are unavailable, guaranteeing operational resilience."

### 2:45 - 3:00 | Outro
*   **Visual**: Return to the main dashboard. Show the alert marked as "Resolved" and the risk curve declining.
*   **Narrative (Speaker)**:
    > "By pairing Splunk's rich analytics with agentic reasoning and human guardrails, we cut threat investigation from hours to a few clicks. This is Splunk SentinelOps AI. Thank you."
