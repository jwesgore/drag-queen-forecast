import { useState } from 'react'
import emailjs from '@emailjs/browser'
import './About.css'
import { KoFiButton } from '../components/KoFiButton'
import { EMAILJS_PUBLIC_KEY, EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID } from '../helpers/emailjsConfig'

export function About() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget as HTMLFormElement

    setStatus('sending')
    try {
      await emailjs.sendForm(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        form,
        { publicKey: EMAILJS_PUBLIC_KEY }
      )
      setStatus('success')
      form.reset()
    } catch (err) {
      console.error('EmailJS error:', err)
      setStatus('error')
    }
  }

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

          <h3>Credits</h3>
          <p>
            Weather data provided by <a href="https://open-meteo.com/" target="_blank" rel="noopener noreferrer">Open-Meteo API</a>
            <br />
            Built with love, sass, and a whole lot of energy drinks.
          </p>

          <h3>Spill The Tea 💌</h3>
          <p>Have something to say? Drop me a message below, queen!</p>
          
          <form className="dq-contact-form" onSubmit={handleSubmit}>
            <div className="dq-form-group">
              <label htmlFor="name">Name</label>
              <input type="text" id="name" name="name" required placeholder="Your name" />
            </div>
            <div className="dq-form-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" name="email" required placeholder="your.email@example.com" />
            </div>
            <div className="dq-form-group">
              <label htmlFor="message">Message</label>
              <textarea id="message" name="message" required rows={5} placeholder="Spill it, honey..." />
            </div>
            <button type="submit" className="dq-submit-btn" disabled={status === 'sending'}>
              {status === 'sending' ? 'Sending the shade…' : 'Slay & Send 💋'}
            </button>
            {status === 'success' && (
              <p className="dq-form-feedback success">Message sent! I'll get back to you soon, queen! 👑</p>
            )}
            {status === 'error' && (
              <p className="dq-form-feedback error">Something went wrong, sis. Try again or email me directly.</p>
            )}
          </form>

          <h3>Support The Shade</h3>
          <p>If you would like to support my work, consider buying me a coffee.</p>
          <KoFiButton kofiId="C0C2NKLX" />

          <div className="dq-about-tagline">
            Stay fabulous, whatever the weather! 💋
          </div>
        </div>
      </div>
    </section>
  )
}
