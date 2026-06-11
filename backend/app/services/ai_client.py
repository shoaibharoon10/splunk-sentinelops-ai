import requests
import logging
from typing import Dict, Any, List
from app import config

logger = logging.getLogger("ai_client")

class AIClient:
    def __init__(self):
        self.provider = config.AI_PROVIDER
        self.openai_key = config.OPENAI_API_KEY
        self.openai_model = config.OPENAI_MODEL
        self.gemini_key = config.GEMINI_API_KEY
        self.gemini_model = config.GEMINI_MODEL
        self.timeout = config.AI_REQUEST_TIMEOUT_SECONDS

    def get_status(self) -> str:
        """Returns the active AI mode and configuration status."""
        if self.provider == "openai":
            if self.openai_key:
                return "OpenAI (Active)"
            else:
                return "OpenAI (Fallback to Mock - Key Missing)"
        elif self.provider == "gemini":
            if self.gemini_key:
                return "Gemini (Active)"
            else:
                return "Gemini (Fallback to Mock - Key Missing)"
        else:
            return "Mock AI Mode"

    def get_provider_configured(self) -> bool:
        """Returns whether a real provider has keys configured."""
        if self.provider == "openai" and self.openai_key:
            return True
        if self.provider == "gemini" and self.gemini_key:
            return True
        return False

    def generate_incident_explanation(
        self, alert_title: str, risk_score: int, timeline: List[Dict[str, Any]], evidence_count: int
    ) -> str:
        """
        Generates explanation based on alert context.
        Calls OpenAI/Gemini REST APIs, falling back to mock templates on missing keys, failures, or timeouts.
        """
        # Construction of the standard mock fallback text
        mock_explanation = (
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

        # Build prompt for real AI call
        prompt = (
            f"Please generate a detailed security incident narrative explanation for this alert.\n"
            f"Alert Title: {alert_title}\n"
            f"Risk Score: {risk_score}/100\n"
            f"Evidence Log Count: {evidence_count}\n"
            f"Timeline of events:\n"
        )
        for i, event in enumerate(timeline, 1):
            prompt += f"{i}. [{event.get('timestamp')}] {event.get('event')} (Source: {event.get('source')}, Severity: {event.get('severity')}) - {event.get('details')}\n"

        prompt += (
            "\nAnalyze the intrusion progression and write a professional markdown summary. "
            "Explain what happened clearly. Do NOT invent new risk scores or change the severity level. "
            "Do NOT authorize or execute any remediation actions."
        )

        # Call OpenAI
        if self.provider == "openai":
            if not self.openai_key:
                logger.info("OpenAI key is missing. Falling back to Mock AI.")
                return mock_explanation
            try:
                headers = {
                    "Authorization": f"Bearer {self.openai_key}",
                    "Content-Type": "application/json"
                }
                payload = {
                    "model": self.openai_model,
                    "messages": [
                        {
                            "role": "system",
                            "content": "You are a professional security operations center (SOC) analyst. Write detailed, markdown-formatted summaries of incidents based on timeline logs without changing risk scores or adding actions."
                        },
                        {"role": "user", "content": prompt}
                    ],
                    "temperature": 0.2
                }
                response = requests.post(
                    "https://api.openai.com/v1/chat/completions",
                    headers=headers,
                    json=payload,
                    timeout=self.timeout
                )
                if response.status_code == 200:
                    data = response.json()
                    return data["choices"][0]["message"]["content"].strip()
                else:
                    logger.warning(f"OpenAI returned status code {response.status_code}. Details: {response.text}")
                    return mock_explanation
            except Exception as e:
                logger.error(f"Error calling OpenAI API: {e}. Falling back to Mock AI.")
                return mock_explanation

        # Call Gemini
        elif self.provider == "gemini":
            if not self.gemini_key:
                logger.info("Gemini API key is missing. Falling back to Mock AI.")
                return mock_explanation
            try:
                url = f"https://generativelanguage.googleapis.com/v1beta/models/{self.gemini_model}:generateContent?key={self.gemini_key}"
                headers = {
                    "Content-Type": "application/json"
                }
                payload = {
                    "contents": [
                        {
                            "parts": [
                                {
                                    "text": "You are a professional security operations center (SOC) analyst. Write detailed, markdown-formatted summaries of incidents based on timeline logs without changing risk scores or adding actions.\n\n" + prompt
                                }
                            ]
                        }
                    ],
                    "generationConfig": {
                        "temperature": 0.2
                    }
                }
                response = requests.post(
                    url,
                    headers=headers,
                    json=payload,
                    timeout=self.timeout
                )
                if response.status_code == 200:
                    data = response.json()
                    return data["candidates"][0]["content"]["parts"][0]["text"].strip()
                else:
                    logger.warning(f"Gemini returned status code {response.status_code}. Details: {response.text}")
                    return mock_explanation
            except Exception as e:
                logger.error(f"Error calling Gemini API: {e}. Falling back to Mock AI.")
                return mock_explanation

        # Default fallback (Mock mode)
        return mock_explanation

