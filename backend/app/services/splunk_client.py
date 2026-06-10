import urllib3
import requests
import time
from typing import Dict, Any, List
from urllib.parse import urlparse
from app import config

class SplunkClient:
    def __init__(self):
        self.host = config.SPLUNK_HOST
        self.username = config.SPLUNK_USERNAME
        self.password = config.SPLUNK_PASSWORD
        self.token = config.SPLUNK_TOKEN
        self.verify_ssl = config.SPLUNK_VERIFY_SSL
        self.mode = config.SPLUNK_MODE
        self.index = config.SPLUNK_INDEX
        self.search_timeout = config.SPLUNK_SEARCH_TIMEOUT_SECONDS
        self.poll_interval = config.SPLUNK_POLL_INTERVAL_SECONDS

        if not self.verify_ssl:
            urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

    def is_real_mode(self) -> bool:
        return self.mode == "real"

    def _get_auth_headers_and_auth(self) -> tuple[dict, Any]:
        headers = {}
        auth = None
        if self.token:
            headers["Authorization"] = f"Bearer {self.token}"
        elif self.username:
            auth = (self.username, self.password)
        return headers, auth

    def get_status(self) -> Dict[str, Any]:
        """
        Returns connection diagnostics.
        """
        try:
            parsed_url = urlparse(self.host)
            port = parsed_url.port if parsed_url.port else 8089
        except Exception:
            port = 8089

        configured = False
        if self.mode == "real":
            if self.token or (self.username and self.password):
                configured = True

        auth_method = "None"
        if self.token:
            auth_method = "Token"
        elif self.username:
            auth_method = "Basic"

        if self.mode == "mock":
            return {
                "connected": False,
                "host": self.host,
                "port": port,
                "indices": {
                    "auth_logs": 22,
                    "endpoint_logs": 4,
                    "firewall_logs": 3,
                    "web_logs": 5
                },
                "error": "Splunk Enterprise offline (Mock Mode active)",
                "mode": "mock",
                "configured": configured,
                "index": self.index,
                "auth_method": auth_method,
                "message": "Running in default Mock Mode (using CSV file logs)."
            }

        # Real Mode connection check
        headers, auth = self._get_auth_headers_and_auth()
        try:
            url = f"{self.host.rstrip('/')}/services/server/info"
            response = requests.get(
                url,
                params={"output_mode": "json"},
                headers=headers,
                auth=auth,
                verify=self.verify_ssl,
                timeout=5
            )
            
            if response.status_code == 200:
                indices_counts = self._query_indices_counts()
                return {
                    "connected": True,
                    "host": self.host,
                    "port": port,
                    "indices": indices_counts,
                    "error": None,
                    "mode": "real",
                    "configured": True,
                    "index": self.index,
                    "auth_method": auth_method,
                    "message": f"Successfully connected to Splunk Enterprise REST API at {self.host}."
                }
            else:
                return {
                    "connected": False,
                    "host": self.host,
                    "port": port,
                    "indices": {"auth_logs": 0, "endpoint_logs": 0, "firewall_logs": 0, "web_logs": 0},
                    "error": f"HTTP {response.status_code}: {response.text[:100]}",
                    "mode": "real",
                    "configured": configured,
                    "index": self.index,
                    "auth_method": auth_method,
                    "message": f"Authentication or API error response from Splunk (status={response.status_code})."
                }
        except requests.exceptions.ConnectionError as ce:
            return {
                "connected": False,
                "host": self.host,
                "port": port,
                "indices": {"auth_logs": 0, "endpoint_logs": 0, "firewall_logs": 0, "web_logs": 0},
                "error": f"Connection refused: {str(ce)}",
                "mode": "real",
                "configured": configured,
                "index": self.index,
                "auth_method": auth_method,
                "message": f"Could not connect to Splunk REST API at {self.host}. Connection refused."
            }
        except Exception as e:
            return {
                "connected": False,
                "host": self.host,
                "port": port,
                "indices": {"auth_logs": 0, "endpoint_logs": 0, "firewall_logs": 0, "web_logs": 0},
                "error": str(e),
                "mode": "real",
                "configured": configured,
                "index": self.index,
                "auth_method": auth_method,
                "message": f"Error verifying Splunk connection: {str(e)}"
            }

    def _query_indices_counts(self) -> Dict[str, int]:
        """
        Tries to run a lightweight search query to find event counts for our sourcetypes.
        If it fails, returns safe defaults.
        """
        counts = {"auth_logs": 0, "endpoint_logs": 0, "firewall_logs": 0, "web_logs": 0}
        query = f"index={self.index} | stats count by sourcetype"
        try:
            results = self.run_search(query)
            for row in results:
                st = row.get("sourcetype", "")
                cnt = int(row.get("count", 0))
                if st == "sentinelops:auth":
                    counts["auth_logs"] = cnt
                elif st == "sentinelops:endpoint":
                    counts["endpoint_logs"] = cnt
                elif st == "sentinelops:firewall":
                    counts["firewall_logs"] = cnt
                elif st == "sentinelops:web":
                    counts["web_logs"] = cnt
        except Exception:
            pass
        return counts

    def run_search(self, query: str, earliest_time: str | None = None, latest_time: str | None = None) -> List[Dict[str, Any]]:
        """
        Runs search job against Splunk REST API.
        """
        if self.mode == "mock":
            print(f"[Splunk REST Client Stub] Mock Mode search query bypassed: {query}")
            return []

        search_query = query.strip()
        if not search_query.lower().startswith("search"):
            search_query = f"search {search_query}"

        print(f"[Splunk REST Client] Dispatching search: {search_query}")
        headers, auth = self._get_auth_headers_and_auth()

        try:
            jobs_url = f"{self.host.rstrip('/')}/services/search/jobs"
            data = {
                "search": search_query,
                "exec_mode": "normal"
            }
            if earliest_time:
                data["earliest_time"] = earliest_time
            if latest_time:
                data["latest_time"] = latest_time

            response = requests.post(
                jobs_url,
                data=data,
                params={"output_mode": "json"},
                headers=headers,
                auth=auth,
                verify=self.verify_ssl,
                timeout=10
            )

            if response.status_code not in [200, 201]:
                print(f"[Splunk REST Client] Create job failed with status {response.status_code}: {response.text}")
                return []

            response_json = response.json()
            sid = response_json.get("sid")
            if not sid:
                print(f"[Splunk REST Client] No SID returned in response: {response_json}")
                return []

            job_url = f"{jobs_url}/{sid}"
            start_time = time.time()
            is_done = False
            
            while time.time() - start_time < self.search_timeout:
                poll_resp = requests.get(
                    job_url,
                    params={"output_mode": "json"},
                    headers=headers,
                    auth=auth,
                    verify=self.verify_ssl,
                    timeout=5
                )
                if poll_resp.status_code == 200:
                    poll_json = poll_resp.json()
                    entry = poll_json.get("entry", [])
                    if entry:
                        content = entry[0].get("content", {})
                        is_done = content.get("isDone", False)
                        dispatch_state = content.get("dispatchState", "")
                        if is_done or dispatch_state == "DONE":
                            is_done = True
                            break
                        elif dispatch_state in ["FAILED", "CANCELLED"]:
                            print(f"[Splunk REST Client] Job failed or cancelled with state: {dispatch_state}")
                            return []
                else:
                    print(f"[Splunk REST Client] Poll failed with status {poll_resp.status_code}")
                time.sleep(self.poll_interval)

            if not is_done:
                print(f"[Splunk REST Client] Job {sid} timed out after {self.search_timeout} seconds.")
                return []

            results_url = f"{job_url}/results"
            results_resp = requests.get(
                results_url,
                params={"output_mode": "json", "count": 100},
                headers=headers,
                auth=auth,
                verify=self.verify_ssl,
                timeout=10
            )

            if results_resp.status_code == 200:
                results_json = results_resp.json()
                results = results_json.get("results", [])
                print(f"[Splunk REST Client] Retrieved {len(results)} results for SID {sid}")
                return results
            else:
                print(f"[Splunk REST Client] Fetch results failed with status {results_resp.status_code}")
                return []

        except requests.exceptions.RequestException as e:
            print(f"[Splunk REST Client] Request error during search: {e}")
            return []
        except Exception as e:
            print(f"[Splunk REST Client] Unexpected error during search: {e}")
            return []
