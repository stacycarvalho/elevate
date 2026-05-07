import { useState } from 'react'
import ScoreRing from '../ScoreRing'
import { agentLogData, perms } from '../../data/transactions'

export default function You({ persona: p, showToast }) {
  const [activeTab, setActiveTab] = useState('log')

  return (
    <>
      <div style={{ background: 'var(--brand-dim)', border: '1px solid rgba(58,90,249,.15)', borderRadius: 'var(--r)', padding: '18px 20px', marginBottom: '14px' }}>
        <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--brand)', marginBottom: '4px' }}>A note from your agent</div>
        <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--t1)', marginBottom: '4px' }}>{p.encouragement}</div>
        <div style={{ fontSize: '12px', color: 'var(--t2)' }}>Here's your full financial picture.</div>
      </div>

      <div className="card" style={{ marginBottom: '14px' }}>
        <div className="kpi-grid cols2" style={{ marginBottom: 0 }}>
          {p.kpis.map((k, i) => (
            <div key={i} className="kpi">
              <div className="kpi-label">
                {k.label}{' '}
                <div className="tip-wrap">
                  <span className="tip-icon">?</span>
                  <div className="tip-box">{k.tip}</div>
                </div>
              </div>
              <div className="kpi-value" style={{ fontSize: '18px' }}>{k.value}</div>
              <span className={`kpi-delta delta-${k.dir}`}>{k.delta}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card" style={{ marginBottom: '14px' }}>
        <div className="sec-hdr">
          <div className="sec-title">Financial health score — {p.score}/100</div>
        </div>
        <div className="score-ring-wrap">
          <ScoreRing score={p.score} />
          <div style={{ flex: 1 }}>
            {p.dims.map((d, i) => (
              <div key={i} className="dim-row">
                <div className="dim-label" style={{ fontSize: '12px' }}>{d.label}</div>
                <div className="dim-track" style={{ width: '80px' }}>
                  <div className="dim-fill" style={{ width: `${d.score}%`, background: d.color }} />
                </div>
                <div className="dim-val" style={{ fontSize: '11px' }}>{d.score}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '14px' }}>
        <div className="tab-bar">
          <button className={`tab ${activeTab === 'log' ? 'active' : ''}`} onClick={() => setActiveTab('log')}>Agent log</button>
          <button className={`tab ${activeTab === 'perms' ? 'active' : ''}`} onClick={() => setActiveTab('perms')}>Permissions</button>
        </div>

        <div className={`tab-content ${activeTab === 'log' ? 'active' : ''}`}>
          <div style={{ fontSize: '11px', color: 'var(--t3)', marginBottom: '14px' }}>
            Everything your agent has done — with plain-language reasons. You can undo any action within 24 hours.
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
                  <span style={{ color: 'var(--brand)', cursor: 'pointer' }} onClick={() => showToast('Undo available within 24 hours')}>
                    Undo
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className={`tab-content ${activeTab === 'perms' ? 'active' : ''}`}>
          <div style={{ background: 'var(--brand-dim)', borderRadius: '8px', padding: '10px 12px', marginBottom: '14px', fontSize: '12px', color: 'var(--t2)' }}>
            ✦ The agent starts conservative and earns more permissions as you see it work. You can change these anytime.
          </div>
          {perms.map((pm, i) => (
            <div key={i} className="perm-card">
              <div className="perm-top">
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
                    <span style={{ fontSize: '9px', fontWeight: 700, padding: '2px 7px', borderRadius: '8px', background: 'var(--surface2)', color: 'var(--t3)' }}>
                      TIER {pm.tier}
                    </span>
                    <div className="perm-name">{pm.name}</div>
                  </div>
                  <div className="perm-desc">{pm.desc}</div>
                </div>
                {pm.fixed ? (
                  <span style={{
                    fontSize: '11px', fontWeight: 500, padding: '5px 10px', borderRadius: '7px', whiteSpace: 'nowrap',
                    background: pm.fixed === 'Always on' ? 'var(--ok-dim)' : 'var(--danger-dim)',
                    color: pm.fixed === 'Always on' ? 'var(--ok)' : 'var(--danger)',
                  }}>
                    {pm.fixed}
                  </span>
                ) : (
                  <select className="perm-select" onChange={() => showToast('Permission updated')}>
                    <option>Auto on</option>
                    <option>Ask first</option>
                    <option>Off</option>
                  </select>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {p.tier >= 2 && (
        <div className="card">
          <div className="sec-hdr"><div className="sec-title">Family & household</div></div>
          <div style={{ fontSize: '12px', color: 'var(--t2)', lineHeight: 1.6, marginBottom: '12px' }}>
            Link a partner for a combined household view. Grant a family member read-only access to your corpus runway and key numbers — without sharing individual transactions.
          </div>
          <button className="btn btn-ghost" style={{ width: '100%', fontSize: '12px' }} onClick={() => showToast('Family access settings')}>
            Manage access
          </button>
        </div>
      )}

      <div className="card" style={{ marginTop: '14px' }}>
        <div className="sec-hdr"><div className="sec-title">Tier progress</div></div>
        <div style={{ background: 'var(--surface2)', borderRadius: '8px', padding: '12px', marginBottom: '12px' }}>
          <div style={{ fontSize: '10px', color: 'var(--t3)', marginBottom: '2px' }}>CURRENT TIER</div>
          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--t1)' }}>{p.tierLabel}</div>
        </div>
        {p.tier < 3 ? (
          <>
            <div style={{ fontSize: '12px', color: 'var(--t2)', lineHeight: 1.6, marginBottom: '12px' }}>
              {p.tier === 1
                ? "You've had a positive surplus for 47 of the last 60 days. Emergency fund at 8%. Keep going — Goals tab unlocks when you hit 1 month of expenses saved."
                : 'Emergency fund active. First SIP running. Tier 3 features unlock when you\'ve held an investment for 3+ months.'}
            </div>
            <button className="btn btn-ghost" style={{ width: '100%', fontSize: '12px' }} onClick={() => showToast(`Next tier: Tier ${p.tier + 1}`)}>
              See what unlocks next
            </button>
          </>
        ) : (
          <div style={{ fontSize: '12px', color: 'var(--t2)' }}>
            All features unlocked. Agent autonomy expands as you approve more actions.
          </div>
        )}
      </div>
    </>
  )
}
