import httpx

from app.core.config import settings
from app.schemas.job_search import JobSearchIntent


async def search_adzuna_jobs(intent: JobSearchIntent) -> list[dict]:
    url = "https://api.adzuna.com/v1/api/jobs/in/search/1"

    params = {
        "app_id": settings.adzuna_app_id,
        "app_key": settings.adzuna_app_key,
        "results_per_page": 20,
        "what": " ".join(intent.roles),
        "where": (
            ""
            if intent.locations == ["India"]
            else " ".join(intent.locations)
        ),
        "max_days_old": intent.freshness_days,
        "sort_by": "date",
        "content-type": "application/json",
    }

    async with httpx.AsyncClient(timeout=15.0) as client:
        response = await client.get(url, params=params)
        response.raise_for_status()

    data = response.json()

    return data.get("results", [])