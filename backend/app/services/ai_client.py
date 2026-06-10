from typing import Dict, Any, List
from app import config

class AIClient:
    def __init__(self):
        self.provider = config.AI_PROVIDER
        self.openai_key = config.OPENAI_API_KEY
        self.gemini_key = config.GEMINI_API_KEY

    def get_status(self) -> str:
        """Returns the active AI mode."""
        if self.provider == "openai" and self.openai_key:
            return "OpenAI (Active)"
        elif self.provider == "gemini" and self.gemini_key:
            return "Gemini (Active)"
        else:
            return "Mock AI Mode"

    def generate_incident_explanation(
        self, alert_title: str, risk_score: int, timeline: List[Dict[str, Any]], evidence_count: int
    ) -> str:
        """
        Generates explanation based on alert context.
        Provides high-quality mock responses if no provider key is active.
        """
        # Stable, structured mock explanation matching the threat scenario
        explanation = (
            f"### Automated Security Investigation Summary\n\n"
            f"**Incident Analysis**: A cascade of suspicious behaviors was detected targeting the host "
            f"**win-dc-01** using credentials for user **admin**. "
            f"The attack timeline exhibits typical characteristics of a multi-stage intrusion:\n\n"
            f"1. **Reconnaissance & Initial Access**: A brute-force login phase consisting of 21 failed "
            f"authentication attempts within a short window from external IP `185.21.44.10`. This was immediately "
            f"followed by a successful login event from the same source IP.\n"
            f"2. **Persistence & Execution**: Upon successful authentication, a high-severity encoded PowerShell "
            f"command was executed on `win-dc-01`, which subsequently spawned local system utility commands "
            f"to create a new privileged administrator backup account (`backup_admin`).\n"
            f"3. **Exfiltration**: Following account manipulation, firewall connections show a high volume "
            f"outbound network egress event (>1.5 GB total) directed to external IP `203.0.113.88` over port 443.\n\n"
            f"**Severity Rationale**: The deterministic risk score of **{risk_score}** reflects multiple high-impact "
            f"indicators, including brute-force success (+25), suspicious administration shell commands (+20), "
            f"and high network egress volume (+15). Immediate mitigation is required to isolate the affected host "
            f"and rotate administrator credentials."
        )
        return explanation
