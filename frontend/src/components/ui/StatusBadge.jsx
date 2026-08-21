const STATUS_CONFIG = {
  SEARCHING: { label: "Searching", color: "bg-amber-100 text-amber-700" },
  ACCEPTED: { label: "Accepted", color: "bg-blue-100 text-blue-700" },
  TECHNICIAN_ON_WAY: { label: "On the way", color: "bg-cyan-100 text-cyan-700" },
  ON_THE_WAY: { label: "On the way", color: "bg-cyan-100 text-cyan-700" },
  ARRIVED: { label: "Arrived", color: "bg-indigo-100 text-indigo-700" },
  DIAGNOSING: { label: "Diagnosing", color: "bg-purple-100 text-purple-700" },
  ESTIMATE_SENT: { label: "Estimate sent", color: "bg-orange-100 text-orange-700" },
  CUSTOMER_APPROVED: { label: "Approved", color: "bg-teal-100 text-teal-700" },
  IN_PROGRESS: { label: "In progress", color: "bg-blue-100 text-blue-700" },
  COMPLETED: { label: "Completed", color: "bg-green-100 text-green-700" },
  CANCELLED: { label: "Cancelled", color: "bg-slate-100 text-slate-600" },
  PENDING: { label: "Pending", color: "bg-amber-100 text-amber-700" },
  REJECTED: { label: "Rejected", color: "bg-red-100 text-red-700" },
}

export default function StatusBadge({ status, className = "" }) {
  const config = STATUS_CONFIG[status] || { label: status, color: "bg-slate-100 text-slate-700" }
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${config.color} ${className}`}>
      {config.label}
    </span>
  )
}
