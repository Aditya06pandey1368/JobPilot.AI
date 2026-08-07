from pydantic import BaseModel, Field


class TrustReport(BaseModel):

    trust_score: int = Field(
        ge=0,
        le=100,
    )

    confidence: int = Field(
        ge=0,
        le=100,
    )

    recommendation: str

    summary: str

    strengths: list[str] = Field(default_factory=list)

    red_flags: list[str] = Field(default_factory=list)