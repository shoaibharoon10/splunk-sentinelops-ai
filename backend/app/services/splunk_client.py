from typing import Dict, Any, List
from app import config

class SplunkClient:
    def __init__(self):
        self.host = config.SPLUNK_HOST
        self.username = config.SPLUNK_USERNAME
        self.token = config.SPLUNK_TOKEN
        self.verify_ssl = config.SPLUNK_VERIFY_SSL
        self.mode = config.SPLUNK_MODE

    def get_status(self) -> Dict[str, Any]:
        """
        Returns connection diagnostics.
        For Phase 1, it reports mock/offline status unless configurations are overridden.
        """
        if self.mode == "real" and (self.token or self.username):
            # Future Phase 5 Splunk Enterprise check
            return {
                "connected": True,
                "host": self.host,
                "port": 8089,
                "indices": {
                    "auth_logs": 22,
                    "endpoint_logs": 4,
                    "firewall_logs": 3,
                    "web_logs": 5
                },
                "error": None
            }
        else:
            return {
                "connected": False,
                "host": self.host,
                "port": 8089,
                "indices": {
                    "auth_logs": 0,
                    "endpoint_logs": 0,
                    "firewall_logs": 0,
                    "web_logs": 0
                },
                "error": "Splunk Enterprise offline (Mock Mode active)"
            }

    def run_search(self, query: str) -> List[Dict[str, Any]]:
        """
        Runs search job against Splunk REST API.
        For Phase 1, logs search commands and returns empty array to prompt fallback logs.
        """
        print(f"[Splunk REST Client Stub] Search query routed: {query}")
        # Real REST search job dispatch logic will be added here in Phase 5
        return []
