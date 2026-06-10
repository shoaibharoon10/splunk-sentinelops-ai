# Splunk SentinelOps - MCP-ready Splunk App Configs

This directory represents a **lightweight, MCP-ready Splunk App configuration skeleton** for the Splunk SentinelOps AI project. It exposes the same threat investigation logic used by the agentic pipeline as standard **Splunk Saved Searches** and **Splunk MCP Tools**.

---

## 1. Directory Structure

- `default/app.conf`: Defines Splunk app settings, labels, and updates properties.
- `default/savedsearches.conf`: Configures pre-defined incident correlation searches query parameters (Auth, Endpoint, Firewall, Web, Summary).
- `default/tools.conf`: Configures Splunk MCP tools mapping parameters to the underlying saved searches.
- `default/tool_input_payload_signatures.json`: Standard JSON schemas specifying input argument validation constraints.
- `metadata/default.meta`: Share configurations globally inside Splunk.

---

## 2. Exposing Capabilities via Splunk MCP Server

Using the configuration files in this app, an administrator running the **Splunk MCP Server** can expose threat-hunting capabilities as LLM-ready tools:

### Expose Saved Searches
The app defines the following five tools:
1. `sentinelops_auth_investigation`: Returns authentication successes/failures for a specific target user and source IP.
2. `sentinelops_endpoint_investigation`: Scans command line history for process hierarchy anomalies and execution flags.
3. `sentinelops_firewall_exfiltration`: Queries connection socket volumes to isolate exfiltration channels.
4. `sentinelops_web_anomaly`: Audits web hits to identify HTTP 500 error spikes and database scanner targets.
5. `sentinelops_full_investigation_summary`: Runs count aggregates per indexed sourcetype in `index=sentinelops`.

---

## 3. Deployment Instructions

1. Copy the `SplunkSentinelOps/` folder to your Splunk Enterprise installation directory under:
   - **Linux/macOS**: `$SPLUNK_HOME/etc/apps/`
   - **Windows**: `%SPLUNK_HOME%\etc\apps\`
2. Restart your Splunk Enterprise instance.
3. Once restarted, the app and its saved searches will be visible. If you run the Splunk MCP Server, it will automatically discover the tools defined in `tools.conf` and validate inputs matching `tool_input_payload_signatures.json`.

> [!NOTE]
> This folder serves as a hackathon-ready MCP tooling configuration blueprint for demonstration and integration purposes. It is not fully certified for Splunkbase, nor does it contain a local Splunk SDK Python agent runtime.
