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
*   **MongoDB Logs**: `mongod.log` repeatedly shows:
    *   `InvalidSSLConfiguration`
    *   `Could not read private key attached to the selected certificate, ensure it exists and check the private key permissions.`
*   **Impact on Integrations**:
    *   The KV Store is backed by MongoDB and is the primary storage mechanism for Splunk apps to persist state, tokens, and settings.
    *   **CRITICAL BLOCKER**: If the KV Store is failed, generating or saving an API token in the Splunk MCP Server app will fail, blocking tool discovery. Similarly, the Splunk Machine Learning/AI Toolkit cannot save workspaces, experiments, or configuration settings.

---

## 2B. 🔐 KV Store Certificate Chain Diagnostic Findings
Recent certificate and security diagnostics provide a clearer picture of why the MongoDB process is failing to bind during start-up.

### 1. Diagnostics Commands and Outputs Checked
*   **KV Store status query**: `splunk.exe show kvstore-status` returns:
    *   `status: failed`
    *   `storageEngine: wiredTiger`
    *   `port: 8191`
*   **SSL Configuration Analysis (`btool sslConfig`)**:
    *   `serverCert = $SPLUNK_HOME\etc\auth\server.pem`
    *   `caCertFile = $SPLUNK_HOME\etc\auth\cacert.pem`
    *   `sslPassword` is set in `etc/system/local/server.conf`
*   **Private Key Readability Test**:
    *   Command: `splunk.exe cmd openssl rsa -in "D:\Program Files\Splunk\etc\auth\server.pem" -check -noout`
    *   Passphrase: `password` (Splunk's default system passphrase)
    *   Output: `RSA key ok`
*   **File Permissions Analysis**:
    *   The Splunkd service runs as Windows service account `NT SERVICE\Splunkd`.
    *   Permissions on `server.pem` show:
        *   `NT SERVICE\Splunkd:(I)(F)` (Inherited Full Control)
        *   `BUILTIN\Administrators:(I)(F)` (Inherited Full Control)
        *   `NT AUTHORITY\SYSTEM:(I)(F)` (Inherited Full Control)
*   **Certificate validation check**:
    *   `server.pem` contains a valid private key.
    *   The private key is encrypted and readable with the default password.
    *   Certificate purpose is valid: `SSL Client: Yes`, `SSL Server: Yes`.
    *   **Strict Verification Check Failure**:
        *   `Missing Authority Key Identifier`
        *   `invalid CA certificate`
        *   `server.pem verification failed`

### 2. Likely Root Cause Interpretation
Based on this evidence, **neither database corruption nor private-key file access/permissions are the root causes**. Instead, the failure is triggered by a **certificate-chain / CA validation error**. MongoDB's strict SSL/TLS handshake verification fails to build or validate the certificate trust chain because the Authority Key Identifier is missing, or because there is a mismatch with the CA file (`cacert.pem`).

### 3. Safe Fix Options (Non-Destructive)
*   **Option A (Recommended)**: Regenerate Splunk default certificates. Back up existing `.pem` files in `etc/auth/`, run Splunk-supported certificate clean/regenerate commands (or allow Splunk to auto-generate them on restart), and start Splunkd.
*   **Option B**: Validate and repair the CA chain. Ensure that `cacert.pem` contains the root CA that signed `server.pem` and is referenced correctly in `server.conf`.
*   **Option C**: Create a complete backup of the `etc/auth/` directory and `etc/system/local/server.conf` configuration file before carrying out any certificate adjustments.
*   **Option D (Fallback)**: If the KV Store repair is too complex or time-consuming, skip live MCP/Hosted Models integration and submit the current working REST API demo + MCP-ready configurations.

### 4. 🚫 Commands That Must NOT Be Run Without Explicit User Approval
*   **`splunk clean kvstore`**: Deletes all serialized KV Store states, which can destroy active lookups, token mappings, and AppKeyStore collections.
*   **Deleting the database folder**: Removing contents of `D:\Program Files\Splunk\var\lib\splunk\kvstore/` directly.

### 5. Current Integration Decisions
*   **Live MCP Server**: 🛑 **Blocked**. Do not attempt backend live client integrations until the KV Store starts successfully.
*   **Hosted Models**: 🛑 **Blocked**. Do not attempt backend Hosted Models provider code until the KV Store is healthy and cloud model endpoints are accessible.
*   **REST API Integration**: 🟢 **Active & Primary**. The existing REST API connection is healthy and verified, returning a Critical risk score on alert-001. All features remain fully operational.

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
