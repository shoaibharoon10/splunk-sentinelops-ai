---
name: "Create SDD Constitution"
description: "Prompt History Record for creating the SDD Constitution"
model: "Gemini 3.5 Flash"
---

```yaml
id: "001"
stage: "constitution"
date: "2026-06-10"
surface: "agent"
feature: "none"
branch: "main"
user: "shoaibharoon10"
command: "None"
labels: ["constitution", "hackathon", "splunk"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - constitution.md
tests:
  - none
```

## Prompt

/sp.constitution

Create a lightweight but strict Spec Driven Development constitution for my hackathon project: "Splunk SentinelOps AI".

Project Context:
I am building this project for the Splunk Agentic Ops Hackathon. The selected track is Security. The project is an AI-powered, human-in-the-loop SOC investigation assistant that uses Splunk security data and AI agents to investigate security alerts, generate SPL queries, collect evidence, build attack timelines, calculate risk scores, explain incidents, and recommend safe response actions.

The final product must be completed very quickly within 5–6 development days, followed by 3 testing/submission days. Therefore, the constitution must enforce a practical hackathon-focused development process: fast, clear, scoped, demo-ready, and submission-ready.

Core Project Idea:
Splunk SentinelOps AI helps security analysts investigate alerts faster by connecting AI agents with Splunk data. The system should allow an analyst to select a suspicious alert, click "Investigate with AI", and receive generated SPL queries, Splunk evidence, a chronological attack timeline, a risk score, an AI explanation, and human-approved response recommendations.

Winning Formula:
AI Agent + Splunk searchable data + generated SPL queries + explainable investigation + human approval + polished demo + clear README + architecture diagram.

Primary Hackathon Track:
Security

Bonus Prize Target:
Best Use of Splunk MCP Server

Primary Demo Scenario:
Brute-force login attempts followed by a successful login, suspicious endpoint activity, and possible data exfiltration.

Example attack flow:
1. Multiple failed login attempts for admin user.
2. Successful login from suspicious/new source IP.
3. Suspicious PowerShell or privileged command execution.
4. Large outbound network traffic suggesting possible exfiltration.
5. AI generates evidence-backed summary, timeline, risk score, and response recommendations.
6. Analyst approves or rejects recommended actions.

Technology Stack:
Frontend:
- Next.js
- TypeScript
- Tailwind CSS

Backend:
- FastAPI
- Python
- Pydantic
- Python-dotenv
- Requests

Splunk:
- Splunk Enterprise trial
- Demo data indexed into Splunk
- Splunk REST API integration is required
- Splunk MCP Server integration or MCP-ready abstraction should be attempted if possible
- Mock mode must exist so the project can run even before Splunk is fully connected

AI:
- AI client must be pluggable
- Mock AI mode must exist
- OpenAI/Gemini/other model support can be added through environment variables
- The project must still work in mock mode if AI API keys are unavailable

Core Features:
1. Security dashboard
2. Alert list
3. Alert detail page
4. "Investigate with AI" action
5. Generated SPL query display
6. Splunk evidence cards
7. Attack timeline
8. Risk score and risk level
9. AI-generated incident explanation
10. Human-in-the-loop recommendation panel
11. Simulated approval/rejection of response actions
12. Exportable incident report
13. Splunk connection status
14. README and setup instructions
15. Architecture diagram in the root repository
16. Demo datasets and example configs

Non-Negotiable Hackathon Requirements:
The repository must include:
- Public open-source code
- LICENSE file
- Complete README.md
- Setup and run instructions
- Required dependencies
- .env.example files
- Demo datasets
- Example Splunk configuration or loading instructions
- Architecture diagram in the repo root
- Clear explanation of how Splunk is used
- Clear explanation of how AI agents are used
- Clear explanation of human-in-the-loop safety
- Demo video script or submission notes

Development Principles:
1. Demo-first development:
   Every feature must support the final 3-minute hackathon demo. Avoid features that do not improve the demo, judging criteria, or submission quality.

2. Splunk must be central:
   The project must visibly use Splunk data. The UI must show generated SPL queries and evidence collected from Splunk or Splunk-compatible mock data. The project should not look like a generic AI chatbot.

