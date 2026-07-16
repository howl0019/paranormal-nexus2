import { Component, ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught an error', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background px-4 py-10 text-neutral-100">
          <div className="mx-auto max-w-3xl rounded-2xl border border-border bg-surface p-8 shadow-panel">
            <h1 className="text-2xl font-semibold">Algo deu errado</h1>
            <p className="mt-4 text-sm text-neutral-300">Por favor, recarregue a página ou tente novamente.</p>
            <pre className="mt-6 rounded-xl bg-[#11121a] p-4 text-xs text-neutral-300">{this.state.error?.message}</pre>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
