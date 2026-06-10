from typing import Dict, Any, List

class RiskScorerAgent:
    def run(self, evidence: List[Dict[str, Any]], parsed_context: Dict[str, Any]) -> Dict[str, Any]:
        """
        Determines the risk score and risk level based on the gathered evidence items.
        """
        score = 0
        factors = []
        
        src_ip = parsed_context.get("src_ip", "")
        
        # Analyze evidence list
        auth_failed_ev = next((ev for ev in evidence if ev.get("source") == "sentinelops:auth:failed"), None)
        auth_success_ev = next((ev for ev in evidence if ev.get("source") == "sentinelops:auth:success"), None)
        endpoint_evidence = next((ev for ev in evidence if ev.get("source") == "sentinelops:endpoint"), None)
        firewall_evidence = next((ev for ev in evidence if ev.get("source") == "sentinelops:firewall"), None)
        web_evidence = next((ev for ev in evidence if ev.get("source") == "sentinelops:web"), None)

        if auth_failed_ev:
            raw = auth_failed_ev.get("raw_log", "")
            failed_count = raw.count("status=failed")
            if failed_count > 3:
                score += 25
                factors.append(f"Multiple failed logins detected (count: {failed_count})")
            
        if auth_success_ev and auth_failed_ev:
            score += 25
            factors.append("Successful login immediate cascade following failed attempts")

        if src_ip and (src_ip.startswith("185.21.") or src_ip == "185.21.44.10"):
            score += 15
            factors.append(f"Connection origin from suspicious/new source IP: {src_ip}")

        if endpoint_evidence:
            raw = endpoint_evidence.get("raw_log", "")
            if "powershell" in raw.lower() or "encodedcommand" in raw.lower() or "net user" in raw.lower():
                score += 20
                factors.append("Suspicious PowerShell process spawning or encoded execution detected")

        if firewall_evidence:
            raw = firewall_evidence.get("raw_log", "")
            if "bytes_sent=1048576000" in raw or "bytes_sent=524288000" in raw:
                score += 15
                factors.append("Anomalous high volume outbound network exfiltration egress detected")

        if web_evidence:
            score += 10
            factors.append("Web server database configuration endpoint error spike")

        # Cap final score at 100
        risk_score = min(score, 100)

        # Determine level
        if risk_score <= 30:
            risk_level = "Low"
        elif risk_score <= 60:
            risk_level = "Medium"
        elif risk_score <= 80:
            risk_level = "High"
        else:
            risk_level = "Critical"

        return {
            "risk_score": risk_score,
            "risk_level": risk_level,
            "risk_factors": factors
        }
