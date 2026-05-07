import { useState, useRef, useEffect } from 'react'
import { fmt } from '../../utils'
import { goalFlow } from '../../data/transactions'

const FD_DATA = [
  { bank: 'SBI', amt: '₹8,00,000', rate: '7.1%', date: 'Jun 2, 2025', days: 18, urgent: true },
  { bank: 'HDFC', amt: '₹12,00,000', rate: '7.0%', date: 'Sep 15, 2025', days: 121, urgent: false },
  { bank: 'Axis', amt: '₹8,40,000', rate: '6.9%', date: 'Jan 3, 2026', days: 231, urgent: false },
]

// Plan summary insight per persona type
const PLAN_SUMMARY = {
  corpus: {
    big: '23', bigLabel: 'years of savings remaining',
    status: '✓ You\'re in good shape',
    body: "Accounting for 6% annual inflation, your runway is 19 years. Your pension income means you're not drawing down — you're still adding to your corpus each month.",
  },
  'goals+nw': {
    big: '16%', bigLabel: 'savings rate',
    status: '✓ Building momentum',
    body: "Your household net worth grew ₹1.2L this month. With ₹18,400 surplus every month and your EMI under 23% of income, you're building genuine wealth consistently.",
  },
  full: {
    big: '31%', bigLabel: 'to FIRE target',
    status: '✓ Ahead of pace',
    body: "At your current 34% savings rate, you'll hit your ₹4Cr FIRE target at 54 — 3 years ahead of a standard schedule. Increasing SIP by ₹10,000/month moves FIRE date to 51.",
  },
}

const WI_DEFAULTS = { raise: 20, leave: 6, sip: 10000 }

function Tooltip({ tip }) {
  return (
    <div className="tip-wrap" style={{ display: 'inline-flex', marginLeft: '4px' }}>
      <span className="tip-icon">?</span>
      <div className="tip-box">{tip}</div>
    </div>
  )
}

function PlanSummaryCard({ hasPlan }) {
  const s = PLAN_SUMMARY[hasPlan]
  if (!s) return null
  return (
    <div className="card" style={{ marginBottom: '14px' }}>
      <div style={{ fontSize: '10px', color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '.6px', marginBottom: '4px' }}>
        At your current spending
      </div>
      <div style={{ fontFamily: 'var(--mono)', fontSize: '42px', fontWeight: 500, color: 'var(--ok)', letterSpacing: '-2px', lineHeight: 1, marginBottom: '2px' }}>
        {s.big}
      </div>
      <div style={{ fontSize: '13px', color: 'var(--t2)', marginBottom: '12px' }}>{s.bigLabel}</div>
      <div style={{ background: 'var(--ok-dim)', borderRadius: '8px', padding: '12px', marginBottom: '0' }}>
        <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--ok)', marginBottom: '3px' }}>{s.status}</div>
        <div style={{ fontSize: '12px', color: 'var(--t2)', lineHeight: 1.6 }}>{s.body}</div>
      </div>
    </div>
  )
}

