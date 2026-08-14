from app.db.mongodb import (
    jobs_collection,
)

from app.schemas.job import Job


async def save_job(
    job: Job,
):

    document = job.model_dump()

    await jobs_collection.update_one(

        {
            "external_id": job.external_id,
            "source": job.source,
        },

        {
            "$set": document,
        },

        upsert=True,
    )


async def get_job(
    external_id: str,
    source: str,
):

    document = await jobs_collection.find_one({

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