#!/bin/bash
# Quick restart script for the server

echo "🔄 Restarting AI Study Companion Server..."
echo ""

# Kill any existing uvicorn process
pkill -f "uvicorn app.main:app" 2>/dev/null

# Wait a moment
sleep 1

# Start the server
echo "🚀 Starting server with Groq API..."
venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000
