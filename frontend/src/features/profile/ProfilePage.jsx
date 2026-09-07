import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../context/useAuth";
import { useToast } from "../../context/ToastContext";
import { Avatar, Badge } from "../../components/ui";

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const toast = useToast();
  const [categories, setCategories] = useState([]);
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      api.get("/users/me"),
      user?.role === "TECHNICIAN"
        ? api.get("/categories")
        : Promise.resolve({ data: { data: { categories: [] } } }),
    ])
      .then(([profileResponse, categoryResponse]) => {
        const data = profileResponse.data.data;
        setProfile(data);
        setCategories(categoryResponse.data.data.categories);
        const technician = data.technicianProfile || {};
        setForm({
          ...data.user,
          serviceArea: technician.serviceArea || "",
          city: technician.city || data.user.city || "",
          pincode: technician.pincode || data.user.pincode || "",
          experienceYears: technician.experienceYears ?? "",
          startingPrice: technician.startingPrice ?? "",
          skills: (technician.skills || []).join(", "),
          serviceCategoryIds: (technician.serviceCategories || []).map(
            (item) => item._id || item.id,
          ),
          isAvailable: technician.isAvailable ?? true,
        });
      })
      .catch((e) =>
        setError(e.response?.data?.message || "Unable to load your profile"),
      )
      .finally(() => setLoading(false));
  }, [user?.role]);

  const update = (name, value) =>
    setForm((current) => ({ ...current, [name]: value }));

  const save = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
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
              skills: form.skills
                .split(",")
                .map((item) => item.trim())
                .filter(Boolean),
              serviceCategoryIds: form.serviceCategoryIds,
              isAvailable: form.isAvailable,
            }
          : {}),
      });
      await refreshUser();
      toast.success("Profile saved successfully.");
    } catch (e) {
      const msg =
        e.response?.data?.errors?.[0]?.message ||
        e.response?.data?.message ||
        "Unable to save your profile";
      setError(msg);
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="section-container max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="space-y-4">
          <div className="skeleton h-8 w-48" />
          <div className="skeleton h-10 w-64" />
          <div className="skeleton h-96 rounded-[var(--radius-lg)]" />
        </div>
      </main>
    );
  }

  const isTechnician = user.role === "TECHNICIAN";
  const inputClass = "input";

  return (
    <main className="section-container max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[var(--color-primary)]">
            Your profile
          </p>
          <h1
            className="mt-2 text-3xl font-bold sm:text-4xl"
            style={{ lineHeight: 1.2 }}
          >
            {isTechnician ? "Technician profile" : "Customer profile"}
          </h1>
          <p className="mt-2 text-[var(--color-ink-secondary)]">
            Keep your details current so LocalRepair can coordinate service.
          </p>
        </div>
        <Link
          to={isTechnician ? "/technician/dashboard" : "/customer/dashboard"}
          className="btn-ghost shrink-0 text-[var(--color-primary)]"
        >
          &larr; Dashboard
        </Link>
      </div>

      {profile && !profile.profileComplete && (
        <div
          className="mt-6 rounded-[var(--radius-sm)] bg-[var(--color-warning-light)] p-4 text-sm text-[var(--color-warning)]"
          role="status"
        >
          <strong>Complete your profile</strong>
          <p className="mt-1">
            Add the highlighted essentials to get the most from LocalRepair.
          </p>
        </div>
      )}

      {error && (
        <div
          className="mt-6 rounded-[var(--radius-sm)] bg-[var(--color-danger-light)] p-4 text-sm text-[var(--color-danger)]"
          role="alert"
        >
          {error}
        </div>
      )}

      <form onSubmit={save} className="card mt-8 space-y-6">
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block text-sm font-medium text-[var(--color-ink)]">
            Name
            <input
              required
              value={form.name ?? ""}
              onChange={(e) => update("name", e.target.value)}
              className={`${inputClass} mt-2`}
            />
          </label>
          <label className="block text-sm font-medium text-[var(--color-ink)]">
            Email
            <input
              disabled
              value={form.email ?? ""}
              type="email"
              className={`${inputClass} mt-2`}
            />
          </label>
          <label className="block text-sm font-medium text-[var(--color-ink)]">
            Phone
            <input
              required
              value={form.phone ?? ""}
              onChange={(e) => update("phone", e.target.value)}
              placeholder="9999999999"
              className={`${inputClass} mt-2`}
            />
          </label>
          <label className="block text-sm font-medium text-[var(--color-ink)]">
            Avatar URL
            <input
              value={form.avatar ?? ""}
              onChange={(e) => update("avatar", e.target.value)}
              placeholder="https://..."
              className={`${inputClass} mt-2`}
            />
          </label>
        </div>

        <div>
          <h2 className="text-lg font-bold text-[var(--color-ink)]">
            Location
          </h2>
          <div className="mt-4 grid gap-5 sm:grid-cols-2">
            <label className="block text-sm font-medium text-[var(--color-ink)]">
              Address
              <input
                required={!isTechnician}
                value={form.addressLine ?? ""}
                onChange={(e) => update("addressLine", e.target.value)}
                className={`${inputClass} mt-2`}
              />
            </label>
            <label className="block text-sm font-medium text-[var(--color-ink)]">
              Area / service area
              <input
                required={isTechnician}
                value={form.serviceArea ?? ""}
                onChange={(e) => update("serviceArea", e.target.value)}
                className={`${inputClass} mt-2`}
              />
            </label>
            <label className="block text-sm font-medium text-[var(--color-ink)]">
              City
              <input
                required
                value={form.city ?? ""}
                onChange={(e) => update("city", e.target.value)}
                className={`${inputClass} mt-2`}
              />
            </label>
            <label className="block text-sm font-medium text-[var(--color-ink)]">
              State
              <input
                value={form.state ?? ""}
                onChange={(e) => update("state", e.target.value)}
                className={`${inputClass} mt-2`}
              />
            </label>
            <label className="block text-sm font-medium text-[var(--color-ink)]">
              Pincode
              <input
                required
                value={form.pincode ?? ""}
                onChange={(e) => update("pincode", e.target.value)}
                className={`${inputClass} mt-2`}
              />
            </label>
          </div>
        </div>

        {isTechnician && (
          <div>
            <h2 className="text-lg font-bold text-[var(--color-ink)]">
              Services
            </h2>
            <div className="mt-4 grid gap-5 sm:grid-cols-2">
              <label className="block text-sm font-medium text-[var(--color-ink)]">
                Experience (years)
                <input
                  type="number"
                  value={form.experienceYears ?? ""}
                  onChange={(e) => update("experienceYears", e.target.value)}
                  className={`${inputClass} mt-2`}
                />
              </label>
              <label className="block text-sm font-medium text-[var(--color-ink)]">
                Starting price (INR)
                <input
                  type="number"
                  value={form.startingPrice ?? ""}
                  onChange={(e) => update("startingPrice", e.target.value)}
                  className={`${inputClass} mt-2`}
                />
              </label>
            </div>
            <div className="mt-5">
              <label className="block text-sm font-medium text-[var(--color-ink)]">
                Skills{" "}
                <span className="font-normal text-[var(--color-ink-muted)]">
                  (comma separated)
                </span>
                <input
                  value={form.skills || ""}
                  onChange={(e) => update("skills", e.target.value)}
                  placeholder="e.g. Gas refilling, Compressor repair"
                  className={`${inputClass} mt-2`}
                />
              </label>
            </div>
            <div className="mt-5">
              <p className="text-sm font-medium text-[var(--color-ink)]">
                Service categories
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {categories.map((category) => {
                  const checked = (form.serviceCategoryIds || []).includes(
                    category._id,
                  );
                  return (
                    <button
                      key={category._id}
                      type="button"
                      onClick={() => {
                        const ids = form.serviceCategoryIds || [];
                        update(
                          "serviceCategoryIds",
                          checked
                            ? ids.filter((cid) => cid !== category._id)
                            : [...ids, category._id],
                        );
                      }}
                      className={`badge cursor-pointer transition-all ${
                        checked
                          ? "bg-[var(--color-primary)] text-white"
                          : "bg-[var(--color-surface-light)] text-[var(--color-ink-secondary)] hover:bg-[var(--color-border)]"
                      }`}
                    >
                      {category.name}
                    </button>
                  );
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
                <div className="h-6 w-11 rounded-full bg-[var(--color-ink-muted)] transition peer-checked:bg-[var(--color-primary)]">
                  <div className="h-5 w-5 translate-y-0.5 rounded-full bg-white transition peer-checked:translate-x-5" />
                </div>
                <span className="text-sm font-medium text-[var(--color-ink-secondary)]">
                  Available for new jobs
                </span>
              </label>
            </div>
          </div>
        )}

        <button disabled={saving} className="btn-primary w-full">
          {saving ? "Saving..." : "Save profile"}
        </button>
      </form>

      {/* ── Profile Preview ── */}
      <section className="mt-10">
        <h2 className="text-lg font-bold text-[var(--color-ink)]">
          Profile preview
        </h2>
        <p className="mt-1 text-sm text-[var(--color-ink-muted)]">
          This is how customers see your profile.
        </p>
        <div className="card mt-4">
          <div className="flex items-start gap-5">
            <Avatar src={form.avatar} name={form.name} size="lg" />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-xl font-bold text-[var(--color-ink)]">
                  {form.name || "Technician"}
                </h3>
                {isTechnician &&
                  profile?.technicianProfile?.verificationStatus ===
                    "VERIFIED" && <Badge variant="success">Verified</Badge>}
                {isTechnician &&
                  profile?.technicianProfile?.verificationStatus ===
                    "PENDING" && (
                    <Badge variant="warning">Pending verification</Badge>
                  )}
              </div>
              <p className="mt-1 text-sm text-[var(--color-ink-muted)]">
                {form.serviceArea || form.addressLine || "Service area"}
              </p>
              <div className="mt-3 flex flex-wrap gap-2 text-sm">
                {isTechnician && (form.serviceCategoryIds || []).length > 0 && (
                  <Badge variant="primary">
                    {form.serviceCategoryIds.length} service
                    {form.serviceCategoryIds.length !== 1 ? "s" : ""}
                  </Badge>
                )}
                {isTechnician && form.experienceYears && (
                  <Badge variant="default">
                    {form.experienceYears} years experience
                  </Badge>
                )}
                {isTechnician && form.startingPrice && (
                  <Badge variant="default">
                    {"\u20B9"}
                    {Number(form.startingPrice).toLocaleString("en-IN")}{" "}
                    starting
                  </Badge>
                )}
              </div>
            </div>
          </div>
          {isTechnician && form.skills && (
            <div className="mt-5">
              <p className="text-sm font-medium text-[var(--color-ink-muted)]">
                Skills
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {form.skills
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean)
                  .map((skill) => (
                    <Badge key={skill} variant="default">
                      {skill}
                    </Badge>
                  ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
