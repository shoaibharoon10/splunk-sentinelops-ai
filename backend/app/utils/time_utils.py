from datetime import datetime

def format_timestamp(ts_str: str) -> str:
    """
    Safely return ISO-8601 formatting, adjusting Z designations for python compatibility.
    """
    try:
        clean_ts = ts_str.replace("Z", "+00:00")
        dt = datetime.fromisoformat(clean_ts)
        return dt.isoformat()
    except Exception:
        return ts_str
