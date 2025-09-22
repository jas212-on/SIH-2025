# server.py
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from graphrag import graphrag_chatbot

# Define input format
class ChatRequest(BaseModel):
    query: str
    role: str = "general"
    debug: bool = False

# Initialize app
app = FastAPI()

# Allow frontend (React) to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # ⚠️ for dev only, restrict in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/chat")
async def chat_endpoint(request: ChatRequest):
    result = graphrag_chatbot(request.query, role=request.role, debug_mode=request.debug)
    return result
