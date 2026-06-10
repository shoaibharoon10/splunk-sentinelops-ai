# ADR-001: Splunk REST API First with MCP-ready Tooling Assets

- **Status:** Accepted
- **Date:** 2026-06-10
- **Feature:** splunk-rest-integration
- **Context:**
  We are building Splunk SentinelOps AI for the Splunk Agentic Ops Hackathon.
  The project is a Security-track, human-in-the-loop, agentic SOC investigation assistant. It already has:
  * Verified FastAPI backend mock mode
  * Verified Next.js frontend
  * Generated SPL query display
  * Mock evidence collection
  * Risk scoring
  * Human approval workflow
  * Markdown report export

  We are now moving toward real Splunk integration.
  Splunk Developer Day 2026 learnings indicate that:
  * Apps can expose functionality as Splunk MCP tools.
  * MCP tool definitions can be packaged using files such as `tools.conf` and `tool_input_payload_signatures.json`.
  * Saved searches or REST endpoints can be exposed through the Splunk MCP Server.
  * Splunk MCP Server provides platform-level benefits such as authentication, rate limiting, discovery, role-based access controls, monitoring, and admin dashboards.
  * AI agents can also live inside Splunk apps using Python SDK app capabilities, but that path has more runtime and packaging complexity.
  * AI Toolkit Agent Builder is promising but may not be generally available to all hackathon participants.

## Decision

For this hackathon timeline, implement Splunk integration in three layers:
1. Mock mode remains default and fully working.
2. Real Splunk REST API search job flow is implemented as the primary live integration path.
3. MCP-ready Splunk app/tool assets are added as a bonus-ready layer, including:
   * `splunk-app/SplunkSentinelOps/default/app.conf`
   * `splunk-app/SplunkSentinelOps/default/savedsearches.conf`
   * `splunk-app/SplunkSentinelOps/default/tools.conf`
   * `splunk-app/SplunkSentinelOps/default/tool_input_payload_signatures.json`
   * `splunk-app/SplunkSentinelOps/metadata/default.meta`
   * `splunk-app/SplunkSentinelOps/README.md`

### Rationale
* **REST API First**: Safest and fastest way to demonstrate real Splunk data integration in the limited hackathon timeline.
* **MCP-ready Assets**: Improves alignment with the Best Use of Splunk MCP Server bonus prize without making the whole demo dependent on MCP setup or private-preview access.
* **Mock Mode Integrity**: Keeps the app reliable for judges even if local Splunk, credentials, or MCP setup fails.

## Consequences

### Positive
* Working demo remains stable.
* Real Splunk integration is still possible.
* Project has stronger Splunk developer ecosystem alignment.
* MCP bonus story becomes credible.
* Saved searches make the SPL layer more reusable.

### Negative
* Full live MCP Server integration may remain optional.
* Splunk app package may be a documented/skeleton asset rather than a fully certified app.
* AppInspect verification is out of scope unless time remains.

## Alternatives Considered

### Alternative A: Mock Only Mode
* **Why Rejected**: Does not meet the hackathon goals of integrating real Splunk data.

### Alternative B: Complete Live MCP Server-only Integration
* **Why Rejected**: Too complex for the timeline, requires local MCP server runtime configurations, and risks breaking client demonstrations if the MCP agent runtime configuration fails.

### Alternative C: Agent Runtime Inside Splunk App SDK
* **Why Rejected**: Introducing Splunk Python SDK app packaging and custom endpoints has high runtime complexity and deployment friction.

## References

- Feature Spec: [spec.md](file:///g:/DevHack/Splunk_SentinelOps_AI/spec.md)
- Implementation Plan: [implementation_plan.md](file:///C:/Users/Shoaib%20Haroon/.gemini/antigravity-ide/brain/e9988761-99f4-4f62-a152-1ed51c523def/implementation_plan.md)
- Related ADRs: None
- Evaluator Evidence: [011-splunk-rest-integration-plan.plan.prompt.md](file:///g:/DevHack/Splunk_SentinelOps_AI/history/prompts/splunk-integration/011-splunk-rest-integration-plan.plan.prompt.md)
