import { useCallback, useEffect, useState } from "react";
import api from "../../services/api";

const statusLabels = {
  PENDING: "Pending request",
  ACCEPTED: "Accepted",
  ON_THE_WAY: "On the way",
  COMPLETED: "Completed",
};
const statusStyles = {
  PENDING: "bg-amber-100 text-amber-700",
  ACCEPTED: "bg-blue-100 text-blue-700",
  ON_THE_WAY: "bg-cyan-100 text-cyan-700",
  COMPLETED: "bg-green-100 text-green-700",
};

function BookingCard({ booking, onStatusChange, updatingId }) {
  const actions =
    booking.status === "PENDING"
      ? [
          ["ACCEPTED", "Accept"],
          ["REJECTED", "Reject"],
        ]
      : booking.status === "ACCEPTED"
        ? [["ON_THE_WAY", "Mark on the way"]]
        : booking.status === "ON_THE_WAY"
          ? [["COMPLETED", "Mark completed"]]
          : [];
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-blue-600">{booking.category?.name || booking.title}</p>
          <h2 className="mt-1 text-xl font-bold">
            {booking.problemDescription}
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Customer: {booking.customer?.name || "Customer"}
          </p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-bold ${statusStyles[booking.status] || "bg-slate-100 text-slate-700"}`}
        >
          {statusLabels[booking.status] || booking.status}
        </span>
      </div>
      <dl className="mt-6 grid gap-4 text-sm sm:grid-cols-2">
        <div>
          <dt className="font-semibold text-slate-500">Requested time</dt>
          <dd className="mt-1">
            {booking.preferredDate?.slice(0, 10)} · {booking.preferredTime}
          </dd>
        </div>
        <div>
          <dt className="font-semibold text-slate-500">Estimated price</dt>
          <dd className="mt-1">{booking.estimatedCost ? `₹${booking.estimatedCost}` : "To be confirmed"}</dd>
        </div>
        <div>
          <dt className="font-semibold text-slate-500">Address</dt>
          <dd className="mt-1">
            {booking.address
              ? `${booking.address.fullAddress}, ${booking.address.city}`
              : "Address unavailable"}
          </dd>
        </div>
      </dl>
      {booking.customerNotes && (
        <p className="mt-4 rounded-lg bg-slate-50 p-3 text-sm text-slate-600">
          Note: {booking.customerNotes}
        </p>
      )}
      {actions.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-3">
          {actions.map(([status, label]) => (
            <button
              key={status}
              disabled={updatingId === booking.id}
              onClick={() => onStatusChange(booking.id, status)}
              className={`min-h-11 rounded-xl px-4 py-2 font-semibold disabled:cursor-not-allowed disabled:opacity-50 ${status === "REJECTED" ? "border border-red-200 text-red-700 hover:bg-red-50" : "bg-blue-600 text-white hover:bg-blue-700"}`}
            >
              {updatingId === booking.id ? "Updating…" : label}
            </button>
          ))}
        </div>
      )}
    </article>
  );
}

export default function TechnicianDashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState("");
  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/bookings/technician");
      setBookings(data.data.bookings);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message || "Unable to load your bookings",
      );
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    load();
  }, [load]);
  const updateStatus = async (id, status) => {
    setUpdatingId(id);
    setError("");
    try {
      const { data } = await api.patch(`/bookings/${id}/status`, { status });
      if (status === "REJECTED")
        setBookings((current) =>
          current.filter((booking) => booking.id !== id),
        );
      else
        setBookings((current) =>
          current.map((booking) =>
            booking.id === id ? data.data.booking : booking,
          ),
        );
    } catch (requestError) {
      setError(
        requestError.response?.data?.message || "Unable to update booking",
      );
    } finally {
      setUpdatingId("");
    }
  };
  const counts = { pending: bookings.filter((item) => item.status === "PENDING").length, accepted: bookings.filter((item) => item.status === "ACCEPTED").length, onWay: bookings.filter((item) => item.status === "ON_THE_WAY").length, completed: bookings.filter((item) => item.status === "COMPLETED").length };
  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-600">
          Technician workspace
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight">
          Your bookings
        </h1>
        <p className="mt-3 text-slate-600">
          Review customer requests and keep each assigned repair moving.
        </p>
      </div>
      {!loading && <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{[["New requests", counts.pending, "text-amber-600"], ["Accepted jobs", counts.accepted, "text-blue-600"], ["On the way", counts.onWay, "text-cyan-600"], ["Completed jobs", counts.completed, "text-green-600"]].map(([label, value, color]) => <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-sm text-slate-500">{label}</p><p className={`mt-2 text-3xl font-bold ${color}`}>{value}</p></div>)}</div>}
      {error && (
        <div className="mt-6 flex items-center justify-between gap-4 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
          <span>{error}</span>
          <button onClick={load} className="font-semibold underline">
            Try again
          </button>
        </div>
      )}
      {loading ? (
        <div className="mt-8 space-y-4">
          <div className="h-56 animate-pulse rounded-2xl bg-white" />
          <div className="h-56 animate-pulse rounded-2xl bg-white" />
        </div>
      ) : bookings.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <h2 className="text-xl font-bold">No service requests yet</h2>
          <p className="mt-2 text-slate-600">
            New customer requests assigned to you will appear here.
          </p>
        </div>
      ) : (
        <div className="mt-8 space-y-5">
          {bookings.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              onStatusChange={updateStatus}
              updatingId={updatingId}
            />
          ))}
        </div>
      )}
    </main>
  );
}
