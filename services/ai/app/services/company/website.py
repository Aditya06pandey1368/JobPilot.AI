from app.schemas.company_evidence import CompanyEvidence
from app.services.company.url_utils import (
    get_domain,
    get_path,
    is_bad_domain,
)


def find_official_website(
    evidence: CompanyEvidence,
):

    best_url = None

    best_score = -1

    company = (
        evidence.company_name
        .lower()
        .replace(" ", "")
    )

    for item in evidence.evidence_items:

        if is_bad_domain(item.url):
            continue

        score = 0

        domain = get_domain(item.url)

        path = get_path(item.url)

        if company in domain.replace(".", ""):
            score += 50

        if path in ("", "/"):
            score += 100

        if len(path) < 15:
            score += 10

        if score > best_score:

            best_score = score

            best_url = item.url

    evidence.official_website = best_url

    return evidence