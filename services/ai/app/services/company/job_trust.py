from app.schemas.job import Job
from app.schemas.company_trust import TrustReport

from app.services.company.collector import (
    collect_company_evidence,
)

from app.services.company.analyzer import (
    analyze_company,
)


def get_company_trust(
    job: Job,
) -> TrustReport:

    evidence = collect_company_evidence(
        job
    )

    report = analyze_company(
        evidence
    )

    return report