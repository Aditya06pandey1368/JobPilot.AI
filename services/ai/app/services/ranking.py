from app.schemas.job_relevance import AnalyzedJob
from app.schemas.job_ranking import RankedJob
from app.schemas.resume_match import ResumeMatchReport


def calculate_freshness_score(
    job,
) -> int:

    if not job.posted_at:
        return 50

    return 100

def calculate_final_score(
    relevance_score: int,
    resume_score: int,
    company_trust_score: int,
    freshness_score: int,
) -> int:

    score = (
        relevance_score * 0.35
        + resume_score * 0.35
        + company_trust_score * 0.20
        + freshness_score * 0.10
    )

    return int(score)

def rank_jobs(
    jobs: list[AnalyzedJob],
    resume_report: ResumeMatchReport | None,
) -> list[RankedJob]:

    ranked_jobs = []

    for analyzed_job in jobs:

        resume_score = (
            resume_report.overall_score
            if resume_report
            else 50
        )

        company_trust_score = 50

        freshness_score = calculate_freshness_score(
            analyzed_job.job
        )

        final_score = calculate_final_score(
            analyzed_job.relevance_score,
            resume_score,
            company_trust_score,
            freshness_score,
        )

        ranked_jobs.append(
            RankedJob(
                job=analyzed_job.job,

                relevance_score=(
                    analyzed_job.relevance_score
                ),

                resume_score=resume_score,

                company_trust_score=(
                    company_trust_score
                ),

                freshness_score=(
                    freshness_score
                ),

                final_score=final_score,

                ranking_reason=(
                    analyzed_job.relevance_reason
                ),
            )
        )

    ranked_jobs.sort(
        key=lambda job: job.final_score,
        reverse=True,
    )

    return ranked_jobs