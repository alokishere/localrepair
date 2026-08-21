import { Component } from 'react'

class ErrorBoundary extends Component {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
          <section className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <p className="mb-2 text-sm font-semibold text-red-600">Something went wrong</p>
            <h1 className="mb-3 text-2xl font-bold text-slate-900">We could not load this page.</h1>
            <p className="mb-6 text-slate-600">Refresh the page and try again.</p>
            <button
              className="min-h-11 rounded-lg bg-blue-600 px-5 font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
              onClick={() => window.location.reload()}
            >
              Refresh page
            </button>
          </section>
        </main>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
