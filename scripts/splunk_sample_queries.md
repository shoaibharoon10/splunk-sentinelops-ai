# Splunk Sample Queries - Threat Hunting Reference

This document provides sample Splunk Processing Language (SPL) queries to perform security correlation, brute-force analysis, privilege escalation detection, exfiltration validation, and web anomalies checks on the `sentinelops` index.

---

## 1. Verify All Indexed Data
Checks all raw events loaded into the index to verify ingestion completed successfully:
```spl
index=sentinelops
```

---

## 2. Authentication Logs Audit
Filters authentication attempts specifically for the target user `admin` to isolate initial access indicators:
```spl
index=sentinelops sourcetype="sentinelops:auth" user="admin"
```

---

## 3. Failed vs Successful Logins Correlation
Aggregates login success and failure events by source IP to detect brute-force activity and subsequent compromised credentials indicators:
```spl
index=sentinelops sourcetype="sentinelops:auth" user="admin"
| stats count by status, src_ip
```

---

## 4. Endpoint Process Auditing (Suspicious Activity)
Filters process logs for high-risk executions, such as PowerShell calls and user accounts creations:
```spl
index=sentinelops sourcetype="sentinelops:endpoint" user="admin"
| search process_name="powershell.exe" OR command_line="*net user*"
| table _time host user process_name command_line
```

---

## 5. Firewall Network Socket Exfiltration Validation
Detects large byte volume transfers (e.g. egress > 50MB) over outbound sockets to identify exfiltration:
```spl
index=sentinelops sourcetype="sentinelops:firewall"
| where bytes_out > 50000000
| table _time src_ip dest_ip dest_port bytes_out action host
```

---

## 6. Web Application Response Anomaly Diagnostics
Checks HTTP status codes and endpoint hit counts to locate spikes in server errors (HTTP 500) indicating vulnerability scans or database exfiltration:
```spl
index=sentinelops sourcetype="sentinelops:web"
| stats count by status_code endpoint
```
