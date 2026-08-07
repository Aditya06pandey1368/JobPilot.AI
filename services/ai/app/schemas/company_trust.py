from pydantic import BaseModel, Field


class TrustReport(BaseModel):

    trust_score: int = Field(
        ge=0,
        le=100,
    )

    recommendation: str

    summary: str

    strengths: list[str]

    red_flags: list[str]

    confidence: int = Field(
        ge=0,
        le=100,
    )