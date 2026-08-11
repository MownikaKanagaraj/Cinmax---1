'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '../button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class GlobalErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in CINMAX application:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[400px] flex items-center justify-center p-8">
          <div className="max-w-md w-full p-8 rounded-[24px] bg-white dark:bg-[#0A192F] border border-red-200 dark:border-red-900/40 text-center shadow-xl">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="font-serif text-2xl font-bold text-[#002754] dark:text-white mb-2">
              Something went wrong
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              {this.state.error?.message ||
                'An unexpected error occurred while rendering this section.'}
            </p>
            <div className="flex justify-center gap-3">
              <Button onClick={this.handleReset} variant="primary" size="md">
                Try Again
              </Button>
              <Button
                onClick={() => (window.location.href = '/')}
                variant="outline"
                size="md"
              >
                Return Home
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
