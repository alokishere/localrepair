import { useEffect, useState } from "react"
import { Link, Navigate, Outlet, Route, Routes, useNavigate } from "react-router-dom"
import api from "../services/api"
import { useAuth } from "../context/useAuth"
import { TechnicianListPage, TechnicianProfilePage } from "../features/technicians/TechnicianDiscovery"
import DiagnosisFlow from "../features/diagnosis/DiagnosisFlow"
import { BookingPage, BookingListPage, BookingDetailPage } from "../features/repairs/BookingFlow"
import TechnicianDashboard from "../features/technicians/TechnicianDashboard"
import CustomerDashboard from "../features/customer/CustomerDashboard"
import ProfilePage from "../features/profile/ProfilePage"

function AppShell() {
  const { user, isAuthenticated, logout } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)
  const isTechnician = user?.role === "TECHNICIAN"
  const dashboard = isTechnician ? "/technician/dashboard" : "/customer/dashboard"

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6" aria-label="Primary navigation">
          <Link to={isAuthenticated ? dashboard : "/"} className="text-xl font-bold tracking-tight focus-visible:outline-none">
            Local<span className="text-blue-600">Repair</span>
          </Link>

          <div className="hidden items-center gap-1 text-sm font-semibold md:flex">
            {isAuthenticated ? (
              <>
                {user.role === "CUSTOMER" && (
                  <Link to="/technicians" className="rounded-lg px-3 py-2 text-slate-600 hover:bg-slate-100 focus-visible:outline-none">
                    Find Technician
                  </Link>
                )}
                <Link to={dashboard} className="rounded-lg px-3 py-2 text-slate-600 hover:bg-slate-100 focus-visible:outline-none">
                  Dashboard
                </Link>
                {user.role === "CUSTOMER" && (
                  <Link to="/customer/repairs" className="rounded-lg px-3 py-2 text-slate-600 hover:bg-slate-100 focus-visible:outline-none">
                    My Bookings
                  </Link>
                )}
                <Link to="/profile" className="rounded-lg px-3 py-2 text-slate-600 hover:bg-slate-100 focus-visible:outline-none">
                  Profile
                </Link>
                <div className="ml-2 h-5 w-px bg-slate-200" />
                <button onClick={logout} className="ml-1 rounded-lg border border-slate-200 px-3 py-2 text-slate-600 hover:bg-slate-50 focus-visible:outline-none">
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="rounded-lg px-3 py-2 text-slate-600 hover:bg-slate-100 focus-visible:outline-none">
                  Log in
                </Link>
                <Link to="/register" className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus-visible:outline-none">
                  Get started
                </Link>
              </>
            )}
          </div>

          <button className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden focus-visible:outline-none" onClick={() => setMobileOpen(!mobileOpen)} aria-label={mobileOpen ? "Close menu" : "Open menu"} aria-expanded={mobileOpen}>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </nav>

        {mobileOpen && (
          <div className="border-t border-slate-200 bg-white px-4 py-3 md:hidden">
            <div className="flex flex-col gap-1 text-sm font-semibold">
              {isAuthenticated ? (
                <>
                  {user.role === "CUSTOMER" && (
                    <Link onClick={() => setMobileOpen(false)} to="/technicians" className="rounded-lg px-3 py-2.5 text-slate-600 hover:bg-slate-100">
                      Find Technician
                    </Link>
                  )}
                  <Link onClick={() => setMobileOpen(false)} to={dashboard} className="rounded-lg px-3 py-2.5 text-slate-600 hover:bg-slate-100">
                    Dashboard
                  </Link>
                  {user.role === "CUSTOMER" && (
                    <Link onClick={() => setMobileOpen(false)} to="/customer/repairs" className="rounded-lg px-3 py-2.5 text-slate-600 hover:bg-slate-100">
                      My Bookings
                    </Link>
                  )}
                  <Link onClick={() => setMobileOpen(false)} to="/profile" className="rounded-lg px-3 py-2.5 text-slate-600 hover:bg-slate-100">
                    Profile
                  </Link>
                  <hr className="my-1 border-slate-200" />
                  <button onClick={() => { setMobileOpen(false); logout() }} className="rounded-lg border border-slate-200 px-3 py-2.5 text-left text-slate-600 hover:bg-slate-50">
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <Link onClick={() => setMobileOpen(false)} to="/login" className="rounded-lg px-3 py-2.5 text-slate-600 hover:bg-slate-100">
                    Log in
                  </Link>
                  <Link onClick={() => setMobileOpen(false)} to="/register" className="rounded-lg bg-blue-600 px-4 py-2.5 text-center text-white hover:bg-blue-700">
                    Get started
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      <Outlet />
    </div>
  )
}

function Landing() {
  const [apiStatus, setApiStatus] = useState("checking")
  useEffect(() => {
    api.get("/health").then(() => setApiStatus("connected")).catch(() => setApiStatus("unavailable"))
  }, [])

  return (
    <main>
      <section className="mx-auto grid max-w-7xl gap-12 px-6 py-16 sm:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-blue-600">Trusted local service</p>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">Reliable appliance repair, close to home.</h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">Find verified technicians, get clear estimates, and keep your repair moving with confidence.</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link to="/diagnosis" className="inline-flex items-center rounded-xl bg-blue-600 px-6 py-3.5 font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2">
              Diagnose your repair
            </Link>
            <Link to="/register" className="inline-flex items-center rounded-xl border border-slate-300 bg-white px-6 py-3.5 font-semibold text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2">
              Join as a technician
            </Link>
          </div>
        </div>
        <div className="rounded-2xl border border-blue-100 bg-blue-50 p-8">
          <p className="text-sm font-semibold text-blue-700">LocalRepair</p>
          <h2 className="mt-3 text-2xl font-bold">Your repair journey starts here.</h2>
          <p className="mt-3 leading-7 text-slate-600">Start with a quick, transparent diagnosis suggestion before finding a verified technician.</p>
          <div className="mt-6 space-y-3">
            {["Describe your appliance issue", "Get a diagnosis suggestion", "Choose a verified technician"].map((step, i) => (
              <div key={i} className="flex items-center gap-3 text-sm font-medium text-slate-700">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs text-white">{i + 1}</span>
                {step}
              </div>
            ))}
          </div>
          <p className={`mt-6 text-sm font-semibold ${apiStatus === "connected" ? "text-green-600" : apiStatus === "unavailable" ? "text-red-600" : "text-slate-500"}`}>
            {apiStatus === "checking" ? "Checking API connection..." : apiStatus === "connected" ? "\u25CF API connected" : "API unavailable \u2014 check the backend"}
          </p>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-white py-16">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-center text-3xl font-bold">Services we support</h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-slate-600">From ACs to washing machines, find the right technician for your appliance.</p>
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[["\u2744\uFE0F", "AC Repair"], ["\uD83E\uDDCA", "Refrigerator"], ["\uD83E\uDDFA", "Washing Machine"], ["\uD83D\uDCFA", "TV Repair"], ["\uD83D\uDCA7", "RO / Water Purifier"], ["\uD83C\uDF7D\uFE0F", "Microwave"], ["\u2744\uFE0F", "Cooler"], ["\uD83D\uDD25", "Geyser"]].map(([icon, name]) => (
              <div key={name} className="rounded-xl border border-slate-200 bg-white p-5 text-center">
                <span className="text-3xl" aria-hidden="true">{icon}</span>
                <p className="mt-2 text-sm font-semibold">{name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-slate-50 py-16">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-center text-3xl font-bold">How it works</h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-3">
            {[["Diagnose", "Describe your appliance issue and get a transparent diagnosis suggestion."], ["Book", "Choose a verified technician and schedule a convenient time."], ["Repair", "Track status, approve estimates, and leave a review when done."]].map(([title, desc], i) => (
              <div key={i} className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
                <span className="flex mx-auto mb-4 h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">{i + 1}</span>
                <h3 className="text-xl font-bold">{title}</h3>
                <p className="mt-2 text-slate-600">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white py-10">
        <div className="mx-auto max-w-7xl px-6 text-center text-sm text-slate-500">
          <p className="font-semibold text-slate-700">Local<span className="text-blue-600">Repair</span></p>
          <p className="mt-2">Trusted local appliance repair, close to home.</p>
          <p className="mt-4">&copy; {new Date().getFullYear()} LocalRepair. All rights reserved.</p>
        </div>
      </footer>
    </main>
  )
}

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
    <main className="mx-auto max-w-lg px-6 py-12 sm:py-16">
      <h1 className="text-3xl font-bold">{isRegister ? "Create your account" : "Welcome back"}</h1>
      <p className="mt-2 text-slate-600">{isRegister ? "Connect with trusted local repair help." : "Sign in to continue to LocalRepair."}</p>
      <form onSubmit={submit} className="mt-8 space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        {isRegister && (
          <label className="block text-sm font-semibold">
            Name
            <input required minLength="2" maxLength="100" value={form.name} onChange={update("name")} className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-3 font-normal focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
          </label>
        )}
        <label className="block text-sm font-semibold">
          Email
          <input required type="email" value={form.email} onChange={update("email")} className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-3 font-normal focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
        </label>
        <label className="block text-sm font-semibold">
          Password
          <input required minLength="8" type="password" value={form.password} onChange={update("password")} className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-3 font-normal focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
        </label>
        {isRegister && (
          <>
            <label className="block text-sm font-semibold">
              Confirm password
              <input required minLength="8" type="password" value={form.confirmPassword} onChange={update("confirmPassword")} className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-3 font-normal focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
            </label>
            <label className="block text-sm font-semibold">
              Account type
              <select value={form.role} onChange={update("role")} className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-3 font-normal focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                <option value="CUSTOMER">Customer</option>
                <option value="TECHNICIAN">Technician</option>
              </select>
            </label>
          </>
        )}
        {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <button disabled={loading} className="min-h-12 w-full rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2">
          {loading ? "Please wait..." : isRegister ? "Create account" : "Sign in"}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-600">
        {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
        <Link to={isRegister ? "/login" : "/register"} className="font-semibold text-blue-600 hover:text-blue-700">
          {isRegister ? "Sign in" : "Get started"}
        </Link>
      </p>
    </main>
  )
}

function ProtectedRoute({ role }) {
  const { user, loading, isAuthenticated } = useAuth()
  if (loading) return <main className="flex min-h-[60vh] items-center justify-center"><div className="text-center"><div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" /><p className="text-sm text-slate-500">Loading your session...</p></div></main>
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (role && user.role !== role) return <Navigate to={user.role === "TECHNICIAN" ? "/technician/dashboard" : "/customer/dashboard"} replace />
  return <Outlet />
}

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

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
      <section className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-8 sm:p-10">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-600">
          {isTech ? "Technician workspace" : "Customer workspace"}
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
          Welcome back, {user?.name?.split(" ")[0] || "there"}
        </h1>
        <p className="mt-3 max-w-xl text-slate-600">
          {isTech
            ? "Review new requests and keep your assigned repairs moving."
            : "Track your repairs, find technicians, and keep your appliances running."}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          {isTech ? (
            <>
              <Link to="/technician/dashboard" className="inline-flex items-center rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700">
                View dashboard
              </Link>
              <Link to="/profile" className="inline-flex items-center rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 hover:bg-slate-50">
                Edit profile
              </Link>
            </>
          ) : (
            <>
              <Link to="/diagnosis" className="inline-flex items-center rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700">
                Diagnose a repair
              </Link>
              <Link to="/technicians" className="inline-flex items-center rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 hover:bg-slate-50">
                Find technician
              </Link>
              <Link to="/customer/repairs" className="inline-flex items-center rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 hover:bg-slate-50">
                My bookings
              </Link>
            </>
          )}
        </div>
      </section>

      {!loading && (
        <section className="mt-8 grid gap-4 sm:grid-cols-3">
          {isTech ? (
            <>
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-sm text-slate-500">New requests</p>
                <p className="mt-2 text-3xl font-bold text-amber-600">{pendingBookings.length}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-sm text-slate-500">Active jobs</p>
                <p className="mt-2 text-3xl font-bold text-blue-600">{activeBookings.length}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-sm text-slate-500">Completed</p>
                <p className="mt-2 text-3xl font-bold text-green-600">{completedBookings.length}</p>
              </div>
            </>
          ) : (
            <>
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
            </>
          )}
        </section>
      )}

      <section className="mt-8">
        <h2 className="text-xl font-bold">Recent activity</h2>
        {loading ? (
          <div className="mt-4 space-y-3">
            {[1, 2, 3].map((i) => <div key={i} className="h-20 animate-pulse rounded-xl bg-white" />)}
          </div>
        ) : recentRepairs.length === 0 ? (
          <div className="mt-4 rounded-2xl border-2 border-dashed border-slate-200 bg-white p-10 text-center">
            <div className="mx-auto mb-3 text-3xl text-slate-300" aria-hidden="true">{isTech ? "\uD83D\uDCCB" : "\uD83D\uDD27"}</div>
            <p className="font-semibold text-slate-700">No recent activity</p>
            <p className="mt-1 text-sm text-slate-500">{isTech ? "New requests will appear here." : "Start by diagnosing an appliance issue."}</p>
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            {recentRepairs.map((item) => (
              <Link
                key={item.id}
                to={isTech ? `/technician/dashboard` : `/customer/repairs/${item.id}`}
                className="block rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-blue-300"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-bold text-slate-900 truncate">{item.title || item.problemDescription}</p>
                    <p className="mt-0.5 text-sm text-slate-500">
                      {isTech ? item.customer?.name || "Customer" : item.technician?.name || "Technician pending"} &middot; {item.preferredDate?.slice(0, 10)}
                    </p>
                  </div>
                  <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-bold ${
                    item.status === "COMPLETED" ? "bg-green-100 text-green-700"
                    : item.status === "PENDING" || item.status === "SEARCHING" ? "bg-amber-100 text-amber-700"
                    : "bg-blue-100 text-blue-700"
                  }`}>
                    {item.status === "PENDING" ? "Pending" : item.status === "SEARCHING" ? "Searching" : item.status?.replace(/_/g, " ").toLowerCase()}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

function HomeRedirect() {
  const { loading, isAuthenticated } = useAuth()
  if (loading) return <main className="flex min-h-[60vh] items-center justify-center"><div className="text-center"><div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" /><p className="text-sm text-slate-500">Loading your session...</p></div></main>
  return isAuthenticated ? <LoggedInHome /> : <Landing />
}

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
