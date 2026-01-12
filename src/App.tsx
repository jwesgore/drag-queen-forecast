import { useState, useEffect } from 'react'
import './App.css'
import {
  fetchWeather as fetchCurrentWeather,
  fetchCityName as reverseGeocode,
  getWeatherDescription,
  fetchHourlyForecast,
  fetchDailyForecast,
  type HourlyForecastItem,
  type DailyForecastItem,
} from './weather/WeatherHelper'

type WeatherData = {
  temperature: number
  windspeed: number
  weathercode: number
  time: string
}

function App() {
  const [location, setLocation] = useState<{ lat: number; long: number } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(false)
  const [cityName, setCityName] = useState<string | null>(null)
  const [hourly, setHourly] = useState<HourlyForecastItem[]>([])
  const [daily, setDaily] = useState<DailyForecastItem[]>([])

  useEffect(() => {
    if (location) {
      fetchWeather(location.lat, location.long)
    } else {
      setWeather(null)
    }
  }, [location])

  const getLocation = () => {
    setError(null)
    setCityName(null)
    
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser')
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude
        const lon = position.coords.longitude
        setLocation({ lat, long: lon })
        fetchCityName(lat, lon)
      },
      (err) => {
        setError(`Error: ${err.message}`)
      }
    )
  }

  async function fetchWeather(lat: number, lon: number) {
    setLoading(true)
    setError(null)
    try {
      const [cw, hourlyData, dailyData] = await Promise.all([
        fetchCurrentWeather(lat, lon),
        fetchHourlyForecast(lat, lon, 12),
        fetchDailyForecast(lat, lon, 5),
      ])
      setWeather({
        temperature: cw.temperatureF,
        windspeed: cw.windSpeedMph,
        weathercode: cw.weatherCode,
        time: cw.time.toISOString(),
      })
      setHourly(hourlyData)
      setDaily(dailyData)
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Failed to fetch weather'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  async function fetchCityName(lat: number, lon: number) {
    try {
      const name = await reverseGeocode(lat, lon)
      setCityName(name)
    } catch (e) {
      // reverseGeocode already logs; just clear city name
      setCityName(null)
    }
  }


  return (
    <div className="container">
      <h1>Location Finder</h1>
      
      <div className="controls">
        <button onClick={getLocation}>Get My Location</button>
      </div>
      
      {location && (
        <div className="location-info">
          <h2>Location</h2>
          {cityName && (
            <p className="city-name">{cityName}</p>
          )}
          <p><strong>Latitude:</strong> {location.lat.toFixed(4)}</p>
          <p><strong>Longitude:</strong> {location.long.toFixed(4)}</p>
        </div>
      )}
      
      {loading && (
        <div className="loading">Loading weather data...</div>
      )}
      
      {weather && !loading && (
        <div className="weather-info">
          <h2>Current Weather</h2>
          <div className="weather-details">
            <div className="weather-item">
              <span className="weather-label">Temperature:</span>
              <span className="weather-value">{weather.temperature}°F</span>
            </div>
            <div className="weather-item">
              <span className="weather-label">Conditions:</span>
              <span className="weather-value">{getWeatherDescription(weather.weathercode)}</span>
            </div>
            <div className="weather-item">
              <span className="weather-label">Wind Speed:</span>
              <span className="weather-value">{weather.windspeed} mph</span>
            </div>
          </div>

          {hourly.length > 0 && (
            <div className="forecast-hourly">
              <h3>Next 12 Hours</h3>
              <div className="forecast-grid">
                {hourly.map((h, idx) => (
                  <div className="forecast-card" key={`h-${idx}`}>
                    <div className="forecast-time">
                      {h.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div className="forecast-temp">{Math.round(h.temperatureF)}°F</div>
                    <div className="forecast-cond">{getWeatherDescription(h.weatherCode)}</div>
                    <div className="forecast-wind">{Math.round(h.windSpeedMph)} mph</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {daily.length > 0 && (
            <div className="forecast-daily">
              <h3>5‑Day Forecast</h3>
              <div className="forecast-grid">
                {daily.map((d, idx) => (
                  <div className="forecast-card" key={`d-${idx}`}>
                    <div className="forecast-date">
                      {d.date.toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </div>
                    <div className="forecast-temp">{Math.round(d.highF)}° / {Math.round(d.lowF)}°F</div>
                    <div className="forecast-cond">{getWeatherDescription(d.weatherCode)}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      
      {error && (
        <div className="error">
          {error}
        </div>
      )}
    </div>
  )
}

export default App
