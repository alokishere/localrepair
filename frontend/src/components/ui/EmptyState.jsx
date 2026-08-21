import { Link } from "react-router-dom"

export default function EmptyState({ title, description, actionLabel, actionTo, icon }) {
  return (
    <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white p-12 text-center">
      {icon && <div className="mx-auto mb-4 text-4xl text-slate-300">{icon}</div>}
      <h2 className="text-xl font-bold text-slate-800">{title}</h2>
      <p className="mt-2 text-slate-500">{description}</p>
      {actionLabel && actionTo && (
        <Link
          to={actionTo}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  )
}
