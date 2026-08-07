from app.schemas.company_evidence import CompanyEvidence
from app.schemas.evidence import EvidenceItem
from app.schemas.evidence_source import EvidenceSource


def find_official_website(
    evidence: CompanyEvidence,
) -> CompanyEvidence:

    for item in evidence.evidence_items:

        url = item.url.lower()

        if "linkedin.com" in url:
            continue

        if "glassdoor.com" in url:
            continue

        evidence.official_website = item.url

        item.source = EvidenceSource.WEBSITE

        return evidence

    return evidence