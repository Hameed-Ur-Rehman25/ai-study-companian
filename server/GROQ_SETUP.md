# Switching to Groq API - Quick Guide

## Why Groq?

Your Gemini API has reached its rate limit quota. Groq offers:
- ✅ Free tier with generous limits
- ✅ Very fast inference (faster than Gemini!)
- ✅ Uses qwen3-32b model (powerful open-source LLM)
- ✅ No credit card required for free tier

## Getting Your Groq API Key

1. **Go to Groq Console**: https://console.groq.com
2. **Sign up / Log in** (free account)
3. **Navigate to API Keys**: https://console.groq.com/keys
4. **Create New API Key**
5. **Copy the key** (starts with `gsk_...`)

## Setup Instructions

### Step 1: Add API Key to .env

Open `server/.env` and add:

```bash
GROQ_API_KEY=your_groq_api_key_here
```

Your `.env` file should look like:

```bash
API_HOST=0.0.0.0
API_PORT=8000
CORS_ORIGINS=http://localhost:3000
GOOGLE_API_KEY=AIzaSyBKLG9QVRmGcP0xe4N7p10ignZT51MGPiE
GROQ_API_KEY=gsk_your_actual_key_here
```

### Step 2: Restart the Server

```bash
# Stop the current server (Ctrl+C)
# Then restart it
cd server
venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000
```

### Step 3: Test It

```bash
cd server
venv/bin/python test_groq.py
```

You should see:
```
✅ ALL TESTS PASSED! Groq API is ready to use.
```

## What's Already Configured

✅ Groq package installed
✅ `GroqService` created with qwen3-32b model  
✅ API routes updated to use Groq
✅ Chunking integration ready
✅ Chat history working

**You just need to add the API key and restart the server!**

## Free Tier Limits

Groq free tier includes:
- **14,400 requests per day**
- **1,000,000 tokens per day**
- **30 requests per minute**

More than enough for your AI Study Companion! 🎉

## Alternative: Use Groq with Default Credentials

If Groq allows default credentials based on system environment, you can also try:
```bash
export GROQ_API_KEY="your_key"
```

Then run the server from the same terminal session.

## Switching Back to Gemini Later

If you want to switch back to Gemini when your quota resets:

1. Open `server/app/api/routes/ai_routes.py`
2. Change line 10: `from app.services.groq_service import GroqService`
   To: `from app.services.gemini_service import GeminiService`
3. Change line 28-30:
   ```python
   def get_ai_service():
       """Get AI service (using Gemini)"""
       return GeminiService()
   ```
4. Restart server

Both services are maintained in your codebase!
