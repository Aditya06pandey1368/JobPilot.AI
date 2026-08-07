from langgraph.graph import StateGraph, START, END

from app.schemas.company_state import CompanyState
from app.services.company.collector import (
    collect_company_evidence,
)

def collect_evidence(
    state: CompanyState,
):

    evidence = collect_company_evidence(
        state["job"],
    )

    return {
        "evidence": evidence
    }

builder = StateGraph(CompanyState)
builder.add_node(
    "collect_evidence",
    collect_evidence,
)

builder.add_edge(
    START,
    "collect_evidence",
)

builder.add_edge(
    "collect_evidence",
    END,
)



company_trust_graph = builder.compile()