import { useState } from 'react'
import { useAirQuality } from '../hooks/useAirQuality'
import { MetricCard } from './MetricCard'
import {
  getTemperatureStatus,
  getHumidityStatus,
  getCO2Status,
  getPM25Status,
  getPM10Status,
  getCOStatus,
  getVOCStatus,
} from '../utils/metricHelpers'
import { supabase } from '../lib/supabase'
import './Dashboard.css'

export const Dashboard = () => {
  const { data, loading, error } = useAirQuality()
  const [insertingTestData, setInsertingTestData] = useState(false)

  const insertTestData = async () => {
    setInsertingTestData(true)
    try {
      const testData = {
        temperature: 22.5,
        humidity: 45.0,
        co2: 450,
        pm1_0: 8.5,
        pm2_5: 12.0,
        pm10: 18.0,
        carbon_monoxide: 2.5,
        voc: 150,
      }

      const { error: insertError } = await supabase.from('air_quality').insert([testData])

      if (insertError) {
        console.error('Error inserting test data:', insertError)
        alert(`Error: ${insertError.message}`)
      } else {
        console.log('Test data inserted successfully!')
      }
    } catch (err) {
      console.error('Error:', err)
      alert(`Error: ${err instanceof Error ? err.message : 'Failed to insert test data'}`)
    } finally {
      setInsertingTestData(false)
    }
  }

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
        <div className="test-data-section">
          <p className="test-data-hint">Want to see the dashboard in action?</p>
          <button 
            className="test-data-button" 
            onClick={insertTestData}
            disabled={insertingTestData}
          >
            {insertingTestData ? 'Inserting...' : 'Insert Test Data'}
          </button>
          <p className="test-data-note">
            This will insert sample air quality data so you can preview the dashboard.
            <br />
            Your monitoring system will insert real data automatically.
          </p>
        </div>
      </div>
    )
  }

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
          status={getTemperatureStatus(data.temperature)}
        />
        <MetricCard
          title="Humidity"
          value={data.humidity}
          unit="%"
          icon="💧"
          color="#06b6d4"
          status={getHumidityStatus(data.humidity)}
        />
        <MetricCard
          title="CO₂"
          value={data.co2}
          unit="ppm"
          icon="🌿"
          color="#10b981"
          status={getCO2Status(data.co2)}
        />
        <MetricCard
          title="PM 1.0"
          value={data.pm1_0}
          unit="µg/m³"
          icon="💨"
          color="#8b5cf6"
          status={data.pm1_0 < 12 ? 'good' : data.pm1_0 < 35 ? 'moderate' : 'unhealthy'}
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
          status={getVOCStatus(data.voc)}
        />
      </div>

      {data.created_at && (
        <div className="last-updated">
          Last updated: {new Date(data.created_at).toLocaleString()}
        </div>
      )}
    </div>
  )
}

