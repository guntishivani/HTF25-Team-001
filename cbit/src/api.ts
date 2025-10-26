import type { CaptionOptions } from './components/SettingsPanel'

// Backend API configuration
const API_BASE_URL = 'http://localhost:5000'
const GEMINI_API_BASE_URL = 'http://localhost:5001'

// Type definitions
interface GeminiCaptionResponse {
  success: boolean
  language: string
  language_code: string
  style: string
  caption: string
}

interface CaptionResponse {
  success: boolean
  captions: string
  segments: Array<{
    start: number
    end: number
    text: string
  }>
  language_detected: string
  message: string
}

interface VideoWithCaptionsResponse {
  success: boolean
  output_filename: string
  download_url: string
  captions: string
  segments: Array<{
    start: number
    end: number
    text: string
  }>
  language_detected: string
  message: string
}

interface ContinuousCaption {
  time: string
  text: string
}

// Helper function to check if backend is available
export async function checkBackendHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/health`)
    const data = await response.json()
    return data.status === 'healthy'
  } catch (error) {
    console.warn('Backend not available, falling back to mock API')
    return false
  }
}

// Helper function to check if Gemini backend is available
export async function checkGeminiBackendHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${GEMINI_API_BASE_URL}/health`)
    const data = await response.json()
    return data.status === 'healthy'
  } catch (error) {
    console.warn('Gemini backend not available')
    return false
  }
}

// Generate caption using Gemini for images and videos
export async function generateGeminiCaption(file: File, options: CaptionOptions): Promise<string> {
  const isGeminiAvailable = await checkGeminiBackendHealth()
  
  if (!isGeminiAvailable) {
    throw new Error('Gemini backend is not available. Please start the Gemini backend server on port 5001.')
  }

  try {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('style', options.style)
    formData.append('language', options.language)

    console.log('🚀 FRONTEND: Sending request to Gemini backend')
    console.log('   - File:', file.name)
    console.log('   - Style:', options.style)
    console.log('   - Language:', options.language)

    const response = await fetch(`${GEMINI_API_BASE_URL}/generate-gemini-caption`, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
    }

    const data: GeminiCaptionResponse = await response.json()
    
    console.log('✅ FRONTEND: Received response from Gemini backend:')
    console.log('   - Success:', data.success)
    console.log('   - Language:', data.language)
    console.log('   - Style:', data.style)
    console.log('   - Caption:', data.caption)
    
    if (!data.success) {
      throw new Error('Failed to generate caption')
    }

    return data.caption
    
  } catch (error) {
    console.error('Error generating Gemini caption:', error)
    throw error
  }
}

// Generate captions for a video file
export async function generateVideoCaption(file: File, options: CaptionOptions): Promise<string> {
  const isBackendAvailable = await checkBackendHealth()
  
  if (!isBackendAvailable) {
    // Fallback to mock API
    return generateMockVideoCaption(file, options)
  }

  try {
    const formData = new FormData()
    formData.append('video', file)
    // Always use 'translate' for non-English videos to get English captions
    // Use 'transcribe' only if explicitly transcribing in original language
    formData.append('task', 'translate')  // Changed: always translate to English by default
    formData.append('style', options.style)
    formData.append('language', options.language)

    const response = await fetch(`${API_BASE_URL}/generate-captions`, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data: CaptionResponse = await response.json()
    
    // Log frontend received data
    console.log('🎯 FRONTEND: Received response from backend:')
    console.log('   - Success:', data.success)
    console.log('   - Language detected:', data.language_detected)
    console.log('   - Number of segments:', data.segments?.length || 0)
    console.log('   - SRT content length:', data.captions?.length || 0)
    console.log('   - Message:', data.message)
    console.log('   - First 200 chars of captions:', data.captions?.substring(0, 200) + '...')
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to generate captions')
    }

    // Return the actual captions from backend
    console.log('📋 FRONTEND: Displaying actual captions from backend')
    return data.captions
    
  } catch (error) {
    console.error('Error generating video caption:', error)
    // Fallback to mock API on error
    return generateMockVideoCaption(file, options)
  }
}

