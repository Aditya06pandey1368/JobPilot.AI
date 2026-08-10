from typing import TypedDict

from app.schemas.job_relevance import AnalyzedJob
from app.schemas.job_ranking import RankedJob
from app.schemas.resume import Resume
from app.schemas.company_trust import TrustReport


class RankingState(TypedDict):

    jobs: list[AnalyzedJob]

    resume: Resume | None

    company_trust_reports: dict[str, TrustReport]

    ranked_jobs: list[RankedJob]