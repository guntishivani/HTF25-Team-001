# Automated Caption Generator — Full Stack Application

A comprehensive React + TypeScript frontend with Python Flask backend for AI-powered video and image caption generation using OpenAI's Whisper model.

## 🚀 Features

### 1. Image Caption Streaming
- Upload images and watch AI generate continuous, contextual meme-style captions in real-time
- Multiple style options (meme, casual, formal, aesthetic)
- Multi-language support

### 2. Continuous Video Captioning  
- Generate timestamped captions throughout your video using Whisper AI
- **Input/Output Language Selection**: Choose the language of your input video and the desired output language for captions
- Real-time transcription and translation
- Export formats: SRT, VTT, and custom formats
- Perfect for subtitles and accessibility

### 3. Video Summary Caption
- Generate a single, comprehensive caption that summarizes the entire video content
- Ideal for video descriptions, social media posts, and content overviews
- Download video with embedded soft subtitles

### 4. Backend Integration
- Python Flask backend with OpenAI Whisper integration
- Real video processing with FFmpeg
- Automatic fallback to mock API when backend is unavailable

## 📋 Prerequisites

Before running the application, make sure you have:

1. **Python 3.8 or higher** - [Download Python](https://python.org)
2. **Node.js 16 or higher** - [Download Node.js](https://nodejs.org)
3. **FFmpeg** - Required for video processing
   
   **Windows Installation Options:**
   - Download from [FFmpeg Official Site](https://ffmpeg.org/download.html)
   - Using Chocolatey: `choco install ffmpeg`
   - Using Winget: `winget install FFmpeg`

## 🔧 Quick Setup (Windows)

1. **Automated Setup** (Recommended):
   ```cmd
   setup.bat
   ```
   This script will:
   - Check all prerequisites
   - Set up Python virtual environment
   - Install all dependencies
   - Configure the application

2. **Start Both Servers**:
   ```cmd
   start.bat
   ```
   This will start both backend and frontend servers automatically.

## 🛠️ Manual Setup

### Backend Setup

1. **Navigate to backend directory**:
   ```cmd
   cd backend
   ```

2. **Create virtual environment**:
   ```cmd
   python -m venv venv
   venv\Scripts\activate
   ```

3. **Install dependencies**:
   ```cmd
   pip install -r requirements.txt
   ```

4. **Start backend server**:
   ```cmd
   python app.py
   ```
   Backend will be available at: `http://localhost:5000`

### Frontend Setup

1. **Install Node.js dependencies**:
   ```cmd
   npm install
   ```

2. **Start development server**:
   ```cmd
   npm run dev
   ```
   Frontend will be available at: `http://localhost:5173`

## 🌐 API Endpoints

### Backend API (http://localhost:5000)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Check server status |
| `/generate-captions` | POST | Generate captions from video |
| `/generate-video-with-captions` | POST | Create video with embedded captions |
| `/download/<filename>` | GET | Download generated video |
| `/download-srt` | POST | Download SRT subtitle file |

### Request Parameters

**For caption generation:**
- `video`: Video file (MP4, AVI, MOV, MKV, WebM, FLV, WMV)
- `task`: "transcribe" or "translate" (optional)
- `style`: "formal", "meme", "aesthetic", "casual" (optional)
- `language`: Target language code (optional)

## 🎯 Usage

1. **Start both servers** using `start.bat` or manually
2. **Open your browser** to `http://localhost:5173`
3. **Upload a video file** and select your options
4. **Choose your processing mode**:
   - **Simple Caption**: Get a summary of the video content
   - **Continuous Captions**: Get timestamped captions with export options
   - **Video with Captions**: Generate and download video with embedded subtitles

## 🔄 Fallback System

The application includes an intelligent fallback system:
- **Backend Available**: Uses real Whisper AI for processing
- **Backend Unavailable**: Automatically falls back to mock API
- **Visual Indicators**: Shows backend status in the UI

## 📁 Project Structure

```
cbit/
├── frontend/
│   ├── src/
│   │   ├── components/          # React components
│   │   ├── pages/              # Page components
│   │   ├── api.ts              # API client with backend integration
│   │   └── mockApi.ts          # Fallback mock API
│   ├── package.json
│   └── vite.config.ts
├── backend/
│   ├── app.py                  # Flask server with Whisper integration
│   ├── requirements.txt        # Python dependencies
│   ├── uploads/                # Temporary upload directory
│   ├── outputs/                # Generated files directory
│   └── README.md              # Backend-specific documentation
├── setup.bat                   # Automated setup script
├── start.bat                   # Start both servers
└── README.md                   # This file
```

## 🚨 Troubleshooting

### Common Issues

1. **FFmpeg not found**
   - Ensure FFmpeg is installed and added to system PATH
   - Restart command prompt after installation

2. **Python virtual environment issues**
   - Delete `backend/venv` folder and recreate: `python -m venv venv`

3. **Port conflicts**
   - Backend runs on port 5000, frontend on 5173
   - Make sure these ports are available

4. **Memory issues**
   - Whisper model requires significant RAM
   - Consider using a smaller model in `backend/app.py`

### Model Sizes (Edit in backend/app.py)

- `tiny`: Fastest, least accurate (~39 MB)
- `base`: Fast, decent accuracy (~74 MB)
- `small`: Good balance (~244 MB) - **Default**
- `medium`: Better accuracy (~769 MB)
- `large`: Best accuracy (~1550 MB)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test both frontend and backend
5. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- OpenAI Whisper for speech recognition
- Flask for the backend framework
- React and Vite for the frontend
- FFmpeg for video processing
