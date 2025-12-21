# PDF to Video Conversion Backend

FastAPI backend for converting PDF documents to video lectures with AI narration.

## Features

- PDF upload and validation
- Text and image extraction from PDFs
- Google Cloud Text-to-Speech integration
- Video generation with animations and transitions
- Progress tracking for conversion jobs
- Video download and preview

## Quick Start

For fastest setup, use the automated script:

```bash
./setup.sh
```

Then follow the [Quick Start Guide](./QUICK_START.md) for Google Cloud setup.

## Setup

### 1. Create Virtual Environment

```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 2. Install Dependencies

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

### 3. Configure Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

Required variables:
- `GOOGLE_CLOUD_PROJECT_ID`: Your Google Cloud project ID
- `GOOGLE_APPLICATION_CREDENTIALS`: Path to your service account key JSON file

### 4. Google Cloud Setup

1. Create a Google Cloud project
2. Enable the Text-to-Speech API
3. Create a service account and download the key JSON file
4. Set the path in `GOOGLE_APPLICATION_CREDENTIALS`

### 5. Verify Setup

Run the setup verification script:

```bash
python scripts/check_setup.py
```

This will check:
- Python version
- Virtual environment
- Installed dependencies
- FFmpeg installation
- Environment configuration
- Google credentials
- Storage directories

### 6. Run the Server

```bash
python -m app.main
```

Or using uvicorn directly:

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## API Endpoints

### PDF Endpoints

- `POST /api/pdf/upload` - Upload a PDF file
- `POST /api/pdf/extract` - Extract content from PDF
- `POST /api/pdf/convert-to-video` - Start conversion process

### Video Endpoints

- `GET /api/video/status/{job_id}` - Get conversion status
- `GET /api/video/download/{job_id}` - Download generated video
- `GET /api/video/preview/{job_id}` - Get video preview

## API Documentation

Once the server is running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Project Structure

```
server/
├── app/
│   ├── main.py              # FastAPI application
│   ├── models/              # Pydantic models
│   ├── services/            # Business logic
│   ├── api/                 # API routes
│   └── utils/               # Utilities
├── requirements.txt
└── .env.example
```

## Development

### Running Tests

```bash
pytest
```

### Code Formatting

```bash
black app/
isort app/
```

## Documentation

- [Quick Start Guide](./QUICK_START.md) - Get started in 5 minutes
- [Detailed Setup Guide](./SETUP.md) - Complete setup instructions with troubleshooting

## Notes

- Video generation requires `ffmpeg` to be installed on the system
- Large PDFs may take significant time to process
- Generated files are stored temporarily and cleaned up after download
- Google Cloud credentials are required for Text-to-Speech functionality

