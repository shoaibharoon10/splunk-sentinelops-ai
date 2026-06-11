# ADR-002: Optional Pluggable AI Gateway with Safe Fallbacks

- **Status:** Accepted
- **Date:** 2026-06-11
- **Feature:** ai-gateway
- **Context:** The core Splunk SentinelOps AI project includes a working, fully deterministic security analysis pipeline (alert parsing, SPL planning, Splunk evidence collection, risk scoring, timeline construction, recommendation generation, and markdown reporting). While mock and real Splunk REST modes are verified, we plan to add support for real AI models (OpenAI/Gemini) to enhance the pitch and summary quality. However, this must be done safely without risking the stability of the working demo.

## Decision

We will implement a pluggable, optional AI Gateway with the following behavior:

1. **Supported Modes**: The backend will support `AI_MODE=mock` (default), `AI_MODE=openai`, and `AI_MODE=gemini`.
2. **Robust Fallbacks**:
   - If an API key is missing from `.env`, the provider returns an error, or the request times out (max 20 seconds), the gateway will fall back to predefined mock templates.
   - The application must start and run in mock mode out-of-the-box without requiring internet or AI keys.
3. **Safety and Determinism Guardrails**:
   - AI outputs will *only* be used to enhance explanation, recommendation details, and executive summary reports.
   - AI models are strictly prohibited from changing the deterministic risk score (capped at 100).
   - AI models cannot create, approve, or execute response actions; human-in-the-loop (HITL) mock actions must remain purely simulated on the backend.
4. **Secret Protection**: No API keys, credentials, or backend secrets will be exposed to the frontend or included in API JSON responses.

## Consequences

### Positive

- **Enhanced Pitch**: Leverages real LLMs to write rich, contextual analysis and summaries.
- **Zero-Dependency Onboarding**: Developers can clone, start, and run the project immediately in mock mode.
- **Demo Resiliency**: Unstable internet, rate limits, or bad keys will not crash the demo; the app falls back to mock reports gracefully.
- **Extensible Architecture**: Easy to introduce local models or additional cloud LLMs in the future.

### Negative

- **Backend Overhead**: Adds conditional logic and external library dependencies (e.g., `openai`, `google-generativeai`) to the FastAPI server.
- **Documentation Overhead**: Requires clear user guides outlining how to configure credentials without overclaiming that they are mandatory.
- **Timeout Latency**: A slow LLM call may introduce up to a 20-second delay before the fallback occurs, though timeouts are strictly managed.

## Alternatives Considered

1. **Keep Mock AI Only**:
   - *Rejected*: Misses the opportunity to showcase actual AI integrations for the hackathon's "Security Track" and "AI Agent" story.
2. **Make OpenAI/Gemini Required**:
   - *Rejected*: Breaks zero-config local execution and offline validation, violating the core submission rules.
3. **Use Splunk Hosted Models**:
   - *Rejected*: High complexity, strict access permissions, and limited documentation make it unsafe for the short hackathon timeline.
4. **Add Full Agent Runtime (or Private-Preview Splunk Agent Builder)**:
   - *Rejected*: Risk of breaking the working demo is extremely high. Non-deterministic agent behavior and undocumented private preview SDKs would compromise the stable REST and mock modes.

## References

- Feature Spec: [spec.md](file:///g:/DevHack/Splunk_SentinelOps_AI/spec.md)
- Implementation Plan: [plan.md](file:///g:/DevHack/Splunk_SentinelOps_AI/plan.md)
- Related ADRs: [001-splunk-rest-first-mcp-ready-assets.md](file:///g:/DevHack/Splunk_SentinelOps_AI/docs/adr/001-splunk-rest-first-mcp-ready-assets.md)
- Evaluator Evidence: [019-plan-final-winning-polish-sprint.general.prompt.md](file:///g:/DevHack/Splunk_SentinelOps_AI/history/prompts/general/019-plan-final-winning-polish-sprint.general.prompt.md)
