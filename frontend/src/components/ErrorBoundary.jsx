import { Component } from 'react'

class ErrorBoundary extends Component {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="flex min-h-screen items-center justify-center bg-[var(--color-surface)] px-6">
          <section className="w-full max-w-md rounded-[var(--radius-lg)] bg-[var(--color-bg)] p-8 text-center" style={{ boxShadow: "var(--shadow-card)" }}>
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-danger-light)]">
              <span className="text-[var(--color-danger)]" aria-hidden="true">!</span>
            </div>
            <p className="mb-2 text-sm font-semibold text-[var(--color-danger)]">Something went wrong</p>
            <h1 className="mb-3 text-2xl font-bold text-[var(--color-ink)]" style={{ lineHeight: 1.2 }}>
              We could not load this page.
            </h1>
            <p className="mb-6 text-[var(--color-ink-secondary)]">Refresh the page and try again.</p>
            <button
              className="btn-primary"
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
