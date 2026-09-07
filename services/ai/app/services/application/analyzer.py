from langchain_groq import ChatGroq
from langchain_core.output_parsers import PydanticOutputParser # <-- NEW IMPORT

from app.core.config import settings
from app.schemas.job import Job
from app.schemas.resume import Resume
from app.schemas.application import ApplicationAnalysis

model = ChatGroq(
    model="openai/gpt-oss-120b",
    api_key=settings.groq_api_key,
    temperature=0,
)

# 1. Create a parser specifically for your ApplicationAnalysis schema
parser = PydanticOutputParser(pydantic_object=ApplicationAnalysis)

def analyze_application(
    job: Job,
    resume: Resume,
) -> ApplicationAnalysis:

    safe_description = job.description[:2500] if job.description else ""

    prompt = f"""
You are an expert job application advisor.
Analyze how well this candidate fits the specific job.

JOB
Title: {job.title}
Company: {job.company}
Description: {safe_description}

RESUME
Name: {resume.name}
Summary: {resume.summary}
Skills: {", ".join(resume.skills)}
Projects: {", ".join(resume.projects)}
Experience: {", ".join(resume.experience)}
Education: {", ".join(resume.education)}

STRICT RULES
- Never invent experience, skills, projects, or achievements.
- Missing skills should be reported honestly.
- Keep recommendations practical and honest.

{parser.get_format_instructions()} 
"""
    # Notice we injected the format_instructions right at the end of the prompt!

    # 2. Invoke the standard model (not structured output)
    response = model.invoke(prompt)
    
    # 3. Parse the raw JSON string perfectly back into your Pydantic model
    return parser.invoke(response)