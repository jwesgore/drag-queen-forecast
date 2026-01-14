import type { CurrentWeather, DailyForecastItem } from './WeatherHelper'
import {
	RainCode,
	SnowCode,
	ThunderstormCode,
	CloudCode,
	isRain,
	isSnow,
	isThunderstorm,
	isFog,
	isCloud,
} from './WeatherHelper'

// Legacy functions for backwards compatibility
export const isRainy = (code: number) => [51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)
export const isStormy = (code: number) => [95, 96, 99].includes(code)

// Map WMO weather codes to emoji
export const getEmojiForCode = (code: number): string => {
	if (isStormy(code)) return '⛈️'
	if (isRainy(code)) return '🌧️'
	if ([45, 48].includes(code)) return '🌫️'
	if ([0, 1].includes(code)) return '☀️'
	if ([2, 3].includes(code)) return '⛅'
	if ([71, 73, 75, 77, 85, 86].includes(code)) return '❄️'
	return '✨'
}

type CurrentLike = Pick<CurrentWeather, 'temperatureF' | 'weatherCode'> | { temperature: number; weathercode: number }

// Generate 4 sassy forecast messages based on temp + weather code
export function getDragMessages(current: CurrentLike): string[] {
	const temp = (current as any).temperatureF ?? (current as any).temperature
	const code = (current as any).weatherCode ?? (current as any).weathercode

	const msgs: string[] = []
	// Temperature vibe
	if (temp >= 90) msgs.push('Hotter Than a Tucked Behind')
	else if (temp >= 80) msgs.push('Your Wig is Melting, Sis')
	else if (temp <= 45) msgs.push('Serving Frozen Eleganza, Bundle Up')
	else msgs.push('Cute & Comfy, Queen')

	// Weather conditions
	if (isStormy(code)) msgs.push('Thunder & Drama Incoming')
	else if (isRainy(code)) msgs.push("Humidity So High It's Giving Frizz")
	else msgs.push('Flawless, No Rain — Werk!')

	// Comfort level
	if (temp >= 88) msgs.push('Sweating Like a Sinner in Church')
	else msgs.push('Keep It Cute, Hydrate')

	// Makeup advice
	if (temp >= 92 || isRainy(code)) msgs.push('Makeup Meltdown Realness')
	else msgs.push('Beat Stays Put, Diva')
	return msgs.slice(0, 4)
}

// Single phrase for daily forecast tile
export function getDailyPhrase(highF: number, code: number): string {
	if (isStormy(code)) return 'Possible Thunder & Drama'
	if (isRainy(code)) return "Humidity So High It's Giving Frizz"
	if (highF >= 90) return 'Still a Sweaty Mess, Hunty'
	if (highF <= 50) return 'Chilly Tea — Layer Up'
	return 'Serving Pleasant Realness'
}

// Helper to format daily item for UI (unused but available)
export function toDailyTile(d: DailyForecastItem) {
	return {
		dayLabel: d.date.toLocaleDateString([], { weekday: 'long' }),
		emoji: getEmojiForCode(d.weatherCode),
		text: getDailyPhrase(Math.round(d.highF), d.weatherCode),
		temps: `${Math.round(d.highF)}° / ${Math.round(d.lowF)}°F`,
	}
}

// Format time since weather was last updated (e.g., "5 minutes ago")
export function formatUpdatedLabel(iso?: string): string {
	if (!iso) return '—'
	const d = new Date(iso)
	const diffMs = Date.now() - d.getTime()
	const mins = Math.floor(diffMs / 60000)
	const hrs = Math.floor(mins / 60)
	const days = Math.floor(hrs / 24)
	if (mins < 1) return 'Just now'
	if (mins < 60) return `${mins} minute${mins === 1 ? '' : 's'} ago`
	if (hrs < 24) return `${hrs} hour${hrs === 1 ? '' : 's'} ago`
	return `${days} day${days === 1 ? '' : 's'} ago`
}

// Get the name of the day in drag
export function DraggifyNameOfDay(dayOfWeek: number): string {
	switch (dayOfWeek) {
		case 0: return "Serve Sunday"
		case 1: return "Mugshot Monday"
		case 2: return "Tuck Tuesday"
		case 3: return "Wig Out Wednesday"
		case 4: return "Thirsty Thursday"
		case 5: return "Fierce Friday"
		case 6: return "Slay Saturday"
		default: return "Diva Down: 101"
	}
}

