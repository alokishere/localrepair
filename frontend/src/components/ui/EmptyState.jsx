import { Link } from "react-router-dom"

export default function EmptyState({ title, description, actionLabel, actionTo, icon }) {
  return (
    <div className="rounded-[var(--radius-lg)] border-2 border-dashed border-[var(--color-border)] bg-[var(--color-bg)] p-12 text-center">
      {icon && (
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-surface-light)]">
          <span className="text-2xl text-[var(--color-ink-muted)]" aria-hidden="true">{icon}</span>
        </div>
      )}
      <h2 className="text-lg font-semibold text-[var(--color-ink)]">{title}</h2>
      <p className="mt-2 text-[var(--color-ink-secondary)]">{description}</p>
      {actionLabel && actionTo && (
        <Link
          to={actionTo}
          className="btn-primary mt-6 inline-flex"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  )
}
