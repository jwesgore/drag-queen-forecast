import './Footer.css'

interface FooterProps {
  error: string | null
}

export function Footer({ error }: FooterProps) {
  return (
    <footer className="dq-footer">
      <div className="dq-tip">Better slap on extra setting spray & pray to the weather gods, queen!</div>
      <div className="dq-share">Share the shade: <span>📘</span><span>🐦</span><span>📸</span></div>
      {error && <div className="dq-error">{error}</div>}
    </footer>
  )
}
