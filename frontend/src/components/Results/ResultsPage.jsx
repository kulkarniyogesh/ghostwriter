import { useState } from 'react'
import SplitCodePanel from './SplitCodePanel'
import ReportTab from './ReportTab'
import TestsTab from './TestsTab'
import WarningsTab from './WarningsTab'
import ActionBar from './ActionBar'
import ConfidenceBadge from '../shared/ConfidenceBadge'
import LiveTerminal from '../Terminal/LiveTerminal'

const TABS = [
  { id: 'report', label: '👻 Ghost Story' },
  { id: 'tests', label: '🧪 Tests' },
  { id: 'warnings', label: '⚠️ Warnings' },
]

export default function ResultsPage({ result, onReset }) {
  const [activeTab, setActiveTab] = useState('report')
  const [showTerminal, setShowTerminal] = useState(false)

  if (!result) return null

  const warningCount = result.total_warnings || 0

  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
      {/* Top status bar */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-white/5 shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={onReset} className="text-[#8892A4] hover:text-[#E8E8E8] text-xs transition-colors flex items-center gap-1">
            ← Back
          </button>
          <span className="text-[#8892A4]/40">|</span>
          <span className="text-xs font-mono text-[#E8E8E8]">
            👻 {result.source_language}
            <span className="text-[#8892A4] mx-2">→</span>
            <span className="text-[#00D4FF]">✨ Python 3.12</span>
          </span>
          <span className="text-xs text-[#8892A4]">· {result.migrated_files?.length} files</span>
        </div>
        <div className="flex items-center gap-3">
          {warningCount > 0 && (
            <span className="text-[10px] text-[#FFB800] font-mono">{warningCount} warnings</span>
          )}
          <ConfidenceBadge
            score={result.overall_confidence}
            reason="Average confidence across all migrated files"
          />
          <span className="text-xs text-[#00FF88] font-semibold">✅ Migration Complete</span>
        </div>
      </div>

      {/* Split code panel — main area */}
      <div className="flex-1 min-h-0">
        <SplitCodePanel
          migratedFiles={result.migrated_files || []}
          originalFiles={[]}
          targetLanguage={result.target_language || 'python'}
        />
      </div>

      {/* Tabs */}
      <div className="shrink-0 border-t border-white/5" style={{ background: 'var(--bg-secondary)' }}>
        <div className="flex border-b border-white/5">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 text-xs transition-colors ${activeTab === tab.id
                ? 'text-[#E8E8E8] border-b-2 border-[#00D4FF]'
                : 'text-[#8892A4] hover:text-[#E8E8E8]'
                }`}
            >
              {tab.label}
              {tab.id === 'warnings' && warningCount > 0 && (
                <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-[#FFB800]/20 text-[#FFB800] text-[9px]">
                  {warningCount}
                </span>
              )}
            </button>
          ))}
        </div>

        {activeTab === 'report' && <ReportTab result={result} />}
        {activeTab === 'tests' && <TestsTab migratedFiles={result.migrated_files} />}
        {activeTab === 'warnings' && <WarningsTab migratedFiles={result.migrated_files} />}
      </div>

      {/* Live Terminal — shown when Run Live is clicked */}
      {showTerminal && (
        <LiveTerminal
          migratedFiles={result.migrated_files}
          onClose={() => setShowTerminal(false)}
        />
      )}

      {/* Action bar */}
      <ActionBar result={result} onRunLive={() => setShowTerminal((v) => !v)} terminalOpen={showTerminal} />
    </div>
  )
}
