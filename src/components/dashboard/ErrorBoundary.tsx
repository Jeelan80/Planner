import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '../common/Button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class DashboardErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Dashboard Error Boundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="bg-white/10 backdrop-blur-sm border border-red-500/30 rounded-xl p-6 text-center">
          <div className="flex items-center justify-center w-16 h-16 bg-red-500/20 rounded-full mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-red-400" />
          </div>
          
          <h3 className="text-lg font-semibold text-white mb-2">
            Dashboard Card Error
          </h3>
          
          <p className="text-white/70 text-sm mb-4">
            Something went wrong with this dashboard card. You can try refreshing it or remove it from your dashboard.
          </p>
          
          <div className="flex space-x-3 justify-center">
            <Button
              onClick={this.handleReset}
              size="sm"
              variant="outline"
              className="bg-white/20 border-white/30 text-white hover:bg-white/30"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </div>
          
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details className="mt-4 text-left">
              <summary className="text-xs text-white/60 cursor-pointer">
                Error Details (Development)
              </summary>
              <pre className="text-xs text-red-300 mt-2 p-2 bg-red-900/20 rounded overflow-auto">
                {this.state.error.stack}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}