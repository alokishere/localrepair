import { useCallback, useEffect, useState } from "react"
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom"
import api from "../../services/api"
import { useAuth } from "../../context/useAuth"
import { useToast } from "../../context/ToastContext"
import { StatusBadge } from "../../components/ui"

function ErrorBox({ message, onRetry }) {
  return (
    <div
      role="alert"
      className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
    >
      {message}
      {onRetry && (
        <button onClick={onRetry} className="ml-3 font-semibold underline hover:text-red-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2">
          Try again
        </button>
      )}
    </div>
  )
}

export function BookingPage() {
  const { technicianId } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const toast = useToast()
  const [technician, setTechnician] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("");
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
  });
  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [technicianResponse, categoryResponse] = await Promise.all([
        api.get(`/technicians/${technicianId}`),
        api.get("/categories"),
      ]);
      const profile = technicianResponse.data.data.technician;
      const categoryList = categoryResponse.data.data.categories;
      const selectedSlug =
        searchParams.get("category") || profile.serviceCategories[0]?.slug;
      const selectedCategory =
        categoryList.find((category) => category.slug === selectedSlug) ||
        categoryList.find((category) =>
          profile.serviceCategories.some((item) => item.slug === category.slug),
        );
      setTechnician(profile);
      setForm((current) => ({
        ...current,
        categoryId: selectedCategory?._id || "",
        service: selectedCategory
          ? `${selectedCategory.name} repair`
          : "Appliance repair",
        appliance: selectedCategory?.name || current.appliance,
        problem: searchParams.get("problem") || current.problem,
      }));
    } catch (requestError) {
      setError(
        requestError.response?.data?.message === "Technician not found"
          ? "Technician not found."
          : "Unable to load this technician. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }, [technicianId, searchParams]);
  useEffect(() => {
    load();
  }, [load]);
  const update = (field) => (event) =>
    setForm((current) => ({ ...current, [field]: event.target.value }));
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
        address: {
          fullAddress: form.fullAddress,
          city: form.city,
          state: form.state,
          pincode: form.pincode,
        },
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
  if (loading)
    return (
      <main className="mx-auto max-w-3xl px-6 py-12">
        <div className="h-96 animate-pulse rounded-2xl bg-white" />
      </main>
    );
  if (error && !technician)
    return (
      <main className="mx-auto max-w-3xl px-6 py-12">
        <ErrorBox message={error} onRetry={load} />
        <Link
          to="/technicians"
          className="mt-6 inline-block font-semibold text-blue-600"
        >
          ← Back to technicians
        </Link>
      </main>
    );
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <Link
        to={`/technicians/${technicianId}`}
        className="font-semibold text-blue-600"
      >
        ← Back to technician
      </Link>
      <div className="mt-6">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-600">
          Book a repair
        </p>
        <h1 className="mt-3 text-4xl font-bold">
          Schedule service with {technician.name}
        </h1>
        <p className="mt-3 text-slate-600">
          Your request will be created as Searching until the technician
          confirms.
        </p>
      </div>
      <form onSubmit={submit} className="mt-8 space-y-8">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold">Service details</h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <label className="block text-sm font-semibold">
              Service
              <input
                required
                value={form.service}
                onChange={update("service")}
                className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-3 font-normal focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </label>
            <label className="block text-sm font-semibold">
              Appliance
              <input
                required
                value={form.appliance}
                onChange={update("appliance")}
                className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-3 font-normal focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </label>
            <label className="block text-sm font-semibold sm:col-span-2">
              Problem
              <textarea
                required
                minLength="5"
                value={form.problem}
                onChange={update("problem")}
                rows="3"
                className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-3 font-normal focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </label>
          </div>
        </section>
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold">Date & time</h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <label className="block text-sm font-semibold">
              Date
              <input
                required
                type="date"
                min={new Date().toISOString().slice(0, 10)}
                value={form.date}
                onChange={update("date")}
                className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-3 font-normal focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </label>
            <label className="block text-sm font-semibold">
              Time
              <input
                required
                type="time"
                value={form.time}
                onChange={update("time")}
                className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-3 font-normal focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </label>
          </div>
        </section>
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold">Address</h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <label className="block text-sm font-semibold sm:col-span-2">
              Full address
              <textarea
                required
                value={form.fullAddress}
                onChange={update("fullAddress")}
                rows="2"
                className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-3 font-normal focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </label>
            <label className="block text-sm font-semibold">
              City
              <input
                required
                value={form.city}
                onChange={update("city")}
                className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-3 font-normal focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </label>
            <label className="block text-sm font-semibold">
              State
              <input
                required
                value={form.state}
                onChange={update("state")}
                className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-3 font-normal focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </label>
            <label className="block text-sm font-semibold">
              Pincode
              <input
                required
                pattern="[0-9]{4,10}"
                value={form.pincode}
                onChange={update("pincode")}
                className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-3 font-normal focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </label>
          </div>
        </section>
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold">Contact & notes</h2>
          <div className="mt-5 space-y-5">
            <label className="block text-sm font-semibold">
              Phone
              <input
                required
                pattern="[+0-9][0-9\s-]{7,19}"
                value={form.phone}
                onChange={update("phone")}
                className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-3 font-normal focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </label>
            <label className="block text-sm font-semibold">
              Notes{" "}
              <span className="font-normal text-slate-500">(optional)</span>
              <textarea
                value={form.notes}
                onChange={update("notes")}
                rows="3"
                placeholder="Please call before arriving"
                className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-3 font-normal focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </label>
          </div>
        </section>
        {error && <ErrorBox message={error} />}
        <button
          disabled={submitting}
          className="min-h-12 w-full rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
        >
          {submitting ? "Creating your booking…" : "Confirm booking"}
        </button>
      </form>
    </main>
  );
}

