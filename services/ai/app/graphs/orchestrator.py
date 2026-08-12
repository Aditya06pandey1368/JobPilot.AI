from langgraph.graph import (
    StateGraph,
    START,
    END,
)

from app.schemas.orchestrator_state import (
    OrchestratorState,
)

from app.graphs.job_ranking_pipeline import (
    job_ranking_pipeline,
)


async def rank_jobs_node(
    state: OrchestratorState,
):

    result = await job_ranking_pipeline.ainvoke({

        "user_query": state["user_query"],

        "resume": state["resume"],

        "jobs": [],

        "company_trust_reports": {},

        "ranked_jobs": [],
    })

    return {
        "ranked_jobs": result["ranked_jobs"]
    }


builder = StateGraph(
    OrchestratorState
)


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


master_orchestrator = builder.compile()