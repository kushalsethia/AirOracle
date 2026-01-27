import type { AirQualityData } from '../types/airQuality'

export const getTemperatureStatus = (temp: number): 'good' | 'moderate' | 'unhealthy' | 'hazardous' => {
  if (temp >= 20 && temp <= 25) return 'good'
  if (temp >= 18 && temp <= 27) return 'moderate'
  if (temp >= 15 && temp <= 30) return 'unhealthy'
  return 'hazardous'
}

export const getHumidityStatus = (humidity: number): 'good' | 'moderate' | 'unhealthy' | 'hazardous' => {
  if (humidity >= 30 && humidity <= 60) return 'good'
  if (humidity >= 25 && humidity <= 70) return 'moderate'
  if (humidity >= 20 && humidity <= 80) return 'unhealthy'
  return 'hazardous'
}

export const getCO2Status = (co2: number): 'good' | 'moderate' | 'unhealthy' | 'hazardous' => {
  if (co2 < 1000) return 'good'
  if (co2 < 2000) return 'moderate'
  if (co2 < 5000) return 'unhealthy'
  return 'hazardous'
}

export const getPM25Status = (pm25: number): 'good' | 'moderate' | 'unhealthy' | 'hazardous' => {
  if (pm25 < 12) return 'good'
  if (pm25 < 35) return 'moderate'
  if (pm25 < 55) return 'unhealthy'
  return 'hazardous'
}

export const getPM10Status = (pm10: number): 'good' | 'moderate' | 'unhealthy' | 'hazardous' => {
  if (pm10 < 54) return 'good'
  if (pm10 < 154) return 'moderate'
  if (pm10 < 254) return 'unhealthy'
  return 'hazardous'
}

export const getCOStatus = (co: number): 'good' | 'moderate' | 'unhealthy' | 'hazardous' => {
  if (co < 9) return 'good'
  if (co < 35) return 'moderate'
  if (co < 50) return 'unhealthy'
  return 'hazardous'
}

export const getVOCStatus = (voc: number): 'good' | 'moderate' | 'unhealthy' | 'hazardous' => {
  if (voc < 250) return 'good'
  if (voc < 500) return 'moderate'
  if (voc < 1000) return 'unhealthy'
  return 'hazardous'
}

export const getPM10StatusFromData = (data: AirQualityData | null) => {
  return data ? getPM10Status(data.pm10) : undefined
}

