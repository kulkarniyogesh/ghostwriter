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

      // Patch input() to return empty string — stdin not available in WebAssembly
      await pyodide.runPythonAsync(`
import sys, io, builtins

_stdout_lines = []
_stderr_lines = []

class _Capture(io.StringIO):
    def __init__(self, store):
        super().__init__()
        self._store = store
    def write(self, s):
        if s and s != '\\n':
            self._store.append(s)
        return len(s)

sys.stdout = _Capture(_stdout_lines)
sys.stderr = _Capture(_stderr_lines)

# Replace input() so interactive programs don't crash
_original_input = builtins.input
def _safe_input(prompt=''):
    if prompt:
        _stdout_lines.append(str(prompt))
    return ''
builtins.input = _safe_input
      `)

      // Run the user code
      try {
        await pyodide.runPythonAsync(code)
      } catch (pyErr) {
        setOutput((prev) => [...prev, { type: 'stderr', text: String(pyErr) }])
      }

      // Collect captured output
      const stdoutLines = await pyodide.runPythonAsync('list(_stdout_lines)')
      const stderrLines = await pyodide.runPythonAsync('list(_stderr_lines)')

      stdoutLines.toJs().forEach((line) =>
        setOutput((prev) => [...prev, { type: 'stdout', text: line }])
      )
      stderrLines.toJs().forEach((line) =>
        setOutput((prev) => [...prev, { type: 'stderr', text: line }])
      )

      // Reset
      await pyodide.runPythonAsync(`
sys.stdout = sys.__stdout__
sys.stderr = sys.__stderr__
builtins.input = _original_input
      `)

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
