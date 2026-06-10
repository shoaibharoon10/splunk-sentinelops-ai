import time
from datetime import datetime
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app import config
from app.routes import alerts, investigate
from app.schemas import HealthResponse

app = FastAPI(
    title="Splunk SentinelOps AI Backend",
    description="AI-powered, human-in-the-loop SOC investigation assistant for Splunk Agentic Ops Hackathon.",
    version="0.1.0"
)

# Configure CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=config.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include sub-routers
app.include_router(alerts.router)
app.include_router(investigate.router)

@app.get("/", tags=["root"])
def read_root():
    return {
        "message": "Welcome to Splunk SentinelOps AI Backend",
        "documentation": "/docs",
        "status": "operational"
    }

@app.get("/health", response_model=HealthResponse, tags=["health"])
def health_check():
    """
    Exposes service health status metrics.
    """
    from app.services.splunk_client import SplunkClient
    from app.services.ai_client import AIClient
    
    splunk_client = SplunkClient()
    ai_client = AIClient()
    
    splunk_status = splunk_client.get_status()
    
    return HealthResponse(
        status="healthy",
        service="Splunk SentinelOps AI Backend",
        mode=config.APP_MODE,
        version="0.1.0",
        splunk_connected=splunk_status["connected"],
        mcp_active=False,
        ai_provider=ai_client.get_status(),
        timestamp=datetime.utcnow().isoformat() + "Z"
    )