3. Agentic workflow must be visible:
   The system must clearly show multiple AI/agentic steps:
   - Alert Parser Agent
   - SPL Query Planner Agent
   - Evidence Collector Agent
   - Risk Scorer Agent
   - Timeline Builder Agent
   - Recommendation Agent
   - Report Writer Agent

4. Human-in-the-loop is mandatory:
   AI must never execute destructive actions automatically. Any high-impact action such as disabling a user, blocking an IP, resetting a password, or escalating an incident must require analyst approval. In this hackathon demo, actions should be simulated.

5. Mock-first, real-second:
   The app must work in mock mode first. Then Splunk REST API integration should be added. This prevents the project from getting blocked by Splunk setup issues.

6. Simple architecture:
   No database unless absolutely necessary.
   No authentication.
   No mobile app.
   No real destructive security actions.
   No complex enterprise deployment.
   No unnecessary microservices.
   No over-engineered agent framework unless it directly improves the demo.

7. Clear API contract:
   Backend responses must be structured JSON and stable before frontend integration. The frontend should not depend on unpredictable LLM text.

8. Explainability:
   Every risk score must include reasons. Every recommendation must be supported by evidence. AI must not claim certainty without evidence.

9. Security and privacy:
   Do not commit API keys, Splunk passwords, tokens, or secrets. Use .env and .env.example. Demo data must be synthetic.

10. Submission readiness:
   Every major feature must have documentation. The README must allow a judge or developer to understand and run the project quickly.

11. Failure-safe behavior:
   If Splunk is unavailable, the app must fall back to mock mode. If AI API is unavailable, the app must fall back to mock AI summaries. The demo must not fail.

12. UI quality:
   The frontend must feel like a premium SOC/security dashboard. It should be clean, dark, modern, and analyst-friendly. Avoid clutter.

13. Time discipline:
   Because this is a 5–6 day build, every task must be prioritized as:
   - Must-have
   - Should-have
   - Nice-to-have
   - Skip

14. No scope creep:
   Do not add features outside the defined scope unless all must-have features are complete.

15. Judge alignment:
   The project must clearly satisfy these judging areas:
   - Technological Implementation: working app, Splunk integration, agent pipeline
   - Design: polished analyst-friendly dashboard
   - Potential Impact: faster SOC triage and investigation
   - Quality of Idea: agentic security workflow with human approval

Required Repository Structure:
Use this structure unless there is a strong reason to improve it:

splunk-sentinelops-ai/
├── README.md
├── LICENSE
├── constitution.md
├── spec.md
├── tasks.md
├── architecture.md
├── demo-story.md
├── submission/
│   ├── devpost-description.md
│   ├── demo-video-script.md
│   └── final-checklist.md
├── demo-data/
│   ├── auth_logs.csv
│   ├── endpoint_logs.csv
│   ├── firewall_logs.csv
│   ├── web_logs.csv
│   └── alerts.json
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── config.py
│   │   ├── schemas.py
│   │   ├── routes/
│   │   │   ├── alerts.py
│   │   │   └── investigate.py
│   │   ├── agents/
│   │   │   ├── alert_parser.py
│   │   │   ├── spl_query_planner.py
│   │   │   ├── evidence_collector.py
│   │   │   ├── risk_scorer.py
│   │   │   ├── timeline_builder.py
│   │   │   ├── recommender.py
│   │   │   └── report_writer.py
│   │   ├── services/
│   │   │   ├── splunk_client.py
│   │   │   ├── mcp_client.py
│   │   │   ├── ai_client.py
│   │   │   └── mock_data.py
│   │   └── utils/
│   │       └── time_utils.py
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── app/
│   ├── components/
│   ├── lib/
│   ├── package.json
│   └── .env.example
└── scripts/
    ├── generate_demo_logs.py
    ├── load_data_to_splunk.md
    └── splunk_sample_queries.md

Backend Requirements:
The backend must expose:
- GET /health
- GET /alerts
- GET /alerts/{alert_id}
- POST /investigate
- POST /export-report
- GET /splunk/status

