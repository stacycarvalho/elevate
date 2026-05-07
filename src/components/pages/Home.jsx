import { useState } from 'react'
import ScoreRing from '../ScoreRing'

const ACTION_DETAILS = {
  'Portfolio rebalancing — approve to execute': {
    action: 'Move ₹1.8L from HDFC Flexi Cap → ICICI Pru Short Duration',
    reason: 'Your equity allocation drifted to 78% (target: 70%) as markets ran up 12% this quarter. No LTCG triggered — this rebalance is tax-efficient.',
    impact: 'Reduces equity overexposure, keeps you within target allocation. Estimated risk reduction: ~8%.',
  },
  'Your credit card is costing you money': {
    action: 'Create a ₹2,000/month auto-payment toward Axis Card balance',
    reason: 'At 36% annual interest, every extra rupee you pay now saves you 3× over 12 months. The minimum payment barely covers the interest.',
    impact: 'Card cleared in ~8 months. Saves approximately ₹2,700 in interest.',
  },
  'No safety net yet': {
    action: 'Auto-save ₹500 every Friday to your savings account',
    reason: 'An emergency fund is the single most important financial safety net. Without it, any unexpected cost means borrowing at high interest.',
    impact: '1 month of emergency expenses covered in ~24 weeks.',
  },
  'No term insurance — your family is exposed': {
    action: 'Get quotes from 3 term insurance providers for ₹1Cr cover',
    reason: 'Your household earns ₹1.8L/month with Aryan depending on both incomes. If either stopped, your EMI alone would drain savings in 14 months.',
    impact: '₹1Cr cover for both of you from ~₹1,600/month combined.',
  },
  "Aryan's education fund — clock is ticking": {
    action: 'Set up ₹5,000/month SIP in a diversified equity fund',
    reason: 'College costs are rising 10% per year. 15 years of compounding is the most powerful tool available — starting today vs starting next year makes a ₹4L difference.',
    impact: 'Projects to ₹32L by the time Aryan reaches college age.',
  },
  'SBI FD matures in 18 days': {
    action: 'Compare renewal rates at HDFC, ICICI and Axis before June 2',
    reason: 'Auto-renewal locks you into the current rate. HDFC is offering 7.25% vs your current 7.1% — a small difference that compounds to ₹1,200/year.',
    impact: '₹1,200 extra per year on the same ₹8L principal.',
  },
}

