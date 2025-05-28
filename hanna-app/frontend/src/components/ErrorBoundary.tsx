import React from 'react';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

function ErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-6">
          <AlertTriangle className="mx-auto h-16 w-16 text-red-400" />
        </div>
        <h1 className="text-2xl font-serif mb-4">Something went wrong</h1>
        <p className="text-gray-400 mb-6">
          We're sorry, but something unexpected happened. Please try refreshing the page.
        </p>
        <details className="mb-6 text-left">
          <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-300">
            Technical details
          </summary>
          <pre className="mt-2 text-xs text-red-300 bg-gray-800 p-3 rounded overflow-auto">
            {error.message}
          </pre>
        </details>
        <button
          onClick={resetErrorBoundary}
          className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
        >
          <RefreshCw size={16} />
          <span>Try again</span>
        </button>
      </div>
    </div>
  );
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

export function ErrorBoundary({ children }: ErrorBoundaryProps) {
  return (
    <ReactErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, errorInfo) => {
        // Log error to console in development
        console.error('Error caught by boundary:', error, errorInfo);
        
        // In production, you might want to send this to an error reporting service
        // like Sentry, LogRocket, etc.
      }}
    >
      {children}
    </ReactErrorBoundary>
  );
} 