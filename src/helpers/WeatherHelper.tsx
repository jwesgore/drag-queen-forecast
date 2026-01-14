import { fetchWeatherApi } from 'openmeteo'

// Current conditions
export interface CurrentWeather {
  temperatureF: number
  windSpeedMph: number
  weatherCode: number
  isDay: boolean
  time: Date
  humidity: number
  precipitationProbability?: number
}

// Hourly forecast item (12 items by default)
export interface HourlyForecastItem {
  time: Date
  temperatureF: number
  weatherCode: number
  windSpeedMph: number
  precipitationProbability?: number
}

// Daily forecast item (5 items by default)
export interface DailyForecastItem {
  date: Date
  weatherCode: number
  highF: number
  lowF: number
}

// Reverse geocode lat/lon to city name using BigDataCloud
export const fetchCityName = async (
  lat: number,
  lon: number
): Promise<string | null> => {
  try {
    const response = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
    )

    if (!response.ok) {
      throw new Error('Failed to fetch city name')
    }

    const data = await response.json()
    const city = data.city || data.locality || 'Unknown'
    const state = data.principalSubdivisionCode?.split('-')[1] || ''
    return state ? `${city}, ${state}` : city
  } catch (err) {
    console.error('Error fetching city name:', err)
    return null
  }
}

// Get current conditions from Open-Meteo
export const fetchWeather = async (
  lat: number,
  lon: number
): Promise<CurrentWeather> => {
  const url = 'https://api.open-meteo.com/v1/forecast'
  const params = {
    latitude: lat,
    longitude: lon,
    current: ['temperature_2m', 'is_day', 'weather_code', 'wind_speed_10m', 'relative_humidity_2m', 'precipitation_probability'],
    temperature_unit: 'fahrenheit',
    wind_speed_unit: 'mph',
    timeformat: 'unixtime',
  }

  const responses = await fetchWeatherApi(url, params)
  const response = responses[0]
  const current = response.current()

  if (!current) {
    throw new Error('No current weather data available')
  }

  const utcOffsetSeconds = response.utcOffsetSeconds()
  const timestampMs = (Number(current.time()) + utcOffsetSeconds) * 1000

  const tempVar = current.variables(0)
  const isDayVar = current.variables(1)
  const codeVar = current.variables(2)
  const windVar = current.variables(3)
  const humidityVar = current.variables(4)
  const popVar = current.variables(5)

  if (!tempVar || !isDayVar || !codeVar || !windVar || !humidityVar) {
    throw new Error('Unexpected current weather payload')
  }

  const temperatureF = tempVar.value()
  const isDayValue = isDayVar.value()
  const weatherCode = codeVar.value()
  const windSpeedMph = windVar.value()
  const humidity = humidityVar.value()
  const precipitationProbability = popVar?.value()

  return {
    temperatureF,
    windSpeedMph,
    weatherCode,
    isDay: Boolean(isDayValue),
    time: new Date(timestampMs),
    humidity,
    precipitationProbability,
  }
}

// Get hourly forecast from Open-Meteo
export const fetchHourlyForecast = async (
  lat: number,
  lon: number,
  hours = 12
): Promise<HourlyForecastItem[]> => {
  const url = 'https://api.open-meteo.com/v1/forecast'
  const params = {
    latitude: lat,
    longitude: lon,
    hourly: ['temperature_2m', 'weather_code', 'wind_speed_10m', 'precipitation_probability'],
    temperature_unit: 'fahrenheit',
    wind_speed_unit: 'mph',
    timeformat: 'unixtime',
    forecast_hours: hours,
  }

  const responses = await fetchWeatherApi(url, params)
  const response = responses[0]
  const hourly = response.hourly()
  if (!hourly) throw new Error('No hourly forecast available')

  const utcOffsetSeconds = response.utcOffsetSeconds()
  const start = Number(hourly.time())
  const interval = hourly.interval()

  const tempVar = hourly.variables(0)
  const codeVar = hourly.variables(1)
  const windVar = hourly.variables(2)
  const popVar = hourly.variables(3)

  const temps = tempVar?.valuesArray()
  const codes = codeVar?.valuesArray()
  const winds = windVar?.valuesArray()
  const pops = popVar?.valuesArray()

  if (!temps || !codes || !winds) {
    throw new Error('Unexpected hourly forecast payload')
  }

  const len = Math.min(hours, temps.length)
  const items: HourlyForecastItem[] = Array.from({ length: len }, (_, i) => {
    const ts = (start + i * interval + utcOffsetSeconds) * 1000
    return {
      time: new Date(ts),
      temperatureF: temps[i],
      weatherCode: codes[i],
      windSpeedMph: winds[i],
      precipitationProbability: pops ? pops[i] : undefined,
    }
  })

  return items
}

// Get daily forecast from Open-Meteo
export const fetchDailyForecast = async (
  lat: number,
  lon: number,
  days = 5
): Promise<DailyForecastItem[]> => {
  const url = 'https://api.open-meteo.com/v1/forecast'
  const params = {
    latitude: lat,
    longitude: lon,
    daily: ['weather_code', 'temperature_2m_max', 'temperature_2m_min'],
    temperature_unit: 'fahrenheit',
    timeformat: 'unixtime',
    timezone: 'auto',
    forecast_days: days,
  }

  const responses = await fetchWeatherApi(url, params)
  const response = responses[0]
  const daily = response.daily()
  if (!daily) throw new Error('No daily forecast available')

  const utcOffsetSeconds = response.utcOffsetSeconds()
  const start = Number(daily.time())
  const interval = daily.interval()

  const codeVar = daily.variables(0)
  const maxVar = daily.variables(1)
  const minVar = daily.variables(2)

  const codes = codeVar?.valuesArray()
  const highs = maxVar?.valuesArray()
  const lows = minVar?.valuesArray()

  if (!codes || !highs || !lows) {
    throw new Error('Unexpected daily forecast payload')
  }

  const len = Math.min(days, codes.length)
  const items: DailyForecastItem[] = Array.from({ length: len }, (_, i) => {
    const ts = (start + i * interval + utcOffsetSeconds) * 1000
    return {
      date: new Date(ts),
      weatherCode: codes[i],
      highF: highs[i],
      lowF: lows[i],
    }
  })

  return items
}

// Gets the weather description based on the provided weather code
export const getWeatherDescription = (code: number): string => {
  const weatherCodes: { [key: number]: string } = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Foggy',
    48: 'Depositing rime fog',
    51: 'Light drizzle',
    53: 'Moderate drizzle',
    55: 'Dense drizzle',
    61: 'Slight rain',
    63: 'Moderate rain',
    65: 'Heavy rain',
    71: 'Slight snow',
    73: 'Moderate snow',
    75: 'Heavy snow',
    77: 'Snow grains',
    80: 'Slight rain showers',
    81: 'Moderate rain showers',
    82: 'Violent rain showers',
    85: 'Slight snow showers',
    86: 'Heavy snow showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm with slight hail',
    99: 'Thunderstorm with heavy hail',
  }
  return weatherCodes[code] || 'Unknown'
}

export interface ForecastBundle {
  current: CurrentWeather
  daily: DailyForecastItem[]
  hourly?: HourlyForecastItem[]
}

export const fetchForecastBundle = async (
  lat: number,
  lon: number,
  days = 5,
  hours = 12
): Promise<ForecastBundle> => {
  const [current, daily, hourly] = await Promise.all([
    fetchWeather(lat, lon),
    fetchDailyForecast(lat, lon, days),
    fetchHourlyForecast(lat, lon, hours),
  ])
  return { current, daily, hourly }
}