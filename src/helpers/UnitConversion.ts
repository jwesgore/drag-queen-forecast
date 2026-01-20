// Converts Fahrenheit to Celsius
export function farToCel(f: number): number {
  return (f - 32) * 5 / 9;
}

// Converts mph to kph
export function mphToKph(mph: number): number {
  return mph * 1.60934;
}
