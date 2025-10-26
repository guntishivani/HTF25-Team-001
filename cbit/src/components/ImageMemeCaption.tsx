import React, { useRef, useState } from 'react'
import { generateGeminiCaption, checkGeminiBackendHealth } from '../api'
import type { CaptionOptions } from './SettingsPanel'

type Props = { options: CaptionOptions }

const ImageMemeCaption: React.FC<Props> = ({ options }) => {
  const fileRef = useRef<HTMLInputElement | null>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [caption, setCaption] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isBackendAvailable, setIsBackendAvailable] = useState<boolean | null>(null)

  // Check backend availability on component mount
  React.useEffect(() => {
    checkGeminiBackendHealth().then(setIsBackendAvailable)
  }, [])

  const onChoose = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files && e.target.files[0]
    if (!f) return
    
    setImageUrl(URL.createObjectURL(f))
    setImageFile(f)
    setCaption(null)
    setError(null)
  }

  const handleGenerateCaption = async () => {
    if (!imageFile) return
    
    setLoading(true)
    setError(null)
    
    try {
      const generatedCaption = await generateGeminiCaption(imageFile, options)
      setCaption(generatedCaption)
    } catch (err) {
      console.error('Error generating caption:', err)
      setError(err instanceof Error ? err.message : 'Failed to generate caption')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="card" aria-labelledby="image-caption-title">
      <h2 id="image-caption-title">Image Caption Generator</h2>

      <div className="uploader">
        <input
          ref={fileRef}
          aria-label="Upload image"
          type="file"
          accept="image/*"
          onChange={onChoose}
          style={{ display: 'none' }}
        />
        <button
          onClick={() => fileRef.current?.click()}
          className="btn"
          disabled={loading}
        >
          Upload Image
        </button>
        
        {imageFile && (
          <button
            onClick={handleGenerateCaption}
            className="btn"
            disabled={loading || !isBackendAvailable}
            style={{
              marginLeft: '12px',
              backgroundColor: loading ? '#6c757d' : '#28a745',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '4px',
              cursor: loading || !isBackendAvailable ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: 'bold'
            }}
          >
            {loading ? '⏳ Generating...' : '✨ Generate Caption'}
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
          <strong>⚠️ Gemini Backend Not Available:</strong> Please start the Gemini backend server on port 5001.
          <br />
          <code>python backend\gemini_app.py</code>
        </div>
      )}

      <div className="preview">
        {imageUrl ? (
          <div className="image-wrap">
            <img src={imageUrl} alt="Uploaded preview" />
          </div>
        ) : (
          <div className="placeholder">No image uploaded — preview appears here.</div>
        )}
      </div>

      {/* Display status and caption */}
      {loading && <p className="muted">🤖 Generating caption with AI...</p>}
      
      {error && (
        <div style={{
          backgroundColor: '#f8d7da',
          border: '1px solid #f5c2c7',
          borderRadius: '4px',
          padding: '12px',
          margin: '12px 0',
          color: '#842029'
        }}>
          <strong>❌ Error:</strong> {error}
        </div>
      )}

      {caption && !loading && (
        <div style={{ marginTop: '20px' }}>
          <h3 style={{ marginBottom: '16px', color: '#2c3e50' }}>Generated Caption Options</h3>
          <div style={{
            padding: '0',
            backgroundColor: 'transparent',
            borderRadius: '8px'
          }}>
            {caption.split('\n').filter(line => line.trim()).map((line, index) => {
              // Check if line starts with "Option" or "**Option"
              const isOption = line.trim().match(/^(\*\*)?Option\s+\d+/i);
              
              // Parse markdown bold (**text**)
              const renderLine = (text: string) => {
                const parts = text.split(/(\*\*.*?\*\*)/g);
                return parts.map((part, i) => {
                  if (part.startsWith('**') && part.endsWith('**')) {
                    return <strong key={i}>{part.slice(2, -2)}</strong>;
                  }
                  return <span key={i}>{part}</span>;
                });
              };
              
              if (isOption) {
                return (
                  <div 
                    key={index} 
                    style={{
                      padding: '16px 20px',
                      marginBottom: '12px',
                      backgroundColor: '#f0f8ff',
                      border: '2px solid #b3d9ff',
                      borderLeft: '5px solid #2196f3',
                      borderRadius: '8px',
                      fontSize: '15px',
                      lineHeight: '1.6',
                      color: '#2c3e50',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
                      transition: 'all 0.2s ease',
                      cursor: 'default'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.12)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.backgroundColor = '#e3f2fd';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.08)';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.backgroundColor = '#f0f8ff';
                    }}
                  >
                    {renderLine(line)}
                  </div>
                );
              }
              
              return null;
            })}
          </div>
        </div>
      )}
    </section>
  )
}

export default ImageMemeCaption
