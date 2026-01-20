import type { CurrentWeather, DailyForecastItem } from './WeatherHelper'
import {
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
	if (isThunderstorm(code)) return '⛈️'
	if (isRain(code)) return '🌧️'
	if (isFog(code)) return '🌫️'
	if (isCloud(code) && code <= 1) return '☀️'
	if (isCloud(code)) return '⛅'
	if (isSnow(code)) return '❄️'
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
	if (isThunderstorm(code)) msgs.push('Thunder & Drama Incoming')
	else if (isRain(code)) msgs.push("Humidity So High It's Giving Frizz")
	else msgs.push('Flawless, No Rain — Werk!')

	// Comfort level
	if (temp >= 88) msgs.push('Sweating Like a Sinner in Church')
	else msgs.push('Keep It Cute, Hydrate')

	// Makeup advice
	if (temp >= 92 || isRain(code)) msgs.push('Makeup Meltdown Realness')
	else msgs.push('Beat Stays Put, Diva')
	return msgs.slice(0, 4)
}

// Single phrase for daily forecast tile — max serve, short & shady
export function getDailyPhrase(highF: number, code: number): string {
  // Prioritize the drama queens first
  if (isThunderstorm(code)) return "Thunder & Drama Alert, Hunty — Secure the Wig!";
  if (isRain(code)) return "Rainy Mess Incoming, Waterproof the Beat";
  
  // Snow gets its own spotlight (common in MO winters)
  if (isSnow(code)) return "Snowy Slay or Flurry Shade — Edges on Alert";
  
  // Temp tiers with escalating reads
  if (highF >= 95) return "Scorching Day Ahead, Melted Wig Emergency";
  if (highF >= 90) return "Still a Sweaty Serve, Glow-Up by Force";
  if (highF >= 80) return "Summer Slay Vibes in Winter? Werk!";
  if (highF >= 65) return "Pleasant Realness, Snatched & Comfortable";
  if (highF >= 50) return "Chilly Tea, Layer Up Sis";
  if (highF >= 40) return "Cold but Couture, Shiver in Sequins";
  return "Polar Vortex Realness, Hypothermic Hunty — Bundle Up!";
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
	if (mins < 60) return `${mins} min${mins === 1 ? '' : 's'} ago`
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

export function DraggifyTemperature(tempF: number): string {
  if (tempF >= 105) return "Melted Wig Emergency, call the fire marshal sis!";
  if (tempF >= 100) return "Scorching Sashay, the pavement is serving hot plate!";
  if (tempF >= 95)  return "Sizzling Stiletto, heels melting face glistening!";
  if (tempF >= 90)  return "Sweaty but SERVING, glow-up by force hunty!";
  if (tempF >= 85)  return "Balmy Boa, constricting but make it sexy";
  if (tempF >= 80)  return "Summer Slay szn, full beat no mercy";
  if (tempF >= 75)  return "Perfectly Padded, curves popping no sweat";
  if (tempF >= 70)  return "Mild but MUGGED, soft serve snatched edges";
  if (tempF >= 65)  return "Light Jacket Heavy Beat, layers for the drama";
  if (tempF >= 60)  return "Crisp Chiffon, breezy elegant unbothered";
  if (tempF >= 55)  return "Cool Contour, cheekbones cutting glass";
  if (tempF >= 50)  return "Foundation Cracking, time to set that bake queen";
  if (tempF >= 45)  return "Shivering in Sequins, sparkle through the pain";
  if (tempF >= 40)  return "Cold but Couture, serving frozen runway";
  if (tempF >= 35)  return "Frosted Lashes, icy queen energy";
  if (tempF >= 30)  return "Icy Eleganza, werk that chill diva";
  if (tempF >= 25)  return "Frozen but Fashion, the tundra is your stage";
  if (tempF >= 20)  return "Snowed-In Showgirl, trapped but still tipping";
  if (tempF >= 15)  return "Hypothermic Realness, tuck and shiver hunty";
  if (tempF >= 10)  return "Arctic Beat Drop, face frozen in fierce";
  if (tempF >= 0)   return "Polar Vortex Diva, Mother Nature is reading";
  return "Freezing Feathered Fan, cryogenic couture we are DONE";
}

export function DraggifyCloud(code: number): string {
  switch (code) {
    case 1: return "Mainly Clear, just a little garnish on that perfect sky";
    case 2: return "Partly Cloudy, serving scattered shade still fierce";
    case 3: return "Overcast but Overqualified, the sky is giving full coverage foundation";
    default: return "Cloudy with a Chance of Drama";
  }
}

export function DraggifyDrizzle(code: number): string {
  if (code === 51) return "Light Drizzle, just enough to test your setting spray";
  if (code === 53) return "Moderate Drizzle, edges starting to revolt";
  if (code === 55) return "Dense Drizzle, full frizz alert sis!";
  if (code === 56) return "Light Freezing Drizzle, icy tea being spilled";
  if (code === 57) return "Dense Freezing Drizzle, skating on thin ice literally";
  return "Drizzle Drama, subtle but shady";
}

export function DraggifyRain(code: number): string {
  if (code === 61) return "Slight Rain, a gentle mist waterproof the mug";
  if (code === 63) return "Moderate Rain, foundation sliding but we're still serving";
  if (code === 65) return "Heavy Rain, full meltdown lashes lifting!";
  if (code === 66) return "Light Freezing Rain, ice queen realness but slippery";
  if (code === 67) return "Heavy Freezing Rain, frozen couture catastrophe";
  if (code === 80) return "Slight Rain Showers, popup drama";
  if (code === 81) return "Moderate Rain Showers, surprise wet tshirt contest";
  if (code === 82) return "Violent Rain Showers, biblical downpour find shelter hunty!";
  return "Rainy Day Makeup Breakdown, tuck the edges!";
}

export function DraggifySnow(code: number): string {
  if (code === 71) return "Slight Snow Fall, light dusting barely enough to powder the face";
  if (code === 73) return "Moderate Snow, soft fluffy and lowkey chaotic";
  if (code === 75) return "Heavy Snow Fall, Siberian realness bust out the fur!";
  if (code === 77) return "Snow Grains, cute but it ain't sticking sugar";
  if (code === 85) return "Slight Snow Showers, flirty flurries";
  if (code === 86) return "Heavy Snow Showers, full snowstorm slay secure the wig!";
  return "Snowy Slayage, frozen fantasy on the runway";
}

export function DraggifyThunderstorm(code: number): string {
  if (code === 95) return "Thunderstorm Slight/Moderate, rumbling for attention diva!";
  if (code === 96) return "Thunderstorm with Slight Hail, hail but make it fashion";
  if (code === 99) return "Thunderstorm with Heavy Hail, Category 5 Chaos RUNNNNN!";
  return "Atmospheric Menace, the gods are throwing full shade!";
}

export function DraggifyHumidity(humidity: number): string {
  if (humidity >= 85) return "FRIZZ APOCALYPSE: the edges are GONE, sis";
  if (humidity >= 75) return "Satan's Sauna, hair is filing for divorce";
  if (humidity >= 68) return "Humidity said 'Not today, lace front!'";
  if (humidity >= 60) return "Dewy, moist, and problematic";
  if (humidity >= 50) return "Slightly snatched, mostly hydrated";
  if (humidity >= 42) return "The sweet spot, hair is giving ✨life✨";
  if (humidity >= 35) return "Matte finish, serving face, zero moisture mercy";
  if (humidity >= 25) return "Crispy edges, dry drama, bone-straight realness";
  if (humidity >= 15) return "Desert queen energy, the silk press is ETERNAL";
  return "Cracked lips & Sahara snatch, we are PARCHED";
}

export function DraggifyPrecipitation(percent: number): string {
  if (percent >= 90) return "Biblically accurate downpour, FIND SHELTER, BITCH";
  if (percent >= 80) return "Bring the clear umbrella, we're still serving looks in the flood";
  if (percent >= 65) return "It's giving wet & messy, tuck extra tight";
  if (percent >= 50) return "50/50 whether you're serving drowned rat or glowy dewy";
  if (percent >= 35) return "Spicy drizzle, just enough to ruin the edges";
  if (percent >= 20) return "Light tea, light rain, light shade";
  if (percent >= 10) return "Miss thing might spit a little, carry a tiny fan";
  if (percent > 0)  return "A single lonely drop, the drama is minimal";
  return "Dry as the reading challenges, ZERO chance, werk!";
}

export function DraggifyWindSpeed(mph: number): string {
  if (mph >= 50) return "WIG-SNATCHING CATEGORY 5 HUNTY, RUNNNNN";
  if (mph >= 40) return "Gale force giving full lace lift-off";
  if (mph >= 32) return "Hold the edges, clutch the pearls, secure the perimeter!";
  if (mph >= 25) return "Breezy enough to give you a free facelift";
  if (mph >= 18) return "Windy but still serving, hair on demon time";
  if (mph >= 12) return "Sassy little gusts, just enough to make you snatch";
  if (mph >= 7)  return "Gentle breeze giving soft butch realness";
  if (mph >= 3)  return "A whisper of wind, barely enough to move the drama";
  return "Air is unemployed, not even a single strand is moving";
}

// Master function to get drag description for any weather code
export function DraggifyWeatherCode(code: number): string {
  // Thunderstorms (95-99)
  if (isThunderstorm(code)) return DraggifyThunderstorm(code);
  
  // Rain (61-67, 80-82)
  if (isRain(code)) return DraggifyRain(code);
  
  // Drizzle (51-57)
  if ([51, 53, 55, 56, 57].includes(code)) return DraggifyDrizzle(code);
  
  // Snow (71-77, 85-86)
  if (isSnow(code)) return DraggifySnow(code);
  
  // Fog (45, 48)
  if (isFog(code)) return "Foggy Mystique, giving cryptic fashion fantasy";
  
  // Clouds (0-3)
  if (isCloud(code)) return DraggifyCloud(code);
  
  // Default for unknown codes
  return "Mother Nature is being MYSTERIOUS, hunty";
}