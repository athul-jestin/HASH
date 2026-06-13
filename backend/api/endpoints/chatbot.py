from fastapi import APIRouter, HTTPException, status
from openai import OpenAI

from backend.core.config import settings
from backend.schemas.chatbot import ChatbotRequest

router = APIRouter(tags=["chatbot"])

client = OpenAI(api_key=settings.OPENAI_API_KEY)


@router.post("/chatbot")
async def chatbot_endpoint(payload: ChatbotRequest):
    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": payload.message}],
            max_tokens=100,
        )
        text = response.choices[0].message.content
        return {"replies": text}
    except Exception as exc:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(exc))
