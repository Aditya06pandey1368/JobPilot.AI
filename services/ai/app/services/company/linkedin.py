from app.schemas.company_evidence import CompanyEvidence


def find_linkedin(
    evidence: CompanyEvidence,
) -> CompanyEvidence:

    for result in evidence.search_results:

        url = result.url.lower()

        if "linkedin.com/company/" in url:

            evidence.linkedin_url = result.url
            break

    return evidence