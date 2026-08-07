from tavily import TavilyClient

from app.core.config import settings


client = TavilyClient(
    api_key=settings.tavily_api_key
)


def search_company(company: str):

    query = f"{company} official website LinkedIn careers"

    response = client.search(
        query=query,
        search_depth="advanced",
        max_results=5,
    )

    return response["results"]