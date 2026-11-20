import { useState, useRef, useCallback } from 'react'

/**
 * usePyodide — load Pyodide on demand and run Python code in-browser.
 * Pyodide is loaded from CDN only when first needed (not on page load).
 * Execution is sandboxed inside WebAssembly — no filesystem or network access.
 */
export default function usePyodide() {
  const pyodideRef = useRef(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isRunning, setIsRunning] = useState(false)
  const [output, setOutput] = useState([]) // [{ type: 'stdout'|'stderr'|'info', text }]
  const [error, setError] = useState(null)

  const loadPyodide = useCallback(async () => {
    if (pyodideRef.current) return pyodideRef.current

    setIsLoading(true)
    setError(null)

    try {
      // Dynamically inject Pyodide script from CDN
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
        stdout: (text) => {
          setOutput((prev) => [...prev, { type: 'stdout', text }])
        },
        stderr: (text) => {
          setOutput((prev) => [...prev, { type: 'stderr', text }])
        },
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
      const pyodide = await loadPyodide()
      if (!pyodide) return

      setOutput([{ type: 'info', text: '$ python main.py' }])

      // Redirect stdout/stderr via sys
      await pyodide.runPythonAsync(`
import sys
import io

# Capture output
_stdout_capture = io.StringIO()
_stderr_capture = io.StringIO()
sys.stdout = _stdout_capture
sys.stderr = _stderr_capture
      `)

      // Run the user code
      try {
        await pyodide.runPythonAsync(code)
      } catch (pyErr) {
        setOutput((prev) => [...prev, { type: 'stderr', text: String(pyErr) }])
      }

      // Collect captured output
      const stdout = await pyodide.runPythonAsync('_stdout_capture.getvalue()')
      const stderr = await pyodide.runPythonAsync('_stderr_capture.getvalue()')

      if (stdout) {
        stdout.split('\n').filter(Boolean).forEach((line) =>
          setOutput((prev) => [...prev, { type: 'stdout', text: line }])
        )
      }
      if (stderr) {
        stderr.split('\n').filter(Boolean).forEach((line) =>
          setOutput((prev) => [...prev, { type: 'stderr', text: line }])
        )
      }

      // Reset stdout/stderr
      await pyodide.runPythonAsync('sys.stdout = sys.__stdout__; sys.stderr = sys.__stderr__')

      setOutput((prev) => [
        ...prev,
        { type: 'info', text: `\nProcess finished.` },
      ])
    } catch (err) {
      setError(err.message)
    } finally {
      setIsRunning(false)
    }
  }, [loadPyodide])

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
