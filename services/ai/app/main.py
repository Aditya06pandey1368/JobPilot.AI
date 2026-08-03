from fastapi import FastAPI

app = FastAPI(
    title="JobPilot.AI AI Service",
    description="Agentic AI service for JobPilot.AI",
    version="0.1.0",
)


@app.get("/health")
async def health_check():
    return {
        "status": "ok",
        "service": "jobpilot-ai",
    }