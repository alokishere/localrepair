import { useEffect, useState } from 'react'
import { Link, Outlet, Route, Routes, useLocation } from 'react-router-dom'
import api from '../services/api'

const routeLabels = {
  '/login': 'Login',
  '/register': 'Register',
  '/customer/dashboard': 'Customer dashboard',
  '/customer/repairs/new': 'Book a repair',
  '/technician/dashboard': 'Technician dashboard',
}

function AppShell() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4" aria-label="Primary navigation">
          <Link to="/" className="text-xl font-bold tracking-tight text-slate-900">Local<span className="text-blue-600">Repair</span></Link>
          <div className="flex items-center gap-3 text-sm font-semibold">
            <Link to="/login" className="rounded-lg px-3 py-2 text-slate-600 hover:bg-slate-100">Log in</Link>
            <Link to="/register" className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">Get started</Link>
          </div>
        </nav>
      </header>
      <Outlet />
    </div>
  )
}

function Landing() {
  const [apiStatus, setApiStatus] = useState('checking')

  useEffect(() => {
    let active = true

    api.get('/health')
      .then(() => active && setApiStatus('connected'))
      .catch(() => active && setApiStatus('unavailable'))

    return () => {
      active = false
    }
  }, [])

  return (
    <main>
      <section className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-blue-600">Trusted local service</p>
          <h1 className="max-w-2xl text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl">Reliable appliance repair, close to home.</h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">Find verified technicians, get clear estimates, and keep your repair moving with confidence.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/customer/repairs/new" className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700">Book a repair</Link>
            <Link to="/register" className="rounded-lg border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 hover:bg-slate-50">Join as a technician</Link>
          </div>
        </div>
        <div className="rounded-2xl border border-blue-100 bg-blue-50 p-8">
          <p className="text-sm font-semibold text-blue-700">Phase 0 workspace</p>
          <h2 className="mt-3 text-2xl font-bold">Your repair journey starts here.</h2>
          <p className="mt-3 leading-7 text-slate-600">The app shell is ready for authentication, diagnosis, technician discovery, and booking in the next phases.</p>
          <p className="mt-6 text-sm font-semibold" aria-live="polite">
            <span className={apiStatus === 'connected' ? 'text-green-600' : apiStatus === 'unavailable' ? 'text-red-600' : 'text-slate-500'}>
              {apiStatus === 'checking' && 'Checking API connection…'}
              {apiStatus === 'connected' && 'API connected'}
              {apiStatus === 'unavailable' && 'API unavailable — check the backend'}
            </span>
          </p>
        </div>
      </section>
    </main>
  )
}

function Placeholder() {
  const { pathname } = useLocation()
  const label = routeLabels[pathname] || 'Page'
  const role = pathname.startsWith('/technician') ? 'Technician' : pathname.startsWith('/customer') ? 'Customer' : 'Public'
  return (
    <main className="mx-auto max-w-3xl px-6 py-20">
      <p className="text-sm font-semibold text-blue-600">{role} workspace</p>
      <h1 className="mt-3 text-4xl font-bold">{label}</h1>
      <p className="mt-4 text-lg text-slate-600">This route is reserved for the next implementation phase.</p>
      <Link to="/" className="mt-8 inline-block rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700">Back to home</Link>
    </main>
  )
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/" element={<Landing />} />
        <Route path="*" element={<Placeholder />} />
      </Route>
    </Routes>
  )
}
