import { CSSProperties } from 'react'

interface StatusBarProps {
  status: string
  line: number
  col: number
  charCount: number
  execTime: number | null
}

const s: Record<string, CSSProperties> = {
  bar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 16px',
    height: '28px',
    background: 'var(--bg-surface)',
    borderTop: '1px solid var(--border)',
    flexShrink: 0,
    fontSize: '11px',
    fontFamily: 'var(--font-mono)',
    color: 'var(--text-muted)',
    userSelect: 'none',
  },
  left: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  dot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    background: 'var(--accent-green)',
    display: 'inline-block',
    marginRight: '6px',
  },
}

export default function StatusBar({ status, line, col, charCount, execTime }: StatusBarProps) {
  return (
    <div style={s.bar}>
      <div style={s.left}>
        <span>
          <span style={s.dot} />
          {status}
        </span>
        <span>Ln {line}, Col {col}</span>
        <span>{charCount} chars</span>
      </div>
      <div style={s.right}>
        {execTime !== null && <span>⏱ {execTime}ms</span>}
        <span>ZARA 1.0</span>
      </div>
    </div>
  )
}
