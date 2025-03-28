
import React, { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    // Navigate to home page or reload the app
    window.location.href = "/";
  };

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-4">
          <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
            <div className="flex items-center justify-center mb-4">
              <AlertTriangle className="h-12 w-12 text-amber-500" />
            </div>
            <h1 className="text-xl font-bold text-center mb-4">Something went wrong</h1>
            <p className="text-gray-600 mb-6 text-center">
              {this.state.error?.message || "An unexpected error occurred."}
            </p>
            <div className="flex justify-center space-x-4">
              <Button onClick={this.handleReset} variant="default">
                Return to Home
              </Button>
              <Button 
                onClick={() => window.location.reload()} 
                variant="outline"
              >
                Reload Page
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
