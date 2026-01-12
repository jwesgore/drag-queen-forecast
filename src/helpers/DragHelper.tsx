import type { CurrentWeather, DailyForecastItem } from './WeatherHelper'

// WMO weather code checkers for sassy messages
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

