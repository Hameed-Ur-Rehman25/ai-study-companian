# Setup Guide for PDF to Video Backend

## Prerequisites

- Python 3.10 or higher
- FFmpeg (Required for video processing)
- Groq API Key (for LLM script generation)

## Step 1: Create Virtual Environment

### Option A: Using the setup script (Recommended)

```bash
cd server
chmod +x setup.sh
./setup.sh
```

### Option B: Manual setup

```bash
cd server

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate

# On Windows:
# venv\Scripts\activate

# Install dependencies
pip install --upgrade pip
pip install -r requirements.txt
```

## Step 2: Configure Environment Variables

1.  Create a `.env` file in the `server` directory.
2.  Add the following configuration:

```env
# AI Configuration
GROQ_API_KEY=your_groq_api_key_here

# Server Configuration
MAX_FILE_SIZE=52428800
VIDEO_OUTPUT_FORMAT=mp4
STORAGE_BACKEND=local

# API Configuration
API_HOST=0.0.0.0
API_PORT=8000
CORS_ORIGINS=http://localhost:3000

# File Storage
UPLOAD_DIR=./storage/uploads
OUTPUT_DIR=./storage/outputs
TEMP_DIR=./storage/temp
```

## Step 3: Install System Dependencies

### Install FFmpeg (Required for video processing)

**macOS:**
```bash
brew install ffmpeg
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get update
sudo apt-get install ffmpeg
```

**Windows:**
1. Download from [FFmpeg website](https://ffmpeg.org/download.html)
2. Add to PATH

### Verify FFmpeg Installation
```bash
ffmpeg -version
```

## Step 4: Run the Server

1. Make sure virtual environment is activated:
   ```bash
   source venv/bin/activate  # macOS/Linux
   # or
   venv\Scripts\activate    # Windows
   ```

2. Run the server:
   ```bash
   python -m app.main
   ```

   Or using uvicorn directly:
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

3. The API will be available at: `http://localhost:8000`
4. API documentation at: `http://localhost:8000/docs`

## Troubleshooting

### Issue: "FFmpeg not found"

**Solution:** Install FFmpeg (see Step 3) and make sure it's in your PATH.

### Issue: "Groq API Key missing"

**Solution:** Ensure you have set `GROQ_API_KEY` in your `.env` file.
