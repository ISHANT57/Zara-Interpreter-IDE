import { CSSProperties, useState } from 'react'
import type { Example } from '../types'
import { EXAMPLES } from '../examples'

interface ExamplesSidebarProps {
  onSelect: (code: string) => void
  onClose: () => void
}

const s: Record<string, CSSProperties> = {
  overlay: {
    position: 'fixed' as const,
    inset: 0,
    zIndex: 100,
    display: 'flex',
    justifyContent: 'flex-end',
  },
  backdrop: {
    position: 'absolute' as const,
    inset: 0,
    background: 'rgba(0,0,0,0.5)',
  },
  panel: {
    position: 'relative' as const,
    width: '340px',
    background: 'var(--bg-surface)',
    borderLeft: '1px solid var(--border)',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    animation: 'fadeSlideIn 0.2s ease both',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 20px',
    borderBottom: '1px solid var(--border)',
    flexShrink: 0,
  },
  title: {
    fontWeight: 600,
    fontSize: '14px',
    color: 'var(--text-primary)',
  },
  closeBtn: {
    background: 'transparent',
    color: 'var(--text-muted)',
    fontSize: '18px',
    lineHeight: 1,
    padding: '2px 6px',
    borderRadius: '4px',
    cursor: 'pointer',
    border: 'none',
  },
  list: {
    flex: 1,
    overflow: 'auto',
    padding: '12px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '6px',
  },
  item: {
    background: 'var(--bg-panel)',
    border: '1px solid var(--border-soft)',
    borderRadius: 'var(--radius-md)',
    padding: '12px 14px',
    cursor: 'pointer',
    transition: 'all 0.15s',
  },
  itemHovered: {
    background: 'var(--bg-hover)',
    border: '1px solid var(--accent-blue)',
  },
  itemName: {
    fontWeight: 600,
    fontSize: '13px',
    color: 'var(--text-primary)',
    marginBottom: '3px',
  },
  itemDesc: {
    fontSize: '12px',
    color: 'var(--text-secondary)',
    marginBottom: '10px',
  },
  preview: {
    background: 'var(--bg-base)',
    border: '1px solid var(--border-soft)',
    borderRadius: 'var(--radius-sm)',
    padding: '8px 10px',
    fontFamily: 'var(--font-mono)',
    fontSize: '11px',
    color: 'var(--text-secondary)',
    lineHeight: 1.6,
    overflow: 'hidden',
    maxHeight: '80px',
    whiteSpace: 'pre' as const,
  },
}

function ExampleItem({ ex, onSelect }: { ex: Example; onSelect: (code: string) => void }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      style={{ ...s.item, ...(hovered ? s.itemHovered : {}) }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onSelect(ex.code)}
    >
      <div style={s.itemName}>{ex.name}</div>
      <div style={s.itemDesc}>{ex.description}</div>
      <pre style={s.preview}>{ex.code}</pre>
    </div>
  )
}

export default function ExamplesSidebar({ onSelect, onClose }: ExamplesSidebarProps) {
  return (
    <div style={s.overlay}>
      <div style={s.backdrop} onClick={onClose} />
      <div style={s.panel}>
        <div style={s.header}>
          <span style={s.title}>📚 Examples</span>
          <button style={s.closeBtn} onClick={onClose}>✕</button>
        </div>
        <div style={s.list}>
          {EXAMPLES.map(ex => (
            <ExampleItem key={ex.name} ex={ex} onSelect={(code) => { onSelect(code); onClose() }} />
          ))}
        </div>
      </div>
    </div>
  )
}
