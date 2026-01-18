import './About.css'
import { KoFiButton } from '../components/KoFiButton'

export function About() {
  return (
    <section className="dq-about">
      <div className="dq-about-container">
        <h2 className="dq-about-title">What's The Tea? ☕</h2>
        
        <div className="dq-about-content">
          <p>
            Welcome to <strong>The Dragcast</strong>, your fabulously forecasted weather companion. 
            This project began as a coding exercise to sharpen my skills in React and TypeScript, but quickly turned 
            into something a little more <i>iconic</i>. I wanted a weather app that showcased my technical abilities while 
            also letting my personality shine. As a proudly queer developer, I thought it fitting to add a bit of drag culture, 
            humor, and a touch of camp.
          </p>

          <h3>Get In Touch</h3>
          <p>
            If you have any questions or suggestions feel free to email me at blah@blah.com.
          </p>
          <p>
            If you would like to support my work, consider buying me a coffee:
          </p>
          <KoFiButton kofiId="C0C2NKLX" />

          <h3>Credits</h3>
          <p>
            Weather data provided by <a href="https://open-meteo.com/" target="_blank" rel="noopener noreferrer">Open-Meteo API</a>
            <br />
            Built with love, sass, and a whole lot of energy drinks.
          </p>

          <div className="dq-about-tagline">
            Stay fabulous, whatever the weather! 💋
          </div>
        </div>
      </div>
    </section>
  )
}
