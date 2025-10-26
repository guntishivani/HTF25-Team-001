import React from 'react'
import { Link } from 'react-router-dom'

const Home: React.FC = () => {
  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container-narrow">
          <div className="hero-content">
            <h1 className="hero-title">Automated Caption Generator</h1>
            <p className="hero-subtitle">Transform your content with AI-powered captions that engage, entertain, and amplify your message</p>
            <div className="hero-actions">
              <Link to="/image" className="btn-primary">Try Image Model</Link>
              <Link to="/continuous-video" className="btn-secondary">Try Continuous Video</Link>
              <Link to="/video" className="btn-secondary">Try Video Summary</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Overview */}
      <section className="features-section">
        <div className="container-narrow">
          <h2 className="section-title">Three Powerful Models</h2>
          <div className="features-grid three-cols">
            <Link to="/image" className="feature-card card">
              <div className="feature-icon">🖼️</div>
              <h3>Image Caption Streaming</h3>
              <p className="muted">Upload any image and watch as AI generates continuous, contextual meme-style captions in real-time</p>
              <ul className="feature-list">
                <li>Real-time caption streaming</li>
                <li>Meme-style formatting</li>
                <li>Multiple language support</li>
                <li>Custom style options</li>
              </ul>
              <div className="cta">Explore Image Model →</div>
            </Link>

            <Link to="/continuous-video" className="feature-card card">
              <div className="feature-icon">�</div>
              <h3>Continuous Video Captions</h3>
              <p className="muted">Generate timestamped captions throughout your video with multilingual translation support</p>
              <ul className="feature-list">
                <li>Continuous timestamped captions</li>
                <li>Multilingual translation</li>
                <li>SRT/VTT export formats</li>
                <li>Language detection</li>
              </ul>
              <div className="cta">Explore Continuous Video →</div>
            </Link>

            <Link to="/video" className="feature-card card">
              <div className="feature-icon">🎥</div>
              <h3>Video Summary Caption</h3>
              <p className="muted">Process entire videos to create comprehensive, engaging single captions and summaries</p>
              <ul className="feature-list">
                <li>Whole-video analysis</li>
                <li>Smart summarization</li>
                <li>Context-aware captions</li>
                <li>Single comprehensive caption</li>
              </ul>
              <div className="cta">Explore Video Summary →</div>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="process-section">
        <div className="container-narrow">
          <h2 className="section-title">How It Works</h2>
          <div className="process-steps">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Upload Content</h3>
              <p className="muted">Choose your image or video file and upload it to our secure processing system</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>AI Processing</h3>
              <p className="muted">Our advanced AI models analyze your content and understand the context</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>Get Captions</h3>
              <p className="muted">Receive engaging, contextual captions tailored to your content and style preferences</p>
            </div>
          </div>
        </div>
      </section>

      {/* Style Options */}
      <section className="styles-section">
        <div className="container-narrow">
          <h2 className="section-title">Multiple Styles Available</h2>
          <div className="styles-grid">
            <div className="style-sample card">
              <h4>Meme Style</h4>
              <div className="sample-caption meme">"When you realize it's Monday"</div>
              <p className="muted">Perfect for social media and entertainment</p>
            </div>
            <div className="style-sample card">
              <h4>Casual Style</h4>
              <div className="sample-caption casual">"A relaxed moment captured perfectly"</div>
              <p className="muted">Friendly and approachable tone</p>
            </div>
            <div className="style-sample card">
              <h4>Formal Style</h4>
              <div className="sample-caption formal">"Professional presentation of key concepts"</div>
              <p className="muted">Business and academic contexts</p>
            </div>
            <div className="style-sample card">
              <h4>Aesthetic Style</h4>
              <div className="sample-caption aesthetic">"Moody visuals with cinematic appeal"</div>
              <p className="muted">Artistic and atmospheric descriptions</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container-narrow">
          <div className="cta-content card">
            <h2>Ready to Get Started?</h2>
            <p className="muted">Choose your preferred model and start generating captions in seconds</p>
            <div className="cta-actions">
              <Link to="/image" className="btn-primary">Start with Images</Link>
              <Link to="/continuous-video" className="btn-primary">Continuous Video Captions</Link>
              <Link to="/video" className="btn-primary">Video Summaries</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
