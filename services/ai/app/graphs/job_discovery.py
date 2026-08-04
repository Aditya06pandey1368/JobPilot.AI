from typing import TypedDict

from langchain_groq import ChatGroq
from langgraph.graph import END, START, StateGraph

from app.core.config import settings
from app.schemas.job_search import JobSearchIntent


class JobDiscoveryState(TypedDict):
    user_query: str
    search_intent: JobSearchIntent | None


model = ChatGroq(
    model="llama-3.3-70b-versatile",
    api_key=settings.groq_api_key,
    temperature=0,
)

intent_model = model.with_structured_output(JobSearchIntent)