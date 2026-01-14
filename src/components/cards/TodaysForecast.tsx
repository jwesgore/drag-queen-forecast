import { getEmojiForCode } from '../../helpers/DragHelper'
import './TodaysForecast.css'

interface TodaysForecastProps {
  weather: {
    temperature: number
    apparentTemperature: number
    weathercode: number
    humidity: number
    precipitationProbability: number
    hourly: Array<{ 
      temperatureF: number
      weatherCode: number
      precipitationProbability?: number
      time: Date 
    }>
  }
}

export function TodaysForecast({ weather }: TodaysForecastProps) {
  return (
    <section className="dq-today">
      {/* Large current temperature card */}
      <div className="dq-temp-card">
        <div className="dq-temp-left">
          <div className="dq-temp-emoji">{getEmojiForCode(weather.weathercode)}</div>
          <div className="dq-temp-display">{Math.round(weather.temperature)}°F</div>
        </div>
        <div className="dq-temp-divider"></div>
        <div className="dq-temp-right">
          <div className="dq-temp-detail">
            <span className="dq-temp-detail-label">Feels Like</span>
            <span className="dq-temp-detail-value">{Math.round(weather.apparentTemperature)}°F</span>
          </div>
          <div className="dq-temp-detail">
            <span className="dq-temp-detail-label">Humidity</span>
            <span className="dq-temp-detail-value">{weather.humidity}%</span>
          </div>
          <div className="dq-temp-detail">
            <span className="dq-temp-detail-label">Precipitation</span>
            <span className="dq-temp-detail-value">{weather.precipitationProbability}%</span>
          </div>
        </div>
      </div>

      {/* 12-hour forecast cards */}
      <div className="dq-hourly-section">
        <h3>Next 12 Hours</h3>
        <div className="dq-hourly-scroll">
          {weather.hourly.map((hour, i) => (
            <div className="dq-hourly-card" key={`h-${i}`}>
              <div className="dq-hourly-time">
                {hour.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
              <div className="dq-hourly-emoji">{getEmojiForCode(hour.weatherCode)}</div>
              <div className="dq-hourly-temp">{Math.round(hour.temperatureF)}°</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
