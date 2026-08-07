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
You are a company verification expert.

Evaluate the trustworthiness of this company.

Company:

{evidence.company_name}

Official Website:

{evidence.official_website}

LinkedIn:

{evidence.linkedin_url}

Careers Page:

{evidence.careers_page}

Evidence:

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

"""

    prompt += """

Return an objective assessment.

Guidelines:

- Official website increases trust.
- Official LinkedIn page increases trust.
- Careers page increases trust.
- Missing evidence lowers confidence.
- Mention strengths.
- Mention risks.
- Never guess.
"""

    return trust_model.invoke(prompt)