// Generate continuous video captions (detailed with timestamps)
export async function generateContinuousVideoCaptions(
  file: File, 
  options: { inputLanguage: string; outputLanguage: string; style: string }
): Promise<Array<ContinuousCaption>> {
  const isBackendAvailable = await checkBackendHealth()
  
  if (!isBackendAvailable) {
    // Fallback to mock API
    return generateMockContinuousVideoCaptions(file, options)
  }

  try {
    const formData = new FormData()
    formData.append('video', file)
    formData.append('task', options.inputLanguage !== options.outputLanguage ? 'translate' : 'transcribe')
    formData.append('style', options.style)
    formData.append('language', options.outputLanguage)

    const response = await fetch(`${API_BASE_URL}/generate-captions`, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data: CaptionResponse = await response.json()
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to generate captions')
    }

    // Convert segments to continuous captions format
    const continuousCaptions: Array<ContinuousCaption> = data.segments.map(segment => {
      const minutes = Math.floor(segment.start / 60)
      const seconds = Math.floor(segment.start % 60)
      const time = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}:00`
      
      let text = segment.text
      
      // Apply style modifications
      if (options.style === 'meme') {
        text = addMemeStyle(text)
      } else if (options.style === 'aesthetic') {
        text = addAestheticStyle(text)
      }
      
      // Add translation indicator if needed
      if (options.inputLanguage !== options.outputLanguage) {
        text += ` [Translated from ${options.inputLanguage} to ${options.outputLanguage}]`
      }
      
      return { time, text }
    })

    return continuousCaptions
    
  } catch (error) {
    console.error('Error generating continuous video captions:', error)
    // Fallback to mock API on error
    return generateMockContinuousVideoCaptions(file, options)
  }
}

// Generate video with embedded captions
export async function generateVideoWithCaptions(file: File, options: CaptionOptions): Promise<{
  downloadUrl: string
  filename: string
  captions: string
}> {
  const isBackendAvailable = await checkBackendHealth()
  
  if (!isBackendAvailable) {
    throw new Error('Backend server is not available. Please start the backend server first.')
  }

  try {
    const formData = new FormData()
    formData.append('video', file)
    formData.append('task', 'translate') // Always translate to English for consistency

    const response = await fetch(`${API_BASE_URL}/generate-video-with-captions`, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data: VideoWithCaptionsResponse = await response.json()
    
    // Log frontend received video data
    console.log('🎬 FRONTEND: Received video response from backend:')
    console.log('   - Success:', data.success)
    console.log('   - Output filename:', data.output_filename)
    console.log('   - Download URL:', data.download_url)
    console.log('   - Language detected:', data.language_detected)
    console.log('   - Number of segments:', data.segments?.length || 0)
    console.log('   - SRT content length:', data.captions?.length || 0)
    console.log('   - Message:', data.message)
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to generate video with captions')
    }

    return {
      downloadUrl: `${API_BASE_URL}${data.download_url}`,
      filename: data.output_filename,
      captions: data.captions
    }
    
  } catch (error) {
    console.error('Error generating video with captions:', error)
    throw error
  }
}

// Download SRT file
export async function downloadSRTFile(srtContent: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/download-srt`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ srt_content: srtContent }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    // Create blob and download
    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'captions.srt'
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
    
  } catch (error) {
    console.error('Error downloading SRT file:', error)
    throw error
  }
}

// Helper functions for style modifications
function addMemeStyle(text: string): string {
  const memeModifiers = ['😂', '💀', '🔥', '💯', '😎', '🤔', '👀', '📱', '💻', '🎮']
  const randomModifier = memeModifiers[Math.floor(Math.random() * memeModifiers.length)]
  return `${text} ${randomModifier}`
}

