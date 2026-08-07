from pydantic import BaseModel


class CompanyEvidence(BaseModel):

    company_name: str

    official_website: str | None = None

    careers_page: str | None = None

    linkedin_url: str | None = None

    news: list[str] = []

    reddit: list[str] = []

    glassdoor: list[str] = []

    missing_information: list[str] = []