from langchain_groq import ChatGroq

from app.core.config import settings
from app.schemas.company_evidence import CompanyEvidence
from app.schemas.company_trust import TrustReport

from app.services.company.trust_calculator import (
    calculate_confidence,
    calculate_recommendation,
    calculate_trust_score,
)

model = ChatGroq(
    model="llama-3.3-70b-versatile",
    api_key=settings.groq_api_key,
    temperature=0,
)

# This is REQUIRED
trust_model = model.with_structured_output(
    TrustReport
)


def analyze_company(
    evidence: CompanyEvidence,
) -> TrustReport:

    prompt = f"""
    ...
    """

    return trust_model.invoke(prompt)

def analyze_company(
    evidence: CompanyEvidence,
) -> TrustReport:

    prompt = f"""
You are a senior cybersecurity analyst and company due-diligence expert.

Your task is to evaluate how trustworthy a company is.

Use ONLY the supplied evidence.

Never invent facts.

==================================================
COMPANY
==================================================

Company:
{evidence.company_name}

Official Website:
{evidence.official_website}

LinkedIn:
{evidence.linkedin_url}

Careers:
{evidence.careers_page}

==================================================
COLLECTED EVIDENCE
==================================================

"""

    for item in evidence.evidence_items:

        prompt += f"""
Source:
{item.source}

Title:
{item.title}

URL:
{item.url}

Snippet:
{item.snippet}

--------------------------------------------------

"""

    prompt += """
Return a TrustReport.

The TrustReport MUST contain:

trust_score

confidence

breakdown

recommendation

summary

strengths

red_flags

reasoning

==================================================
BREAKDOWN
==================================================

Website Score (0-25)

Evaluate

- Official company domain
- Professional website
- Company identity

--------------------------------------------------

LinkedIn Score (0-20)

Evaluate

- Official company page
- Company information
- Company size

--------------------------------------------------

Careers Score (0-20)

Evaluate

- Official careers page
- Hiring information
- Recruitment transparency

--------------------------------------------------

Public Presence Score (0-20)

Evaluate

- Public visibility
- Industry reputation
- Online presence

--------------------------------------------------

Evidence Quality Score (0-15)

Evaluate

- Quantity of evidence
- Reliability
- Consistency
- Confidence

==================================================

Rules

1. Never guess.

2. Missing evidence should reduce confidence.

3. Explain every important strength.

4. Explain every important red flag.

5. The total trust_score must equal the sum of the five category scores.

6. recommendation should be one of

- Trusted
- Mostly Trusted
- Use Caution
- Suspicious
- High Risk

7. Keep the reasoning concise but specific.
"""

    report = trust_model.invoke(prompt)

    report = calculate_trust_score(
        report,
    )

    report = calculate_recommendation(
        report,
    )

    report = calculate_confidence(
        report,
        evidence,
    )

    return report