function BookingCard({ repair }) {
  return (
    <Link
      to={`/customer/repairs/${repair.id}`}
      className="block rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-bold">{repair.title}</h2>
          <p className="mt-1 text-sm text-slate-500">
            {repair.technician?.name || "Technician pending"}
          </p>
        </div>
        <StatusBadge status={repair.status} className="shrink-0 self-start" />
      </div>
      <p className="mt-4 text-sm text-slate-600">
        {repair.preferredDate?.slice(0, 10)} · {repair.preferredTime}
      </p>
    </Link>
  );
}

export function BookingListPage() {
  const [repairs, setRepairs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/repairs");
      setRepairs(data.data.repairs);
    } catch {
      setError("Unable to load your bookings. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    load();
  }, [load]);
  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-600">
            Customer bookings
          </p>
          <h1 className="mt-3 text-4xl font-bold">Your repairs</h1>
        </div>
        <Link
          to="/diagnosis"
          className="inline-flex items-center rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
        >
          Book a repair
        </Link>
      </div>
      {loading ? (
        <div className="mt-8 h-48 animate-pulse rounded-xl bg-white" />
      ) : error ? (
        <div className="mt-8">
          <ErrorBox message={error} onRetry={load} />
        </div>
      ) : repairs.length === 0 ? (
        <div className="mt-8 rounded-2xl border-2 border-dashed border-slate-200 bg-white p-12 text-center">
          <div className="mx-auto mb-4 text-4xl text-slate-300" aria-hidden="true">🔧</div>
          <h2 className="font-bold text-slate-800">You don't have any bookings yet.</h2>
          <p className="mt-2 text-slate-500">Start by diagnosing an appliance issue to find the right technician.</p>
          <Link
            to="/diagnosis"
            className="mt-6 inline-flex items-center rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
          >
            Start a diagnosis
          </Link>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {repairs.map((repair) => (
            <BookingCard key={repair.id} repair={repair} />
          ))}
        </div>
      )}
    </main>
  );
}

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
      const { data } = await api.post(`/repairs/${repairId}/review`, {
        rating,
        comment,
      })
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
    <section className="mt-6 rounded-2xl border border-blue-100 bg-blue-50 p-6">
      <h2 className="text-xl font-bold">How was your repair?</h2>
      <p className="mt-2 text-sm text-slate-600">
        Your feedback helps other customers choose with confidence.
      </p>
      <form onSubmit={submit} className="mt-5">
        <div className="flex gap-2" aria-label="Rating">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                type="button"
                key={value}
                aria-label={`${value} star${value > 1 ? "s" : ""}`}
                onClick={() => setRating(value)}
                className={`text-3xl transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 ${value <= rating ? "text-amber-500" : "text-slate-300"}`}
              >
                ★
              </button>
            ))}
        </div>
        <label className="mt-4 block text-sm font-semibold">
          Comment <span className="font-normal text-slate-500">(optional)</span>
          <textarea
            maxLength="1000"
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            rows="3"
            className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-3 font-normal focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            placeholder="Share a few words about the service"
          />
        </label>
        {error && (
          <p role="alert" className="mt-3 text-sm text-red-700">
            {error}
          </p>
        )}
        <button
          disabled={submitting}
          className="mt-4 min-h-11 rounded-xl bg-blue-600 px-5 py-2 font-semibold text-white hover:bg-blue-700 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
        >
          {submitting ? "Submitting…" : "Submit review"}
        </button>
      </form>
    </section>
  );
}

