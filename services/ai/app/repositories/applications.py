from datetime import datetime, timezone

from bson import ObjectId


VALID_STATUSES = {
    "saved",
    "applied",
    "assessment",
    "interview",
    "offer",
    "rejected",
}


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

        "status": "saved",

        "created_at": datetime.now(
            timezone.utc
        ),

        "updated_at": datetime.now(
            timezone.utc
        ),
    }

    result = await collection.insert_one(
        document
    )

    return str(result.inserted_id)


async def get_applications(
    database,
    limit: int = 50,
):

    collection = database["applications"]

    cursor = (
        collection
        .find()
        .sort("updated_at", -1)
        .limit(limit)
    )

    applications = []

    async for document in cursor:

        document["_id"] = str(
            document["_id"]
        )

        applications.append(document)

    return applications


async def get_application(
    database,
    application_id: str,
):

    if not ObjectId.is_valid(
        application_id
    ):
        return None

    collection = database["applications"]

    document = await collection.find_one({
        "_id": ObjectId(application_id)
    })

    if document is None:
        return None

    document["_id"] = str(
        document["_id"]
    )

    return document


async def update_application_status(
    database,
    application_id: str,
    status: str,
):

    if status not in VALID_STATUSES:
        raise ValueError(
            f"Invalid status: {status}"
        )

    if not ObjectId.is_valid(
        application_id
    ):
        return False

    collection = database["applications"]

    result = await collection.update_one(
        {
            "_id": ObjectId(
                application_id
            )
        },
        {
            "$set": {
                "status": status,
                "updated_at": datetime.now(
                    timezone.utc
                ),
            }
        },
    )

    return result.modified_count > 0