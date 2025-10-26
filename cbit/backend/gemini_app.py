# -------------------------
# Gemini-Based Caption Generator - Flask Backend
# -------------------------

from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
import time
import os
from werkzeug.utils import secure_filename

# --- CONFIGURATION ---
genai.configure(api_key="AIzaSyA96d_vDh7S_3KIb8LNAkKGjD2FVS99q6k")
model = genai.GenerativeModel("gemini-2.0-flash-exp")

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend connection

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Language mapping - Gemini expects full language names
LANGUAGE_MAP = {
    'te': 'Telugu',
    'hi': 'Hindi',
    'en': 'English',
    'ta': 'Tamil',
    'ml': 'Malayalam'
}

# -------------------------
# Flask Routes
# -------------------------

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint for frontend"""
    return jsonify({
        "status": "healthy",
        "message": "Gemini caption generator backend is running"
    })

@app.route('/')
def home():
    return jsonify({"message": "Social Media Caption Generator API is running!"})

@app.route('/generate-gemini-caption', methods=['POST'])
def generate_caption():
    """Generate caption using Gemini AI for images and videos"""
    temp_path = None
    
    try:
        print("\n" + "=" * 60)
        print("📥 NEW REQUEST: /generate-gemini-caption")
        print("=" * 60)
        
        # --- Step 1: Get inputs ---
        file = request.files.get('file')
        caption_style = request.form.get('style', 'funny').strip().lower()
        language_code = request.form.get('language', 'en').strip().lower()
        
        # Convert language code to full name
        language = LANGUAGE_MAP.get(language_code, 'English')
        
        if not file:
            return jsonify({"error": "No file uploaded"}), 400

        print(f"📄 File: {file.filename}")
        print(f"🎨 Style: {caption_style}")
        print(f"🌍 Language: {language} ({language_code})")

        # Save temporarily
        filename = secure_filename(file.filename)
        temp_path = os.path.join(UPLOAD_FOLDER, "temp_" + filename)
        file.save(temp_path)
        print(f"💾 Saved to: {temp_path}")

        # --- Step 2: Upload to Gemini ---
        print(f"⬆️  Uploading to Gemini...")
        uploaded_file = genai.upload_file(temp_path)
        print(f"✅ Uploaded to Gemini: {uploaded_file.name}")
        print(f"📊 State: {uploaded_file.state}")

        # --- Step 3: Wait until ACTIVE ---
        max_wait = 60  # 60 seconds max wait
        wait_time = 0
        while uploaded_file.state.name == "PROCESSING":
            if wait_time >= max_wait:
                return jsonify({"error": "File processing timeout"}), 500
            
            print(f"⏳ Processing... ({wait_time}s)")
            time.sleep(2)
            wait_time += 2
            uploaded_file = genai.get_file(uploaded_file.name)

        if uploaded_file.state.name != "ACTIVE":
            return jsonify({"error": f"File not active! State = {uploaded_file.state.name}"}), 500

        print(f"✅ File is ACTIVE, generating caption...")

        # --- Step 4: Generate prompt based on style ---
        style_prompts = {
            'funny': f"""Generate 4 different hilarious and witty social media captions in {language} for this image/video.
Format your response as:
Option 1: [caption]
Option 2: [caption]
Option 3: [caption]
Option 4: [caption]

Make each option unique with different humor styles (wordplay, observational, self-deprecating, situational). Keep each caption short and punchy.""",
            
            'casual': f"""Generate 4 different relaxed, friendly social media captions in {language} for this image/video.
Format your response as:
Option 1: [caption]
Option 2: [caption]
Option 3: [caption]
Option 4: [caption]

Use casual, conversational language as if talking to a friend. Keep each caption natural and easy-going.""",
            
            'formal': f"""Generate 4 different professional and sophisticated social media captions in {language} for this image/video.
Format your response as:
Option 1: [caption]
Option 2: [caption]
Option 3: [caption]
Option 4: [caption]

Use proper grammar and formal tone suitable for business contexts. Be concise and clear.""",
            
            'meme': f"""Generate 4 different internet meme-style captions in {language} for this image/video.
Format your response as:
Option 1: [caption]
Option 2: [caption]
Option 3: [caption]
Option 4: [caption]

Use meme culture references, trending phrases, and emoji. Make each caption relatable and shareable."""
        }
        
        prompt = style_prompts.get(caption_style, style_prompts['funny'])
        
        print(f"🤖 Prompt: {prompt[:100]}...")

        # --- Step 5: Generate caption ---
        print(f"🎬 Generating caption with Gemini...")
        response = model.generate_content(
            [prompt, uploaded_file],
            request_options={"timeout": 300}
        )

        # --- Step 6: Return caption ---
        caption = response.text.strip()
        
        # Clean up temp file
        if os.path.exists(temp_path):
            os.remove(temp_path)
            print(f"🗑️  Cleaned up temp file")
        
        print(f"\n📝 Generated caption:")
        print(f"   {caption}")
        print("=" * 60 + "\n")
        
        return jsonify({
            "success": True,
            "language": language,
            "language_code": language_code,
            "style": caption_style,
            "caption": caption
        })

    except Exception as e:
        # Cleanup on error
        if temp_path and os.path.exists(temp_path):
            os.remove(temp_path)
        
        print(f"❌ ERROR: {str(e)}")
        print("=" * 60 + "\n")
        return jsonify({"error": str(e)}), 500

# --- RUN SERVER ---
if __name__ == '__main__':
    print("\n" + "=" * 60)
    print("🎬 GEMINI CAPTION GENERATOR BACKEND SERVER")
    print("=" * 60)
    print("📡 Server starting on http://127.0.0.1:5001")
    print("🔗 Frontend should connect to http://localhost:5001")
    print("🤖 Using Google Gemini 2.0 Flash Exp model")
    print("=" * 60 + "\n")
    app.run(host='0.0.0.0', port=5001, debug=True)
