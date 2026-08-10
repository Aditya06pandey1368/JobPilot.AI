from langgraph.graph import StateGraph, START, END

from app.schemas.ranking_state import RankingState

from app.services.ranking import rank_jobs


def rank_jobs_node(
    state: RankingState,
):

    ranked_jobs = rank_jobs(
        state["jobs"],
        state["resume_report"],
    )

    return {
        "ranked_jobs": ranked_jobs,
    }


builder = StateGraph(RankingState)


builder.add_node(
    "rank_jobs",
    rank_jobs_node,
)


builder.add_edge(
    START,
    "rank_jobs",
)


builder.add_edge(
    "rank_jobs",
    END,
)


ranking_graph = builder.compile()