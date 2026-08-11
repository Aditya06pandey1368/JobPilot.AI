from app.schemas.job import Job

from app.schemas.company_trust import (
    TrustReport,
)

from app.services.company.collector import (
    collect_company_evidence,
)

from app.services.company.evaluator import (
    should_use_llm,
)

from app.services.company.deterministic_trust import (
    calculate_deterministic_trust,
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

    if should_use_llm(evidence):

        print(
            f"Using LLM analysis for "
            f"{evidence.company_name}"
        )

        return analyze_company(
            evidence
        )

    print(
        f"Using deterministic trust analysis for "
        f"{evidence.company_name}"
    )

    return calculate_deterministic_trust(
        evidence
    )