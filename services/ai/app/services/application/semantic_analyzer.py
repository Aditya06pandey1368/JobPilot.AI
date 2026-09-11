from langchain_groq import ChatGroq
from pydantic import BaseModel, Field
from typing import List, Optional
from app.core.config import settings

class RequirementMatch(BaseModel):
    requirement: str
    match_status: str = Field(description="Must be one of: ✅ Direct Match, 🟢 Strong Inference, 🟡 Partial Match, ⚠️ Missing Evidence, ❌ Not a Match")
    evidence_found: Optional[str] = None

class SemanticAnalysisReport(BaseModel):
    overall_fit_score: int = Field(description="Score out of 100")
    recommendation: str = Field(description="Strong Fit / Good Fit / Partial Fit / Poor Fit")
    requirements_breakdown: List[RequirementMatch]
    missing_skills: List[str]
    red_flags: List[str]
    strongest_evidence: List[str]
    cover_letter_points: List[str]
    interview_questions: List[str]

model = ChatGroq(
    model="openai/gpt-oss-120b",
    api_key=settings.groq_api_key,
    temperature=0,
)

semantic_model = model.with_structured_output(SemanticAnalysisReport)

def analyze_resume_semantic(resume_text: str, job_description: str, company_name: str) -> SemanticAnalysisReport:
    prompt = f"""
You are an advanced technical recruiter and semantic career strategist.
Analyze the candidate's resume against the Job Description (JD) for {company_name}.

Do not use simple keyword matching. Look for semantic relevance (e.g., if JD asks for 'scalable backend' and resume shows 'Spring Boot e-commerce handling orders', recognize it as relevant).

Evaluate the following categories across 12 distinct parameters:
- Overall Fit Score, Experience Match, Technical Skills Match, Missing Skills, Nice-to-Haves, Education, Projects, Keywords, Responsibilities, Eligibility, Red Flags, and Application Recommendation.

Classify every explicit and implicit JD requirement into one of these types:
- ✅ Direct Match
- 🟢 Strong Inference
- 🟡 Partial Match
- ⚠️ Missing Evidence
- ❌ Not a Match

RESUME:
{resume_text}

JOB DESCRIPTION:
{job_description}
"""

    return semantic_model.invoke(prompt)