The investigation response must include:
- alert_id
- title
- summary
- generated_spl
- evidence
- timeline
- risk_score
- risk_level
- recommendations
- human_approval_required
- report_markdown

Frontend Requirements:
The frontend must include:
- Dashboard page
- Alerts list page
- Alert investigation detail page
- Settings page
- About/Architecture page

The UI must display:
- Alert cards
- SPL query blocks
- Evidence cards
- Timeline
- Risk score
- AI explanation
- Recommendation approval panel
- Export report preview
- Splunk connection status
- AI mode status

Demo Dataset Requirements:
Create synthetic demo data for:
1. Authentication logs
2. Endpoint/process logs
3. Firewall/network logs
4. Web/application logs
5. Alerts JSON

Primary Scenario:
Brute-force login followed by successful login and suspicious activity.

Secondary Scenario:
Suspicious PowerShell or encoded command execution.

Tertiary Scenario:
Possible data exfiltration through large outbound traffic.

Risk Scoring Rules:
Risk scoring should be explainable and deterministic. Example:
- Multiple failed logins: +25
- Successful login after failed attempts: +25
- New or suspicious source IP: +15
- Suspicious PowerShell or admin command: +20
- Large outbound traffic: +15

Risk levels:
- 0–30 Low
- 31–60 Medium
- 61–80 High
- 81–100 Critical

Human Approval Rules:
Recommendations must include:
- action
- reason
- impact
- requires_approval
- status

All response actions must remain simulated in the demo.

Allowed Response Actions:
- Force password reset
- Temporarily disable account
- Block suspicious IP
- Review host activity
- Escalate to incident response
- Mark as false positive
- Export incident report

Forbidden Actions:
- Do not actually disable users
- Do not actually block IPs
- Do not delete data
- Do not execute system-level commands
- Do not perform real destructive operations

Documentation Requirements:
README must include:
- Project title
- Tagline
- Problem
- Solution
- Features
- How Splunk is used
- How AI agents are used
- Human-in-the-loop safety model
- Architecture diagram
- Tech stack
- Folder structure
- Setup instructions
- Backend run instructions
- Frontend run instructions
- Splunk setup instructions
- Environment variables
- Demo data explanation
- Example SPL queries
- Demo flow
- Limitations
- Future improvements
- License

Definition of Done:
The project is only considered complete when:
1. Backend runs successfully.
2. Frontend runs successfully.
3. Mock investigation works.
4. Splunk demo data is available.
5. Splunk REST integration is implemented or clearly documented with mock fallback.
6. Generated SPL queries are visible in UI.
7. Evidence cards are visible.
8. Timeline is visible.
9. Risk score is visible.
10. AI explanation is visible.
11. Human approval panel is visible.
12. Export report works.
13. README is complete.
14. Architecture diagram exists in root.
15. .env.example files exist.
16. Demo data exists.
17. License exists.
18. Demo video script exists.
19. Devpost description draft exists.
20. No secrets are committed.

Output:
Create the constitution.md file content based on the above project. Make it concise enough to be usable, but detailed enough to guide all future specs and implementation decisions. After creating the constitution, summarize the key rules and ask for confirmation before generating the next spec files.

## Response snapshot

- Confirmed surface: Splunk SentinelOps AI project root.
- Established constraints, invariants, and non-goals (hackathon speed, mock fallbacks, simulate destructive operations).
- Created `constitution.md` at the project root specifying developer guidelines, technology stack, directory structure, REST API payload, risk scoring rules, allowed simulated actions, and the definition of done checklist.

## Outcome

- ✅ Impact: Created the project constitution at constitution.md governing the hackathon stack, repository structure, API contract, and scoring rules.
- 🧪 Tests: None (n/a for constitution phase)
- 📁 Files: Created constitution.md
- 🔁 Next prompts: Generating specs and task lists for the hackathon project.
- 🧠 Reflection: The constitution focuses heavily on hackathon efficiency (mock-first, demo-driven) to match the tight 5-6 day development timeline.

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): PASS
- Prompt variant (if applicable): none
- Next experiment (smallest change to try): none
