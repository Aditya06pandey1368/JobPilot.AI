from langgraph.graph import StateGraph, START, END

from app.schemas.ranking_state import RankingState

from app.graphs.job_discovery import (
    job_discovery_graph,
)

from app.services.company.job_trust import (
    get_company_trust,
)

from app.services.ranking import (
    rank_jobs,
)


async def discover_jobs_node(
    state: RankingState,
):

    result = await job_discovery_graph.ainvoke({

        "user_query": state["user_query"],

        "search_intent": None,

        "adzuna_jobs": [],

        "greenhouse_jobs": [],

        "jobs": [],

        "filtered_jobs": [],

        "relevant_jobs": [],
    })

    return {
        "jobs": result["relevant_jobs"]
    }


def collect_company_trust_node(
    state: RankingState,
):

    reports = {}

    for analyzed_job in state["jobs"]:

        company = analyzed_job.job.company

        if company in reports:
            continue

        print(
            f"Collecting trust evidence: {company}"
        )

        try:

            reports[company] = get_company_trust(
                analyzed_job.job
            )

        except Exception as e:

            print(
                f"Trust analysis failed for "
                f"{company}: {e}"
            )

            print(
                f"Using fallback trust score "
                f"for {company}"
            )

            reports[company] = None

    return {
        "company_trust_reports": reports
    }


def rank_jobs_node(
    state: RankingState,
):

    ranked_jobs = rank_jobs(
        state["jobs"],
        state["resume"],
        state["company_trust_reports"],
    )

    return {
        "ranked_jobs": ranked_jobs
    }


builder = StateGraph(
    RankingState
)


builder.add_node(
    "discover_jobs",
    discover_jobs_node,
)

builder.add_node(
    "collect_company_trust",
    collect_company_trust_node,
)

builder.add_node(
    "rank_jobs",
    rank_jobs_node,
)


builder.add_edge(
    START,
    "discover_jobs",
)

builder.add_edge(
    "discover_jobs",
    "collect_company_trust",
)

builder.add_edge(
    "collect_company_trust",
    "rank_jobs",
)

builder.add_edge(
    "rank_jobs",
    END,
)


job_ranking_pipeline = builder.compile()