import { getEmojiForCode, DraggifyHumidity, DraggifyTemperature, DraggifyPrecipitation, DraggifyWindSpeed, DraggifyNameOfDay } from '../../helpers/DragHelper'
import { farToCel, mphToKph } from '../../helpers/UnitConversion'
import './TodaysForecast.css'

import { HourlyForecast } from './HourlyForecast';

interface TodaysForecastProps {
  weather: {
    temperature: number
    apparentTemperature: number
    weathercode: number
    humidity: number
    precipitationProbability: number
    windspeed: number
    hourly: Array<{ 
      temperatureF: number
      weatherCode: number
      precipitationProbability?: number
      time: Date 
    }>
    timezone?: string
  }
  unit: 'F' | 'C'
}

export function TodaysForecast({ weather, unit }: TodaysForecastProps) {
  const displayTemp = unit === 'F' ? Math.round(weather.temperature) : Math.round(farToCel(weather.temperature));
  const displayApparent = unit === 'F' ? Math.round(weather.apparentTemperature) : Math.round(farToCel(weather.apparentTemperature));
  const tempSymbol = unit === 'F' ? '°F' : '°C';
  const windValue = unit === 'F' ? Math.round(weather.windspeed) : Math.round(mphToKph(weather.windspeed));
  const windUnit = unit === 'F' ? 'mph' : 'kph';
  const hour = new Date().getHours()
  const isDay = hour >= 6 && hour < 18

  return (
    <section className="dq-today">
      {/* Large current temperature card */}
      <div className={`dq-temp-card ${isDay ? 'dq-day' : 'dq-night'}`}>
        <div className="dq-temp-left">
          <div className="dq-temp-greeting">Happy {DraggifyNameOfDay(new Date().getDay())}</div>
          <div className="dq-temp-emoji">{getEmojiForCode(weather.weathercode)}</div>
          <div className="dq-temp-display">{displayTemp}{tempSymbol}</div>
          <div className="dq-temp-feels-like">
            <span className="dq-temp-feels-label">Emotionally: {displayApparent}{tempSymbol}</span>
            <span className="dq-temp-feels-desc">{DraggifyTemperature(weather.apparentTemperature)}</span>
          </div>
        </div>
      </div>

      {/* Humidity, Precipitation, and Wind Speed cards */}
      <div className="dq-detail-cards">
        <div className="dq-detail-card">
          <span className="dq-detail-card-label">Moisture Levels</span>
          <span className="dq-detail-card-value">{weather.humidity}%</span>
          <span className="dq-detail-card-desc">{DraggifyHumidity(weather.humidity)}</span>
        </div>
        <div className="dq-detail-card">
          <span className="dq-detail-card-label">Chance of Precip</span>
          <span className="dq-detail-card-value">{weather.precipitationProbability}%</span>
          <span className="dq-detail-card-desc">{DraggifyPrecipitation(weather.precipitationProbability)}</span>
        </div>
        <div className="dq-detail-card">
          <span className="dq-detail-card-label">Wind Speed</span>
          <span className="dq-detail-card-value">{windValue} {windUnit}</span>
          <span className="dq-detail-card-desc">{DraggifyWindSpeed(weather.windspeed)}</span>
        </div>
      </div>

      {/* 12-hour forecast cards */}
      <HourlyForecast hourly={weather.hourly} unit={unit} tempSymbol={tempSymbol} timezone={weather.timezone} />
    </section>
  )
}
