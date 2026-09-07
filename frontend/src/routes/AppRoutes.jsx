import { useEffect, useState } from "react"
import { Link, Navigate, Outlet, Route, Routes, useNavigate } from "react-router-dom"
import api from "../services/api"
import { useAuth } from "../context/useAuth"
import { StatusBadge } from "../components/ui"
import { TechnicianListPage, TechnicianProfilePage } from "../features/technicians/TechnicianDiscovery"
import DiagnosisFlow from "../features/diagnosis/DiagnosisFlow"
import { BookingPage, BookingListPage, BookingDetailPage } from "../features/repairs/BookingFlow"
import TechnicianDashboard from "../features/technicians/TechnicianDashboard"
import CustomerDashboard from "../features/customer/CustomerDashboard"
import ProfilePage from "../features/profile/ProfilePage"
import LandingPage from "./Landing"

/* ═══════════════════════════════════════════════════════════════
   APP SHELL — Header, Mobile Nav, Outlet
   ═══════════════════════════════════════════════════════════════ */

function AppShell() {
  const { user, isAuthenticated, logout } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)
  const isTechnician = user?.role === "TECHNICIAN"
  const dashboard = isTechnician ? "/technician/dashboard" : "/customer/dashboard"

  return (
    <div className="min-h-screen bg-[var(--color-surface)] text-[var(--color-ink)]">
      {/* ── Header ── */}
      <header className="navbar">
        <Link to={isAuthenticated ? dashboard : "/"} className="flex items-center gap-1 text-xl font-bold tracking-tight focus-visible:outline-none">
          Local<span className="text-[var(--color-primary)]">Repair</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-1 md:flex">
          {isAuthenticated ? (
            <>
              {user.role === "CUSTOMER" && (
                <Link to="/technicians" className="nav-link">Find Technician</Link>
              )}
              <Link to={dashboard} className="nav-link">Dashboard</Link>
              {user.role === "CUSTOMER" && (
                <Link to="/customer/repairs" className="nav-link">My Repairs</Link>
              )}
              <Link to="/profile" className="nav-link">Profile</Link>
              <div className="mx-2 h-5 w-px bg-[var(--color-border)]" />
              <button onClick={logout} className="btn-secondary btn-sm">Log out</button>
            </>
          ) : (
            <>
              <a href="#how-it-works" className="nav-link">How it works</a>
              <a href="#services" className="nav-link">Services</a>
              <a href="#for-technicians" className="nav-link">For technicians</a>
              <Link to="/login" className="nav-link">Log in</Link>
              <Link to="/register" className="btn-primary btn-sm">Get started</Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="btn-ghost p-2 md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </header>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 md:hidden">
          <div className="flex flex-col gap-1">
            {isAuthenticated ? (
              <>
                {user.role === "CUSTOMER" && (
                  <Link onClick={() => setMobileOpen(false)} to="/technicians" className="nav-link w-full">
                    Find Technician
                  </Link>
                )}
                <Link onClick={() => setMobileOpen(false)} to={dashboard} className="nav-link w-full">
                  Dashboard
                </Link>
                {user.role === "CUSTOMER" && (
                  <Link onClick={() => setMobileOpen(false)} to="/customer/repairs" className="nav-link w-full">
                    My Repairs
                  </Link>
                )}
                <Link onClick={() => setMobileOpen(false)} to="/profile" className="nav-link w-full">
                  Profile
                </Link>
                <hr className="my-1 border-[var(--color-border)]" />
                <button onClick={() => { setMobileOpen(false); logout() }} className="nav-link w-full text-left text-[var(--color-danger)]">
                  Log out
                </button>
              </>
            ) : (
              <>
                <a onClick={() => setMobileOpen(false)} href="#how-it-works" className="nav-link w-full">How it works</a>
                <a onClick={() => setMobileOpen(false)} href="#services" className="nav-link w-full">Services</a>
                <a onClick={() => setMobileOpen(false)} href="#for-technicians" className="nav-link w-full">For technicians</a>
                <Link onClick={() => setMobileOpen(false)} to="/login" className="nav-link w-full">
                  Log in
                </Link>
                <Link onClick={() => setMobileOpen(false)} to="/register" className="btn-primary mt-1 w-full text-center">
                  Get started
                </Link>
              </>
            )}
          </div>
        </div>
      )}

      <Outlet />
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   LANDING PAGE
   ═══════════════════════════════════════════════════════════════ */

function Landing() {
  const [apiStatus, setApiStatus] = useState("checking")
  useEffect(() => {
    api.get("/health").then(() => setApiStatus("connected")).catch(() => setApiStatus("unavailable"))
  }, [])

  return (
    <main>
      {/* ── Hero ── */}
      <section className="section-container grid gap-12 px-6 py-16 sm:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-[var(--color-primary)]">
            Trusted local service
          </p>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl" style={{ lineHeight: 1.15 }}>
            Reliable appliance repair, close to home.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-[var(--color-ink-secondary)]">
            Find verified technicians, get clear estimates, and keep your repair moving with confidence.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link to="/diagnosis" className="btn-primary">
              Diagnose your repair
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
            <Link to="/register" className="btn-secondary">
              Join as a technician
            </Link>
          </div>
        </div>
        <div className="rounded-[var(--radius-lg)] bg-[var(--color-surface)] p-8" style={{ boxShadow: "var(--shadow-card)" }}>
          <p className="text-sm font-bold text-[var(--color-primary)]">LocalRepair</p>
          <h2 className="mt-3 text-2xl font-bold" style={{ lineHeight: 1.2 }}>Your repair journey starts here.</h2>
          <p className="mt-3 text-[var(--color-ink-secondary)]" style={{ lineHeight: 1.6 }}>
            Start with a quick, transparent diagnosis suggestion before finding a verified technician.
          </p>
          <div className="mt-6 space-y-3">
            {["Describe your appliance issue", "Get a diagnosis suggestion", "Choose a verified technician"].map((step, i) => (
              <div key={i} className="flex items-center gap-3 text-sm font-medium text-[var(--color-ink)]">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--color-ink)] text-xs text-[var(--color-ink-inverse)]">
                  {i + 1}
                </span>
                {step}
              </div>
            ))}
          </div>
          <p className={`mt-6 text-sm font-semibold ${apiStatus === "connected" ? "text-[var(--color-success)]" : apiStatus === "unavailable" ? "text-[var(--color-danger)]" : "text-[var(--color-ink-muted)]"}`}>
            {apiStatus === "checking" ? "Checking API connection..." : apiStatus === "connected" ? "\u25CF API connected" : "API unavailable \u2014 check the backend"}
          </p>
        </div>
      </section>

      {/* ── Process Steps ── */}
      <section className="section-container border-t border-[var(--color-border)] bg-[var(--color-bg)] py-20">
        <div className="mx-auto max-w-5xl">
          <p className="mb-4 text-center text-sm font-bold uppercase tracking-[0.18em] text-[var(--color-primary)]">The process</p>
          <h2 className="text-center text-3xl font-bold" style={{ lineHeight: 1.2 }}>
            From diagnosis to repair, simplified.
          </h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-5">
            {[
              { num: "01", title: "Diagnose", desc: "Describe your issue and get a suggestion" },
              { num: "02", title: "Find", desc: "Compare verified local technicians" },
              { num: "03", title: "Book", desc: "Schedule a time that works for you" },
              { num: "04", title: "Track", desc: "Follow your repair in real time" },
              { num: "05", title: "Done", desc: "Review and close your repair" },
            ].map((step) => (
              <div key={step.num} className="text-center">
                <span className="text-sm font-bold text-[var(--color-ink-muted)]">{step.num}</span>
                <h3 className="mt-2 text-lg font-bold text-[var(--color-ink)]">{step.title}</h3>
                <p className="mt-1 text-sm text-[var(--color-ink-secondary)]">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Supported Appliances ── */}
      <section className="section-container border-t border-[var(--color-border)] bg-[var(--color-surface)] py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-3xl font-bold" style={{ lineHeight: 1.2 }}>Services we support</h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-[var(--color-ink-secondary)]">
            From ACs to washing machines, find the right technician for your appliance.
          </p>
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { icon: "\u2744\uFE0F", name: "AC Repair" },
              { icon: "\uD83E\uDDCA", name: "Refrigerator" },
              { icon: "\uD83E\uDDFA", name: "Washing Machine" },
              { icon: "\uD83D\uDCFA", name: "TV Repair" },
              { icon: "\uD83D\uDCA7", name: "RO / Water Purifier" },
              { icon: "\uD83C\uDF7D\uFE0F", name: "Microwave" },
              { icon: "\u2744\uFE0F", name: "Cooler" },
              { icon: "\uD83D\uDD25", name: "Geyser" },
            ].map(({ icon, name }) => (
              <div key={name} className="card rounded-[var(--radius-md)] p-5 text-center">
                <span className="text-3xl" aria-hidden="true">{icon}</span>
                <p className="mt-2 text-sm font-semibold text-[var(--color-ink)]">{name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it Works ── */}
      <section className="section-container border-t border-[var(--color-border)] bg-[var(--color-bg)] py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-3xl font-bold" style={{ lineHeight: 1.2 }}>How it works</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {[
              { title: "Diagnose", desc: "Describe your appliance issue and get a transparent diagnosis suggestion." },
              { title: "Book", desc: "Choose a verified technician and schedule a convenient time." },
              { title: "Repair", desc: "Track status, approve estimates, and leave a review when done." },
            ].map(({ title, desc }, i) => (
              <div key={i} className="card p-8 text-center">
                <span className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-ink)] text-sm font-bold text-[var(--color-ink-inverse)]">
                  {i + 1}
                </span>
                <h3 className="text-xl font-bold text-[var(--color-ink)]">{title}</h3>
                <p className="mt-2 text-[var(--color-ink-secondary)]">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="section-container border-t border-[var(--color-border)] py-20">
        <div className="mx-auto max-w-3xl rounded-[var(--radius-lg)] bg-[var(--color-ink)] p-10 text-center sm:p-16">
          <h2 className="text-3xl font-bold text-[var(--color-ink-inverse)]" style={{ lineHeight: 1.2 }}>
            Ready to fix your appliance?
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-[var(--color-ink-muted)]">
            Start with a free diagnosis suggestion and connect with a verified technician in your area.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link to="/diagnosis" className="btn-primary" style={{ background: "var(--color-primary)", color: "white" }}>
              Start diagnosis
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
            <Link to="/register" className="btn-secondary" style={{ borderColor: "rgba(255,255,255,0.2)", color: "white" }}>
              Join as a technician
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-[var(--color-border)] bg-[var(--color-bg)] py-10">
        <div className="section-container text-center text-sm text-[var(--color-ink-muted)]">
          <p className="font-semibold text-[var(--color-ink)]">Local<span className="text-[var(--color-primary)]">Repair</span></p>
          <p className="mt-2">Trusted local appliance repair, close to home.</p>
          <p className="mt-4">&copy; {new Date().getFullYear()} LocalRepair. All rights reserved.</p>
        </div>
      </footer>
    </main>
  )
}

/* ═══════════════════════════════════════════════════════════════
   AUTH PAGE (Login / Register)
   ═══════════════════════════════════════════════════════════════ */

function AuthPage({ mode }) {
  const isRegister = mode === "register"
  const { login, register, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "", role: "CUSTOMER" })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  if (isAuthenticated) {
    const stored = JSON.parse(localStorage.getItem("localrepair_user") || "{}")
    return <Navigate to={stored.role === "TECHNICIAN" ? "/technician/dashboard" : "/customer/dashboard"} replace />
  }

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  const submit = async (event) => {
    event.preventDefault()
    setError("")
    if (isRegister && form.password !== form.confirmPassword) {
      setError("Passwords do not match")
      return
    }
    setLoading(true)
    try {
      const currentUser = isRegister
        ? await register({ name: form.name, email: form.email, password: form.password, role: form.role })
        : await login({ email: form.email, password: form.password })
      navigate(currentUser.role === "TECHNICIAN" ? "/technician/dashboard" : "/customer/dashboard")
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to complete the request")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="section-container mx-auto max-w-lg px-6 py-12 sm:py-16">
      <h1 className="text-3xl font-bold" style={{ lineHeight: 1.2 }}>
        {isRegister ? "Create your account" : "Welcome back"}
      </h1>
      <p className="mt-2 text-[var(--color-ink-secondary)]">
        {isRegister ? "Connect with trusted local repair help." : "Sign in to continue to LocalRepair."}
      </p>

      <form onSubmit={submit} className="card mt-8 space-y-5">
        {isRegister && (
          <label className="block text-sm font-medium text-[var(--color-ink)]">
            Name
            <input required minLength="2" maxLength="100" value={form.name} onChange={update("name")} className="input mt-2" />
          </label>
        )}
        <label className="block text-sm font-medium text-[var(--color-ink)]">
          Email
          <input required type="email" value={form.email} onChange={update("email")} className="input mt-2" />
        </label>
        <label className="block text-sm font-medium text-[var(--color-ink)]">
          Password
          <input required minLength="8" type="password" value={form.password} onChange={update("password")} className="input mt-2" />
        </label>
        {isRegister && (
          <>
            <label className="block text-sm font-medium text-[var(--color-ink)]">
              Confirm password
              <input required minLength="8" type="password" value={form.confirmPassword} onChange={update("confirmPassword")} className="input mt-2" />
            </label>
            <label className="block text-sm font-medium text-[var(--color-ink)]">
              Account type
              <select value={form.role} onChange={update("role")} className="input mt-2 appearance-none">
                <option value="CUSTOMER">Customer</option>
                <option value="TECHNICIAN">Technician</option>
              </select>
            </label>
          </>
        )}
        {error && (
          <div className="rounded-[var(--radius-sm)] bg-[var(--color-danger-light)] p-3 text-sm text-[var(--color-danger)]" role="alert">
            {error}
          </div>
        )}
        <button disabled={loading} className="btn-primary w-full">
          {loading ? "Please wait..." : isRegister ? "Create account" : "Sign in"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-[var(--color-ink-secondary)]">
        {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
        <Link to={isRegister ? "/login" : "/register"} className="font-semibold text-[var(--color-primary)] hover:underline">
          {isRegister ? "Sign in" : "Get started"}
        </Link>
      </p>
    </main>
  )
}

/* ═══════════════════════════════════════════════════════════════
   PROTECTED ROUTE
   ═══════════════════════════════════════════════════════════════ */

function ProtectedRoute({ role }) {
  const { user, loading, isAuthenticated } = useAuth()
  if (loading) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-[3px] border-[var(--color-border)] border-t-[var(--color-ink)]" />
          <p className="text-sm text-[var(--color-ink-secondary)]">Loading your session...</p>
        </div>
      </main>
    )
  }
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (role && user.role !== role) return <Navigate to={user.role === "TECHNICIAN" ? "/technician/dashboard" : "/customer/dashboard"} replace />
  return <Outlet />
}

Landing.displayName = "LegacyLanding"

/* ═══════════════════════════════════════════════════════════════
   LOGGED-IN HOME
   ═══════════════════════════════════════════════════════════════ */

function LoggedInHome() {
  const { user } = useAuth()
  const [repairs, setRepairs] = useState([])
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = user?.role === "CUSTOMER"
      ? api.get("/repairs").then(({ data }) => setRepairs(data.data.repairs || []))
      : api.get("/bookings/technician").then(({ data }) => setBookings(data.data.bookings || []))
    fetch.finally(() => setLoading(false))
  }, [user?.role])

  const isTech = user?.role === "TECHNICIAN"
  const activeRepairs = repairs.filter((r) => !["COMPLETED", "CANCELLED", "REJECTED"].includes(r.status))
  const completedRepairs = repairs.filter((r) => r.status === "COMPLETED")
  const pendingBookings = bookings.filter((b) => b.status === "PENDING")
  const activeBookings = bookings.filter((b) => ["ACCEPTED", "ON_THE_WAY"].includes(b.status))
  const completedBookings = bookings.filter((b) => b.status === "COMPLETED")
  const recentRepairs = (isTech ? bookings : repairs).slice(0, 3)

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 17) return "Good afternoon"
    return "Good evening"
  }

  return (
    <main className="section-container px-4 py-8 sm:px-6 sm:py-12">
      {/* ── Welcome Banner ── */}
      <section className="rounded-[var(--radius-lg)] bg-[var(--color-bg)] p-8 sm:p-10" style={{ boxShadow: "var(--shadow-card)" }}>
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-[var(--color-primary)]">
          {isTech ? "Technician workspace" : "Customer workspace"}
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl" style={{ lineHeight: 1.2 }}>
          {getGreeting()}, {user?.name?.split(" ")[0] || "there"}
        </h1>
        <p className="mt-3 max-w-xl text-[var(--color-ink-secondary)]">
          {isTech
            ? "Review new requests and keep your assigned repairs moving."
            : "Track your repairs, find technicians, and keep your appliances running."}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          {isTech ? (
            <>
              <Link to="/technician/dashboard" className="btn-primary">View dashboard</Link>
              <Link to="/profile" className="btn-secondary">Edit profile</Link>
            </>
          ) : (
            <>
              <Link to="/diagnosis" className="btn-primary">Diagnose a repair</Link>
              <Link to="/technicians" className="btn-secondary">Find technician</Link>
              <Link to="/customer/repairs" className="btn-secondary">My bookings</Link>
            </>
          )}
        </div>
      </section>

      {/* ── Stats ── */}
      {!loading && (
        <section className="mt-8 grid gap-4 sm:grid-cols-3">
          {isTech ? (
            <>
              <div className="card p-5">
                <p className="text-sm text-[var(--color-ink-muted)]">New requests</p>
                <p className="mt-2 text-3xl font-bold text-[var(--color-warning)]">{pendingBookings.length}</p>
              </div>
              <div className="card p-5">
                <p className="text-sm text-[var(--color-ink-muted)]">Active jobs</p>
                <p className="mt-2 text-3xl font-bold text-[var(--color-primary)]">{activeBookings.length}</p>
              </div>
              <div className="card p-5">
                <p className="text-sm text-[var(--color-ink-muted)]">Completed</p>
                <p className="mt-2 text-3xl font-bold text-[var(--color-success)]">{completedBookings.length}</p>
              </div>
            </>
          ) : (
            <>
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
            </>
          )}
        </section>
      )}

      {/* ── Recent Activity ── */}
      <section className="mt-8">
        <h2 className="text-xl font-bold text-[var(--color-ink)]">Recent activity</h2>
        {loading ? (
          <div className="mt-4 space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton h-20 rounded-[var(--radius-sm)]" />
            ))}
          </div>
        ) : recentRepairs.length === 0 ? (
          <div className="mt-4 rounded-[var(--radius-lg)] border-2 border-dashed border-[var(--color-border)] bg-[var(--color-bg)] p-10 text-center">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-surface-light)]">
              <span className="text-2xl text-[var(--color-ink-muted)]" aria-hidden="true">{isTech ? "\uD83D\uDCCB" : "\uD83D\uDD27"}</span>
            </div>
            <p className="font-semibold text-[var(--color-ink)]">No recent activity</p>
            <p className="mt-1 text-sm text-[var(--color-ink-muted)]">{isTech ? "New requests will appear here." : "Start by diagnosing an appliance issue."}</p>
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            {recentRepairs.map((item) => (
              <Link
                key={item.id}
                to={isTech ? "/technician/dashboard" : `/customer/repairs/${item.id}`}
                className="block rounded-[var(--radius-sm)] bg-[var(--color-bg)] p-4 transition-colors hover:bg-[var(--color-surface)]"
                style={{ boxShadow: "var(--shadow-card)" }}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold text-[var(--color-ink)] truncate">{item.title || item.problemDescription}</p>
                    <p className="mt-0.5 text-sm text-[var(--color-ink-muted)]">
                      {isTech ? item.customer?.name || "Customer" : item.technician?.name || "Technician pending"} &middot; {item.preferredDate?.slice(0, 10)}
                    </p>
                  </div>
                  <StatusBadge status={item.status} className="shrink-0" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

/* ═══════════════════════════════════════════════════════════════
   HOME REDIRECT
   ═══════════════════════════════════════════════════════════════ */

function HomeRedirect() {
  const { loading, isAuthenticated } = useAuth()
  if (loading) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-[3px] border-[var(--color-border)] border-t-[var(--color-ink)]" />
          <p className="text-sm text-[var(--color-ink-secondary)]">Loading your session...</p>
        </div>
      </main>
    )
  }
  return isAuthenticated ? <LoggedInHome /> : <LandingPage />
}

/* ═══════════════════════════════════════════════════════════════
   EXPORT
   ═══════════════════════════════════════════════════════════════ */

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/" element={<HomeRedirect />} />
        <Route path="/login" element={<AuthPage mode="login" />} />
        <Route path="/register" element={<AuthPage mode="register" />} />
        <Route path="/diagnosis" element={<DiagnosisFlow />} />
        <Route path="/technicians" element={<TechnicianListPage />} />
        <Route path="/technicians/:id" element={<TechnicianProfilePage />} />
        <Route element={<ProtectedRoute role="CUSTOMER" />}>
          <Route path="/booking/:technicianId" element={<BookingPage />} />
          <Route path="/customer/repairs" element={<BookingListPage />} />
          <Route path="/customer/repairs/:id" element={<BookingDetailPage />} />
          <Route path="/customer/dashboard" element={<CustomerDashboard />} />
          <Route path="/customer/repairs/new" element={<DiagnosisFlow />} />
        </Route>
        <Route element={<ProtectedRoute role="TECHNICIAN" />}>
          <Route path="/technician/dashboard" element={<TechnicianDashboard />} />
          <Route path="/technician/jobs" element={<TechnicianDashboard />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
