# Gate 1 Access Verification Report — Splunk MCP Server & Hosted Models

This report records the diagnostics, environment checks, and access verification findings for integrating the live Splunk MCP Server and Splunk Hosted Models, following the successful installation of the **10GB Splunk Developer License**.

---

## 1. 🎫 Splunk Developer License Status
*   **License Type**: Splunk Developer Personal License (DO NOT DISTRIBUTE)
*   **Capacity**: 10,240 MB / 10 GB
*   **Expiration Date**: Valid until December 07, 2026
*   **Status**: Active and valid
*   **Alerts/Violations**: None (0 licensing alerts, 0 licensing violations)
*   **Verification**: Tested and confirmed. Bypassing mock tables and executing real search jobs against a local Splunk Enterprise instance works end-to-end.
    *   `GET /splunk/status`: Successfully connected (`connected=true`, `mode="real"`, `index="sentinelops"`).
    *   `POST /investigate` with `alert-001`: Succeeded in **84.49s**, returning a deterministic `risk_score=100` (`Critical` level) with 4 evidence items and 16 timeline events.

---

## 2. 🗄️ Splunk KV Store Diagnostics
*   **Status**: **Failed / Unusable**
*   **Symptoms**: Splunk Web interface reports:
    *   *Failed to start KV Store process*
    *   *KV Store changed status to failed*
    *   *KV Store process terminated abnormally*
*   **Diagnostics Executed**:
    *   Attempted to run `D:\Program Files\Splunk\bin\splunk.exe show kvstore-status` and read `D:\Program Files\Splunk\var\log\splunk\mongod.log`.
    *   *Boundary Constraint*: The agent's shell execution does not run with OS-level elevated/administrator privileges, encountering an `Access is denied` block from Windows file system security.
*   **Impact on Integrations**:
    *   The KV Store is backed by MongoDB and is the primary storage mechanism for Splunk apps to persist state, tokens, and settings.
    *   **CRITICAL BLOCKER**: If the KV Store is failed, generating or saving an API token in the Splunk MCP Server app will fail, blocking tool discovery. Similarly, the Splunk Machine Learning/AI Toolkit cannot save workspaces, experiments, or configuration settings.

---

## 3. 🔌 Splunk MCP Server App Check
*   **App Status**: Installed & Enabled
    *   **Folder Name**: `Splunk_MCP_Server`
    *   **Version**: `1.2.0`
    *   **Origin**: Splunkbase
*   **Tool Discovery Capability**: Exposing the `SplunkSentinelOps` saved searches (`tools.conf`) is blocked because the MCP app cannot persist its authentication credentials or configure tools without a working KV Store collection database.
*   **Proceed/Stop Decision**: 🛑 **STOP**. Do not implement backend MCP client mode. Live tool discovery cannot be verified locally until the KV Store is resolved.

---

## 4. 🧠 Splunk Hosted Models Access Check
*   **Toolkit App Status**: Installed & Enabled (`Splunk_ML_Toolkit`, version `5.7.4`).
*   **Hosted Model Availability**: 
    *   Cisco Deep Time Series and Foundation AI Security Models are cloud-entitled SaaS offerings typically requiring an active Splunk Cloud tenancy and premium AI Assistant authorization credentials.
    *   Local Splunk Enterprise (even with the 10GB personal developer license) does not ship with these endpoints locally.
    *   Furthermore, local AI Toolkit workspace operations are blocked by the KV Store failure.
*   **Proceed/Stop Decision**: 🛑 **STOP**. Do not implement Splunk Hosted Models provider client code. Access is unavailable, and the local toolkit is blocked by the KV Store failure.

---

## 🚧 Current Blockers & Risks Summary
1.  **MongoDB Database Corruption / KV Store Down (P0 Blocker)**: MongoDB failed to start, terminating abnormally. This blocks all token generation for the MCP server and settings serialization in the AI Toolkit.
2.  **Access Privilege Limits**: Local diagnostic commands (`splunk.exe show kvstore-status`) and raw logs (`mongod.log`) require local OS administrative permissions that are blocked in standard user-space shell execution.
3.  **Cloud-Only Entitlements**: Splunk Hosted Models require an active Splunk Cloud instance and are not bundled with local Enterprise.

---

## 🛠️ Safest Recommended Next Steps (For the User)

Do **NOT** delete the Splunk database directory or clean the KV Store using destructive commands (`splunk clean kvstore`), as this will erase all lookup records and token collections. Instead, run these safe repair steps from an **Elevated Command Prompt (Run as Administrator)**:

1.  **Check Port Conflicts**:
    Verify if another service is binding to port `8191` (MongoDB default in Splunk):
    ```powershell
    Get-NetTCPConnection -LocalPort 8191 -ErrorAction SilentlyContinue
    ```
2.  **Remove Lock Files**:
    Stop the Splunk service, search for and delete any stale lock files leftover from an unclean shutdown:
    ```powershell
    Stop-Service -Name Splunkd
    Remove-Item "D:\Program Files\Splunk\var\lib\splunk\kvstore\mongo\mongod.lock" -Force -ErrorAction SilentlyContinue
    ```
3.  **Run MongoDB Repair**:
    Start the database in repair mode to fix index and journal corruptions:
    ```cmd
    cd "D:\Program Files\Splunk\bin"
    splunk.exe repair kvstore
    ```
4.  **Restart & Check Status**:
    Start Splunk and check KV Store status:
    ```powershell
    Start-Service -Name Splunkd
    splunk.exe show kvstore-status
    ```
