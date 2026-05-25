import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught a crash:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          fontFamily: 'serif',
          color: '#1c1917',
          backgroundColor: '#FCF9F6',
          textAlign: 'center',
          padding: '2rem'
        }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '1rem', letterSpacing: '0.1em' }}>
            Rohmani
          </h1>
          <p style={{ color: '#78716c', marginBottom: '2rem', maxWidth: '400px' }}>
            Something went wrong while loading the page. Please refresh.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '0.75rem 2rem',
              backgroundColor: '#1c1917',
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
              letterSpacing: '0.2em',
              fontSize: '0.75rem',
              textTransform: 'uppercase'
            }}
          >
            Refresh Page
          </button>
          {process.env.NODE_ENV !== 'production' && (
            <pre style={{
              marginTop: '2rem',
              fontSize: '0.75rem',
              color: '#ef4444',
              textAlign: 'left',
              maxWidth: '600px',
              overflow: 'auto'
            }}>
              {this.state.error?.toString()}
            </pre>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
