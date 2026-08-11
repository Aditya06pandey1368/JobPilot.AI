from langchain_groq import ChatGroq

from app.core.config import settings

from app.schemas.job import Job
from app.schemas.resume import Resume

from app.schemas.application import (
    TailoredResume,
)


model = ChatGroq(
    model="llama-3.3-70b-versatile",
    api_key=settings.groq_api_key,
    temperature=0,
)


tailor_model = model.with_structured_output(
    TailoredResume
)


def tailor_resume(
    job: Job,
    resume: Resume,
) -> TailoredResume:

    prompt = f"""
You are an expert technical resume editor.

Tailor the candidate's existing resume
for the specific job below.

JOB

Title:
{job.title}

Company:
{job.company}

Description:
{job.description}


RESUME

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

Certifications:
{", ".join(resume.certifications)}


INSTRUCTIONS

Create recommendations for tailoring the
resume toward this specific job.

You may:

- Rewrite the professional summary.
- Select the most relevant skills.
- Select the most relevant projects.
- Select the most relevant experience.
- Identify important keywords to emphasize.

Rules:

- Never invent experience.
- Never invent skills.
- Never invent projects.
- Never invent achievements.
- Never invent certifications.
- Only use information actually present
  in the supplied resume.
"""

    return tailor_model.invoke(prompt)