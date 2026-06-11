---
id: 020
title: Create AI Gateway ADR
stage: general
date: 2026-06-11
surface: agent
model: gemini-3.5-flash
feature: none
branch: main
user: shoaibharoon10
command: /sp.adr
labels: ["adr", "ai-gateway", "architecture", "decisions"]
links:
  spec: spec.md
  ticket: null
  adr: docs/adr/002-optional-pluggable-ai-gateway.md
  pr: null
files:
  - docs/adr/002-optional-pluggable-ai-gateway.md
  - history/adr/002-optional-pluggable-ai-gateway.md
tests:
  - none
---

## Prompt

Create an ADR for the optional pluggable AI Gateway with safe fallback behavior.

# Context

Splunk SentinelOps AI currently has a working deterministic investigation pipeline:

* Alert parsing
* SPL planning
* Splunk evidence collection
* Risk scoring
* Timeline building
* Recommendations
* Report generation

The project is already verified in:

* Mock mode
* Real Splunk REST mode

We now plan to add an optional AI Gateway before final screenshots and demo recording.

# Decision

Add a pluggable AI Gateway with these modes:

* AI_MODE=mock by default
* AI_MODE=openai optional
* AI_MODE=gemini optional

# Key Safety Rules

* AI providers must be optional.
* Missing API keys must fall back to mock AI output.
* Provider failure must fall back to mock AI output.
* Timeout must fall back to mock AI output.
* AI must only improve summary/explanation/report text.
* AI must not change deterministic risk score.
* AI must not generate or execute destructive actions.
* AI must not approve human-in-the-loop recommendations.
* No API keys or secrets should be exposed in frontend/API responses.
* Mock mode must remain fully functional without internet or AI keys.

# Rationale

This improves the hackathon AI story while keeping the demo reliable and deterministic.

# Alternatives Considered

1. Keep mock AI only
2. Make OpenAI/Gemini required
3. Use Splunk Hosted Models
4. Add full agent runtime or private-preview Splunk Agent Builder

Explain why those alternatives are not selected for this hackathon phase.

# Consequences

Positive:

* Stronger AI story
* Safer fallback behavior
* Better demo resilience
* Easier future provider expansion

Tradeoffs:

* Slightly more backend complexity
* Requires careful docs to avoid overclaiming
* External provider calls may be unavailable, so fallback is mandatory

# Implementation Notes

Mention planned env vars:

AI_MODE=mock
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o-mini
GEMINI_API_KEY=
GEMINI_MODEL=gemini-1.5-flash
AI_REQUEST_TIMEOUT_SECONDS=20

# Required Output

Create ADR file under:

docs/adr/

Also copy it to history/adr/ if that pattern exists.

# Git

After ADR creation, run:

git status
git diff --stat

If planning files and ADR files are uncommitted, stage safe files only and commit:

git add plan.md tasks.md history/prompts/general/019-plan-final-winning-polish-sprint.general.prompt.md docs/adr/ history/adr/
git commit -m "docs: plan final winning polish sprint"

If the implementation_plan.md artifact is outside the repo, do not try to commit it.

Final working tree should be clean before implementation begins.

# Final Summary Required

Summarize:

1. ADR path
2. Decision recorded
3. Files committed
4. Commit hash/message
5. Final git status
6. Whether Phase 4A implementation can proceed

## Response snapshot

Created the new ADR-002: Optional Pluggable AI Gateway with Safe Fallbacks in both `docs/adr/` and `history/adr/` folders. It documents the pluggable modes, safety rules, rationale, alternatives considered, and consequences.

## Outcome

- ✅ ADR: Created ADR-002 under docs/adr/ and history/adr/.
- 📁 Files: Added docs/adr/002-optional-pluggable-ai-gateway.md and history/adr/002-optional-pluggable-ai-gateway.md.
