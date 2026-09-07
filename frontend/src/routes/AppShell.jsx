import { useState } from "react"
import { Link, Outlet } from "react-router-dom"
import { useAuth } from "../context/useAuth"

export default function AppShell() {
  const { user, isAuthenticated, logout } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)
  const isTechnician = user?.role === "TECHNICIAN"
  const dashboard = isTechnician ? "/technician/dashboard" : "/customer/dashboard"

  const closeMobile = () => setMobileOpen(false)

  return (
    <div className="min-h-screen bg-[var(--color-surface)] text-[var(--color-ink)]">
      <header className="navbar">
        <Link to={isAuthenticated ? dashboard : "/"} className="flex items-center gap-1 text-xl font-bold tracking-tight focus-visible:outline-none">
          Local<span className="text-[var(--color-primary)]">Repair</span>
        </Link>
        <div className="hidden items-center gap-1 md:flex">
          {isAuthenticated ? (
            <>
              {user.role === "CUSTOMER" && <Link to="/technicians" className="nav-link">Find Technician</Link>}
              <Link to={dashboard} className="nav-link">Dashboard</Link>
              {user.role === "CUSTOMER" && <Link to="/customer/repairs" className="nav-link">My Repairs</Link>}
              <Link to="/profile" className="nav-link">Profile</Link>
              <div className="mx-2 h-5 w-px bg-[var(--color-border)]" />
              <button onClick={logout} className="btn-secondary btn-sm">Log out</button>
            </>
          ) : (
            <><Link to="/login" className="nav-link">Log in</Link><Link to="/register" className="btn-primary btn-sm">Get started</Link></>
          )}
        </div>
        <button className="btn-ghost p-2 md:hidden" onClick={() => setMobileOpen(!mobileOpen)} aria-label={mobileOpen ? "Close menu" : "Open menu"} aria-expanded={mobileOpen}>
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            {mobileOpen ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
      </header>
      {mobileOpen && (
        <div className="border-t border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 md:hidden">
          <div className="flex flex-col gap-1">
            {isAuthenticated ? (
              <>
                {user.role === "CUSTOMER" && <Link onClick={closeMobile} to="/technicians" className="nav-link w-full">Find Technician</Link>}
                <Link onClick={closeMobile} to={dashboard} className="nav-link w-full">Dashboard</Link>
                {user.role === "CUSTOMER" && <Link onClick={closeMobile} to="/customer/repairs" className="nav-link w-full">My Repairs</Link>}
                <Link onClick={closeMobile} to="/profile" className="nav-link w-full">Profile</Link>
                <hr className="my-1 border-[var(--color-border)]" />
                <button onClick={() => { closeMobile(); logout() }} className="nav-link w-full text-left text-[var(--color-danger)]">Log out</button>
              </>
            ) : (
              <><Link onClick={closeMobile} to="/login" className="nav-link w-full">Log in</Link><Link onClick={closeMobile} to="/register" className="btn-primary mt-1 w-full text-center">Get started</Link></>
            )}
          </div>
        </div>
      )}
      <Outlet />
    </div>
  )
}