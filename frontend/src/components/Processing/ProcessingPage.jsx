import { useEffect, useRef } from 'react'
import ProgressBar from './ProgressBar'
import FileTreeBuilder from './FileTreeBuilder'
import ErrorMessage from '../shared/ErrorMessage'
import useMigration from '../../hooks/useMigration'
import { fetchRepo } from '../../api/client'

const STEPS = [
  'Summoning the ghost from the repo...',
  'Reading the spectral code...',
  'Channelling modern patterns...',
  'Writing new life into the haunted files...',
  'Writing the ghost story...',
]

export default function ProcessingPage({ repoUrl, onComplete, onError }) {
  const { status, percent, message, currentFile, doneFiles, errorFiles, result, error, startMigration } = useMigration()
  const filesRef = useRef([])
  const startedRef = useRef(false)

  useEffect(() => {
    if (startedRef.current) return
    startedRef.current = true

    const run = async () => {
      try {
        const { files } = await fetchRepo(repoUrl)
        filesRef.current = files
        await startMigration(files, 'python')
      } catch (err) {
        onError(err.message)
      }
    }
    run()
  }, [])

  useEffect(() => {
    if (status === 'complete' && result) {
      setTimeout(() => onComplete(result, filesRef.current), 800)
    }
  }, [status, result])

  if (status === 'error' || error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ErrorMessage
          title="Migration failed"
          message={error || 'An unexpected error occurred'}
          onRetry={onError}
        />
      </div>
    )
  }

  const displayMessage = message || STEPS[Math.floor((percent / 100) * STEPS.length)] || STEPS[0]

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96
          rounded-full bg-[#00D4FF]/5 blur-[100px] animate-pulse" />
      </div>

      <div className="w-full max-w-2xl flex flex-col items-center gap-8 relative">
        {/* Header */}
        <div className="text-center">
          <div className="text-4xl mb-3">👻</div>
          <h2 className="text-xl font-semibold text-[#E8E8E8]">Resurrecting your codebase</h2>
          <p className="mt-1.5 text-sm text-[#00D4FF] font-mono min-h-5">{displayMessage}</p>
        </div>

        {/* Progress */}
        <ProgressBar percent={percent} />

        {/* File tree */}
        <FileTreeBuilder
          files={filesRef.current}
          currentFile={currentFile}
          doneFiles={doneFiles}
          errorFiles={errorFiles}
        />

        {/* Stats */}
        {doneFiles.length > 0 && (
          <div className="flex gap-6 text-center">
            <div>
              <p className="text-lg font-bold text-[#00FF88] font-mono">{doneFiles.length}</p>
              <p className="text-xs text-[#8892A4]">migrated</p>
            </div>
            {errorFiles.length > 0 && (
              <div>
                <p className="text-lg font-bold text-[#FF4D6D] font-mono">{errorFiles.length}</p>
                <p className="text-xs text-[#8892A4]">errors</p>
              </div>
            )}
            <div>
              <p className="text-lg font-bold text-[#8892A4] font-mono">
                {filesRef.current.length - doneFiles.length - errorFiles.length}
              </p>
              <p className="text-xs text-[#8892A4]">remaining</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
