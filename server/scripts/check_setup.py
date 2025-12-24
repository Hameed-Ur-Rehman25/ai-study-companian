#!/usr/bin/env python3
"""
Setup verification script
Checks if all requirements are met for running the PDF to Video backend
"""
import os
import sys
import subprocess
from pathlib import Path

def check_python_version():
    """Check if Python version is 3.8+"""
    version = sys.version_info
    if version.major < 3 or (version.major == 3 and version.minor < 8):
        print("❌ Python 3.8 or higher is required")
        return False
    print(f"✅ Python {version.major}.{version.minor}.{version.micro}")
    return True

def check_virtual_env():
    """Check if virtual environment is activated"""
    if hasattr(sys, 'real_prefix') or (hasattr(sys, 'base_prefix') and sys.base_prefix != sys.prefix):
        print("✅ Virtual environment is activated")
        return True
    print("⚠️  Virtual environment is not activated")
    print("   Run: source venv/bin/activate")
    return False

def check_dependencies():
    """Check if required packages are installed"""
    required_packages = [
        'fastapi',
        'uvicorn',
        'pdfplumber',
        'fitz',  # PyMuPDF
        'moviepy',
        'PIL',  # Pillow
    ]
    
    missing = []
    for package in required_packages:
        try:
            if package == 'fitz':
                __import__('fitz')
            elif package == 'PIL':
                __import__('PIL')
            else:
                __import__(package)
            print(f"✅ {package}")
        except ImportError:
            print(f"❌ {package} - not installed")
            missing.append(package)
    
    if missing:
        print(f"\n⚠️  Missing packages. Install with: pip install -r requirements.txt")
        return False
    return True

def check_ffmpeg():
    """Check if FFmpeg is installed"""
    try:
        result = subprocess.run(['ffmpeg', '-version'], 
                              capture_output=True, 
                              text=True, 
                              timeout=5)
        if result.returncode == 0:
            version_line = result.stdout.split('\n')[0]
            print(f"✅ FFmpeg: {version_line}")
            return True
    except (subprocess.TimeoutExpired, FileNotFoundError):
        pass
    
    print("❌ FFmpeg is not installed or not in PATH")
    print("   Install: brew install ffmpeg (macOS) or sudo apt-get install ffmpeg (Linux)")
    return False

def check_env_file():
    """Check if .env file exists and has required variables"""
    env_file = Path('.env')
    if not env_file.exists():
        print("❌ .env file not found")
        print("   Copy .env.example to .env and configure it")
        return False
    
    print("✅ .env file exists")
    
    # Check for required variables
    with open(env_file) as f:
        content = f.read()
        required_vars = [
            'GROQ_API_KEY'
        ]
        
        missing_vars = []
        for var in required_vars:
            if f'{var}=' in content:
                value = [line for line in content.split('\n') if line.startswith(f'{var}=')][0]
                if 'your_groq_api_key' in value:
                    print(f"⚠️  {var} needs to be configured")
                    missing_vars.append(var)
                else:
                    print(f"✅ {var} is configured")
            else:
                print(f"❌ {var} is missing")
                missing_vars.append(var)
        
        if missing_vars:
            return False
    
    return True



def check_directories():
    """Check if required directories exist"""
    required_dirs = [
        'storage/uploads',
        'storage/outputs',
        'storage/temp'
    ]
    
    all_exist = True
    for dir_path in required_dirs:
        if Path(dir_path).exists():
            print(f"✅ {dir_path}")
        else:
            print(f"❌ {dir_path} - missing")
            all_exist = False
    
    if not all_exist:
        print("   Create with: mkdir -p storage/uploads storage/outputs storage/temp")
    
    return all_exist

def main():
    print("🔍 Checking PDF to Video Backend Setup...\n")
    
    checks = [
        ("Python Version", check_python_version),
        ("Virtual Environment", check_virtual_env),
        ("Dependencies", check_dependencies),
        ("FFmpeg", check_ffmpeg),
        ("Environment File", check_env_file),
        ("Storage Directories", check_directories),
    ]
    
    results = []
    for name, check_func in checks:
        print(f"\n📋 {name}:")
        result = check_func()
        results.append((name, result))
    
    print("\n" + "="*50)
    print("📊 Summary:")
    print("="*50)
    
    all_passed = True
    for name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status} - {name}")
        if not result:
            all_passed = False
    
    print("\n" + "="*50)
    if all_passed:
        print("🎉 All checks passed! You're ready to run the server.")
        print("   Run: python -m app.main")
    else:
        print("⚠️  Some checks failed. Please fix the issues above.")
        print("   See SETUP.md for detailed instructions.")
    print("="*50)
    
    return 0 if all_passed else 1

if __name__ == '__main__':
    sys.exit(main())


