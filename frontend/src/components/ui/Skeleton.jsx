export function SkeletonCard({ className = "" }) {
  return <div className={`animate-pulse rounded-2xl border border-slate-200 bg-white ${className}`} />
}

export function SkeletonLine({ className = "" }) {
  return <div className={`animate-pulse rounded bg-slate-200 ${className}`} />
}

export function SkeletonText({ lines = 3, className = "" }) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <SkeletonLine key={i} className={`h-4 ${i === lines - 1 ? "w-3/4" : "w-full"}`} />
      ))}
    </div>
  )
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <SkeletonLine className="h-3 w-24" />
        <SkeletonLine className="h-8 w-64" />
        <SkeletonLine className="h-4 w-80" />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <SkeletonCard className="h-28" />
        <SkeletonCard className="h-28" />
        <SkeletonCard className="h-28" />
      </div>
      <SkeletonCard className="h-64" />
    </div>
  )
}
