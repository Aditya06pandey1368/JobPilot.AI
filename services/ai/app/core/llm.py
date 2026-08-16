import asyncio

from langchain_groq import ChatGroq

from app.core.config import settings


_llm_semaphore = asyncio.Semaphore(2)


model = ChatGroq(
    model="llama-3.3-70b-versatile",
    api_key=settings.groq_api_key,
    temperature=0,
)


async def invoke_llm(
    runnable,
    prompt,
):

    async with _llm_semaphore:

        return await runnable.ainvoke(
            prompt
        )