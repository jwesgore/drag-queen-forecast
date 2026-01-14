import { getEmojiForCode } from '../../helpers/DragHelper'
import './TodaysForecast.css'

interface TodaysForecastProps {
  weather: {
    temperature: number
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
      <h2>Today's Dragcast:</h2>
      
      {/* Large current temperature card */}
      <div className="dq-temp-card">
        <div className="dq-temp-emoji">{getEmojiForCode(weather.weathercode)}</div>
        <div className="dq-temp-display">{Math.round(weather.temperature)}°F</div>
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

      {/* Humidity and precipitation */}
      <div className="dq-conditions-grid">
        <div className="dq-condition-box">
          <div className="dq-condition-label">Humidity</div>
          <div className="dq-condition-value">{weather.humidity}%</div>
        </div>
        <div className="dq-condition-box">
          <div className="dq-condition-label">Chance of Rain</div>
          <div className="dq-condition-value">{weather.precipitationProbability}%</div>
        </div>
      </div>
    </section>
  )
}
