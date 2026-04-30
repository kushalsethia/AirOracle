import { useAirQuality } from '../hooks/useAirQuality'
import { MetricCard } from './MetricCard'
import {
  getPM25Status,
  getPM10Status,
  getCOStatus,
} from '../utils/metricHelpers'
import './Dashboard.css'

type PollutantGuidance = {
  title: string
  isNormal: boolean
  fixes?: string[]
}

const getPollutantGuidance = (prediction?: string): PollutantGuidance => {
  const normalized = (prediction || '').trim().toLowerCase()

  if (!normalized || normalized === 'normal' || normalized === 'window') {
    return {
      title: 'Normal',
      isNormal: true,
    }
  }

  if (normalized === 'smoking') {
    return {
      title: 'Smoking',
      isNormal: false,
      fixes: [
        'Stop smoking indoors and move all smoking activity outside.',
        'Open windows and run an exhaust fan for at least 20-30 minutes.',
        'Run a HEPA + activated carbon air purifier near the affected area.',
      ],
    }
  }

  if (normalized === 'vape') {
    return {
      title: 'Vape Aerosol',
      isNormal: false,
      fixes: [
        'Avoid vaping indoors to prevent aerosol buildup in enclosed areas.',
        'Increase fresh air intake immediately with windows or mechanical ventilation.',
        'Use an air purifier with carbon filtration to reduce residual VOCs.',
      ],
    }
  }

  if (normalized === 'candle') {
    return {
      title: 'Candle Emissions',
      isNormal: false,
      fixes: [
        'Extinguish candles and avoid continuous burning in low-airflow rooms.',
        'Ventilate the room and clean soot-prone surfaces nearby.',
        'Use unscented, low-soot alternatives only when ventilation is adequate.',
      ],
    }
  }

  if (normalized === 'paper') {
    return {
      title: 'Paper/Combustion Particles',
      isNormal: false,
      fixes: [
        'Stop any burning source immediately and isolate the affected space.',
        'Ventilate aggressively and keep doors open to flush indoor air.',
        'Run a HEPA purifier at high speed until PM levels stabilize.',
      ],
    }
  }

  return {
    title: prediction || 'Unknown Source',
    isNormal: false,
    fixes: [
      'Increase ventilation and track whether levels decrease within 15-30 minutes.',
      'Inspect recent activities (cooking, cleaning sprays, smoke, solvents).',
      'Use filtration and monitor trends before re-occupying enclosed areas.',
    ],
  }
}

export const Dashboard = () => {
  const { data, loading, error } = useAirQuality()

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Loading air quality data...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <h2>Error loading data</h2>
        <p className="error-message">{error}</p>
        <div className="error-hint">
          <p>Please check:</p>
          <ul>
            <li>Your Supabase configuration in <code>.env</code> file</li>
            <li>That you've run the SQL setup script in Supabase</li>
            <li>That the table name is correct (default: <code>air_quality</code>)</li>
            <li>Check the browser console for more details</li>
          </ul>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="dashboard-empty">
        <h2>No data available</h2>
        <p>Waiting for air quality data to be sent to the database...</p>
      </div>
    )
  }

  const pollutantGuidance = getPollutantGuidance(data.prediction)

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Indoor Air Quality Monitor</h1>
        <div className="status-indicator">
          <span className="status-dot"></span>
          <span>Live</span>
        </div>
      </header>

      <div className="metrics-grid">
        <MetricCard
          title="Temperature"
          value={data.temperature}
          unit="°C"
          icon="🌡️"
          color="#3b82f6"
        />
        <MetricCard
          title="Humidity"
          value={data.humidity}
          unit="%"
          icon="💧"
          color="#06b6d4"
        />
        <MetricCard
          title="CO₂"
          value={data.co2}
          unit="ppm"
          icon="🌿"
          color="#10b981"
        />
        <MetricCard
          title="PM 1.0"
          value={data.pm1_0}
          unit="µg/m³"
          icon="💨"
          color="#8b5cf6"
        />
        <MetricCard
          title="PM 2.5"
          value={data.pm2_5}
          unit="µg/m³"
          icon="🌫️"
          color="#f59e0b"
          status={getPM25Status(data.pm2_5)}
        />
        <MetricCard
          title="PM 10"
          value={data.pm10}
          unit="µg/m³"
          icon="☁️"
          color="#ef4444"
          status={getPM10Status(data.pm10)}
        />
        <MetricCard
          title="Carbon Monoxide"
          value={data.carbon_monoxide}
          unit="ppm"
          icon="⚠️"
          color="#dc2626"
          status={getCOStatus(data.carbon_monoxide)}
        />
        <MetricCard
          title="VOC"
          value={data.voc}
          unit="ppb"
          icon="🧪"
          color="#9333ea"
        />
      </div>

      <section className="pollutant-detection">
        <h2>Pollutant Detection</h2>
        <p className={`pollutant-badge ${pollutantGuidance.isNormal ? 'normal' : 'alert'}`}>
          {pollutantGuidance.isNormal ? 'NORMAL' : pollutantGuidance.title.toUpperCase()}
        </p>
        {pollutantGuidance.isNormal ? (
          <p className="pollutant-subtitle">
            Air quality is stable. No corrective action needed.
          </p>
        ) : (
          <>
            <p className="pollutant-subtitle">
              Detected source: <strong>{pollutantGuidance.title}</strong>
            </p>
            <h3>Ways to Fix It</h3>
            <ul>
              {pollutantGuidance.fixes?.map((fix) => (
                <li key={fix}>{fix}</li>
              ))}
            </ul>
          </>
        )}
      </section>

      {data.created_at && (
        <div className="last-updated">
          Last updated: {new Date(data.created_at).toLocaleString()}
        </div>
      )}
    </div>
  )
}

