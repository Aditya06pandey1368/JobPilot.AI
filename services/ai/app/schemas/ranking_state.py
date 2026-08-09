from typing import TypedDict

from app.schemas.job import Job
from app.schemas.job_relevance import AnalyzedJob
from app.schemas.job_ranking import RankedJob
from app.schemas.resume_match import ResumeMatchReport


class RankingState(TypedDict):

    jobs: list[AnalyzedJob]

    resume_report: ResumeMatchReport | None

    ranked_jobs: list[RankedJob]