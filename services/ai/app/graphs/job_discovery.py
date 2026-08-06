from typing import TypedDict

from langchain_groq import ChatGroq
from langgraph.graph import END, START, StateGraph

from app.core.config import settings
from app.schemas.job_search import JobSearchIntent
from app.providers.adzuna import search_adzuna_jobs
from app.schemas.job import Job
from app.providers.greenhouse import search_greenhouse_jobs
from app.services.job_filter import filter_jobs
from app.schemas.job_relevance import AnalyzedJob
from app.services.job_relevance import analyze_job_relevance


class JobDiscoveryState(TypedDict):
    user_query: str
    search_intent: JobSearchIntent | None

    adzuna_jobs: list[Job]
    greenhouse_jobs: list[Job]

    jobs: list[Job]
    filtered_jobs: list[Job]

    relevant_jobs: list[AnalyzedJob]


model = ChatGroq(
    model="llama-3.3-70b-versatile",
    api_key=settings.groq_api_key,
    temperature=0,
)

intent_model = model.with_structured_output(JobSearchIntent)

def interpret_search_query(
    state: JobDiscoveryState,
) -> dict:
    prompt = f"""
    You extract structured job-search requirements for JobPilot.AI.

    The platform currently searches jobs across India.

    Interpret the user's request.

    Rules:
    - Do not invent locations.
    - If no location is provided, use ["India"].
    - If job type is not specified, use "any".
    - If freshness is not specified, use 7 days.
    - Remote jobs are allowed only when the user explicitly requests
    remote jobs or says remote jobs are acceptable.

    User request:
    {state["user_query"]}
    """

    intent = intent_model.invoke(prompt)

    return {
        "search_intent": intent,
    }

async def search_adzuna(
    state: JobDiscoveryState,
) -> dict:

    intent = state["search_intent"]

    if intent is None:
        return {"adzuna_jobs": []}

    jobs = await search_adzuna_jobs(intent)

    return {
        "adzuna_jobs": jobs,
    }

async def search_greenhouse(
    state: JobDiscoveryState,
) -> dict:

    intent = state["search_intent"]

    if intent is None:
        return {"greenhouse_jobs": []}

    jobs = await search_greenhouse_jobs(intent)

    return {
        "greenhouse_jobs": jobs,
    }

def merge_jobs(
    state: JobDiscoveryState,
) -> dict:

    jobs = (
        state["adzuna_jobs"]
        + state["greenhouse_jobs"]
    )

    return {
        "jobs": jobs,
    }

def filter_discovered_jobs(
    state: JobDiscoveryState,
) -> dict:

    intent = state["search_intent"]

    if intent is None:
        return {
            "filtered_jobs": []
        }

    filtered = filter_jobs(
        state["jobs"],
        intent,
    )

    return {
        "filtered_jobs": filtered,
    }

def analyze_relevance(
    state: JobDiscoveryState,
) -> dict:

    intent = state["search_intent"]

    if intent is None:
        return {
            "relevant_jobs": []
        }

    relevant_jobs = analyze_job_relevance(
        state["filtered_jobs"],
        intent,
    )

    return {
        "relevant_jobs": relevant_jobs
    }

builder = StateGraph(JobDiscoveryState)

builder.add_node(
    "interpret_search_query",
    interpret_search_query,
)

builder.add_node(
    "search_adzuna",
    search_adzuna,
)

builder.add_node(
    "search_greenhouse",
    search_greenhouse,
)

builder.add_node(
    "merge_jobs",
    merge_jobs,
)

builder.add_node(
    "filter_jobs",
    filter_discovered_jobs,
)

builder.add_node(
    "analyze_relevance",
    analyze_relevance,
)

#EDGES


builder.add_edge(
    START,
    "interpret_search_query",
)

# FAN OUT
builder.add_edge(
    "interpret_search_query",
    "search_adzuna",
)

builder.add_edge(
    "interpret_search_query",
    "search_greenhouse",
)

# FAN IN
builder.add_edge(
    "search_adzuna",
    "merge_jobs",
)

builder.add_edge(
    "search_greenhouse",
    "merge_jobs",
)

builder.add_edge(
    "merge_jobs",
    "filter_jobs",
)

builder.add_edge(
    "filter_jobs",
    "analyze_relevance",
)

builder.add_edge(
    "analyze_relevance",
    END,
)

job_discovery_graph = builder.compile()
