import { useState } from 'react';
import emailjs from '@emailjs/browser';
import { EMAILJS_PUBLIC_KEY, EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID } from '../helpers/emailjsConfig';
import './Contact.css';

export function Contact() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;

    setStatus('sending');
    try {
      await emailjs.sendForm(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        form,
        { publicKey: EMAILJS_PUBLIC_KEY }
      );
      setStatus('success');
      form.reset();
    } catch (err) {
      console.error('EmailJS error:', err);
      setStatus('error');
    }
  };

  return (
    <section className="dq-contact">
      <div className="dq-contact-container">
        <h2 className="dq-contact-title">Spill The Tea 💌</h2>
        <p className="dq-contact-subtitle">
          Questions, feedback, or just want to talk drag? Drop me a message, queen!
        </p>

        <div className="dq-contact-wrapper">
          <div className="dq-contact-methods">
            <h3 className="dq-contact-methods-title">Contact Information</h3>

            <div className="dq-contact-grid">
              <div className="dq-contact-card">
                <h4 className="dq-contact-label">📍 Location</h4>
                <div className="dq-contact-value">St. Louis, Missouri</div>
              </div>
              <div className="dq-contact-card">
                <h4 className="dq-contact-label">📧 Email</h4>
                <div className="dq-contact-value">
                  <a href="mailto:jwesdev@gmail.com">jwesdev@gmail.com</a>
                </div>
              </div>
            </div>

            <div className="dq-social-section">
              <h4>Find Me Online</h4>
              <div className="dq-social-links">
                <a href="https://github.com/jwesgore" target="_blank" rel="noopener noreferrer" className="dq-social-link">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  <span>GitHub</span>
                </a>
                <a href="https://www.linkedin.com/in/wesleygore/" target="_blank" rel="noopener noreferrer" className="dq-social-link">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                  <span>LinkedIn</span>
                </a>
              </div>
            </div>
          </div>

          <form className="dq-contact-form" onSubmit={handleSubmit}>
            <h3 className="dq-form-title">Send Me a Message</h3>
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
        </div>
      </div>
    </section>
  );
}
