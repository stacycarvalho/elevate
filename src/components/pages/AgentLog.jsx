import { agentLogData } from '../../data/transactions'

export default function AgentLog({ onBack, showToast }) {
  return (
    <>
      <div className="breadcrumb">
        <button className="breadcrumb-back" onClick={onBack}>← Back</button>
        <span className="breadcrumb-sep">/</span>
        <span className="breadcrumb-current">Agent action log</span>
      </div>
      <div className="card">
        <div style={{ fontSize: '11px', color: 'var(--t3)', marginBottom: '14px' }}>
          Every action taken — timestamped, plain-language rationale. Immutable record.
        </div>
        {agentLogData.map((l, i) => (
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
        ))}
      </div>
    </>
  )
}
