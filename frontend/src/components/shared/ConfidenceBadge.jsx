export default function ConfidenceBadge({ score, reason, size = 'md' }) {
  const color =
    score >= 85 ? 'text-green-400 border-green-400/30 bg-green-400/10' :
    score >= 60 ? 'text-amber-400 border-amber-400/30 bg-amber-400/10' :
                  'text-red-400 border-red-400/30 bg-red-400/10'

  const textSize = size === 'sm' ? 'text-xs' : 'text-sm'

  return (
    <div className={`group relative inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${color} ${textSize} font-mono cursor-default`}>
      <span className="font-bold">{score}%</span>
      <span className="opacity-60">confidence</span>
      {reason && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-2.5 rounded-lg text-xs text-left
          bg-[#1A1A2E] border border-white/10 text-[#E8E8E8] opacity-0 group-hover:opacity-100
          transition-opacity pointer-events-none z-50 shadow-xl">
          {reason}
        </div>
      )}
    </div>
  )
}
