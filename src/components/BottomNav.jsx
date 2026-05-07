const LEFT = [
  { id: 'home', icon: '⌂', label: 'Home' },
  { id: 'cashflow', icon: '⇄', label: 'Cash Flow' },
]
const RIGHT = [
  { id: 'plan', icon: '◎', label: 'Plan' },
  { id: 'you', icon: '◌', label: 'You' },
]

export default function BottomNav({ currentPage, onPageChange, onAsk, neededCount }) {
  const active = currentPage === 'log' ? 'home' : currentPage
  const renderItem = (item) => (
    <button
      key={item.id}
      className={`bn-item ${active === item.id ? 'active' : ''}`}
      onClick={() => onPageChange(item.id)}
    >
      <span className="bn-icon">{item.icon}</span>
      <span className="bn-label">{item.label}</span>
      {item.id === 'home' && neededCount > 0 && (
        <span className="bn-badge">{neededCount}</span>
      )}
    </button>
  )

  return (
    <nav className="bottom-nav">
      {LEFT.map(renderItem)}
      <button className="bn-item bn-ask" onClick={onAsk}>
        <div className="bn-ask-circle">✦</div>
        <span className="bn-label">Ask</span>
      </button>
      {RIGHT.map(renderItem)}
    </nav>
  )
}
