from app.schemas.job_requirement import (
    JobRequirement,
)

from app.schemas.resume import Resume
from app.schemas.resume_match import (
    ResumeMatchReport,
)

def match_skills(
    resume: Resume,
    requirements: JobRequirement,
):

    resume_skills = {
        skill.lower()
        for skill in resume.skills
    }

    required_skills = {
        skill.lower()
        for skill in requirements.skills
    }

    matched = sorted(
        resume_skills &
        required_skills
    )

    missing = sorted(
        required_skills -
        resume_skills
    )

    return matched, missing

def calculate_skill_score(
    matched,
    required,
):

    if not required:
        return 100

    return int(
        len(matched)
        /
        len(required)
        *
        100
    )

def match_resume(
    resume: Resume,
    requirements: JobRequirement,
) -> ResumeMatchReport:

    matched, missing = match_skills(
        resume,
        requirements,
    )

    score = calculate_skill_score(
        matched,
        requirements.skills,
    )

    return ResumeMatchReport(

        overall_score=score,

        skill_score=score,

        experience_score=0,

        education_score=0,

        ats_score=0,

        matched_skills=matched,

        missing_skills=missing,

        strengths=[],

        suggestions=[],
    )