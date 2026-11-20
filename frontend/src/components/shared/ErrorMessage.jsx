export default function ErrorMessage({ title = 'Something went wrong', message, onRetry }) {
  return (
    <div className="flex flex-col items-center gap-4 py-12 text-center max-w-md mx-auto">
      <div className="text-4xl">👻</div>
      <div>
        <p className="text-[#FF4D6D] font-semibold text-sm">{title}</p>
        {message && <p className="text-[#8892A4] text-xs mt-1 leading-relaxed">{message}</p>}
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 text-xs rounded-lg border border-[#00D4FF]/30 text-[#00D4FF]
            hover:bg-[#00D4FF]/10 transition-colors"
        >
          Try again
        </button>
      )}
    </div>
  )
}
