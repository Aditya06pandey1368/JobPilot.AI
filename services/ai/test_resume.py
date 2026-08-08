from app.schemas.job import Job
from app.services.resume.extractor import (
    extract_resume,
)
from app.services.resume.job_extractor import (
    extract_job_requirements,
)


resume_text = """
Aditya Pandey

Email: aditya@gmail.com

Phone: +91 9876543210

LinkedIn:
https://linkedin.com/in/aditya

GitHub:
https://github.com/aditya06

Summary

Final year Computer Science student passionate about
Full Stack Development and Agentic AI.

Skills

Java
Python
JavaScript
TypeScript
React
Next.js
Node.js
Express.js
MongoDB
LangChain
LangGraph
Git
Docker

Projects

JobPilot.AI
ScholarHub LMS
GamingArena

Experience

Full Stack Developer Intern at ABC Technologies
Worked on MERN Stack applications.

Education

B.Tech Computer Science
Bundelkhand Institute of Engineering and Technology

Certifications

IBM Git & GitHub
"""


job = Job(
    external_id="1",
    source="adzuna",
    title="Software Engineer Intern",
    company="Electronic Arts",
    location="Hyderabad",
    description="""
Electronic Arts is looking for a Software Engineer Intern.

Requirements

- Java
- React
- Node.js
- MongoDB
- Docker
- Git
- Communication Skills

Preferred

- AWS
- LangGraph
- REST APIs

Responsibilities

- Build backend APIs
- Develop frontend features
- Write unit tests
- Work with senior engineers
""",
    posted_at=None,
    updated_at=None,
    apply_url="https://ea.com",
    source_url="https://ea.com",
)


print("=" * 70)
print("RESUME EXTRACTION")
print("=" * 70)

resume = extract_resume(
    resume_text,
)

print(resume.model_dump())


print("\n")
print("=" * 70)
print("JOB REQUIREMENT EXTRACTION")
print("=" * 70)

requirements = extract_job_requirements(
    job,
)

print(requirements.model_dump())