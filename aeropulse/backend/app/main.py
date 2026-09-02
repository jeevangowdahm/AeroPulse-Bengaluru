"""
AeroPulse Bengaluru - FastAPI Main Application Entrypoint
AI-Powered Air Quality Monitoring, Forecasting, Early Warning & Risk Ranking Platform
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .core.config import settings
from .api.endpoints import router as api_router

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Production-ready AI Air Quality Monitoring, Forecasting, Early Warning & Risk Ranking Platform for Bengaluru Urban Region",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS configuration to allow local Vite/React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount REST router
app.include_router(api_router, prefix=settings.API_PREFIX)

@app.get("/")
def root():
    return {
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "region": settings.PRIMARY_REGION,
        "demo_mode": settings.DEMO_MODE,
        "status": "ONLINE",
        "docs": "/docs",
        "api_prefix": settings.API_PREFIX
    }

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "AeroPulse-Bengaluru-Backend"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
