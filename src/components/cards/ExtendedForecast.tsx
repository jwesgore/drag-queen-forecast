import { getDailyPhrase, getEmojiForCode } from '../../helpers/DragHelper'
import type { DailyForecastItem } from '../../helpers/WeatherHelper'
import './ExtendedForecast.css'

interface ExtendedForecastProps {
  daily: DailyForecastItem[]
}

export function ExtendedForecast({ daily }: ExtendedForecastProps) {
  if (daily.length === 0) return null

  return (
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
  )
}
