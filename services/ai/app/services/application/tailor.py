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
existing resume toward this specific job.

You may:

- Rewrite the professional summary using
  existing facts.
- Select the most relevant existing skills.
- Select the most relevant existing projects.
- Select the most relevant existing experience.
- Identify job keywords that genuinely match
  the candidate's background.

STRICT RULES:

- Never invent experience.
- Never invent skills.
- Never invent projects.
- Never invent achievements.
- Never invent certifications.
- Never add a missing skill as if the candidate
  already possesses it.
- Never create fictional experience to improve
  the match.
- Do not add AWS, REST APIs, or any other skill
  unless it is actually supported by the resume.
- Only use information actually present in
  the supplied resume.
- Never describe the candidate as having a skill unless that skill appears in the resume.
- If communication skills are missing from the resume, do not describe the candidate as having strong communication skills.
"""

    return tailor_model.invoke(prompt)