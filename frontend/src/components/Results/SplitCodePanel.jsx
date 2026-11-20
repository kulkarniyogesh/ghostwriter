import { useState } from 'react'
import Editor from '@monaco-editor/react'

const LANG_MAP = {
  python: 'python',
  nodejs: 'javascript',
  go: 'go',
}

export default function SplitCodePanel({ migratedFiles, originalFiles, targetLanguage }) {
  const [selectedIndex, setSelectedIndex] = useState(0)

  const current = migratedFiles[selectedIndex]
  const original = originalFiles?.find(
    (f) => f.path === current?.original_path
  ) || originalFiles?.[selectedIndex]

  if (!current) return null

  const monacoLang = LANG_MAP[targetLanguage] || 'python'

  return (
    <div className="flex flex-col h-full">
      {/* File selector */}
      {migratedFiles.length > 1 && (
        <div className="flex gap-1 px-4 pt-3 overflow-x-auto scrollbar-hide">
          {migratedFiles.map((f, i) => (
            <button
              key={f.path}
              onClick={() => setSelectedIndex(i)}
              className={`shrink-0 px-3 py-1.5 rounded-t-lg text-xs font-mono transition-colors ${i === selectedIndex
                ? 'bg-[#1A1A2E] text-[#E8E8E8] border-t border-x border-white/10'
                : 'text-[#8892A4] hover:text-[#E8E8E8]'
                }`}
            >
              {f.path.split('/').pop()}
            </button>
          ))}
        </div>
      )}

      {/* Split panels */}
      <div className="flex flex-1 gap-px bg-[#0F1117] min-h-0">
        {/* Dead panel — original */}
        <div className="flex-1 flex flex-col min-w-0" style={{ background: 'var(--dead-panel)' }}>
          <div className="flex items-center justify-between px-4 py-2 border-b border-white/5">
            <div className="flex items-center gap-2">
              <span className="text-sm">👻</span>
              <span className="text-xs font-mono text-[#8892A4]">HAUNTED</span>
            </div>
            <span className="text-[10px] font-mono text-[#8892A4]">
              {original?.language || '?'} · {original?.estimated_year || 'vintage'}
            </span>
          </div>
          <div className="flex-1 min-h-0">
            <Editor
              height="100%"
              language="plaintext"
              value={original?.content || '// Original source not available\n// (fetch the repo again to see original code)'}
              theme="vs-dark"
              options={{
                readOnly: true,
                minimap: { enabled: false },
                fontSize: 12,
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                wordWrap: 'on',
                padding: { top: 12 },
              }}
            />
          </div>
        </div>

        {/* Alive panel — migrated */}
        <div className="flex-1 flex flex-col min-w-0" style={{ background: 'var(--alive-panel)' }}>
          <div className="flex items-center justify-between px-4 py-2 border-b border-[#00D4FF]/10">
            <div className="flex items-center gap-2">
              <span className="text-sm">✨</span>
              <span className="text-xs font-mono text-[#00D4FF]">AFTER</span>
            </div>
            <span className="text-[10px] font-mono text-[#00D4FF]/60">
              {targetLanguage === 'python' ? 'Python 3.12' :
                targetLanguage === 'nodejs' ? 'Node.js 22' : 'Go 1.23'} · 2026
            </span>
          </div>
          <div className="flex-1 min-h-0">
            <Editor
              height="100%"
              language={monacoLang}
              value={current.migrated_code || '# Migration in progress...'}
              theme="vs-dark"
              options={{
                readOnly: true,
                minimap: { enabled: false },
                fontSize: 12,
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                wordWrap: 'on',
                padding: { top: 12 },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
