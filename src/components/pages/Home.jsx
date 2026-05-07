import { useState, useEffect, useRef } from 'react'
import ScoreRing from '../ScoreRing'

const ACTION_DETAILS = {
  'Portfolio rebalancing — approve to execute': {
    action: 'Move ₹1.8L from HDFC Flexi Cap → ICICI Pru Short Duration',
    reason: 'Your equity allocation drifted to 78% (target: 70%). No LTCG triggered — this rebalance is tax-efficient.',
    impact: 'Reduces equity overexposure. Estimated risk reduction: ~8%.',
  },
  'Your credit card is costing you money': {
    action: 'Create a ₹2,000/month auto-payment toward Axis Card balance',
    reason: 'At 36% annual interest, every extra rupee paid now saves 3× over 12 months.',
    impact: 'Card cleared in ~8 months. Saves approximately ₹2,700 in interest.',
  },
  'No safety net yet': {
    action: 'Auto-save ₹500 every Friday to your savings account',
    reason: 'An emergency fund prevents borrowing at high interest when unexpected costs hit.',
    impact: '1 month of emergency expenses covered in ~24 weeks.',
  },
  'No term insurance — your family is exposed': {
    action: 'Get quotes from 3 term insurance providers for ₹1Cr cover',
    reason: 'Your household earns ₹1.8L/month with Aryan depending on both incomes.',
    impact: '₹1Cr cover for both of you from ~₹1,600/month combined.',
  },
  "Aryan's education fund — clock is ticking": {
    action: 'Set up ₹5,000/month SIP in a diversified equity fund',
    reason: '15 years of compounding — starting today vs next year makes a ₹4L difference.',
    impact: 'Projects to ₹32L by the time Aryan reaches college age.',
  },
  'SBI FD matures in 18 days': {
    action: 'Compare renewal rates at HDFC, ICICI and Axis before June 2',
    reason: 'Auto-renewal locks you into the current rate. HDFC is offering 7.25% vs 7.1%.',
    impact: '₹1,200 extra per year on the same ₹8L principal.',
  },
}

const GROWTH_HOW_IT_WORKS = {
  "Did you know? Credit cards aren't free money": "Credit cards charge interest on the unpaid balance at 3% per month (36% annually), calculated daily. The minimum payment barely covers the interest — paying even ₹2,000 extra per month reduces total interest paid by over 60%.",
  "The 50/30/20 rule — and where you stand": "The 50/30/20 rule divides your take-home into three buckets: 50% for needs (rent, EMIs, food), 30% for wants (dining, entertainment), and 20% for savings and investments. It's a starting framework — your optimal split depends on your goals.",
  "Tax-loss harvesting — ₹4,200 in tax savings available": "Tax-loss harvesting means selling investments at a loss to offset capital gains from other investments — reducing your tax bill. In India you can offset both short-term and long-term capital gains. The key is to act before the financial year ends (March 31).",
  "What is a Senior Citizens' Savings Scheme?": "SCSS is a government-guaranteed savings scheme for people 60+ offering 8.2% p.a. — significantly better than most FDs — with quarterly interest payouts. You can invest up to ₹30L. The 5-year tenure is extendable by 3 years.",
}

