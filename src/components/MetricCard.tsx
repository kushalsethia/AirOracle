import type { MetricCardProps } from '../types/airQuality'

export const MetricCard = ({ title, value, unit, icon, color, status }: MetricCardProps) => {
  const getStatusColor = () => {
    switch (status) {
      case 'good':
        return '#10b981' // green
      case 'moderate':
        return '#f59e0b' // yellow
      case 'unhealthy':
        return '#ef4444' // red
      case 'hazardous':
        return '#7c2d12' // dark red
      default:
        return color
    }
  }

  return (
    <div className="metric-card">
      <div className="metric-header">
        <span className="metric-icon" style={{ color: getStatusColor() }}>
          {icon}
        </span>
        <h3 className="metric-title">{title}</h3>
      </div>
      <div className="metric-value">
        <span className="value-number">{value.toFixed(1)}</span>
        <span className="value-unit">{unit}</span>
      </div>
      {status && (
        <div className="metric-status" style={{ color: getStatusColor() }}>
          {status.toUpperCase()}
        </div>
      )}
    </div>
  )
}

