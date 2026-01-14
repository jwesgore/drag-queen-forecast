import { useState } from 'react'
import './Header.css'

interface HeaderProps {
  onWerkClick: () => void
  onHomeClick: () => void
  onWeeklyClick: () => void
  onAboutClick: () => void
  currentPage: 'home' | 'weekly' | 'about'
}

export function Header({ onWerkClick, onHomeClick, onWeeklyClick, onAboutClick, currentPage }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  const handleMenuClose = () => setMenuOpen(false)

  const handleHomeClick = () => {
    onHomeClick()
    handleMenuClose()
  }

  const handleWeeklyClick = () => {
    onWeeklyClick()
    handleMenuClose()
  }

  const handleAboutClick = () => {
    onAboutClick()
    handleMenuClose()
  }

  return (
    <header className="dq-header">
      <div className="dq-brand">
        <div className="dq-title">The Dragcast</div>
      </div>
      <button className="dq-hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        <span className={`hamburger-line ${menuOpen ? 'open' : ''}`}></span>
        <span className={`hamburger-line ${menuOpen ? 'open' : ''}`}></span>
        <span className={`hamburger-line ${menuOpen ? 'open' : ''}`}></span>
      </button>
      <nav className={`dq-nav ${menuOpen ? 'open' : ''}`}>
        <button className={`dq-tab ${currentPage === 'home' ? 'active' : ''}`} onClick={handleHomeClick}>Home</button>
        <button className={`dq-tab ${currentPage === 'weekly' ? 'active' : ''}`} onClick={handleWeeklyClick}>Weekly Shade</button>
        <span className="dq-tab">Fashion Tips</span>
        <button className={`dq-tab ${currentPage === 'about' ? 'active' : ''}`} onClick={handleAboutClick}>What's The Tea</button>
        <button className="dq-werk" onClick={onWerkClick}>WERK</button>
      </nav>
    </header>
  )
}
