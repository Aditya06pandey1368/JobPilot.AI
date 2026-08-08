from app.schemas.resume import Resume
from app.schemas.job_requirement import JobRequirement


def calculate_skill_score(
    matched: list[str],
    required: list[str],
) -> int:

    if not required:
        return 100

    return int(
        len(matched) / len(required) * 100
    )


def calculate_experience_score(
    resume: Resume,
    requirements: JobRequirement,
) -> int:

    if not requirements.experience:
        return 100

    if resume.experience:
        return 80

    return 0


def calculate_project_score(
    resume: Resume,
) -> int:

    if len(resume.projects) >= 3:
        return 100

    if len(resume.projects) == 2:
        return 80

    if len(resume.projects) == 1:
        return 60

    return 0


def calculate_education_score(
    resume: Resume,
    requirements: JobRequirement,
) -> int:

    if not requirements.education:
        return 100

    if resume.education:
        return 100

    return 0


def calculate_resume_quality(
    resume: Resume,
) -> int:

    score = 0

    if resume.summary:
        score += 20

    if resume.github:
        score += 20

    if resume.linkedin:
        score += 20

    if resume.projects:
        score += 20

    if resume.certifications:
        score += 20

    return score