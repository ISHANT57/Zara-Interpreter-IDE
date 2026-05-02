import { CSSProperties } from 'react'

interface AstPanelProps {
  ast: string[]
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
  list: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '4px',
  },
  node: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px',
    background: 'var(--bg-panel)',
    border: '1px solid var(--border-soft)',
    borderRadius: 'var(--radius-sm)',
    padding: '8px 12px',
    animation: 'fadeSlideIn 0.2s ease both',
  },
  index: {
    fontFamily: 'var(--font-mono)',
    fontSize: '11px',
    color: 'var(--text-muted)',
    minWidth: '20px',
    paddingTop: '1px',
    flexShrink: 0,
  },
  text: {
    fontFamily: 'var(--font-mono)',
    fontSize: '12px',
    color: 'var(--text-secondary)',
    lineHeight: 1.5,
    wordBreak: 'break-word' as const,
  },
  keyword: {
    color: 'var(--accent-blue)',
    fontWeight: 600,
  },
}

function ColorizedNode({ desc }: { desc: string }) {
  const spaceIdx = desc.indexOf(' ')
  if (spaceIdx === -1) {
    return <span style={s.keyword}>{desc}</span>
  }
  return (
    <>
      <span style={s.keyword}>{desc.slice(0, spaceIdx)}</span>
      <span>{desc.slice(spaceIdx)}</span>
    </>
  )
}

export default function AstPanel({ ast }: AstPanelProps) {
  if (!ast || ast.length === 0) {
    return (
      <div style={s.wrapper}>
        <div style={s.empty}>
          <span style={{ fontSize: '24px' }}>🌳</span>
          <span>AST will appear after running your program</span>
        </div>
      </div>
    )
  }

  return (
    <div style={s.wrapper}>
      <div style={s.list}>
        {ast.map((node, i) => (
          <div key={i} style={{ ...s.node, animationDelay: `${i * 25}ms` }}>
            <span style={s.index}>{i + 1}</span>
            <span style={s.text}>
              <ColorizedNode desc={String(node)} />
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
