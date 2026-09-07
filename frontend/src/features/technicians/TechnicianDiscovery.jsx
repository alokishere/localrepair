import { useCallback, useEffect, useState } from "react"
import { Link, useParams, useSearchParams } from "react-router-dom"
import api from "../../services/api"
import { Avatar, Badge, Select } from "../../components/ui"

function ErrorState({ message, onRetry }) {
  return (
    <div className="rounded-[var(--radius-lg)] bg-[var(--color-danger-light)] p-6 text-[var(--color-danger)]" role="alert">
      <p>{message}</p>
      <button onClick={onRetry} className="btn-secondary btn-sm mt-4 text-[var(--color-danger)]">
        Try again
      </button>
    </div>
  )
}

function TechnicianCard({ technician }) {
  return (
    <article className="card flex h-full flex-col rounded-[var(--radius-lg)] p-6 transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-card-hover)]">
      <div className="flex items-start gap-4">
        <Avatar src={technician.avatar} name={technician.name} size="lg" />
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-lg font-bold text-[var(--color-ink)]">{technician.name}</h2>
          <p className="mt-1 text-sm text-[var(--color-ink-muted)]">
            {technician.serviceArea || "Local service area"}
          </p>
        </div>
        <Badge variant="success">Verified</Badge>
      </div>
      <div className="mt-5 flex flex-wrap gap-2 text-sm">
        <Badge variant="warning">
          ★ {technician.ratingAverage.toFixed(1)} ({technician.totalReviews})
        </Badge>
        <Badge variant="default">
          {technician.completedJobs} jobs
        </Badge>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {technician.serviceCategories.slice(0, 3).map((category) => (
          <Badge key={category.id} variant="primary">{category.name}</Badge>
        ))}
      </div>
      <Link
        to={`/technicians/${technician.id}`}
        className="mt-auto pt-6 font-semibold text-[var(--color-primary)] hover:underline focus-visible:outline-none"
      >
        View profile &rarr;
      </Link>
    </article>
  )
}

export function TechnicianListPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const requestedCategory = searchParams.get("category") || ""
  const [categories, setCategories] = useState([])
  const [categoryId, setCategoryId] = useState("")
  const [technicians, setTechnicians] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const load = useCallback(async () => {
    setLoading(true)
    setError("")
    try {
      const categoryResponse = await api.get("/categories")
      const availableCategories = categoryResponse.data.data.categories
      const queryCategory =
        categoryId ||
        availableCategories.find((c) => c.slug === requestedCategory)?._id ||
        ""
      if (queryCategory && !categoryId) setCategoryId(queryCategory)
      const technicianResponse = await api.get("/technicians", {
        params: queryCategory ? { categoryId: queryCategory } : {},
      })
      setCategories(availableCategories)
      setTechnicians(technicianResponse.data.data.technicians)
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Technicians could not be loaded")
    } finally {
      setLoading(false)
    }
  }, [categoryId, requestedCategory])

  useEffect(() => { load() }, [load])

  return (
    <main className="section-container px-6 py-12">
      <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[var(--color-primary)]">Technician discovery</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight" style={{ lineHeight: 1.15 }}>
            Find a verified local technician
          </h1>
          <p className="mt-3 max-w-2xl text-[var(--color-ink-secondary)]">
            Compare ratings, experience, service categories, and local coverage before you choose.
          </p>
        </div>
        <Select
          value={categoryId}
          onChange={(event) => {
            const value = event.target.value
            setCategoryId(value)
            const selected = categories.find((c) => c._id === value)
            setSearchParams(selected ? { category: selected.slug } : {})
          }}
          className="min-w-56"
        >
          <option value="">All categories</option>
          {categories.map((category) => (
            <option key={category._id} value={category._id}>{category.name}</option>
          ))}
        </Select>
      </div>

      {loading ? (
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton h-64 rounded-[var(--radius-lg)]" />
          ))}
        </div>
      ) : error ? (
        <div className="mt-10">
          <ErrorState message={error} onRetry={load} />
        </div>
      ) : technicians.length === 0 ? (
        <div className="mt-10 rounded-[var(--radius-lg)] border-2 border-dashed border-[var(--color-border)] bg-[var(--color-bg)] p-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-surface-light)]">
            <span className="text-2xl text-[var(--color-ink-muted)]" aria-hidden="true">🔍</span>
          </div>
          <h2 className="text-xl font-bold text-[var(--color-ink)]">No matching technicians yet</h2>
          <p className="mt-2 text-[var(--color-ink-secondary)]">Try another category or check back soon.</p>
        </div>
      ) : (
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {technicians.map((technician) => (
            <TechnicianCard key={technician.id} technician={technician} />
          ))}
        </div>
      )}
    </main>
  )
}