function addAestheticStyle(text: string): string {
  const aestheticModifiers = ['✨', '🌙', '💫', '🌸', '🦋', '🌟', '💎', '🔮', '🌺', '🍃']
  const randomModifier = aestheticModifiers[Math.floor(Math.random() * aestheticModifiers.length)]
  return `${randomModifier} ${text} ${randomModifier}`
}

// Mock API functions (fallback when backend is not available)
async function generateMockVideoCaption(file: File, options: CaptionOptions): Promise<string> {
  return new Promise((resolve) => {
    const simulated: Record<string, string> = {
      funny: 'A hilarious and witty take on this content — guaranteed to make you laugh! 😄',
      meme: 'A hilarious montage of real-life coding chaos — perfect for sharing. 😂',
      casual: 'A relaxed walkthrough of key moments with friendly commentary.',
      formal: 'A concise summary highlighting the main scenes and dialogue.'
    }

    setTimeout(() => {
      const text = simulated[options.style] || simulated.funny
      const lang = options.language !== 'en' ? ` [${options.language}]` : ''
      resolve(`${text}${lang} (Mock API - Backend not available)`)
    }, 2200 + Math.random() * 1800)
  })
}

async function generateMockContinuousVideoCaptions(
  file: File, 
  options: { inputLanguage: string; outputLanguage: string; style: string }
): Promise<Array<ContinuousCaption>> {
  return new Promise((resolve) => {
    const processingTime = Math.min(file.size / 1000000 * 500, 5000) + 2000
    
    setTimeout(() => {
      const captions = [
        { time: '00:00:00', text: 'Welcome to our presentation on automated caption generation.' },
        { time: '00:00:05', text: 'Today we will explore how AI can transform video content.' },
        { time: '00:00:12', text: 'First, let\'s look at the current challenges in video captioning.' },
        { time: '00:00:18', text: 'Manual captioning is time-consuming and expensive.' },
        { time: '00:00:24', text: 'Our AI solution provides fast, accurate, multilingual captions.' },
        { time: '00:00:30', text: 'The system supports over 50 languages for input and output.' },
        { time: '00:00:36', text: 'Users can select different caption styles for various audiences.' },
        { time: '00:00:42', text: 'The technology uses advanced speech recognition and translation.' },
        { time: '00:00:48', text: 'Quality is maintained even when translating between languages.' },
        { time: '00:00:54', text: 'Export options include SRT, VTT, and other popular formats.' }
      ]

      const styledCaptions = captions.map((caption, index) => {
        let text = caption.text + ' (Mock API - Backend not available)'
        
        if (options.style === 'meme') {
          text = addMemeStyle(text)
        } else if (options.style === 'aesthetic') {
          text = addAestheticStyle(text)
        }
        
        if (options.inputLanguage !== options.outputLanguage) {
          text += ` [Translated from ${options.inputLanguage} to ${options.outputLanguage}]`
        }

        return { ...caption, text }
      })

      resolve(styledCaptions)
    }, processingTime)
  })
}

// Legacy function for streaming meme captions (keep for compatibility)
export function streamMemeCaptions(
  file: File,
  options: CaptionOptions,
  onCaption: (s: string) => void
): Promise<void> {
  return new Promise((resolve) => {
    const base = [
      "When you realize it's Monday",
      "That feeling when the code compiles",
      "POV: You added one more feature",
      "Me trying to act normal after coffee",
      "Caption generator: activated",
      "Plot twist: it's a template",
      "Still looks good though",
      "Frames dropping — memes rising",
      "Keep calm and ship it",
      "AI said: 'Do the thing'"
    ]

    let i = 0
    const interval = setInterval(() => {
      const idx = i % base.length
      const stylePrefix = options.style === 'meme' ? '' : `[${options.style}] `
      const langSuffix = options.language === 'en' ? '' : ` (${options.language})`
      onCaption(`${stylePrefix}${base[idx]}${langSuffix}`)
      i += 1
      if (i >= 10) {
        clearInterval(interval)
        resolve()
      }
    }, 900)

    setTimeout(() => {
      clearInterval(interval)
      resolve()
    }, 15000)
  })
}