function WhatIf({ persona: p, showToast }) {
  const [scenario, setScenario] = useState('raise')
  const [wiVal, setWiVal] = useState(20)
  const [actionDone, setActionDone] = useState(false)

  const changeScenario = (s) => { setScenario(s); setWiVal(WI_DEFAULTS[s]); setActionDone(false) }

  const income = p.cfData?.income || 0
  const raise = Number(wiVal) || 20
  const months = Number(wiVal) || 6
  const extra = Number(wiVal) || 10000

  return (
    <div className="card">
      <div className="sec-hdr">
        <div className="sec-title">What if?</div>
        <div style={{ fontSize: '11px', color: 'var(--t3)' }}>Model scenarios</div>
      </div>
      <div className="tab-bar">
        {[['raise', 'Raise'], ['leave', 'Career break'], ['sip', 'Invest more']].map(([id, label]) => (
          <button key={id} className={`tab ${scenario === id ? 'active' : ''}`} onClick={() => changeScenario(id)}>
            {label}
          </button>
        ))}
      </div>

      {scenario === 'raise' && (
        <>
          <div className="wi-row">
            <div className="wi-label">Raise percentage</div>
            <input className="wi-input" type="number" value={wiVal} min="1" max="100" onChange={e => setWiVal(e.target.value)} />
            <span style={{ fontSize: '12px', color: 'var(--t3)' }}>%</span>
          </div>
          <div className="wi-result-card">
            <div className="wi-result-title">If you got a {raise}% raise</div>
            <div className="wi-result-row"><span>New monthly income</span><span className="wi-current">₹{fmt(income)}</span><span className="wi-new">₹{fmt(Math.round(income * (1 + raise / 100)))}</span></div>
            <div className="wi-result-row"><span>Extra to save/invest</span><span className="wi-current">—</span><span className="wi-new">₹{fmt(Math.round(income * raise / 100))}/mo</span></div>
            <div className="wi-result-row"><span>New savings rate</span><span className="wi-current">{p.kpis[2]?.value || '—'}</span><span className="wi-new">{Math.min(Math.round((income * (1 + raise / 100) * 0.34) / (income * (1 + raise / 100)) * 100), 80)}%</span></div>
            <div className="wi-result-row"><span>Impact on goals</span><span className="wi-current">Current pace</span><span className="wi-new">~{Math.round(raise * 0.4)} months faster</span></div>
          </div>
        </>
      )}

      {scenario === 'leave' && (
        <>
          <div className="wi-row">
            <div className="wi-label">Duration of break</div>
            <input className="wi-input" type="number" value={wiVal} min="1" max="24" onChange={e => setWiVal(e.target.value)} />
            <span style={{ fontSize: '12px', color: 'var(--t3)' }}>months</span>
          </div>
          <div className="wi-result-card">
            <div className="wi-result-title">If you took {months} months off</div>
            <div className="wi-result-row"><span>Income gap</span><span className="wi-current">—</span><span className="wi-new">₹{fmt(income * months)} total</span></div>
            <div className="wi-result-row"><span>Savings impact</span><span className="wi-current">Compounding active</span><span className="wi-new">₹{fmt(Math.round(income * 0.34 * months))} foregone</span></div>
            <div className="wi-result-row"><span>Emergency fund covers</span><span className="wi-current">—</span><span className="wi-new">{months <= 6 ? '✓ Covered' : '⚠ Review needed'}</span></div>
            <div className="wi-result-row"><span>Recovery time after</span><span className="wi-current">—</span><span className="wi-new">~{Math.ceil(months * 0.8)} months</span></div>
          </div>
        </>
      )}

      {scenario === 'sip' && (
        <>
          <div className="wi-row">
            <div className="wi-label">Extra invested/month</div>
            <span style={{ fontSize: '12px', color: 'var(--t3)' }}>₹</span>
            <input className="wi-input" type="number" value={wiVal} min="500" step="500" onChange={e => setWiVal(e.target.value)} />
          </div>
          <div className="wi-result-card">
            <div className="wi-result-title">If you invested ₹{fmt(extra)} more/month</div>
            <div className="wi-result-row"><span>Extra per year</span><span className="wi-current">—</span><span className="wi-new">₹{fmt(extra * 12)}</span></div>
            <div className="wi-result-row"><span>Corpus in 10 years</span><span className="wi-current">—</span><span className="wi-new">+₹{fmt(Math.round(extra * 12 * ((Math.pow(1.12, 10) - 1) / 0.12)))}</span></div>
            <div className="wi-result-row"><span>Corpus in 20 years</span><span className="wi-current">—</span><span className="wi-new">+₹{fmt(Math.round(extra * 12 * ((Math.pow(1.12, 20) - 1) / 0.12)))}</span></div>
            <div className="wi-result-row"><span>FIRE date impact</span><span className="wi-current">Age 54</span><span className="wi-new">Age {Math.max(46, 54 - Math.floor(extra / 5000))}</span></div>
          </div>
          {!actionDone ? (
            <button className="btn btn-primary" style={{ width: '100%', marginTop: '12px', fontSize: '12px' }} onClick={() => { setActionDone(true); showToast('Investment plan created — check agent log') }}>
              Take action — start investing ₹{fmt(extra)}/month →
            </button>
          ) : (
            <div style={{ background: 'var(--ok-dim)', borderRadius: '8px', padding: '10px 12px', marginTop: '12px', fontSize: '12px', color: 'var(--ok)', fontWeight: 500 }}>
              ✓ Investment plan created. Setting up SIP in agent log.
            </div>
          )}
        </>
      )}
    </div>
  )
}

