# Quick Start Guide

## 🚀 Fast Setup (5 minutes)

### 1. Run Setup Script

```bash
cd server
./setup.sh
```

This will:
- ✅ Create virtual environment
- ✅ Install all dependencies
- ✅ Create .env file
- ✅ Create storage directories

### 2. Set Up Google Cloud (5 minutes)

1. **Create Project**: Go to [Google Cloud Console](https://console.cloud.google.com/) → Create Project
2. **Enable API**: Enable "Cloud Text-to-Speech API"
3. **Create Service Account**: 
   - Go to IAM & Admin → Service Accounts
   - Create service account with role: "Cloud Text-to-Speech API User"
4. **Download Key**: Create JSON key and save as `google-credentials.json` in `server/` directory

### 3. Configure Environment

Edit `server/.env`:
```env
GOOGLE_CLOUD_PROJECT_ID=your-project-id
GOOGLE_APPLICATION_CREDENTIALS=./google-credentials.json
```

### 4. Install FFmpeg

**macOS:**
```bash
brew install ffmpeg
```

**Linux:**
```bash
sudo apt-get install ffmpeg
```

### 5. Run Server

```bash
cd server
source venv/bin/activate
python -m app.main
```

Server will start at: `http://localhost:8000`

## 📚 Detailed Instructions

See [SETUP.md](./SETUP.md) for detailed step-by-step instructions.

## ✅ Verify Setup

1. Check server: `curl http://localhost:8000/health`
2. View docs: Open `http://localhost:8000/docs`

## 🆘 Need Help?

See [SETUP.md](./SETUP.md) troubleshooting section.


