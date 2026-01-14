import './Header.css'

interface HeaderProps {
  onWerkClick: () => void
  onHomeClick: () => void
  onWeeklyClick: () => void
  currentPage: 'home' | 'weekly'
}

export function Header({ onWerkClick, onHomeClick, onWeeklyClick, currentPage }: HeaderProps) {
  return (
    <header className="dq-header">
      <div className="dq-brand">
        <div className="dq-title">The Dragcast</div>
      </div>
      <nav className="dq-nav">
        <button className={`dq-tab ${currentPage === 'home' ? 'active' : ''}`} onClick={onHomeClick}>Home</button>
        <button className={`dq-tab ${currentPage === 'weekly' ? 'active' : ''}`} onClick={onWeeklyClick}>Weekly Shade</button>
        <span className="dq-tab">Fashion Tips</span>
        <span className="dq-tab">Tea & Drama</span>
        <button className="dq-werk" onClick={onWerkClick}>WERK</button>
      </nav>
    </header>
  )
}
