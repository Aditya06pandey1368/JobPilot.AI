from langchain_groq import ChatGroq

from app.core.config import settings

from app.schemas.job import Job
from app.schemas.resume import Resume

from app.schemas.application import (
    CoverLetter,
)


model = ChatGroq(
    model="llama-3.3-70b-versatile",
    api_key=settings.groq_api_key,
    temperature=0.3,
)


cover_letter_model = model.with_structured_output(
    CoverLetter
)


def generate_cover_letter(
    job: Job,
    resume: Resume,
) -> CoverLetter:

    prompt = f"""
Write a concise professional cover letter
for this job.

JOB

Title:
{job.title}

Company:
{job.company}

Description:
{job.description}


CANDIDATE

Name:
{resume.name}

Summary:
{resume.summary}

Skills:
{", ".join(resume.skills)}

Projects:
{", ".join(resume.projects)}

Experience:
{", ".join(resume.experience)}

Education:
{", ".join(resume.education)}


RULES

- Keep it concise and professional.
- Make it specific to the job.
- Use the candidate's actual background.
- Do not invent experience.
- Do not invent achievements.
- Do not invent skills.
- Do not make unsupported claims.
"""

    return cover_letter_model.invoke(prompt)