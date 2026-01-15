import { formatUpdatedLabel } from '../helpers/DragHelper'
import './LocationBanner.css'

interface LocationBannerProps {
  cityName: string | null
  lastUpdateTime?: string
  onLocationClick: () => void
}

export function LocationBanner({ cityName, lastUpdateTime, onLocationClick }: LocationBannerProps) {
  return (
    <button className="dq-location" onClick={onLocationClick}>
      <strong>Your Location:</strong> {cityName ?? '—'} • Last updated: {formatUpdatedLabel(lastUpdateTime)}
    </button>
  )
}
