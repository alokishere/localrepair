const colorMap = {
  default: "bg-[var(--color-surface-light)] text-[var(--color-ink-secondary)]",
  primary: "bg-[var(--color-primary-light)] text-[var(--color-primary)]",
  success: "bg-[var(--color-success-light)] text-[var(--color-success)]",
  warning: "bg-[var(--color-warning-light)] text-[var(--color-warning)]",
  danger: "bg-[var(--color-danger-light)] text-[var(--color-danger)]",
  info: "bg-[var(--color-info-light)] text-[var(--color-info)]",
  ink: "bg-[var(--color-ink)] text-[var(--color-ink-inverse)]",
}

export default function Badge({ variant = "default", children, className = "" }) {
  return (
    <span className={`badge ${colorMap[variant] || colorMap.default} ${className}`}>
      {children}
    </span>
  )
}
