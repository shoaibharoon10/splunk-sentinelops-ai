from pydantic import BaseModel, Field
from typing import List, Optional

class Alert(BaseModel):
    alert_id: str
    title: str
    severity: str
    source: str
    user: str
    host: str
    source_ip: str
    timestamp: str
    status: str

class InvestigationRequest(BaseModel):
    alert_id: str
    use_mock_splunk: Optional[bool] = True
    use_mock_ai: Optional[bool] = True

class SPLQuery(BaseModel):
    description: str
    query: str

class EvidenceItem(BaseModel):
    source: str
    description: str
    raw_log: str

class TimelineEvent(BaseModel):
    timestamp: str
    source: str
    event: str
    severity: str
    details: str

class RiskFactor(BaseModel):
    factor: str
    score_contribution: int

class Recommendation(BaseModel):
    id: str
    action: str
    reason: str
    impact: str
    requires_approval: bool
    status: str  # pending | approved | rejected

class InvestigationResponse(BaseModel):
    alert_id: str
    title: str
    summary: str
    generated_spl: List[SPLQuery]
    evidence: List[EvidenceItem]
    timeline: List[TimelineEvent]
    risk_score: int
    risk_level: str
    risk_factors: List[str]
    recommendations: List[Recommendation]
    human_approval_required: bool
    report_markdown: str
    mode: str
    splunk_status: str
    ai_status: str

class SplunkStatus(BaseModel):
    connected: bool
    host: str
    port: int
    indices: dict
    error: Optional[str] = None
    mode: str
    configured: bool
    index: str
    auth_method: str
    message: str

class ReportExportRequest(BaseModel):
    alert_id: str
    report_markdown: Optional[str] = None
    format: Optional[str] = "markdown"

class HealthResponse(BaseModel):
    status: str
    service: str
    mode: str
    version: str
    splunk_connected: bool
    mcp_active: bool
    ai_provider: str
    timestamp: str