function EditGoalModal({ goal, onClose, onSave }) {
  const [name, setName] = useState(goal.name)
  const [target, setTarget] = useState(goal.target)
  const [monthly, setMonthly] = useState(goal.monthly)
  const aiSuggested = Math.round(goal.monthly * 1.25)

  return (
    <div className="action-modal-overlay" onClick={onClose}>
      <div className="action-modal" onClick={e => e.stopPropagation()}>
        <div className="am-handle" />
        <div className="am-chip">Edit goal</div>
        <div className="am-title" style={{ marginBottom: '16px' }}>Update your goal</div>
        <div style={{ marginBottom: '12px' }}>
          <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--t3)', marginBottom: '5px' }}>Goal name</div>
          <input style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border)', borderRadius: '8px', fontFamily: 'var(--sans)', fontSize: '13px', color: 'var(--t1)', background: 'var(--surface2)', outline: 'none' }} value={name} onChange={e => setName(e.target.value)} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--t3)', marginBottom: '5px' }}>Target (₹)</div>
            <input className="wi-input" type="number" style={{ width: '100%', maxWidth: 'unset' }} value={target} onChange={e => setTarget(Number(e.target.value))} />
          </div>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--t3)', marginBottom: '5px' }}>Monthly (₹)</div>
            <input className="wi-input" type="number" style={{ width: '100%', maxWidth: 'unset' }} value={monthly} onChange={e => setMonthly(Number(e.target.value))} />
          </div>
        </div>
        <div style={{ background: 'var(--brand-dim)', borderRadius: '8px', padding: '10px 12px', marginBottom: '14px', cursor: 'pointer' }} onClick={() => setMonthly(aiSuggested)}>
          <div style={{ fontSize: '10px', fontWeight: 600, color: 'var(--brand)', marginBottom: '2px' }}>✦ AI suggestion</div>
          <div style={{ fontSize: '12px', color: 'var(--t2)' }}>Increase to ₹{aiSuggested.toLocaleString('en-IN')}/month — reach your goal ~{Math.round((goal.target - goal.current) / goal.monthly - (goal.target - goal.current) / aiSuggested)} months earlier.</div>
          <div style={{ fontSize: '11px', color: 'var(--brand)', marginTop: '4px', fontWeight: 500 }}>Tap to apply →</div>
        </div>
        <div className="am-btns">
          <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => { onSave({ name, target, monthly }); onClose() }}>Save changes ✓</button>
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  )
}

function NewGoalModal({ onClose, onCreated }) {
  const [messages, setMessages] = useState([{ role: 'ai', text: goalFlow[0] }])
  const [input, setInput] = useState('')
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState([])
  const msgsRef = useRef(null)

  useEffect(() => {
    if (msgsRef.current) msgsRef.current.scrollTop = 9999
  }, [messages])

  const send = () => {
    if (!input.trim()) return
    const userInput = input.trim()
    setInput('')
    const newAnswers = [...answers, userInput]
    setAnswers(newAnswers)
    setMessages(m => [...m, { role: 'user', text: userInput }])
    const nextStep = step + 1
    setStep(nextStep)
    setTimeout(() => {
      if (nextStep < goalFlow.length) {
        setMessages(m => [...m, { role: 'ai', text: goalFlow[nextStep] }])
      } else {
        const name = newAnswers[0] || 'New goal'
        const target = parseInt(newAnswers[1]?.replace(/[^\d]/g, '')) || 100000
        const monthly = parseInt(newAnswers[2]?.replace(/[^\d]/g, '')) || 5000
        const palette = ['#3A5AF9', '#0B8A68', '#C47A0C', '#C42B2B', '#8FA3FB']
        const color = palette[Math.floor(Math.random() * palette.length)]
        const mos = Math.ceil(target / monthly)
        setMessages(m => [...m, { role: 'ai', text: `Goal created and auto-save rule set up. 🎉 I'll track "${name}" alongside your other goals.` }])
        setTimeout(() => {
          onCreated({ name, target, current: 0, monthly, color, insight: `Starting fresh! At ₹${monthly.toLocaleString('en-IN')}/month you'll reach this goal in ~${mos} months.` })
          onClose()
        }, 1400)
      }
    }, 600)
  }

  const handleKey = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }

  return (
    <div className="action-modal-overlay" onClick={onClose}>
      <div className="action-modal" onClick={e => e.stopPropagation()}>
        <div className="am-handle" />
        <div className="am-chip am-chip-blue">New goal</div>
        <div className="am-title" style={{ marginBottom: '14px' }}>Let's set up a goal ✦</div>
        <div className="conv-msgs" ref={msgsRef} style={{ maxHeight: '200px' }}>
          {messages.map((msg, i) => (
            <div key={i} className={`conv-msg ${msg.role === 'ai' ? 'msg-ai' : 'msg-user'}`}>{msg.text}</div>
          ))}
        </div>
        <div className="conv-wrap">
          <textarea className="conv-input" placeholder="Type your answer…" rows={1} value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKey} autoFocus />
          <button className="conv-send" onClick={send}>↑</button>
        </div>
        <button className="btn btn-ghost" style={{ width: '100%', marginTop: '8px', fontSize: '11px' }} onClick={onClose}>Cancel</button>
      </div>
    </div>
  )
}

