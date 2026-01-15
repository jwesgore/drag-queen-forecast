import { useState, useEffect } from 'react'
import { searchLocations, type LocationResult } from '../helpers/GeoLocationHelper'
import './LocationSearch.css'

interface LocationSearchProps {
  isOpen: boolean
  onClose: () => void
  onSelectLocation: (lat: number, lon: number) => void
}

export function LocationSearch({
  isOpen,
  onClose,
  onSelectLocation,
}: LocationSearchProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [results, setResults] = useState<LocationResult[]>([])
  const [loading, setLoading] = useState(false)

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim()) {
        performSearch(searchQuery)
      } else {
        setResults([])
      }
    }, 400)

    return () => clearTimeout(timer)
  }, [searchQuery])

  const performSearch = async (query: string) => {
    setLoading(true)
    const results = await searchLocations(query)
    setResults(results)
    setLoading(false)
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
      <div
        className="dq-modal-content"
        onClick={e => e.stopPropagation()}
      >
        <div className="dq-modal-header">
          <h2>Search Location</h2>
          <button className="dq-modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <input
          type="text"
          className="dq-search-input"
          placeholder="Search for a city… (e.g. Denver, CO)"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          autoFocus
        />

        <div className="dq-results">
          {loading && (
            <div className="dq-loading-text">Searching…</div>
          )}

          {!loading && results.length === 0 && searchQuery && (
            <div className="dq-no-results">No results found</div>
          )}

          {!loading && searchQuery === '' && (
            <div className="dq-hint">
              Start typing to search for a location
            </div>
          )}

          {results.map((result, index) => (
            <button
              key={`${result.name}-${index}`}
              className="dq-result-item"
              onClick={() =>
                handleSelect(
                  result.latitude,
                  result.longitude
                )
              }
            >
              <div className="dq-result-name">
                {result.name}
              </div>
              <div className="dq-result-location">
                {result.admin1 && `${result.admin1}, `}
                {result.country}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
