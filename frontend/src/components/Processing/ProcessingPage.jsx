import { useEffect, useRef, useState } from 'react'
import ProgressBar from './ProgressBar'
import FileTreeBuilder from './FileTreeBuilder'
import ErrorMessage from '../shared/ErrorMessage'
import useMigration from '../../hooks/useMigration'
import { fetchRepo } from '../../api/client'

const STAGES = [
  { id: 'fetch', title: 'Read repository', desc: 'Fetching files from GitHub' },
  { id: 'migrate', title: 'Migrate code', desc: 'Translating each file to Python' },
  { id: 'report', title: 'Tests & report', desc: 'Writing tests and the ghost story' },
  { id: 'done', title: 'Package results', desc: 'Preparing your project' },
]

function formatElapsed(seconds) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

function repoLabel(url) {
  const m = url.match(/github\.com\/([^/]+\/[^/?#\s]+)/)
  return m ? m[1].replace(/\.git$/, '') : url
}

export default function ProcessingPage({ repoUrl, onComplete, onError }) {
  const {
    status, percent, message, currentFile, doneFiles, errorFiles,
    migratedFiles, result, error, startMigration,
  } = useMigration()

  const [files, setFiles] = useState([])
  const [phase, setPhase] = useState('fetching') // fetching | migrating
  const [fetchError, setFetchError] = useState(null)
  const [elapsed, setElapsed] = useState(0)
  const [log, setLog] = useState([])
  const filesRef = useRef([])
  const startedRef = useRef(false)

  const addLog = (text) => setLog((prev) => [...prev.slice(-30), { text, at: Date.now() }])

  useEffect(() => {
    if (startedRef.current) return
    startedRef.current = true

    const run = async () => {
      try {
        addLog(`Connecting to github.com/${repoLabel(repoUrl)}`)
        const { files: fetched } = await fetchRepo(repoUrl)
        filesRef.current = fetched
        setFiles(fetched)
        addLog(`Found ${fetched.length} legacy file${fetched.length !== 1 ? 's' : ''}`)
        setPhase('migrating')
        await startMigration(fetched, 'python')
      } catch (err) {
        setFetchError(err.message)
      }
    }
    run()
  }, [])

  // Elapsed timer
  useEffect(() => {
    if (status === 'complete' || fetchError || error) return
    const t = setInterval(() => setElapsed((s) => s + 1), 1000)
    return () => clearInterval(t)
  }, [status, fetchError, error])

  // Activity log from migration messages
  useEffect(() => {
    if (message) addLog(message)
  }, [message])

  useEffect(() => {
    if (status === 'complete' && result) {
      addLog('Migration complete')
      const t = setTimeout(() => onComplete(result, filesRef.current), 900)
      return () => clearTimeout(t)
    }
  }, [status, result])

  const failure = fetchError || error
  if (failure) {
    return (
      <div className="min-h-screen w-full flex flex-col" style={{ background: 'var(--bg-primary)' }}>
        <div className="flex-1 flex items-center justify-center px-6">
          <ErrorMessage title="Could not resurrect this repo" message={failure} onRetry={() => onError(failure)} />
        </div>
      </div>
    )
  }

  // Which stage is active
  const stageIndex =
    status === 'complete' ? 3
      : phase === 'fetching' ? 0
        : percent >= 95 ? 2
          : 1

  const displayPercent =
    status === 'complete' ? 100
      : phase === 'fetching' ? 6
        : Math.max(10, percent)

  const remaining = Math.max(0, files.length - doneFiles.length - errorFiles.length)

  return (
    <div className="min-h-screen w-full flex flex-col" style={{ background: 'var(--bg-primary)' }}>
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-[#00D4FF]/5 blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-[#00FF88]/3 blur-[120px]" />
      </div>

      {/* Nav */}
      <nav className="relative z-10 w-full px-6 sm:px-10 py-4 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-2">
          <span className="text-2xl">👻</span>
          <span className="font-bold text-[#E8E8E8] tracking-tight text-lg">
            Ghost<span className="text-[#00D4FF]">Writer</span>
          </span>
        </div>
        <button onClick={() => onError('cancelled')}
          className="text-xs text-[#8892A4] hover:text-[#FF4D6D] transition-colors">
          Cancel
        </button>
      </nav>

      <main className="relative z-10 flex-1 w-full max-w-7xl mx-auto px-6 sm:px-10 py-8 sm:py-12 flex flex-col gap-8">

        {/* 1. Header — what is happening, how far along */}
        <header className="flex flex-col gap-5">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-widest text-[#00D4FF] mb-2">Resurrecting</p>
              <h1 className="text-2xl sm:text-4xl font-bold text-[#E8E8E8] tracking-tight truncate">
                {repoLabel(repoUrl)}
              </h1>
              <p className="mt-2 text-sm text-[#8892A4] min-h-5" aria-live="polite">
                {phase === 'fetching'
                  ? 'Reading the repository from GitHub…'
                  : status === 'complete'
                    ? 'Done. Opening your results…'
                    : message || 'Starting migration…'}
              </p>
            </div>
            <div className="flex items-end gap-6 shrink-0">
              <div className="text-right">
                <p className="text-4xl sm:text-5xl font-bold font-mono text-[#E8E8E8] leading-none">
                  {displayPercent}<span className="text-xl text-[#8892A4]">%</span>
                </p>
                <p className="text-[11px] text-[#8892A4] mt-1 font-mono">elapsed {formatElapsed(elapsed)}</p>
              </div>
            </div>
          </div>
          <ProgressBar percent={displayPercent} indeterminate={phase === 'fetching'} />
        </header>

        {/* 2. Body — stages + stats on the left, files + log on the right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Left column */}
          <aside className="lg:col-span-4 flex flex-col gap-6">
            <section className="rounded-xl bg-[#1A1A2E] border border-white/5 p-5" aria-label="Progress stages">
              <h2 className="text-sm font-semibold text-[#E8E8E8] mb-4">Progress</h2>
              <ol className="flex flex-col gap-4">
                {STAGES.map((stage, i) => {
                  const state = i < stageIndex ? 'done' : i === stageIndex ? 'active' : 'todo'
                  return (
                    <li key={stage.id} className="flex items-start gap-3">
                      <div className={`w-6 h-6 rounded-full shrink-0 flex items-center justify-center text-xs border ${state === 'done' ? 'bg-[#00FF88]/15 border-[#00FF88]/40 text-[#00FF88]'
                          : state === 'active' ? 'border-[#00D4FF] text-[#00D4FF]'
                            : 'border-white/10 text-[#8892A4]/50'
                        }`}>
                        {state === 'done' ? '✓'
                          : state === 'active'
                            ? <span className="w-2 h-2 rounded-full bg-[#00D4FF] animate-pulse" />
                            : i + 1}
                      </div>
                      <div className={state === 'todo' ? 'opacity-50' : ''}>
                        <p className={`text-sm font-medium ${state === 'active' ? 'text-[#00D4FF]' : 'text-[#E8E8E8]'}`}>
                          {stage.title}
                        </p>
                        <p className="text-xs text-[#8892A4]">{stage.desc}</p>
                      </div>
                    </li>
                  )
                })}
              </ol>
            </section>

            <section className="grid grid-cols-3 gap-3" aria-label="File counts">
              {[
                { label: 'Migrated', value: doneFiles.length, color: 'text-[#00FF88]' },
                { label: 'Remaining', value: remaining, color: 'text-[#E8E8E8]' },
                { label: 'Failed', value: errorFiles.length, color: errorFiles.length ? 'text-[#FF4D6D]' : 'text-[#8892A4]' },
              ].map((s) => (
                <div key={s.label} className="rounded-xl bg-[#1A1A2E] border border-white/5 p-4 text-center">
                  <p className={`text-2xl font-bold font-mono ${s.color}`}>{s.value}</p>
                  <p className="text-[11px] text-[#8892A4] mt-1">{s.label}</p>
                </div>
              ))}
            </section>

            <p className="text-[11px] text-[#8892A4]/60">
              🔒 Your code is processed in memory and never stored.
            </p>
          </aside>

          {/* Right column */}
          <div className="lg:col-span-8 flex flex-col gap-6 min-w-0">
            <FileTreeBuilder
              files={files}
              currentFile={currentFile}
              doneFiles={doneFiles}
              errorFiles={errorFiles}
              migratedFiles={migratedFiles}
            />

            <section className="rounded-xl bg-[#0A0A0F] border border-white/5 overflow-hidden" aria-label="Activity log">
              <header className="px-5 py-2.5 border-b border-white/5 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00FF88] animate-pulse" />
                <h3 className="text-xs font-semibold text-[#8892A4] uppercase tracking-widest">Activity</h3>
              </header>
              <div className="px-5 py-3 h-32 overflow-y-auto font-mono text-xs space-y-1">
                {log.length === 0 && <p className="text-[#8892A4]/50">Waiting…</p>}
                {log.map((entry, i) => (
                  <p key={i} className={i === log.length - 1 ? 'text-[#00D4FF]' : 'text-[#8892A4]'}>
                    <span className="text-[#8892A4]/40 mr-2">›</span>{entry.text}
                  </p>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}
