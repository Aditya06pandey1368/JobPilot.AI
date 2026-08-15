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

from app.schemas.api.application_status import (
    ApplicationStatusRequest,
)

from app.graphs.orchestrator import (
    master_orchestrator,
)

from app.repositories.jobs import (
    save_job,
    get_job,
    get_jobs,
)

from app.repositories.applications import (
    save_application,
    get_applications,
    get_application,
    update_application_status,
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


@router.get("")
async def list_jobs(
    request: Request,
    limit: int = 50,
):

    try:

        if limit < 1 or limit > 100:
            raise HTTPException(
                status_code=400,
                detail="Limit must be between 1 and 100",
            )

        database = request.app.state.database

        jobs = await get_jobs(
            database,
            limit,
        )

        return {
            "success": True,
            "count": len(jobs),
            "jobs": jobs,
        }

    except HTTPException:

        raise

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=str(error),
        )


@router.get("/detail/{source}/{external_id}")
async def get_job_details(
    request: Request,
    source: str,
    external_id: str,
):

    try:

        database = request.app.state.database

        job = await get_job(
            database,
            external_id,
            source,
        )

        if job is None:

            raise HTTPException(
                status_code=404,
                detail="Job not found",
            )

        return {
            "success": True,
            "job": job,
        }

    except HTTPException:

        raise

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

        application_report = result[
            "application_report"
        ]

        application_id = await save_application(
            database,
            job,
            resume,
            application_report,
        )

        return {
            "success": True,
            "application_id": application_id,
            "application": application_report,
        }

    except HTTPException:

        raise

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=str(error),
        )


@router.get("/applications")
async def list_applications(
    request: Request,
    limit: int = 50,
):

    try:

        if limit < 1 or limit > 100:
            raise HTTPException(
                status_code=400,
                detail="Limit must be between 1 and 100",
            )

        database = request.app.state.database

        applications = await get_applications(
            database,
            limit,
        )

        return {
            "success": True,
            "count": len(applications),
            "applications": applications,
        }

    except HTTPException:

        raise

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=str(error),
        )


@router.get("/applications/{application_id}")
async def get_application_details(
    request: Request,
    application_id: str,
):

    try:

        database = request.app.state.database

        application = await get_application(
            database,
            application_id,
        )

        if application is None:

            raise HTTPException(
                status_code=404,
                detail="Application not found",
            )

        return {
            "success": True,
            "application": application,
        }

    except HTTPException:

        raise

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=str(error),
        )


@router.patch(
    "/applications/{application_id}/status"
)
async def update_status(
    request: Request,
    application_id: str,
    data: ApplicationStatusRequest,
):

    try:

        database = request.app.state.database

        updated = await update_application_status(
            database,
            application_id,
            data.status,
        )

        if not updated:

            raise HTTPException(
                status_code=404,
                detail="Application not found",
            )

        application = await get_application(
            database,
            application_id,
        )

        return {
            "success": True,
            "application": application,
        }

    except HTTPException:

        raise

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=str(error),
        )