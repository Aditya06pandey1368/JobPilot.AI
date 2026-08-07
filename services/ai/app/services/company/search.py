from tavily import TavilyClient

from app.core.config import settings
from app.schemas.company_evidence import SearchResult


client = TavilyClient(
    api_key=settings.tavily_api_key
)


def search_company(
    company: str,
) -> list[SearchResult]:

    response = client.search(
        query=f"{company} company official website linkedin careers",
        search_depth="advanced",
        max_results=8,
    )

    results = []

    for item in response["results"]:

        results.append(
            SearchResult(
                title=item["title"],
                url=item["url"],
                content=item["content"],
            )
        )

    return results