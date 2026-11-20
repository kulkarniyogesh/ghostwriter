import ConfidenceBadge from '../shared/ConfidenceBadge'

export default function ReportTab({ result }) {
  const { autopsy_report, migrated_files, source_language, overall_confidence } = result

  // Parse simple markdown sections from report
  const sections = autopsy_report
    ? autopsy_report.split(/^## /m).filter(Boolean)
    : []

  return (
    <div className="p-5 space-y-6 overflow-y-auto max-h-72">
      {/* Summary row */}
      <div className="flex flex-wrap items-center gap-3">
        <ConfidenceBadge score={overall_confidence} reason="Average confidence across all migrated files" />
        <span className="text-xs text-[#8892A4]">
          {source_language} → Python 3.12 · {migrated_files?.length} files
        </span>
      </div>

      {/* Report sections */}
      {sections.length > 0 ? (
        sections.map((section, i) => {
          const [heading, ...body] = section.split('\n')
          return (
            <div key={i}>
              <h3 className="text-sm font-semibold text-[#E8E8E8] mb-2">{heading.trim()}</h3>
              <p className="text-xs text-[#8892A4] leading-relaxed whitespace-pre-line">
                {body.join('\n').trim()}
              </p>
            </div>
          )
        })
      ) : (
        <p className="text-xs text-[#8892A4] leading-relaxed whitespace-pre-line">
          {autopsy_report || 'No report generated.'}
        </p>
      )}

      {/* Per-file confidence */}
      <div>
        <h3 className="text-sm font-semibold text-[#E8E8E8] mb-3">Per-file confidence</h3>
        <div className="space-y-2">
          {migrated_files?.map((f) => (
            <div key={f.path} className="flex items-center justify-between gap-3">
              <span className="text-xs font-mono text-[#8892A4] truncate flex-1">
                {f.original_path}
              </span>
              <ConfidenceBadge score={f.confidence} reason={f.confidence_reason} size="sm" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
