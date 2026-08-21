import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import api from "../../services/api"
import { useAuth } from "../../context/useAuth"
import { useToast } from "../../context/ToastContext"

const inputClass = "mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-3 font-normal focus:border-blue-500 focus:ring-1 focus:ring-blue-500"

function Field({ label, name, value, onChange, type = "text", required = false, disabled = false, placeholder }) {
  return (
    <label className="block text-sm font-semibold">
      {label}
      <input
        required={required}
        disabled={disabled}
        type={type}
        value={value ?? ""}
        placeholder={placeholder}
        onChange={(e) => onChange(name, e.target.value)}
        className={`${inputClass} disabled:bg-slate-100 disabled:text-slate-500`}
      />
    </label>
  )
}

export default function ProfilePage() {
  const { user, refreshUser } = useAuth()
  const toast = useToast()
  const [categories, setCategories] = useState([])
  const [profile, setProfile] = useState(null)
  const [form, setForm] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    Promise.all([
      api.get("/users/me"),
      user?.role === "TECHNICIAN" ? api.get("/categories") : Promise.resolve({ data: { data: { categories: [] } } }),
    ])
      .then(([profileResponse, categoryResponse]) => {
        const data = profileResponse.data.data
        setProfile(data)
        setCategories(categoryResponse.data.data.categories)
        const technician = data.technicianProfile || {}
        setForm({
          ...data.user,
          serviceArea: technician.serviceArea || "",
          city: technician.city || data.user.city || "",
          pincode: technician.pincode || data.user.pincode || "",
          experienceYears: technician.experienceYears ?? "",
          startingPrice: technician.startingPrice ?? "",
          skills: (technician.skills || []).join(", "),
          serviceCategoryIds: (technician.serviceCategories || []).map((item) => item._id || item.id),
          isAvailable: technician.isAvailable ?? true,
        })
      })
      .catch((e) => setError(e.response?.data?.message || "Unable to load your profile"))
      .finally(() => setLoading(false))
  }, [user?.role])

  const update = (name, value) => setForm((current) => ({ ...current, [name]: value }))

  const save = async (event) => {
    event.preventDefault()
    setSaving(true)
    setError("")
    try {
      await api.patch("/users/me", {
        name: form.name,
        phone: form.phone,
        avatar: form.avatar,
        addressLine: form.addressLine,
        city: form.city,
        state: form.state,
        pincode: form.pincode,
        ...(user.role === "TECHNICIAN"
          ? {
              serviceArea: form.serviceArea,
              experienceYears: Number(form.experienceYears),
              startingPrice: Number(form.startingPrice),
              skills: form.skills.split(",").map((item) => item.trim()).filter(Boolean),
              serviceCategoryIds: form.serviceCategoryIds,
              isAvailable: form.isAvailable,
            }
          : {}),
      })
      await refreshUser()
      toast.success("Profile saved successfully.")
    } catch (e) {
      const msg = e.response?.data?.errors?.[0]?.message || e.response?.data?.message || "Unable to save your profile"
      setError(msg)
      toast.error(msg)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="space-y-4">
          <div className="h-8 w-48 animate-pulse rounded bg-slate-200" />
          <div className="h-10 w-64 animate-pulse rounded bg-slate-200" />
          <div className="h-96 animate-pulse rounded-2xl bg-white" />
        </div>
      </main>
    )
  }

  const technician = user.role === "TECHNICIAN"

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-600">Your profile</p>
          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">{technician ? "Technician profile" : "Customer profile"}</h1>
          <p className="mt-2 text-slate-600">Keep your details current so LocalRepair can coordinate service.</p>
        </div>
        <Link to={technician ? "/technician/dashboard" : "/customer/dashboard"} className="shrink-0 font-semibold text-blue-600 hover:text-blue-700">
          &larr; Dashboard
        </Link>
      </div>

      {profile && !profile.profileComplete && (
        <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800" role="status">
          <strong>Complete your profile</strong>
          <p className="mt-1">Add the highlighted essentials to get the most from LocalRepair.</p>
        </div>
      )}

      {error && (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700" role="alert">
          {error}
        </div>
      )}

      <form onSubmit={save} className="mt-8 space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Name" name="name" value={form.name} onChange={update} required />
          <Field label="Email" name="email" value={form.email} onChange={update} type="email" disabled />
          <Field label="Phone" name="phone" value={form.phone} onChange={update} required placeholder="9999999999" />
          <Field label="Avatar URL" name="avatar" value={form.avatar} onChange={update} placeholder="https://..." />
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-900">Location</h2>
          <div className="mt-4 grid gap-5 sm:grid-cols-2">
            <Field label="Address" name="addressLine" value={form.addressLine} onChange={update} required={!technician} />
            <Field label="Area / service area" name="serviceArea" value={form.serviceArea} onChange={update} required={technician} />
            <Field label="City" name="city" value={form.city} onChange={update} required />
            <Field label="State" name="state" value={form.state} onChange={update} />
            <Field label="Pincode" name="pincode" value={form.pincode} onChange={update} required />
          </div>
        </div>

        {technician && (
          <div>
            <h2 className="text-xl font-bold text-slate-900">Services</h2>
            <div className="mt-4 grid gap-5 sm:grid-cols-2">
              <Field label="Experience (years)" name="experienceYears" value={form.experienceYears} onChange={update} type="number" />
              <Field label="Starting price (INR)" name="startingPrice" value={form.startingPrice} onChange={update} type="number" />
            </div>
            <div className="mt-5">
              <label className="block text-sm font-semibold">
                Skills
                <span className="ml-1 font-normal text-slate-500">(comma separated)</span>
                <input value={form.skills || ""} onChange={(e) => update("skills", e.target.value)} placeholder="e.g. Gas refilling, Compressor repair" className={inputClass} />
              </label>
            </div>
            <div className="mt-5">
              <p className="text-sm font-semibold">Service categories</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {categories.map((category) => {
                  const checked = (form.serviceCategoryIds || []).includes(category._id)
                  return (
                    <button
                      key={category._id}
                      type="button"
                      onClick={() => {
                        const ids = form.serviceCategoryIds || []
                        update("serviceCategoryIds", checked ? ids.filter((id) => id !== category._id) : [...ids, category._id])
                      }}
                      className={`rounded-full border px-3 py-1 text-sm font-semibold transition ${
                        checked ? "border-blue-600 bg-blue-50 text-blue-700" : "border-slate-200 bg-white text-slate-600 hover:border-blue-300"
                      }`}
                    >
                      {category.name}
                    </button>
                  )
                })}
              </div>
            </div>
            <div className="mt-5 flex items-center gap-3">
              <label className="relative inline-flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  checked={form.isAvailable ?? true}
                  onChange={(e) => update("isAvailable", e.target.checked)}
                  className="peer sr-only"
                />
                <div className="h-6 w-11 rounded-full bg-slate-300 transition peer-checked:bg-blue-600">
                  <div className="h-5 w-5 translate-y-0.5 rounded-full bg-white transition peer-checked:translate-x-5" />
                </div>
                <span className="text-sm font-semibold text-slate-700">Available for new jobs</span>
              </label>
            </div>
          </div>
        )}

        <button
          disabled={saving}
          className="min-h-12 w-full rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
        >
          {saving ? "Saving..." : "Save profile"}
        </button>
      </form>

      <section className="mt-10">
        <h2 className="text-xl font-bold text-slate-900">Profile preview</h2>
        <p className="mt-1 text-sm text-slate-500">This is how customers see your profile.</p>
        <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-start gap-5">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-blue-100 text-2xl font-bold text-blue-700">
              {form.avatar ? (
                <img src={form.avatar} alt="" className="h-full w-full object-cover" />
              ) : (
                (form.name || "T").charAt(0).toUpperCase()
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-xl font-bold text-slate-900">{form.name || "Technician"}</h3>
                {technician && profile?.technicianProfile?.verificationStatus === "VERIFIED" && (
                  <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-bold text-green-700">Verified</span>
                )}
                {technician && profile?.technicianProfile?.verificationStatus === "PENDING" && (
                  <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-700">Pending verification</span>
                )}
              </div>
              <p className="mt-1 text-sm text-slate-500">{form.serviceArea || form.addressLine || "Service area"}</p>
              <div className="mt-3 flex flex-wrap gap-2 text-sm">
                {technician && (form.serviceCategoryIds || []).length > 0 && (
                  <span className="rounded-full bg-blue-50 px-3 py-1 font-semibold text-blue-700">
                    {form.serviceCategoryIds.length} service{form.serviceCategoryIds.length !== 1 ? "s" : ""}
                  </span>
                )}
                {technician && form.experienceYears && (
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-600">
                    {form.experienceYears} years experience
                  </span>
                )}
                {technician && form.startingPrice && (
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-600">
                    {"\u20B9"}{Number(form.startingPrice).toLocaleString("en-IN")} starting
                  </span>
                )}
              </div>
            </div>
          </div>
          {technician && form.skills && (
            <div className="mt-5">
              <p className="text-sm font-semibold text-slate-500">Skills</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {form.skills.split(",").map((s) => s.trim()).filter(Boolean).map((skill) => (
                  <span key={skill} className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">{skill}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
