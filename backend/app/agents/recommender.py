from typing import Dict, Any, List

class RecommenderAgent:
    def run(self, alert_id: str, parsed_context: Dict[str, Any], risk_score: int) -> List[Dict[str, Any]]:
        """
        Generates incident containment recommendations based on context indicators and severity.
        """
        src_ip = parsed_context.get("src_ip", "unknown")
        user = parsed_context.get("user", "unknown")
        
        recommendations = [
            {
                "id": "rec-001",
                "action": "Force password reset",
                "reason": f"Compromised credential rotation for user administrative login '{user}'",
                "impact": "Requires user to log out and rotate password, preventing further session hijack.",
                "requires_approval": True,
                "status": "pending"
            },
            {
                "id": "rec-002",
                "action": "Block suspicious IP",
                "reason": f"Active threat mitigation to drop connection packets from source address '{src_ip}'",
                "impact": "Interrupts lateral movement or exfiltration tunnels from that specific remote host.",
                "requires_approval": True,
                "status": "pending"
            },
            {
                "id": "rec-003",
                "action": "Temporarily disable account",
                "reason": f"Emergency isolation of user admin credentials",
                "impact": "Stops all credential validations until full security investigation completes.",
                "requires_approval": True,
                "status": "pending"
            },
            {
                "id": "rec-004",
                "action": "Review host activity",
                "reason": "Examine local process executions and command history",
                "impact": "Exposes secondary malware payloads or backdoors on the affected endpoints.",
                "requires_approval": False,
                "status": "pending"
            },
            {
                "id": "rec-005",
                "action": "Escalate to incident response",
                "reason": f"Triage level exceeded (severity Critical, risk score: {risk_score})",
                "impact": "Engages L2 analysts for deeper forensic audit and active threat hunting.",
                "requires_approval": False,
                "status": "pending"
            }
        ]
        
        return recommendations
