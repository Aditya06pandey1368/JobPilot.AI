from fastapi import (
    APIRouter,
    HTTPException,
    Request,
)

from app.schemas.api.job_search import (
    JobSearchRequest,
)

from app.schemas.api.application import (
    ApplicationRequest,
)

from app.graphs.orchestrator import (
    master_orchestrator,
)

from app.repositories.jobs import (
    save_job,
    get_job,
)


router = APIRouter(
    prefix="/api/jobs",
    tags=["Jobs"],
)


@router.post("/search")
async def search_jobs(
    request: Request,
    data: JobSearchRequest,
):

    try:

        from app.services.resume.extractor import (
            extract_resume,
        )

        resume = extract_resume(
            data.resume_text
        )

        result = await master_orchestrator.ainvoke({

            "operation": "rank",

            "user_query": data.query,

            "resume": resume,

            "discovered_jobs": [],

            "ranked_jobs": [],

            "selected_job": None,

            "application_report": None,
        })

        ranked_jobs = result[
            "ranked_jobs"
        ]

        database = request.app.state.database

        for ranked_job in ranked_jobs:

            await save_job(
                database,
                ranked_job.job,
            )

        return {
            "success": True,
            "jobs": ranked_jobs,
        }

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=str(error),
        )


@router.post("/application")
async def generate_application(
    request: Request,
    data: ApplicationRequest,
):

    try:

        database = request.app.state.database

        job = await get_job(
            database,
            external_id=data.external_id,
            source=data.source,
        )

        if job is None:

            raise HTTPException(
                status_code=404,
                detail="Job not found",
            )

        from app.services.resume.extractor import (
            extract_resume,
        )

        resume = extract_resume(
            data.resume_text
        )

        result = await master_orchestrator.ainvoke({

            "operation": "apply",

            "user_query": "",

            "resume": resume,

            "discovered_jobs": [],

            "ranked_jobs": [],

            "selected_job": job,

            "application_report": None,
        })

        return {
            "success": True,
            "application": result[
                "application_report"
            ],
        }

    except HTTPException:

        raise

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=str(error),
        )