export function BookingDetailPage() {
  const { id } = useParams();
  const [repair, setRepair] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/repairs/${id}`);
      setRepair(data.data.repair);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message || "Unable to load this booking",
      );
    } finally {
      setLoading(false);
    }
  }, [id]);
  useEffect(() => {
    load();
  }, [load]);
  if (loading)
    return (
      <main className="mx-auto max-w-3xl px-6 py-12">
        <div className="h-96 animate-pulse rounded-2xl bg-white" />
      </main>
    );
  if (error)
    return (
      <main className="mx-auto max-w-3xl px-6 py-12">
        <ErrorBox message={error} onRetry={load} />
      </main>
    );
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <div className="rounded-2xl border border-green-200 bg-green-50 p-6">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-green-700">
          ✓ Booking confirmed
        </p>
        <h1 className="mt-3 text-3xl font-bold">
          Your repair request is saved
        </h1>
        <p className="mt-2 text-slate-600">
          Booking ID:{" "}
          <span className="font-mono font-semibold">
            {String(repair.id).slice(-8).toUpperCase()}
          </span>
        </p>
      </div>
      <section className="mt-6 space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold">{repair.title}</h2>
            <p className="mt-1 text-slate-600">
              {repair.technician?.name || "Technician pending confirmation"}
            </p>
          </div>
          <StatusBadge status={repair.status} className="shrink-0" />
        </div>
        <dl className="grid gap-4 text-sm sm:grid-cols-2">
          <div>
            <dt className="font-semibold text-slate-500">Problem</dt>
            <dd className="mt-1">{repair.problemDescription}</dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-500">Date & time</dt>
            <dd className="mt-1">
              {repair.preferredDate?.slice(0, 10)} · {repair.preferredTime}
            </dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="font-semibold text-slate-500">Address</dt>
            <dd className="mt-1">
              {repair.address?.fullAddress}, {repair.address?.city},{" "}
              {repair.address?.state} {repair.address?.pincode}
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-500">Estimated cost</dt>
            <dd className="mt-1">
              {repair.estimatedCost
                ? `₹${repair.estimatedCost.toLocaleString("en-IN")}`
                : "To be confirmed after inspection"}
            </dd>
          </div>
        </dl>
      </section>
      {repair.status === "COMPLETED" &&
        (repair.review ? (
          <section className="mt-6 rounded-2xl border border-green-200 bg-green-50 p-6">
            <p className="font-bold text-green-800">Your review</p>
            <p className="mt-2 text-amber-600">
              {"★".repeat(repair.review.rating)}
              <span className="ml-2 text-slate-700">
                {repair.review.comment || "Thanks for your feedback."}
              </span>
            </p>
            {repair.review.createdAt && (
              <p className="mt-2 text-xs text-slate-400">
                {new Date(repair.review.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            )}
          </section>
        ) : (
          <ReviewForm
            repairId={repair.id}
            onSubmitted={(review) =>
              setRepair((current) => ({ ...current, review }))
            }
          />
        ))}
      <Link
        to="/customer/repairs"
        className="mt-6 inline-flex items-center font-semibold text-blue-600 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
      >
        View all bookings →
      </Link>
    </main>
  );
}
