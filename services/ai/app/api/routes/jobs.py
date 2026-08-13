from fastapi import APIRouter, HTTPException

from app.schemas.api.job_search import (
    JobSearchRequest,
)

from app.schemas.api.application import (
    ApplicationRequest,
)

from app.graphs.orchestrator import (
    master_orchestrator,
)


router = APIRouter(
    prefix="/api/jobs",
    tags=["Jobs"],
)


@router.post("/search")
async def search_jobs(
    request: JobSearchRequest,
):

    try:

        from app.services.resume.extractor import (
            extract_resume,
        )

        resume = extract_resume(
            request.resume_text
        )

        result = await master_orchestrator.ainvoke({

            "operation": "rank",

            "user_query": request.query,

            "resume": resume,

            "discovered_jobs": [],

            "ranked_jobs": [],

            "selected_job": None,

            "application_report": None,
        })

        return {
            "success": True,
            "jobs": result["ranked_jobs"],
        }

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=str(error),
        )


@router.post("/application")
async def generate_application(
    request: ApplicationRequest,
):

    try:

        from app.services.resume.extractor import (
            extract_resume,
        )

        resume = extract_resume(
            request.resume_text
        )

        result = await master_orchestrator.ainvoke({

            "operation": "apply",

            "user_query": "",

            "resume": resume,

            "discovered_jobs": [],

            "ranked_jobs": [],

            "selected_job": request.job,

            "application_report": None,
        })

        return {
            "success": True,
            "application": result[
                "application_report"
            ],
        }

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=str(error),
        )