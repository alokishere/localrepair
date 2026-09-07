const STATUS_CONFIG = {
  SEARCHING: { label: "Searching", variant: "warning" },
  ACCEPTED: { label: "Accepted", variant: "primary" },
  TECHNICIAN_ON_WAY: { label: "On the way", variant: "info" },
  ON_THE_WAY: { label: "On the way", variant: "info" },
  ARRIVED: { label: "Arrived", variant: "info" },
  DIAGNOSING: { label: "Diagnosing", variant: "info" },
  ESTIMATE_SENT: { label: "Estimate sent", variant: "warning" },
  CUSTOMER_APPROVED: { label: "Approved", variant: "success" },
  IN_PROGRESS: { label: "In progress", variant: "primary" },
  COMPLETED: { label: "Completed", variant: "success" },
  CANCELLED: { label: "Cancelled", variant: "default" },
  PENDING: { label: "Pending", variant: "warning" },
  REJECTED: { label: "Rejected", variant: "danger" },
}

const variantStyles = {
  default: "bg-[var(--color-surface-light)] text-[var(--color-ink-secondary)]",
  primary: "bg-[var(--color-primary-light)] text-[var(--color-primary)]",
  success: "bg-[var(--color-success-light)] text-[var(--color-success)]",
  warning: "bg-[var(--color-warning-light)] text-[var(--color-warning)]",
  danger: "bg-[var(--color-danger-light)] text-[var(--color-danger)]",
  info: "bg-[var(--color-info-light)] text-[var(--color-info)]",
}

export default function StatusBadge({ status, className = "" }) {
  const config = STATUS_CONFIG[status] || { label: status?.replace(/_/g, " ") || "Unknown", variant: "default" }
  return (
    <span className={`badge ${variantStyles[config.variant]} ${className}`}>
      {config.label}
    </span>
  )
}
