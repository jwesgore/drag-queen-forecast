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
      {cityName ?? 'Please select a location'} • {formatUpdatedLabel(lastUpdateTime)}
    </button>
  )
}
