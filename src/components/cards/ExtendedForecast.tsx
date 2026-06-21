
import { getDailyPhrase, getEmojiForCode, DraggifyNameOfDay, DraggifyWeatherCode } from '../../helpers/DragHelper';
import { farToCel } from '../../helpers/UnitConversion';
import type { DailyForecastItem } from '../../helpers/WeatherHelper';
import './ExtendedForecast.css';

interface ExtendedForecastProps {
  daily: DailyForecastItem[];
  unit: 'F' | 'C';
}

export function ExtendedForecast({ daily, unit }: ExtendedForecastProps) {
  if (daily.length === 0) return null

  // Find tomorrow's index by comparing dates (use UTC since forecast dates are encoded as UTC-midnight = local-midnight)
  const now = new Date()
  const tomorrowUTC = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate() + 1)

  const tomorrowIndex = daily.findIndex(d => {
    const forecastUTC = Date.UTC(d.date.getUTCFullYear(), d.date.getUTCMonth(), d.date.getUTCDate())
    return forecastUTC === tomorrowUTC
  })

  const startIndex = tomorrowIndex !== -1 ? tomorrowIndex : 1

  const tempSymbol = unit === 'F' ? '°F' : '°C';
  return (
    <section className="dq-extended">
      <h2>Extended Shade Forecast</h2>
      <div className="dq-forecast-grid">
        {daily.slice(startIndex, startIndex + 3).map((d, i) => {
          const high = unit === 'F' ? Math.round(d.highF) : Math.round(farToCel(d.highF));
          const low = unit === 'F' ? Math.round(d.lowF) : Math.round(farToCel(d.lowF));
          const descHighF = Math.round(d.highF);
          return (
            <div className="dq-forecast-tile" key={`d-${i}`}>
              <div className="dq-forecast-day">
                {DraggifyNameOfDay(d.date.getUTCDay())}
              </div>
              <div className="dq-forecast-body">
                <div className="dq-forecast-emoji">
                  {getEmojiForCode(d.weatherCode)}
                </div>
                <div className="dq-forecast-text">
                  {getDailyPhrase(descHighF, d.weatherCode)}
                </div>
                <div className="dq-forecast-temps">{high}{tempSymbol} / {low}{tempSymbol}</div>
                <div className="dq-forecast-detail">
                  {DraggifyWeatherCode(d.weatherCode)}
                </div>
                <div className="dq-forecast-footer">
                  Dress accordingly, diva.
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  )
}
