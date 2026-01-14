import { formatUpdatedLabel } from '../helpers/DragHelper'
import './LocationBanner.css'

interface LocationBannerProps {
  cityName: string | null
  lastUpdateTime?: string
}

export function LocationBanner({ cityName, lastUpdateTime }: LocationBannerProps) {
  return (
    <section className="dq-location">
      <strong>Your Location:</strong> {cityName ?? '—'} • Last updated: {formatUpdatedLabel(lastUpdateTime)}
    </section>
  )
}