function ActionModal({ card, initialTab = 'confirm', onClose, onConfirm }) {
  const [tab, setTab] = useState(initialTab)
  const [modAmt, setModAmt] = useState('')
  const d = ACTION_DETAILS[card.title] || {
    action: card.actions[0] + ' — agent will execute this step',
    reason: card.body,
    impact: 'Action will appear in your agent log.',
  }

  return (
    <div className="action-modal-overlay" onClick={onClose}>
      <div className="action-modal" onClick={e => e.stopPropagation()}>
        <div className="am-handle" />

        {tab === 'confirm' && (
          <>
            <div className="am-chip">Ready to execute</div>
            <div className="am-title">{card.title}</div>
            <div className="am-action-box">
              <div className="am-action-label">Agent will</div>
              <div className="am-action-text">{d.action}</div>
            </div>
            <div className="am-impact">{d.impact}</div>
            <div className="am-btns">
              <button className="btn btn-primary" style={{ flex: 2 }} onClick={() => { onConfirm('approved'); onClose() }}>
                Approve ✓
              </button>
              <button className="btn btn-ghost" onClick={() => setTab('modify')}>Modify</button>
            </div>
            <div className="am-btns" style={{ marginTop: '8px' }}>
              <button className="btn btn-ghost" style={{ flex: 1, fontSize: '11px' }} onClick={() => setTab('why')}>
                Why now?
              </button>
              <button className="btn btn-ghost" style={{ flex: 1, fontSize: '11px' }} onClick={onClose}>
                Skip for now
              </button>
            </div>
          </>
        )}

        {tab === 'why' && (
          <>
            <div className="am-chip am-chip-blue">The reasoning</div>
            <div className="am-title">Why now? ⚡</div>
            <div className="am-impact" style={{ marginBottom: '10px' }}>{d.reason}</div>
            <div className="am-action-box">
              <div className="am-action-label">If you act today</div>
              <div className="am-action-text">{d.impact}</div>
            </div>
            <div className="am-btns" style={{ marginTop: '16px' }}>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => setTab('confirm')}>Proceed to approve</button>
              <button className="btn btn-ghost" onClick={onClose}>Skip</button>
            </div>
          </>
        )}

        {tab === 'modify' && (
          <>
            <div className="am-chip">Modify action</div>
            <div className="am-title">{card.title}</div>
            <div className="am-impact" style={{ marginBottom: '12px' }}>Adjust the amount or parameters before approving.</div>
            <div className="wi-row">
              <div className="wi-label">Amount</div>
              <span style={{ fontSize: '12px', color: 'var(--t3)' }}>₹</span>
              <input className="wi-input" type="number" placeholder="e.g. 1000" value={modAmt} onChange={e => setModAmt(e.target.value)} />
            </div>
            <div className="am-btns" style={{ marginTop: '16px' }}>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => { onConfirm('modified'); onClose() }}>
                Confirm modified ✓
              </button>
              <button className="btn btn-ghost" onClick={() => setTab('confirm')}>Back</button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default function Home({ persona: p, onPageChange, onAsk, showToast }) {
  const [activeTab, setActiveTab] = useState('needed')
  const [rightTab, setRightTab] = useState('insights')
  const [actionModal, setActionModal] = useState(null)

  const shortGreeting = p.greeting
    .replace(`, ${p.first}`, '')
    .replace(` ${p.first}`, '')

  const handleActionBtn = (btn, card, j) => {
    if (btn === 'Approve ✓') { setActionModal({ card, tab: 'confirm' }); return }
    if (btn === 'Modify') { setActionModal({ card, tab: 'modify' }); return }
    if (btn === 'Why now?') { setActionModal({ card, tab: 'why' }); return }
    if (j === 0) { setActionModal({ card, tab: 'confirm' }); return }
    showToast(btn + ' — done')
  }

  const handleConfirm = (type) => {
    showToast(type === 'modified' ? '✓ Modified action queued — check agent log' : '✓ Executing now — check agent log for details')
  }

  return (
    <>
      {actionModal && (
        <ActionModal
          card={actionModal.card}
          initialTab={actionModal.tab}
          onClose={() => setActionModal(null)}
          onConfirm={handleConfirm}
        />
      )}

      <div className="hero-banner">
        <div className="hb-tier">{p.tierLabel}</div>
        <div className="hb-greeting">{shortGreeting}</div>
        <div className="hb-sub">{p.welcomeSub}</div>
        <div className="hb-kpis">
          <div className="hb-kpi">
            <div className="hb-kpi-label">{p.kpis[0].label}</div>
            <div className="hb-kpi-value">{p.kpis[0].value}</div>
            <div className="hb-kpi-delta">{p.kpis[0].delta}</div>
          </div>
          <div className="hb-divider" />
          <div className="hb-kpi">
            <div className="hb-kpi-label">Health score</div>
            <div className="hb-kpi-value">
              {p.score}<span style={{ fontSize: '12px', opacity: 0.7 }}>/100</span>
            </div>
            <div className="hb-kpi-delta">{p.kpis[3]?.delta}</div>
          </div>
        </div>
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
                        onClick={() => handleActionBtn(btn, a, j)}
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
                        onClick={() => handleActionBtn(btn, a, j)}
                      >
                        {btn}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="home-action-btns">
            <button className="home-action-btn" onClick={() => onPageChange('cashflow')}>
              <div className="hab-icon">📊</div>
              <div className="hab-text">
                <div className="hab-title">Cash Flow</div>
                <div className="hab-sub">See where every rupee went</div>
              </div>
              <span className="hab-arrow">→</span>
            </button>
            <button className="home-action-btn" onClick={() => onPageChange('plan')}>
              <div className="hab-icon">🎯</div>
              <div className="hab-text">
                <div className="hab-title">Build Your Plan</div>
                <div className="hab-sub">Goals, scenarios &amp; FIRE timeline</div>
              </div>
              <span className="hab-arrow">→</span>
            </button>
            <button className="home-action-btn" onClick={() => onPageChange('log')}>
              <div className="hab-icon">🤖</div>
              <div className="hab-text">
                <div className="hab-title">Agent Log</div>
                <div className="hab-sub">Every action explained, undoable</div>
              </div>
              <span className="hab-arrow">→</span>
            </button>
          </div>
        </div>

        <div>
          <div className="card card-sm">
            <div className="tab-bar">
              <button className={`tab ${rightTab === 'insights' ? 'active' : ''}`} onClick={() => setRightTab('insights')}>
                💡 Insights
              </button>
              <button className={`tab ${rightTab === 'health' ? 'active' : ''}`} onClick={() => setRightTab('health')}>
                ❤️ Health score
              </button>
            </div>

            <div className={`tab-content ${rightTab === 'insights' ? 'active' : ''}`}>
              {p.insights.map((ins, i) => (
                <div key={i} className="insight-card" style={{ marginBottom: '10px' }}>
                  <div className="insight-label">{ins.label}</div>
                  <div className="insight-title">{ins.title}</div>
                  <div className="insight-body">{ins.body}</div>
                </div>
              ))}
            </div>

            <div className={`tab-content ${rightTab === 'health' ? 'active' : ''}`}>
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
      </div>
    </>
  )
}
