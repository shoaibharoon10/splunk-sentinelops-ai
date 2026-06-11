from typing import Dict, Any, List

class SPLQueryPlannerAgent:
    def run(self, context: Dict[str, Any]) -> List[Dict[str, str]]:
        """
        Formulates Splunk search queries (SPL) tailored to search for indicators of compromise (IoC)
        based on parsed alert parameters.
        """
        user = context.get("user")
        host = context.get("host")
        src_ip = context.get("src_ip")
        
        queries = [
            {
                "description": "Retrieve authentication attempts for target user and source IP",
                "query": f'index=sentinelops sourcetype="sentinelops:auth" user="{user}" src_ip="{src_ip}" | table _time, user, src_ip, action, status, extracted_host, host, country | sort _time'
            },
            {
                "description": "Inspect process execution command lines and execution hierarchies on target host",
                "query": f'index=sentinelops sourcetype="sentinelops:endpoint" (extracted_host="{host}" OR host="{host}") | table _time, extracted_host, host, user, process_name, command_line, parent_process, severity | sort _time'
            },
            {
                "description": "Correlate firewall socket egress events and outbound network byte volume",
                "query": f'index=sentinelops sourcetype="sentinelops:firewall" (extracted_host="{host}" OR host="{host}") | table _time, src_ip, dest_ip, dest_port, action, bytes_out, extracted_host, host | sort _time'
            }
        ]
        
        # Add web log query for web alerts
        if "web" in context.get("title", "").lower() or context.get("alert_id") == "alert-004":
            queries.append({
                "description": "Detect web server status code response anomalies and endpoint hits",
                "query": f'index=sentinelops sourcetype="sentinelops:web" src_ip="{src_ip}" | table _time, src_ip, endpoint, status_code, user_agent, response_time | sort _time'
            })
            
        return queries
