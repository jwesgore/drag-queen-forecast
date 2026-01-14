import { getEmojiForCode, DraggifyNameOfDay } from '../../helpers/DragHelper'
import type { DailyForecastItem } from '../../helpers/WeatherHelper'
import './WeeklyForecast.css'

interface WeeklyForecastProps {
  daily: DailyForecastItem[]
}

export function WeeklyForecast({ daily }: WeeklyForecastProps) {
  if (daily.length === 0) {
    return null
  }

  return (
    <section className="dq-weekly">
      <div className="dq-weekly-grid">
        {daily.map((day, index) => (
          <div className="dq-weekly-card" key={index}>
            <div className="dq-weekly-date">
              {day.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </div>
            <div className="dq-weekly-day">{DraggifyNameOfDay(day.date.getDay())}</div>
            <div className="dq-weekly-emoji">{getEmojiForCode(day.weatherCode)}</div>
            <div className="dq-weekly-temps">
              <span className="dq-weekly-high">{Math.round(day.highF)}°</span>
              <span className="dq-weekly-divider">/</span>
              <span className="dq-weekly-low">{Math.round(day.lowF)}°</span>
            </div>
            <div className="dq-weekly-details">
              <div className="dq-weekly-precip">💧 {Math.round(day.precipitationProbability)}%</div>
              <div className="dq-weekly-humidity">💦 {Math.round(day.humidity)}%</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
