# Gemini Integration Guide

## Overview
This project now has **two separate backend servers**:
1. **Whisper Backend (Port 5000)** - For continuous video captioning with timestamps (ContinuousVideoPage)
2. **Gemini Backend (Port 5001)** - For AI-generated creative captions for images and videos (ImagePage & VideoPage)

## Architecture

### Image Page & Video Page
- Use **Gemini AI** for creative caption generation
- Generate single, contextual captions based on image/video content
- Support multiple languages: Telugu, Hindi, English, Tamil, Malayalam
- Support multiple styles: Funny, Casual, Formal, Meme
- Backend: `gemini_app.py` on port 5001

### Continuous Video Page
- Use **Whisper AI** for timestamped speech-to-text transcription
- Generate detailed SRT captions with timestamps
- Create videos with embedded subtitles
- Backend: `app.py` on port 5000

## Setup Instructions

### 1. Install Gemini Backend Dependencies

```bash
cd backend
pip install -r requirements_gemini.txt
```

### 2. Start Both Backends

#### Option A: Use Batch Scripts (Windows)

**Terminal 1 - Gemini Backend:**
```bash
start_gemini_backend.bat
```

**Terminal 2 - Whisper Backend:**
```bash
start.bat
```

**Terminal 3 - Frontend:**
```bash
npm run dev
```

#### Option B: Manual Start

**Terminal 1 - Gemini Backend (Port 5001):**
```bash
cd backend
.\venv\Scripts\python.exe gemini_app.py
```

**Terminal 2 - Whisper Backend (Port 5000):**
```bash
cd backend
.\venv\Scripts\python.exe app.py
```

**Terminal 3 - Frontend:**
```bash
npm run dev
```

## API Endpoints

### Gemini Backend (Port 5001)

#### Health Check
```
GET http://localhost:5001/health
```

#### Generate Caption
```
POST http://localhost:5001/generate-gemini-caption
Content-Type: multipart/form-data

Parameters:
- file: Image or video file
- style: 'funny' | 'casual' | 'formal' | 'meme'
- language: 'te' | 'hi' | 'en' | 'ta' | 'ml'

Response:
{
  "success": true,
  "language": "English",
  "language_code": "en",
  "style": "funny",
  "caption": "Generated caption text..."
}
```

### Whisper Backend (Port 5000)
Existing endpoints remain unchanged - see main README.md

## Language Codes

| Code | Language   |
|------|-----------|
| te   | Telugu    |
| hi   | Hindi     |
| en   | English   |
| ta   | Tamil     |
| ml   | Malayalam |

## Caption Styles

1. **Funny** - Hilarious and witty captions with humor and wordplay
2. **Casual** - Relaxed, friendly, conversational tone
3. **Formal** - Professional and sophisticated language
4. **Meme** - Internet meme-style with emoji and trendy phrases

## How It Works

### Image Caption Generation
1. User uploads image on Image Page
2. Frontend sends image to Gemini backend (port 5001)
3. Image is uploaded to Google Gemini AI
4. Gemini analyzes image and generates contextual caption
5. Caption returned in selected language and style

### Video Caption Generation (Simple)
1. User uploads video on Video Page
2. Frontend sends video to Gemini backend (port 5001)
3. Video is uploaded to Google Gemini AI
4. Gemini analyzes video content and generates summary caption
5. Caption returned in selected language and style

### Continuous Video Captioning (Timestamps)
1. User uploads video on Continuous Video Page
2. Frontend sends video to Whisper backend (port 5000)
3. Audio extracted with FFmpeg
4. Whisper transcribes speech with timestamps
5. SRT file generated with timestamped captions
6. Video with embedded subtitles created

## Troubleshooting

### Gemini Backend Not Available
If you see "⚠️ Gemini Backend Not Available" warning:
1. Make sure you're in the correct directory
2. Run `start_gemini_backend.bat` or manually start `gemini_app.py`
3. Check terminal for error messages
4. Verify Google API key is valid in `gemini_app.py`

### Whisper Backend Not Available
If continuous video captioning fails:
1. Make sure Whisper backend is running on port 5000
2. Run `start.bat` or manually start `app.py`
3. Verify FFmpeg is installed
4. Check terminal for error messages

### Both Backends Running?
You should have **3 terminals open**:
- Terminal 1: Gemini backend (port 5001) - for image/video captions
- Terminal 2: Whisper backend (port 5000) - for continuous video
- Terminal 3: Frontend (port 5173) - React app

## Dependencies

### Gemini Backend
- flask==3.1.2
- flask-cors==4.0.0
- google-generativeai==0.8.3
- werkzeug==3.0.1

### Whisper Backend
- flask==3.1.2
- flask-cors==4.0.0
- openai-whisper
- ffmpeg-python
- tqdm
- werkzeug==3.0.1

## Notes

- The Gemini API key is hardcoded in `gemini_app.py` (line 10)
- For production, move API key to environment variables
- Gemini model used: `gemini-2.0-flash-exp`
- Whisper model used: `small` (~244MB)
- Image Page and Video Page now use Gemini instead of mock API
- Continuous Video Page still uses Whisper (unchanged)
