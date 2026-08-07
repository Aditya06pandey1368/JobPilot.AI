from app.schemas.company_evidence import CompanyEvidence
from app.schemas.evidence_source import EvidenceSource

def find_linkedin(
    evidence: CompanyEvidence,
) -> CompanyEvidence:

    for item in evidence.evidence_items:

        if "linkedin.com/company/" in item.url.lower():

            evidence.linkedin_url = item.url

            item.source = EvidenceSource.LINKEDIN

            break

    return evidence