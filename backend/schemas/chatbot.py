from pydantic import BaseModel


class ChatbotRequest(BaseModel):
    message: str


class ChatbotResponse(BaseModel):
    replies: str
