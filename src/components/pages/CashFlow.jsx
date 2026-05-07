import { useState } from 'react'
import { allTxns, subs } from '../../data/transactions'

const DATE_RANGES = [
  { id: '7d', label: '7 days', mult: 0.23 },
  { id: '30d', label: '30 days', mult: 1 },
  { id: '90d', label: '3 months', mult: 3 },
  { id: '6m', label: '6 months', mult: 6 },
  { id: '1y', label: '1 year', mult: 12 },
]

const MONTHS_BY_RANGE = {
  '7d': ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
  '30d': ['W1', 'W2', 'W3', 'W4', 'W5', 'Now'],
  '90d': ['Feb', 'Mar', 'Apr', 'Now', '', ''],
  '6m': ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'],
  '1y': ['May', 'Jul', 'Sep', 'Nov', 'Jan', 'Apr'],
}

function fmt(n) {
  if (n >= 10000000) return (n / 10000000).toFixed(1) + 'Cr'
  if (n >= 100000) return (n / 100000).toFixed(1) + 'L'
  if (n >= 1000) return (n / 1000).toFixed(0) + 'K'
  return n.toLocaleString('en-IN')
}

function TrendLine({ spendData, incomeData, months }) {
  const all = [...spendData, ...incomeData]
  const min = Math.min(...all) * 0.9
  const max = Math.max(...all) * 1.05
  const W = 240, H = 52
  const x = (i) => (i / (spendData.length - 1)) * W
  const y = (v) => H - ((v - min) / (max - min)) * H

  const path = (data) => data.map((v, i) => `${i === 0 ? 'M' : 'L'} ${x(i)} ${y(v)}`).join(' ')
  const area = (data) => `${path(data)} L ${x(data.length - 1)} ${H} L 0 ${H} Z`

  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ width: '100%', height: '52px', display: 'block' }}>
      <defs>
        <linearGradient id="incGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(11,138,104,.25)" />
          <stop offset="100%" stopColor="rgba(11,138,104,.02)" />
        </linearGradient>
        <linearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(58,90,249,.2)" />
          <stop offset="100%" stopColor="rgba(58,90,249,.01)" />
        </linearGradient>
      </defs>
      <path d={area(incomeData)} fill="url(#incGrad)" />
      <path d={area(spendData)} fill="url(#spendGrad)" />
      <path d={path(incomeData)} fill="none" stroke="var(--ok)" strokeWidth="1.5" strokeLinejoin="round" />
      <path d={path(spendData)} fill="none" stroke="var(--brand)" strokeWidth="1.5" strokeLinejoin="round" />
      {spendData.map((v, i) => (
        <circle key={i} className="donut-seg" cx={x(i)} cy={y(v)} r="3" fill="var(--brand)" stroke="var(--surface)" strokeWidth="1.5">
          <title>Spend: ₹{fmt(v)}</title>
        </circle>
      ))}
      {incomeData.map((v, i) => (
        <circle key={`inc-${i}`} className="donut-seg" cx={x(i)} cy={y(v)} r="3" fill="var(--ok)" stroke="var(--surface)" strokeWidth="1.5">
          <title>Income: ₹{fmt(v)}</title>
        </circle>
      ))}
    </svg>
  )
}

