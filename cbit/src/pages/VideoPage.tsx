import React, { useState } from 'react'
import VideoCaptionGenerator from '../components/VideoCaptionGenerator'
import SettingsPanel, { CaptionOptions } from '../components/SettingsPanel'

const VideoPage: React.FC = () => {
  const [options, setOptions] = useState<CaptionOptions>({ language: 'en', style: 'meme' })

  return (
    <div className="model-page">
      {/* Page Header */}
      <section className="model-header">
        <div className="container-narrow">
          <div className="header-content">
            <h1>Video Summary Caption</h1>
            <p className="lead">Upload videos and get a single, comprehensive AI-generated caption that summarizes the entire content</p>
          </div>
        </div>
      </section>

      {/* Main Tool Section */}
      <section className="tool-section">
        <div className="container-wide">
          <div className="page-layout">
            <section className="left">
              <VideoCaptionGenerator options={options} />
            </section>

            <aside className="right">
              <SettingsPanel options={options} onChange={setOptions} />
              
              <div className="tips-panel panel">
                <h3>💡 Best Practices</h3>
                <ul className="tips-list">
                  <li>Clear audio improves caption quality</li>
                  <li>Shorter videos process faster</li>
                  <li>Different styles suit different platforms</li>
                  <li>Check language settings for accuracy</li>
                </ul>
              </div>

              <div className="info-panel panel">
                <h3>📊 Processing Info</h3>
                <p className="muted">Video analysis includes:</p>
                <ul className="feature-list">
                  <li>Audio transcription</li>
                  <li>Visual scene analysis</li>
                  <li>Context understanding</li>
                  <li>Sentiment detection</li>
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-showcase">
        <div className="container-narrow">
          <h2 className="section-title">Advanced Video Analysis</h2>
          <div className="showcase-grid">
            <div className="showcase-item card">
              <h3>🎬 Scene Understanding</h3>
              <p>AI analyzes visual scenes, transitions, and key moments throughout the video</p>
            </div>
            <div className="showcase-item card">
              <h3>🎵 Audio Processing</h3>
              <p>Transcribes speech, identifies music, and understands audio context</p>
            </div>
            <div className="showcase-item card">
              <h3>📝 Smart Summarization</h3>
              <p>Creates concise, engaging summaries that capture the video's essence</p>
            </div>
            <div className="showcase-item card">
              <h3>🎯 Platform Optimization</h3>
              <p>Generates captions optimized for different social platforms and audiences</p>
            </div>
          </div>
        </div>
      </section>

      {/* Supported Formats */}
      <section className="formats-section">
        <div className="container-narrow">
          <div className="card">
            <h2>Supported Video Formats</h2>
            <div className="formats-grid">
              <div className="format-item">
                <strong>MP4</strong>
                <span className="muted">Most common, best compatibility</span>
              </div>
              <div className="format-item">
                <strong>AVI</strong>
                <span className="muted">High quality, larger file sizes</span>
              </div>
              <div className="format-item">
                <strong>MOV</strong>
                <span className="muted">Apple format, good quality</span>
              </div>
              <div className="format-item">
                <strong>WebM</strong>
                <span className="muted">Web-optimized format</span>
              </div>
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
              <div className="use-case-icon">🎥</div>
              <h3>Content Creators</h3>
              <p>Generate engaging descriptions for YouTube, TikTok, and other platforms</p>
            </div>
            <div className="use-case card">
              <div className="use-case-icon">🏢</div>
              <h3>Businesses</h3>
              <p>Create professional captions for training videos and presentations</p>
            </div>
            <div className="use-case-card">
              <div className="use-case-icon">📚</div>
              <h3>Education</h3>
              <p>Generate accessible captions and summaries for educational content</p>
            </div>
            <div className="use-case card">
              <div className="use-case-icon">📱</div>
              <h3>Social Media</h3>
              <p>Create scroll-stopping captions that increase engagement and reach</p>
            </div>
          </div>
        </div>
      </section>

      {/* Processing Timeline */}
      <section className="timeline-section">
        <div className="container-narrow">
          <h2 className="section-title">How Video Processing Works</h2>
          <div className="timeline">
            <div className="timeline-step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Upload & Validation</h3>
                <p>Video is uploaded securely and validated for format and size</p>
              </div>
            </div>
            <div className="timeline-step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Audio Extraction</h3>
                <p>Speech is transcribed and audio context is analyzed</p>
              </div>
            </div>
            <div className="timeline-step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Visual Analysis</h3>
                <p>Key frames are analyzed for scenes, objects, and activities</p>
              </div>
            </div>
            <div className="timeline-step">
              <div className="step-number">4</div>
              <div className="step-content">
                <h3>Caption Generation</h3>
                <p>AI synthesizes audio and visual data into engaging captions</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default VideoPage
