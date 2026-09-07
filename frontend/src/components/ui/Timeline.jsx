const statusStyles = {
  completed: "bg-[var(--color-ink)] text-[var(--color-ink-inverse)]",
  current: "bg-[var(--color-primary)] text-white",
  upcoming: "bg-[var(--color-surface-light)] text-[var(--color-ink-muted)]",
}

export default function Timeline({ items }) {
  return (
    <ol className="space-y-0">
      {items.map((item, index) => {
        const isCompleted = item.status === "completed"
        const isCurrent = item.status === "current"
        const isLast = index === items.length - 1

        return (
          <li key={index} className="relative flex gap-4 pb-6">
            {/* Vertical line */}
            {!isLast && (
              <div
                className={`absolute left-[15px] top-[32px] h-[calc(100%-32px)] w-px ${
                  isCompleted ? "bg-[var(--color-ink)]" : "bg-[var(--color-border)]"
                }`}
              />
            )}

            {/* Dot */}
            <div className="relative z-10 flex shrink-0 items-start">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                  statusStyles[item.status] || statusStyles.upcoming
                }`}
              >
                {isCompleted ? (
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                ) : isCurrent ? (
                  <div className="h-2 w-2 rounded-full bg-white" />
                ) : (
                  <div className="h-2 w-2 rounded-full bg-[var(--color-ink-muted)]" />
                )}
              </div>
            </div>

            {/* Content */}
            <div className="min-w-0 flex-1 pt-0.5">
              <p
                className={`text-sm font-semibold ${
                  isCurrent
                    ? "text-[var(--color-ink)]"
                    : isCompleted
                      ? "text-[var(--color-ink-secondary)]"
                      : "text-[var(--color-ink-muted)]"
                }`}
              >
                {item.label}
              </p>
              {item.description && (
                <p className="mt-1 text-sm text-[var(--color-ink-muted)]">{item.description}</p>
              )}
              {item.time && (
                <p className="mt-1 text-xs text-[var(--color-ink-muted)]">{item.time}</p>
              )}
            </div>
          </li>
        )
      })}
    </ol>
  )
}
