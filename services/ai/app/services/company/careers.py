from app.schemas.company_evidence import CompanyEvidence


CAREER_KEYWORDS = [
    "career",
    "careers",
    "jobs",
    "join-us",
    "joinus",
    "work-with-us",
]


def find_careers_page(
    evidence: CompanyEvidence,
) -> CompanyEvidence:

    for result in evidence.search_results:

        url = result.url.lower()

        if any(
            keyword in url
            for keyword in CAREER_KEYWORDS
        ):
            evidence.careers_page = result.url
            return evidence

    return evidence