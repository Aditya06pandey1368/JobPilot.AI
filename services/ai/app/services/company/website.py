from app.schemas.company_evidence import CompanyEvidence
from app.services.company.search import search_company


def find_official_website(
    evidence: CompanyEvidence,
) -> CompanyEvidence:

    results = search_company(
        evidence.company_name
    )

    for result in results:

        url = result["url"].lower()

        if "linkedin.com" in url:
            continue

        evidence.official_website = result["url"]
        break

    return evidence