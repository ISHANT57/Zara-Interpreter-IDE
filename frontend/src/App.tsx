import { useState, useCallback, CSSProperties } from 'react'
import type { ExecutionResponse } from './types'
import { executeCode } from './api'
import Topbar from './components/Topbar'
import Editor from './components/Editor'
import ResultTabs from './components/ResultTabs'
import ExamplesSidebar from './components/ExamplesSidebar'
import StatusBar from './components/StatusBar'

const DEFAULT_CODE = `# Write ZARA code here
# Example:
set x = 10
set y = 20
show x + y`

const s: Record<string, CSSProperties> = {
  app: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    overflow: 'hidden',
    background: 'var(--bg-base)',
  },
  main: {
    display: 'flex',
    flex: 1,
    overflow: 'hidden',
  },
  editorPane: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    borderRight: '1px solid var(--border)',
    minWidth: 0,
  },
  resultPane: {
    width: '50%',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    minWidth: 0,
  },
}

export default function App() {
  const [code, setCode] = useState(DEFAULT_CODE)
  const [result, setResult] = useState<ExecutionResponse | null>(null)
  const [running, setRunning] = useState(false)
  const [showExamples, setShowExamples] = useState(false)
  const [status, setStatus] = useState('Ready')
  const [cursorLine, setCursorLine] = useState(1)
  const [cursorCol, setCursorCol] = useState(1)
  const [execTime, setExecTime] = useState<number | null>(null)

  const handleRun = useCallback(async () => {
    if (running) return
    setRunning(true)
    setStatus('Running…')
    setResult(null)
    try {
      const res = await executeCode(code)
      setResult(res)
      setExecTime(res.executionTimeMs ?? null)
      setStatus(res.error ? 'Error' : 'Done')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err)
      setResult({
        success: false,
        output: [],
        error: msg,
        executionTimeMs: 0,
        executionId: '',
        variables: {},
        ast: [],
      })
      setStatus('Error')
      setExecTime(null)
    } finally {
      setRunning(false)
    }
  }, [code, running])

  function handleClear() {
    setCode('')
    setResult(null)
    setStatus('Ready')
    setExecTime(null)
  }

  return (
    <div style={s.app}>
      <Topbar
        running={running}
        onRun={handleRun}
        onClear={handleClear}
        onExamplesToggle={() => setShowExamples(v => !v)}
        showExamples={showExamples}
      />

      <div style={s.main}>
        <div style={s.editorPane}>
          <Editor
            code={code}
            onChange={setCode}
            onRun={handleRun}
            onCursorChange={(ln, col) => { setCursorLine(ln); setCursorCol(col) }}
          />
        </div>
        <div style={s.resultPane}>
          <ResultTabs result={result} running={running} />
        </div>
      </div>

      <StatusBar
        status={status}
        line={cursorLine}
        col={cursorCol}
        charCount={code.length}
        execTime={execTime}
      />

      {showExamples && (
        <ExamplesSidebar
          onSelect={setCode}
          onClose={() => setShowExamples(false)}
        />
      )}
    </div>
  )
}
