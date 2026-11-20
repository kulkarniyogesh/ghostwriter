import { useState } from 'react'
import Editor from '@monaco-editor/react'

export default function TestsTab({ migratedFiles }) {
  const filesWithTests = migratedFiles?.filter((f) => f.tests) || []
  const [selectedIndex, setSelectedIndex] = useState(0)
  const current = filesWithTests[selectedIndex]

  if (filesWithTests.length === 0) {
    return (
      <div className="p-5 text-center text-[#8892A4] text-xs">
        No tests were generated.
      </div>
    )
  }

  return (
    <div className="flex flex-col max-h-72">
      {/* File tabs */}
      {filesWithTests.length > 1 && (
        <div className="flex gap-1 px-4 pt-3 overflow-x-auto">
          {filesWithTests.map((f, i) => (
            <button
              key={f.path}
              onClick={() => setSelectedIndex(i)}
              className={`shrink-0 px-3 py-1 rounded text-xs font-mono transition-colors ${
                i === selectedIndex ? 'bg-[#1A1A2E] text-[#E8E8E8]' : 'text-[#8892A4] hover:text-[#E8E8E8]'
              }`}
            >
              {f.path.split('/').pop()}
            </button>
          ))}
        </div>
      )}

      <div className="flex-1 min-h-[200px]">
        <Editor
          height="200px"
          language="python"
          value={current?.tests || '# No tests'}
          theme="vs-dark"
          options={{
            readOnly: true,
            minimap: { enabled: false },
            fontSize: 12,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            padding: { top: 12 },
          }}
        />
      </div>
    </div>
  )
}