function DonutChart({ investments }) {
  const S = 120, R = 44, stroke = 15
  const cx = S / 2, cy = S / 2
  const circ = 2 * Math.PI * R
  const total = investments.reduce((s, inv) => s + inv.value, 0)
  let accumulated = 0

  return (
    <div>
      <svg viewBox={`0 0 ${S} ${S}`} width={S} height={S} style={{ display: 'block', margin: '0 auto' }}>
        {investments.map((inv, i) => {
          const dashLen = (inv.pct / 100) * circ
          const seg = (
            <circle
              key={i}
              className="donut-seg"
              cx={cx} cy={cy} r={R}
              fill="none"
              stroke={inv.color}
              strokeWidth={stroke}
              strokeDasharray={`${dashLen} ${circ - dashLen}`}
              strokeDashoffset={-accumulated}
              transform={`rotate(-90 ${cx} ${cy})`}
            >
              <title>{inv.name} ({inv.pct}%) — ₹{fmt(inv.value)}</title>
            </circle>
          )
          accumulated += dashLen
          return seg
        })}
        <text x={cx} y={cy - 5} textAnchor="middle" fontSize="11" fontWeight="600" fill="var(--t1)" fontFamily="var(--mono)">
          ₹{fmt(total)}
        </text>
        <text x={cx} y={cy + 8} textAnchor="middle" fontSize="8" fill="var(--t3)" fontFamily="var(--sans)">
          PORTFOLIO
        </text>
      </svg>
      <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
        {investments.map((inv, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '11px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: inv.color, flexShrink: 0 }} />
            <span style={{ flex: 1, color: 'var(--t2)', fontSize: '10px' }}>{inv.name}</span>
            <span style={{ color: 'var(--t3)', fontSize: '10px' }}>{inv.type}</span>
            <span style={{ fontFamily: 'var(--mono)', fontWeight: 500, color: 'var(--t1)', fontSize: '10px' }}>{inv.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function NegotiateModal({ sub, onClose, showToast }) {
  const [sent, setSent] = useState(false)
  const emailDraft = `Subject: Loyalty discount request — ${sub.name} customer for ${sub.months} months

Hi ${sub.name} Support,

I've been a loyal customer for over ${sub.months} months and would like to discuss my current plan.

I've noticed that equivalent plans from competitors are available at a lower price point. As a long-standing customer, I'd like to request a loyalty discount or a plan adjustment that better reflects market rates.

I value the service and would prefer to stay — but I'd appreciate if you could help me find a more sustainable rate.

Looking forward to hearing from you.

Best regards`

  return (
    <div className="action-modal-overlay" onClick={onClose}>
      <div className="action-modal" style={{ maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
        <div className="am-handle" />
        {sent ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: '36px', marginBottom: '12px' }}>✉️</div>
            <div className="am-title">Email sent!</div>
            <div className="am-impact">Your negotiation email has been drafted and is ready to send. Check your email client.</div>
            <button className="btn btn-primary" style={{ width: '100%', marginTop: '16px' }} onClick={onClose}>Done</button>
          </div>
        ) : (
          <>
            <div className="am-chip am-chip-blue">Negotiation draft</div>
            <div className="am-title">Negotiate {sub.name}</div>
            <div className="am-impact" style={{ marginBottom: '12px' }}>
              Review the draft email below. The agent found that equivalent plans are available cheaper.
            </div>
            <div style={{ background: 'var(--surface2)', borderRadius: '10px', padding: '14px', fontSize: '11px', color: 'var(--t2)', lineHeight: 1.7, fontFamily: 'var(--mono)', whiteSpace: 'pre-wrap', marginBottom: '14px' }}>
              {emailDraft}
            </div>
            <div className="am-btns">
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => { setSent(true); showToast('Email sent to ' + sub.name) }}>
                Send email ✓
              </button>
              <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function Tooltip({ tip }) {
  return (
    <div className="tip-wrap">
      <span className="tip-icon">?</span>
      <div className="tip-box">{tip}</div>
    </div>
  )
}

export default function CashFlow({ persona: p, showToast }) {
  const [dateRange, setDateRange] = useState('30d')
  const [activeTab, setActiveTab] = useState('txns')
  const [activeCat, setActiveCat] = useState('All')
  const [subTab, setSubTab] = useState('needed')
  const [subStatus, setSubStatus] = useState({})
  const [negotiating, setNegotiating] = useState(null)

  if (!p.hasCf) {
    return (
      <div className="empty">
        <div className="empty-icon">📊</div>
        <div className="empty-title">Connect to see your spending</div>
        <div className="empty-body">
          Once connected, I'll automatically categorise every transaction and show you where your money is actually going.
        </div>
        <div className="connect-opts">
          <div className="connect-opt" onClick={() => showToast('Opening Account Aggregator flow…')}>
            <div className="co-ico">🏦</div>
            <div>
              <div className="co-label">Connect bank</div>
              <div className="co-sub">RBI AA framework — read only, no passwords stored</div>
            </div>
          </div>
          <div className="connect-opt" onClick={() => showToast('Opening Gmail permissions…')}>
            <div className="co-ico">✉️</div>
            <div>
              <div className="co-label">Parse Gmail statements</div>
              <div className="co-sub">Bank emails + subscription confirmations</div>
            </div>
          </div>
          <div className="connect-opt" onClick={() => showToast('Manual entry available')}>
            <div className="co-ico">✏️</div>
            <div>
              <div className="co-label">Enter manually</div>
              <div className="co-sub">No account connection needed</div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const d = p.cfData
  const range = DATE_RANGES.find(r => r.id === dateRange)
  const mult = range.mult
  const scaledIncome = Math.round(d.income * mult)
  const scaledSpend = Math.round(d.spend * mult)
  const scaledSurplus = scaledIncome - scaledSpend

  const chartMonths = MONTHS_BY_RANGE[dateRange]
  const scaledSpendData = d.spendData.map(v => Math.round(v * mult / 6))
  const scaledIncomeData = d.incomeData.map(v => Math.round(v * mult / 6))

  const categories = ['All', ...Array.from(new Set(allTxns.map(t => t.cat)))]
  const filteredTxns = activeCat === 'All' ? allTxns : allTxns.filter(t => t.cat === activeCat)

  const handleSubAction = (i, action) => {
    if (action === 'keep') {
      setSubStatus(s => ({ ...s, [i]: 'kept' }))
      showToast(`Keeping ${subs[i].name}`)
    } else if (action === 'cancel') {
      setSubStatus(s => ({ ...s, [i]: 'cancelling' }))
      showToast('Cancellation initiated')
    } else if (action === 'negotiate') {
      setNegotiating(subs[i])
    }
  }

  // Subs that haven't been acted on yet (have a prompt)
  const actionNeededSubs = subs.filter((s, i) => subStatus[i] !== 'kept' && subStatus[i] !== 'cancelling' && s.prompt)
  const allSubsView = subs

  const hasInvestments = p.investments && p.investments.length > 0

  return (
    <>
      {negotiating && (
        <NegotiateModal sub={negotiating} onClose={() => setNegotiating(null)} showToast={showToast} />
      )}

      <div className="date-filter">
        {DATE_RANGES.map(r => (
          <button
            key={r.id}
            className={`df-btn ${dateRange === r.id ? 'active' : ''}`}
            onClick={() => setDateRange(r.id)}
          >
            {r.label}
          </button>
        ))}
      </div>

      {/* KPI + trend — with optional donut chart for Priya/Mehul */}
      <div className={hasInvestments ? 'cf-top-grid' : ''}>
        <div className="cf-header-card" style={{ marginBottom: hasInvestments ? 0 : '14px' }}>
          <div className="kpi-grid cols3" style={{ marginBottom: '16px' }}>
            <div className="kpi">
              <div className="kpi-label">Money in <Tooltip tip="Total income received this period." /></div>
              <div className="kpi-value">₹{fmt(scaledIncome)}</div>
              <span className="kpi-delta delta-up">↑ Salary credited</span>
            </div>
            <div className="kpi">
              <div className="kpi-label">Money out <Tooltip tip="Total money that left your accounts." /></div>
              <div className="kpi-value">₹{fmt(scaledSpend)}</div>
              <span className="kpi-delta delta-neutral">{range.label}</span>
            </div>
            <div className="kpi">
              <div className="kpi-label">What's left <Tooltip tip="Income minus spending." /></div>
              <div className="kpi-value" style={{ color: 'var(--ok)' }}>₹{fmt(scaledSurplus)}</div>
              <span className="kpi-delta delta-up">↑ Available to save</span>
            </div>
          </div>

          <div style={{ fontSize: '11px', fontWeight: 500, color: 'var(--t3)', marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
            <span>Trend — {range.label}</span>
            <span style={{ display: 'flex', gap: '10px' }}>
              <span style={{ color: 'var(--brand)' }}>— Spending</span>
              <span style={{ color: 'var(--ok)' }}>— Income</span>
            </span>
          </div>
          <TrendLine spendData={scaledSpendData} incomeData={scaledIncomeData} months={chartMonths} />
          <div className="mini-labels" style={{ marginTop: '4px' }}>
            {chartMonths.map((m, i) => <div key={i} className="mini-label">{m}</div>)}
          </div>
        </div>

        {hasInvestments && (
          <div className="card card-sm" style={{ marginBottom: '14px' }}>
            <div className="sec-hdr" style={{ marginBottom: '12px' }}>
              <div className="sec-title">Investment allocation</div>
            </div>
            <DonutChart investments={p.investments} />
          </div>
        )}
      </div>

      {!hasInvestments && <div style={{ marginBottom: '14px' }} />}

      <div className="dash-grid">
        <div>
          <div className="card" style={{ marginBottom: '14px' }}>
            <div className="tab-bar">
              <button className={`tab ${activeTab === 'txns' ? 'active' : ''}`} onClick={() => setActiveTab('txns')}>Transactions</button>
              <button className={`tab ${activeTab === 'subs' ? 'active' : ''}`} onClick={() => setActiveTab('subs')}>Subscriptions</button>
            </div>

            {/* TRANSACTIONS */}
            <div className={`tab-content ${activeTab === 'txns' ? 'active' : ''}`}>
              {/* Anomaly + mobile dropdown on same row */}
              <div className="cf-anomaly-row">
                <div className="cf-anomaly-msg">⚠ Anomaly: Airtel charge is ₹200 higher than usual this month.</div>
                <select
                  className="cat-filter-mobile"
                  value={activeCat}
                  onChange={e => setActiveCat(e.target.value)}
                >
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              {/* Desktop chips */}
              <div className="cat-filter-desktop">
                {categories.map(cat => (
                  <button
                    key={cat}
                    className={`df-btn ${activeCat === cat ? 'active' : ''}`}
                    style={{ fontSize: '10px', padding: '3px 9px' }}
                    onClick={() => setActiveCat(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              {filteredTxns.map((t, i) => (
                <div key={i} className="txn">
                  <div className="txn-ico" style={{ background: t.bg }}>{t.ico}</div>
                  <div>
                    <div className="txn-merchant">{t.merchant}</div>
                    <div className="txn-cat">{t.cat} · {t.date}</div>
                  </div>
                  <div className={`txn-amt txn-${t.type}`}>
                    {t.type === 'credit' ? '+' : ''}₹{Math.abs(t.amt).toLocaleString('en-IN')}
                  </div>
                </div>
              ))}
              {filteredTxns.length === 0 && (
                <div style={{ textAlign: 'center', padding: '24px', color: 'var(--t3)', fontSize: '12px' }}>
                  No transactions in {activeCat}
                </div>
              )}
            </div>

            {/* SUBSCRIPTIONS */}
            <div className={`tab-content ${activeTab === 'subs' ? 'active' : ''}`}>
              <div className="sub-tab-bar">
                <button
                  className={`sub-tab ${subTab === 'needed' ? 'active' : ''}`}
                  onClick={() => setSubTab('needed')}
                >
                  Action needed
                  {actionNeededSubs.length > 0 && (
                    <span className="tab-count warn" style={{ marginLeft: '4px' }}>{actionNeededSubs.length}</span>
                  )}
                </button>
                <button
                  className={`sub-tab ${subTab === 'all' ? 'active' : ''}`}
                  onClick={() => setSubTab('all')}
                >
                  All subscriptions
                </button>
              </div>

              {subTab === 'needed' && (
                <>
                  {actionNeededSubs.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '24px', color: 'var(--t3)', fontSize: '12px' }}>
                      ✓ All subscriptions reviewed. Nice work.
                    </div>
                  ) : (
                    actionNeededSubs.map(s => {
                      const i = subs.indexOf(s)
                      return (
                        <div key={i} style={{ border: '1px solid var(--border)', borderRadius: '10px', padding: '14px', marginBottom: '8px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                            <div style={{ fontSize: '13px', fontWeight: 500 }}>{s.name}</div>
                            <div style={{ fontSize: '12px', fontWeight: 500, fontFamily: 'var(--mono)' }}>{s.amt}</div>
                          </div>
                          <div style={{ fontSize: '11px', color: 'var(--t3)', marginBottom: '8px' }}>{s.plan}</div>
                          <div style={{ fontSize: '12px', color: 'var(--t2)', background: 'var(--surface2)', padding: '8px 10px', borderRadius: '7px', marginBottom: '10px' }}>
                            💡 {s.prompt}
                          </div>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button className="ac-btn ac-approve btn-sm" onClick={() => handleSubAction(i, 'keep')}>Keep</button>
                            <button className="ac-btn ac-dismiss btn-sm" onClick={() => handleSubAction(i, 'cancel')}>Cancel</button>
                            <button className="ac-btn ac-dismiss btn-sm" onClick={() => handleSubAction(i, 'negotiate')}>Negotiate</button>
                          </div>
                        </div>
                      )
                    })
                  )}
                </>
              )}

              {subTab === 'all' && (
                <>
                  {allSubsView.map((s, i) => {
                    const status = subStatus[i]
                    return (
                      <div key={i} style={{ border: '1px solid var(--border)', borderRadius: '10px', padding: '14px', marginBottom: '8px', opacity: status === 'cancelling' ? 0.5 : 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                          <div>
                            <div style={{ fontSize: '13px', fontWeight: 500 }}>{s.name}</div>
                            <div style={{ fontSize: '11px', color: 'var(--t3)', marginTop: '2px' }}>{s.plan}</div>
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                            <div style={{ fontSize: '12px', fontWeight: 500, fontFamily: 'var(--mono)' }}>{s.amt}</div>
                            {status === 'kept' && <span style={{ fontSize: '10px', color: 'var(--ok)', fontWeight: 600 }}>✓ Keeping</span>}
                            {status === 'cancelling' && <span style={{ fontSize: '10px', padding: '1px 7px', borderRadius: '8px', background: 'var(--danger-dim)', color: 'var(--danger)', fontWeight: 600 }}>Cancelling</span>}
                          </div>
                        </div>
                        {!status && (
                          <div style={{ display: 'flex', gap: '6px', marginTop: '8px' }}>
                            <button className="ac-btn ac-approve btn-sm" onClick={() => handleSubAction(i, 'keep')}>Keep</button>
                            <button className="ac-btn ac-dismiss btn-sm" onClick={() => handleSubAction(i, 'cancel')}>Cancel</button>
                            <button className="ac-btn ac-dismiss btn-sm" onClick={() => handleSubAction(i, 'negotiate')}>Negotiate</button>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </>
              )}
            </div>
          </div>
        </div>

        <div>
          <div className="card">
            <div className="sec-hdr">
              <div className="sec-title">Where your money went</div>
            </div>
            <div style={{ background: 'var(--brand-dim)', borderRadius: '8px', padding: '10px 12px', marginBottom: '14px', fontSize: '12px', color: 'var(--t2)' }}>
              <strong style={{ color: 'var(--brand)', display: 'block', marginBottom: '3px' }}>💡 Agent insight</strong>
              {p.cfData.catInsight}
            </div>
            {p.spending.map((s, i) => (
              <div key={i} className="spend-row">
                <div className="spend-ico" style={{ background: s.bg }}>{s.ico}</div>
                <div className="spend-name">{s.cat}</div>
                <div className="spend-track">
                  <div className="spend-fill" style={{ width: `${s.pct}%`, background: s.color }} />
                </div>
                <div className="spend-amt">₹{s.amount.toLocaleString('en-IN')}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
