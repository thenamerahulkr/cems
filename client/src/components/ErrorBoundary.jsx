import React from "react"
import { AlertTriangle, RefreshCw, Home } from "lucide-react"
import Button from "./ui/Button"

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <div className="mb-8">
              <AlertTriangle className="mx-auto text-destructive mb-4" size={64} />
              <h1 className="text-2xl font-bold text-foreground mb-2">Something went wrong</h1>
              <p className="text-muted-foreground">
                An unexpected error occurred. Please try refreshing the page or go back to the homepage.
              </p>
            </div>

            <div className="space-y-4">
              <Button 
                onClick={() => window.location.reload()}
                className="w-full"
              >
                <RefreshCw size={16} className="mr-2" />
                Refresh Page
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => window.location.href = "/"}
                className="w-full"
              >
                <Home size={16} className="mr-2" />
                Go to Homepage
              </Button>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mt-8 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-left">
                <h3 className="font-semibold text-destructive mb-2">Error Details (Development):</h3>
                <pre className="text-xs text-destructive overflow-auto">
                  {this.state.error.toString()}
                </pre>
              </div>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary