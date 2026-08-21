import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import api from "../../services/api"
import { useAuth } from "../../context/useAuth"
import { StatusBadge } from "../../components/ui"

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

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-600">Customer workspace</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Welcome back, {user?.name?.split(" ")[0] || "there"}
          </h1>
          <p className="mt-2 text-slate-600">Track your repairs and find help when you need it.</p>
        </div>
        <Link to="/diagnosis" className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2">
          Find a technician
        </Link>
      </div>

      {error && (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700" role="alert">
          {error}
        </div>
      )}

      {loading ? (
        <div className="mt-8 space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-28 animate-pulse rounded-2xl bg-white" />
            ))}
          </div>
          <div className="h-64 animate-pulse rounded-2xl bg-white" />
        </div>
      ) : (
        <>
          <section className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">Total bookings</p>
              <p className="mt-2 text-3xl font-bold text-slate-800">{repairs.length}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">Active repairs</p>
              <p className="mt-2 text-3xl font-bold text-blue-600">{activeRepairs.length}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">Completed</p>
              <p className="mt-2 text-3xl font-bold text-green-600">{completedRepairs.length}</p>
            </div>
          </section>

          {active && (
            <section className="mt-8 rounded-2xl border border-blue-200 bg-blue-50 p-6">
              <p className="text-sm font-bold uppercase tracking-[0.12em] text-blue-700">Active repair</p>
              <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">{active.title}</h2>
                  <p className="mt-1 text-sm text-slate-600">
                    {active.technician?.name || "Technician pending"} &middot; {active.preferredDate?.slice(0, 10)} {active.preferredTime}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={active.status} />
                  <Link to={`/customer/repairs/${active.id}`} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
                    View details
                  </Link>
                </div>
              </div>
            </section>
          )}

          <section className="mt-8">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">All repairs</h2>
              <Link to="/diagnosis" className="text-sm font-semibold text-blue-600 hover:text-blue-700">+ New repair</Link>
            </div>
            {repairs.length === 0 ? (
              <div className="mt-6 rounded-2xl border-2 border-dashed border-slate-200 bg-white p-12 text-center">
                <div className="mx-auto mb-4 text-4xl text-slate-300" aria-hidden="true">🔧</div>
                <h3 className="text-lg font-bold text-slate-800">No repairs yet</h3>
                <p className="mt-2 text-slate-500">Start by diagnosing an appliance issue to find the right technician.</p>
                <Link to="/diagnosis" className="mt-6 inline-flex items-center rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700">
                  Diagnose your repair
                </Link>
              </div>
            ) : (
              <div className="mt-4 space-y-3">
                {repairs.map((repair) => (
                  <Link
                    key={repair.id}
                    to={`/customer/repairs/${repair.id}`}
                    className="block rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0">
                        <h3 className="font-bold text-slate-900">{repair.title}</h3>
                        <p className="mt-1 text-sm text-slate-500">
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
