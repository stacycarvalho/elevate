export default function Topbar({ title, onToggleSidebar, onAsk, onSetup }) {
  return (
    <div className="topbar">
      <div className="hamburger" onClick={onToggleSidebar}>☰</div>
      <div className="page-title">{title}</div>
      <div
        className="icon-btn"
        style={{ fontSize: '10px', fontWeight: 600, color: 'var(--brand)', width: 'auto', padding: '0 9px' }}
        onClick={onSetup}
      >
        Setup
      </div>
      <div className="icon-btn">
        🔔<div className="notif-dot" />
      </div>
      <button className="btn btn-primary" onClick={onAsk}>✦ Ask</button>
    </div>
  )
}