// ── Goals tab content ──────────────────────────────────────────────────────────
function GoalsTabContent({ allGoals, pGoalsLength, setEditGoal, setNewGoalOpen }) {
  return (
    <>
      <div className="sec-hdr" style={{ marginBottom: '12px' }}>
        <div style={{ fontSize: '11px', color: 'var(--t3)' }}>{allGoals.length} goal{allGoals.length !== 1 ? 's' : ''} tracked</div>
        <button className="sec-link" onClick={() => setNewGoalOpen(true)}>+ New goal</button>
      </div>
      {allGoals.map((goal, i) => {
        const pct = Math.min(100, Math.round(goal.current / goal.target * 100))
        const mos = Math.ceil((goal.target - goal.current) / goal.monthly)
        const isNew = i >= pGoalsLength
        return (
          <div key={i} className="goal-card" style={isNew ? { border: '1px solid rgba(58,90,249,.3)', background: 'var(--brand-dim)' } : {}}>
            <div className="goal-top">
              <div>
                <div className="goal-name">{goal.name}</div>
                <div className="goal-auto">Auto-saving ₹{goal.monthly.toLocaleString('en-IN')}/month</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ fontSize: '13px', fontWeight: 600, fontFamily: 'var(--mono)', color: 'var(--brand)' }}>{pct}%</div>
                {!isNew ? (
                  <button className="sec-link" style={{ fontSize: '11px', border: '1px solid var(--border)', borderRadius: '6px', padding: '3px 8px', color: 'var(--t2)' }} onClick={() => setEditGoal(i)}>Edit</button>
                ) : (
                  <span style={{ fontSize: '10px', fontWeight: 600, color: 'var(--brand)', padding: '2px 7px', borderRadius: '8px', background: 'rgba(58,90,249,.12)' }}>New</span>
                )}
              </div>
            </div>
            <div className="goal-track">
              <div className="goal-bar" style={{ width: `${pct}%`, background: goal.color }} />
            </div>
            <div className="goal-stats">
              <span>Saved: <strong>₹{fmt(goal.current)}</strong></span>
              <span>Target: <strong>₹{fmt(goal.target)}</strong></span>
              <span>Done in: <strong>~{mos} mo</strong></span>
            </div>
            <div className="goal-insight">💡 {goal.insight}</div>
          </div>
        )
      })}
    </>
  )
}

