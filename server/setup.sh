#!/bin/bash

# PDF to Video Backend Setup Script

echo "🚀 Setting up PDF to Video Backend..."

# Check if Python 3 is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.8 or higher."
    exit 1
fi

# Check Python version
python_version=$(python3 --version | cut -d' ' -f2 | cut -d'.' -f1,2)
echo "✅ Found Python $python_version"

# Create virtual environment
echo "📦 Creating virtual environment..."
python3 -m venv venv

# Activate virtual environment
echo "🔌 Activating virtual environment..."
source venv/bin/activate

# Upgrade pip
echo "⬆️  Upgrading pip..."
pip install --upgrade pip

# Install dependencies
echo "📥 Installing dependencies..."
pip install -r requirements.txt

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from .env.example..."
    cp .env.example .env
    echo "⚠️  Please edit .env file and add your Groq API Key"
else
    echo "✅ .env file already exists"
fi

# Create necessary directories
echo "📁 Creating storage directories..."
mkdir -p storage/uploads
mkdir -p storage/outputs
mkdir -p storage/temp

echo ""
echo "✅ Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Activate virtual environment: source venv/bin/activate"
echo "2. Edit .env file with your Groq API configuration"
echo "4. Run the server: python -m app.main"
echo ""

