from typing import Dict, Any, List
from app import config
from app.services import mock_data
from app.services.splunk_client import SplunkClient

class EvidenceCollectorAgent:
    def __init__(self):
        self.splunk_client = SplunkClient()

    def run(self, context: Dict[str, Any], spl_queries: List[Dict[str, str]] = None) -> List[Dict[str, Any]]:
        """
        Gathers raw logs matching investigation criteria from mock_data or Splunk Enterprise.
        """
        # If in real mode and queries are provided, query real Splunk
        if config.SPLUNK_MODE == "real" and spl_queries:
            evidence = []
            status = self.splunk_client.get_status()
            
            # If not connected, report connection error cleanly
            if not status["connected"]:
                evidence.append({
                    "source": "sentinelops:splunk:offline",
                    "description": "Splunk connection error: Splunk Enterprise is currently offline or unreachable.",
                    "raw_log": f"Failed to connect to Splunk Enterprise REST API at {self.splunk_client.host}.\nError details: {status.get('error', 'Unknown Error')}\nFallback logs: Check that your Splunk instance is running and credentials in backend/.env are correct."
                })
                return evidence

            for q_item in spl_queries:
                description = q_item.get("description", "Search query execution")
                query_str = q_item.get("query")
                
                # Derive sourcetype / source classification
                query_lower = query_str.lower()
                desc_lower = description.lower()
                if "auth" in query_lower or "auth" in desc_lower:
                    source = "sentinelops:auth"
                elif "endpoint" in query_lower or "endpoint" in desc_lower:
                    source = "sentinelops:endpoint"
                elif "firewall" in query_lower or "firewall" in desc_lower:
                    source = "sentinelops:firewall"
                elif "web" in query_lower or "web" in desc_lower:
                    source = "sentinelops:web"
                else:
                    source = "sentinelops:search"

                try:
                    results = self.splunk_client.run_search(query_str)
                    if results:
                        formatted_rows = []
                        for row in results:
                            # Format row as time user=... src_ip=...
                            t_val = row.get("_time", row.get("time", ""))
                            row_parts = []
                            if t_val:
                                row_parts.append(str(t_val))
                            for k, v in row.items():
                                if k.startswith("_") and k != "_time":
                                    continue
                                if k in ["time", "_time"]:
                                    continue
                                row_parts.append(f"{k}={v}")
                            formatted_rows.append(" ".join(row_parts))
                        
                        raw_sample = "\n".join(formatted_rows[:10])
                        if len(formatted_rows) > 10:
                            raw_sample += f"\n... [{len(formatted_rows) - 10} more events]"

                        evidence.append({
                            "source": source,
                            "description": f"Splunk Query Audit ({description}): Successfully retrieved {len(results)} events from Splunk.",
                            "raw_log": raw_sample
                        })
                    else:
                        evidence.append({
                            "source": f"{source}:empty",
                            "description": f"Splunk Query Audit ({description}): No events matched search criteria in Splunk.",
                            "raw_log": f"SPL: {query_str}\nStatus: Query succeeded but returned 0 events."
                        })
                except Exception as e:
                    evidence.append({
                        "source": f"{source}:error",
                        "description": f"Splunk Query Audit ({description}): Error executing query against Splunk REST API.",
                        "raw_log": f"SPL: {query_str}\nError: {str(e)}"
                    })
            return evidence

        # Mock fallback (CSV dataset query logic)
        user = context.get("user")
        host = context.get("host")
        src_ip = context.get("src_ip")
        alert_id = context.get("alert_id")

        evidence = []

        # 1. Fetch Failed Auth Logs
        auth_logs = mock_data.query_auth_logs(user=user, src_ip=src_ip, host=host)
        if auth_logs:
            failed_logs = [log for log in auth_logs if log.get("status") == "failed"]
            if failed_logs:
                failed_count = len(failed_logs)
                raw_failed_sample = "\n".join(f"{log.get('_time')} user={log.get('user')} src={log.get('src_ip')} action={log.get('action')} status={log.get('status')}" for log in failed_logs[:5])
                if failed_count > 5:
                    raw_failed_sample += f"\n... [{failed_count - 5} more authentication events]"
                
                evidence.append({
                    "source": "sentinelops:auth:failed",
                    "description": f"Authentication Audit (Failed): Identified {failed_count} failed login attempts for user '{user}' from IP '{src_ip}' indicating active brute-force attempts.",
                    "raw_log": raw_failed_sample
                })

            # 2. Fetch Successful Auth Logs
            success_logs = [log for log in auth_logs if log.get("status") == "success"]
            if success_logs:
                raw_success_sample = "\n".join(f"{log.get('_time')} user={log.get('user')} src={log.get('src_ip')} action={log.get('action')} status={log.get('status')}" for log in success_logs)
                evidence.append({
                    "source": "sentinelops:auth:success",
                    "description": f"Authentication Audit (Success): Identified successful login for user '{user}' from suspicious IP '{src_ip}' immediately following brute-force attempts.",
                    "raw_log": raw_success_sample
                })

        # 2. Fetch Endpoint Logs
        endpoint_logs = mock_data.query_endpoint_logs(host=host, user=user)
        if endpoint_logs:
            cmd_lines = []
            for log in endpoint_logs:
                if log.get("severity") == "high" or "powershell" in log.get("process_name", "").lower():
                    cmd_lines.append(f"{log.get('_time')} cmd: {log.get('command_line')}")
            
            raw_log_sample = "\n".join(cmd_lines) if cmd_lines else "\n".join(f"{log.get('_time')} proc={log.get('process_name')} cmd={log.get('command_line')}" for log in endpoint_logs)
            evidence.append({
                "source": "sentinelops:endpoint",
                "description": f"Process Command Auditing: Detected high-severity PowerShell command executions and local credential creation actions on host '{host}'.",
                "raw_log": raw_log_sample
            })

        # 3. Fetch Firewall Logs
        firewall_logs = mock_data.query_firewall_logs(host=host)
        if firewall_logs:
            total_bytes_out = sum(int(log.get("bytes_out", 0)) for log in firewall_logs)
            total_mb = round(total_bytes_out / (1024 * 1024), 2)
            raw_log_sample = "\n".join(f"{log.get('_time')} src={log.get('src_ip')} dest={log.get('dest_ip')}:{log.get('dest_port')} bytes_sent={log.get('bytes_out')} action={log.get('action')}" for log in firewall_logs)
            
            evidence.append({
                "source": "sentinelops:firewall",
                "description": f"Network Socket Auditing: Detected excessive outbound network data egress totalizing {total_mb} MB to destination IPs over secure ports.",
                "raw_log": raw_log_sample
            })

        # 4. Fetch Web Logs (if web alert or alert-004)
        if alert_id == "alert-004" or "web" in context.get("title", "").lower():
            web_logs = mock_data.query_web_logs(src_ip=src_ip)
            if web_logs:
                err_500_count = sum(1 for log in web_logs if log.get("status_code") == "500")
                raw_log_sample = "\n".join(f"{log.get('_time')} src={log.get('src_ip')} path={log.get('endpoint')} status={log.get('status_code')} resp={log.get('response_time')}ms" for log in web_logs)
                
                evidence.append({
                    "source": "sentinelops:web",
                    "description": f"Web Application Diagnostics: Identified a spike of {err_500_count} HTTP 500 Server Errors targeting administration database endpoints.",
                    "raw_log": raw_log_sample
                })

        return evidence