// Get the temperature description in drag
export function DraggifyTemperature(tempF: number): string {
  if (tempF >= 105) return "Melted Wig Emergency"
  if (tempF >= 100) return "Scorching Sashay"
  if (tempF >= 95)  return "Sizzling Stiletto"
  if (tempF >= 90)  return "Sweaty but Serving"
  if (tempF >= 85)  return "Balmy Boa"
  if (tempF >= 80)  return "Summer Slay"
  if (tempF >= 75)  return "Perfectly Padded"
  if (tempF >= 70)  return "Mild but Mugged"
  if (tempF >= 65)  return "Light Jacket, Heavy Beat"
  if (tempF >= 60)  return "Crisp Chiffon"
  if (tempF >= 55)  return "Cool Contour"
  if (tempF >= 50)  return "Foundation Cracking"
  if (tempF >= 45)  return "Shivering in Sequins"
  if (tempF >= 40)  return "Cold but Couture"
  if (tempF >= 35)  return "Frosted Lashes"
  if (tempF >= 30)  return "Icy Eleganza"
  if (tempF >= 25)  return "Frozen but Fashion"
  if (tempF >= 20)  return "Snowed-In Showgirl"
  if (tempF >= 15)  return "Hypothermic Realness"
  if (tempF >= 10)  return "Arctic Beat"
  if (tempF >= 0)   return "Polar Vortex, Diva"
  return "Freezing Feathered Fan"
}

export function DraggifyWeatherCode(code: number): string {
	if (isThunderstorm(code)) return "Thunder & Drama, Hunty"
	if (isSnow(code)) return getDragSnowDescription(code)
	if (isRain(code)) return getDragRainDescription(code)
	if (isFog(code)) return "Foggy Face Beat"
	if (isCloud(code)) return getDragCloudDescription(code)
	return "Mystery Mood"
}

// Get drag description for rain intensity
export function getDragRainDescription(code: number): string {
	if ([RainCode.LightDrizzle, RainCode.ModerateDrizzle, RainCode.DenseDrizzle].includes(code as never)) {
		return "Oh relax, it's just a drizzle"
	}
	if ([RainCode.SlightRain, RainCode.SlightRainShower].includes(code as never)) {
		return "Waterproof makeup exists for a reason, darling"
	}
	if ([RainCode.ModerateRain, RainCode.ModerateRainShower].includes(code as never)) {
		return "Runny makeup is a serve, sweetie"
	}
	if ([RainCode.HeavyRain, RainCode.ViolentRainShower].includes(code as never)) {
		return "It's raining cats and dogs, hunty"
	}
	return "Rainy Day Makeup Breakdown"
}

// Get drag description for snow intensity
export function getDragSnowDescription(code: number): string {
	if ([SnowCode.SlightSnow, SnowCode.SlightSnowShower].includes(code as never)) {
		return "I've seen bigger dustings in the dressing room"
	}
	if (code === SnowCode.ModerateSnow) {
		return "Leave the stiletto at home, it's a bit extra out there"
	}
	if ([SnowCode.HeavySnow, SnowCode.HeavySnowShower].includes(code as never)) {
		return "Bust out the fur and boots, it's a snowstorm!"
	}
	if (code === SnowCode.SnowGrains) {
		return "It's cute but it ain't sticking, sugar"
	}
	return "Snowy Slayage"
}

// Get drag description for cloud coverage
export function getDragCloudDescription(code: number): string {
	switch (code) {
		case CloudCode.ClearSky:
			return "Clear Skies, Snatched Lashes"
		case CloudCode.MainlyClear:
			return "Mostly Clear, Major Slay"
		case CloudCode.PartlyCloudy:
			return "Partly Cloudy, Still Serving"
		case CloudCode.Overcast:
			return "Overcast but Overqualified"
		default:
			return "Cloudy with a Chance of Drama"
	}
}

// Get drag description for thunderstorm intensity
export function getDragThunderstormDescription(code: number): string {
	switch (code) {
		case ThunderstormCode.Slight:
			return "Rumbling for Attention"
		case ThunderstormCode.SlightHail:
			return "Hail, But Make It Fashion"
		case ThunderstormCode.HeavyHail:
			return "Category 5 Chaos"
		default:
			return "Atmospheric Menace"
	}
}