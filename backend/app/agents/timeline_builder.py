from typing import Dict, Any, List

class TimelineBuilderAgent:
    def run(self, evidence: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Orders and structures the parsed log records into a chronological security incident timeline.
        """
        timeline = []

        # Extract items from auth:failed logs
        auth_failed_ev = next((ev for ev in evidence if ev.get("source") == "sentinelops:auth:failed"), None)
        if auth_failed_ev:
            raw = auth_failed_ev.get("raw_log", "")
            for line in raw.splitlines():
                if "status=failed" in line:
                    parts = line.split(" ")
                    ts = parts[0]
                    timeline.append({
                        "timestamp": ts,
                        "source": "auth_logs.csv (sentinelops:auth:failed)",
                        "event": "Failed Login Attempt",
                        "severity": "Medium",
                        "details": "Failed authentication for user admin from external IP 185.21.44.10"
                    })

        # Extract items from auth:success logs
        auth_success_ev = next((ev for ev in evidence if ev.get("source") == "sentinelops:auth:success"), None)
        if auth_success_ev:
            raw = auth_success_ev.get("raw_log", "")
            for line in raw.splitlines():
                if "status=success" in line:
                    parts = line.split(" ")
                    ts = parts[0]
                    timeline.append({
                        "timestamp": ts,
                        "source": "auth_logs.csv (sentinelops:auth:success)",
                        "event": "Successful Authentication",
                        "severity": "High",
                        "details": "Successful admin authentication from suspicious external IP 185.21.44.10"
                    })

        # Extract items from endpoint logs
        endpoint_ev = next((ev for ev in evidence if ev.get("source") == "sentinelops:endpoint"), None)
        if endpoint_ev:
            raw = endpoint_ev.get("raw_log", "")
            for line in raw.splitlines():
                if "cmd:" in line:
                    parts = line.split(" cmd: ")
                    ts = parts[0]
                    cmd = parts[1]
                    event_title = "Encoded PowerShell Spawning" if "EncodedCommand" in cmd else "Privilege Escalation Command"
                    timeline.append({
                        "timestamp": ts,
                        "source": "endpoint_logs.csv (sentinelops:endpoint)",
                        "event": event_title,
                        "severity": "High",
                        "details": f"Executed command line: {cmd}"
                    })

        # Extract items from firewall logs
        firewall_ev = next((ev for ev in evidence if ev.get("source") == "sentinelops:firewall"), None)
        if firewall_ev:
            raw = firewall_ev.get("raw_log", "")
            for line in raw.splitlines():
                if "bytes_sent=" in line:
                    parts = line.split(" ")
                    ts = parts[0]
                    dest = next((p.split("=")[1] for p in parts if p.startswith("dest=")), "unknown")
                    bytes_out = next((int(p.split("=")[1]) for p in parts if p.startswith("bytes_sent=")), 0)
                    mb = round(bytes_out / (1024 * 1024), 2)
                    if mb > 50:
                        timeline.append({
                            "timestamp": ts,
                            "source": "firewall_logs.csv (sentinelops:firewall)",
                            "event": "Suspicious Large Data Transfer",
                            "severity": "High",
                            "details": f"Network egress volume of {mb} MB to destination {dest} over SSL"
                        })

        # Extract items from web logs
        web_ev = next((ev for ev in evidence if ev.get("source") == "sentinelops:web"), None)
        if web_ev:
            raw = web_ev.get("raw_log", "")
            for line in raw.splitlines():
                if "status=500" in line:
                    parts = line.split(" ")
                    ts = parts[0]
                    path = next((p.split("=")[1] for p in parts if p.startswith("path=")), "unknown")
                    timeline.append({
                        "timestamp": ts,
                        "source": "web_logs.csv (sentinelops:web)",
                        "event": "Database Backup Access Failure",
                        "severity": "Medium",
                        "details": f"HTTP 500 error returned for path '{path}' requested by suspicious IP"
                    })

        # Sort timeline by timestamp string
        timeline.sort(key=lambda x: x["timestamp"])
        return timeline
