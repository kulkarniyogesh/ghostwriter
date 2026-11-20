const EXAMPLES = [
  {
    label: 'COBOL Payroll System',
    year: '1987',
    url: 'https://github.com/ghusta/cobol-example-world-population',
    lang: 'COBOL',
    color: 'text-amber-400',
  },
  {
    label: 'Legacy Fortran Science',
    year: '1982',
    url: 'https://github.com/mhearne-usgs/neic-legacy',
    lang: 'Fortran',
    color: 'text-purple-400',
  },
  {
    label: 'Classic ASP App',
    year: '1999',
    url: 'https://github.com/nickhealthy/classic-asp-example',
    lang: 'ASP',
    color: 'text-green-400',
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
