import { useState, useEffect } from 'react'
import './App.css'
import { fetchCityName as reverseGeocode, fetchForecastBundle, type DailyForecastItem } from './helpers/WeatherHelper'
import { getUserLocation } from './helpers/GeoLocationHelper'
import { getDragMessages, getDailyPhrase, getEmojiForCode, formatUpdatedLabel } from './helpers/DragHelper'

// Shape of weather display data (transformed from API response)
type WeatherData = {
  temperature: number
  windspeed: number
  weathercode: number
  time: string
}

function App() {
  // User's current coordinates
  const [location, setLocation] = useState<{ lat: number; long: number } | null>(null)
  const [error, setError] = useState<string | null>(null)
  // Current conditions display data
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(false)
  // City name from reverse geocoding
  const [cityName, setCityName] = useState<string | null>(null)
  // 5-day forecast
  const [daily, setDaily] = useState<DailyForecastItem[]>([])

  // When location changes, fetch weather for that location
  useEffect(() => {
    if (location) {
      fetchWeather(location.lat, location.long)
    } else {
      setWeather(null)
    }
  }, [location])

  // Get user's location from browser geolocation, then reverse geocode to city name
  const getLocation = async () => {
    setError(null)
    setCityName(null)
    try {
      const { lat, lon } = await getUserLocation()
      setLocation({ lat, long: lon })
      await fetchCityName(lat, lon)
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to get location'
      setError(msg)
    }
  }

  // Fetch current + 5-day forecast from Open-Meteo API
  async function fetchWeather(lat: number, lon: number) {
    setLoading(true)
    setError(null)
    try {
      const bundle = await fetchForecastBundle(lat, lon, 5)
      setWeather({
        temperature: bundle.current.temperatureF,
        windspeed: bundle.current.windSpeedMph,
        weathercode: bundle.current.weatherCode,
        time: bundle.current.time.toISOString(),
      })
      setDaily(bundle.daily)
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Failed to fetch weather'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  // Reverse geocode coords to city name
  async function fetchCityName(lat: number, lon: number) {
    try {
      const name = await reverseGeocode(lat, lon)
      setCityName(name)
    } catch (e) {
      setCityName(null)
    }
  }

  return (
    <div className="dq-page">
      {/* Header with branding and nav tabs */}
      <header className="dq-header">
        <div className="dq-brand">
          <div className="dq-title">Drag Queen</div>
          <div className="dq-sub">FORECAST</div>
        </div>
        <nav className="dq-nav">
          <span className="dq-tab active">Home</span>
          <span className="dq-tab">Weekly Shade</span>
          <span className="dq-tab">Fashion Tips</span>
          <span className="dq-tab">Tea & Drama</span>
          {/* Trigger geolocation when clicked */}
          <button className="dq-werk" onClick={getLocation}>WERK</button>
        </nav>
      </header>

      {/* Location + last update time */}
      <section className="dq-location">
        <div className="dq-location-text">
          <strong>Your Location:</strong> {cityName ?? '—'}
        </div>
        <div className="dq-updated">Last updated: {formatUpdatedLabel(weather?.time)}</div>
      </section>

      {/* Loading indicator */}
      {loading && <div className="dq-loading">Fetching the shade…</div>}

      {/* Today's 4 sassy forecast cards */}
      {weather && !loading && (
        <section className="dq-today">
          <h2>Today's Drag‑tastic Forecast:</h2>
          <div className="dq-cards">
            {getDragMessages(weather).map((msg, i) => (
              <div className="dq-card" key={`m-${i}`}>
                {/* Static emoji per card position */}
                <span className="dq-emoji">{i === 0 ? '😎' : i === 1 ? '💇‍♀️' : i === 2 ? '⛪️' : '💄'}</span>
                <span className="dq-card-text">{msg}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 3-day forecast tiles */}
      {daily.length > 0 && (
        <section className="dq-extended">
          <h2>Extended Shade Forecast</h2>
          <div className="dq-forecast-grid">
            {daily.slice(0, 3).map((d, i) => (
              <div className="dq-forecast-tile" key={`d-${i}`}>
                <div className="dq-forecast-day">
                  {d.date.toLocaleDateString([], { weekday: 'long' })}
                </div>
                <div className="dq-forecast-body">
                  <div className="dq-forecast-emoji">
                    {getEmojiForCode(d.weatherCode)}
                  </div>
                  <div className="dq-forecast-text">
                    {getDailyPhrase(Math.round(d.highF), d.weatherCode)}
                  </div>
                  <div className="dq-forecast-temps">{Math.round(d.highF)}° / {Math.round(d.lowF)}°F</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Footer with tip + social + error display */}
      <footer className="dq-footer">
        <div className="dq-tip">Better slap on extra setting spray & pray to the weather gods, queen!</div>
        <div className="dq-share">Share the shade: <span>📘</span><span>🐦</span><span>📸</span></div>
        {error && <div className="dq-error">{error}</div>}
      </footer>
    </div>
  )
}

export default App
