import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "../context/useAuth"

export default function ProtectedRoute({ role }) {
  const { user, loading, isAuthenticated } = useAuth()
  if (loading) {
    return <main className="flex min-h-[60vh] items-center justify-center"><div className="text-center"><div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-[3px] border-[var(--color-border)] border-t-[var(--color-ink)]" /><p className="text-sm text-[var(--color-ink-secondary)]">Loading your session...</p></div></main>
  }
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (role && user.role !== role) return <Navigate to={user.role === "TECHNICIAN" ? "/technician/dashboard" : "/customer/dashboard"} replace />
  return <Outlet />
}