import { useState } from 'react'
import { agentLogData } from '../../data/transactions'

const TYPE_FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'completed', label: 'Completed' },
  { id: 'pending', label: 'Pending' },
  { id: 'routine', label: 'Routine' },
]

const DATE_FILTERS = [
  { id: 'all', label: 'All time' },
  { id: 'week', label: 'This week' },
  { id: 'month', label: 'This month' },
]

export default function AgentLog({ onBack, showToast }) {
  const [typeFilter, setTypeFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('all')

  const filteredLogs = agentLogData.filter(l => {
    if (typeFilter === 'all') return true
    const tagTexts = l.tags.map(t => t.text.toLowerCase())
    if (typeFilter === 'completed') return tagTexts.some(t => t.includes('complet'))
    if (typeFilter === 'pending') return tagTexts.some(t => t.includes('pending') || t.includes('awaiting'))
    if (typeFilter === 'routine') return tagTexts.some(t => t.includes('routine'))
    return true
  })

  return (
    <>
      <div className="breadcrumb">
        <button className="breadcrumb-back" onClick={onBack}>← Back</button>
        <span className="breadcrumb-sep">/</span>
        <span className="breadcrumb-current">Agent action log</span>
      </div>

      <div className="card">
        <div style={{ display: 'flex', gap: '10px', marginBottom: '14px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: '10px', fontWeight: 600, color: 'var(--t3)', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '.5px' }}>Time range</div>
            <div style={{ display: 'flex', gap: '4px' }}>
              {DATE_FILTERS.map(f => (
                <button
                  key={f.id}
                  className={`df-btn ${dateFilter === f.id ? 'active' : ''}`}
                  style={{ fontSize: '10px', padding: '3px 10px' }}
                  onClick={() => setDateFilter(f.id)}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '10px', fontWeight: 600, color: 'var(--t3)', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '.5px' }}>Type</div>
            <div style={{ display: 'flex', gap: '4px' }}>
              {TYPE_FILTERS.map(f => (
                <button
                  key={f.id}
                  className={`df-btn ${typeFilter === f.id ? 'active' : ''}`}
                  style={{ fontSize: '10px', padding: '3px 10px' }}
                  onClick={() => setTypeFilter(f.id)}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div style={{ fontSize: '11px', color: 'var(--t3)', marginBottom: '14px', paddingBottom: '14px', borderBottom: '1px solid var(--border)' }}>
          {filteredLogs.length} action{filteredLogs.length !== 1 ? 's' : ''} · Every action timestamped with plain-language rationale · Undo within 24 hrs
        </div>

        {filteredLogs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px', color: 'var(--t3)', fontSize: '12px' }}>
            No actions match this filter
          </div>
        ) : (
          filteredLogs.map((l, i) => (
            <div key={i} className="log-item">
              <div className="log-ico" style={{ background: l.bg, color: l.color }}>{l.ico}</div>
              <div style={{ flex: 1 }}>
                <div className="log-title">{l.title}</div>
                <div className="log-body">{l.body}</div>
                <div className="log-meta">
                  {l.tags.map((t, j) => (
                    <span key={j} className="log-tag" style={{ background: t.bg, color: t.color }}>{t.text}</span>
                  ))}
                  {l.time} ·{' '}
                  <span
                    style={{ color: 'var(--brand)', cursor: 'pointer' }}
                    onClick={() => showToast('Undo available within 24 hours')}
                  >
                    Undo
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  )
}
