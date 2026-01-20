
import { getEmojiForCode, DraggifyNameOfDay } from '../helpers/DragHelper';
import { farToCel } from '../helpers/UnitConversion';
import type { DailyForecastItem } from '../helpers/WeatherHelper';
import './WeeklyForecast.css';

interface WeeklyForecastProps {
  daily: DailyForecastItem[];
  unit: 'F' | 'C';
}

export function WeeklyForecast({ daily, unit }: WeeklyForecastProps) {
  if (daily.length === 0) {
    return null;
  }

  const tempSymbol = unit === 'F' ? '°F' : '°C';

  return (
    <section className="dq-weekly">
      <div className="dq-weekly-grid">
        {daily.map((day, index) => {
          const high = unit === 'F' ? Math.round(day.highF) : Math.round(farToCel(day.highF));
          const low = unit === 'F' ? Math.round(day.lowF) : Math.round(farToCel(day.lowF));
          return (
            <div className="dq-weekly-card" key={index}>
              <div className="dq-weekly-date">
                {day.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </div>
              <div className="dq-weekly-day">{DraggifyNameOfDay(day.date.getDay())}</div>
              <div className="dq-weekly-emoji">{getEmojiForCode(day.weatherCode)}</div>
              <div className="dq-weekly-temps">
                <span className="dq-weekly-high">{high}{tempSymbol}</span>
                <span className="dq-weekly-divider">/</span>
                <span className="dq-weekly-low">{low}{tempSymbol}</span>
              </div>
              <div className="dq-weekly-details">
                <div className="dq-weekly-precip">💧 {Math.round(day.precipitationProbability)}%</div>
                <div className="dq-weekly-humidity">💦 {Math.round(day.humidity)}%</div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
