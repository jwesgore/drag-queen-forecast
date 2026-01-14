import { getDailyPhrase, getEmojiForCode, DraggifyNameOfDay, DraggifyWeatherCode } from '../../helpers/DragHelper'
import type { DailyForecastItem } from '../../helpers/WeatherHelper'
import './ExtendedForecast.css'

interface ExtendedForecastProps {
  daily: DailyForecastItem[]
}

export function ExtendedForecast({ daily }: ExtendedForecastProps) {
  if (daily.length === 0) return null

  // Find tomorrow's index by comparing dates
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const tomorrowIndex = daily.findIndex(d => {
    const forecastDate = new Date(d.date)
    forecastDate.setHours(0, 0, 0, 0)
    return forecastDate.getTime() === tomorrow.getTime()
  })

  const startIndex = tomorrowIndex !== -1 ? tomorrowIndex : 1

  return (
    <section className="dq-extended">
      <h2>Extended Shade Forecast</h2>
      <div className="dq-forecast-grid">
        {daily.slice(startIndex, startIndex + 3).map((d, i) => (
          <div className="dq-forecast-tile" key={`d-${i}`}>
            <div className="dq-forecast-day">
              {DraggifyNameOfDay(d.date.getDay())}
            </div>
            <div className="dq-forecast-body">
              <div className="dq-forecast-emoji">
                {getEmojiForCode(d.weatherCode)}
              </div>
              <div className="dq-forecast-text">
                {getDailyPhrase(Math.round(d.highF), d.weatherCode)}
              </div>
              <div className="dq-forecast-temps">{Math.round(d.highF)}° / {Math.round(d.lowF)}°F</div>
              <div className="dq-forecast-detail">
                {DraggifyWeatherCode(d.weatherCode)}
              </div>
              <div className="dq-forecast-footer">
                Dress accordingly, diva.
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
