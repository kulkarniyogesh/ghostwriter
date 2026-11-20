import { useState } from 'react'
import UrlInput from './UrlInput'
import ExampleRepos from './ExampleRepos'
import { fetchRepo } from '../../api/client'
import ErrorMessage from '../shared/ErrorMessage'

export default function LandingPage({ onResurrect }) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleResurrect = async (url) => {
    setError(null)
    setIsLoading(true)
    try {
      // Validate repo is reachable before switching screens
      await fetchRepo(url)
      onResurrect(url)
    } catch (err) {
      setError(err.message)
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px]
          rounded-full bg-[#00D4FF]/3 blur-[120px]" />
      </div>

      {/* Logo */}
      <div className="mb-10 text-center relative">
        <div className="text-6xl mb-4 select-none" role="img" aria-label="ghost">👻</div>
        <h1 className="text-4xl font-bold text-[#E8E8E8] tracking-tight">
          Ghost<span className="text-[#00D4FF]">Writer</span>
        </h1>
        <p className="mt-2 text-[#8892A4] text-sm">
          Bring your dead code back to life
        </p>
      </div>

      {/* Input */}
      <UrlInput onResurrect={handleResurrect} isLoading={isLoading} />

      {/* Error */}
      {error && (
        <div className="mt-4 w-full max-w-2xl px-4 py-3 rounded-lg bg-[#FF4D6D]/10
          border border-[#FF4D6D]/20 text-[#FF4D6D] text-xs">
          {error}
        </div>
      )}

      {/* Examples */}
      <ExampleRepos onSelect={(url) => handleResurrect(url)} />

      {/* Supported languages */}
      <div className="mt-10 flex flex-wrap gap-2 justify-center max-w-lg">
        {['COBOL', 'Pascal', 'VB6', 'Fortran', 'Perl CGI', 'ActionScript', 'Classic ASP', 'Old PHP'].map((lang) => (
          <span key={lang}
            className="px-2.5 py-1 rounded-full text-[10px] font-mono text-[#8892A4]
              bg-[#1A1A2E] border border-white/5">
            {lang}
          </span>
        ))}
      </div>

      {/* Footer */}
      <p className="mt-10 text-[10px] text-[#8892A4]/50 text-center">
        🔒 Your code is never stored &nbsp;·&nbsp; Built for{' '}
        <a href="https://kiroween.devpost.com" target="_blank" rel="noreferrer"
          className="hover:text-[#8892A4] transition-colors">
          Kiroween 2026
        </a>
      </p>
    </div>
  )
}
