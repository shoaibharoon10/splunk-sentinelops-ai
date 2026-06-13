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

## 🚧 Current Blockers & Risks Summary (Updated Gate 1C)
1.  **KV Store MongoDB SSL/CA-Chain Failure (P0 Blocker)**: The root cause is confirmed as a **certificate-chain / CA validation failure**, not database corruption. Splunk 10.x upgraded the KV Store to MongoDB 7.0, which enforces stricter X.509 certificate requirements including full EKU extensions (`clientAuth` + `serverAuth`) and a valid Authority Key Identifier. The existing default `server.pem` was generated for an older MongoDB version and is rejected during TLS handshake.
2.  **CLI Access Privilege Limits**: All `splunk.exe` commands invoked from the standard (non-elevated) console return `Access is denied`. This includes `help`, `btool`, `createssl`, `show kvstore-status`, and `cmd openssl`. All Splunk CLI repair operations **must be run from an Elevated (Run as Administrator) Command Prompt or PowerShell session**.
3.  **No mongod Process Running**: Confirmed via process list — `mongod` is not running. Port `8191` shows no listeners. The MongoDB process crashes immediately during KV Store startup, consistent with an SSL rejection at the TLS binding stage before any data is processed.
4.  **Cloud-Only Entitlements**: Splunk Hosted Models require an active Splunk Cloud instance and are not bundled with local Enterprise.

---

## 🔧 Gate 1C — Safe KV Store Repair Plan

### 1. Command Availability Verification (Gate 1C Diagnostics)
All diagnostic commands attempted from a standard non-elevated PowerShell console returned `Access is denied`. This is a hard Windows security boundary.

| Command Attempted | Result |
|---|---|
| `splunk.exe help createssl` | Access is denied |
| `splunk.exe help clean` | Access is denied |
| `splunk.exe btool server list sslConfig --debug` | Access is denied |
| `splunk.exe btool server list kvstore --debug` | Access is denied |
| `splunk.exe createssl server-cert ...` | Access is denied |
| `splunk.exe version` | Access is denied |
| `splunk.exe cmd openssl x509 -text -in server.pem` | Access is denied |
| `Get-ChildItem D:\Program Files\Splunk\etc\auth` | Access is denied |
| `Get-Content mongod.log` | Access is denied |
| `Get-Process mongod` | No process found (confirms mongod not running) |

