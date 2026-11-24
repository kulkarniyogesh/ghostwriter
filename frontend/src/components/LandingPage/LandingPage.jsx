import { useState } from 'react'
import UrlInput from './UrlInput'
import ExampleRepos from './ExampleRepos'
import { fetchRepo } from '../../api/client'

const LANGUAGES = ['COBOL', 'Pascal', 'VB6', 'Fortran', 'Perl CGI', 'ActionScript', 'Classic ASP', 'Old PHP']

const STATS = [
  { value: '800B+', label: 'Lines of COBOL still running' },
  { value: '8', label: 'Legacy languages supported' },
  { value: '100%', label: 'Free to use' },
]

export default function LandingPage({ onResurrect }) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleResurrect = async (url) => {
    setError(null)
    setIsLoading(true)
    try {
      await fetchRepo(url)
      onResurrect(url)
    } catch (err) {
      setError(err?.message || String(err) || 'Unknown error')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex flex-col" style={{ background: 'var(--bg-primary)' }}>

      {/* Ambient glows — full width */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px]
          rounded-full bg-[#00D4FF]/5 blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px]
          rounded-full bg-[#00FF88]/3 blur-[120px]" />
      </div>

      {/* Nav */}
      <nav className="relative z-10 w-full px-6 sm:px-10 py-5 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-2">
          <span className="text-2xl">👻</span>
          <span className="font-bold text-[#E8E8E8] tracking-tight text-lg">
            Ghost<span className="text-[#00D4FF]">Writer</span>
          </span>
        </div>
        <div className="flex items-center gap-4">
          <a href="https://github.com/kulkarniyogesh/ghostwriter"
            target="_blank" rel="noreferrer"
            className="text-xs text-[#8892A4] hover:text-[#E8E8E8] transition-colors flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            GitHub
          </a>
          <a href="https://kiroween.devpost.com" target="_blank" rel="noreferrer"
            className="text-xs px-3 py-1.5 rounded-lg border border-[#00D4FF]/30 text-[#00D4FF]
              hover:bg-[#00D4FF]/10 transition-colors">
            Kiroween 2026
          </a>
        </div>
      </nav>

      {/* Hero — full width, two column on desktop */}
      <main className="relative z-10 flex-1 w-full max-w-7xl mx-auto px-6 sm:px-10 py-16 sm:py-24
        flex flex-col lg:flex-row items-center gap-16">

        {/* Left — headline + input */}
        <div className="flex-1 w-full max-w-2xl mx-auto lg:mx-0">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full
            bg-[#00D4FF]/10 border border-[#00D4FF]/20 text-[#00D4FF] text-xs mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00D4FF] animate-pulse" />
            Kiroween 2026 · Resurrection Category
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#E8E8E8] leading-tight tracking-tight">
            Dead code<br />
            <span className="text-[#00D4FF]">walks again.</span>
          </h1>

          <p className="mt-5 text-[#8892A4] text-base sm:text-lg leading-relaxed max-w-lg">
            Paste a GitHub URL with legacy COBOL, Pascal, VB6, or Fortran.
            Get back modern Python — with unit tests, documentation,
            and a confidence score.
          </p>

          {/* Input */}
          <div className="mt-8 w-full">
            <UrlInput onResurrect={handleResurrect} isLoading={isLoading} />
          </div>

          {/* Error */}
          {error && (
            <div className="mt-3 w-full px-4 py-3 rounded-lg bg-[#FF4D6D]/10
              border border-[#FF4D6D]/20 text-[#FF4D6D] text-xs leading-relaxed">
              {error}
            </div>
          )}

          {/* Examples */}
          <ExampleRepos onSelect={handleResurrect} />

          {/* Privacy note */}
          <p className="mt-6 text-[10px] text-[#8892A4]/40">
            🔒 Your code is never stored on our servers
          </p>
        </div>

        {/* Right — feature cards (hidden on mobile) */}
        <div className="hidden lg:flex flex-col gap-4 w-full max-w-sm shrink-0">

          {/* How it works */}
          <div className="p-5 rounded-xl bg-[#1A1A2E] border border-white/5">
            <p className="text-xs font-semibold text-[#00D4FF] mb-4 uppercase tracking-widest">
              How it works
            </p>
            {[
              { icon: '🔗', step: 'Paste GitHub URL', desc: 'Any public legacy repo' },
              { icon: '⚗️', step: 'AI migrates the code', desc: 'Groq LLM + per-language agents' },
              { icon: '✨', step: 'Review results', desc: 'Split panel · tests · report' },
              { icon: '⬇️', step: 'Download or push', desc: 'ZIP or straight to your GitHub' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 mb-3 last:mb-0">
                <span className="text-lg shrink-0 mt-0.5">{item.icon}</span>
                <div>
                  <p className="text-xs font-medium text-[#E8E8E8]">{item.step}</p>
                  <p className="text-[10px] text-[#8892A4]">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            {STATS.map((s) => (
              <div key={s.label}
                className="p-3 rounded-xl bg-[#1A1A2E] border border-white/5 text-center">
                <p className="text-lg font-bold text-[#00D4FF] font-mono">{s.value}</p>
                <p className="text-[9px] text-[#8892A4] mt-0.5 leading-tight">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Languages */}
          <div className="p-4 rounded-xl bg-[#1A1A2E] border border-white/5">
            <p className="text-[10px] text-[#8892A4] mb-3 uppercase tracking-widest">Supported languages</p>
            <div className="flex flex-wrap gap-1.5">
              {LANGUAGES.map((lang) => (
                <span key={lang}
                  className="px-2 py-0.5 rounded-full text-[10px] font-mono text-[#8892A4]
                    bg-[#0F1117] border border-white/5">
                  {lang}
                </span>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Mobile-only language pills */}
      <div className="lg:hidden relative z-10 w-full px-6 pb-8 flex flex-wrap gap-2 justify-center">
        {LANGUAGES.map((lang) => (
          <span key={lang}
            className="px-2.5 py-1 rounded-full text-[10px] font-mono text-[#8892A4]
              bg-[#1A1A2E] border border-white/5">
            {lang}
          </span>
        ))}
      </div>

      {/* Footer */}
      <footer className="relative z-10 w-full px-6 sm:px-10 py-5 border-t border-white/5
        flex flex-col sm:flex-row items-center justify-between gap-2">
        <p className="text-[10px] text-[#8892A4]/50">
          © 2026 Bilva Media Tech · Yogesh Kulkarni
        </p>
        <div className="flex items-center gap-4 text-[10px] text-[#8892A4]/50">
          <a href="https://ghostwriter-api.up.railway.app/health" target="_blank" rel="noreferrer"
            className="hover:text-[#00FF88] transition-colors">
            API Status
          </a>
          <a href="https://github.com/kulkarniyogesh/ghostwriter" target="_blank" rel="noreferrer"
            className="hover:text-[#8892A4] transition-colors">
            Source Code
          </a>
          <a href="https://kiroween.devpost.com" target="_blank" rel="noreferrer"
            className="hover:text-[#8892A4] transition-colors">
            Kiroween 2026
          </a>
        </div>
      </footer>

    </div>
  )
}
