from pydantic import BaseModel, Field


class ApplicationRequest(BaseModel):

    job_id: str = Field(
        min_length=1
    )

    resume_text: str = Field(
        min_length=10
    )