// ── Confetti ──────────────────────────────────────────────────────────────────
const CONFETTI_COLORS = ['#3A5AF9', '#0B8A68', '#C47A0C', '#8FA3FB', '#E3F5EF', '#FDF3E3', '#fff']
function Confetti() {
  const pieces = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 1.5}s`,
    size: `${6 + Math.random() * 8}px`,
    rotation: `${Math.random() * 360}deg`,
    duration: `${2 + Math.random() * 1.5}s`,
  }))
  return (
    <div className="confetti-wrap" aria-hidden>
      {pieces.map(p => (
        <div
          key={p.id}
          className="confetti-piece"
          style={{
            left: p.left,
            width: p.size, height: p.size,
            background: p.color,
            animationDelay: p.delay,
            animationDuration: p.duration,
            transform: `rotate(${p.rotation})`,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
          }}
        />
      ))}
    </div>
  )
}

// ── Action Modal ──────────────────────────────────────────────────────────────
function ActionModal({ card, initialTab = 'confirm', onClose, onConfirm, onSkip }) {
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
              <button className="btn btn-primary" style={{ flex: 2 }} onClick={() => { onConfirm('approved'); onClose() }}>Approve ✓</button>
              <button className="btn btn-ghost" onClick={() => setTab('modify')}>Modify</button>
            </div>
            <div className="am-btns" style={{ marginTop: '8px' }}>
              <button className="btn btn-ghost" style={{ flex: 1, fontSize: '11px' }} onClick={() => setTab('why')}>Why now?</button>
              <button className="btn btn-ghost" style={{ flex: 1, fontSize: '11px' }} onClick={() => { onSkip(); onClose() }}>Skip for now</button>
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
              <button className="btn btn-ghost" onClick={() => { onSkip(); onClose() }}>Skip</button>
            </div>
          </>
        )}

        {tab === 'modify' && (
          <>
            <div className="am-chip">Modify action</div>
            <div className="am-title">{card.title}</div>
            <div className="am-impact" style={{ marginBottom: '12px' }}>Adjust the amount before approving.</div>
            <div className="wi-row">
              <div className="wi-label">Amount</div>
              <span style={{ fontSize: '12px', color: 'var(--t3)' }}>₹</span>
              <input className="wi-input" type="number" placeholder="e.g. 1000" value={modAmt} onChange={e => setModAmt(e.target.value)} />
            </div>
            <div className="am-btns" style={{ marginTop: '16px' }}>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => { onConfirm('modified'); onClose() }}>Confirm modified ✓</button>
              <button className="btn btn-ghost" onClick={() => setTab('confirm')}>Back</button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function Home({ persona: p, onPageChange, onAsk, showToast }) {
  const [activeTab, setActiveTab] = useState('needed')
  const [rightTab, setRightTab] = useState('insights')
  const [actionModal, setActionModal] = useState(null)
  const [actedMap, setActedMap] = useState({})        // key: 'needed_0' | 'growth_0'
  const [expandedHow, setExpandedHow] = useState({})  // key: growth index
  const [showConfetti, setShowConfetti] = useState(false)
  const confettiTimer = useRef(null)

  const shortGreeting = p.greeting.replace(`, ${p.first}`, '').replace(` ${p.first}`, '')

  // Derived lists
  const visibleNeeded = p.needed.filter((_, i) => !actedMap[`needed_${i}`])
  const visibleGrowth = p.growth.filter((_, i) => !actedMap[`growth_${i}`])
  const actedTaken = Object.entries(actedMap).map(([key, { status, card }]) => {
    const tagMap = {
      approved: { text: 'Approved by you', bg: 'var(--ok-dim)', color: 'var(--ok)' },
      skipped: { text: 'Skipped by user', bg: 'var(--surface2)', color: 'var(--t3)' },
      modified: { text: 'Modified & approved', bg: 'var(--brand-dim)', color: 'var(--brand)' },
    }
    return { title: card.title, body: card.body, time: 'Just now', tag: tagMap[status] }
  })
  const allTaken = [...actedTaken, ...p.taken]
  const allDone = visibleNeeded.length === 0 && visibleGrowth.length === 0 && Object.keys(actedMap).length > 0

  // Trigger confetti once when all done
  useEffect(() => {
    if (allDone) {
      setShowConfetti(true)
      if (activeTab === 'needed') setActiveTab('taken')
      confettiTimer.current = setTimeout(() => setShowConfetti(false), 4000)
    }
    return () => clearTimeout(confettiTimer.current)
  }, [allDone])

  const act = (source, idx, status, card) => {
    setActedMap(m => ({ ...m, [`${source}_${idx}`]: { status, card } }))
  }

  const handleActionBtn = (btn, card, j, source, idx) => {
    if (btn === 'Approve ✓') { setActionModal({ card, tab: 'confirm', source, idx }); return }
    if (btn === 'Modify') { setActionModal({ card, tab: 'modify', source, idx }); return }
    if (btn === 'Why now?') { setActionModal({ card, tab: 'why', source, idx }); return }
    if (j === 0) { setActionModal({ card, tab: 'confirm', source, idx }); return }
    showToast(btn + ' — done')
  }

  const handleConfirm = (type) => {
    if (actionModal) {
      act(actionModal.source, actionModal.idx, type, actionModal.card)
      showToast(type === 'modified' ? '✓ Modified action queued' : '✓ Approved — check agent log')
    }
  }

  const handleSkip = () => {
    if (actionModal) {
      act(actionModal.source, actionModal.idx, 'skipped', actionModal.card)
      showToast('Skipped — you can revisit this anytime')
    }
  }

  return (
    <>
      {showConfetti && <Confetti />}

      {actionModal && (
        <ActionModal
          card={actionModal.card}
          initialTab={actionModal.tab}
          onClose={() => setActionModal(null)}
          onConfirm={handleConfirm}
          onSkip={handleSkip}
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
            <div className="hb-kpi-value">{p.score}<span style={{ fontSize: '12px', opacity: 0.7 }}>/100</span></div>
            <div className="hb-kpi-delta">{p.kpis[3]?.delta}</div>
          </div>
        </div>
      </div>

      <div className="home-grid">
        <div>
          <div className="card" style={{ marginBottom: '14px' }}>
            <div className="tab-bar">
              {[
                { id: 'needed', label: 'Action needed', count: visibleNeeded.length, countClass: 'warn' },
                { id: 'taken', label: 'Action taken', count: allTaken.length, countStyle: { background: 'var(--ok)' } },
                { id: 'growth', label: 'Growth', count: visibleGrowth.length },
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

            {/* ACTION NEEDED */}
            <div className={`tab-content ${activeTab === 'needed' ? 'active' : ''}`}>
              {visibleNeeded.length === 0 ? (
                <div className="empty-actions">
                  <div className="ea-icon">🎉</div>
                  <div className="ea-title">You're all caught up!</div>
                  <div className="ea-body">
                    Every action has been reviewed. You've done the hard work — your finances are moving in the right direction. Check back tomorrow for new insights.
                  </div>
                  <button className="btn btn-primary" style={{ marginTop: '14px', fontSize: '12px' }} onClick={() => setActiveTab('taken')}>
                    See what you've accomplished →
                  </button>
                </div>
              ) : (
                visibleNeeded.map((a, i) => (
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
                          onClick={() => handleActionBtn(btn, a, j, 'needed', i)}
                        >
                          {btn}
                        </button>
                      ))}
                      <button className="ac-btn ac-why ac-explain-right" onClick={() => onAsk(a.body)}>
                        Explain this
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* ACTION TAKEN */}
            <div className={`tab-content ${activeTab === 'taken' ? 'active' : ''}`}>
              {allTaken.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '32px 16px', color: 'var(--t3)', fontSize: '12px' }}>
                  Actions you approve or take will appear here.
                </div>
              ) : (
                allTaken.map((a, i) => (
                  <div key={i} className="agent-card taken">
                    <div className="ac-top">
                      <span className="chip chip-taken">Agent did this</span>
                      <div className="ac-title">{a.title}</div>
                    </div>
                    <div className="ac-body">{a.body}</div>
                    <div className="log-meta">
                      <span className="log-tag" style={{ background: a.tag.bg, color: a.tag.color }}>{a.tag.text}</span>
                      {a.time} ·{' '}
                      <span style={{ color: 'var(--brand)', cursor: 'pointer' }} onClick={() => showToast('Undo available within 24 hours')}>
                        Undo
                      </span>
                    </div>
                  </div>
                ))
              )}
              <button className="sec-link" style={{ marginTop: '8px', display: 'block' }} onClick={() => onPageChange('log')}>
                View full agent log →
              </button>
            </div>

            {/* GROWTH */}
            <div className={`tab-content ${activeTab === 'growth' ? 'active' : ''}`}>
              {visibleGrowth.length === 0 ? (
                <div className="empty-actions">
                  <div className="ea-icon">🌱</div>
                  <div className="ea-title">All growth opportunities actioned!</div>
                  <div className="ea-body">You've reviewed every opportunity. Your agent will surface new ones as your financial picture evolves.</div>
                </div>
              ) : (
                visibleGrowth.map((a, i) => (
                  <div key={i} className="agent-card growth">
                    <div className="ac-top">
                      <span className="chip chip-growth">Growth opportunity</span>
                      <div className="ac-title">{a.title}</div>
                    </div>
                    <div className="ac-body">{a.body}</div>
                    {expandedHow[i] && GROWTH_HOW_IT_WORKS[a.title] && (
                      <div style={{ background: 'var(--surface2)', borderRadius: '8px', padding: '10px 12px', margin: '0 0 10px', fontSize: '11px', color: 'var(--t2)', lineHeight: 1.6 }}>
                        <strong style={{ color: 'var(--t1)', display: 'block', marginBottom: '4px' }}>How it works</strong>
                        {GROWTH_HOW_IT_WORKS[a.title]}
                      </div>
                    )}
                    <div className="ac-actions">
                      <button className="ac-btn ac-approve" onClick={() => handleActionBtn('Approve ✓', a, 0, 'growth', i)}>
                        Approve ✓
                      </button>
                      {a.actions.map((btn, j) => (
                        <button key={j} className="ac-btn ac-dismiss" onClick={() => showToast(btn + ' — done')}>
                          {btn}
                        </button>
                      ))}
                      {GROWTH_HOW_IT_WORKS[a.title] && (
                        <button
                          className="ac-btn ac-why"
                          onClick={() => setExpandedHow(h => ({ ...h, [i]: !h[i] }))}
                        >
                          {expandedHow[i] ? 'Hide explanation' : 'How does this work?'}
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
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
                    <div key={i} className="dim-row dim-row-hover" title={`${d.label}: ${d.score}/100`}>
                      <div className="dim-label">{d.label}</div>
                      <div className="dim-track">
                        <div className="dim-fill" style={{ width: `${d.score}%`, background: d.color }} />
                      </div>
                      <div className="dim-val">{d.score}</div>
                    </div>
                  ))}
                </div>
              </div>
              {p.healthInsight && (
                <div style={{ background: 'var(--brand-dim)', border: '1px solid rgba(58,90,249,.12)', borderRadius: '10px', padding: '11px 13px', marginTop: '10px' }}>
                  <div style={{ fontSize: '10px', fontWeight: 600, color: 'var(--brand)', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: '4px' }}>
                    ✦ AI insight
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--t2)', lineHeight: 1.55 }}>{p.healthInsight}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
