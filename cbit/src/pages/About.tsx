import React from 'react'

const About: React.FC = () => {
  return (
    <div className="about-page">
      {/* Mission Section */}
      <section className="mission-section">
        <div className="container-narrow">
          <div className="card">
            <h1>About Automated Caption Generator</h1>
            <p className="lead">We're revolutionizing content creation with three specialized AI-powered models that make your media more engaging, accessible, and shareable across all platforms.</p>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="tech-section">
        <div className="container-narrow">
          <h2 className="section-title">Our Technology</h2>
          <div className="tech-grid">
            <div className="tech-card card">
              <h3>🧠 Advanced AI Models</h3>
              <p>Our models are trained on diverse datasets to understand context, humor, and visual elements across different content types.</p>
            </div>
            <div className="tech-card card">
              <h3>⚡ Real-time Processing</h3>
              <p>Stream captions as they're generated, providing instant feedback and allowing for interactive content creation.</p>
            </div>
            <div className="tech-card card">
              <h3>🌍 Multi-language Support</h3>
              <p>Generate captions in multiple languages with culturally appropriate context and humor.</p>
            </div>
            <div className="tech-card card">
              <h3>🎨 Style Customization</h3>
              <p>Choose from various caption styles - from viral memes to professional summaries.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Model Details */}
      <section className="models-section">
        <div className="container-narrow">
          <h2 className="section-title">Our Models</h2>
          
          <div className="model-detail card">
            <h3>Image Caption Streaming Model</h3>
            <p><strong>Purpose:</strong> Generate continuous, contextual captions for static images in real-time.</p>
            <div className="model-features">
              <h4>Key Features:</h4>
              <ul>
                <li>Real-time streaming caption generation</li>
                <li>Context-aware meme creation</li>
                <li>Visual element recognition</li>
                <li>Style adaptation (meme, casual, formal, aesthetic)</li>
                <li>Multi-language output</li>
              </ul>
            </div>
            <div className="model-use-cases">
              <h4>Use Cases:</h4>
              <ul>
                <li>Social media content creation</li>
                <li>Meme generation for marketing</li>
                <li>Accessibility captions for images</li>
                <li>Interactive content experiences</li>
              </ul>
            </div>
          </div>

          <div className="model-detail card">
            <h3>Continuous Video Caption Model</h3>
            <p><strong>Purpose:</strong> Generate timestamped captions throughout the video with multilingual translation support.</p>
            <div className="model-features">
              <h4>Key Features:</h4>
              <ul>
                <li>Continuous timestamped caption generation</li>
                <li>Input/output language selection</li>
                <li>Real-time translation capabilities</li>
                <li>Multiple export formats (SRT, VTT)</li>
                <li>Style customization options</li>
              </ul>
            </div>
            <div className="model-use-cases">
              <h4>Use Cases:</h4>
              <ul>
                <li>Educational content subtitling</li>
                <li>International content localization</li>
                <li>Accessibility compliance</li>
                <li>Media production workflows</li>
              </ul>
            </div>
          </div>

          <div className="model-detail card">
            <h3>Video Summary Caption Model</h3>
            <p><strong>Purpose:</strong> Analyze entire videos and generate a single comprehensive caption or summary.</p>
            <div className="model-features">
              <h4>Key Features:</h4>
              <ul>
                <li>Whole-video content analysis</li>
                <li>Scene and dialogue understanding</li>
                <li>Narrative summarization</li>
                <li>Tone and mood detection</li>
                <li>Customizable output length</li>
              </ul>
            </div>
            <div className="model-use-cases">
              <h4>Use Cases:</h4>
              <ul>
                <li>Video platform descriptions</li>
                <li>Content moderation summaries</li>
                <li>Accessibility transcriptions</li>
                <li>Marketing copy generation</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Implementation */}
      <section className="implementation-section">
        <div className="container-narrow">
          <div className="card">
            <h2>Technical Implementation</h2>
            <p className="muted">This is a demo interface showcasing the capabilities of our caption generation models.</p>
            
            <h3>Current Implementation</h3>
            <ul>
              <li><strong>Frontend:</strong> React + TypeScript with responsive design</li>
              <li><strong>Mock API:</strong> Simulated streaming and generation for demonstration</li>
              <li><strong>Routing:</strong> Multi-page application with dedicated model interfaces</li>
            </ul>

            <h3>Production Integration</h3>
            <p className="muted">To use with real models, replace the mock API with your endpoints:</p>
            <ul>
              <li><strong>Streaming:</strong> Use Server-Sent Events or WebSockets for real-time caption delivery</li>
              <li><strong>Video Processing:</strong> Implement asynchronous job processing with status polling</li>
              <li><strong>Authentication:</strong> Add API keys and user management</li>
              <li><strong>Storage:</strong> Integrate with cloud storage for media uploads</li>
            </ul>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="faq-section">
        <div className="container-narrow">
          <h2 className="section-title">Frequently Asked Questions</h2>
          <div className="faq-grid">
            <div className="faq-item card">
              <h3>How accurate are the captions?</h3>
              <p>Our AI models are continuously trained and refined to provide contextually relevant and engaging captions with high accuracy.</p>
            </div>
            <div className="faq-item card">
              <h3>What file formats are supported?</h3>
              <p>We support common image formats (JPEG, PNG, WebP) and video formats (MP4, AVI, MOV) with plans to expand support.</p>
            </div>
            <div className="faq-item card">
              <h3>Is my content secure?</h3>
              <p>All uploads are processed securely and can be configured to delete automatically after processing completes.</p>
            </div>
            <div className="faq-item card">
              <h3>Can I customize the caption style?</h3>
              <p>Yes! Choose from meme, casual, formal, or aesthetic styles, with support for multiple languages.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default About
