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
