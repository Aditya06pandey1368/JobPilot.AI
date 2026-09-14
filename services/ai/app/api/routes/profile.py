from fastapi import APIRouter, UploadFile, File, Depends, HTTPException, Request
from bson import ObjectId
import PyPDF2
import io
from app.api.dependencies import get_current_user
from app.core.config import settings
from langchain_groq import ChatGroq

router = APIRouter(prefix="/profile", tags=["Profile"])

# Removed with_structured_output and Pydantic! Just a fast, standard LLM.
# Changed the model to one we know your API key supports!
extraction_model = ChatGroq(
    model="openai/gpt-oss-20b", 
    api_key=settings.groq_api_key, 
    temperature=0
)
@router.post("/upload-resume")
async def upload_resume(request: Request, file: UploadFile = File(...), user=Depends(get_current_user)):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed.")

    # 1. Read the PDF Text
    try:
        contents = await file.read()
        pdf_reader = PyPDF2.PdfReader(io.BytesIO(contents))
        resume_text = ""
        for page in pdf_reader.pages:
            resume_text += page.extract_text() + "\n"
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to read PDF.")

    if len(resume_text.strip()) < 50:
        raise HTTPException(status_code=400, detail="PDF appears to be empty or unreadable.")

    # 2. Extract Skills using a strict text prompt
    prompt = f"Extract all technical, soft, and professional skills from this resume. Return ONLY a single comma-separated list of skills. Do not include introductory text, bullet points, or any other formatting.\n\nRESUME:\n{resume_text}"
    
    # Get the raw text content directly
    response = extraction_model.invoke(prompt)
    skills_text = response.content.strip()

    # (Optional) Clean up in case the LLM stubbornly adds "Here are your skills: "
    if ":" in skills_text and len(skills_text.split(":")[0]) < 25:
        skills_text = skills_text.split(":")[-1].strip()

    # 3. Save BOTH to MongoDB
    database = request.app.state.database
    user_id = ObjectId(str(user.get("_id") or user.get("id")))
    
    await database["users"].update_one(
        {"_id": user_id},
        {"$set": {
            "resume_text": resume_text.strip(),
            "skills": skills_text
        }}
    )

    return {
        "success": True,
        "message": "Resume processed successfully",
        "skills": skills_text,
        "resume_text": resume_text.strip()
    }