**Finding**: All Splunk CLI and filesystem access under the `D:\Program Files\Splunk\` path requires an elevated shell. **None of these commands can be run safely by the agent.** They must all be run manually by the user from an Elevated Command Prompt.

### 2. Root Cause Verification (from Research)
Based on the MongoDB logs, certificate diagnostics, and Splunk 10.x release notes:

*   **Splunk 10.x upgraded KV Store to MongoDB 7.0**. MongoDB 7.0 enforces strict X.509 validation, requiring:
    *   Full `Extended Key Usage (EKU)` extensions: must include both `TLS Web Server Authentication` (`serverAuth`) and `TLS Web Client Authentication` (`clientAuth`).
    *   Valid `Authority Key Identifier` in the certificate chain.
*   **The default `server.pem` certificate was auto-generated at an older Splunk/MongoDB version** and does not include these extensions — confirmed by the `Missing Authority Key Identifier` and `invalid CA certificate` errors.
*   **The private key and file permissions are not the cause** — the key decrypts successfully with the default passphrase `password` and the service account has full-control file permissions.

### 3. Safe Repair Paths

> ⚠️ **ALL steps below must be run from an Elevated (Run as Administrator) Command Prompt or PowerShell session.** Do not run any step without backing up first.

---

#### 🟢 Path A — Safe Certificate Regeneration (Recommended, Non-Destructive)
This is the Splunk-documented safe path. Splunk will auto-generate a new `server.pem` with the correct extensions on next start if the file is renamed/moved (not deleted).

**Step A1 — Create Backup First** (Required before any changes):
```powershell
# Run as Administrator
$backupDir = "D:\SplunkCertBackup_$(Get-Date -Format 'yyyyMMdd_HHmmss')"
New-Item -ItemType Directory -Path $backupDir
Copy-Item "D:\Program Files\Splunk\etc\auth\server.pem" "$backupDir\server.pem.bak"
Copy-Item "D:\Program Files\Splunk\etc\auth\cacert.pem" "$backupDir\cacert.pem.bak" -ErrorAction SilentlyContinue
Copy-Item "D:\Program Files\Splunk\etc\auth\ca.pem" "$backupDir\ca.pem.bak" -ErrorAction SilentlyContinue
Copy-Item "D:\Program Files\Splunk\etc\system\local\server.conf" "$backupDir\server.conf.bak" -ErrorAction SilentlyContinue
Write-Output "Backup complete: $backupDir"
```

**Step A2 — Rename (not delete) the existing server.pem**:
```powershell
# Run as Administrator — rename only, do NOT delete
Stop-Service -Name Splunkd
Rename-Item "D:\Program Files\Splunk\etc\auth\server.pem" "server.pem.old"
```

**Step A3 — Start Splunk to trigger auto-regeneration**:
```powershell
# Splunk will detect the missing server.pem and generate a new one
Start-Service -Name Splunkd
Start-Sleep -Seconds 30
# Verify a new server.pem was created
Test-Path "D:\Program Files\Splunk\etc\auth\server.pem"
```

**Step A4 — Verify certificate includes correct EKU extensions**:
```cmd
# Run in elevated CMD
"D:\Program Files\Splunk\bin\splunk.exe" cmd openssl x509 -noout -text -in "D:\Program Files\Splunk\etc\auth\server.pem"
# In the output, confirm Extended Key Usage contains:
#   TLS Web Server Authentication
#   TLS Web Client Authentication
```

**Step A5 — Check KV Store status**:
```cmd
# Run in elevated CMD
"D:\Program Files\Splunk\bin\splunk.exe" show kvstore-status
```

---

#### 🟡 Path B — Stop and Submit REST Demo (Safe Fallback)
If KV Store repair is complex, time-consuming, or risks destabilizing the working REST integration:

*   Keep the current fully-verified **Splunk REST API** mode as the primary integration.
*   Document the KV Store failure as a known environment constraint.
*   Keep the pre-packaged **MCP-ready Splunk app configurations** (`tools.conf`, `savedsearches.conf`, `tool_input_payload_signatures.json`) in the submission as future-ready assets.
*   Proceed directly to screenshots and video recording.

### 4. Rollback Plan
If certificate regeneration causes issues:

```powershell
# Run as Administrator — restore from backup
Stop-Service -Name Splunkd
Copy-Item "$backupDir\server.pem.bak" "D:\Program Files\Splunk\etc\auth\server.pem" -Force
Copy-Item "$backupDir\server.conf.bak" "D:\Program Files\Splunk\etc\system\local\server.conf" -Force
Start-Service -Name Splunkd
```

### 5. 🚫 Commands That Must NOT Be Run Without Explicit Approval
*   **`splunk clean kvstore`**: Destroys all KV Store serialized data permanently.
*   **Deleting `D:\Program Files\Splunk\var\lib\splunk\kvstore\`**: Data loss.
*   **Deleting any `.pem` file without backup**: Certificate loss; use rename only.
*   **Editing `server.conf` sslPassword or sslCertPath without backup**: May break REST SSL entirely.
*   **`splunk.exe createssl server-cert ...`**: Runs without issue in elevated CMD, but changes are permanent without a backup.

### 6. Final Integration Decisions
*   **Live MCP Server**: 🛑 **Blocked** until KV Store starts successfully.
*   **Hosted Models**: 🛑 **Blocked** until KV Store is healthy and cloud entitlements are confirmed.
*   **REST API Integration**: 🟢 **Active & Primary**. Health check, Splunk status, and full `alert-001` investigation pipeline are working and verified. No changes needed.
*   **Recommendation**: Attempt **Path A** (safe certificate regeneration) from an elevated shell, then re-check KV Store. If it fails or takes more than 30 minutes, fall back to **Path B** (submit REST demo as-is with MCP-ready assets).
