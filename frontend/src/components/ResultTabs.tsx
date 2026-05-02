import { CSSProperties, useState } from 'react'
import type { ExecutionResponse } from '../types'
import OutputPanel from './OutputPanel'
import VariablesPanel from './VariablesPanel'
import AstPanel from './AstPanel'

interface ResultTabsProps {
  result: ExecutionResponse | null
  running: boolean
}

type Tab = 'output' | 'variables' | 'ast'

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'output',    label: 'Output',    icon: '🖥' },
  { id: 'variables', label: 'Variables', icon: '📦' },
  { id: 'ast',       label: 'AST',       icon: '🌳' },
]

const s: Record<string, CSSProperties> = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    overflow: 'hidden',
    background: 'var(--bg-panel)',
  },
  tabBar: {
    display: 'flex',
    alignItems: 'center',
    borderBottom: '1px solid var(--border)',
    flexShrink: 0,
    padding: '0 4px',
  },
  tab: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '10px 16px',
    fontSize: '12px',
    fontWeight: 500,
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    border: 'none',
    borderBottom: '2px solid transparent',
    background: 'transparent',
    marginBottom: '-1px',
    transition: 'color 0.15s',
  },
  activeTab: {
    color: 'var(--text-primary)',
    borderBottom: '2px solid var(--accent-blue)',
  },
  content: {
    flex: 1,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column' as const,
  },
}

export default function ResultTabs({ result, running }: ResultTabsProps) {
  const [activeTab, setActiveTab] = useState<Tab>('output')

  return (
    <div style={s.wrapper}>
      <div style={s.tabBar}>
        {TABS.map(tab => (
          <button
            key={tab.id}
            style={activeTab === tab.id ? { ...s.tab, ...s.activeTab } : s.tab}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>
      <div style={s.content}>
        {activeTab === 'output' && (
          <OutputPanel
            output={result?.output ?? []}
            error={result?.error ?? null}
            running={running}
          />
        )}
        {activeTab === 'variables' && (
          <VariablesPanel variables={result?.variables ?? {}} />
        )}
        {activeTab === 'ast' && (
          <AstPanel ast={result?.ast ?? []} />
        )}
      </div>
    </div>
  )
}
