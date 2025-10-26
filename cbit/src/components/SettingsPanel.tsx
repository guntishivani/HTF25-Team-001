import React from 'react'

export type CaptionOptions = {
  language: string
  style: 'funny' | 'casual' | 'formal' | 'meme'
}

type Props = {
  options: CaptionOptions
  onChange: (opts: CaptionOptions) => void
}

const SettingsPanel: React.FC<Props> = ({ options, onChange }) => {
  return (
    <div className="panel" aria-label="Settings panel">
      <h2>Caption Settings</h2>

      <label className="field">
        <span>Output Language</span>
        <select
          aria-label="Select output language"
          value={options.language}
          onChange={(e) => onChange({ ...options, language: e.target.value })}
        >
          <option value="te">Telugu</option>
          <option value="hi">Hindi</option>
          <option value="en">English</option>
          <option value="ta">Tamil</option>
          <option value="ml">Malayalam</option>
        </select>
      </label>

      <label className="field">
        <span>Style</span>
        <select
          aria-label="Select style"
          value={options.style}
          onChange={(e) => onChange({ ...options, style: e.target.value as any })}
        >
          <option value="funny">Funny</option>
          <option value="casual">Casual</option>
          <option value="formal">Formal</option>
          <option value="meme">Meme</option>
        </select>
      </label>
    </div>
  )
}

export default SettingsPanel
