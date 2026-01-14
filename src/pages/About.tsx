import './About.css'

export function About() {
  return (
    <section className="dq-about">
      <div className="dq-about-container">
        <h2 className="dq-about-title">What's The Tea? ☕</h2>
        
        <div className="dq-about-content">
          <p>
            Welcome to <strong>The Dragcast</strong>, where weather forecasting meets fierce fabulous energy! 
            This isn't your average weather app, honey – we serve you the forecast with a side of shade 
            and a whole lot of personality.
          </p>

          <h3>About This App</h3>
          <p>
            The Dragcast was created to make checking the weather a little more glamorous and a lot more fun. 
            We've taken the mundane task of weather checking and given it the glow-up it deserves, complete with:
          </p>

          <ul>
            <li>🌈 Dragtastic weather descriptions that tell it like it is</li>
            <li>💅 Personality-packed humidity and precipitation commentary</li>
            <li>⭐ Fierce emoji weather icons that bring the drama</li>
            <li>📅 A full week of weather shade so you can plan your looks accordingly</li>
            <li>🎭 Hourly forecasts for when you need to know every detail</li>
          </ul>

          <h3>How It Works</h3>
          <p>
            We pull real weather data from Open-Meteo and transform it into the most entertaining forecast 
            you'll ever read. Your location data is used only to fetch your local weather – we're not here 
            to track you, just to keep you fabulous in any weather.
          </p>

          <h3>Credits</h3>
          <p>
            Weather data provided by <a href="https://open-meteo.com/" target="_blank" rel="noopener noreferrer">Open-Meteo API</a>
            <br />
            Built with love, sass, and a whole lot of React ⚛️
          </p>

          <div className="dq-about-tagline">
            Stay fabulous, whatever the weather! 💋
          </div>
        </div>
      </div>
    </section>
  )
}
