// User coordinates from browser geolocation
export interface Coordinates {
  lat: number
  lon: number
}

export interface LocationResult {
  name: string
  latitude: number
  longitude: number
  country: string
  admin1?: string
}

// US state abbreviation → name map
const STATE_MAP: Record<string, string> = {
  al: 'alabama',
  ak: 'alaska',
  az: 'arizona',
  ar: 'arkansas',
  ca: 'california',
  co: 'colorado',
  ct: 'connecticut',
  de: 'delaware',
  fl: 'florida',
  ga: 'georgia',
  hi: 'hawaii',
  id: 'idaho',
  il: 'illinois',
  in: 'indiana',
  ia: 'iowa',
  ks: 'kansas',
  ky: 'kentucky',
  la: 'louisiana',
  me: 'maine',
  md: 'maryland',
  ma: 'massachusetts',
  mi: 'michigan',
  mn: 'minnesota',
  ms: 'mississippi',
  mo: 'missouri',
  mt: 'montana',
  ne: 'nebraska',
  nv: 'nevada',
  nh: 'new hampshire',
  nj: 'new jersey',
  nm: 'new mexico',
  ny: 'new york',
  nc: 'north carolina',
  nd: 'north dakota',
  oh: 'ohio',
  ok: 'oklahoma',
  or: 'oregon',
  pa: 'pennsylvania',
  ri: 'rhode island',
  sc: 'south carolina',
  sd: 'south dakota',
  tn: 'tennessee',
  tx: 'texas',
  ut: 'utah',
  vt: 'vermont',
  va: 'virginia',
  wa: 'washington',
  wv: 'west virginia',
  wi: 'wisconsin',
  wy: 'wyoming',
}

// Request user's current location via browser geolocation API
export const getUserLocation = (): Promise<Coordinates> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'))
      return
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({ lat: position.coords.latitude, lon: position.coords.longitude })
      },
      (err) => {
        reject(new Error(err.message))
      }
    )
  })
}

// Search for locations by city name, optionally filtered by state
export const searchLocations = async (query: string): Promise<LocationResult[]> => {
  try {
    // Parse "City, State" format
    const parts = query.split(',').map(p => p.trim())
    const cityName = parts[0]
    const rawState = parts[1]?.toLowerCase()

    const normalizedState =
      rawState && STATE_MAP[rawState]
        ? STATE_MAP[rawState]
        : rawState

    // Search by city only — Open-Meteo behaves better this way
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
      cityName
    )}&count=10&language=en&country=US`

    const response = await fetch(url)
    const data = await response.json()

    let results: LocationResult[] =
      data.results?.map((result: any) => ({
        name: result.name,
        latitude: result.latitude,
        longitude: result.longitude,
        country: result.country,
        admin1: result.admin1,
      })) ?? []

    // Client-side state filtering if state was provided
    if (normalizedState) {
      results = results.filter(
        r => r.admin1?.toLowerCase().includes(normalizedState)
      )
    }

    return results
  } catch (err) {
    console.error('Failed to search locations:', err)
    return []
  }
}
