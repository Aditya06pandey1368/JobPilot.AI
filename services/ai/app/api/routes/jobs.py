from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Request,
)

from app.api.dependencies import (
    get_current_user,
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

from app.schemas.api.responses import (
    JobSearchResponse,
    JobListResponse,
    JobDetailResponse,
    ApplicationResponse,
    ApplicationListResponse,
    ApplicationDetailResponse,
    ApplicationStatusResponse,
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


# ============================================================
# SEARCH JOBS
# ============================================================

@router.post(
    "/search",
    response_model=JobSearchResponse,
)
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
            "count": len(ranked_jobs),
            "jobs": ranked_jobs,
        }

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail="Job search failed",
        ) from error


# ============================================================
# GET SAVED JOBS
# ============================================================

@router.get(
    "",
    response_model=JobListResponse,
)
async def list_jobs(
    request: Request,
    limit: int = 50,
    offset: int = 0,
):

    if limit < 1 or limit > 100:

        raise HTTPException(
            status_code=400,
            detail="Limit must be between 1 and 100",
        )

    if offset < 0:

        raise HTTPException(
            status_code=400,
            detail="Offset cannot be negative",
        )

    try:

        database = request.app.state.database

        jobs = await get_jobs(
            database,
            limit=limit,
            offset=offset,
        )

        return {
            "success": True,
            "count": len(jobs),
            "limit": limit,
            "offset": offset,
            "jobs": jobs,
        }

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail="Unable to retrieve jobs",
        ) from error


# ============================================================
# GET JOB DETAILS
# ============================================================

@router.get(
    "/detail/{source}/{external_id}",
    response_model=JobDetailResponse,
)
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
            detail="Unable to retrieve job",
        ) from error


# ============================================================
# GENERATE APPLICATION
# ============================================================

@router.post(
    "/application",
    response_model=ApplicationResponse,
)
async def generate_application(
    request: Request,
    data: ApplicationRequest,
    user=Depends(
        get_current_user
    ),
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
            user["_id"],
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
            detail="Application generation failed",
        ) from error


# ============================================================
# GET USER APPLICATIONS
# ============================================================

@router.get(
    "/applications",
    response_model=ApplicationListResponse,
)
async def list_applications(
    request: Request,
    limit: int = 50,
    offset: int = 0,
    status: str | None = None,
    user=Depends(
        get_current_user
    ),
):

    if limit < 1 or limit > 100:

        raise HTTPException(
            status_code=400,
            detail="Limit must be between 1 and 100",
        )

    if offset < 0:

        raise HTTPException(
            status_code=400,
            detail="Offset cannot be negative",
        )

    valid_statuses = {
        "saved",
        "applied",
        "assessment",
        "interview",
        "offer",
        "rejected",
    }

    if status is not None and status not in valid_statuses:

        raise HTTPException(
            status_code=400,
            detail="Invalid application status",
        )

    try:

        database = request.app.state.database

        applications = await get_applications(
            database,
            user["_id"],
            limit=limit,
            offset=offset,
            status=status,
        )

        return {
            "success": True,
            "count": len(applications),
            "limit": limit,
            "offset": offset,
            "applications": applications,
        }

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail="Unable to retrieve applications",
        ) from error


# ============================================================
# GET APPLICATION DETAILS
# ============================================================

@router.get(
    "/applications/{application_id}",
    response_model=ApplicationDetailResponse,
)
async def get_application_details(
    request: Request,
    application_id: str,
    user=Depends(
        get_current_user
    ),
):

    try:

        database = request.app.state.database

        application = await get_application(
            database,
            user["_id"],
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
            detail="Unable to retrieve application",
        ) from error


# ============================================================
# UPDATE APPLICATION STATUS
# ============================================================

@router.patch(
    "/applications/{application_id}/status",
    response_model=ApplicationStatusResponse,
)
async def update_status(
    request: Request,
    application_id: str,
    data: ApplicationStatusRequest,
    user=Depends(
        get_current_user
    ),
):

    try:

        database = request.app.state.database

        updated = await update_application_status(
            database,
            user["_id"],
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
            user["_id"],
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
            detail="Unable to update application",
        ) from error