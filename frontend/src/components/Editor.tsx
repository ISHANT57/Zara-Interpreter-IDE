import { useRef, useEffect, CSSProperties, KeyboardEvent } from 'react'

interface EditorProps {
  code: string
  onChange: (code: string) => void
  onRun: () => void
  onCursorChange: (line: number, col: number) => void
}

const s: Record<string, CSSProperties> = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    background: 'var(--bg-base)',
    overflow: 'hidden',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    borderBottom: '1px solid var(--border-soft)',
    flexShrink: 0,
  },
  dot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: 'var(--accent-green)',
    boxShadow: '0 0 6px var(--accent-green)',
  },
  label: {
    fontSize: '11px',
    fontWeight: 600,
    letterSpacing: '0.1em',
    textTransform: 'uppercase' as const,
    color: 'var(--text-secondary)',
  },
  hint: {
    marginLeft: 'auto',
    fontSize: '11px',
    color: 'var(--text-muted)',
    fontFamily: 'var(--font-mono)',
  },
  editorRow: {
    display: 'flex',
    flex: 1,
    overflow: 'hidden',
  },
  lineNumbers: {
    padding: '14px 0',
    minWidth: '48px',
    textAlign: 'right' as const,
    paddingRight: '12px',
    userSelect: 'none',
    color: 'var(--text-muted)',
    fontSize: '13px',
    fontFamily: 'var(--font-mono)',
    lineHeight: '22px',
    background: 'var(--bg-base)',
    borderRight: '1px solid var(--border-soft)',
    flexShrink: 0,
    overflowY: 'hidden',
  },
  textarea: {
    flex: 1,
    resize: 'none',
    background: 'transparent',
    border: 'none',
    outline: 'none',
    color: 'var(--text-primary)',
    fontSize: '13px',
    fontFamily: 'var(--font-mono)',
    lineHeight: '22px',
    padding: '14px 16px',
    tabSize: 4,
    caretColor: 'var(--accent-blue)',
    overflowY: 'auto',
    overflowX: 'auto',
    whiteSpace: 'pre',
  },
}

export default function Editor({ code, onChange, onRun, onCursorChange }: EditorProps) {
  const taRef = useRef<HTMLTextAreaElement>(null)
  const lnRef = useRef<HTMLDivElement>(null)

  const lineCount = code.split('\n').length

  useEffect(() => {
    const ta = taRef.current
    const ln = lnRef.current
    if (!ta || !ln) return
    const sync = () => { ln.scrollTop = ta.scrollTop }
    ta.addEventListener('scroll', sync)
    return () => ta.removeEventListener('scroll', sync)
  }, [])

  function handleKey(e: KeyboardEvent<HTMLTextAreaElement>) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault()
      onRun()
      return
    }
    if (e.key === 'Tab') {
      e.preventDefault()
      const ta = e.currentTarget
      const start = ta.selectionStart
      const end = ta.selectionEnd
      const newVal = code.slice(0, start) + '    ' + code.slice(end)
      onChange(newVal)
      requestAnimationFrame(() => {
        ta.selectionStart = ta.selectionEnd = start + 4
      })
    }
  }

  function handleSelect() {
    const ta = taRef.current
    if (!ta) return
    const text = ta.value.slice(0, ta.selectionStart)
    const lines = text.split('\n')
    onCursorChange(lines.length, lines[lines.length - 1].length + 1)
  }

  return (
    <div style={s.wrapper}>
      <div style={s.header}>
        <span style={s.dot} />
        <span style={s.label}>Code Editor</span>
        <span style={s.hint}>Ctrl+Enter to run · Tab for indent</span>
      </div>
      <div style={s.editorRow}>
        <div ref={lnRef} style={s.lineNumbers}>
          {Array.from({ length: lineCount }, (_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>
        <textarea
          ref={taRef}
          style={s.textarea}
          value={code}
          onChange={e => onChange(e.target.value)}
          onKeyDown={handleKey}
          onKeyUp={handleSelect}
          onClick={handleSelect}
          placeholder="# Write ZARA code here&#10;# Example:&#10;set x = 10&#10;set y = 20&#10;show x + y"
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
        />
      </div>
    </div>
  )
}
