HTF25-Team-001


The platform is built using:

Frontend: React.js for video upload and preview.
Backend: Flask manages AI processing and caption generation.
Models: Whisper, Maverick1713, and Indic Transliteration.
Tools: FFmpeg for audio/video handling.
Flow: Upload → Audio extraction → AI transcription → Translation/Transliteration → Caption styling → Merge back into video.


WORKING: 

Here’s how it works:
The backend extracts audio from videos using FFmpeg.
Speech recognition is handled by OpenAI Whisper for general audio, and Maverick1713 for Telugu.
Captions are automatically generated in multiple languages and styles — formal, meme, aesthetic.
Finally, captions are merged into the video and also exported as .srt files.

Everything happens automatically, making the process seamless for the user.


RESULTS:

Synchronized captions in Telugu, Hindi, and English.

Creative styles — meme, formal, aesthetic.

Accurate timestamps and readable formatting.
