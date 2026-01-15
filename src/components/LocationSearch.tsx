import { useState, useEffect } from 'react'
import './LocationSearch.css'

interface LocationResult {
  name: string
  latitude: number
  longitude: number
  country: string
  admin1?: string
}

interface LocationSearchProps {
  isOpen: boolean
  onClose: () => void
  onSelectLocation: (lat: number, lon: number) => void
}

export function LocationSearch({ isOpen, onClose, onSelectLocation }: LocationSearchProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [results, setResults] = useState<LocationResult[]>([])
  const [loading, setLoading] = useState(false)

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim()) {
        searchCities(searchQuery)
      } else {
        setResults([])
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [searchQuery])

  const searchCities = async (query: string) => {
    setLoading(true)
    try {
      const response = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=10&language=en`
      )
      const data = await response.json()
      setResults(
        data.results?.map((result: any) => ({
          name: result.name,
          latitude: result.latitude,
          longitude: result.longitude,
          country: result.country,
          admin1: result.admin1,
        })) ?? []
      )
    } catch (err) {
      console.error('Failed to search cities:', err)
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  const handleSelect = (lat: number, lon: number) => {
    onSelectLocation(lat, lon)
    setSearchQuery('')
    setResults([])
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="dq-modal-overlay" onClick={onClose}>
      <div className="dq-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="dq-modal-header">
          <h2>Search Location</h2>
          <button className="dq-modal-close" onClick={onClose}>✕</button>
        </div>

        <input
          type="text"
          className="dq-search-input"
          placeholder="Search for a city..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          autoFocus
        />

        <div className="dq-results">
          {loading && <div className="dq-loading-text">Searching...</div>}
          {!loading && results.length === 0 && searchQuery && (
            <div className="dq-no-results">No results found</div>
          )}
          {!loading && searchQuery === '' && (
            <div className="dq-hint">Start typing to search for a location</div>
          )}
          {results.map((result, index) => (
            <button
              key={index}
              className="dq-result-item"
              onClick={() => handleSelect(result.latitude, result.longitude)}
            >
              <div className="dq-result-name">{result.name}</div>
              <div className="dq-result-location">
                {result.admin1 && `${result.admin1}, `}{result.country}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
