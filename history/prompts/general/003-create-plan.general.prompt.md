---
name: "Create Project Plan"
description: "Prompt History Record for creating the implementation plan (plan.md and implementation_plan.md)"
model: "Gemini 3.5 Flash"
---

```yaml
id: "003"
stage: "general"
date: "2026-06-10"
surface: "agent"
feature: "none"
branch: "main"
user: "shoaibharoon10"
command: "None"
labels: ["planning", "architecture", "milestones", "fallbacks"]
links:
  spec: "spec.md"
  ticket: null
  adr: null
  pr: null
files:
  - plan.md
  - C:\Users\Shoaib Haroon\.gemini\antigravity-ide\brain\448c10cf-26f9-46b3-a551-ae575c9f13c4\implementation_plan.md
tests:
  - none
```

## Prompt

/sp.plan

Read the existing project files first:

- constitution.md
- spec.md
- tasks.md
- architecture.md
- demo-story.md
- submission/devpost-description.md
- submission/demo-video-script.md
- submission/final-checklist.md

Now create the implementation plan for "Splunk SentinelOps AI" according to Spec Driven Development.

Important:
- Do not implement code yet.
- Do not create backend or frontend code yet.
- Do not install dependencies.
- Do not modify the project idea.
- Follow constitution.md strictly.
- Use spec.md as the source of truth.
- If tasks.md already exists, review it but do not treat it as final yet. It should be refined after this plan.

Project:
Splunk SentinelOps AI is a Security-track hackathon project for the Splunk Agentic Ops Hackathon. It is a human-in-the-loop agentic SOC investigation assistant that uses Splunk security data and AI agents to investigate alerts, generate SPL queries, collect evidence, build attack timelines, calculate explainable risk scores, generate AI incident summaries, and recommend safe response actions requiring analyst approval.

Goal of this planning stage:
Create a complete implementation plan that converts the specification into a safe, realistic, 5–6 day hackathon build plan.

The plan must cover:

1. Technical architecture validation
   - Confirm frontend, backend, Splunk, AI, and mock-mode architecture.
   - Confirm that the system follows mock-first, real-Splunk-second development.
   - Confirm that no database, authentication, mobile app, or destructive actions are needed.

2. Implementation phases
   Define clear phases:
   - Phase 1: Backend foundation and mock data
   - Phase 2: Mock agentic investigation pipeline
   - Phase 3: Frontend dashboard and alert UI
   - Phase 4: Investigation UI with SPL, evidence, timeline, risk score, recommendations
   - Phase 5: Splunk REST API integration
   - Phase 6: AI summary layer and mock AI fallback
   - Phase 7: Report export
   - Phase 8: MCP-ready abstraction
   - Phase 9: README, architecture, demo video, submission polish
   - Phase 10: Testing and fixes

3. File-level implementation plan
   For each major file/folder, explain:
   - purpose
   - when it will be created
   - dependencies
   - acceptance criteria

4. Backend plan
   Include exact plan for:
   - FastAPI app
   - routes
   - Pydantic schemas
   - agent modules
   - mock data service
   - Splunk client
   - MCP-ready client
   - AI client
   - CORS
   - .env.example
   - error handling

5. Frontend plan
   Include exact plan for:
   - Next.js App Router
   - dashboard page
   - alerts page
   - alert detail page
   - settings/about page
   - components
   - API client
   - loading/error states
   - polished SOC dashboard UI

6. Splunk integration plan
   Include:
   - mock mode behavior
   - real Splunk REST API mode
   - required env variables
   - demo index name: sentinelops
   - sourcetypes:
     - sentinelops:auth
     - sentinelops:endpoint
     - sentinelops:firewall
     - sentinelops:web
   - sample SPL queries
   - fallback behavior when Splunk is unavailable

7. AI integration plan
   Include:
   - mock AI mode
   - optional provider mode through env variables
   - deterministic structured backend response
   - no dependency on unpredictable LLM output for frontend contract

8. Risk scoring plan
   Confirm deterministic scoring:
   - Multiple failed logins: +25
   - Successful login after failed attempts: +25
   - Suspicious/new source IP: +15
   - Suspicious PowerShell or privileged command: +20
   - Large outbound traffic: +15

9. Human-in-the-loop safety plan
   Confirm:
   - all response actions are simulated
   - no real destructive actions
   - approval/rejection state can be in-memory
   - recommendations include action, reason, impact, requires_approval, status

10. Testing plan
   Include:
   - backend endpoint testing
   - frontend flow testing
   - mock mode testing
   - Splunk mode testing if available
   - demo video dry run
   - final Devpost checklist

11. Risks and fallbacks
   Include:
   - Splunk setup fails → mock mode still works
   - AI key unavailable → mock AI summary works
   - MCP setup difficult → MCP-ready abstraction and REST API fallback
   - time short → P0 features only
   - frontend/backend mismatch → fixed API contract from schemas

12. Definition of Done
   The plan must define exact completion criteria before implementation starts.

Required output:
Create or update an implementation plan file, preferably:
- plan.md

If there is already an implementation plan file, update it instead of duplicating.

After creating plan.md, summarize:
1. Files read
2. Files created/updated
3. Final implementation phases
4. Key risks and fallbacks
5. Whether tasks.md should be regenerated/refined next

Do not start coding.

## Response snapshot

- Verified technical architecture constraints (FastAPI backend, Next.js frontend, no database or authentication).
- Validated mock-first, real-second strategies for Splunk REST and pluggable AI providers.
- Formulated a 10-phase Gantt chart timeline mapping.
- Wrote detailed file lists, routes, components, and deterministic risk score formulas.
- Generated `plan.md` in root workspace and `implementation_plan.md` in artifacts directory.

## Outcome

- ✅ Impact: Established plan.md and implementation_plan.md governing build phases, risk metrics, fallbacks, and verification procedures.
- 🧪 Tests: None (n/a for planning phase)
- 📁 Files: Created plan.md and implementation_plan.md.
- 🔁 Next prompts: Refine/regenerate tasks.md checklist based on this plan.
- 🧠 Reflection: Having a detailed Gantt timeline and precise code mocks structured in the plan significantly mitigates delivery latency during the high-velocity build.

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): PASS
- Prompt variant (if applicable): none
- Next experiment (smallest change to try): none
