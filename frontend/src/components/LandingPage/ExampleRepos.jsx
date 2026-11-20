const EXAMPLES = [
  {
    label: 'COBOL Accounting System',
    year: '1990s',
    url: 'https://github.com/tjsingh85/cobol-accounting-system',
    lang: 'COBOL',
    color: 'text-amber-400',
  },
  {
    label: 'COBOL Examples Library',
    year: '1980s',
    url: 'https://github.com/dsfb/Projetos-Cobol',
    lang: 'COBOL',
    color: 'text-amber-400',
  },
  {
    label: 'GnuCOBOL Contrib',
    year: '1990s',
    url: 'https://github.com/rupurt/GnuCOBOL-Contrib',
    lang: 'COBOL',
    color: 'text-amber-400',
  },
]

export default function ExampleRepos({ onSelect }) {
  return (
    <div className="w-full max-w-2xl mt-8">
      <p className="text-xs text-[#8892A4] mb-3 text-center">Or try an example</p>
      <div className="flex flex-col sm:flex-row gap-2">
        {EXAMPLES.map((ex) => (
          <button
            key={ex.url}
            onClick={() => onSelect(ex.url)}
            className="flex-1 flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-[#1A1A2E]
              border border-white/5 hover:border-[#00D4FF]/30 hover:bg-[#1A1A2E]/80
              transition-all text-left group"
          >
            <span className={`text-xs font-mono font-bold ${ex.color} shrink-0`}>{ex.lang}</span>
            <div className="min-w-0">
              <p className="text-xs text-[#E8E8E8] truncate group-hover:text-[#00D4FF] transition-colors">
                {ex.label}
              </p>
              <p className="text-[10px] text-[#8892A4]">circa {ex.year}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
