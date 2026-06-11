import os
from dotenv import load_dotenv

# Load from environment file
load_dotenv()

# Application configuration settings
APP_MODE = os.getenv("APP_MODE", "mock").lower()
AI_MODE = os.getenv("AI_MODE", "mock").lower()
SPLUNK_MODE = os.getenv("SPLUNK_MODE", "mock").lower()

# Splunk credentials
SPLUNK_HOST = os.getenv("SPLUNK_HOST", "https://localhost:8089")
SPLUNK_USERNAME = os.getenv("SPLUNK_USERNAME", "admin")
SPLUNK_PASSWORD = os.getenv("SPLUNK_PASSWORD", "")
SPLUNK_TOKEN = os.getenv("SPLUNK_TOKEN", "")
SPLUNK_INDEX = os.getenv("SPLUNK_INDEX", "sentinelops")
SPLUNK_VERIFY_SSL = os.getenv("SPLUNK_VERIFY_SSL", "false").lower() == "true"
SPLUNK_SEARCH_TIMEOUT_SECONDS = int(os.getenv("SPLUNK_SEARCH_TIMEOUT_SECONDS", "30"))
SPLUNK_POLL_INTERVAL_SECONDS = float(os.getenv("SPLUNK_POLL_INTERVAL_SECONDS", "1"))

# AI configurations
AI_MODE = os.getenv("AI_MODE", os.getenv("AI_PROVIDER", "mock")).lower()
AI_PROVIDER = AI_MODE
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-4o-mini")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")
AI_REQUEST_TIMEOUT_SECONDS = int(os.getenv("AI_REQUEST_TIMEOUT_SECONDS", "20"))

# CORS origins
CORS_ORIGINS_RAW = os.getenv("BACKEND_CORS_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000")
CORS_ORIGINS = [origin.strip() for origin in CORS_ORIGINS_RAW.split(",") if origin.strip()]
