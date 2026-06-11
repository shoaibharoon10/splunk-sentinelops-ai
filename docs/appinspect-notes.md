# Splunk Developer Tools & AppInspect Alignment Notes

This document provides developer notes regarding the included **Splunk SentinelOps AI** App configuration skeleton, alignment with Splunk developer tools, and validation guidelines before publishing to Splunkbase.

---

## 🛠️ Included Splunk App Skeleton
The project includes a lightweight, pre-configured Splunk App folder located at:
[splunk-app/SplunkSentinelOps/](file:///g:/DevHack/Splunk_SentinelOps_AI/splunk-app/SplunkSentinelOps/)

### Purpose:
- Package threat analysis hunting templates and standard query definitions.
- Map custom saved searches (authentication, process command lines, outbound socket traffic, web access volume logs) to **Model Context Protocol (MCP)** tools.
- Provide a blueprint for security teams to deploy the SentinelOps MCP interface in their Splunk instances.

---

## 📋 Hackathon Scope vs. Splunkbase Certification
- **Hackathon-Ready**: The configuration structures (`app.conf`, `savedsearches.conf`, `tools.conf`, and `tool_input_payload_signatures.json`) are developed to serve as a proof-of-concept for the "Best Use of Splunk MCP Server" bonus track.
- **Not Splunkbase-Certified**: The app skeleton has **not** been run through Splunk AppInspect or submitted to Splunkbase.
- **AppInspect Claims**: No claims are made regarding official AppInspect compliance or certification. It remains a developer-ready proof of concept.

---

## 🚀 Future Splunkbase Certification Checklist
Before this application can be packaged and distributed on Splunkbase, the following steps must be completed:

1. **Run Splunk AppInspect**:
   - Execute the CLI or API validation:
     ```bash
     splunk-appinspect inspect path/to/SplunkSentinelOps.tgz
     ```
   - Resolve any warnings regarding folder naming conventions, deprecated configuration stanzas, and permission overrides.
2. **Metadata & Manifest (app.manifest)**:
   - Construct a structured `app.manifest` declaration resolving dependencies, licensing parameters, and supported Splunk platform versions.
3. **Enterprise Security App Icons**:
   - Provide standard visual assets under `appserver/static/` (e.g., `appIcon.png`, `appIcon_2x.png`, `appLogo.png`).
4. **Permissions & Security Configuration**:
   - Audit `metadata/default.meta` file permissions to restrict read/write access based on standard Splunk enterprise roles (e.g., `admin`, `power`, `user`).
5. **Saved Search Refinements**:
   - Optimize SPL query parameters inside `savedsearches.conf` to avoid inefficient wildcards (`*`) that cause performance penalties on large indices.

---

## 💡 Why AppInspect Matters for Developer Tool Alignment
Splunk AppInspect is an automated tool provided by Splunk to evaluate apps against security, reliability, and packaging standards. Aligning with AppInspect criteria ensures:
- **Platform Performance**: Saved searches do not create resource exhaustion or infinite search loops on search heads.
- **Enterprise Safety**: Configuration files respect Splunk's security permission hierarchy and do not leak administrative privileges.
- **Integration Reliability**: The signature mappings in `tool_input_payload_signatures.json` comply with structured inputs required by Splunk's Model Context Protocol integrations.