export function TechnicianProfilePage() {
  const { id } = useParams()
  const [profileSearchParams] = useSearchParams()
  const [technician, setTechnician] = useState(null)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const load = useCallback(async () => {
    setLoading(true)
    setError("")
    try {
      const { data } = await api.get(`/technicians/${id}`)
      setTechnician(data.data.technician)
      setReviews(data.data.reviews || [])
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Technician profile could not be loaded")
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => { load() }, [load])

  if (loading) {
    return (
      <main className="section-container max-w-4xl px-6 py-12">
        <div className="skeleton h-80 rounded-[var(--radius-lg)]" />
      </main>
    )
  }

  if (error) {
    return (
      <main className="section-container max-w-4xl px-6 py-12">
        <ErrorState message={error} onRetry={load} />
        <Link to="/technicians" className="btn-ghost mt-6 text-[var(--color-primary)]">
          &larr; Back to technicians
        </Link>
      </main>
    )
  }

  const bookingCategory = profileSearchParams.get("category") || technician.serviceCategories[0]?.slug || ""
  const bookingProblem = profileSearchParams.get("problem") || ""

  return (
    <main className="section-container max-w-4xl px-6 py-12">
      <Link to="/technicians" className="btn-ghost text-[var(--color-primary)]">
        &larr; Back to technicians
      </Link>

      {/* ── Profile Card ── */}
      <section className="card mt-6 p-6 sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
          <Avatar src={technician.avatar} name={technician.name} size="xl" />
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-bold text-[var(--color-ink)]" style={{ lineHeight: 1.2 }}>{technician.name}</h1>
              <Badge variant="success">Verified</Badge>
            </div>
            <p className="mt-2 text-[var(--color-ink-secondary)]">
              {technician.serviceArea || "Local service area"}
            </p>
            <div className="mt-4 flex flex-wrap gap-2 text-sm">
              <Badge variant="warning">★ {technician.ratingAverage.toFixed(1)} ({technician.totalReviews} reviews)</Badge>
              <Badge variant="default">{technician.experienceYears || 0} years experience</Badge>
              <Badge variant="default">{technician.completedJobs} completed jobs</Badge>
            </div>
            <Link
              to={`/booking/${technician.id}?category=${bookingCategory}${bookingProblem ? `&problem=${encodeURIComponent(bookingProblem)}` : ""}`}
              className="btn-primary mt-5 inline-flex"
            >
              Book this service
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>

        <p className="mt-8 text-[var(--color-ink-secondary)]" style={{ lineHeight: 1.6 }}>
          {technician.bio || "A verified LocalRepair technician ready to help with your appliance service needs."}
        </p>

        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <div>
            <h2 className="font-bold text-[var(--color-ink)]">Services</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {technician.serviceCategories.map((category) => (
                <Badge key={category.id} variant="primary">{category.name}</Badge>
              ))}
            </div>
          </div>
          <div>
            <h2 className="font-bold text-[var(--color-ink)]">Skills</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {technician.skills.length ? (
                technician.skills.map((skill) => (
                  <Badge key={skill} variant="default">{skill}</Badge>
                ))
              ) : (
                <span className="text-sm text-[var(--color-ink-muted)]">Profile skills coming soon</span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Reviews ── */}
      <section className="mt-8">
        <h2 className="text-2xl font-bold text-[var(--color-ink)]">Recent reviews</h2>
        {reviews.length ? (
          <div className="mt-4 space-y-4">
            {reviews.map((review) => (
              <article key={review.id} className="card p-5">
                <p className="font-semibold text-[var(--color-warning)]">
                  {"★".repeat(review.rating)}
                  <span className="ml-2 text-[var(--color-ink-secondary)]">
                    {review.customer?.name || "Customer"}
                  </span>
                </p>
                <p className="mt-2 text-[var(--color-ink-secondary)]">
                  {review.comment || "No written comment."}
                </p>
                {review.createdAt && (
                  <p className="mt-2 text-xs text-[var(--color-ink-muted)]">
                    {new Date(review.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                )}
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-4 rounded-[var(--radius-sm)] border-2 border-dashed border-[var(--color-border)] p-6 text-center">
            <p className="text-[var(--color-ink-muted)]">No reviews yet.</p>
          </div>
        )}
      </section>
    </main>
  )
}
