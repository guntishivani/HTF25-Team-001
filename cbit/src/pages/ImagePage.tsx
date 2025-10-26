import React, { useState } from 'react'
import ImageMemeCaption from '../components/ImageMemeCaption'
import SettingsPanel, { CaptionOptions } from '../components/SettingsPanel'

const ImagePage: React.FC = () => {
  const [options, setOptions] = useState<CaptionOptions>({ language: 'en', style: 'meme' })

  return (
    <div className="model-page">
      {/* Page Header */}
      <section className="model-header">
        <div className="container-narrow">
          <div className="header-content">
            <h1>Image Caption Streaming</h1>
            <p className="lead">Upload any image and watch AI generate continuous, engaging captions in real-time</p>
          </div>
        </div>
      </section>

      {/* Main Tool Section */}
      <section className="tool-section">
        <div className="container-wide">
          <div className="page-layout">
            <section className="left">
              <ImageMemeCaption options={options} />
            </section>

            <aside className="right">
              <SettingsPanel options={options} onChange={setOptions} />
              
              <div className="tips-panel panel">
                <h3>💡 Pro Tips</h3>
                <ul className="tips-list">
                  <li>Try different styles to see how captions adapt</li>
                  <li>Images with clear subjects work best</li>
                  <li>Meme style is great for social media</li>
                  <li>Formal style works for presentations</li>
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-showcase">
        <div className="container-narrow">
          <h2 className="section-title">What Makes It Special</h2>
          <div className="showcase-grid">
            <div className="showcase-item card">
              <h3>⚡ Real-time Streaming</h3>
              <p>Watch captions appear as they're generated, creating an interactive experience</p>
            </div>
            <div className="showcase-item card">
              <h3>🎯 Context Awareness</h3>
              <p>AI understands visual elements, emotions, and context to create relevant captions</p>
            </div>
            <div className="showcase-item card">
              <h3>🎨 Style Variety</h3>
              <p>From viral memes to professional descriptions - adapt to any audience</p>
            </div>
            <div className="showcase-item card">
              <h3>🌐 Multi-language</h3>
              <p>Generate captions in multiple languages while maintaining cultural context</p>
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
              <div className="use-case-icon">📱</div>
              <h3>Social Media</h3>
              <p>Create engaging posts with witty, shareable captions that boost engagement</p>
            </div>
            <div className="use-case card">
              <div className="use-case-icon">📈</div>
              <h3>Marketing</h3>
              <p>Generate compelling captions for product images and promotional content</p>
            </div>
            <div className="use-case card">
              <div className="use-case-icon">♿</div>
              <h3>Accessibility</h3>
              <p>Provide descriptive captions for images to improve content accessibility</p>
            </div>
            <div className="use-case card">
              <div className="use-case-icon">🎮</div>
              <h3>Entertainment</h3>
              <p>Create memes and humorous content for entertainment platforms</p>
            </div>
          </div>
        </div>
      </section>

      {/* Examples Section */}
      <section className="examples-section">
        <div className="container-narrow">
          <h2 className="section-title">Example Outputs</h2>
          <div className="examples-grid">
            <div className="example-item card">
              <h4>Meme Style</h4>
              <div className="example-caption meme">"When you realize it's Monday"</div>
              <div className="example-caption meme">"That feeling when code compiles"</div>
              <div className="example-caption meme">"POV: You added one more feature"</div>
            </div>
            <div className="example-item card">
              <h4>Formal Style</h4>
              <div className="example-caption formal">"Professional presentation highlighting key concepts"</div>
              <div className="example-caption formal">"Strategic overview of quarterly results"</div>
              <div className="example-caption formal">"Detailed analysis of market trends"</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default ImagePage
