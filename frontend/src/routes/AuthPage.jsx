import { useState } from "react"
import { Link, Navigate, useNavigate } from "react-router-dom"
import { useAuth } from "../context/useAuth"

function Eye({ visible }) {
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M2.5 12s3.5-5.5 9.5-5.5 9.5 5.5 9.5 5.5-3.5 5.5-9.5 5.5S2.5 12 2.5 12Z" stroke="currentColor" strokeWidth="1.7" /><circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.7" />{!visible && <path d="m4 4 16 16" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />}</svg>
}

export default function AuthPage({ mode }) {
  const isRegister = mode === "register"
  const { login, register, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "", role: "CUSTOMER" })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  if (isAuthenticated) {
    const stored = JSON.parse(localStorage.getItem("localrepair_user") || "{}")
    return <Navigate to={stored.role === "TECHNICIAN" ? "/technician/dashboard" : "/customer/dashboard"} replace />
  }

  const update = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }))
    if (error) setError("")
  }

  const submit = async (event) => {
    event.preventDefault()
    setError("")
    if (isRegister && form.password !== form.confirmPassword) {
      setError("Passwords do not match. Please check both fields.")
      return
    }
    setLoading(true)
    try {
      const currentUser = isRegister
        ? await register({ name: form.name, email: form.email, password: form.password, role: form.role })
        : await login({ email: form.email, password: form.password })
      navigate(currentUser.role === "TECHNICIAN" ? "/technician/dashboard" : "/customer/dashboard")
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to complete the request. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return <main className="auth-page"><div className="auth-layout">
    <section className="auth-aside"><Link to="/" className="auth-brand">Local<span>Repair</span></Link><div className="auth-aside-copy"><span className="section-kicker">REPAIR, WITHOUT THE RUNAROUND</span><h1>{isRegister ? "A simpler way to get things working again." : "Welcome back to simpler repairs."}</h1><p>Keep your request, technician, and next step connected in one calm, clear place.</p></div><div className="auth-aside-card"><span className="auth-quote-mark">“</span><p>{isRegister ? "Start with the details. We'll help you take it from there." : "The fastest way forward is knowing exactly what happens next."}</p><div className="auth-mini-status"><span className="pulse-dot" /> LocalRepair workflow</div></div><div className="auth-aside-footer"><span>Local service</span><i /><span>Clear communication</span><i /><span>Nearby technicians</span></div></section>
    <section className="auth-panel"><div className="auth-panel-top"><span>{isRegister ? "New to LocalRepair?" : "Already have an account?"}</span><Link to={isRegister ? "/login" : "/register"}>{isRegister ? "Sign in" : "Create account"}</Link></div><div className="auth-form-wrap"><div className="auth-heading"><span className="auth-mobile-kicker">LOCALREPAIR ACCOUNT</span><h2>{isRegister ? "Create your account" : "Welcome back"}</h2><p>{isRegister ? "Get local repair help or start taking jobs in your area." : "Sign in to manage your repair journey."}</p></div><form onSubmit={submit} className="auth-form">
      {isRegister && <label className="auth-field">Full name<input required minLength="2" maxLength="100" value={form.name} onChange={update("name")} placeholder="e.g. Aman Kumar" autoComplete="name" /></label>}
      <label className="auth-field">Email address<input required type="email" value={form.email} onChange={update("email")} placeholder="you@example.com" autoComplete="email" /></label>
      <label className="auth-field">Password<div className="password-wrap"><input required minLength="8" type={showPassword ? "text" : "password"} value={form.password} onChange={update("password")} placeholder="At least 8 characters" autoComplete={isRegister ? "new-password" : "current-password"} /><button type="button" className="password-toggle" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? "Hide password" : "Show password"}><Eye visible={showPassword} /></button></div>{isRegister && <small>Use at least 8 characters.</small>}</label>
      {isRegister && <label className="auth-field">Confirm password<div className="password-wrap"><input required minLength="8" type={showConfirm ? "text" : "password"} value={form.confirmPassword} onChange={update("confirmPassword")} placeholder="Re-enter your password" autoComplete="new-password" /><button type="button" className="password-toggle" onClick={() => setShowConfirm((visible) => !visible)} aria-label={showConfirm ? "Hide confirmation password" : "Show confirmation password"}><Eye visible={showConfirm} /></button></div></label>}
      {isRegister && <fieldset className="role-field"><legend>How will you use LocalRepair?</legend><div className="role-options"><label className={form.role === "CUSTOMER" ? "role-option selected" : "role-option"}><input type="radio" name="role" value="CUSTOMER" checked={form.role === "CUSTOMER"} onChange={update("role")} /><span><strong>Find repair help</strong><small>I'm a customer</small></span><b>✓</b></label><label className={form.role === "TECHNICIAN" ? "role-option selected" : "role-option"}><input type="radio" name="role" value="TECHNICIAN" checked={form.role === "TECHNICIAN"} onChange={update("role")} /><span><strong>Take local jobs</strong><small>I'm a technician</small></span><b>✓</b></label></div></fieldset>}
      {!isRegister && <div className="auth-options"><label><input type="checkbox" /> <span>Remember me</span></label><span className="auth-muted">Password reset coming soon</span></div>}
      {error && <div className="auth-error" role="alert"><span>!</span><p>{error}</p></div>}
      <button disabled={loading} className="btn-primary auth-submit">{loading ? <><span className="auth-spinner" /> {isRegister ? "Creating account..." : "Signing in..."}</> : <>{isRegister ? "Create account" : "Sign in"}<span aria-hidden="true">→</span></>}</button>
      {isRegister && <p className="auth-terms">By creating an account, you agree to use LocalRepair responsibly.</p>}
    </form></div></section>
  </div></main>
}
