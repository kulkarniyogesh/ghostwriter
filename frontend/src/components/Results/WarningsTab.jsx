export default function WarningsTab({ migratedFiles }) {
  const allWarnings = migratedFiles?.flatMap((f) =>
    (f.warnings || []).map((w) => ({ file: f.original_path, warning: w }))
  ) || []

  if (allWarnings.length === 0) {
    return (
      <div className="p-5 text-center">
        <div className="text-2xl mb-2">✅</div>
        <p className="text-xs text-[#00FF88]">No warnings — clean migration.</p>
      </div>
    )
  }

  return (
    <div className="p-5 space-y-2 overflow-y-auto max-h-72">
      <p className="text-xs text-[#8892A4] mb-3">
        {allWarnings.length} item{allWarnings.length !== 1 ? 's' : ''} need manual review
      </p>
      {allWarnings.map((w, i) => (
        <div key={i} className="flex gap-3 p-3 rounded-lg bg-[#FFB800]/5 border border-[#FFB800]/15">
          <span className="text-xs shrink-0 mt-0.5">⚠️</span>
          <div className="min-w-0">
            <p className="text-[10px] font-mono text-[#FFB800]/70 mb-0.5 truncate">{w.file}</p>
            <p className="text-xs text-[#E8E8E8]/80 leading-relaxed">{w.warning}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
