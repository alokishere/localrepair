import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import api from "../services/api"
import { useAuth } from "../context/useAuth"
import { StatusBadge } from "../components/ui"

export default function LoggedInHome() {
  const { user } = useAuth()
  const [repairs, setRepairs] = useState([])
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const isTechnician = user?.role === "TECHNICIAN"

  useEffect(() => {
    const request = isTechnician
      ? api.get("/bookings/technician").then(({ data }) => setBookings(data.data.bookings || []))
      : api.get("/repairs").then(({ data }) => setRepairs(data.data.repairs || []))
    request.finally(() => setLoading(false))
  }, [isTechnician])

  const activeRepairs = repairs.filter((repair) => !["COMPLETED", "CANCELLED", "REJECTED"].includes(repair.status))
  const completedRepairs = repairs.filter((repair) => repair.status === "COMPLETED")
  const pendingBookings = bookings.filter((booking) => booking.status === "PENDING")
  const activeBookings = bookings.filter((booking) => ["ACCEPTED", "ON_THE_WAY"].includes(booking.status))
  const completedBookings = bookings.filter((booking) => booking.status === "COMPLETED")
  const recentItems = (isTechnician ? bookings : repairs).slice(0, 3)

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 17) return "Good afternoon"
    return "Good evening"
  }

  return (
    <main className="section-container px-4 py-8 sm:px-6 sm:py-12">
      <section className="rounded-[var(--radius-lg)] bg-[var(--color-bg)] p-8 sm:p-10" style={{ boxShadow: "var(--shadow-card)" }}>
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-[var(--color-primary)]">{isTechnician ? "Technician workspace" : "Customer workspace"}</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl" style={{ lineHeight: 1.2 }}>{getGreeting()}, {user?.name?.split(" ")[0] || "there"}</h1>
        <p className="mt-3 max-w-xl text-[var(--color-ink-secondary)]">{isTechnician ? "Review new requests and keep your assigned repairs moving." : "Track your repairs, find technicians, and keep your appliances running."}</p>
        <div className="mt-6 flex flex-wrap gap-3">{isTechnician ? <><Link to="/technician/dashboard" className="btn-primary">View dashboard</Link><Link to="/profile" className="btn-secondary">Edit profile</Link></> : <><Link to="/diagnosis" className="btn-primary">Diagnose a repair</Link><Link to="/technicians" className="btn-secondary">Find technician</Link><Link to="/customer/repairs" className="btn-secondary">My bookings</Link></>}</div>
      </section>
      {!loading && <section className="mt-8 grid gap-4 sm:grid-cols-3">{isTechnician ? <><Stat label="New requests" value={pendingBookings.length} color="warning" /><Stat label="Active jobs" value={activeBookings.length} color="primary" /><Stat label="Completed" value={completedBookings.length} color="success" /></> : <><Stat label="Total bookings" value={repairs.length} color="ink" /><Stat label="Active repairs" value={activeRepairs.length} color="primary" /><Stat label="Completed" value={completedRepairs.length} color="success" /></>}</section>}
      <section className="mt-8"><h2 className="text-xl font-bold text-[var(--color-ink)]">Recent activity</h2>{loading ? <div className="mt-4 space-y-3">{[1, 2, 3].map((item) => <div key={item} className="skeleton h-20 rounded-[var(--radius-sm)]" />)}</div> : recentItems.length === 0 ? <div className="mt-4 rounded-[var(--radius-lg)] border-2 border-dashed border-[var(--color-border)] bg-[var(--color-bg)] p-10 text-center"><p className="font-semibold text-[var(--color-ink)]">No recent activity</p><p className="mt-1 text-sm text-[var(--color-ink-muted)]">{isTechnician ? "New requests will appear here." : "Start by diagnosing an appliance issue."}</p></div> : <div className="mt-4 space-y-3">{recentItems.map((item) => <Link key={item.id} to={isTechnician ? "/technician/dashboard" : `/customer/repairs/${item.id}`} className="block rounded-[var(--radius-sm)] bg-[var(--color-bg)] p-4 transition-colors hover:bg-[var(--color-surface)]" style={{ boxShadow: "var(--shadow-card)" }}><div className="flex items-center justify-between gap-3"><div className="min-w-0"><p className="truncate font-semibold text-[var(--color-ink)]">{item.title || item.problemDescription}</p><p className="mt-0.5 text-sm text-[var(--color-ink-muted)]">{isTechnician ? item.customer?.name || "Customer" : item.technician?.name || "Technician pending"} &middot; {item.preferredDate?.slice(0, 10)}</p></div><StatusBadge status={item.status} className="shrink-0" /></div></Link>)}</div>}</section>
    </main>
  )
}

function Stat({ label, value, color }) {
  return <div className="card p-5"><p className="text-sm text-[var(--color-ink-muted)]">{label}</p><p className={`mt-2 text-3xl font-bold text-[var(--color-${color})]`}>{value}</p></div>
}