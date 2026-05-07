import { useState, useRef, useEffect } from 'react'
import { fmt } from '../../utils'
import { goalFlow } from '../../data/transactions'

const FD_DATA = [
  { bank: 'SBI', amt: '₹8,00,000', rate: '7.1%', date: 'Jun 2, 2025', days: 18, urgent: true },
  { bank: 'HDFC', amt: '₹12,00,000', rate: '7.0%', date: 'Sep 15, 2025', days: 121, urgent: false },
  { bank: 'Axis', amt: '₹8,40,000', rate: '6.9%', date: 'Jan 3, 2026', days: 231, urgent: false },
]

const WI_DEFAULTS = { raise: 20, leave: 6, sip: 10000 }

function WhatIf({ persona: p, showToast }) {
  const [scenario, setScenario] = useState('raise')
  const [wiVal, setWiVal] = useState(20)
  const [actionDone, setActionDone] = useState(false)

  const changeScenario = (s) => { setScenario(s); setWiVal(WI_DEFAULTS[s]); setActionDone(false) }

  const income = p.cfData?.income || 0
  const raise = Number(wiVal) || 20
  const months = Number(wiVal) || 6
  const extra = Number(wiVal) || 10000

  const handleTakeAction = () => {
    setActionDone(true)
    showToast('Investment plan created — check agent log')
  }

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
            <button className="btn btn-primary" style={{ width: '100%', marginTop: '12px', fontSize: '12px' }} onClick={handleTakeAction}>
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
          <input
            style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border)', borderRadius: '8px', fontFamily: 'var(--sans)', fontSize: '13px', color: 'var(--t1)', background: 'var(--surface2)', outline: 'none' }}
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--t3)', marginBottom: '5px' }}>Target (₹)</div>
            <input
              className="wi-input" type="number" style={{ width: '100%', maxWidth: 'unset' }}
              value={target}
              onChange={e => setTarget(Number(e.target.value))}
            />
          </div>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--t3)', marginBottom: '5px' }}>Monthly (₹)</div>
            <input
              className="wi-input" type="number" style={{ width: '100%', maxWidth: 'unset' }}
              value={monthly}
              onChange={e => setMonthly(Number(e.target.value))}
            />
          </div>
        </div>

        <div
          style={{ background: 'var(--brand-dim)', borderRadius: '8px', padding: '10px 12px', marginBottom: '14px', cursor: 'pointer' }}
          onClick={() => setMonthly(aiSuggested)}
        >
          <div style={{ fontSize: '10px', fontWeight: 600, color: 'var(--brand)', marginBottom: '2px' }}>✦ AI suggestion</div>
          <div style={{ fontSize: '12px', color: 'var(--t2)' }}>
            Increase to ₹{aiSuggested.toLocaleString('en-IN')}/month — reach your goal ~{Math.round((goal.target - goal.current) / goal.monthly - (goal.target - goal.current) / aiSuggested)} months earlier.
          </div>
          <div style={{ fontSize: '11px', color: 'var(--brand)', marginTop: '4px', fontWeight: 500 }}>Tap to apply →</div>
        </div>

        <div className="am-btns">
          <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => { onSave({ name, target, monthly }); onClose() }}>
            Save changes ✓
          </button>
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  )
}

function GoalConversation({ showToast }) {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [state, setState] = useState(0)
  const msgsRef = useRef(null)

  const openConv = () => {
    setState(0)
    setMessages([{ role: 'ai', text: goalFlow[0] }])
    setOpen(true)
  }

  useEffect(() => {
    if (msgsRef.current) msgsRef.current.scrollTop = 9999
  }, [messages])

  const send = () => {
    if (!input.trim()) return
    const text = input
    setInput('')
    const next = state + 1
    setState(next)
    setMessages(m => [...m, { role: 'user', text }])
    setTimeout(() => {
      if (next < goalFlow.length) {
        setMessages(m => [...m, { role: 'ai', text: goalFlow[next] }])
      } else {
        setMessages(m => [...m, { role: 'ai', text: 'Auto-save rule created and linked to your new goal. 🎉' }])
        showToast('Goal created!')
      }
    }, 600)
  }

  const handleKey = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }

  return (
    <>
      <button className="sec-link" onClick={openConv}>+ New goal</button>
      {open && (
        <div style={{ marginTop: '12px' }}>
          <div style={{ fontSize: '12px', fontWeight: 600, marginBottom: '10px' }}>✦ Let's set up a new goal</div>
          <div className="conv-msgs" ref={msgsRef}>
            {messages.map((msg, i) => (
              <div key={i} className={`conv-msg ${msg.role === 'ai' ? 'msg-ai' : 'msg-user'}`}>{msg.text}</div>
            ))}
          </div>
          <div className="conv-wrap">
            <textarea
              className="conv-input"
              placeholder="What are you saving for?"
              rows={1}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
            />
            <button className="conv-send" onClick={send}>↑</button>
          </div>
        </div>
      )}
    </>
  )
}

