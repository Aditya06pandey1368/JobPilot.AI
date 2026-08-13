from fastapi import FastAPI

from app.api.routes.jobs import (
    router as jobs_router,
)


app = FastAPI(
    title="JobPilot.AI",
)


app.include_router(
    jobs_router
)


@app.get("/")

async def root():

    return {
        "message": "JobPilot.AI API",
        "status": "running",
    }


@app.get("/health")

async def health():

    return {
        "status": "healthy"
    }