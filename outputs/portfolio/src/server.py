import os
import requests
from fastapi import FastAPI, HTTPException, Request
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    userMessage: str
    history: list
    systemInstruction: str

# In-memory store for basic rate limiting
user_limits = {}
MAX_PROMPTS = 5

@app.post("/api/chat")
async def chat(request_data: ChatRequest, request: Request):
    # 1. Simple Rate Limiting by IP
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        client_ip = forwarded.split(",")[0].strip()
    else:
        client_ip = request.client.host if request.client else "unknown"
        
    user_limits[client_ip] = user_limits.get(client_ip, 0) + 1
    
    if user_limits[client_ip] > MAX_PROMPTS:
        return {"response": "I've reached my chat limit for this session! If you have more questions, feel free to email Von directly at voncastillovon@gmail.com.", "remaining": 0}

    remaining = max(0, MAX_PROMPTS - user_limits[client_ip])

    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        return {"response": "⚠️ The AI is currently offline due to missing configuration.", "remaining": remaining}

    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key={api_key}"
    
    payload = {
        "systemInstruction": {
            "parts": [{"text": request_data.systemInstruction}]
        },
        "contents": request_data.history + [{"role": "user", "parts": [{"text": request_data.userMessage}]}],
        "generationConfig": {
            "temperature": 0.3,
            "maxOutputTokens": 80  # Reduced to save tokens
        }
    }

    try:
        response = requests.post(url, json=payload, headers={"Content-Type": "application/json"})
        response.raise_for_status()
        data = response.json()
        ai_text = data["candidates"][0]["content"]["parts"][0]["text"]
        return {"response": ai_text, "remaining": remaining}
    except requests.exceptions.HTTPError as e:
        # Gracefully handle quota exhaustion (429 Too Many Requests or 403/400 Quota Exceeded)
        if e.response.status_code in [429, 403, 400]:
            return {"response": "My API tokens are currently exhausted for the day! Please check back later, or send Von an email.", "remaining": remaining}
        print("Gemini API HTTP Error:", e.response.text)
        return {"response": "Sorry, my brain is offline right now. Please try again later.", "remaining": remaining}
    except Exception as e:
        print("Gemini API Error:", e)
        return {"response": "Sorry, I encountered an unexpected error.", "remaining": remaining}

# Mount the static files
# Note: The order matters. We want to serve 'public' as the root.
app.mount("/src", StaticFiles(directory="src"), name="src")
app.mount("/config", StaticFiles(directory="config"), name="config")
app.mount("/", StaticFiles(directory="public", html=True), name="public")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("src.server:app", host="0.0.0.0", port=8000, reload=True)
