import { CSSProperties } from 'react'

interface TopbarProps {
  running: boolean
  onRun: () => void
  onClear: () => void
  onExamplesToggle: () => void
  showExamples: boolean
}

const s: Record<string, CSSProperties> = {
  bar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 16px',
    height: '52px',
    background: 'var(--bg-surface)',
    borderBottom: '1px solid var(--border)',
    flexShrink: 0,
    gap: '12px',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    userSelect: 'none',
  },
  logoIcon: { fontSize: '20px', lineHeight: 1 },
  logoText: {
    fontFamily: 'var(--font-mono)',
    fontWeight: 600,
    fontSize: '16px',
    color: 'var(--text-primary)',
    letterSpacing: '0.05em',
  },
  badge: {
    background: 'var(--border)',
    color: 'var(--text-secondary)',
    fontSize: '10px',
    fontWeight: 600,
    padding: '2px 6px',
    borderRadius: '4px',
    letterSpacing: '0.08em',
    textTransform: 'uppercase' as const,
  },
  actions: { display: 'flex', alignItems: 'center', gap: '8px' },
  runBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '7px 16px',
    background: 'var(--run-bg)',
    color: '#fff',
    borderRadius: 'var(--radius-sm)',
    fontWeight: 600,
    fontSize: '13px',
    transition: 'background 0.15s',
    flexShrink: 0,
  },
  ghostBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    padding: '6px 12px',
    background: 'transparent',
    border: '1px solid var(--border)',
    color: 'var(--text-secondary)',
    borderRadius: 'var(--radius-sm)',
    fontSize: '13px',
    fontWeight: 500,
    transition: 'all 0.15s',
  },
  activeGhostBtn: {
    background: 'var(--bg-hover)',
    color: 'var(--text-primary)',
    border: '1px solid var(--accent-blue)',
  },
  shortcut: {
    fontSize: '11px',
    opacity: 0.6,
    fontFamily: 'var(--font-mono)',
  },
  spinner: {
    width: '12px',
    height: '12px',
    border: '2px solid rgba(255,255,255,0.3)',
    borderTopColor: '#fff',
    borderRadius: '50%',
    animation: 'spin 0.6s linear infinite',
    display: 'inline-block',
  },
}

export default function Topbar({ running, onRun, onClear, onExamplesToggle, showExamples }: TopbarProps) {
  return (
    <header style={s.bar}>
      <div style={s.logo}>
        <span style={s.logoIcon}>⚡</span>
        <span style={s.logoText}>ZARA</span>
        <span style={s.badge}>IDE</span>
      </div>

      <div style={s.actions}>
        <button
          style={{
            ...s.runBtn,
            background: running ? '#1a4d2c' : 'var(--run-bg)',
            cursor: running ? 'not-allowed' : 'pointer',
          }}
          onClick={onRun}
          disabled={running}
          title="Run (Ctrl+Enter)"
        >
          {running ? <span style={s.spinner} /> : '▶'}
          {running ? 'Running…' : 'Run'}
          {!running && <span style={s.shortcut}>⌃↵</span>}
        </button>

        <button
          style={{ ...s.ghostBtn, ...(showExamples ? s.activeGhostBtn : {}) }}
          onClick={onExamplesToggle}
        >
          📚 Examples
        </button>

        <button
          style={{ ...s.ghostBtn, color: '#f85149', border: '1px solid #3d1f1f' }}
          onClick={onClear}
        >
          ✕ Clear
        </button>
      </div>
    </header>
  )
}
