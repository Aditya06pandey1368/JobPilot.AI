from app.schemas.job import Job
from app.schemas.resume import Resume

from app.schemas.application import (
    ApplicationChecklist,
)


def create_application_checklist(
    job: Job,
    resume: Resume,
) -> ApplicationChecklist:

    items = [
        "Review the job description carefully.",
        "Verify that the resume matches the job requirements.",
        "Check contact information before applying.",
        "Review the tailored resume.",
        "Review the generated cover letter.",
        "Verify the application deadline.",
        "Open the official application link.",
    ]

    if resume.linkedin:
        items.append(
            "Verify that the LinkedIn profile is up to date."
        )

    if resume.github:
        items.append(
            "Verify that the GitHub profile is up to date."
        )

    if resume.portfolio:
        items.append(
            "Verify that the portfolio is up to date."
        )

    return ApplicationChecklist(
        items=items
    )