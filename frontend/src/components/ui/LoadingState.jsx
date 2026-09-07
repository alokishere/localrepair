export default function LoadingState({ message = "Loading..." }) {
  return (
    <main className="flex min-h-[60vh] items-center justify-center px-6">
      <div className="text-center">
        <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-[3px] border-[var(--color-border)] border-t-[var(--color-ink)]" />
        <p className="text-sm text-[var(--color-ink-secondary)]">{message}</p>
      </div>
    </main>
  )
}

export function PageSkeleton() {
  return (
    <main className="section-container py-8 sm:py-12">
      <div className="space-y-3">
        <div className="skeleton h-3 w-24" />
        <div className="skeleton h-8 w-64" />
        <div className="skeleton h-4 w-80" />
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="skeleton h-28 rounded-[var(--radius-lg)]" />
        <div className="skeleton h-28 rounded-[var(--radius-lg)]" />
        <div className="skeleton h-28 rounded-[var(--radius-lg)]" />
      </div>
      <div className="mt-8">
        <div className="skeleton h-64 rounded-[var(--radius-lg)]" />
      </div>
    </main>
  )
}

export function CardSkeleton({ count = 3 }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton h-64 rounded-[var(--radius-lg)]" />
      ))}
    </div>
  )
}
