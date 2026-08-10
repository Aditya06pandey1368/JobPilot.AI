import asyncio

from app.graphs.job_ranking_pipeline import (
    job_ranking_pipeline,
)

from app.schemas.resume import Resume


resume = Resume(
    name="Aditya Pandey",

    email="aditya@gmail.com",

    phone="+91 9876543210",

    linkedin="https://linkedin.com/in/aditya",

    github="https://github.com/aditya06",

    portfolio=None,

    summary=(
        "Final year Computer Science student "
        "passionate about Full Stack Development "
        "and Agentic AI."
    ),

    skills=[
        "Java",
        "Python",
        "JavaScript",
        "TypeScript",
        "React",
        "Next.js",
        "Node.js",
        "Express.js",
        "MongoDB",
        "LangChain",
        "LangGraph",
        "Git",
        "Docker",
    ],

    projects=[
        "JobPilot.AI",
        "ScholarHub LMS",
        "GamingArena",
    ],

    experience=[
        "Full Stack Developer Intern at ABC Technologies"
    ],

    education=[
        "B.Tech Computer Science"
    ],

    certifications=[
        "IBM Git & GitHub"
    ],
)


async def main():

    result = await job_ranking_pipeline.ainvoke({

        "user_query": (
            "Find software engineering internships "
            "in India posted in the last 7 days"
        ),

        "jobs": [],

        "resume": resume,

        "company_trust_reports": {},

        "ranked_jobs": [],

    })


    print("=" * 70)
    print("JOBPILOT.AI - REAL JOB RANKING PIPELINE")
    print("=" * 70)


    ranked_jobs = result["ranked_jobs"]


    print(
        f"\nTotal Ranked Jobs: "
        f"{len(ranked_jobs)}"
    )


    for index, ranked in enumerate(
        ranked_jobs[:20],
        start=1,
    ):

        print(f"\n#{index}")

        print(
            f"Job: {ranked.job.title}"
        )

        print(
            f"Company: "
            f"{ranked.job.company}"
        )

        print(
            f"Location: "
            f"{ranked.job.location}"
        )

        print(
            f"Relevance: "
            f"{ranked.relevance_score}"
        )

        print(
            f"Resume Match: "
            f"{ranked.resume_score}"
        )

        print(
            f"Company Trust: "
            f"{ranked.company_trust_score}"
        )

        print(
            f"Freshness: "
            f"{ranked.freshness_score}"
        )

        print(
            f"Final Score: "
            f"{ranked.final_score}"
        )

        print(
            f"Reason: "
            f"{ranked.ranking_reason}"
        )


if __name__ == "__main__":
    asyncio.run(main())