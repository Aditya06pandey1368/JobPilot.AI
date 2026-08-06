from datetime import datetime, timezone

from app.schemas.job import Job
from app.schemas.job_search import JobSearchIntent


INDIA_LOCATION_KEYWORDS = {
    "india",
    "bengaluru",
    "bangalore",
    "hyderabad",
    "pune",
    "noida",
    "gurugram",
    "gurgaon",
    "delhi",
    "mumbai",
    "chennai",
    "kolkata",
    "jaipur",
    "ahmedabad",
}


INTERNSHIP_KEYWORDS = {
    "intern",
    "internship",
    "trainee",
    "graduate trainee",
}


SENIOR_KEYWORDS = {
    "senior",
    "sr.",
    "sr ",
    "lead",
    "principal",
    "staff",
    "manager",
    "director",
    "vice president",
    "vp",
    "head",
}


def is_india_job(job: Job) -> bool:
    location = job.location.lower()

    return any(
        keyword in location
        for keyword in INDIA_LOCATION_KEYWORDS
    )


def is_fresh(job: Job, freshness_days: int) -> bool:
    date = job.posted_at or job.updated_at

    if date is None:
        return True

    if date.tzinfo is None:
        date = date.replace(tzinfo=timezone.utc)

    now = datetime.now(timezone.utc)

    age = now - date

    return age.days <= freshness_days


def matches_job_type(
    job: Job,
    intent: JobSearchIntent,
) -> bool:

    if intent.job_type == "any":
        return True

    text = f"{job.title} {job.description or ''}".lower()

    if intent.job_type == "internship":
        return any(
            keyword in text
            for keyword in INTERNSHIP_KEYWORDS
        )

    return True


def matches_seniority(
    job: Job,
    intent: JobSearchIntent,
) -> bool:

    if intent.job_type != "internship":
        return True

    title = job.title.lower()

    return not any(
        keyword in title
        for keyword in SENIOR_KEYWORDS
    )


def filter_jobs(
    jobs: list[Job],
    intent: JobSearchIntent,
) -> list[Job]:

    filtered = []

    for job in jobs:

        if not is_india_job(job):
            continue

        if not is_fresh(job, intent.freshness_days):
            continue

        if not matches_job_type(job, intent):
            continue

        if not matches_seniority(job, intent):
            continue

        filtered.append(job)

    return filtered