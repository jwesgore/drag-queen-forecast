import './Header.css'

interface HeaderProps {
  onWerkClick: () => void
}

export function Header({ onWerkClick }: HeaderProps) {
  return (
    <header className="dq-header">
      <div className="dq-brand">
        <div className="dq-title">The Dragcast</div>
      </div>
      <nav className="dq-nav">
        <span className="dq-tab active">Home</span>
        <span className="dq-tab">Weekly Shade</span>
        <span className="dq-tab">Fashion Tips</span>
        <span className="dq-tab">Tea & Drama</span>
        <button className="dq-werk" onClick={onWerkClick}>WERK</button>
      </nav>
    </header>
  )
}
