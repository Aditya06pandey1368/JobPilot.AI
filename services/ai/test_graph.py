import asyncio

from app.graphs.job_discovery import job_discovery_graph


async def main():
    result = await job_discovery_graph.ainvoke({
        "user_query":
            "Find software engineering internships in India "
            "posted in the last 7 days",

        "search_intent": None,
        "raw_jobs": [],
    })

    print("Intent:")
    print(result["search_intent"])

    print("\nJobs found:")
    print(len(result["raw_jobs"]))

    for job in result["raw_jobs"][:5]:
        print("\n----------------")
        print(job.get("title"))
        print(job.get("company", {}).get("display_name"))
        print(job.get("location", {}).get("display_name"))
        print(job.get("created"))
        print(job.get("redirect_url"))


asyncio.run(main())