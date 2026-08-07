from app.schemas.company_evidence import CompanyEvidence
from app.schemas.job import Job


def collect_company_evidence(
    job: Job,
) -> CompanyEvidence:

    return CompanyEvidence(
        company_name=job.company,
    )