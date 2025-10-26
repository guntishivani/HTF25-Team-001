# Caption Generator - Usage Guide

## 🚀 How It Works

### Backend (Your Colab Code - No Changes Made)
The backend uses your exact Colab workflow:
1. **Extracts audio** from uploaded video using FFmpeg
2. **Processes audio** with OpenAI Whisper model (small)
3. **Generates captions** with translate/transcribe mode
4. **Creates SRT file** with timestamps
5. **Merges video with subtitles** into MKV file with soft subtitles

### What Backend Returns
When you call `/generate-video-with-captions`:
```json
{
  "success": true,
  "output_filename": "video_with_captions.mkv",
  "download_url": "/download/video_with_captions.mkv",
  "captions": "1\n00:00:00,000 --> 00:00:05,000\nFirst caption text\n\n2\n...",
  "segments": [...],
  "language_detected": "en",
  "message": "Video with captions generated successfully"
}
```

### Frontend Display
After generation, the frontend shows:
- ✅ Success message with green banner
- 📥 **Download Video with Subtitles** button (MKV file)
- 📄 **Download SRT Caption File** button (text file)
- File information (filename, number of segments)

## 📊 Viewing Logs

### Backend Logs (Terminal)
Run the backend and watch the terminal:
```powershell
cd backend
.\venv\Scripts\python.exe app.py
```

You'll see:
```
🔊 BACKEND: Extracting audio from video.mp4...
✅ BACKEND: Audio extraction completed
🤖 BACKEND: Processing audio with task: translate...
📊 BACKEND: Using Whisper model to transcribe/translate...
✅ BACKEND: Whisper processing completed
🌍 BACKEND: Detected language: en
📝 BACKEND: Generated 15 caption segments
📋 BACKEND: Generated SRT content (2453 characters)
🎥 BACKEND: Merging video with subtitles...
✅ BACKEND: Video with subtitles created successfully
📤 BACKEND: Sending video response to frontend:
   - Success: True
   - Output filename: video_with_captions.mkv
   - Download URL: /download/video_with_captions.mkv
   - Language detected: en
   - Number of segments: 15
   - SRT length: 2453 characters
   - Message: Video with captions generated successfully
```

### Frontend Logs (Browser Console)
1. Open browser to `http://localhost:5173`
2. Press F12 to open Developer Tools
3. Go to **Console** tab
4. Upload a video

You'll see:
```
🎬 FRONTEND: Received video response from backend:
   - Success: true
   - Output filename: video_with_captions.mkv
   - Download URL: /download/video_with_captions.mkv
   - Language detected: en
   - Number of segments: 15
   - SRT content length: 2453
   - Message: Video with captions generated successfully
```

## 🎯 Step-by-Step Usage

### 1. Start Backend
```powershell
cd C:\Users\sneha\Downloads\cbit\backend
.\venv\Scripts\python.exe app.py
```

Wait for:
- "Whisper model loaded successfully!"
- "Running on http://127.0.0.1:5000"

### 2. Start Frontend
```powershell
cd C:\Users\sneha\Downloads\cbit
npm run dev
```

Open browser to: `http://localhost:5173`

### 3. Upload Video
1. Click "Upload Video" button
2. Select a video file (MP4, AVI, MOV, etc.)
3. Wait for processing (caption generation)
4. Click "🎬 Generate Video with Captions + SRT"
5. Wait for processing (this generates both files)

### 4. Download Files
After generation completes, you'll see two download buttons:
- **📥 Download Video with Subtitles** - Gets the MKV file with embedded captions
- **📄 Download SRT Caption File** - Gets the text SRT file

## 📁 Output Files

### Video with Subtitles (MKV)
- Format: Matroska Video (MKV)
- Contains: Original video + embedded soft subtitles
- Can be played in VLC, MPC-HC, or any player supporting MKV
- Subtitles can be toggled on/off in the player

### SRT Caption File
- Format: SubRip Text (SRT)
- Contains: Timestamped captions in plain text
- Can be used with any video player or editor
- Example format:
```
1
00:00:00,000 --> 00:00:05,120
Welcome to our presentation on automated caption generation.

2
00:00:05,120 --> 00:00:10,240
Today we will explore how AI can transform video content.
```

## 🔧 Troubleshooting

### Backend Not Starting
- Check if virtual environment is activated
- Run: `.\venv\Scripts\python.exe app.py` (not just `python app.py`)
- Ensure FFmpeg is installed: `ffmpeg -version`

### "Backend Not Available" Warning
- Make sure backend server is running on port 5000
- Check firewall settings
- Verify backend URL in `src/api.ts` is `http://localhost:5000`

### No Captions Generated
- Check backend terminal for error messages
- Ensure video file is valid and not corrupted
- Try a smaller video file first (under 30 seconds)
- Check FFmpeg is working: `ffmpeg -version`

### Frontend Not Showing Downloads
- Open browser console (F12) and check for errors
- Verify backend returned success response
- Check Network tab to see the API response

## 🎨 Caption Styles

The backend supports different styles:
- **formal**: Professional captions
- **casual**: Friendly captions  
- **meme**: Fun captions with emojis
- **aesthetic**: Stylized captions with symbols

## 🌍 Language Support

- **Transcribe**: Keeps original language
- **Translate**: Auto-detects language and translates to English

Backend uses Whisper which supports 90+ languages!

## 📝 Notes

- **No backend changes**: Your Colab code logic is preserved exactly
- **Model size**: Using Whisper "small" model (244 MB)
- **Processing time**: Depends on video length and your CPU
- **File cleanup**: Temporary files are automatically deleted
- **CORS enabled**: Frontend can connect to backend