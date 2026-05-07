import { useState } from 'react'
import ScoreRing from '../ScoreRing'

const ACTION_MSGS = {
  'Approve ✓': '✓ Executing now — check agent log for details',
  'See payoff plan': 'Opening debt payoff plan',
  'Start ₹500/week': 'Auto-save of ₹500/week activated',
  'Get a quote': 'Fetching insurance quotes',
  'Start SIP': 'Opening SIP setup',
  'Compare rates': 'Comparing FD rates across banks',
  'Review & send': 'Opening negotiation draft',
  'See positions': 'Opening tax-loss positions',
}

export default function Home({ persona: p, onPageChange, onAsk, showToast }) {
  const [activeTab, setActiveTab] = useState('needed')

  const agentAct = (action) => showToast(ACTION_MSGS[action] || action + ' — done')

  return (
    <>
      <div className="welcome-bar">
        <div className="welcome-name">{p.greeting}</div>
        <div className="welcome-sub">{p.welcomeSub}</div>
        <span className="welcome-tier">{p.tierLabel}</span>
      </div>

      <div className="home-grid">
        <div>
          <div className="card" style={{ marginBottom: '14px' }}>
            <div className="tab-bar">
              {[
                { id: 'needed', label: 'Action needed', count: p.needed.length, countClass: 'warn' },
                { id: 'taken', label: 'Action taken', count: p.taken.length, countStyle: { background: 'var(--ok)' } },
                { id: 'growth', label: 'Growth', count: p.growth.length },
              ].map(tab => (
                <button
                  key={tab.id}
                  className={`tab ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                  <span className={`tab-count ${tab.countClass || ''}`} style={tab.countStyle}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            <div className={`tab-content ${activeTab === 'needed' ? 'active' : ''}`}>
              {p.needed.map((a, i) => (
                <div key={i} className="agent-card needed">
                  <div className="ac-top">
                    <span className="chip chip-needed">Action needed</span>
                    <div className="ac-title">{a.title}</div>
                  </div>
                  <div className="ac-body">{a.body}</div>
                  <div className="ac-actions">
                    {a.actions.map((btn, j) => (
                      <button
                        key={j}
                        className={`ac-btn ${j === 0 ? 'ac-approve' : 'ac-dismiss'}`}
                        onClick={() => agentAct(btn)}
                      >
                        {btn}
                      </button>
                    ))}
                    <button className="ac-btn ac-why" onClick={onAsk}>Explain this</button>
                  </div>
                </div>
              ))}
            </div>

            <div className={`tab-content ${activeTab === 'taken' ? 'active' : ''}`}>
              {p.taken.map((a, i) => (
                <div key={i} className="agent-card taken">
                  <div className="ac-top">
                    <span className="chip chip-taken">Agent did this</span>
                    <div className="ac-title">{a.title}</div>
                  </div>
                  <div className="ac-body">{a.body}</div>
                  <div className="log-meta">
                    <span className="log-tag" style={{ background: a.tag.bg, color: a.tag.color }}>{a.tag.text}</span>
                    {a.time} ·{' '}
                    <span
                      style={{ color: 'var(--brand)', cursor: 'pointer' }}
                      onClick={() => showToast('Undo available within 24 hours')}
                    >
                      Undo
                    </span>
                  </div>
                </div>
              ))}
              <button className="sec-link" style={{ marginTop: '8px', display: 'block' }} onClick={() => onPageChange('log')}>
                View full agent log →
              </button>
            </div>

            <div className={`tab-content ${activeTab === 'growth' ? 'active' : ''}`}>
              {p.growth.map((a, i) => (
                <div key={i} className="agent-card growth">
                  <div className="ac-top">
                    <span className="chip chip-growth">Growth opportunity</span>
                    <div className="ac-title">{a.title}</div>
                  </div>
                  <div className="ac-body">{a.body}</div>
                  <div className="ac-actions">
                    {a.actions.map((btn, j) => (
                      <button
                        key={j}
                        className={`ac-btn ${j === 0 ? 'ac-approve' : 'ac-dismiss'}`}
                        onClick={() => agentAct(btn)}
                      >
                        {btn}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button className="btn btn-ghost btn-sm" style={{ flex: 1, minWidth: '120px' }} onClick={() => onPageChange('cashflow')}>📊 View cash flow</button>
            <button className="btn btn-ghost btn-sm" style={{ flex: 1, minWidth: '120px' }} onClick={() => onPageChange('plan')}>🎯 Let's plan</button>
            <button className="btn btn-ghost btn-sm" style={{ flex: 1, minWidth: '120px' }} onClick={() => onPageChange('log')}>📋 Agent log</button>
          </div>
        </div>

        <div>
          {p.insights.map((ins, i) => (
            <div key={i} className="insight-card" style={{ marginBottom: '10px' }}>
              <div className="insight-label">{ins.label}</div>
              <div className="insight-title">{ins.title}</div>
              <div className="insight-body">{ins.body}</div>
            </div>
          ))}

          <div className="card card-sm">
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--t1)', marginBottom: '12px' }}>
              Financial health score
            </div>
            <div className="score-ring-wrap">
              <ScoreRing score={p.score} />
              <div style={{ flex: 1 }}>
                {p.dims.map((d, i) => (
                  <div key={i} className="dim-row">
                    <div className="dim-label">{d.label}</div>
                    <div className="dim-track">
                      <div className="dim-fill" style={{ width: `${d.score}%`, background: d.color }} />
                    </div>
                    <div className="dim-val">{d.score}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
