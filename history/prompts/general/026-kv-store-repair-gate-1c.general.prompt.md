---
id: 026
title: KV Store Repair Gate 1C Plan
stage: general
date: 2026-06-13
surface: agent
model: Claude Sonnet 4.6 (Thinking)
feature: none
branch: main
user: shoaibharoon10
command: /sp.implement
labels: ["kv-store", "ssl-certificates", "repair-plan", "gate-1c"]
links:
  spec: spec.md
  ticket: null
  adr: null
  pr: null
files:
  - docs/bonus-access-check.md
tests:
  - none
---

## Prompt

Start Bonus Sprint Gate 1C: Verify safe Splunk KV Store certificate repair path before any certificate modification.

[see full prompt in user request — goals: verify command availability, build repair plan with Path A and Path B, no auto-execution]

## Response snapshot

Ran all safe inspection commands (splunk.exe help, btool, Get-ChildItem, version, cmd openssl, Get-Process mongod) from standard console — all returned Access is denied or no mongod process found. Confirmed via port scan that port 8191 has no listeners (mongod crashes before binding). Researched Splunk 10.x / MongoDB 7.0 upgrade notes to confirm root cause: default server.pem was generated for an older MongoDB version and lacks the Extended Key Usage (clientAuth+serverAuth) and Authority Key Identifier fields now required by MongoDB 7.0 strict TLS validation. Updated docs/bonus-access-check.md with the Gate 1C section: command availability table, root cause analysis, safe backup + rename procedure (Path A), REST fallback (Path B), rollback plan, and the commands that must never be run without approval.

## Outcome

- ✅ Impact: Documented the confirmed root cause (MongoDB 7.0 EKU/CA-chain strictness) and a safe, non-destructive repair plan. No code modified.
- 🧪 Tests: none
- 📁 Files: Modified docs/bonus-access-check.md.
- 🔁 Next prompts: User to attempt Path A from elevated Admin CMD, then report KV Store status. If successful, proceed to MCP token gen check. If not, fall back to Path B.
- 🧠 Reflection: The agent's standard shell cannot access Splunk CLI due to Windows elevation requirements — all repair steps must be performed manually by the user. This is a hard boundary that should be clearly documented.

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): PASS
- Prompt variant (if applicable): none
- Next experiment (smallest change to try): none
