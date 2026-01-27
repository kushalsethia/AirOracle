import { Component, ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('❌ Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          color: 'white'
        }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>⚠️ Error Loading Dashboard</h1>
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            padding: '1.5rem',
            borderRadius: '8px',
            maxWidth: '600px',
            marginTop: '1rem'
          }}>
            <p style={{ marginBottom: '0.5rem' }}>
              <strong>Error:</strong> {this.state.error?.message || 'Unknown error'}
            </p>
            <details style={{ marginTop: '1rem' }}>
              <summary style={{ cursor: 'pointer', marginBottom: '0.5rem' }}>Stack Trace</summary>
              <pre style={{
                background: 'rgba(0, 0, 0, 0.2)',
                padding: '1rem',
                borderRadius: '4px',
                overflow: 'auto',
                fontSize: '0.85rem',
                marginTop: '0.5rem'
              }}>
                {this.state.error?.stack}
              </pre>
            </details>
            <button
              onClick={() => window.location.reload()}
              style={{
                marginTop: '1rem',
                padding: '0.75rem 1.5rem',
                background: 'white',
                color: '#667eea',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              Reload Page
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

