from app.schemas.company_evidence import (
    CompanyEvidence,
)

from app.schemas.company_trust import (
    TrustReport,
)


def calculate_deterministic_trust(
    evidence: CompanyEvidence,
) -> TrustReport:

    website_score = (
        25
        if evidence.official_website
        else 0
    )

    linkedin_score = (
        20
        if evidence.linkedin_url
        else 0
    )

    careers_score = (
        20
        if evidence.careers_page
        else 0
    )

    public_presence_score = min(
        len(evidence.evidence_items) * 5,
        20,
    )

    evidence_quality_score = 0

    for item in evidence.evidence_items:

        if item.url:
            evidence_quality_score += 2

        if item.title:
            evidence_quality_score += 1

        if item.snippet:
            evidence_quality_score += 1

    evidence_quality_score = min(
        evidence_quality_score,
        15,
    )

    trust_score = min(
        website_score
        + linkedin_score
        + careers_score
        + public_presence_score
        + evidence_quality_score,
        100,
    )

    confidence = min(
        50
        + len(evidence.evidence_items) * 5,
        95,
    )

    if trust_score >= 80:
        recommendation = "Trusted"

    elif trust_score >= 60:
        recommendation = "Mostly Trusted"

    elif trust_score >= 40:
        recommendation = "Needs Verification"

    else:
        recommendation = "Low Trust"

    strengths = []

    if evidence.official_website:
        strengths.append(
            "Professional website"
        )

    if evidence.linkedin_url:
        strengths.append(
            "Official LinkedIn presence"
        )

    if evidence.careers_page:
        strengths.append(
            "Transparent careers page"
        )

    if len(evidence.evidence_items) >= 3:
        strengths.append(
            "Strong public presence"
        )

    red_flags = []

    if not evidence.official_website:
        red_flags.append(
            "Official website could not be verified"
        )

    if not evidence.linkedin_url:
        red_flags.append(
            "Official LinkedIn presence could not be verified"
        )

    if not evidence.careers_page:
        red_flags.append(
            "Careers page could not be verified"
        )

    summary = (
        f"{evidence.company_name} has "
        f"a trust score of {trust_score} "
        f"based on publicly available evidence."
    )

    reasoning = (
        "The trust score was calculated "
        "using verified company presence "
        "and collected public evidence. "
        "No LLM analysis was required."
    )

    return TrustReport(

        trust_score=trust_score,

        confidence=confidence,

        recommendation=recommendation,

        website_score=website_score,

        linkedin_score=linkedin_score,

        careers_score=careers_score,

        public_presence_score=(
            public_presence_score
        ),

        evidence_quality_score=(
            evidence_quality_score
        ),

        strengths=strengths,

        red_flags=red_flags,

        summary=summary,

        reasoning=reasoning,
    )