import React from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import './styles.css'
import Home from './pages/Home'
import ImagePage from './pages/ImagePage'
import VideoPage from './pages/VideoPage'
import ContinuousVideoPage from './pages/ContinuousVideoPage'
import About from './pages/About'

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="app-root">
        <header className="topbar">
          <div className="topbar-inner">
            <h1 className="brand">Automated Caption Generator</h1>
            <nav className="nav">
              <Link to="/" className="nav-link">Home</Link>
              <Link to="/image" className="nav-link">Image Model</Link>
              <Link to="/continuous-video" className="nav-link">Continuous Video</Link>
              <Link to="/video" className="nav-link">Video Summary</Link>
              <Link to="/about" className="nav-link">About</Link>
            </nav>
          </div>
          <p className="tag">AI-powered meme & video captions — responsive demo</p>
        </header>

        <main className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/image" element={<ImagePage />} />
            <Route path="/continuous-video" element={<ContinuousVideoPage />} />
            <Route path="/video" element={<VideoPage />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>

        <footer className="footer">
          <small>Demo UI — replace mock API with your models for production.</small>
        </footer>
      </div>
    </BrowserRouter>
  )
}

export default App
