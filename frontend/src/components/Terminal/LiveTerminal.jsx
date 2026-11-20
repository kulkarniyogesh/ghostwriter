import { useEffect, useRef } from 'react'
import usePyodide from '../../hooks/usePyodide'

export default function LiveTerminal({ migratedFiles, onClose }) {
  const { isLoading, isRunning, output, error, runCode, clearOutput } = usePyodide()
  const bottomRef = useRef(null)

  // Pick the best file to run — prefer main.py or first .py file
  const getRunnable = () => {
    if (!migratedFiles?.length) return null
    const main = migratedFiles.find((f) =>
      f.path.endsWith('main.py') || f.path.endsWith('app.py') || f.path.endsWith('index.py')
    )
    return main || migratedFiles.find((f) => f.path.endsWith('.py'))
  }

  const runnable = getRunnable()

  // Auto-scroll to bottom as output arrives
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [output])

  const handleRun = () => {
    if (!runnable) return
    runCode(runnable.migrated_code)
  }

  return (
    <div className="flex flex-col border-t border-white/10"
      style={{ background: '#0A0A0F', height: '240px' }}>

      {/* Terminal header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF4D6D]/60" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#FFB800]/60" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#00FF88]/60" />
          </div>
          <span className="text-xs font-mono text-[#8892A4]">
            terminal
            {runnable && (
              <span className="ml-2 text-[#00D4FF]/60">— {runnable.path.split('/').pop()}</span>
            )}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Run button */}
          <button
            onClick={handleRun}
            disabled={isLoading || isRunning || !runnable}
            className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium transition-all ${
              isLoading
                ? 'bg-[#1A1A2E] text-[#8892A4] cursor-wait'
                : isRunning
                  ? 'bg-[#00FF88]/10 text-[#00FF88] cursor-wait'
                  : runnable
                    ? 'bg-[#00FF88]/15 text-[#00FF88] hover:bg-[#00FF88]/25 cursor-pointer'
                    : 'bg-[#1A1A2E] text-[#8892A4] cursor-not-allowed opacity-50'
            }`}
          >
            {isLoading ? (
              <>
                <span className="w-3 h-3 rounded-full border border-[#8892A4]/40 border-t-[#8892A4] animate-spin" />
                Loading Python...
              </>
            ) : isRunning ? (
              <>
                <span className="w-2 h-2 rounded-full bg-[#00FF88] animate-pulse" />
                Running...
              </>
            ) : (
              <>▶ Run</>
            )}
          </button>

          {/* Clear button */}
          <button
            onClick={clearOutput}
            className="px-2 py-1 rounded text-xs text-[#8892A4] hover:text-[#E8E8E8] transition-colors"
          >
            Clear
          </button>

          {/* Close button */}
          <button
            onClick={onClose}
            className="px-2 py-1 rounded text-xs text-[#8892A4] hover:text-[#FF4D6D] transition-colors"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Output area */}
      <div className="flex-1 overflow-y-auto px-4 py-3 font-mono text-xs leading-relaxed">
        {output.length === 0 && !error && !isLoading && (
          <span className="text-[#8892A4]/50">
            {runnable
              ? 'Click ▶ Run to execute the migrated code in your browser'
              : 'No runnable Python file found in migration output'}
          </span>
        )}

        {isLoading && (
          <span className="text-[#00D4FF]/60 animate-pulse">
            Loading Python runtime (Pyodide)... this takes ~4 seconds the first time
          </span>
        )}

        {output.map((line, i) => (
          <div key={i} className={
            line.type === 'stderr' ? 'text-[#FF4D6D]' :
            line.type === 'info'   ? 'text-[#8892A4]' :
                                     'text-[#00FF88]'
          }>
            {line.text}
          </div>
        ))}

        {error && (
          <div className="text-[#FF4D6D] mt-1">
            Error: {error}
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  )
}
