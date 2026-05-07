import { P } from '../data/personas'

const NAV_ITEMS = [
  { id: 'home', icon: '⌂', label: 'Home' },
  { id: 'cashflow', icon: '⇄', label: 'Cash Flow' },
  { id: 'plan', icon: '◎', label: 'Plan' },
  { id: 'you', icon: '◌', label: 'You' },
]

export default function Sidebar({ currentPersona, currentPage, onPersonaChange, onPageChange, open }) {
  const p = P[currentPersona]
  return (
    <aside className={`sidebar ${open ? 'open' : ''}`}>
      <div className="logo">
        <div className="logo-mark">E↑</div>
        <span className="logo-name">Elevate</span>
      </div>
      <div className="persona-wrap">
        <div className="persona-label">Viewing as</div>
        <select className="persona-select" value={currentPersona} onChange={e => onPersonaChange(e.target.value)}>
          <option value="aarav">Aarav, 23 — Survivor</option>
          <option value="priya">Priya, 31 — Builder</option>
          <option value="sunita">Sunita, 58 — Builder</option>
          <option value="mehul">Mehul, 36 — Optimiser</option>
        </select>
      </div>
      <nav>
        {NAV_ITEMS.map(item => (
          <button
            key={item.id}
            className={`nav-item ${currentPage === item.id ? 'active' : ''}`}
            onClick={() => onPageChange(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            {item.label}
            {item.id === 'home' && (
              <span className="nav-badge">{p.needed.length}</span>
            )}
          </button>
        ))}
      </nav>
      <div className="sb-foot">
        <div className="user-pill">
          <div className="avatar" style={{ background: p.color }}>{p.initial}</div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 500, color: 'var(--t1)' }}>{p.name}</div>
            <div style={{ fontSize: '10px', color: 'var(--t3)' }}>
              Score: <strong style={{ color: 'var(--brand)' }}>{p.score}</strong>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}
