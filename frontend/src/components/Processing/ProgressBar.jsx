export default function ProgressBar({ percent, indeterminate = false }) {
  return (
    <div className="w-full" role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}>
      <div className="h-2 bg-[#1A1A2E] rounded-full overflow-hidden border border-white/5">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${indeterminate ? 'animate-pulse' : ''}`}
          style={{
            width: `${percent}%`,
            background: 'linear-gradient(90deg, #00D4FF, #00FF88)',
            boxShadow: '0 0 14px rgba(0, 212, 255, 0.55)',
          }}
        />
      </div>
    </div>
  )
}
