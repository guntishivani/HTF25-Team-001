import React, { useRef, useState } from 'react'
import { generateContinuousVideoCaptions, generateVideoWithCaptions, downloadSRTFile, checkBackendHealth } from '../api'

export type LanguageOptions = {
  inputLanguage: string
  outputLanguage: string
  style: 'funny' | 'casual' | 'formal' | 'meme'
}

const ContinuousVideoPage: React.FC = () => {
  const fileRef = useRef<HTMLInputElement | null>(null)
  const [options, setOptions] = useState<LanguageOptions>({
    inputLanguage: 'en',
    outputLanguage: 'en',
    style: 'casual'
  })
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [captions, setCaptions] = useState<Array<{time: string, text: string}>>([])
  const [processing, setProcessing] = useState(false)
  const [status, setStatus] = useState<string | null>(null)
  const [isBackendAvailable, setIsBackendAvailable] = useState<boolean | null>(null)
  const [videoWithSubtitles, setVideoWithSubtitles] = useState<{filename: string, url: string} | null>(null)
  const [fullCaptions, setFullCaptions] = useState<string | null>(null)

  // Check backend availability on component mount
  React.useEffect(() => {
    checkBackendHealth().then(setIsBackendAvailable)
  }, [])

  const onChoose = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0]
    if (!file) return
    
    setVideoFile(file)
    setVideoUrl(URL.createObjectURL(file))
    setCaptions([])
    setVideoWithSubtitles(null)
    setStatus(null)
  }

  const handleGenerateCaptions = async () => {
    if (!videoFile) return
    
    setProcessing(true)
    setStatus('Processing video and generating continuous captions...')
    
    try {
      const generatedCaptions = await generateContinuousVideoCaptions(videoFile, options)
      setCaptions(generatedCaptions)
      setStatus('Continuous captions generated successfully!')
    } catch (err) {
      setStatus('Failed to generate continuous captions')
    } finally {
      setProcessing(false)
    }
  }

  const handleDownloadSRT = async () => {
    if (captions.length === 0) return
    
    // Convert captions to SRT format
    let srtContent = ''
    captions.forEach((caption, index) => {
      const startTime = caption.time + ',000'
      const endTime = index < captions.length - 1 
        ? captions[index + 1].time + ',000'
        : caption.time.replace(/(\d{2}):(\d{2}):(\d{2})/, (_, h, m, s) => 
            `${h}:${m}:${String(parseInt(s) + 3).padStart(2, '0')},000`)
      
      srtContent += `${index + 1}\n${startTime} --> ${endTime}\n${caption.text}\n\n`
    })
    
    try {
      setStatus('Preparing SRT download...')
      await downloadSRTFile(srtContent)
      setStatus('SRT file downloaded successfully!')
    } catch (err) {
      console.error('Download error:', err)
      setStatus('Failed to download SRT file')
    }
  }

  const handleDownloadVTT = () => {
    if (captions.length === 0) return
    
    // Convert captions to VTT format
    let vttContent = 'WEBVTT\n\n'
    captions.forEach((caption, index) => {
      const startTime = caption.time + '.000'
      const endTime = index < captions.length - 1 
        ? captions[index + 1].time + '.000'
        : caption.time.replace(/(\d{2}):(\d{2}):(\d{2})/, (_, h, m, s) => 
            `${h}:${m}:${String(parseInt(s) + 3).padStart(2, '0')}.000`)
      
      vttContent += `${startTime} --> ${endTime}\n${caption.text}\n\n`
    })
    
    // Create and download VTT file
    const blob = new Blob([vttContent], { type: 'text/vtt' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'captions.vtt'
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
    
    setStatus('VTT file downloaded successfully!')
  }

  const handleGenerateVideoWithSubtitles = async () => {
    if (!videoFile) {
      setStatus('Please upload a video first')
      return
    }

    try {
      setStatus('Generating video with embedded subtitles...')
      const result = await generateVideoWithCaptions(videoFile, { 
        style: options.style,
        language: 'en'
      })
      setFullCaptions(result.captions)
      setVideoWithSubtitles({
        filename: result.filename,
        url: result.downloadUrl
      })
      setStatus('✅ Video with embedded subtitles generated successfully!')
    } catch (err) {
      console.error('Video generation error:', err)
      setStatus('Failed to generate video with subtitles')
    }
  }

  const handleDownloadVideoWithSubtitles = () => {
    if (!videoWithSubtitles) return
    
    const link = document.createElement('a')
    link.href = videoWithSubtitles.url
    link.download = videoWithSubtitles.filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    setStatus('Video downloaded successfully!')
  }

  return (
    <div className="model-page">
      {/* Page Header */}
      <section className="model-header">
        <div className="container-narrow">
          <div className="header-content">
            <h1>Continuous Video Captioning</h1>
            <p className="lead">Generate continuous, timestamped captions throughout your video with multilingual support</p>
          </div>
        </div>
      </section>

      {/* Main Tool Section */}
      <section className="tool-section">
        <div className="container-wide">
          <div className="page-layout">
            <section className="left">
              <div className="card">
                <h2>Upload Video for Continuous Captions</h2>
                
                <div className="uploader">
                  <input
                    ref={fileRef}
                    aria-label="Upload video"
                    type="file"
                    accept="video/*"
                    onChange={onChoose}
                    style={{ display: 'none' }}
                  />
                  <button 
                    onClick={() => fileRef.current?.click()} 
                    className="btn-primary"
                    disabled={processing}
                  >
                    Upload Video
                  </button>
                  
                  {videoFile && captions.length === 0 && (
                    <button 
                      onClick={handleGenerateCaptions}
                      className="btn-primary"
                      disabled={processing || !isBackendAvailable}
                      style={{
                        marginLeft: '12px',
                        backgroundColor: processing ? '#6c757d' : '#28a745',
                        cursor: processing || !isBackendAvailable ? 'not-allowed' : 'pointer'
                      }}
                    >
                      {processing ? '⏳ Processing...' : '✨ Generate Captions'}
                    </button>
                  )}
                </div>

                {isBackendAvailable === false && (
                  <div className="warning-banner" style={{
                    backgroundColor: '#fff3cd',
                    border: '1px solid #ffeaa7',
                    borderRadius: '4px',
                    padding: '12px',
                    margin: '12px 0',
                    color: '#856404'
                  }}>
                    <strong>⚠️ Backend Not Available:</strong> Using mock API. 
                    Start the backend server for real caption generation.
                  </div>
                )}

                {status && <p className="status-message">{status}</p>}

                {videoUrl && (
                  <div className="video-preview">
                    <video src={videoUrl} controls width="100%" />
                  </div>
                )}

                {captions.length > 0 && (
                  <div className="captions-output">
                    <h3>Captions Generated Successfully</h3>
                    {/* Caption list hidden - only show export options */}
                    
                    <div className="export-options">
                      <button 
                        className="btn-secondary"
                        onClick={handleDownloadSRT}
                        style={{ marginRight: '12px' }}
                      >
                        Download SRT
                      </button>
                      <button 
                        className="btn-secondary"
                        onClick={handleDownloadVTT}
                      >
                        Download VTT
                      </button>
                      
                      {isBackendAvailable && (
                        <button 
                          className="btn-primary"
                          onClick={handleGenerateVideoWithSubtitles}
                          style={{ 
                            marginLeft: '12px',
                            backgroundColor: '#28a745' 
                          }}
                        >
                          🎬 Generate Video with Embedded Subtitles
                        </button>
                      )}
                    </div>

                    {videoWithSubtitles && (
                      <div style={{
                        marginTop: '20px',
                        padding: '16px',
                        backgroundColor: '#d4edda',
                        border: '1px solid #c3e6cb',
                        borderRadius: '4px'
                      }}>
                        <h4 style={{ margin: '0 0 12px 0', color: '#155724' }}>
                          ✅ Video with Embedded Subtitles Ready!
                        </h4>
                        
                        {/* Video Preview */}
                        <div style={{ marginBottom: '16px' }}>
                          <video 
                            controls 
                            style={{ 
                              width: '100%', 
                              borderRadius: '8px',
                              border: '2px solid #c3e6cb',
                              backgroundColor: '#000'
                            }}
                          >
                            <source src={videoWithSubtitles.url} type="video/x-matroska" />
                            Your browser does not support the video tag.
                          </video>
                          <p style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
                            ℹ️ Subtitles are embedded in the video. Enable them in your media player.
                          </p>
                        </div>

                        <button 
                          className="btn-primary"
                          onClick={handleDownloadVideoWithSubtitles}
                          style={{ 
                            backgroundColor: '#007bff' 
                          }}
                        >
                          📥 Download Video with Subtitles (.mkv)
                        </button>
                        
                        <p style={{ fontSize: '13px', color: '#155724', marginTop: '12px' }}>
                          <strong>File:</strong> {videoWithSubtitles.filename}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </section>

            <aside className="right">
              <div className="panel">
                <h3>Language & Style Settings</h3>
                
                <label className="field">
                  <span>Input Video Language</span>
                  <select
                    value={options.inputLanguage}
                    onChange={(e) => setOptions({...options, inputLanguage: e.target.value})}
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                    <option value="zh">Chinese</option>
                    <option value="ja">Japanese</option>
                    <option value="hi">Hindi</option>
                    <option value="ar">Arabic</option>
                  </select>
                </label>

                <label className="field">
                  <span>Output Caption Language</span>
                  <select
                    value={options.outputLanguage}
                    onChange={(e) => setOptions({...options, outputLanguage: e.target.value})}
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                    <option value="zh">Chinese</option>
                    <option value="ja">Japanese</option>
                    <option value="hi">Hindi</option>
                    <option value="ar">Arabic</option>
                  </select>
                </label>

                <label className="field">
                  <span>Caption Style</span>
                  <select
                    value={options.style}
                    onChange={(e) => setOptions({...options, style: e.target.value as any})}
                  >
                    <option value="funny">Funny</option>
                    <option value="casual">Casual</option>
                    <option value="formal">Formal</option>
                    <option value="meme">Meme</option>
                  </select>
                </label>
              </div>

              <div className="tips-panel panel">
                <h3>💡 Tips for Best Results</h3>
                <ul className="tips-list">
                  <li>Clear audio improves transcription accuracy</li>
                  <li>Choose the correct input language for better processing</li>
                  <li>Output language can be different from input for translation</li>
                  <li>Shorter videos process faster</li>
                </ul>
              </div>

              <div className="info-panel panel">
                <h3>📊 Output Formats</h3>
                <ul className="feature-list">
                  <li>SRT (SubRip Subtitle)</li>
                  <li>VTT (Web Video Text Tracks)</li>
                  <li>Timestamped text format</li>
                  <li>Multiple language support</li>
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-showcase">
        <div className="container-narrow">
          <h2 className="section-title">Continuous Video Captioning Features</h2>
          <div className="showcase-grid">
            <div className="showcase-item card">
              <h3>🌐 Multilingual Translation</h3>
              <p>Input video in one language, get captions in another. Perfect for global audiences</p>
            </div>
            <div className="showcase-item card">
              <h3>⏱️ Precise Timestamps</h3>
              <p>Every caption includes exact timing for perfect synchronization</p>
            </div>
            <div className="showcase-item card">
              <h3>📝 Multiple Formats</h3>
              <p>Export as SRT, VTT, or custom formats for any video platform</p>
            </div>
            <div className="showcase-item card">
              <h3>🎯 Context Awareness</h3>
              <p>AI understands context and generates natural, flowing captions</p>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="use-cases-section">
        <div className="container-narrow">
          <h2 className="section-title">Perfect For</h2>
          <div className="use-cases-grid">
            <div className="use-case card">
              <div className="use-case-icon">🎓</div>
              <h3>Educational Content</h3>
              <p>Create accessible subtitles for online courses and tutorials</p>
            </div>
            <div className="use-case card">
              <div className="use-case-icon">🌍</div>
              <h3>International Content</h3>
              <p>Translate video content for global audiences automatically</p>
            </div>
            <div className="use-case card">
              <div className="use-case-icon">📺</div>
              <h3>Media Production</h3>
              <p>Generate subtitles for films, shows, and streaming content</p>
            </div>
            <div className="use-case card">
              <div className="use-case-icon">♿</div>
              <h3>Accessibility</h3>
              <p>Make video content accessible to hearing-impaired audiences</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default ContinuousVideoPage