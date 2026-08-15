from datetime import datetime, timezone


async def save_application(
    database,
    job,
    resume,
    application_report,
):

    collection = database["applications"]

    document = {
        "job_external_id": job.external_id,
        "job_source": job.source,

        "job": job.model_dump(),

        "resume": resume.model_dump(),

        "application": (
            application_report.model_dump()
            if hasattr(
                application_report,
                "model_dump",
            )
            else application_report
        ),

        "created_at": datetime.now(
            timezone.utc
        ),
    }

    result = await collection.insert_one(
        document
    )

    return str(result.inserted_id)