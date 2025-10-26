# Caption Generator Backend Setup Guide

## Prerequisites

1. **Python 3.8 or higher**: Make sure Python is installed on your system.
2. **FFmpeg**: Required for video/audio processing.

### Installing FFmpeg on Windows:
1. Download FFmpeg from: https://ffmpeg.org/download.html
2. Extract the files and add the `bin` folder to your system PATH
3. Or use chocolatey: `choco install ffmpeg`
4. Or use winget: `winget install FFmpeg`

## Setup Instructions

1. **Create a virtual environment** (recommended):
   ```bash
   cd backend
   python -m venv venv
   venv\Scripts\activate  # On Windows
   # source venv/bin/activate  # On macOS/Linux
   ```

2. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the server**:
   ```bash
   python app.py
   ```

The server will start on `http://localhost:5000`

## API Endpoints

### 1. Health Check
- **GET** `/health`
- Returns server status

### 2. Generate Captions Only
- **POST** `/generate-captions`
- Form data:
  - `video`: Video file
  - `task`: "transcribe" or "translate" (optional, default: "transcribe")
  - `style`: "formal", "meme", "aesthetic", "casual" (optional, default: "formal")
  - `language`: Target language code (optional, default: "en")

### 3. Generate Video with Embedded Captions
- **POST** `/generate-video-with-captions`
- Form data:
  - `video`: Video file
  - `task`: "transcribe" or "translate" (optional, default: "translate")

### 4. Download Generated Video
- **GET** `/download/<filename>`
- Downloads the generated video file

### 5. Download SRT File
- **POST** `/download-srt`
- JSON body: `{"srt_content": "SRT content here"}`

## Troubleshooting

1. **FFmpeg not found**: Make sure FFmpeg is installed and added to PATH
2. **Memory issues**: The Whisper model requires significant RAM. Consider using a smaller model if needed.
3. **CORS issues**: The server has CORS enabled for all origins in development mode.

## Model Information

The backend uses the Whisper "small" model by default, which provides a good balance between speed and accuracy. You can modify the model size in `app.py`:

- `tiny`: Fastest, least accurate
- `base`: Fast, decent accuracy
- `small`: Good balance (default)
- `medium`: Better accuracy, slower
- `large`: Best accuracy, slowest