export default function Plan({ persona: p, showToast }) {
  const trendMonths = ['N', 'D', 'J', 'F', 'M', 'A']
  const [editGoal, setEditGoal] = useState(null)
  const [goalEdits, setGoalEdits] = useState({})

  const handleSaveGoal = (idx, vals) => {
    setGoalEdits(e => ({ ...e, [idx]: vals }))
    showToast('Goal updated')
  }

  const getGoal = (g, i) => ({ ...g, ...(goalEdits[i] || {}) })

  const leftContent = (
    <>
      {p.hasPlan === 'corpus' && (
        <div className="card" style={{ marginBottom: '14px' }}>
          <div style={{ fontSize: '10px', color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '.6px', marginBottom: '4px' }}>At your current spending</div>
          <div className="corpus-big">23</div>
          <div style={{ fontSize: '12px', color: 'var(--t2)', marginBottom: '14px' }}>years of savings remaining</div>
          <div style={{ background: 'var(--ok-dim)', borderRadius: '8px', padding: '12px', marginBottom: '16px' }}>
            <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--ok)', marginBottom: '3px' }}>✓ You're in good shape</div>
            <div style={{ fontSize: '12px', color: 'var(--t2)' }}>Accounting for 6% annual inflation, your runway is 19 years. Your pension income means you're not drawing down — you're still adding to your corpus each month.</div>
          </div>
          <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--t1)', marginBottom: '10px' }}>FD maturity calendar</div>
          {FD_DATA.map((fd, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 0', borderBottom: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: fd.urgent ? 'var(--warn)' : 'var(--ok)' }} />
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 500 }}>{fd.bank} FD · {fd.rate}</div>
                  <div style={{ fontSize: '10px', color: 'var(--t3)' }}>{fd.date} · {fd.days} days away</div>
                </div>
              </div>
              <div style={{ fontSize: '12px', fontWeight: 500, fontFamily: 'var(--mono)' }}>{fd.amt}</div>
            </div>
          ))}
        </div>
      )}

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
            <div className="kpi"><div className="kpi-label">FIRE target</div><div className="kpi-value" style={{ fontSize: '16px' }}>₹4.0Cr</div><span className="kpi-delta delta-neutral">at age 50</span></div>
            <div className="kpi"><div className="kpi-label">Current corpus</div><div className="kpi-value" style={{ fontSize: '16px' }}>₹1.24Cr</div><span className="kpi-delta delta-up">↑ 31% done</span></div>
            <div className="kpi"><div className="kpi-label">FIRE date</div><div className="kpi-value" style={{ fontSize: '16px' }}>Age 54</div><span className="kpi-delta delta-up">3yr ahead</span></div>
          </div>
        </div>
      )}

      {p.hasPlan === 'goals+nw' && (
        <div className="card" style={{ marginBottom: '14px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
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

      {p.hasPlan !== 'corpus' && (
        <div className="card" style={{ marginBottom: '14px' }}>
          <div className="sec-hdr">
            <div className="sec-title">Your goals</div>
            <GoalConversation showToast={showToast} />
          </div>
          {p.goals.map((g, i) => {
            const goal = getGoal(g, i)
            const pct = Math.min(100, Math.round(goal.current / goal.target * 100))
            const mos = Math.ceil((goal.target - goal.current) / goal.monthly)
            return (
              <div key={i} className="goal-card">
                <div className="goal-top">
                  <div>
                    <div className="goal-name">{goal.name}</div>
                    <div className="goal-auto">Auto-saving ₹{goal.monthly.toLocaleString('en-IN')}/month</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ fontSize: '13px', fontWeight: 600, fontFamily: 'var(--mono)', color: 'var(--brand)' }}>{pct}%</div>
                    <button
                      className="sec-link"
                      style={{ fontSize: '11px', border: '1px solid var(--border)', borderRadius: '6px', padding: '3px 8px', color: 'var(--t2)' }}
                      onClick={() => setEditGoal(i)}
                    >
                      Edit
                    </button>
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
      )}
    </>
  )

  return (
    <>
      {editGoal !== null && (
        <EditGoalModal
          goal={getGoal(p.goals[editGoal], editGoal)}
          onClose={() => setEditGoal(null)}
          onSave={(vals) => handleSaveGoal(editGoal, vals)}
        />
      )}

      <div className="plan-grid">
        <div>{leftContent}</div>
        <div><WhatIf persona={p} showToast={showToast} /></div>
      </div>
    </>
  )
}
