from pydantic import BaseModel, Field


class SearchResult(BaseModel):
    title: str
    url: str
    content: str


class CompanyEvidence(BaseModel):

    company_name: str

    search_results: list[SearchResult] = Field(default_factory=list)

    official_website: str | None = None

    linkedin_url: str |None = None

    careers_page: str | None = None

    news: list[str] = Field(default_factory=list)

    reddit: list[str] = Field(default_factory=list)

    glassdoor: list[str] = Field(default_factory=list)