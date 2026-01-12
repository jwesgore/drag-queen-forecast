// User coordinates from browser geolocation
export interface Coordinates {
  lat: number
  lon: number
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
