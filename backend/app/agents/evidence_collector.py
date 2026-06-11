from typing import Dict, Any, List
from app import config
from app.services import mock_data
from app.services.splunk_client import SplunkClient

class EvidenceCollectorAgent:
    def __init__(self):
        self.splunk_client = SplunkClient()

def format_real_splunk_row(source: str, row: Dict[str, Any], context: Dict[str, Any]) -> str:
    # Common fields
    t_val = row.get("_time") or row.get("time") or ""
    # Normalize host
    normalized_host = row.get("extracted_host") or row.get("host") or row.get("orig_host") or context.get("host") or ""

    if source.startswith("sentinelops:auth"):
        user = row.get("user") or ""
        src_ip = row.get("src_ip") or row.get("src") or ""
        action = row.get("action") or ""
        status = row.get("status") or ""
        country = row.get("country") or ""
        return f"{t_val} user={user} src={src_ip} action={action} status={status} host={normalized_host} country={country}"

    elif source == "sentinelops:endpoint":
        command_line = row.get("command_line") or ""
        process_name = row.get("process_name") or ""
        severity = row.get("severity") or ""
        parent_process = row.get("parent_process") or ""
        user = row.get("user") or ""
        # Format as cmd: command_line for high severity or powershell cmd
        if severity.lower() == "high" or "powershell" in process_name.lower():
            return f"{t_val} cmd: {command_line}"
        else:
            return f"{t_val} proc={process_name} cmd={command_line} host={normalized_host} user={user} parent_process={parent_process} severity={severity}"

    elif source == "sentinelops:firewall":
        src_ip = row.get("src_ip") or ""
        dest_ip = row.get("dest_ip") or ""
        dest_port = row.get("dest_port") or ""
        bytes_out = row.get("bytes_out") or row.get("bytes_sent") or "0"
        action = row.get("action") or ""
        return f"{t_val} src={src_ip} dest={dest_ip}:{dest_port} bytes_sent={bytes_out} action={action} host={normalized_host}"

    elif source == "sentinelops:web":
        src_ip = row.get("src_ip") or ""
        endpoint = row.get("endpoint") or row.get("path") or ""
        status_code = row.get("status_code") or row.get("status") or ""
        response_time = row.get("response_time") or row.get("resp") or "0"
        user_agent = row.get("user_agent") or ""
        return f"{t_val} src={src_ip} path={endpoint} status={status_code} resp={response_time}ms user_agent={user_agent}"

    else:
        # Fallback to key-value pairs
        row_parts = []
        if t_val:
            row_parts.append(str(t_val))
        for k, v in row.items():
            if k.startswith("_") and k != "_time":
                continue
            if k in ["time", "_time"]:
                continue
            row_parts.append(f"{k}={v}")
        return " ".join(row_parts)

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
                    source_type = "auth"
                elif "endpoint" in query_lower or "endpoint" in desc_lower:
                    source_type = "endpoint"
                elif "firewall" in query_lower or "firewall" in desc_lower:
                    source_type = "firewall"
                elif "web" in query_lower or "web" in desc_lower:
                    source_type = "web"
                else:
                    source_type = "search"

                try:
                    results = self.splunk_client.run_search(query_str)
                    if results:
                        if source_type == "auth":
                            failed_results = [r for r in results if r.get("status") == "failed"]
                            success_results = [r for r in results if r.get("status") == "success"]
                            
                            if failed_results:
                                formatted_rows = [format_real_splunk_row("sentinelops:auth:failed", row, context) for row in failed_results]
                                raw_sample = "\n".join(formatted_rows[:10])
                                if len(formatted_rows) > 10:
                                    raw_sample += f"\n... [{len(formatted_rows) - 10} more authentication events]"
                                
                                user_val = context.get("user", "")
                                src_val = context.get("src_ip", "")
                                evidence.append({
                                    "source": "sentinelops:auth:failed",
                                    "description": f"Authentication Audit (Failed): Identified {len(failed_results)} failed login attempts for user '{user_val}' from IP '{src_val}' indicating active brute-force attempts.",
                                    "raw_log": raw_sample
                                })
                                
                            if success_results:
                                formatted_rows = [format_real_splunk_row("sentinelops:auth:success", row, context) for row in success_results]
                                raw_sample = "\n".join(formatted_rows[:10])
                                if len(formatted_rows) > 10:
                                    raw_sample += f"\n... [{len(formatted_rows) - 10} more authentication events]"
                                
                                user_val = context.get("user", "")
                                src_val = context.get("src_ip", "")
                                evidence.append({
                                    "source": "sentinelops:auth:success",
                                    "description": f"Authentication Audit (Success): Identified successful login for user '{user_val}' from suspicious IP '{src_val}' immediately following brute-force attempts.",
                                    "raw_log": raw_sample
                                })
                            
                            if not failed_results and not success_results:
                                formatted_rows = [format_real_splunk_row("sentinelops:auth", row, context) for row in results]
                                raw_sample = "\n".join(formatted_rows[:10])
                                evidence.append({
                                    "source": "sentinelops:auth",
                                    "description": f"Authentication Audit: Retrieved {len(results)} auth events from Splunk.",
                                    "raw_log": raw_sample
                                })
                                
                        elif source_type == "endpoint":
                            normalized_hosts = [row.get("extracted_host") or row.get("host") or row.get("orig_host") for row in results if row.get("extracted_host") or row.get("host") or row.get("orig_host")]
                            normalized_host = normalized_hosts[0] if normalized_hosts else context.get("host", "")
                            
                            formatted_rows = [format_real_splunk_row("sentinelops:endpoint", row, context) for row in results]
                            raw_sample = "\n".join(formatted_rows[:10])
                            if len(formatted_rows) > 10:
                                raw_sample += f"\n... [{len(formatted_rows) - 10} more events]"
                                
                            evidence.append({
                                "source": "sentinelops:endpoint",
                                "description": f"Process Command Auditing: Detected high-severity PowerShell command executions and local credential creation actions on host '{normalized_host}'.",
                                "raw_log": raw_sample
                            })
                            
                        elif source_type == "firewall":
                            normalized_hosts = [row.get("extracted_host") or row.get("host") or row.get("orig_host") for row in results if row.get("extracted_host") or row.get("host") or row.get("orig_host")]
                            normalized_host = normalized_hosts[0] if normalized_hosts else context.get("host", "")
                            
                            formatted_rows = [format_real_splunk_row("sentinelops:firewall", row, context) for row in results]
                            raw_sample = "\n".join(formatted_rows[:10])
                            if len(formatted_rows) > 10:
                                raw_sample += f"\n... [{len(formatted_rows) - 10} more events]"
                                
                            total_bytes = 0
                            for row in results:
                                try:
                                    total_bytes += int(row.get("bytes_out") or row.get("bytes_sent") or 0)
                                except ValueError:
                                    pass
                            total_mb = round(total_bytes / (1024 * 1024), 2)
                            
                            evidence.append({
                                "source": "sentinelops:firewall",
                                "description": f"Network Socket Auditing: Detected excessive outbound network data egress totalizing {total_mb} MB to destination IPs over secure ports on host '{normalized_host}'.",
                                "raw_log": raw_sample
                            })
                            
                        elif source_type == "web":
                            formatted_rows = [format_real_splunk_row("sentinelops:web", row, context) for row in results]
                            raw_sample = "\n".join(formatted_rows[:10])
                            if len(formatted_rows) > 10:
                                raw_sample += f"\n... [{len(formatted_rows) - 10} more events]"
                                
                            err_500_count = sum(1 for row in results if str(row.get("status_code") or row.get("status")) == "500")
                            
                            evidence.append({
                                "source": "sentinelops:web",
                                "description": f"Web Application Diagnostics: Identified a spike of {err_500_count} HTTP 500 Server Errors targeting administration database endpoints.",
                                "raw_log": raw_sample
                            })
                            
                        else:
                            formatted_rows = [format_real_splunk_row("sentinelops:search", row, context) for row in results]
                            raw_sample = "\n".join(formatted_rows[:10])
                            evidence.append({
                                "source": "sentinelops:search",
                                "description": f"Splunk Query Audit ({description}): Successfully retrieved {len(results)} events from Splunk.",
                                "raw_log": raw_sample
                            })
                    else:
                        if source_type == "auth":
                            evidence.append({
                                "source": "sentinelops:auth:empty",
                                "description": f"Splunk Query Audit ({description}): No events matched search criteria in Splunk.",
                                "raw_log": f"SPL: {query_str}\nStatus: Query succeeded but returned 0 events."
                            })
                        elif source_type == "endpoint":
                            evidence.append({
                                "source": "sentinelops:endpoint:empty",
                                "description": f"Splunk Query Audit ({description}): No events matched search criteria in Splunk.",
                                "raw_log": f"SPL: {query_str}\nStatus: Query succeeded but returned 0 events."
                            })
                        elif source_type == "firewall":
                            evidence.append({
                                "source": "sentinelops:firewall:empty",
                                "description": f"Splunk Query Audit ({description}): No events matched search criteria in Splunk.",
                                "raw_log": f"SPL: {query_str}\nStatus: Query succeeded but returned 0 events."
                            })
                        elif source_type == "web":
                            evidence.append({
                                "source": "sentinelops:web:empty",
                                "description": f"Splunk Query Audit ({description}): No events matched search criteria in Splunk.",
                                "raw_log": f"SPL: {query_str}\nStatus: Query succeeded but returned 0 events."
                            })
                        else:
                            evidence.append({
                                "source": "sentinelops:search:empty",
                                "description": f"Splunk Query Audit ({description}): No events matched search criteria in Splunk.",
                                "raw_log": f"SPL: {query_str}\nStatus: Query succeeded but returned 0 events."
                            })
                except Exception as e:
                    evidence.append({
                        "source": f"sentinelops:{source_type}:error",
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
