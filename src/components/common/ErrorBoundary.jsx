import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-ink-50 dark:bg-ink-950 p-8">
          <div className="max-w-md text-center">
            <div className="mx-auto mb-4 w-14 h-14 rounded-2xl bg-black flex items-center justify-center p-2.5">
              <img src="/logo.png" alt="Jalmitra" className="w-full h-full object-contain" />
            </div>
            <h2 className="font-display text-2xl font-bold text-ink-900 dark:text-ink-100 mb-2">Something went wrong</h2>
            <p className="text-ink-500 dark:text-ink-400 mb-6 text-sm">{this.state.error?.message}</p>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="px-6 py-2 bg-brand-600 text-white rounded-full font-medium hover:bg-brand-700 transition"
            >
              Try again
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
