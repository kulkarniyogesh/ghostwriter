import { useState, useCallback, useRef } from 'react'

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api'

export default function useMigration() {
  const [state, setState] = useState({
    status: 'idle', // idle | running | complete | error
    percent: 0,
    message: '',
    currentFile: '',
    doneFiles: [],
    errorFiles: [],
    migratedFiles: [],
    result: null,
    error: null,
  })

  const eventSourceRef = useRef(null)

  const startMigration = useCallback(async (files, targetLanguage = 'python') => {
    // Close any existing stream
    if (eventSourceRef.current) eventSourceRef.current.close()

    setState({
      status: 'running',
      percent: 0,
      message: 'Starting migration...',
      currentFile: '',
      doneFiles: [],
      errorFiles: [],
      migratedFiles: [],
      result: null,
      error: null,
    })

    try {
      const response = await fetch(`${API_BASE}/migrate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ files, target_language: targetLanguage }),
      })

      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.error || 'Migration failed')
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() // keep incomplete line

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          try {
            const event = JSON.parse(line.slice(6))
            handleEvent(event)
          } catch { /* skip malformed */ }
        }
      }
    } catch (err) {
      setState((s) => ({ ...s, status: 'error', error: err.message }))
    }
  }, [])

  const handleEvent = (event) => {
    switch (event.type) {
      case 'progress':
        setState((s) => ({
          ...s,
          percent: event.percent,
          message: event.message,
          currentFile: event.file,
        }))
        break

      case 'file_done':
        setState((s) => ({
          ...s,
          doneFiles: [...s.doneFiles, event.file],
          migratedFiles: [...s.migratedFiles, event.migrated_file],
          currentFile: '',
        }))
        break

      case 'error':
        setState((s) => ({
          ...s,
          errorFiles: [...s.errorFiles, event.file],
          message: `Error on ${event.file}: ${event.message}`,
        }))
        break

      case 'complete':
        setState((s) => ({
          ...s,
          status: 'complete',
          percent: 100,
          message: 'Migration complete',
          result: event.result,
        }))
        break
    }
  }

  const reset = useCallback(() => {
    setState({
      status: 'idle', percent: 0, message: '', currentFile: '',
      doneFiles: [], errorFiles: [], migratedFiles: [], result: null, error: null,
    })
  }, [])

  return { ...state, startMigration, reset }
}
