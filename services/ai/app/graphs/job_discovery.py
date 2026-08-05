from typing import TypedDict

from langchain_groq import ChatGroq
from langgraph.graph import END, START, StateGraph

from app.core.config import settings
from app.schemas.job_search import JobSearchIntent
from app.providers.adzuna import search_adzuna_jobs


class JobDiscoveryState(TypedDict):
    user_query: str
    search_intent: JobSearchIntent | None
    raw_jobs: list[dict]


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

async def search_jobs(
    state: JobDiscoveryState,
) -> dict:

    intent = state["search_intent"]

    if intent is None:
        return {"raw_jobs": []}

    jobs = await search_adzuna_jobs(intent)

    return {
        "raw_jobs": jobs,
    }

builder = StateGraph(JobDiscoveryState)

builder.add_node(
    "interpret_search_query",
    interpret_search_query,
)

builder.add_edge(
    START,
    "interpret_search_query",
)

builder.add_edge(
    "interpret_search_query",
    END,
)

job_discovery_graph = builder.compile()