// ── Portfolio tab content ──────────────────────────────────────────────────────
function PortfolioTabContent({ p, invActedMap, setInvActedMap, showToast }) {
  if (!p.investments || p.investments.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '28px 16px', color: 'var(--t3)', fontSize: '12px', lineHeight: 1.6 }}>
        <div style={{ fontSize: '28px', marginBottom: '8px' }}>📂</div>
        No investments tracked yet. Link your Zerodha, Groww, or Coin account to see your portfolio here.
      </div>
    )
  }
  const total = p.investments.reduce((s, inv) => s + inv.value, 0)
  return (
    <>
      {p.investments.map((inv, i) => (
        <div key={i} className="inv-row">
          <div className="inv-dot" style={{ background: inv.color }} />
          <div className="inv-name">{inv.name}</div>
          <span className="inv-type">{inv.type}</span>
          <span className="inv-pct">{inv.pct}%</span>
          <span className="inv-amt">₹{fmt(inv.value)}</span>
        </div>
      ))}
      {/* Allocation bar */}
      <div style={{ display: 'flex', height: '6px', borderRadius: '3px', overflow: 'hidden', margin: '14px 0 12px' }}>
        {p.investments.map((inv, i) => (
          <div key={i} className="donut-seg" style={{ width: `${inv.pct}%`, background: inv.color }}>
            <title>{inv.name}: {inv.pct}%</title>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--t3)', marginBottom: '12px' }}>
        <span>Total portfolio</span>
        <span style={{ fontFamily: 'var(--mono)', fontWeight: 600, color: 'var(--t1)' }}>₹{fmt(total)}</span>
      </div>
      {p.investmentInsight && (
        <div style={{ background: 'var(--brand-dim)', border: '1px solid rgba(58,90,249,.12)', borderRadius: '9px', padding: '10px 12px', marginBottom: '12px' }}>
          <div style={{ fontSize: '10px', fontWeight: 600, color: 'var(--brand)', marginBottom: '3px' }}>✦ AI insight</div>
          <div style={{ fontSize: '12px', color: 'var(--t2)', lineHeight: 1.55 }}>{p.investmentInsight}</div>
        </div>
      )}
      {p.investmentActions && p.investmentActions.map((action, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 12px', border: '1px solid var(--border)', borderRadius: '9px', marginBottom: '6px' }}>
          <span style={{ fontSize: '12px', color: 'var(--t2)', flex: 1 }}>{action.label}</span>
          {invActedMap[i] ? (
            <span style={{ fontSize: '11px', color: 'var(--ok)', fontWeight: 600 }}>✓ Done</span>
          ) : (
            <button className="ac-btn ac-approve" style={{ padding: '4px 10px', fontSize: '10px' }} onClick={() => { setInvActedMap(m => ({ ...m, [i]: true })); showToast(`${action.btn} — queued in agent log`) }}>
              {action.btn}
            </button>
          )}
        </div>
      ))}
    </>
  )
}

// ── FD Maturity tab content ────────────────────────────────────────────────────
function FDTabContent({ hasPlan, showToast }) {
  const showFDs = hasPlan === 'corpus' || hasPlan === 'full'
  if (!showFDs) {
    return (
      <div style={{ textAlign: 'center', padding: '28px 16px', color: 'var(--t3)', fontSize: '12px', lineHeight: 1.6 }}>
        <div style={{ fontSize: '28px', marginBottom: '8px' }}>🏦</div>
        No fixed deposits tracked. Link your bank or add FDs manually to track maturity dates and compare rates.
      </div>
    )
  }
  return (
    <>
      <div style={{ background: 'var(--warn-dim)', borderRadius: '8px', padding: '9px 12px', marginBottom: '12px', fontSize: '12px', color: 'var(--warn)' }}>
        ⚡ SBI FD matures in <strong>18 days</strong> — compare rates before auto-renewing.
      </div>
      {FD_DATA.map((fd, i) => (
        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: fd.urgent ? 'var(--warn)' : 'var(--ok)', flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: '12px', fontWeight: 500 }}>{fd.bank} FD · {fd.rate}</div>
              <div style={{ fontSize: '10px', color: 'var(--t3)', marginTop: '1px' }}>{fd.date} · {fd.days} days away</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ fontSize: '12px', fontWeight: 500, fontFamily: 'var(--mono)' }}>{fd.amt}</div>
            {fd.urgent && (
              <button className="ac-btn ac-approve" style={{ padding: '3px 9px', fontSize: '10px' }} onClick={() => showToast('Comparing FD rates…')}>
                Compare
              </button>
            )}
          </div>
        </div>
      ))}
    </>
  )
}

