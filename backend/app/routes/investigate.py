from fastapi import APIRouter, HTTPException, Body
from typing import Dict, Any, List
from app.schemas import (
    InvestigationRequest,
    InvestigationResponse,
    SplunkStatus,
    ReportExportRequest,
    Recommendation
)
from app.services import mock_data
from app.services.splunk_client import SplunkClient
from app.services.ai_client import AIClient
from app.agents.alert_parser import AlertParserAgent
from app.agents.spl_query_planner import SPLQueryPlannerAgent
from app.agents.evidence_collector import EvidenceCollectorAgent
from app.agents.risk_scorer import RiskScorerAgent
from app.agents.timeline_builder import TimelineBuilderAgent
from app.agents.recommender import RecommenderAgent
from app.agents.report_writer import ReportWriterAgent

router = APIRouter(tags=["investigation"])

# In-memory session stores for recommendation status overrides
# Format: {alert_id: {recommendation_id: "approved" | "rejected" | "pending"}}
remediation_store: Dict[str, Dict[str, str]] = {}

# Initialize services and agents
splunk_client = SplunkClient()
ai_client = AIClient()

alert_parser = AlertParserAgent()
spl_planner = SPLQueryPlannerAgent()
evidence_collector = EvidenceCollectorAgent()
risk_scorer = RiskScorerAgent()
timeline_builder = TimelineBuilderAgent()
recommender = RecommenderAgent()
report_writer = ReportWriterAgent()

@router.post("/investigate", response_model=InvestigationResponse)
def investigate_alert(req: InvestigationRequest):
    """
    Executes the 7-agent investigation pipeline for a target alert.
    """
    # 1. Fetch Alert raw event
    alert = mock_data.get_alert_by_id(req.alert_id)
    if not alert:
        raise HTTPException(status_code=404, detail=f"Alert '{req.alert_id}' not found.")

    # 2. Run Parser Agent
    context = alert_parser.run(alert)

    # 3. Run SPL Planner Agent
    spl_queries = spl_planner.run(context)

    # 4. Run Evidence Collector Agent
    evidence = evidence_collector.run(context, spl_queries=spl_queries)

    # 5. Run Risk Scorer Agent
    scoring_result = risk_scorer.run(evidence, context)
    risk_score = scoring_result["risk_score"]
    risk_level = scoring_result["risk_level"]
    risk_factors = scoring_result["risk_factors"]

    # 6. Run Timeline Builder Agent
    timeline = timeline_builder.run(evidence)

    # 7. Run Recommender Agent
    recommendations = recommender.run(req.alert_id, context, risk_score)

    # Merge in-memory status overrides if analyst has already clicked approve/reject
    if req.alert_id in remediation_store:
        alert_overrides = remediation_store[req.alert_id]
        for rec in recommendations:
            rec_id = rec["id"]
            if rec_id in alert_overrides:
                rec["status"] = alert_overrides[rec_id]

    # 8. Run AI Client to generate narrative summary
    summary = ai_client.generate_incident_explanation(
        alert_title=alert["title"],
        risk_score=risk_score,
        timeline=timeline,
        evidence_count=len(evidence)
    )

    # 9. Run Report Writer Agent
    report_markdown = report_writer.run(
        alert_id=req.alert_id,
        title=alert["title"],
        summary=summary,
        generated_spl=spl_queries,
        evidence=evidence,
        timeline=timeline,
        risk_score=risk_score,
        risk_level=risk_level,
        risk_factors=risk_factors,
        recommendations=recommendations
    )

    # Compile dynamic status indicators
    splunk_connected_str = "Connected (REST API)" if splunk_client.get_status()["connected"] else "Offline (Mock Mode)"
    ai_status_str = ai_client.get_status()

    # Determine if human approval is required (if any pending recommendation requires approval)
    hitl_required = any(rec["requires_approval"] and rec["status"] == "pending" for rec in recommendations)

    return InvestigationResponse(
        alert_id=req.alert_id,
        title=alert["title"],
        summary=summary,
        generated_spl=spl_queries,
        evidence=evidence,
        timeline=timeline,
        risk_score=risk_score,
        risk_level=risk_level,
        risk_factors=risk_factors,
        recommendations=recommendations,
        human_approval_required=hitl_required,
        report_markdown=report_markdown,
        mode=splunk_client.mode,
        splunk_status=splunk_connected_str,
        ai_status=ai_status_str,
        ai_mode=ai_client.provider,
        ai_provider_configured=ai_client.get_provider_configured()
    )

@router.post("/export-report")
def export_report(req: ReportExportRequest):
    """
    Generates or returns the Markdown report for the target alert.
    """
    alert = mock_data.get_alert_by_id(req.alert_id)
    if not alert:
        raise HTTPException(status_code=404, detail=f"Alert '{req.alert_id}' not found.")

    if req.report_markdown:
        return {"report_markdown": req.report_markdown}

    # If markdown was not supplied, regenerate using mock pipeline
    context = alert_parser.run(alert)
    spl_queries = spl_planner.run(context)
    evidence = evidence_collector.run(context, spl_queries=spl_queries)
    scoring_result = risk_scorer.run(evidence, context)
    timeline = timeline_builder.run(evidence)
    recommendations = recommender.run(req.alert_id, context, scoring_result["risk_score"])
    
    # Merge overrides
    if req.alert_id in remediation_store:
        alert_overrides = remediation_store[req.alert_id]
        for rec in recommendations:
            if rec["id"] in alert_overrides:
                rec["status"] = alert_overrides[rec["id"]]

    summary = ai_client.generate_incident_explanation(
        alert_title=alert["title"],
        risk_score=scoring_result["risk_score"],
        timeline=timeline,
        evidence_count=len(evidence)
    )

    report_markdown = report_writer.run(
        alert_id=req.alert_id,
        title=alert["title"],
        summary=summary,
        generated_spl=spl_queries,
        evidence=evidence,
        timeline=timeline,
        risk_score=scoring_result["risk_score"],
        risk_level=scoring_result["risk_level"],
        risk_factors=scoring_result["risk_factors"],
        recommendations=recommendations
    )
    return {"report_markdown": report_markdown}

@router.get("/splunk/status", response_model=SplunkStatus)
def get_splunk_status():
    """
    Returns connection status details of the Splunk Enterprise REST interface.
    """
    status = splunk_client.get_status()
    return SplunkStatus(
        connected=status["connected"],
        host=status["host"],
        port=status["port"],
        indices=status["indices"],
        error=status["error"],
        mode=status.get("mode", "mock"),
        configured=status.get("configured", False),
        index=status.get("index", "sentinelops"),
        auth_method=status.get("auth_method", "None"),
        message=status.get("message", "")
    )

@router.post("/alerts/{alert_id}/actions/{recommendation_id}")
def approve_recommendation(alert_id: str, recommendation_id: str, payload: Dict[str, str] = Body(...)):
    """
    Simulates HITL approval/rejection. Modifies in-memory dictionary state.
    Expected payload: {"status": "approved" | "rejected"}
    """
    status = payload.get("status", "pending")
    if status not in ["approved", "rejected", "pending"]:
        raise HTTPException(status_code=400, detail="Invalid status action.")

    if alert_id not in remediation_store:
        remediation_store[alert_id] = {}

    remediation_store[alert_id][recommendation_id] = status
    return {"alert_id": alert_id, "recommendation_id": recommendation_id, "status": status}
