import { useState } from 'react'

const GITHUB_REGEX = /^https?:\/\/(www\.)?github\.com\/[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+/

export default function UrlInput({ onResurrect, isLoading }) {
  const [url, setUrl] = useState('')
  const [touched, setTouched] = useState(false)

  const isValid = GITHUB_REGEX.test(url.trim())
  const showError = touched && url.length > 0 && !isValid

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!isValid || isLoading) return
    onResurrect(url.trim())
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl">
      <div className="relative">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <svg className="w-4 h-4 text-[#8892A4]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57
              0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695
              -.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99
              .105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225
              -.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405
              c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225
              0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3
              0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
          </svg>
        </div>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onBlur={() => setTouched(true)}
          placeholder="https://github.com/owner/legacy-repo"
          disabled={isLoading}
          className={`w-full pl-10 pr-4 py-4 rounded-xl bg-[#1A1A2E] text-[#E8E8E8] placeholder-[#8892A4]
            border text-sm font-mono outline-none transition-all
            ${showError
              ? 'border-[#FF4D6D]/60 focus:border-[#FF4D6D]'
              : isValid && url.length > 0
                ? 'border-[#00FF88]/40 focus:border-[#00FF88]'
                : 'border-white/10 focus:border-[#00D4FF]/60'
            }
            ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        />
        {isValid && url.length > 0 && (
          <div className="absolute inset-y-0 right-4 flex items-center">
            <span className="text-[#00FF88] text-xs">✓</span>
          </div>
        )}
      </div>

      {showError && (
        <p className="mt-2 text-xs text-[#FF4D6D]">
          Enter a valid GitHub URL — e.g. https://github.com/owner/repo
        </p>
      )}

      <button
        type="submit"
        disabled={!isValid || isLoading}
        className={`mt-4 w-full py-4 rounded-xl font-semibold text-sm tracking-wider transition-all
          ${isValid && !isLoading
            ? 'bg-[#00D4FF] text-[#0F1117] hover:bg-[#00D4FF]/90 hover:shadow-[0_0_30px_rgba(0,212,255,0.3)] cursor-pointer'
            : 'bg-[#1A1A2E] text-[#8892A4] cursor-not-allowed border border-white/5'
          }
        `}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-4 h-4 rounded-full border-2 border-[#0F1117]/20 border-t-[#0F1117] animate-spin" />
            Resurrecting...
          </span>
        ) : '⚡ RESURRECT'}
      </button>
    </form>
  )
}
