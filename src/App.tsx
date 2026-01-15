import { useState, useEffect } from 'react'
import './App.css'
import { fetchCityName as reverseGeocode, fetchForecastBundle, type DailyForecastItem } from './helpers/WeatherHelper'
import { getUserLocation } from './helpers/GeoLocationHelper'
import { Header } from './components/Header'
import { LocationBanner } from './components/LocationBanner'
import { LocationSearch } from './components/LocationSearch'
import { TodaysForecast } from './components/cards/TodaysForecast'
import { ExtendedForecast } from './components/cards/ExtendedForecast'
import { WeeklyForecast } from './pages/WeeklyForecast'
import { About } from './pages/About'
import { Footer } from './components/Footer'

// Shape of weather display data (transformed from API response)
type WeatherData = {
  temperature: number
  apparentTemperature: number
  windspeed: number
  weathercode: number
  time: string
  humidity: number
  precipitationProbability: number
  hourly: Array<{ temperatureF: number; weatherCode: number; precipitationProbability?: number; time: Date }>
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
  // Current page
  const [currentPage, setCurrentPage] = useState<'home' | 'weekly' | 'about'>('home')
  // Location search dialog
  const [showLocationSearch, setShowLocationSearch] = useState(false)

  // Auto-load location on mount
  useEffect(() => {
    getLocation()
  }, [])

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

  // Handle location search dialog selection
  const handleLocationSelect = async (lat: number, lon: number) => {
    setLocation({ lat, long: lon })
    await fetchCityName(lat, lon)
  }

  // Fetch current + 7-day forecast from Open-Meteo API
  async function fetchWeather(lat: number, lon: number) {
    setLoading(true)
    setError(null)
    try {
      const bundle = await fetchForecastBundle(lat, lon, 8, 12)
      setWeather({
        temperature: bundle.current.temperatureF,
        apparentTemperature: bundle.current.apparentTemperatureF,
        windspeed: bundle.current.windSpeedMph,
        weathercode: bundle.current.weatherCode,
        time: bundle.current.time.toISOString(),
        humidity: bundle.current.humidity,
        precipitationProbability: bundle.current.precipitationProbability ?? 0,
        hourly: bundle.hourly ?? [],
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
      <Header 
        onWerkClick={getLocation} 
        onHomeClick={() => setCurrentPage('home')}
        onWeeklyClick={() => setCurrentPage('weekly')}
        onAboutClick={() => setCurrentPage('about')}
        currentPage={currentPage}
      />
      <LocationBanner cityName={cityName} lastUpdateTime={weather?.time} onLocationClick={() => setShowLocationSearch(true)} />
      <LocationSearch 
        isOpen={showLocationSearch} 
        onClose={() => setShowLocationSearch(false)}
        onSelectLocation={handleLocationSelect}
        onUseMyLocation={getLocation}
      />

      {/* Loading indicator */}
      {loading && <div className="dq-loading">Fetching the shade…</div>}

      {currentPage === 'home' && (
        <>
          {weather && !loading && <TodaysForecast weather={weather} />}
          {/* 3-day forecast tiles */}
          <ExtendedForecast daily={daily} />
        </>
      )}

      {currentPage === 'weekly' && (
        <WeeklyForecast daily={daily} />
      )}

      {currentPage === 'about' && (
        <About />
      )}

      <Footer error={error} />
    </div>
  )
}

export default App
