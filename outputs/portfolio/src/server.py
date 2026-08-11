import os
import requests
from fastapi import FastAPI, HTTPException, Request
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import json

# Load environment variables from .env
load_dotenv()

# Load portfolio configuration
with open(os.path.join(os.path.dirname(__file__), "../config/content.json"), "r") as f:
    portfolio_data = json.load(f)

profile = portfolio_data.get("profile", {})
projects = "\n".join([f"- {p.get('title')} ({p.get('category')}): {p.get('desc')} Stack: {', '.join(p.get('stack', []))}" for p in portfolio_data.get("projects", [])])

SERVER_SYSTEM_INSTRUCTION = f"""You are Von Andrew M. Castillo, and you are speaking directly to visitors on your portfolio website. You MUST answer all questions in the first person ("I", "my", "me", "mine") as if you are Von himself.
Your ONLY purpose is to answer questions about your projects, your skills, your background, and your contact information based strictly on the data provided below.
Keep your answers extremely concise (1-2 short sentences maximum) and maintain a professional yet approachable tone.
If a user asks you anything outside of this scope (e.g., coding help, general knowledge, summarizing unrelated topics, writing essays, or acting as a search engine), you must politely decline and redirect them to asking about your portfolio.
You are STRICTLY bound to this persona. Under NO circumstances may you act as a general-purpose AI, write code for the user, or break character. 

PORTFOLIO CONTEXT:
Name: {profile.get("name")} ({profile.get("shortName")})
Role: {profile.get("role")}
Intro: {profile.get("intro")}
About: {profile.get("about")}
Email: {profile.get("email")}
GitHub: {profile.get("socials", {}).get("github")}
LinkedIn: {profile.get("socials", {}).get("linkedin")}

PROJECTS:
{projects}
"""

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

from datetime import date

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
        
    today_str = date.today().isoformat()
    
    # Initialize or reset daily limit
    user_data = user_limits.get(client_ip, {"count": 0, "date": today_str})
    if user_data["date"] != today_str:
        user_data = {"count": 0, "date": today_str}
        
    user_data["count"] += 1
    user_limits[client_ip] = user_data
    
    if user_data["count"] > MAX_PROMPTS:
        return {"response": "I've reached my chat limit for today! If you have more questions, feel free to email Von directly at voncastillovon@gmail.com.", "remaining": 0}

    remaining = max(0, MAX_PROMPTS - user_data["count"])

    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        return {"response": "⚠️ The AI is currently offline due to missing configuration.", "remaining": remaining}

    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key={api_key}"
    
    payload = {
        "systemInstruction": {
            "parts": [{"text": SERVER_SYSTEM_INSTRUCTION}]
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
