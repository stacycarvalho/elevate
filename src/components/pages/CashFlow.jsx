import { useState } from 'react'
import { allTxns, subs } from '../../data/transactions'
import { fmt } from '../../utils'

const DATE_RANGES = [
  { id: '7d', label: 'Last 7 days' },
  { id: '30d', label: 'Last 30 days' },
  { id: '90d', label: 'Last 90 days' },
  { id: '6m', label: '6 months' },
  { id: '1y', label: '1 year' },
]

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
  const maxSpend = Math.max(...d.spendData)
  const barHeights = d.spendData.map(v => Math.round(v / maxSpend * 40))
  const incHeights = d.incomeData.map(v => Math.round(v / maxSpend * 40))

  return (
    <>
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

      <div className="cf-header-card" style={{ marginBottom: '14px' }}>
        <div className="kpi-grid cols3" style={{ marginBottom: '16px' }}>
          <div className="kpi">
            <div className="kpi-label">
              Money in <Tooltip tip="Total income received this period — salary, interest, dividends, or any other money that came in." />
            </div>
            <div className="kpi-value">₹{fmt(d.income)}</div>
            <span className="kpi-delta delta-up">↑ Salary credited</span>
          </div>
          <div className="kpi">
            <div className="kpi-label">
              Money out <Tooltip tip="Total money that left your accounts this period — bills, EMIs, shopping, food, everything." />
            </div>
            <div className="kpi-value">₹{fmt(d.spend)}</div>
            <span className="kpi-delta delta-neutral">This period</span>
          </div>
          <div className="kpi">
            <div className="kpi-label">
              What's left <Tooltip tip="Money in minus money out. This is what you have available to save or invest. Positive is good." />
            </div>
            <div className="kpi-value" style={{ color: 'var(--ok)' }}>₹{fmt(d.surplus)}</div>
            <span className="kpi-delta delta-up">↑ Available to save</span>
          </div>
        </div>

        <div style={{ fontSize: '11px', fontWeight: 500, color: 'var(--t3)', marginBottom: '6px', display: 'flex', justifyContent: 'space-between' }}>
          <span>6-month trend</span>
          <span style={{ display: 'flex', gap: '10px' }}>
            <span style={{ color: 'var(--brand)' }}>■ Spending</span>
            <span style={{ color: 'var(--ok)' }}>■ Income</span>
          </span>
        </div>
        <div className="mini-chart">
          {d.months.map((_, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', justifyContent: 'flex-end' }}>
              <div className="mini-bar" style={{ height: `${incHeights[i]}px`, background: 'rgba(11,138,104,.15)', width: '100%' }} />
              <div className="mini-bar" style={{ height: `${barHeights[i]}px`, background: 'var(--brand)', width: '100%' }} />
            </div>
          ))}
        </div>
        <div className="mini-labels">
          {d.months.map(m => <div key={m} className="mini-label">{m}</div>)}
        </div>
      </div>

      <div className="dash-grid">
        <div>
          <div className="card" style={{ marginBottom: '14px' }}>
            <div className="tab-bar">
              <button className={`tab ${activeTab === 'txns' ? 'active' : ''}`} onClick={() => setActiveTab('txns')}>Transactions</button>
              <button className={`tab ${activeTab === 'subs' ? 'active' : ''}`} onClick={() => setActiveTab('subs')}>Subscriptions</button>
            </div>

            <div className={`tab-content ${activeTab === 'txns' ? 'active' : ''}`}>
              <div style={{ background: 'var(--warn-dim)', borderRadius: '8px', padding: '10px 12px', marginBottom: '12px', fontSize: '12px', color: 'var(--warn)' }}>
                ⚠ Anomaly: Airtel charge is ₹200 higher than your usual amount this month.
              </div>
              {allTxns.map((t, i) => (
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
            </div>

            <div className={`tab-content ${activeTab === 'subs' ? 'active' : ''}`}>
              {subs.map((s, i) => (
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
                    <button className="ac-btn ac-approve btn-sm" onClick={() => showToast(`Kept ${s.name}`)}>Keep</button>
                    <button className="ac-btn ac-dismiss btn-sm" onClick={() => showToast('Cancellation started')}>Cancel</button>
                    <button className="ac-btn ac-dismiss btn-sm" onClick={() => showToast('Negotiation email drafted')}>Negotiate</button>
                  </div>
                </div>
              ))}
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
