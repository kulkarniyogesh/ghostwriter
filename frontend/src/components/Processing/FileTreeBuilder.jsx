const STATUS_ICONS = {
  done: { icon: '✓', color: 'text-[#00FF88]' },
  processing: { icon: '⟳', color: 'text-[#00D4FF] animate-spin inline-block' },
  waiting: { icon: '○', color: 'text-[#8892A4]' },
  error: { icon: '✗', color: 'text-[#FF4D6D]' },
}

const LANG_COLORS = {
  COBOL: 'text-amber-400',
  Pascal: 'text-purple-400',
  VB6: 'text-blue-400',
  Fortran: 'text-green-400',
  Perl: 'text-pink-400',
  ActionScript: 'text-orange-400',
  ClassicASP: 'text-cyan-400',
  PHP: 'text-indigo-400',
  Unknown: 'text-[#8892A4]',
}

export default function FileTreeBuilder({ files, currentFile, doneFiles, errorFiles }) {
  return (
    <div className="w-full max-w-2xl mt-6 bg-[#1A1A2E] rounded-xl border border-white/5 overflow-hidden">
      <div className="px-4 py-2.5 border-b border-white/5 flex items-center gap-2">
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FF4D6D]/60" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#FFB800]/60" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#00FF88]/60" />
        </div>
        <span className="text-xs text-[#8892A4] font-mono ml-1">repository</span>
      </div>
      <div className="p-4 space-y-1.5 max-h-64 overflow-y-auto">
        {files.length === 0 && (
          <p className="text-xs text-[#8892A4] font-mono">Fetching files...</p>
        )}
        {files.map((file) => {
          const isDone = doneFiles.includes(file.path)
          const isProcessing = file.path === currentFile
          const isError = errorFiles.includes(file.path)
          const statusKey = isError ? 'error' : isDone ? 'done' : isProcessing ? 'processing' : 'waiting'
          const { icon, color } = STATUS_ICONS[statusKey]
          const langColor = LANG_COLORS[file.language] || LANG_COLORS.Unknown

          return (
            <div key={file.path}
              className={`flex items-center gap-2.5 py-0.5 transition-opacity ${
                statusKey === 'waiting' ? 'opacity-40' : 'opacity-100'
              }`}>
              <span className={`text-xs font-mono w-3 text-center ${color}`}>{icon}</span>
              <span className="text-xs font-mono text-[#E8E8E8] flex-1 truncate">{file.path}</span>
              <span className={`text-[10px] font-mono ${langColor} shrink-0`}>{file.language}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
