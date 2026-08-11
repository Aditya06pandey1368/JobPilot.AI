from typing import TypedDict

from app.schemas.job import Job
from app.schemas.resume import Resume
from app.schemas.application import ApplicationReport


class ApplicationState(TypedDict):

    job: Job

    resume: Resume

    report: ApplicationReport | None