import './HourlyForecast.css';
import { getEmojiForCode } from '../../helpers/DragHelper';
import { isSnow } from '../../helpers/WeatherHelper';
import { farToCel } from '../../helpers/UnitConversion';

interface HourlyForecastProps {
  hourly: Array<{
    temperatureF: number;
    weatherCode: number;
    precipitationProbability?: number;
    time: Date;
  }>;
  unit: 'F' | 'C';
  tempSymbol: string;
  timezone?: string;
}

export function HourlyForecast({ hourly, unit, tempSymbol, timezone }: HourlyForecastProps) {
  return (
    <div className="dq-hourly-section">
      <h3>Next 12 Hours</h3>
      <div className="dq-hourly-scroll">
        {hourly.map((hour, i) => {
          const hourTemp = unit === 'F' ? Math.round(hour.temperatureF) : Math.round(farToCel(hour.temperatureF));
          const hourDate = hour.time instanceof Date ? hour.time : new Date(hour.time);
          const hourHour = hourDate.getHours();
          const isNight = hourHour < 6 || hourHour >= 18;
          return (
            <div className="dq-hourly-card" key={`h-${i}`}>
              <div className="dq-hourly-time">
                {hour.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', timeZone: timezone })}
              </div>
              <div className="dq-hourly-emoji">{getEmojiForCode(hour.weatherCode, { date: hourDate, isNight })}</div>
              <div className="dq-hourly-bottom">
                <div className="dq-hourly-temp">{hourTemp}{tempSymbol}</div>
                {hour.precipitationProbability !== undefined && (
                  <div className="dq-hourly-precip">
                    {isSnow(hour.weatherCode) ? (
                      <img src="/snowflake.png" alt="snow" className="dq-precip-icon" />
                    ) : (
                      <img src='/raindrop.png' alt="rain" className="dq-precip-icon" />
                    )} {Math.round(hour.precipitationProbability)}%
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
