import type { AirQualityData } from '../types/airQuality'

// EPA AQI (2024+) for PM2.5 has 6 categories; this app collapses them into 4:
// - good: 0.0-9.0
// - moderate: 9.1-35.4
// - unhealthy: 35.5-125.4 (combines USG + Unhealthy)
// - hazardous: 125.5+ (combines Very Unhealthy + Hazardous)
export const getPM25Status = (pm25: number): 'good' | 'moderate' | 'unhealthy' | 'hazardous' => {
  if (pm25 <= 9) return 'good'
  if (pm25 <= 35.4) return 'moderate'
  if (pm25 <= 125.4) return 'unhealthy'
  return 'hazardous'
}

// EPA AQI for PM10 has 6 categories; this app collapses them into 4:
// - good: 0-54
// - moderate: 55-154
// - unhealthy: 155-354 (combines USG + Unhealthy)
// - hazardous: 355+ (combines Very Unhealthy + Hazardous)
export const getPM10Status = (pm10: number): 'good' | 'moderate' | 'unhealthy' | 'hazardous' => {
  if (pm10 <= 54) return 'good'
  if (pm10 <= 154) return 'moderate'
  if (pm10 <= 354) return 'unhealthy'
  return 'hazardous'
}

// EPA AQI for CO (8-hour average) has 6 categories; this app collapses them into 4:
// - good: 0.0-4.4
// - moderate: 4.5-9.4
// - unhealthy: 9.5-15.4 (combines USG + Unhealthy)
// - hazardous: 15.5+ (combines Very Unhealthy + Hazardous)
export const getCOStatus = (co: number): 'good' | 'moderate' | 'unhealthy' | 'hazardous' => {
  if (co <= 4.4) return 'good'
  if (co <= 9.4) return 'moderate'
  if (co <= 15.4) return 'unhealthy'
  return 'hazardous'
}

export const getPM10StatusFromData = (data: AirQualityData | null) => {
  return data ? getPM10Status(data.pm10) : undefined
}

