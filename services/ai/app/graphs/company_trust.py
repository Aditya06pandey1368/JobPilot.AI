from langgraph.graph import StateGraph, START, END

from app.schemas.company_state import CompanyState
from app.services.company.collector import (
    collect_company_evidence,
)
from app.services.company.website import (
    find_official_website,
)
from app.services.company.linkedin import find_linkedin
from app.services.company.careers import (
    find_careers_page,
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

def collect_website(
    state: CompanyState,
):

    evidence = find_official_website(
        state["evidence"],
    )

    return {
        "evidence": evidence
    }

def collect_linkedin(
    state: CompanyState,
):

    evidence = find_linkedin(
        state["evidence"],
    )

    return {
        "evidence": evidence
    }

def collect_careers(
    state: CompanyState,
):

    evidence = find_careers_page(
        state["evidence"],
    )

    return {
        "evidence": evidence
    }

builder = StateGraph(CompanyState)

builder.add_node(
    "collect_evidence",
    collect_evidence,
)

builder.add_node(
    "collect_website",
    collect_website,
)

builder.add_node(
    "collect_linkedin",
    collect_linkedin,
)

builder.add_node(
    "collect_careers",
    collect_careers,
)

builder.add_edge(
    START,
    "collect_evidence",
)

builder.add_edge(
    "collect_evidence",
    "collect_website",
)

builder.add_edge(
    "collect_website",
    "collect_linkedin",
)

builder.add_edge(
    "collect_linkedin",
    "collect_careers",
)

builder.add_edge(
    "collect_careers",
    END,
)

company_trust_graph = builder.compile()