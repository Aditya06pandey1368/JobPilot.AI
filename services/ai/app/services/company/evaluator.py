from app.schemas.company_evidence import CompanyEvidence


def has_enough_evidence(
    evidence: CompanyEvidence,
) -> bool:

    score = 0

    if evidence.official_website:
        score += 1

    if evidence.linkedin_url:
        score += 1

    if evidence.careers_page:
        score += 1

    return score >= 2