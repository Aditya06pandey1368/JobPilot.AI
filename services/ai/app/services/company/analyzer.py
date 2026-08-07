from langchain_groq import ChatGroq

from app.core.config import settings
from app.schemas.company_evidence import CompanyEvidence
from app.schemas.company_trust import TrustReport


model = ChatGroq(
    model="llama-3.3-70b-versatile",
    api_key=settings.groq_api_key,
    temperature=0,
)

trust_model = model.with_structured_output(
    TrustReport
)


def analyze_company(
    evidence: CompanyEvidence,
) -> TrustReport:

    prompt = f"""
You are an expert company due-diligence AI.

Your job is to determine how trustworthy a company is based ONLY on the evidence provided.

Company Name:
{evidence.company_name}

Official Website:
{evidence.official_website}

Official LinkedIn:
{evidence.linkedin_url}

Careers Page:
{evidence.careers_page}

-------------------------
COLLECTED EVIDENCE
-------------------------
"""

    for item in evidence.evidence_items:

        prompt += f"""
Source: {item.source}

Title:
{item.title}

URL:
{item.url}

Snippet:
{item.snippet}

------------------------------------
"""

    prompt += """
Evaluate the company objectively.

Return a valid TrustReport.

Scoring Rules:

Website Score (0-25)
- Official company website
- Correct domain
- Professional website

LinkedIn Score (0-20)
- Official LinkedIn company page
- Company profile quality

Careers Score (0-20)
- Official careers page
- Active hiring
- Recruitment information

Public Presence Score (0-20)
- Company visibility
- Public reputation
- Company size
- Industry presence

Evidence Quality Score (0-15)
- Amount of evidence
- Consistency between sources
- Reliability of evidence

Important Rules:

- Never invent information.
- Never assume missing information.
- If evidence is missing, reduce confidence.
- Mention every strength.
- Mention every red flag.
- Explain why each score was assigned.
- The final trust_score must be based on all category scores.
"""

    return trust_model.invoke(prompt)