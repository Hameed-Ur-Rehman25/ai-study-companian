# Setup Guide for PDF to Video Backend

## Prerequisites

- Python 3.8 or higher
- Google Cloud account
- Google Cloud project with billing enabled

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

## Step 2: Set Up Google Cloud Credentials

### 2.1 Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the project dropdown at the top
3. Click "New Project"
4. Enter a project name (e.g., "pdf-to-video")
5. Click "Create"
6. Note your **Project ID** (you'll need this later)

### 2.2 Enable Text-to-Speech API

1. In your Google Cloud project, go to [APIs & Services > Library](https://console.cloud.google.com/apis/library)
2. Search for "Cloud Text-to-Speech API"
3. Click on it and click "Enable"

### 2.3 Create a Service Account

1. Go to [IAM & Admin > Service Accounts](https://console.cloud.google.com/iam-admin/serviceaccounts)
2. Click "Create Service Account"
3. Enter a name (e.g., "pdf-to-video-service")
4. Click "Create and Continue"
5. Under "Grant this service account access to project", select role: **"Cloud Text-to-Speech API User"**
6. Click "Continue" then "Done"

### 2.4 Create and Download Service Account Key

1. Click on the service account you just created
2. Go to the "Keys" tab
3. Click "Add Key" > "Create new key"
4. Select "JSON" format
5. Click "Create"
6. A JSON file will be downloaded - **save this file securely!**

### 2.5 Set Up Credentials

#### Option A: Using Environment Variable (Recommended for Development)

1. Move the downloaded JSON file to a secure location:
   ```bash
   # Example: Move to server directory
   mv ~/Downloads/your-project-xxxxx.json server/google-credentials.json
   ```

2. Update your `.env` file:
   ```env
   GOOGLE_APPLICATION_CREDENTIALS=./google-credentials.json
   GOOGLE_CLOUD_PROJECT_ID=your-project-id
   ```

#### Option B: Using gcloud CLI (Alternative)

```bash
# Install gcloud CLI (if not installed)
# macOS:
brew install google-cloud-sdk

# Authenticate
gcloud auth application-default login

# Set project
gcloud config set project YOUR_PROJECT_ID
```

## Step 3: Configure Environment Variables

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` file with your settings:
   ```env
   # Google Cloud Configuration
   GOOGLE_CLOUD_PROJECT_ID=your-project-id-here
   GOOGLE_APPLICATION_CREDENTIALS=./google-credentials.json

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

## Step 4: Install System Dependencies

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

## Step 5: Run the Server

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

### Issue: "ModuleNotFoundError: No module named 'google.cloud'"

**Solution:** Make sure virtual environment is activated and dependencies are installed:
```bash
source venv/bin/activate
pip install -r requirements.txt
```

### Issue: "Could not automatically determine credentials"

**Solution:** Check that:
1. `GOOGLE_APPLICATION_CREDENTIALS` path in `.env` is correct
2. The JSON file exists at that path
3. The JSON file has valid credentials

### Issue: "Permission denied" or "403 Forbidden"

**Solution:** 
1. Make sure the service account has "Cloud Text-to-Speech API User" role
2. Check that billing is enabled for your Google Cloud project
3. Verify the API is enabled in your project

### Issue: "FFmpeg not found"

**Solution:** Install FFmpeg (see Step 4) and make sure it's in your PATH

## Testing the Setup

1. Check if the server starts:
   ```bash
   python -m app.main
   ```

2. Test the health endpoint:
   ```bash
   curl http://localhost:8000/health
   ```

3. Check API documentation:
   Open `http://localhost:8000/docs` in your browser

## Security Notes

- **Never commit** the `google-credentials.json` file to git
- Keep your service account keys secure
- Use environment variables for sensitive data
- In production, use Google Cloud's recommended authentication methods

## Next Steps

- Configure the frontend to connect to the backend API
- Set up production deployment
- Configure CORS for your frontend domain
- Set up monitoring and logging

