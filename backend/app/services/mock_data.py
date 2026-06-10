import os
import csv
import json
from typing import List, Dict, Any, Optional

# Resolve the absolute path of the demo-data directory relative to this file
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
DEMO_DATA_DIR = os.path.join(BASE_DIR, "demo-data")

def load_csv_data(filename: str) -> List[Dict[str, Any]]:
    filepath = os.path.join(DEMO_DATA_DIR, filename)
    if not os.path.exists(filepath):
        print(f"Warning: demo-data file {filename} not found at {filepath}")
        return []
    
    data = []
    try:
        with open(filepath, mode="r", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for row in reader:
                data.append(dict(row))
    except Exception as e:
        print(f"Error reading {filename}: {e}")
    return data

def load_alerts() -> List[Dict[str, Any]]:
    filepath = os.path.join(DEMO_DATA_DIR, "alerts.json")
    if not os.path.exists(filepath):
        print(f"Warning: demo-data file alerts.json not found at {filepath}")
        return []
    
    try:
        with open(filepath, mode="r", encoding="utf-8") as f:
            return json.load(f)
    except Exception as e:
        print(f"Error reading alerts.json: {e}")
        return []

def get_alerts() -> List[Dict[str, Any]]:
    return load_alerts()

def get_alert_by_id(alert_id: str) -> Optional[Dict[str, Any]]:
    alerts = load_alerts()
    for alert in alerts:
        if alert.get("alert_id") == alert_id:
            return alert
    return None

def query_auth_logs(user: Optional[str] = None, src_ip: Optional[str] = None, host: Optional[str] = None) -> List[Dict[str, Any]]:
    logs = load_csv_data("auth_logs.csv")
    filtered = []
    for log in logs:
        if user and log.get("user") != user:
            continue
        if src_ip and log.get("src_ip") != src_ip:
            continue
        if host and log.get("host") != host:
            continue
        filtered.append(log)
    return filtered

def query_endpoint_logs(host: Optional[str] = None, user: Optional[str] = None) -> List[Dict[str, Any]]:
    logs = load_csv_data("endpoint_logs.csv")
    filtered = []
    for log in logs:
        if host and log.get("host") != host:
            continue
        if user and log.get("user") != user:
            continue
        filtered.append(log)
    return filtered

def query_firewall_logs(host: Optional[str] = None, src_ip: Optional[str] = None) -> List[Dict[str, Any]]:
    logs = load_csv_data("firewall_logs.csv")
    filtered = []
    for log in logs:
        if host and log.get("host") != host:
            continue
        if src_ip and log.get("src_ip") != src_ip:
            continue
        filtered.append(log)
    return filtered

def query_web_logs(src_ip: Optional[str] = None) -> List[Dict[str, Any]]:
    logs = load_csv_data("web_logs.csv")
    filtered = []
    for log in logs:
        if src_ip and log.get("src_ip") != src_ip:
            continue
        filtered.append(log)
    return filtered
