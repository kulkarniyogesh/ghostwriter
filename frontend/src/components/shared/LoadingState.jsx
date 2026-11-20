export default function LoadingState({ message = 'Loading...', submessage }) {
  return (
    <div className="flex flex-col items-center gap-3 py-12 text-center">
      <div className="w-8 h-8 rounded-full border-2 border-[#00D4FF]/20 border-t-[#00D4FF] animate-spin" />
      <p className="text-[#E8E8E8] text-sm font-medium">{message}</p>
      {submessage && <p className="text-[#8892A4] text-xs">{submessage}</p>}
    </div>
  )
}
