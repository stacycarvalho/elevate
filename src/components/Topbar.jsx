export default function Topbar({ title, onToggleSidebar, onSetup, currentPersona, onPersonaChange }) {
  return (
    <div className="topbar">
      <div className="hamburger" onClick={onToggleSidebar}>☰</div>
      <div className="page-title">{title}</div>
      <div
        className="icon-btn topbar-setup"
        style={{ fontSize: '10px', fontWeight: 600, color: 'var(--brand)', width: 'auto', padding: '0 9px' }}
        onClick={onSetup}
      >
        Setup
      </div>
      <select className="topbar-persona" value={currentPersona} onChange={e => onPersonaChange(e.target.value)}>
        <option value="aarav">Aarav</option>
        <option value="priya">Priya</option>
        <option value="sunita">Sunita</option>
        <option value="mehul">Mehul</option>
      </select>
    </div>
  )
}
