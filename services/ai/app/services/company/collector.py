from app.schemas.company_evidence import CompanyEvidence
from app.schemas.job import Job
from app.services.company.search import search_company


def collect_company_evidence(
    job: Job,
) -> CompanyEvidence:

    evidence = CompanyEvidence(
        company_name=job.company,
    )

    evidence.search_results = search_company(
        job.company,
    )

    return evidence