from app.schemas.job import Job
from app.services.resume.extractor import (
    extract_resume,
)
from app.services.resume.job_extractor import (
    extract_job_requirements,
)
from app.services.resume.matcher import (
    match_resume,
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

print()
print("=" * 70)
print("RESUME MATCH REPORT")
print("=" * 70)

report = match_resume(
    resume,
    requirements,
)

print(f"Overall Score     : {report.overall_score}")
print(f"Skill Score       : {report.skill_score}")
print(f"Experience Score  : {report.experience_score}")
print(f"Project Score     : {report.project_score}")
print(f"Education Score   : {report.education_score}")
print(f"ATS Score         : {report.ats_score}")

print("\nMatched Skills")
for skill in report.matched_skills:
    print(f"✓ {skill}")

print("\nMissing Skills")
for skill in report.missing_skills:
    print(f"✗ {skill}")

print("\nStrengths")
if report.strengths:
    for strength in report.strengths:
        print(f"• {strength}")
else:
    print("None")

print("\nWeaknesses")
if report.weaknesses:
    for weakness in report.weaknesses:
        print(f"• {weakness}")
else:
    print("None")

print("\nSuggestions")
if report.suggestions:
    for suggestion in report.suggestions:
        print(f"• {suggestion}")
else:
    print("None")