"""
FastAPI application entry point
"""
import os
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Load environment variables immediately
load_dotenv()

from app.api.routes import pdf_routes, video_routes, ai_routes, video_data_routes, payment_routes, user_routes

# Configure logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title="PDF to Video API",
    description="API for converting PDF documents to video lectures",
    version="1.0.0"
)

# Configure CORS
cors_origins = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(pdf_routes.router)
app.include_router(video_routes.router)
app.include_router(ai_routes.router)
app.include_router(video_data_routes.router)
app.include_router(payment_routes.router, prefix="/api/payment", tags=["Payment"])
app.include_router(user_routes.router, prefix="/api/user", tags=["User"])

# Mount static files
from fastapi.staticfiles import StaticFiles
# Ensure storage directory exists
os.makedirs("storage", exist_ok=True)
app.mount("/static", StaticFiles(directory="storage"), name="static")


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "PDF to Video Conversion API",
        "version": "1.0.0",
        "docs": "/docs"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn
    host = os.getenv("API_HOST", "0.0.0.0")
    port = int(os.getenv("API_PORT", 8000))
    uvicorn.run(app, host=host, port=port)

