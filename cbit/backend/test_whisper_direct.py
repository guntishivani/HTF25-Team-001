#!/usr/bin/env python3
"""
Direct Whisper Caption Generator Test
This script mimics your Colab code but runs locally to test the backend functionality.
"""

import os
import subprocess
import tempfile
from datetime import timedelta
from tqdm import tqdm
import whisper

# -------------------------
# Utilities (same as your Colab code)
# -------------------------
def run_ffmpeg_extract_audio(video_path, out_audio_path):
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
    print("✓ Audio extraction completed successfully")

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

def merge_video_with_subtitles(video_path, srt_path, output_path):
    """Merge video with SRT as soft subtitles (like your Colab code)"""
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
    print(f"✓ Video with subtitles created: {output_path}")

# -------------------------
# Main processing function
# -------------------------
def process_video(video_path, task="translate", output_dir="outputs"):
    """
    Process video file and generate captions (exactly like your Colab workflow)
    
    Args:
        video_path: Path to input video file
        task: "transcribe" or "translate" 
        output_dir: Directory to save output files
    """
    
    print(f"🎬 Processing video: {video_path}")
    print(f"📝 Task: {task}")
    print("-" * 50)
    
    # Create output directory
    os.makedirs(output_dir, exist_ok=True)
    
    # Create temporary directory for processing
    tmpdir = tempfile.mkdtemp()
    audio_path = os.path.join(tmpdir, "audio.wav")
    
    try:
        # Step 1: Extract audio (same as your Colab)
        print("🔊 Extracting audio from video...")
        run_ffmpeg_extract_audio(video_path, audio_path)
        
        # Step 2: Load Whisper model (same as your Colab)
        print("🤖 Loading Whisper model...")
        model = whisper.load_model("small")
        print("✓ Whisper model loaded successfully!")
        
        # Step 3: Transcribe/translate audio (same as your Colab)
        print(f"🎙️  Transcribing and {'translating to English' if task == 'translate' else 'transcribing'} audio...")
        result = model.transcribe(audio_path, task=task)
        
        # Step 4: Process segments (same as your Colab)
        segments = []
        for seg in result['segments']:
            segments.append({
                "start": float(seg["start"]),
                "end": float(seg["end"]),
                "text": seg["text"].strip()
            })
        
        # Step 5: Generate SRT content (same as your Colab)
        srt_content = write_srt(segments)
        
        print("✓ Caption generation completed!")
        print(f"📊 Generated {len(segments)} caption segments")
        print(f"🌍 Detected language: {result.get('language', 'unknown')}")
        
        # Step 6: Display captions (same as your Colab)
        print("\n" + "=" * 50)
        print("📋 GENERATED CAPTIONS (SRT FORMAT)")
        print("=" * 50)
        print(srt_content)
        print("=" * 50)
        
        # Step 7: Save SRT file (same as your Colab)
        video_name = os.path.splitext(os.path.basename(video_path))[0]
        srt_file = os.path.join(output_dir, f"{video_name}_captions.srt")
        
        with open(srt_file, "w", encoding="utf-8") as f:
            f.write(srt_content)
        print(f"💾 SRT file saved: {srt_file}")
        
        # Step 8: Create video with soft subtitles (same as your Colab)
        output_video = os.path.join(output_dir, f"{video_name}_with_captions.mkv")
        print(f"🎥 Creating video with embedded subtitles...")
        merge_video_with_subtitles(video_path, srt_file, output_video)
        
        print("\n✅ SUCCESS! All processing completed.")
        print(f"📁 Output files saved in: {output_dir}/")
        print(f"   - SRT file: {os.path.basename(srt_file)}")
        print(f"   - Video with subtitles: {os.path.basename(output_video)}")
        
        return {
            "success": True,
            "srt_content": srt_content,
            "segments": segments,
            "language_detected": result.get('language', 'unknown'),
            "srt_file": srt_file,
            "output_video": output_video
        }
        
    except Exception as e:
        print(f"❌ ERROR: {str(e)}")
        return {
            "success": False,
            "error": str(e)
        }
    
    finally:
        # Cleanup temporary files
        try:
            import shutil
            shutil.rmtree(tmpdir)
        except:
            pass

# -------------------------
# Interactive test runner
# -------------------------
if __name__ == "__main__":
    print("🚀 WHISPER CAPTION GENERATOR - DIRECT TEST")
    print("=" * 60)
    
    # Check prerequisites
    print("🔍 Checking prerequisites...")
    
    # Check FFmpeg
    try:
        result = subprocess.run(["ffmpeg", "-version"], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        if result.returncode == 0:
            print("✓ FFmpeg is available")
        else:
            print("❌ FFmpeg not found")
            exit(1)
    except FileNotFoundError:
        print("❌ FFmpeg not found in PATH")
        exit(1)
    
    # Check Whisper
    try:
        import whisper
        print("✓ Whisper library is available")
    except ImportError:
        print("❌ Whisper library not found")
        exit(1)
    
    print("\n📁 Please provide the path to your video file:")
    print("   Example: C:\\Users\\sneha\\Videos\\test.mp4")
    print("   Or drag and drop a video file here and press Enter")
    
    while True:
        video_path = input("\n🎬 Video file path: ").strip().strip('"')
        
        if not video_path:
            print("Please enter a video file path")
            continue
            
        if not os.path.exists(video_path):
            print(f"❌ File not found: {video_path}")
            continue
            
        # Check if it's a video file
        video_extensions = ['.mp4', '.avi', '.mov', '.mkv', '.webm', '.flv', '.wmv']
        if not any(video_path.lower().endswith(ext) for ext in video_extensions):
            print("⚠️  Warning: File doesn't have a common video extension")
            proceed = input("Continue anyway? (y/n): ").lower()
            if proceed != 'y':
                continue
        
        break
    
    # Ask for task type
    print("\n📝 Choose processing mode:")
    print("   1. Transcribe (keep original language)")
    print("   2. Translate (convert to English)")
    
    while True:
        choice = input("Enter choice (1 or 2): ").strip()
        if choice == "1":
            task = "transcribe"
            break
        elif choice == "2":
            task = "translate"
            break
        else:
            print("Please enter 1 or 2")
    
    # Process the video
    print(f"\n🚀 Starting processing...")
    result = process_video(video_path, task=task)
    
    if result["success"]:
        print(f"\n🎉 Processing completed successfully!")
        
        # Ask if user wants to open output folder
        try:
            import subprocess
            import sys
            if sys.platform == "win32":
                choice = input(f"\n📂 Open output folder? (y/n): ").lower()
                if choice == 'y':
                    subprocess.run(["explorer", os.path.dirname(result["srt_file"])])
        except:
            pass
    else:
        print(f"\n💥 Processing failed: {result['error']}")
        
    print(f"\nPress Enter to exit...")
    input()