import { CSSProperties } from 'react'

interface OutputPanelProps {
  output: string[]
  error: string | null
  running: boolean
}

const s: Record<string, CSSProperties> = {
  wrapper: {
    flex: 1,
    overflow: 'auto',
    padding: '16px',
  },
  empty: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    gap: '12px',
    color: 'var(--text-muted)',
  },
  emptyIcon: {
    fontSize: '32px',
    opacity: 0.4,
  },
  emptyText: {
    fontSize: '13px',
    textAlign: 'center' as const,
    lineHeight: 1.6,
  },
  kbd: {
    display: 'inline-block',
    background: 'var(--bg-panel)',
    border: '1px solid var(--border)',
    borderRadius: '4px',
    padding: '1px 5px',
    fontSize: '11px',
    fontFamily: 'var(--font-mono)',
    color: 'var(--text-secondary)',
  },
  runningWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    color: 'var(--accent-green)',
    fontSize: '13px',
  },
  spinner: {
    width: '14px',
    height: '14px',
    border: '2px solid rgba(63,185,80,0.3)',
    borderTopColor: 'var(--accent-green)',
    borderRadius: '50%',
    animation: 'spin 0.6s linear infinite',
    display: 'inline-block',
    flexShrink: 0,
  },
  error: {
    background: 'rgba(248,81,73,0.08)',
    border: '1px solid rgba(248,81,73,0.25)',
    borderRadius: 'var(--radius-md)',
    padding: '12px 16px',
    marginBottom: '12px',
  },
  errorLabel: {
    fontSize: '11px',
    fontWeight: 600,
    color: 'var(--accent-red)',
    letterSpacing: '0.08em',
    textTransform: 'uppercase' as const,
    marginBottom: '6px',
  },
  errorText: {
    fontFamily: 'var(--font-mono)',
    fontSize: '13px',
    color: '#f0a0a0',
    lineHeight: 1.6,
    whiteSpace: 'pre-wrap' as const,
  },
  outputLines: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '2px',
  },
  line: {
    fontFamily: 'var(--font-mono)',
    fontSize: '13px',
    color: 'var(--text-primary)',
    lineHeight: '22px',
    padding: '1px 0',
    animation: 'fadeSlideIn 0.2s ease both',
  },
}

export default function OutputPanel({ output, error, running }: OutputPanelProps) {
  if (running && output.length === 0 && !error) {
    return (
      <div style={s.wrapper}>
        <div style={{ ...s.empty, justifyContent: 'flex-start', paddingTop: '24px' }}>
          <div style={s.runningWrap}>
            <span style={s.spinner} />
            Executing program…
          </div>
        </div>
      </div>
    )
  }

  if (output.length === 0 && !error) {
    return (
      <div style={s.wrapper}>
        <div style={s.empty}>
          <span style={s.emptyIcon}>▶</span>
          <div style={s.emptyText}>
            Run your ZARA program to see output here.<br />
            Press <kbd style={s.kbd}>Ctrl+Enter</kbd> or click Run
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={s.wrapper}>
      {error && (
        <div style={s.error}>
          <div style={s.errorLabel}>⚠ Error</div>
          <pre style={s.errorText}>{error}</pre>
        </div>
      )}
      {output.length > 0 && (
        <div style={s.outputLines}>
          {output.map((line, i) => (
            <div key={i} style={{ ...s.line, animationDelay: `${i * 30}ms` }}>
              <span style={{ color: 'var(--text-muted)', marginRight: '12px', fontSize: '11px' }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              {line}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
