export default function ProgressBar({ percent }) {
  return (
    <div className="w-full max-w-2xl">
      <div className="flex justify-between text-xs text-[#8892A4] mb-1.5 font-mono">
        <span>Progress</span>
        <span>{percent}%</span>
      </div>
      <div className="h-1.5 bg-[#1A1A2E] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${percent}%`,
            background: 'linear-gradient(90deg, #00D4FF, #00FF88)',
            boxShadow: '0 0 12px rgba(0, 212, 255, 0.6)',
          }}
        />
      </div>
    </div>
  )
}
