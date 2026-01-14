import { formatUpdatedLabel } from '../helpers/DragHelper'
import './LocationBanner.css'

interface LocationBannerProps {
  cityName: string | null
  lastUpdateTime?: string
}

export function LocationBanner({ cityName, lastUpdateTime }: LocationBannerProps) {
  return (
    <section className="dq-location">
      <div className="dq-location-text">
        <strong>Your Location:</strong> {cityName ?? '—'}
      </div>
      <div className="dq-updated">Last updated: {formatUpdatedLabel(lastUpdateTime)}</div>
    </section>
  )
}
