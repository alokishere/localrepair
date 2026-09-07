import { useCallback, useEffect, useState } from "react"
import api from "../../services/api"
import { useToast } from "../../context/ToastContext"
import { StatusBadge, EmptyState } from "../../components/ui"

function BookingCard({ booking, onStatusChange, updatingId }) {
  const actions =
    booking.status === "PENDING"
      ? [["ACCEPTED", "Accept"], ["REJECTED", "Reject"]]
      : booking.status === "ACCEPTED"
        ? [["ON_THE_WAY", "Mark on the way"]]
        : booking.status === "ON_THE_WAY"
          ? [["COMPLETED", "Mark completed"]]
          : []

  return (
    <article className="card rounded-[var(--radius-lg)] p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-[var(--color-primary)]">{booking.category?.name || booking.title}</p>
          <h2 className="mt-1 text-xl font-bold text-[var(--color-ink)]">{booking.problemDescription}</h2>
          <p className="mt-2 text-sm text-[var(--color-ink-muted)]">
            Customer: {booking.customer?.name || "Customer"}
          </p>
        </div>
        <StatusBadge status={booking.status} className="shrink-0" />
      </div>

      <dl className="mt-6 grid gap-4 text-sm sm:grid-cols-2">
        <div>
          <dt className="font-medium text-[var(--color-ink-muted)]">Requested time</dt>
          <dd className="mt-1 text-[var(--color-ink-secondary)]">
            {booking.preferredDate?.slice(0, 10)} &middot; {booking.preferredTime}
          </dd>
        </div>
        <div>
          <dt className="font-medium text-[var(--color-ink-muted)]">Estimated price</dt>
          <dd className="mt-1 text-[var(--color-ink-secondary)]">
            {booking.estimatedCost ? `\u20B9${booking.estimatedCost.toLocaleString("en-IN")}` : "To be confirmed"}
          </dd>
        </div>
        <div>
          <dt className="font-medium text-[var(--color-ink-muted)]">Address</dt>
          <dd className="mt-1 text-[var(--color-ink-secondary)]">
            {booking.address ? `${booking.address.fullAddress}, ${booking.address.city}` : "Address unavailable"}
          </dd>
        </div>
      </dl>

      {booking.customerNotes && (
        <div className="mt-4 rounded-[var(--radius-sm)] bg-[var(--color-surface)] p-3 text-sm text-[var(--color-ink-secondary)]">
          Note: {booking.customerNotes}
        </div>
      )}

      {actions.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-3">
          {actions.map(([status, label]) => (
            <button
              key={status}
              disabled={updatingId === booking.id}
              onClick={() => onStatusChange(booking.id, status)}
              className={`btn-sm rounded-[var(--radius-full)] font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                status === "REJECTED"
                  ? "btn-secondary text-[var(--color-danger)]"
                  : "btn-primary"
              }`}
            >
              {updatingId === booking.id ? "Updating..." : label}
            </button>
          ))}
        </div>
      )}
    </article>
  )
}

export default function TechnicianDashboard() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [updatingId, setUpdatingId] = useState("")
  const toast = useToast()

  const load = useCallback(async () => {
    setLoading(true)
    setError("")
    try {
      const { data } = await api.get("/bookings/technician")
      setBookings(data.data.bookings)
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to load your bookings")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const updateStatus = async (id, status) => {
    setUpdatingId(id)
    setError("")
    try {
      const { data } = await api.patch(`/bookings/${id}/status`, { status })
      if (status === "REJECTED") {
        setBookings((current) => current.filter((booking) => booking.id !== id))
        toast.success("Booking rejected")
      } else {
        setBookings((current) => current.map((booking) => (booking.id === id ? data.data.booking : booking)))
        toast.success(`Status updated to ${status.replace(/_/g, " ").toLowerCase()}`)
      }
    } catch (requestError) {
      const msg = requestError.response?.data?.message || "Unable to update booking"
      setError(msg)
      toast.error(msg)
    } finally {
      setUpdatingId("")
    }
  }

  const counts = {
    pending: bookings.filter((item) => item.status === "PENDING").length,
    accepted: bookings.filter((item) => item.status === "ACCEPTED").length,
    onWay: bookings.filter((item) => item.status === "ON_THE_WAY").length,
    completed: bookings.filter((item) => item.status === "COMPLETED").length,
  }

  return (
    <main className="section-container px-4 py-8 sm:px-6 sm:py-12">
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-[var(--color-primary)]">Technician workspace</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl" style={{ lineHeight: 1.2 }}>
          Your bookings
        </h1>
        <p className="mt-2 text-[var(--color-ink-secondary)]">Review customer requests and keep each assigned repair moving.</p>
      </div>

      {/* ── Stats ── */}
      {!loading && (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["New requests", counts.pending, "text-[var(--color-warning)]"],
            ["Accepted jobs", counts.accepted, "text-[var(--color-primary)]"],
            ["On the way", counts.onWay, "text-[var(--color-info)]"],
            ["Completed jobs", counts.completed, "text-[var(--color-success)]"],
          ].map(([label, value, color]) => (
            <div key={label} className="card p-5">
              <p className="text-sm text-[var(--color-ink-muted)]">{label}</p>
              <p className={`mt-2 text-3xl font-bold ${color}`}>{value}</p>
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="mt-6 flex items-center justify-between gap-4 rounded-[var(--radius-sm)] bg-[var(--color-danger-light)] p-4 text-sm text-[var(--color-danger)]" role="alert">
          <span>{error}</span>
          <button onClick={load} className="shrink-0 font-semibold underline hover:text-[var(--color-ink)]">
            Try again
          </button>
        </div>
      )}

      {loading ? (
        <div className="mt-8 space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="skeleton h-56 rounded-[var(--radius-lg)]" />
          ))}
        </div>
      ) : bookings.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            title="No service requests yet"
            description="New customer requests assigned to you will appear here."
            icon="📋"
          />
        </div>
      ) : (
        <div className="mt-8 space-y-5">
          {bookings.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              onStatusChange={updateStatus}
              updatingId={updatingId}
            />
          ))}
        </div>
      )}
    </main>
  )
}
