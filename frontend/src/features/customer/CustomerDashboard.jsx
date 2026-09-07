import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import api from "../../services/api"
import { useAuth } from "../../context/useAuth"
import { StatusBadge, EmptyState } from "../../components/ui"

export default function CustomerDashboard() {
  const { user } = useAuth()
  const [repairs, setRepairs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    api.get("/repairs")
      .then(({ data }) => setRepairs(data.data.repairs))
      .catch((e) => setError(e.response?.data?.message || "Unable to load your dashboard"))
      .finally(() => setLoading(false))
  }, [])

  const activeRepairs = repairs.filter((r) => !["COMPLETED", "CANCELLED", "REJECTED"].includes(r.status))
  const completedRepairs = repairs.filter((r) => r.status === "COMPLETED")
  const active = activeRepairs[0]

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 17) return "Good afternoon"
    return "Good evening"
  }

  return (
    <main className="section-container px-4 py-8 sm:px-6 sm:py-12">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[var(--color-primary)]">Customer workspace</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl" style={{ lineHeight: 1.2 }}>
            {getGreeting()}, {user?.name?.split(" ")[0] || "there"}
          </h1>
          <p className="mt-2 text-[var(--color-ink-secondary)]">Track your repairs and find help when you need it.</p>
        </div>
        <Link to="/diagnosis" className="btn-primary inline-flex shrink-0">
          Start a new repair
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      {error && (
        <div className="mt-6 rounded-[var(--radius-sm)] bg-[var(--color-danger-light)] p-4 text-sm text-[var(--color-danger)]" role="alert">
          {error}
        </div>
      )}

      {loading ? (
        <div className="mt-8 space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton h-28 rounded-[var(--radius-lg)]" />
            ))}
          </div>
          <div className="skeleton h-64 rounded-[var(--radius-lg)]" />
        </div>
      ) : (
        <>
          {/* ── Stats ── */}
          <section className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="card p-5">
              <p className="text-sm text-[var(--color-ink-muted)]">Total bookings</p>
              <p className="mt-2 text-3xl font-bold text-[var(--color-ink)]">{repairs.length}</p>
            </div>
            <div className="card p-5">
              <p className="text-sm text-[var(--color-ink-muted)]">Active repairs</p>
              <p className="mt-2 text-3xl font-bold text-[var(--color-primary)]">{activeRepairs.length}</p>
            </div>
            <div className="card p-5">
              <p className="text-sm text-[var(--color-ink-muted)]">Completed</p>
              <p className="mt-2 text-3xl font-bold text-[var(--color-success)]">{completedRepairs.length}</p>
            </div>
          </section>

          {/* ── Active Repair ── */}
          {active && (
            <section className="mt-8 rounded-[var(--radius-lg)] bg-[var(--color-primary-light)] p-6">
              <p className="text-sm font-bold uppercase tracking-[0.12em] text-[var(--color-primary)]">Active repair</p>
              <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-bold text-[var(--color-ink)]">{active.title}</h2>
                  <p className="mt-1 text-sm text-[var(--color-ink-secondary)]">
                    {active.technician?.name || "Technician pending"} &middot; {active.preferredDate?.slice(0, 10)} {active.preferredTime}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={active.status} />
                  <Link to={`/customer/repairs/${active.id}`} className="btn-primary btn-sm">
                    View details
                  </Link>
                </div>
              </div>
            </section>
          )}

          {/* ── All Repairs ── */}
          <section className="mt-8">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-[var(--color-ink)]">All repairs</h2>
              <Link to="/diagnosis" className="btn-ghost text-sm text-[var(--color-primary)]">+ New repair</Link>
            </div>
            {repairs.length === 0 ? (
              <div className="mt-6">
                <EmptyState
                  title="No repairs yet"
                  description="Start by diagnosing an appliance issue to find the right technician."
                  actionLabel="Diagnose your repair"
                  actionTo="/diagnosis"
                  icon="🔧"
                />
              </div>
            ) : (
              <div className="mt-4 space-y-3">
                {repairs.map((repair) => (
                  <Link
                    key={repair.id}
                    to={`/customer/repairs/${repair.id}`}
                    className="block rounded-[var(--radius-sm)] bg-[var(--color-bg)] p-5 transition-colors hover:bg-[var(--color-surface)]"
                    style={{ boxShadow: "var(--shadow-card)" }}
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0">
                        <h3 className="font-bold text-[var(--color-ink)]">{repair.title}</h3>
                        <p className="mt-1 text-sm text-[var(--color-ink-muted)]">
                          {repair.technician?.name || "Technician pending"} &middot; {repair.preferredDate?.slice(0, 10)}
                        </p>
                      </div>
                      <StatusBadge status={repair.status} className="shrink-0 self-start" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </main>
  )
}
