from typing import TypedDict

from app.schemas.job_relevance import AnalyzedJob
from app.schemas.job_ranking import RankedJob
from app.schemas.resume import Resume


class RankingState(TypedDict):

    jobs: list[AnalyzedJob]

    resume: Resume | None

    ranked_jobs: list[RankedJob]