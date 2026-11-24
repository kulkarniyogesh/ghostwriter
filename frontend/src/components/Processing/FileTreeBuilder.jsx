const LANG_COLORS = {
  COBOL: 'text-amber-400 border-amber-400/30 bg-amber-400/10',
  Pascal: 'text-purple-400 border-purple-400/30 bg-purple-400/10',
  VB6: 'text-blue-400 border-blue-400/30 bg-blue-400/10',
  Fortran: 'text-green-400 border-green-400/30 bg-green-400/10',
  Perl: 'text-pink-400 border-pink-400/30 bg-pink-400/10',
  ActionScript: 'text-orange-400 border-orange-400/30 bg-orange-400/10',
  ClassicASP: 'text-cyan-400 border-cyan-400/30 bg-cyan-400/10',
  PHP: 'text-indigo-400 border-indigo-400/30 bg-indigo-400/10',
}
const DEFAULT_LANG = 'text-[#8892A4] border-white/10 bg-white/5'

function StatusIcon({ status }) {
  if (status === 'done') return <span className="text-[#00FF88] text-sm">✓</span>
  if (status === 'error') return <span className="text-[#FF4D6D] text-sm">✗</span>
  if (status === 'processing') {
    return <span className="w-3.5 h-3.5 rounded-full border-2 border-[#00D4FF]/30 border-t-[#00D4FF] animate-spin inline-block" />
  }
  return <span className="w-2 h-2 rounded-full bg-[#8892A4]/40 inline-block" />
}

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`
  return `${(bytes / 1024).toFixed(1)} KB`
}

export default function FileTreeBuilder({ files, currentFile, doneFiles, errorFiles, migratedFiles = [] }) {
  const confidenceFor = (path) => migratedFiles.find((m) => m.original_path === path)?.confidence

  return (
    <section className="w-full rounded-xl bg-[#1A1A2E] border border-white/5 overflow-hidden" aria-label="Repository files">
      <header className="px-5 py-3 border-b border-white/5 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[#E8E8E8]">Files</h3>
        <span className="text-xs text-[#8892A4] font-mono">
          {doneFiles.length + errorFiles.length} / {files.length}
        </span>
      </header>

      <div className="max-h-[22rem] overflow-y-auto divide-y divide-white/5">
        {files.length === 0 && (
          <p className="px-5 py-8 text-sm text-[#8892A4] text-center animate-pulse">
            Waiting for GitHub to return the file list...
          </p>
        )}

        {files.map((file) => {
          const status = errorFiles.includes(file.path) ? 'error'
            : doneFiles.includes(file.path) ? 'done'
              : file.path === currentFile ? 'processing'
                : 'waiting'
          const confidence = confidenceFor(file.path)

          return (
            <div key={file.path}
              className={`flex items-center gap-4 px-5 py-3 transition-colors ${status === 'processing' ? 'bg-[#00D4FF]/5' : ''
                } ${status === 'waiting' ? 'opacity-50' : ''}`}>
              <div className="w-5 flex justify-center shrink-0"><StatusIcon status={status} /></div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-mono text-[#E8E8E8] truncate">{file.path}</p>
                <p className="text-[11px] text-[#8892A4] mt-0.5">
                  {formatSize(file.size || file.content?.length || 0)}
                  {status === 'processing' && <span className="text-[#00D4FF] ml-2">migrating now…</span>}
                  {status === 'done' && <span className="text-[#00FF88] ml-2">migrated</span>}
                  {status === 'error' && <span className="text-[#FF4D6D] ml-2">failed</span>}
                </p>
              </div>
              {confidence != null && (
                <span className="hidden sm:inline text-xs font-mono text-[#8892A4] shrink-0">{confidence}%</span>
              )}
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border shrink-0 ${LANG_COLORS[file.language] || DEFAULT_LANG}`}>
                {file.language}
              </span>
            </div>
          )
        })}
      </div>
    </section>
  )
}
