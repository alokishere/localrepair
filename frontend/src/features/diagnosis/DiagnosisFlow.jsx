import { useState } from "react"
import { Link } from "react-router-dom"
import api from "../../services/api"

const appliances = [
  { slug: "ac", name: "AC", icon: "\u2744\uFE0F", problems: ["Not Cooling", "Water Leaking", "Making Noise", "Not Turning On"] },
  { slug: "refrigerator", name: "Refrigerator", icon: "\uD83E\uDDCA", problems: ["Not Cooling", "Water Leakage", "Making Noise", "Not Turning On"] },
  { slug: "washing-machine", name: "Washing Machine", icon: "\uD83E\uDDFA", problems: ["Not Starting", "Not Draining", "Not Spinning", "Excessive Vibration"] },
  { slug: "tv", name: "TV", icon: "\uD83D\uDCFA", problems: ["No Display", "No Sound", "Not Turning On", "Screen Flickering"] },
  { slug: "water-purifier", name: "RO", icon: "\uD83D\uDCA7", problems: ["Not Filtering", "Low Water Flow", "Water Leakage", "Not Turning On"] },
  { slug: "microwave", name: "Microwave", icon: "\uD83C\uDF7D\uFE0F", problems: ["Not Heating", "Not Turning On", "Making Noise", "Sparking"] },
]

export default function DiagnosisFlow() {
  const [selectedAppliance, setSelectedAppliance] = useState(null)
  const [selectedProblem, setSelectedProblem] = useState("")
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const appliance = appliances.find((item) => item.slug === selectedAppliance)

  const chooseAppliance = (item) => {
    setSelectedAppliance(item.slug)
    setSelectedProblem("")
    setResult(null)
    setError("")
  }

  const reset = () => {
    setSelectedAppliance(null)
    setSelectedProblem("")
    setResult(null)
    setError("")
  }

  const submit = async () => {
    setLoading(true)
    setError("")
    try {
      const { data } = await api.post("/diagnosis", { appliance: appliance.slug, problem: selectedProblem })
      setResult(data.data)
    } catch {
      setError("Unable to analyze this issue. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="max-w-2xl">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-600">Repair diagnosis</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Let's understand the issue</h1>
        <p className="mt-3 text-lg text-slate-600">Choose an appliance and problem to see possible causes and an estimated repair range.</p>
      </div>

      {!selectedAppliance && (
        <section className="mt-10">
          <h2 className="text-2xl font-bold">What appliance needs repair?</h2>
          <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {appliances.map((item) => (
              <button
                key={item.slug}
                onClick={() => chooseAppliance(item)}
                className="rounded-xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-blue-400 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
              >
                <span className="text-3xl" aria-hidden="true">{item.icon}</span>
                <span className="mt-4 block font-bold text-slate-900">{item.name}</span>
              </button>
            ))}
          </div>
        </section>
      )}

      {selectedAppliance && !result && (
        <section className="mt-10">
          <button onClick={reset} className="font-semibold text-blue-600 hover:text-blue-700">
            &larr; Change appliance
          </button>
          <h2 className="mt-6 text-2xl font-bold">What problem are you experiencing with your {appliance.name}?</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {appliance.problems.map((problem) => (
              <button
                key={problem}
                onClick={() => { setSelectedProblem(problem); setError("") }}
                className={`min-h-14 rounded-xl border px-5 py-4 text-left font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 ${
                  selectedProblem === problem
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-slate-200 bg-white hover:border-blue-300"
                }`}
              >
                {problem}
              </button>
            ))}
          </div>
          {error && <p role="alert" className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          <button
            disabled={!selectedProblem || loading}
            onClick={submit}
            className="mt-8 min-h-12 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
          >
            {loading ? "Analyzing your repair issue..." : "See possible causes"}
          </button>
        </section>
      )}

      {result && (
        <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.12em] text-blue-600">Diagnosis result</p>
              <h2 className="mt-2 text-2xl font-bold text-slate-900">{result.issue}</h2>
            </div>
            <button onClick={reset} className="shrink-0 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50">
              New diagnosis
            </button>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-500">Urgency</p>
              <p className={`mt-1 text-lg font-bold ${
                result.urgency === "HIGH" ? "text-red-600" : result.urgency === "MEDIUM" ? "text-amber-600" : "text-green-600"
              }`}>
                {result.urgency}
              </p>
            </div>
            {result.estimatedCost && (
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-500">Estimated cost range</p>
                <p className="mt-1 text-lg font-bold text-slate-900">
                  {"\u20B9"}{result.estimatedCost.min.toLocaleString("en-IN")} - {"\u20B9"}{result.estimatedCost.max.toLocaleString("en-IN")}
                </p>
              </div>
            )}
          </div>

          {result.possibleIssues && result.possibleIssues.length > 0 && (
            <div className="mt-5">
              <p className="text-sm font-semibold text-slate-500">Possible causes</p>
              <ul className="mt-2 space-y-1">
                {result.possibleIssues.map((issue, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />
                    {issue}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <p className="mt-5 rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
            This is a suggestion only. A technician will confirm the diagnosis after inspection.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to={`/technicians?category=${selectedAppliance}`}
              className="inline-flex items-center rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
            >
              Find a technician
            </Link>
            <button
              onClick={reset}
              className="inline-flex items-center rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
            >
              Start over
            </button>
          </div>
        </section>
      )}
    </main>
  )
}
