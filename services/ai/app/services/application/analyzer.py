from langchain_groq import ChatGroq

from app.core.config import settings

from app.schemas.job import Job
from app.schemas.resume import Resume

from app.schemas.application import (
    ApplicationAnalysis,
)


model = ChatGroq(
    model="llama-3.3-70b-versatile",
    api_key=settings.groq_api_key,
    temperature=0,
)


analysis_model = model.with_structured_output(
    ApplicationAnalysis
)


def analyze_application(
    job: Job,
    resume: Resume,
) -> ApplicationAnalysis:

    prompt = f"""
You are an expert job application advisor.

Analyze how well this candidate fits the
specific job.

JOB

Title:
{job.title}

Company:
{job.company}

Location:
{job.location}

Description:
{job.description}


RESUME

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

Certifications:
{", ".join(resume.certifications)}


INSTRUCTIONS

Evaluate the candidate against this specific job.

Identify:

1. The most important job requirements.
2. Skills already present in the resume.
3. Skills missing from the resume.
4. What parts of the resume should receive
   the most emphasis.
5. Specific improvements that could make
   the application stronger.
6. Useful application notes.

Rules:

- Do not invent experience.
- Do not claim the candidate has a skill
  that is not present in the resume.
- Do not invent projects, employers,
  certifications, or achievements.
- Base the analysis only on the provided
  job description and resume.
- Be specific to this job.
- Keep recommendations practical.
"""

    return analysis_model.invoke(prompt)