import { useState, useRef, useCallback } from 'react'

/**
 * usePyodide — run simple Python scripts in-browser via Pyodide.
 * Interactive programs (using input()) are detected and skipped safely.
 * Pyodide loads from CDN only when first needed.
 */
export default function usePyodide() {
  const pyodideRef = useRef(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isRunning, setIsRunning] = useState(false)
  const [output, setOutput] = useState([])
  const [error, setError] = useState(null)

  const addLine = useCallback((type, text) => {
    setOutput((prev) => [...prev, { type, text }])
  }, [])

  const isInteractive = (code) => {
    return /\binput\s*\(/.test(code) || /\bgetpass\s*\(/.test(code)
  }

  const loadPyodide = useCallback(async () => {
    if (pyodideRef.current) return pyodideRef.current
    setIsLoading(true)
    setError(null)
    try {
      if (!window.loadPyodide) {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script')
          script.src = 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js'
          script.onload = resolve
          script.onerror = () => reject(new Error('Failed to load Pyodide from CDN'))
          document.head.appendChild(script)
        })
      }

      const pyodide = await window.loadPyodide({
        indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/',
      })

      pyodideRef.current = pyodide
      return pyodide
    } catch (err) {
      setError(`Failed to load Python runtime: ${err.message}`)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  const runCode = useCallback(async (code) => {
    setOutput([])
    setError(null)
    setIsRunning(true)

    try {
      // Detect interactive programs — can't run without stdin
      if (isInteractive(code)) {
        addLine('info', '$ python main.py')
        addLine('stdout', '# This program uses input() — interactive mode not supported in browser.')
        addLine('stdout', '# Running in demo mode: showing program structure only.\n')

        // Extract and show print statements and function names as a dry run
        const prints = [...code.matchAll(/print\s*\((.*?)\)/g)].slice(0, 10)
        if (prints.length > 0) {
          addLine('stdout', '# Sample output this program would produce:')
          prints.forEach(([, content]) => {
            const cleaned = content.replace(/['"]/g, '').replace(/f?["']|["']/g, '')
            if (cleaned.trim()) addLine('stdout', cleaned.trim())
          })
        }

        addLine('info', '\n# Download the ZIP to run this program locally:')
        addLine('info', '# python main.py')
        return
      }

      const pyodide = await loadPyodide()
      if (!pyodide) return

      addLine('info', '$ python main.py')

      // Capture stdout/stderr
      pyodide.setStdout({ batched: (text) => addLine('stdout', text) })
      pyodide.setStderr({ batched: (text) => addLine('stderr', text) })

      try {
        await pyodide.runPythonAsync(code)
      } catch (pyErr) {
        const msg = String(pyErr)
        // Filter out noise, show clean error
        const clean = msg.split('\n').filter(l =>
          !l.includes('_pyodide') && !l.includes('CodeRunner')
        ).join('\n').trim()
        addLine('stderr', clean || msg)
      }

      addLine('info', '\nProcess finished.')
    } catch (err) {
      setError(err.message)
    } finally {
      setIsRunning(false)
    }
  }, [loadPyodide, addLine])

  const clearOutput = useCallback(() => {
    setOutput([])
    setError(null)
  }, [])

  return {
    isLoading,
    isRunning,
    output,
    error,
    runCode,
    clearOutput,
    isReady: !!pyodideRef.current,
  }
}
