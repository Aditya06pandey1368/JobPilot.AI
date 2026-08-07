from app.schemas.company_evidence import CompanyEvidence
from app.schemas.evidence_source import EvidenceSource

CAREER_KEYWORDS = [
    "career",
    "careers",
    "jobs",
    "join-us",
    "joinus",
]


def find_careers_page(
    evidence: CompanyEvidence,
) -> CompanyEvidence:

    for item in evidence.evidence_items:

        url = item.url.lower()

        if any(
            keyword in url
            for keyword in CAREER_KEYWORDS
        ):

            evidence.careers_page = item.url

            item.source = EvidenceSource.CAREERS

            break

    return evidence