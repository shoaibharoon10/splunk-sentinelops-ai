import os
os.environ["SPLUNK_MODE"] = "mock"
os.environ["APP_MODE"] = "mock"
os.environ["AI_MODE"] = "mock"

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["service"] == "Splunk SentinelOps AI Backend"
    assert data["mode"] == "mock"
    assert data["splunk_connected"] is False
    assert "ai_mode" in data
    assert "ai_provider_configured" in data
    assert data["ai_mode"] == "mock"
    assert data["ai_provider_configured"] is False

def test_list_alerts():
    response = client.get("/alerts")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 4
    assert any(alert["alert_id"] == "alert-001" for alert in data)

def test_get_alert():
    response = client.get("/alerts/alert-001")
    assert response.status_code == 200
    data = response.json()
    assert data["alert_id"] == "alert-001"
    assert data["severity"] == "Critical"

def test_get_alert_not_found():
    response = client.get("/alerts/alert-999")
    assert response.status_code == 404
    assert "not found" in response.json()["detail"]

def test_investigate():
    response = client.post("/investigate", json={"alert_id": "alert-001"})
    assert response.status_code == 200
    data = response.json()
    assert data["alert_id"] == "alert-001"
    assert data["risk_level"] == "Critical"
    assert data["risk_score"] == 100
    assert len(data["generated_spl"]) >= 3
    assert len(data["evidence"]) >= 4
    assert len(data["timeline"]) >= 4
    assert data["human_approval_required"] is True
    assert "Incident Investigation Report" in data["report_markdown"]
    assert "ai_mode" in data
    assert "ai_provider_configured" in data
    assert data["ai_mode"] == "mock"
    assert data["ai_provider_configured"] is False

def test_export_report():
    response = client.post("/export-report", json={"alert_id": "alert-001"})
    assert response.status_code == 200
    data = response.json()
    assert "report_markdown" in data
    assert "Incident Investigation Report" in data["report_markdown"]

def test_splunk_status():
    response = client.get("/splunk/status")
    assert response.status_code == 200
    data = response.json()
    assert data["connected"] is False
    assert "offline" in data["error"].lower()

def test_approve_recommendation():
    response = client.post("/alerts/alert-001/actions/rec-001", json={"status": "approved"})
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "approved"
    
    # Re-run investigation and assert status override is merged
    response_inv = client.post("/investigate", json={"alert_id": "alert-001"})
    data_inv = response_inv.json()
    rec = next(r for r in data_inv["recommendations"] if r["id"] == "rec-001")
    assert rec["status"] == "approved"

def test_splunk_field_mapping_and_normalization():
    # 1. Verify SPL query planner generated queries contain extracted_host
    from app.agents.spl_query_planner import SPLQueryPlannerAgent
    planner = SPLQueryPlannerAgent()
    context = {"host": "win-dc-01", "user": "admin", "src_ip": "185.21.44.10", "alert_id": "alert-001"}
    queries = planner.run(context)
    
    endpoint_query = next(q for q in queries if "endpoint" in q["query"].lower())
    firewall_query = next(q for q in queries if "firewall" in q["query"].lower())
    
    assert "extracted_host" in endpoint_query["query"]
    assert "extracted_host" in firewall_query["query"]

    # 2. Verify evidence collector formats extracted_host correctly
    from app.agents.evidence_collector import format_real_splunk_row
    row_low = {
        "_time": "2026-06-11T12:00:00Z",
        "extracted_host": "win-dc-01",
        "host": "ShoaibDESKTOP-I26TI8K",
        "process_name": "whoami.exe",
        "command_line": "whoami /priv",
        "severity": "low"
    }
    row_str_low = format_real_splunk_row("sentinelops:endpoint", row_low, context)
    assert "host=win-dc-01" in row_str_low
    assert "host=ShoaibDESKTOP" not in row_str_low

def test_ai_gateway_fallbacks():
    # Test OpenAI fallback with key missing
    from app.services.ai_client import AIClient
    from app import config
    
    # Temporarily set to openai but no key
    config.AI_PROVIDER = "openai"
    config.AI_MODE = "openai"
    config.OPENAI_API_KEY = ""
    
    client_test = AIClient()
    assert client_test.get_status() == "OpenAI (Fallback to Mock - Key Missing)"
    assert client_test.get_provider_configured() is False
    
    explanation = client_test.generate_incident_explanation(
        alert_title="Suspicious Login",
        risk_score=95,
        timeline=[],
        evidence_count=0
    )
    assert "Incident Analysis" in explanation
    
    # Test Gemini fallback with key missing
    config.AI_PROVIDER = "gemini"
    config.AI_MODE = "gemini"
    config.GEMINI_API_KEY = ""
    
    client_test_gemini = AIClient()
    assert client_test_gemini.get_status() == "Gemini (Fallback to Mock - Key Missing)"
    assert client_test_gemini.get_provider_configured() is False
    
    explanation_gemini = client_test_gemini.generate_incident_explanation(
        alert_title="Suspicious Login",
        risk_score=95,
        timeline=[],
        evidence_count=0
    )
    assert "Incident Analysis" in explanation_gemini
    
    # Revert config
    config.AI_PROVIDER = "mock"
    config.AI_MODE = "mock"

