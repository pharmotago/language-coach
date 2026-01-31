"use client";

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
        };
    }

    static getDerivedStateFromError(error: Error): Partial<State> {
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);

        // Log to error tracking service in production
        if (process.env.NODE_ENV === 'production') {
            // TODO: Send to Sentry, LogRocket, etc.
            // logErrorToService(error, errorInfo);
        }

        this.setState({
            error,
            errorInfo,
        });
    }

    handleReset = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null,
        });
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
                    <div className="max-w-md w-full bg-slate-900 border border-red-500/30 rounded-2xl p-8 text-center">
                        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <AlertTriangle className="w-8 h-8 text-red-500" />
                        </div>

                        <h2 className="text-2xl font-bold text-white mb-2">
                            Something Went Wrong
                        </h2>

                        <p className="text-slate-400 mb-6">
                            The Stoic Dad encountered an unexpected error. This has been logged for review.
                        </p>

                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <details className="text-left mb-6 p-4 bg-slate-950 rounded-lg border border-slate-800">
                                <summary className="cursor-pointer text-sm font-mono text-red-400 mb-2">
                                    Error Details (Development Only)
                                </summary>
                                <pre className="text-xs text-slate-300 overflow-auto">
                                    {this.state.error.toString()}
                                    {this.state.errorInfo?.componentStack}
                                </pre>
                            </details>
                        )}

                        <div className="flex gap-3">
                            <button
                                onClick={this.handleReset}
                                className="flex-1 px-4 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                            >
                                <RefreshCw className="w-4 h-4" />
                                Try Again
                            </button>

                            <button
                                onClick={() => window.location.reload()}
                                className="flex-1 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl transition-colors"
                            >
                                Reload Page
                            </button>
                        </div>

                        <p className="text-xs text-slate-500 mt-6">
                            "The impediment to action advances action. What stands in the way becomes the way."
                            <br />
                            <span className="italic">— Marcus Aurelius</span>
                        </p>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
