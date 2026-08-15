from app.schemas.job import Job


async def save_job(
    database,
    job: Job,
):

    collection = database["jobs"]

    await collection.update_one(

        {
            "external_id": job.external_id,
            "source": job.source,
        },

        {
            "$set": job.model_dump(),
        },

        upsert=True,
    )


async def get_job(
    database,
    external_id: str,
    source: str,
):

    collection = database["jobs"]

    document = await collection.find_one({

        "external_id": external_id,

        "source": source,
    })

    if document is None:

        return None

    document.pop(
        "_id",
        None,
    )

    return Job.model_validate(
        document
    )