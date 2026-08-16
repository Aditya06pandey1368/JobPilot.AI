from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.core.config import settings
from app.db.mongodb import create_mongo_client

from app.api.routes.jobs import (
    router as jobs_router,
)

from app.api.routes.auth import (
    router as auth_router,
)
from app.db.indexes import create_indexes


@asynccontextmanager
async def lifespan(app: FastAPI):

    client = create_mongo_client()

    database = client[
        settings.mongodb_database
    ]

    await database.command("ping")

    await create_indexes(
        database
    )

    app.state.mongodb_client = client
    app.state.database = database

    print("MongoDB connected")

    yield

    await client.close()

    print("MongoDB connection closed")


app = FastAPI(
    title="JobPilot.AI",
    description="AI-powered job discovery and application platform",
    version="1.0.0",
    lifespan=lifespan,
)


app.include_router(
    jobs_router
)

app.include_router(
    auth_router
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