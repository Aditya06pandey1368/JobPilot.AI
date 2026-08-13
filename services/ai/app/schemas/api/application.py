from pydantic import BaseModel, Field

from app.schemas.job import Job


class ApplicationRequest(BaseModel):

    job: Job

    resume_text: str = Field(
        min_length=10,
        description="Candidate resume text",
    )