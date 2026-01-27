export interface AirQualityData {
  id?: string
  temperature: number // Celsius
  humidity: number // Percentage
  co2: number // ppm (parts per million)
  pm1_0: number // µg/m³
  pm2_5: number // µg/m³
  pm10: number // µg/m³
  carbon_monoxide: number // ppm
  voc: number // ppb (parts per billion) - Volatile Organic Compounds
  created_at?: string
  timestamp?: string
}

export interface MetricCardProps {
  title: string
  value: number
  unit: string
  icon: string
  color: string
  status?: 'good' | 'moderate' | 'unhealthy' | 'hazardous'
}

