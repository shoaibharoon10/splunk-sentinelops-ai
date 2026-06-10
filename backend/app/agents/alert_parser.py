from typing import Dict, Any

class AlertParserAgent:
    def run(self, alert: Dict[str, Any]) -> Dict[str, Any]:
        """
        Parses raw alert attributes and plans key investigation goals.
        """
        parsed_context = {
            "alert_id": alert.get("alert_id"),
            "title": alert.get("title"),
            "user": alert.get("user", "unknown"),
            "host": alert.get("host", "unknown"),
            "src_ip": alert.get("source_ip", "unknown"),
            "severity": alert.get("severity", "Medium"),
            "timestamp": alert.get("timestamp"),
            "goals": [
                f"Identify login attempt anomalies for user '{alert.get('user')}' from IP '{alert.get('source_ip')}'",
                f"Search for anomalous process executions on host '{alert.get('host')}'",
                f"Verify firewall socket traffic egress volumes from host '{alert.get('host')}'"
            ]
        }
        return parsed_context
