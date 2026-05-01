import React from "react";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full flex items-center justify-center bg-red-50 px-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 border border-red-200">
            <div className="flex items-start gap-3 mb-4">
              <div className="text-red-600 text-2xl flex-shrink-0">⚠️</div>
              <div className="flex-1">
                <h1 className="text-xl font-bold text-gray-900">Something Went Wrong</h1>
                <p className="text-sm text-gray-600 mt-1">
                  An unexpected error occurred. Our team has been notified. Please try refreshing the page.
                </p>
              </div>
            </div>
            
            {process.env.NODE_ENV === "development" && this.state.error && (
              <details className="mt-4 p-3 bg-gray-100 rounded text-xs text-gray-700 border border-gray-300">
                <summary className="font-semibold cursor-pointer">Error Details</summary>
                <pre className="mt-2 overflow-auto text-red-600">{this.state.error.toString()}</pre>
              </details>
            )}

            <button
              onClick={() => window.location.href = "/"}
              className="mt-4 w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/90 font-semibold transition-colors"
            >
              Go to Home
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
