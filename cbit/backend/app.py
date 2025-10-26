# -------------------------
# Automated Caption Generator - Flask Version
# -------------------------

from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
import os
import subprocess
import tempfile
from datetime import timedelta
import whisper
from werkzeug.utils import secure_filename

# -------------------------
# Flask App
# -------------------------
app = Flask(__name__)
CORS(app)  # Enable CORS for frontend connection

UPLOAD_FOLDER = "uploads"
OUTPUT_FOLDER = "outputs"
ALLOWED_VIDEO_EXTENSIONS = {'mp4','avi', 'mov', 'mkv', 'webm', 'flv', 'wmv'}

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

# -------------------------
# Utilities
# -------------------------
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_VIDEO_EXTENSIONS

def run_ffmpeg_extract_audio(video_path, out_audio_path):
    print(f"  🔊 Extracting audio from video...")
    cmd = [
        "ffmpeg", "-y",
        "-i", video_path,
        "-vn",
        "-acodec", "pcm_s16le",
        "-ar", "16000",
        "-ac", "1",
        out_audio_path
    ]
    result = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    if result.returncode != 0:
        raise Exception(f"FFmpeg error: {result.stderr}")
    print(f"  ✅ Audio extracted successfully")

def srt_timestamp(seconds_float):
    td = timedelta(seconds=seconds_float)
    total_seconds = int(td.total_seconds())
    hours = total_seconds // 3600
    minutes = (total_seconds % 3600) // 60
    seconds = total_seconds % 60
    milliseconds = int((td.total_seconds() - total_seconds) * 1000)
    return f"{hours:02d}:{minutes:02d}:{seconds:02d},{milliseconds:03d}"

def write_srt(segments):
    srt_text = ""
    for i, seg in enumerate(segments, start=1):
        start_ts = srt_timestamp(seg["start"])
        end_ts = srt_timestamp(seg["end"])
        text = seg["text"].strip()
        srt_text += f"{i}\n{start_ts} --> {end_ts}\n{text}\n\n"
    return srt_text

# -------------------------
# Whisper model load (load once)
# -------------------------
print("=" * 60)
print("🚀 Loading Whisper model (small)...")
print("=" * 60)
model = whisper.load_model("small")
print("✅ Whisper model loaded successfully!")
print("=" * 60)

# -------------------------
# Flask Routes
# -------------------------
@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint for frontend"""
    return jsonify({
        "status": "healthy",
        "message": "Caption generator backend is running"
    })

@app.route('/')
def index():
    return jsonify({
        "message": "Welcome to the Automated Caption Generator API",
        "endpoints": {
            "/health": "GET - Health check",
            "/generate-captions": "POST - Generate captions only",
            "/generate-video-with-captions": "POST - Generate video with embedded captions",
            "/download/<filename>": "GET - Download generated video"
        }
    })

@app.route('/generate-captions', methods=['POST'])
def generate_captions():
    """Generate captions from video - returns JSON with SRT content"""
    video_path = None
    
    try:
        print("\n" + "=" * 60)
        print("📥 NEW REQUEST: /generate-captions")
        print("=" * 60)
        
        # Validate file upload
        if 'video' not in request.files:
            return jsonify({"error": "No video file uploaded"}), 400

        video_file = request.files['video']
        if video_file.filename == '':
            return jsonify({"error": "No file selected"}), 400
        
        if not allowed_file(video_file.filename):
            return jsonify({"error": "Invalid file type"}), 400
        
        # Get options
        task = request.form.get('task', 'translate')  # Default to translate for better results
        style = request.form.get('style', 'formal')
        
        # Force translate to get English captions from non-English audio
        if task == 'transcribe':
            print(f"  ⚠️  Converting transcribe → translate for English captions")
            task = 'translate'
        
        filename = secure_filename(video_file.filename)
        video_path = os.path.join(UPLOAD_FOLDER, filename)
        video_file.save(video_path)
        video_file.close()  # Ensure file is closed before processing
        
        # Check video file size
        video_size = os.path.getsize(video_path)
        print(f"📹 Video uploaded: {filename}")
        print(f"📊 Video file size: {video_size / (1024*1024):.2f} MB")
        print(f"⚙️  Task: {task}, Style: {style}")

        # Create temp directory
        with tempfile.TemporaryDirectory() as tmpdir:
            audio_path = os.path.join(tmpdir, "audio.wav")

            # Extract audio
            run_ffmpeg_extract_audio(video_path, audio_path)
            
            # Check audio file
            audio_size = os.path.getsize(audio_path)
            print(f"  🎵 Audio extracted: {audio_size / 1024:.2f} KB")

            # Transcribe with Whisper
            print(f"  🤖 Processing with Whisper model (task: {task})...")
            print(f"  🎵 Audio file: {audio_path}")
            
            # Add verbose output to see what Whisper is doing
            result = model.transcribe(audio_path, task=task, verbose=True)
            
            detected_lang = result.get('language', 'unknown')
            print(f"  🌍 Language detected: {detected_lang}")
            
            # DEBUG: Print what Whisper actually detected
            print(f"\n  🔍 DEBUG: Whisper returned {len(result.get('segments', []))} segments")
            if len(result.get('segments', [])) > 0:
                print(f"  🔍 DEBUG: First 3 segments from Whisper:")
                for i, seg in enumerate(result.get('segments', [])[:3]):
                    print(f"     [{i+1}] {seg['start']:.2f}s - {seg['end']:.2f}s: '{seg['text'].strip()}'")
            else:
                print(f"  ⚠️  WARNING: No segments detected!")
            print()

            # Process segments
            segments = []
            for seg in result['segments']:
                segments.append({
                    "start": float(seg["start"]),
                    "end": float(seg["end"]),
                    "text": seg["text"].strip()
                })
            
            print(f"  📝 Generated {len(segments)} caption segments")

            # Generate SRT
            srt_content = write_srt(segments)
            
            # Apply style
            if style == 'meme':
                srt_content = srt_content.replace(".", " 😄")
                print(f"  🎭 Applied meme style")
            elif style == 'aesthetic':
                srt_content = srt_content.replace(".", " ✨")
                print(f"  ✨ Applied aesthetic style")
            
            # Print first few captions
            print("\n" + "-" * 60)
            print("📋 GENERATED CAPTIONS (preview):")
            print("-" * 60)
            lines = srt_content.split('\n')
            preview_lines = lines[:min(15, len(lines))]
            print('\n'.join(preview_lines))
            if len(lines) > 15:
                print(f"\n... ({len(lines) - 15} more lines)")
            print("-" * 60)

            # Cleanup
            os.remove(video_path)

            response = {
                "success": True,
                "captions": srt_content,
                "segments": segments,
                "language_detected": detected_lang,
                "message": f"Captions generated successfully using {task} mode"
            }
            
            print(f"✅ Response ready: {len(srt_content)} characters")
            print("=" * 60 + "\n")
            
            return jsonify(response)

    except Exception as e:
        if video_path and os.path.exists(video_path):
            os.remove(video_path)
        
        print(f"❌ ERROR: {str(e)}")
        print("=" * 60 + "\n")
        return jsonify({"error": f"Failed to generate captions: {str(e)}"}), 500

@app.route('/generate-video-with-captions', methods=['POST'])
def generate_video_with_captions():
    """Generate video with embedded captions - returns downloadable video"""
    video_path = None
    output_path = None
    
    try:
        print("\n" + "=" * 60)
        print("📥 NEW REQUEST: /generate-video-with-captions")
        print("=" * 60)
        
        # Validate file upload
        if 'video' not in request.files:
            return jsonify({"error": "No video file uploaded"}), 400

        video_file = request.files['video']
        if video_file.filename == '':
            return jsonify({"error": "No file selected"}), 400
        
        if not allowed_file(video_file.filename):
            return jsonify({"error": "Invalid file type"}), 400
        
        # Get task option
        task = request.form.get('task', 'translate')
        
        filename = secure_filename(video_file.filename)
        video_path = os.path.join(UPLOAD_FOLDER, filename)
        video_file.save(video_path)
        
        print(f"📹 Video uploaded: {filename}")
        print(f"⚙️  Task: {task}")

        # Create temp directory
        with tempfile.TemporaryDirectory() as tmpdir:
            audio_path = os.path.join(tmpdir, "audio.wav")
            srt_path = os.path.join(tmpdir, "captions.srt")

            # Extract audio
            run_ffmpeg_extract_audio(video_path, audio_path)

            # Transcribe with Whisper
            print(f"  🤖 Processing with Whisper model (task: {task})...")
            print(f"  🎵 Audio file: {audio_path}")
            result = model.transcribe(audio_path, task=task)
            detected_lang = result.get('language', 'unknown')
            print(f"  🌍 Language detected: {detected_lang}")
            
            # DEBUG: Print what Whisper actually detected
            print(f"\n  🔍 DEBUG: Whisper returned {len(result.get('segments', []))} segments")
            if len(result.get('segments', [])) > 0:
                print(f"  🔍 DEBUG: First 3 segments from Whisper:")
                for i, seg in enumerate(result.get('segments', [])[:3]):
                    print(f"     [{i+1}] {seg['start']:.2f}s - {seg['end']:.2f}s: '{seg['text'].strip()}'")
            else:
                print(f"  ⚠️  WARNING: No segments detected!")
            print()

            # Process segments
            segments = []
            for seg in result['segments']:
                segments.append({
                    "start": float(seg["start"]),
                    "end": float(seg["end"]),
                    "text": seg["text"].strip()
                })
            
            print(f"  📝 Generated {len(segments)} caption segments")

            # Generate and save SRT
            srt_content = write_srt(segments)
            with open(srt_path, "w", encoding="utf-8") as f:
                f.write(srt_content)
            
            # Print captions
            print("\n" + "-" * 60)
            print("📋 GENERATED CAPTIONS (preview):")
            print("-" * 60)
            lines = srt_content.split('\n')
            preview_lines = lines[:min(15, len(lines))]
            print('\n'.join(preview_lines))
            if len(lines) > 15:
                print(f"\n... ({len(lines) - 15} more lines)")
            print("-" * 60)

            # Merge video with subtitles
            name_without_ext = os.path.splitext(filename)[0]
            output_filename = f"{name_without_ext}_with_captions.mkv"
            output_path = os.path.join(OUTPUT_FOLDER, output_filename)
            
            print(f"  🎥 Merging video with subtitles...")
            cmd = [
                "ffmpeg", "-y",
                "-i", video_path,
                "-i", srt_path,
                "-c:v", "copy",
                "-c:a", "copy",
                "-c:s", "srt",
                "-metadata:s:s:0", "language=eng",
                output_path
            ]
            result = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
            if result.returncode != 0:
                raise Exception(f"FFmpeg merge error: {result.stderr}")
            
            print(f"  ✅ Video with subtitles created: {output_filename}")

            # Cleanup
            os.remove(video_path)

            response = {
                "success": True,
                "output_filename": output_filename,
                "download_url": f"/download/{output_filename}",
                "captions": srt_content,
                "segments": segments,
                "language_detected": detected_lang,
                "message": "Video with captions generated successfully"
            }
            
            print(f"✅ Response ready with download URL")
            print("=" * 60 + "\n")
            
            return jsonify(response)

    except Exception as e:
        if video_path and os.path.exists(video_path):
            os.remove(video_path)
        if output_path and os.path.exists(output_path):
            os.remove(output_path)
        
        print(f"❌ ERROR: {str(e)}")
        print("=" * 60 + "\n")
        return jsonify({"error": f"Failed to generate video: {str(e)}"}), 500


@app.route('/download/<filename>', methods=['GET'])
def download_file(filename):
    """Download generated video file"""
    try:
        file_path = os.path.join(OUTPUT_FOLDER, secure_filename(filename))
        if not os.path.exists(file_path):
            return jsonify({"error": "File not found"}), 404
        
        print(f"📤 Downloading: {filename}")
        return send_file(
            file_path,
            as_attachment=True,
            download_name=filename,
            mimetype='video/x-matroska'
        )
    except Exception as e:
        print(f"❌ Download error: {str(e)}")
        return jsonify({"error": f"Failed to download file: {str(e)}"}), 500


@app.route('/download-srt', methods=['POST'])
def download_srt():
    """Download SRT file"""
    try:
        srt_content = request.json.get('srt_content', '')
        if not srt_content:
            return jsonify({"error": "No SRT content provided"}), 400
        
        srt_filename = "captions.srt"
        srt_path = os.path.join(OUTPUT_FOLDER, srt_filename)
        
        with open(srt_path, "w", encoding="utf-8") as f:
            f.write(srt_content)
        
        print(f"📤 Downloading SRT: {srt_filename}")
        return send_file(
            srt_path,
            as_attachment=True,
            download_name=srt_filename,
            mimetype='text/plain'
        )
    except Exception as e:
        print(f"❌ SRT download error: {str(e)}")
        return jsonify({"error": f"Failed to create SRT download: {str(e)}"}), 500

# -------------------------
# Run Server
# -------------------------
if __name__ == '__main__':
    print("\n" + "=" * 60)
    print("🎬 CAPTION GENERATOR BACKEND SERVER")
    print("=" * 60)
    print("📡 Server starting on http://127.0.0.1:5000")
    print("🔗 Frontend should connect to http://localhost:5000")
    print("=" * 60 + "\n")

    app.run(host='0.0.0.0', port=5000, debug=True)

