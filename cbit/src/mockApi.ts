import type { CaptionOptions } from './components/SettingsPanel'

// Mock streaming captions for an uploaded image.
// Calls the provided onCaption callback repeatedly until 10 messages sent or 15s.
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
      // Add a style-language hint to demonstrate options
      const stylePrefix = options.style === 'meme' ? '' : `[${options.style}] `
      const langSuffix = options.language === 'en' ? '' : ` (${options.language})`
      onCaption(`${stylePrefix}${base[idx]}${langSuffix}`)
      i += 1
      if (i >= 10) {
        clearInterval(interval)
        resolve()
      }
    }, 900)

    // Safety: stop after 15s
    setTimeout(() => {
      clearInterval(interval)
      resolve()
    }, 15000)
  })
}

// Mock whole-video caption generation: returns a single summary after a delay.
export function generateVideoCaption(file: File, options: CaptionOptions): Promise<string> {
  return new Promise((resolve) => {
    const simulated = {
      meme: 'A hilarious montage of real-life coding chaos — perfect for sharing.',
      casual: 'A relaxed walkthrough of key moments with friendly commentary.',
      formal: 'A concise summary highlighting the main scenes and dialogue.',
      aesthetic: 'A moody and cinematic recap emphasizing visuals and tone.'
    }

    setTimeout(() => {
      const text = simulated[options.style] || simulated.meme
      const lang = options.language !== 'en' ? ` [${options.language}]` : ''
      resolve(`${text}${lang}`)
    }, 2200 + Math.random() * 1800)
  })
}

// Mock continuous video captions with language translation support
export function generateContinuousVideoCaptions(
  file: File, 
  options: { inputLanguage: string; outputLanguage: string; style: string }
): Promise<Array<{time: string, text: string}>> {
  return new Promise((resolve) => {
    // Simulate processing time based on file size
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

      // Modify captions based on style and language options
      const styledCaptions = captions.map((caption, index) => {
        let text = caption.text
        
        // Apply style modifications
        if (options.style === 'meme') {
          const memeVersions = [
            'When you realize AI is taking over captioning 😎',
            'POV: You\'re watching the future of video accessibility',
            'That moment when captions write themselves',
            'AI go brrrr with multilingual support',
            'Caption generator: *exists* Manual work: *nervous sweating*',
            'Me: I need captions AI: Say no more fam',
            'When your video speaks 50+ languages instantly',
            'Speech recognition hitting different in 2025',
            'Translation quality: *chef\'s kiss* 👌',
            'Export formats be like: take your pick, king'
          ]
          text = memeVersions[index] || text
        } else if (options.style === 'formal') {
          text = text.replace(/let's/g, 'let us').replace(/we will/g, 'we shall')
        } else if (options.style === 'aesthetic') {
          const aestheticVersions = [
            '✨ A gentle introduction to the art of automated captioning ✨',
            '🌟 Discovering the transformative power of AI in content creation 🌟',
            '💫 Unveiling the poetry hidden within video accessibility 💫',
            '🎭 The elegant dance between human creativity and machine precision 🎭',
            '🌸 Where technology blooms into meaningful communication 🌸',
            '🌙 Fifty languages whisper stories across digital landscapes 🌙',
            '🎨 Crafting captions like brushstrokes on a canvas of understanding 🎨',
            '🔮 Advanced algorithms weaving magic through speech and vision 🔮',
            '🦋 Quality transcends linguistic boundaries with ethereal grace 🦋',
            '📜 Ancient formats meet modern dreams in perfect harmony 📜'
          ]
          text = aestheticVersions[index] || text
        }

        // Add language indicator if translation is happening
        if (options.inputLanguage !== options.outputLanguage) {
          text += ` [Translated from ${options.inputLanguage} to ${options.outputLanguage}]`
        }

        return {
          ...caption,
          text
        }
      })

      resolve(styledCaptions)
    }, processingTime)
  })
}
