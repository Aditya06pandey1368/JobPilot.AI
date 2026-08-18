from langchain_groq import ChatGroq

from app.core.config import settings

from app.schemas.job import Job
from app.schemas.resume import Resume

from app.schemas.application import (
    ApplicationAnalysis,
)


model = ChatGroq(
    model="openai/gpt-oss-120b",
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
3. Skills required by the job that are not
   present in the resume.
4. What existing parts of the resume should
   receive the most emphasis.
5. Practical improvements to the application.
6. Useful application notes.

STRICT RULES

- Never invent experience.
- Never invent skills.
- Never invent projects.
- Never invent certifications.
- Never invent achievements.
- Never claim the candidate has a missing skill.
- Never recommend falsely adding a skill to
  the resume.
- Never recommend creating a fake project or
  fake experience just to match the job.
- Missing skills should be reported honestly.
- Recommendations should focus primarily on
  emphasizing existing relevant experience,
  skills, projects, and achievements.
- If a missing skill is important, clearly
  identify it as a gap rather than pretending
  the candidate has it.
- Only use information contained in the
  provided resume and job description.
- Be specific to this job.
- Keep recommendations practical and honest.
"""

    return analysis_model.invoke(prompt)