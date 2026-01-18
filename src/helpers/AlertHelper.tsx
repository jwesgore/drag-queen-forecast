// NOAA Weather Alerts Helper
// Uses the free NOAA Weather.gov API for US locations

export interface WeatherAlert {
  id: string
  properties: {
    event: string
    headline: string
    description: string
    instruction: string
    severity: 'Extreme' | 'Severe' | 'Moderate' | 'Minor' | 'Unknown'
    urgency: 'Immediate' | 'Expected' | 'Future' | 'Past' | 'Unknown'
    effective: Date
    expires: Date
    senderName: string
    areaDesc: string
  }
}

export interface AlertResponse {
  alerts: WeatherAlert[]
  hasAlerts: boolean
  error?: string
}

/**
 * Fetch active weather alerts for a US location using NOAA Weather.gov API
 * @param lat - Latitude
 * @param lon - Longitude
 * @returns AlertResponse with alerts array and error handling
 */
export const fetchWeatherAlerts = async (
  lat: number,
  lon: number
): Promise<AlertResponse> => {
  try {
    // NOAA API endpoint for active alerts at a specific point
    const response = await fetch(
      `https://api.weather.gov/alerts/active?point=${lat},${lon}`,
      {
        headers: {
          'User-Agent': '(Drag Queen Forecast, contact@example.com)',
        },
      }
    )

    if (!response.ok) {
      console.warn(`NOAA API responded with status ${response.status}`)
      return { alerts: [], hasAlerts: false }
    }

    const data = await response.json()

    if (!data.features || data.features.length === 0) {
      return { alerts: [], hasAlerts: false }
    }

    // Transform NOAA GeoJSON features into our alert format
    const alerts: WeatherAlert[] = data.features.map(
      (feature: {
        id: string
        properties: {
          event: string
          headline: string
          description: string
          instruction: string
          severity: string
          urgency: string
          effective: string
          expires: string
          senderName: string
          areaDesc: string
        }
      }) => ({
        id: feature.id,
        properties: {
          event: feature.properties.event,
          headline: feature.properties.headline,
          description: feature.properties.description,
          instruction: feature.properties.instruction,
          severity: sanitizeSeverity(feature.properties.severity),
          urgency: sanitizeUrgency(feature.properties.urgency),
          effective: new Date(feature.properties.effective),
          expires: new Date(feature.properties.expires),
          senderName: feature.properties.senderName,
          areaDesc: feature.properties.areaDesc,
        },
      })
    )

    return { alerts, hasAlerts: alerts.length > 0 }
  } catch (err) {
    console.error('Error fetching weather alerts:', err)
    return {
      alerts: [],
      hasAlerts: false,
      error: err instanceof Error ? err.message : 'Unknown error fetching alerts',
    }
  }
}

/**
 * Get alerts filtered by severity level
 * @param alerts - Array of alerts to filter
 * @param minSeverity - Minimum severity level ('Extreme', 'Severe', 'Moderate', 'Minor')
 * @returns Filtered alerts
 */
export const filterAlertsBySeverity = (
  alerts: WeatherAlert[],
  minSeverity: 'Extreme' | 'Severe' | 'Moderate' | 'Minor' = 'Moderate'
): WeatherAlert[] => {
  const severityRank: { [key: string]: number } = {
    Extreme: 4,
    Severe: 3,
    Moderate: 2,
    Minor: 1,
    Unknown: 0,
  }

  const minRank = severityRank[minSeverity] || 0
  return alerts.filter((alert) => severityRank[alert.properties.severity] >= minRank)
}

/**
 * Get the most critical active alert
 * @param alerts - Array of alerts
 * @returns The most severe alert or undefined if no alerts
 */
export const getMostCriticalAlert = (alerts: WeatherAlert[]): WeatherAlert | undefined => {
  if (alerts.length === 0) return undefined

  const severityRank: { [key: string]: number } = {
    Extreme: 4,
    Severe: 3,
    Moderate: 2,
    Minor: 1,
    Unknown: 0,
  }

  return alerts.reduce((mostCritical, current) => {
    const currentRank = severityRank[current.properties.severity] || 0
    const mostCriticalRank = severityRank[mostCritical.properties.severity] || 0
    return currentRank > mostCriticalRank ? current : mostCritical
  })
}

/**
 * Check if any alert is currently active (between effective and expires time)
 * @param alert - Alert to check
 * @returns true if alert is currently active
 */
export const isAlertActive = (alert: WeatherAlert): boolean => {
  const now = new Date()
  return alert.properties.effective <= now && now <= alert.properties.expires
}

/**
 * Format alert for display
 * @param alert - Alert to format
 * @returns Formatted alert string
 */
export const formatAlertForDisplay = (alert: WeatherAlert): string => {
  const { event, severity, headline } = alert.properties
  return `${severity} - ${event}: ${headline}`
}

// Helper functions to sanitize API values
const sanitizeSeverity = (
  severity: string
): 'Extreme' | 'Severe' | 'Moderate' | 'Minor' | 'Unknown' => {
  const validSeverities = ['Extreme', 'Severe', 'Moderate', 'Minor', 'Unknown']
  return validSeverities.includes(severity)
    ? (severity as 'Extreme' | 'Severe' | 'Moderate' | 'Minor' | 'Unknown')
    : 'Unknown'
}

const sanitizeUrgency = (
  urgency: string
): 'Immediate' | 'Expected' | 'Future' | 'Past' | 'Unknown' => {
  const validUrgencies = ['Immediate', 'Expected', 'Future', 'Past', 'Unknown']
  return validUrgencies.includes(urgency)
    ? (urgency as 'Immediate' | 'Expected' | 'Future' | 'Past' | 'Unknown')
    : 'Unknown'
}
