from pymongo import AsyncMongoClient

from app.core.config import settings


client = AsyncMongoClient(
    settings.mongodb_uri
)

database = client[
    settings.mongodb_database
]


users_collection = database["users"]

resumes_collection = database["resumes"]

jobs_collection = database["jobs"]

applications_collection = database[
    "applications"
]

saved_jobs_collection = database[
    "saved_jobs"
]