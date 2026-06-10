from fastapi import APIRouter, HTTPException
from typing import List
from app.schemas import Alert
from app.services import mock_data

router = APIRouter(prefix="/alerts", tags=["alerts"])

@router.get("", response_model=List[Alert])
def list_alerts():
    """Lists all security alerts loaded from demo data."""
    return mock_data.get_alerts()

@router.get("/{alert_id}", response_model=Alert)
def get_alert(alert_id: str):
    """Retrieves a single alert. Returns 404 if not found."""
    alert = mock_data.get_alert_by_id(alert_id)
    if not alert:
        raise HTTPException(status_code=404, detail=f"Alert with ID '{alert_id}' not found.")
    return alert
