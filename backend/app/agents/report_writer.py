from typing import Dict, Any, List

class ReportWriterAgent:
    def run(
        self,
        alert_id: str,
        title: str,
        summary: str,
        generated_spl: List[Dict[str, str]],
        evidence: List[Dict[str, Any]],
        timeline: List[Dict[str, Any]],
        risk_score: int,
        risk_level: str,
        risk_factors: List[str],
        recommendations: List[Dict[str, Any]]
    ) -> str:
        """
        Synthesizes the entire multi-agent investigation into a clean markdown report.
        """
        spl_md = ""
        for i, item in enumerate(generated_spl, 1):
            spl_md += f"**Query {i}: {item.get('description')}**\n```spl\n{item.get('query')}\n```\n\n"

        evidence_md = ""
        for item in evidence:
            evidence_md += f"### Source: `{item.get('source')}`\n"
            evidence_md += f"**Description**: {item.get('description')}\n"
            evidence_md += f"```text\n{item.get('raw_log')}\n```\n\n"

        timeline_md = "| Timestamp | Event | Source | Severity | Details |\n|---|---|---|---|---|\n"
        for event in timeline:
            timeline_md += f"| {event.get('timestamp')} | {event.get('event')} | {event.get('source')} | {event.get('severity')} | {event.get('details')} |\n"

        factors_md = ""
        for f in risk_factors:
            factors_md += f"- {f}\n"

        rec_md = "| Action | Reason | Impact | HITL Approval |\n|---|---|---|---|\n"
        for rec in recommendations:
            hitl = "Yes (Required)" if rec.get("requires_approval") else "No (Auto)"
            rec_md += f"| {rec.get('action')} | {rec.get('reason')} | {rec.get('impact')} | {hitl} - Status: `{rec.get('status')}` |\n"

        report = f"""# Incident Investigation Report: {title}
**Incident ID**: `{alert_id}` | **Risk Score**: `{risk_score} ({risk_level})`
**Status**: Investigated by Splunk SentinelOps AI Agents

---

## 1. Executive Summary
{summary}

---

## 2. Deterministic Risk Factors Evaluated
{factors_md}

---

## 3. Dynamic Attack Timeline
{timeline_md}

---

## 4. Splunk Search Processing Language (SPL) Queries Run
{spl_md}

---

## 5. Raw Evidence Collected from Splunk Indices
{evidence_md}

---

## 6. Containment Recommendations & Approval Records
{rec_md}

---

> [!IMPORTANT]
> **Safety Note**: All high-impact actions marked with "Yes (Required)" under HITL Approval require explicit confirmation from a certified SOC Analyst via the SentinelOps dashboard. No destructive operations are automatically executed.
"""
        return report