// ── Tabbed card (Goals | Portfolio | FD Maturity) ─────────────────────────────
function PlanTabsCard({ p, allGoals, pGoalsLength, setEditGoal, setNewGoalOpen, invActedMap, setInvActedMap, showToast }) {
  const [tab, setTab] = useState('goals')
  return (
    <div className="card" style={{ marginBottom: '14px' }}>
      <div className="tab-bar">
        <button className={`tab ${tab === 'goals' ? 'active' : ''}`} onClick={() => setTab('goals')}>
          Goals
          <span className="tab-count" style={{ background: 'var(--ok)' }}>{allGoals.length}</span>
        </button>
        <button className={`tab ${tab === 'portfolio' ? 'active' : ''}`} onClick={() => setTab('portfolio')}>
          Portfolio
        </button>
        <button className={`tab ${tab === 'fd' ? 'active' : ''}`} onClick={() => setTab('fd')}>
          FD Maturity
          {(p.hasPlan === 'corpus' || p.hasPlan === 'full') && (
            <span className="tab-count warn">1</span>
          )}
        </button>
      </div>

      <div className={`tab-content ${tab === 'goals' ? 'active' : ''}`}>
        <GoalsTabContent allGoals={allGoals} pGoalsLength={pGoalsLength} setEditGoal={setEditGoal} setNewGoalOpen={setNewGoalOpen} />
      </div>
      <div className={`tab-content ${tab === 'portfolio' ? 'active' : ''}`}>
        <PortfolioTabContent p={p} invActedMap={invActedMap} setInvActedMap={setInvActedMap} showToast={showToast} />
      </div>
      <div className={`tab-content ${tab === 'fd' ? 'active' : ''}`}>
        <FDTabContent hasPlan={p.hasPlan} showToast={showToast} />
      </div>
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function Plan({ persona: p, showToast }) {
  const trendMonths = ['N', 'D', 'J', 'F', 'M', 'A']
  const [editGoal, setEditGoal] = useState(null)
  const [goalEdits, setGoalEdits] = useState({})
  const [newGoals, setNewGoals] = useState([])
  const [newGoalOpen, setNewGoalOpen] = useState(false)
  const [invActedMap, setInvActedMap] = useState({})

  const handleSaveGoal = (idx, vals) => { setGoalEdits(e => ({ ...e, [idx]: vals })); showToast('Goal updated') }
  const getGoal = (g, i) => ({ ...g, ...(goalEdits[i] || {}) })
  const allGoals = [...p.goals.map((g, i) => getGoal(g, i)), ...newGoals]

  const isSurvivor = p.hasPlan === 'goals'

  const leftContent = isSurvivor ? (
    // ── Survivor: plain goals card, no tabs ──
    <div className="card" style={{ marginBottom: '14px' }}>
      <div className="sec-hdr">
        <div className="sec-title">Your goals</div>
        <button className="sec-link" onClick={() => setNewGoalOpen(true)}>+ New goal</button>
      </div>
      {allGoals.map((goal, i) => {
        const pct = Math.min(100, Math.round(goal.current / goal.target * 100))
        const mos = Math.ceil((goal.target - goal.current) / goal.monthly)
        const isNew = i >= p.goals.length
        return (
          <div key={i} className="goal-card" style={isNew ? { border: '1px solid rgba(58,90,249,.3)', background: 'var(--brand-dim)' } : {}}>
            <div className="goal-top">
              <div>
                <div className="goal-name">{goal.name}</div>
                <div className="goal-auto">Auto-saving ₹{goal.monthly.toLocaleString('en-IN')}/month</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ fontSize: '13px', fontWeight: 600, fontFamily: 'var(--mono)', color: 'var(--brand)' }}>{pct}%</div>
                {!isNew && (
                  <button className="sec-link" style={{ fontSize: '11px', border: '1px solid var(--border)', borderRadius: '6px', padding: '3px 8px', color: 'var(--t2)' }} onClick={() => setEditGoal(i)}>Edit</button>
                )}
                {isNew && <span style={{ fontSize: '10px', fontWeight: 600, color: 'var(--brand)', padding: '2px 7px', borderRadius: '8px', background: 'rgba(58,90,249,.12)' }}>New</span>}
              </div>
            </div>
            <div className="goal-track">
              <div className="goal-bar" style={{ width: `${pct}%`, background: goal.color }} />
            </div>
            <div className="goal-stats">
              <span>Saved: <strong>₹{fmt(goal.current)}</strong></span>
              <span>Target: <strong>₹{fmt(goal.target)}</strong></span>
              <span>Done in: <strong>~{mos} mo</strong></span>
            </div>
            <div className="goal-insight">💡 {goal.insight}</div>
          </div>
        )
      })}
    </div>
  ) : (
    // ── All other personas ──
    <>
      {/* NW/FIRE KPI card (for full + goals+nw only) */}
      {p.hasPlan === 'full' && (
        <div className="card" style={{ marginBottom: '14px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
            <div>
              <div style={{ fontSize: '10px', color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '.6px', marginBottom: '4px' }}>Net worth trend</div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: '22px', fontWeight: 500, color: 'var(--t1)', letterSpacing: '-.5px' }}>₹1.24Cr</div>
              <div className="trend-mini">
                {[88, 92, 98, 104, 116, 124].map((v, i) => (
                  <div key={i} className="trend-bar" style={{ height: `${Math.round(v / 124 * 36)}px`, background: i === 5 ? 'var(--brand)' : 'var(--brand-dim)' }} />
                ))}
              </div>
              <div className="trend-label">{trendMonths.map(m => <span key={m} className="trend-l-txt">{m}</span>)}</div>
            </div>
            <div>
              <div style={{ fontSize: '10px', color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '.6px', marginBottom: '4px' }}>Savings rate trend</div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: '22px', fontWeight: 500, color: 'var(--ok)', letterSpacing: '-.5px' }}>34%</div>
              <div className="trend-mini">
                {[28, 30, 31, 32, 33, 34].map((v, i) => (
                  <div key={i} className="trend-bar" style={{ height: `${Math.round(v / 34 * 36)}px`, background: i === 5 ? 'var(--ok)' : 'var(--ok-dim)' }} />
                ))}
              </div>
              <div className="trend-label">{trendMonths.map(m => <span key={m} className="trend-l-txt">{m}</span>)}</div>
            </div>
          </div>
          <div className="kpi-grid cols3">
            <div className="kpi">
              <div className="kpi-label">FIRE target <Tooltip tip="The corpus you need to retire early — based on your annual expenses × 25 (the 4% withdrawal rule)." /></div>
              <div className="kpi-value" style={{ fontSize: '16px' }}>₹4.0Cr</div>
              <span className="kpi-delta delta-neutral">at age 50</span>
            </div>
            <div className="kpi">
              <div className="kpi-label">Current corpus <Tooltip tip="Your total invested assets today: mutual funds, PPF, equity. Home equity excluded." /></div>
              <div className="kpi-value" style={{ fontSize: '16px' }}>₹1.24Cr</div>
              <span className="kpi-delta delta-up">↑ 31% done</span>
            </div>
            <div className="kpi">
              <div className="kpi-label">FIRE date <Tooltip tip="Projected age at which your corpus hits the target, at your current savings rate." /></div>
              <div className="kpi-value" style={{ fontSize: '16px' }}>Age 54</div>
              <span className="kpi-delta delta-up">3yr ahead</span>
            </div>
          </div>
        </div>
      )}

      {p.hasPlan === 'goals+nw' && (
        <div className="card" style={{ marginBottom: '14px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <div style={{ fontSize: '10px', color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '.6px', marginBottom: '4px' }}>Household net worth</div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: '22px', fontWeight: 500, color: 'var(--t1)' }}>₹42.8L</div>
              <div className="trend-mini">
                {[36, 38, 39, 40, 41, 42.8].map((v, i) => (
                  <div key={i} className="trend-bar" style={{ height: `${Math.round(v / 42.8 * 36)}px`, background: i === 5 ? 'var(--brand)' : 'var(--brand-dim)' }} />
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '10px', color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '.6px', marginBottom: '4px' }}>Savings rate</div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: '22px', fontWeight: 500, color: 'var(--ok)' }}>16%</div>
              <div className="trend-mini">
                {[12, 13, 14, 14, 15, 16].map((v, i) => (
                  <div key={i} className="trend-bar" style={{ height: `${Math.round(v / 16 * 36)}px`, background: i === 5 ? 'var(--ok)' : 'var(--ok-dim)' }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Summary insight card — all non-survivor personas */}
      <PlanSummaryCard hasPlan={p.hasPlan} />

      {/* Tabbed: Goals | Portfolio | FD Maturity */}
      <PlanTabsCard
        p={p}
        allGoals={allGoals}
        pGoalsLength={p.goals.length}
        setEditGoal={setEditGoal}
        setNewGoalOpen={setNewGoalOpen}
        invActedMap={invActedMap}
        setInvActedMap={setInvActedMap}
        showToast={showToast}
      />
    </>
  )

  return (
    <>
      {editGoal !== null && (
        <EditGoalModal
          goal={allGoals[editGoal]}
          onClose={() => setEditGoal(null)}
          onSave={(vals) => handleSaveGoal(editGoal, vals)}
        />
      )}
      {newGoalOpen && (
        <NewGoalModal
          onClose={() => setNewGoalOpen(false)}
          onCreated={(goal) => { setNewGoals(prev => [...prev, goal]); showToast('Goal created! 🎉') }}
        />
      )}

      <div className="plan-grid">
        <div>{leftContent}</div>
        <div><WhatIf persona={p} showToast={showToast} /></div>
      </div>
    </>
  )
}
