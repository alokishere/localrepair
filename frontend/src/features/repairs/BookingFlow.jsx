import { useCallback, useEffect, useState } from "react"
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom"
import api from "../../services/api"
import { useAuth } from "../../context/useAuth"
import { useToast } from "../../context/ToastContext"
import { StatusBadge, EmptyState } from "../../components/ui"

function ErrorBox({ message, onRetry }) {
  return (
    <div role="alert" className="rounded-[var(--radius-sm)] bg-[var(--color-danger-light)] p-4 text-sm text-[var(--color-danger)]">
      {message}
      {onRetry && (
        <button onClick={onRetry} className="ml-3 font-semibold underline hover:text-[var(--color-ink)]">
          Try again
        </button>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   BOOKING PAGE (Create Booking)
   ═══════════════════════════════════════════════════════════════ */

export function BookingPage() {
  const { technicianId } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const toast = useToast()
  const [technician, setTechnician] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [form, setForm] = useState({
    categoryId: "",
    service: "",
    appliance: searchParams.get("category") || "",
    problem: searchParams.get("problem") || "",
    date: "",
    time: "",
    fullAddress: "",
    city: "",
    state: "",
    pincode: "",
    phone: user?.phone || "",
    notes: "",
  })

  const load = useCallback(async () => {
    setLoading(true)
    setError("")
    try {
      const [technicianResponse, categoryResponse] = await Promise.all([
        api.get(`/technicians/${technicianId}`),
        api.get("/categories"),
      ])
      const profile = technicianResponse.data.data.technician
      const categoryList = categoryResponse.data.data.categories
      const selectedSlug = searchParams.get("category") || profile.serviceCategories[0]?.slug
      const selectedCategory =
        categoryList.find((c) => c.slug === selectedSlug) ||
        categoryList.find((c) => profile.serviceCategories.some((s) => s.slug === c.slug))
      setTechnician(profile)
      setForm((current) => ({
        ...current,
        categoryId: selectedCategory?._id || "",
        service: selectedCategory ? `${selectedCategory.name} repair` : "Appliance repair",
        appliance: selectedCategory?.name || current.appliance,
        problem: searchParams.get("problem") || current.problem,
      }))
    } catch (requestError) {
      setError(requestError.response?.data?.message === "Technician not found" ? "Technician not found." : "Unable to load this technician. Please try again.")
    } finally {
      setLoading(false)
    }
  }, [technicianId, searchParams])

  useEffect(() => { load() }, [load])

  const update = (field) => (event) => setForm((current) => ({ ...current, [field]: event.target.value }))

  const submit = async (event) => {
    event.preventDefault()
    setError("")
    setSubmitting(true)
    try {
      const { data } = await api.post("/repairs", {
        technicianId,
        categoryId: form.categoryId,
        title: form.service,
        problemDescription: form.problem,
        preferredDate: form.date,
        preferredTime: form.time,
        address: { fullAddress: form.fullAddress, city: form.city, state: form.state, pincode: form.pincode },
        phone: form.phone,
        customerNotes: form.notes,
      })
      toast.success("Booking created successfully!")
      navigate(`/customer/repairs/${data.data.repair.id}`)
    } catch (requestError) {
      const msg = requestError.response?.data?.message || "Unable to create booking. Please try again."
      setError(msg)
      toast.error(msg)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <main className="section-container max-w-3xl px-6 py-12">
        <div className="skeleton h-96 rounded-[var(--radius-lg)]" />
      </main>
    )
  }

  if (error && !technician) {
    return (
      <main className="section-container max-w-3xl px-6 py-12">
        <ErrorBox message={error} onRetry={load} />
        <Link to="/technicians" className="btn-ghost mt-6 text-[var(--color-primary)]">&larr; Back to technicians</Link>
      </main>
    )
  }

  return (
    <main className="section-container max-w-3xl px-6 py-12">
      <Link to={`/technicians/${technicianId}`} className="btn-ghost text-[var(--color-primary)]">
        &larr; Back to technician
      </Link>
      <div className="mt-6">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-[var(--color-primary)]">Book a repair</p>
        <h1 className="mt-3 text-4xl font-bold" style={{ lineHeight: 1.2 }}>Schedule service with {technician.name}</h1>
        <p className="mt-3 text-[var(--color-ink-secondary)]">Your request will be created as Searching until the technician confirms.</p>
      </div>

      <form onSubmit={submit} className="mt-8 space-y-6">
        {/* Service Details */}
        <section className="card">
          <h2 className="text-lg font-bold text-[var(--color-ink)]">Service details</h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <label className="block text-sm font-medium text-[var(--color-ink)]">
              Service
              <input required value={form.service} onChange={update("service")} className="input mt-2" />
            </label>
            <label className="block text-sm font-medium text-[var(--color-ink)]">
              Appliance
              <input required value={form.appliance} onChange={update("appliance")} className="input mt-2" />
            </label>
            <label className="block text-sm font-medium text-[var(--color-ink)] sm:col-span-2">
              Problem
              <textarea required minLength="5" value={form.problem} onChange={update("problem")} rows="3" className="input mt-2 min-h-[80px] resize-y" />
            </label>
          </div>
        </section>

        {/* Date & Time */}
        <section className="card">
          <h2 className="text-lg font-bold text-[var(--color-ink)]">Date & time</h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <label className="block text-sm font-medium text-[var(--color-ink)]">
              Date
              <input required type="date" min={new Date().toISOString().slice(0, 10)} value={form.date} onChange={update("date")} className="input mt-2" />
            </label>
            <label className="block text-sm font-medium text-[var(--color-ink)]">
              Time
              <input required type="time" value={form.time} onChange={update("time")} className="input mt-2" />
            </label>
          </div>
        </section>

        {/* Address */}
        <section className="card">
          <h2 className="text-lg font-bold text-[var(--color-ink)]">Address</h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <label className="block text-sm font-medium text-[var(--color-ink)] sm:col-span-2">
              Full address
              <textarea required value={form.fullAddress} onChange={update("fullAddress")} rows="2" className="input mt-2 min-h-[60px] resize-y" />
            </label>
            <label className="block text-sm font-medium text-[var(--color-ink)]">
              City
              <input required value={form.city} onChange={update("city")} className="input mt-2" />
            </label>
            <label className="block text-sm font-medium text-[var(--color-ink)]">
              State
              <input required value={form.state} onChange={update("state")} className="input mt-2" />
            </label>
            <label className="block text-sm font-medium text-[var(--color-ink)]">
              Pincode
              <input required pattern="[0-9]{4,10}" value={form.pincode} onChange={update("pincode")} className="input mt-2" />
            </label>
          </div>
        </section>

        {/* Contact */}
        <section className="card">
          <h2 className="text-lg font-bold text-[var(--color-ink)]">Contact & notes</h2>
          <div className="mt-5 space-y-5">
            <label className="block text-sm font-medium text-[var(--color-ink)]">
              Phone
              <input required pattern="[+0-9][0-9\s-]{7,19}" value={form.phone} onChange={update("phone")} className="input mt-2" />
            </label>
            <label className="block text-sm font-medium text-[var(--color-ink)]">
              Notes <span className="font-normal text-[var(--color-ink-muted)]">(optional)</span>
              <textarea value={form.notes} onChange={update("notes")} rows="3" placeholder="Please call before arriving" className="input mt-2 min-h-[80px] resize-y" />
            </label>
          </div>
        </section>

        {error && <ErrorBox message={error} />}

        <button disabled={submitting} className="btn-primary w-full">
          {submitting ? "Creating your booking..." : "Confirm booking"}
        </button>
      </form>
    </main>
  )
}

/* ═══════════════════════════════════════════════════════════════
   BOOKING LIST PAGE
   ═══════════════════════════════════════════════════════════════ */

function BookingCard({ repair }) {
  return (
    <Link
      to={`/customer/repairs/${repair.id}`}
      className="block rounded-[var(--radius-sm)] bg-[var(--color-bg)] p-5 transition-colors hover:bg-[var(--color-surface)]"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-bold text-[var(--color-ink)]">{repair.title}</h2>
          <p className="mt-1 text-sm text-[var(--color-ink-muted)]">{repair.technician?.name || "Technician pending"}</p>
        </div>
        <StatusBadge status={repair.status} className="shrink-0 self-start" />
      </div>
      <p className="mt-4 text-sm text-[var(--color-ink-secondary)]">
        {repair.preferredDate?.slice(0, 10)} · {repair.preferredTime}
      </p>
    </Link>
  )
}

export function BookingListPage() {
  const [repairs, setRepairs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await api.get("/repairs")
      setRepairs(data.data.repairs)
    } catch {
      setError("Unable to load your bookings. Please try again.")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  return (
    <main className="section-container max-w-4xl px-6 py-12">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[var(--color-primary)]">Customer bookings</p>
          <h1 className="mt-3 text-4xl font-bold" style={{ lineHeight: 1.2 }}>Your repairs</h1>
        </div>
        <Link to="/diagnosis" className="btn-primary inline-flex shrink-0">
          Book a repair
        </Link>
      </div>

      {loading ? (
        <div className="mt-8">
          <div className="skeleton h-48 rounded-[var(--radius-lg)]" />
        </div>
      ) : error ? (
        <div className="mt-8">
          <ErrorBox message={error} onRetry={load} />
        </div>
      ) : repairs.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            title="You don't have any bookings yet."
            description="Start by diagnosing an appliance issue to find the right technician."
            actionLabel="Start a diagnosis"
            actionTo="/diagnosis"
            icon="🔧"
          />
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {repairs.map((repair) => (
            <BookingCard key={repair.id} repair={repair} />
          ))}
        </div>
      )}
    </main>
  )
}

/* ═══════════════════════════════════════════════════════════════
   REVIEW FORM
   ═══════════════════════════════════════════════════════════════ */

function ReviewForm({ repairId, onSubmitted }) {
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const toast = useToast()

  const submit = async (event) => {
    event.preventDefault()
    setSubmitting(true)
    setError("")
    try {
      const { data } = await api.post(`/repairs/${repairId}/review`, { rating, comment })
      toast.success("Review submitted. Thank you!")
      onSubmitted(data.data.review)
    } catch (requestError) {
      const msg = requestError.response?.data?.message || "Unable to submit your review. Please try again."
      setError(msg)
      toast.error(msg)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="mt-6 rounded-[var(--radius-lg)] bg-[var(--color-surface)] p-6">
      <h2 className="text-xl font-bold text-[var(--color-ink)]">How was your repair?</h2>
      <p className="mt-2 text-sm text-[var(--color-ink-secondary)]">Your feedback helps other customers choose with confidence.</p>
      <form onSubmit={submit} className="mt-5">
        <div className="flex gap-1" aria-label="Rating">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              type="button"
              key={value}
              aria-label={`${value} star${value > 1 ? "s" : ""}`}
              onClick={() => setRating(value)}
              className={`text-3xl transition-colors focus-visible:outline-none ${value <= rating ? "text-[var(--color-warning)]" : "text-[var(--color-ink-muted)]"}`}
            >
              ★
            </button>
          ))}
        </div>
        <label className="mt-4 block text-sm font-medium text-[var(--color-ink)]">
          Comment <span className="font-normal text-[var(--color-ink-muted)]">(optional)</span>
          <textarea
            maxLength="1000"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows="3"
            className="input mt-2 min-h-[80px] resize-y"
            placeholder="Share a few words about the service"
          />
        </label>
        {error && <p role="alert" className="mt-3 text-sm text-[var(--color-danger)]">{error}</p>}
        <button disabled={submitting} className="btn-primary btn-sm mt-4">
          {submitting ? "Submitting..." : "Submit review"}
        </button>
      </form>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════
   BOOKING DETAIL PAGE
   ═══════════════════════════════════════════════════════════════ */

export function BookingDetailPage() {
  const { id } = useParams()
  const [repair, setRepair] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await api.get(`/repairs/${id}`)
      setRepair(data.data.repair)
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to load this booking")
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => { load() }, [load])

  if (loading) {
    return (
      <main className="section-container max-w-3xl px-6 py-12">
        <div className="skeleton h-96 rounded-[var(--radius-lg)]" />
      </main>
    )
  }

  if (error) {
    return (
      <main className="section-container max-w-3xl px-6 py-12">
        <ErrorBox message={error} onRetry={load} />
      </main>
    )
  }

  return (
    <main className="section-container max-w-3xl px-6 py-12">
      {/* ── Confirmation Banner ── */}
      <div className="rounded-[var(--radius-lg)] bg-[var(--color-success-light)] p-6">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-[var(--color-success)]">
          ✓ Booking confirmed
        </p>
        <h1 className="mt-3 text-3xl font-bold text-[var(--color-ink)]" style={{ lineHeight: 1.2 }}>
          Your repair request is saved
        </h1>
        <p className="mt-2 text-[var(--color-ink-secondary)]">
          Booking ID:{" "}
          <span className="font-mono font-semibold">{String(repair.id).slice(-8).toUpperCase()}</span>
        </p>
      </div>

      {/* ── Repair Details ── */}
      <section className="card mt-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-[var(--color-ink)]">{repair.title}</h2>
            <p className="mt-1 text-[var(--color-ink-secondary)]">
              {repair.technician?.name || "Technician pending confirmation"}
            </p>
          </div>
          <StatusBadge status={repair.status} className="shrink-0" />
        </div>
        <dl className="mt-6 grid gap-4 text-sm sm:grid-cols-2">
          <div>
            <dt className="font-medium text-[var(--color-ink-muted)]">Problem</dt>
            <dd className="mt-1 text-[var(--color-ink-secondary)]">{repair.problemDescription}</dd>
          </div>
          <div>
            <dt className="font-medium text-[var(--color-ink-muted)]">Date & time</dt>
            <dd className="mt-1 text-[var(--color-ink-secondary)]">{repair.preferredDate?.slice(0, 10)} · {repair.preferredTime}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="font-medium text-[var(--color-ink-muted)]">Address</dt>
            <dd className="mt-1 text-[var(--color-ink-secondary)]">
              {repair.address?.fullAddress}, {repair.address?.city}, {repair.address?.state} {repair.address?.pincode}
            </dd>
          </div>
          <div>
            <dt className="font-medium text-[var(--color-ink-muted)]">Estimated cost</dt>
            <dd className="mt-1 text-[var(--color-ink-secondary)]">
              {repair.estimatedCost ? `₹${repair.estimatedCost.toLocaleString("en-IN")}` : "To be confirmed after inspection"}
            </dd>
          </div>
        </dl>
      </section>

      {/* ── Review Section ── */}
      {repair.status === "COMPLETED" && (
        repair.review ? (
          <section className="mt-6 rounded-[var(--radius-lg)] bg-[var(--color-success-light)] p-6">
            <p className="font-bold text-[var(--color-success)]">Your review</p>
            <p className="mt-2 text-[var(--color-warning)]">
              {"★".repeat(repair.review.rating)}
              <span className="ml-2 text-[var(--color-ink)]">
                {repair.review.comment || "Thanks for your feedback."}
              </span>
            </p>
            {repair.review.createdAt && (
              <p className="mt-2 text-xs text-[var(--color-ink-muted)]">
                {new Date(repair.review.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
              </p>
            )}
          </section>
        ) : (
          <ReviewForm repairId={repair.id} onSubmitted={(review) => setRepair((current) => ({ ...current, review }))} />
        )
      )}

      <Link to="/customer/repairs" className="btn-ghost mt-6 text-[var(--color-primary)]">
        View all bookings &rarr;
      </Link>
    </main>
  )
}
