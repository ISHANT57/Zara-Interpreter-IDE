import { CSSProperties } from 'react'

interface VariablesPanelProps {
  variables: Record<string, number | string | boolean>
}

const TYPE_COLORS: Record<string, string> = {
  number:  'var(--accent-blue)',
  string:  'var(--accent-purple)',
  boolean: 'var(--accent-orange)',
}

const TYPE_BG: Record<string, string> = {
  number:  'rgba(88,166,255,0.1)',
  string:  'rgba(188,140,255,0.1)',
  boolean: 'rgba(255,166,87,0.1)',
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
    color: 'var(--text-muted)',
    gap: '8px',
    fontSize: '13px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
    gap: '10px',
  },
  card: {
    background: 'var(--bg-panel)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-md)',
    padding: '12px 14px',
    animation: 'fadeSlideIn 0.2s ease both',
  },
  cardTop: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '8px',
  },
  varName: {
    fontFamily: 'var(--font-mono)',
    fontSize: '13px',
    fontWeight: 600,
    color: 'var(--text-primary)',
  },
  badge: {
    fontSize: '10px',
    fontWeight: 600,
    letterSpacing: '0.06em',
    textTransform: 'uppercase' as const,
    padding: '2px 6px',
    borderRadius: '4px',
  },
  varValue: {
    fontFamily: 'var(--font-mono)',
    fontSize: '15px',
    fontWeight: 500,
    wordBreak: 'break-all' as const,
  },
}

export default function VariablesPanel({ variables }: VariablesPanelProps) {
  const entries = Object.entries(variables)

  if (entries.length === 0) {
    return (
      <div style={s.wrapper}>
        <div style={s.empty}>
          <span style={{ fontSize: '24px' }}>📦</span>
          <span>No variables yet — run your program</span>
        </div>
      </div>
    )
  }

  return (
    <div style={s.wrapper}>
      <div style={s.grid}>
        {entries.map(([name, val], i) => {
          const type = typeof val
          const color = TYPE_COLORS[type] || 'var(--text-secondary)'
          const bg    = TYPE_BG[type]    || 'rgba(255,255,255,0.05)'
          return (
            <div key={name} style={{ ...s.card, animationDelay: `${i * 40}ms` }}>
              <div style={s.cardTop}>
                <span style={s.varName}>{name}</span>
                <span style={{ ...s.badge, color, background: bg }}>{type}</span>
              </div>
              <div style={{ ...s.varValue, color }}>{String(val)}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
