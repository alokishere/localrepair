import { useState } from "react"
import { Link } from "react-router-dom"
import api from "../../services/api"
import { Stepper } from "../../components/ui"

const appliances = [
  { slug: "ac", name: "AC", icon: "\u2744\uFE0F", problems: ["Not Cooling", "Water Leaking", "Making Noise", "Not Turning On"] },
  { slug: "refrigerator", name: "Refrigerator", icon: "\uD83E\uDDCA", problems: ["Not Cooling", "Water Leakage", "Making Noise", "Not Turning On"] },
  { slug: "washing-machine", name: "Washing Machine", icon: "\uD83E\uDDFA", problems: ["Not Starting", "Not Draining", "Not Spinning", "Excessive Vibration"] },
  { slug: "tv", name: "TV", icon: "\uD83D\uDCFA", problems: ["No Display", "No Sound", "Not Turning On", "Screen Flickering"] },
  { slug: "water-purifier", name: "RO", icon: "\uD83D\uDCA7", problems: ["Not Filtering", "Low Water Flow", "Water Leakage", "Not Turning On"] },
  { slug: "microwave", name: "Microwave", icon: "\uD83C\uDF7D\uFE0F", problems: ["Not Heating", "Not Turning On", "Making Noise", "Sparking"] },
]

const steps = ["Appliance", "Problem", "Diagnosis"]

export default function DiagnosisFlow() {
  const [selectedAppliance, setSelectedAppliance] = useState(null)
  const [selectedProblem, setSelectedProblem] = useState("")
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const appliance = appliances.find((item) => item.slug === selectedAppliance)
  const currentStep = result ? 2 : selectedAppliance ? 1 : 0

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
    <main className="section-container px-4 py-8 sm:px-6 sm:py-12">
      <div className="max-w-2xl">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-[var(--color-primary)]">Repair diagnosis</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl" style={{ lineHeight: 1.2 }}>
          Let's understand the issue
        </h1>
        <p className="mt-3 text-lg text-[var(--color-ink-secondary)]">
          Choose an appliance and problem to see possible causes and an estimated repair range.
        </p>
      </div>

      {/* ── Stepper ── */}
      <div className="mt-8">
        <Stepper steps={steps} currentStep={currentStep} />
      </div>

      {/* ── Step 1: Appliance Selection ── */}
      {!selectedAppliance && (
        <section className="mt-10">
          <h2 className="text-xl font-bold text-[var(--color-ink)]">What appliance needs repair?</h2>
          <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {appliances.map((item) => (
              <button
                key={item.slug}
                onClick={() => chooseAppliance(item)}
                className="card group cursor-pointer rounded-[var(--radius-md)] p-6 text-left transition-all hover:-translate-y-0.5 hover:border-[var(--color-primary)] hover:shadow-[var(--shadow-card-hover)] focus-visible:outline-none"
              >
                <span className="text-3xl" aria-hidden="true">{item.icon}</span>
                <span className="mt-4 block font-bold text-[var(--color-ink)]">{item.name}</span>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* ── Step 2: Problem Selection ── */}
      {selectedAppliance && !result && (
        <section className="mt-10">
          <button onClick={reset} className="btn-ghost text-sm font-semibold text-[var(--color-primary)]">
            &larr; Change appliance
          </button>
          <h2 className="mt-6 text-xl font-bold text-[var(--color-ink)]">
            What problem are you experiencing with your {appliance.name}?
          </h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {appliance.problems.map((problem) => (
              <button
                key={problem}
                onClick={() => { setSelectedProblem(problem); setError("") }}
                className={`rounded-[var(--radius-sm)] border px-5 py-4 text-left font-semibold transition-all focus-visible:outline-none ${
                  selectedProblem === problem
                    ? "border-[var(--color-primary)] bg-[var(--color-primary-light)] text-[var(--color-primary)]"
                    : "border-[var(--color-border)] bg-[var(--color-bg)] hover:border-[var(--color-ink-muted)]"
                }`}
              >
                {problem}
              </button>
            ))}
          </div>
          {error && (
            <div className="mt-5 rounded-[var(--radius-sm)] bg-[var(--color-danger-light)] p-3 text-sm text-[var(--color-danger)]" role="alert">
              {error}
            </div>
          )}
          <button
            disabled={!selectedProblem || loading}
            onClick={submit}
            className="btn-primary mt-8"
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Analyzing...
              </span>
            ) : "See possible causes"}
          </button>
        </section>
      )}

      {/* ── Step 3: Result ── */}
      {result && (
        <section className="mt-10 card">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.12em] text-[var(--color-primary)]">Diagnosis result</p>
              <h2 className="mt-2 text-2xl font-bold text-[var(--color-ink)]" style={{ lineHeight: 1.2 }}>{result.issue}</h2>
            </div>
            <button onClick={reset} className="btn-secondary btn-sm shrink-0">
              New diagnosis
            </button>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[var(--radius-sm)] bg-[var(--color-surface)] p-4">
              <p className="text-sm font-medium text-[var(--color-ink-muted)]">Urgency</p>
              <p className={`mt-1 text-lg font-bold ${
                result.urgency === "HIGH" ? "text-[var(--color-danger)]" : result.urgency === "MEDIUM" ? "text-[var(--color-warning)]" : "text-[var(--color-success)]"
              }`}>
                {result.urgency}
              </p>
            </div>
            {result.estimatedCost && (
              <div className="rounded-[var(--radius-sm)] bg-[var(--color-surface)] p-4">
                <p className="text-sm font-medium text-[var(--color-ink-muted)]">Estimated cost range</p>
                <p className="mt-1 text-lg font-bold text-[var(--color-ink)]">
                  {"\u20B9"}{result.estimatedCost.min.toLocaleString("en-IN")} – {"\u20B9"}{result.estimatedCost.max.toLocaleString("en-IN")}
                </p>
              </div>
            )}
          </div>

          {result.possibleIssues && result.possibleIssues.length > 0 && (
            <div className="mt-5">
              <p className="text-sm font-medium text-[var(--color-ink-muted)]">Possible causes</p>
              <ul className="mt-2 space-y-1.5">
                {result.possibleIssues.map((issue, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-[var(--color-ink-secondary)]">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-primary)]" />
                    {issue}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-5 rounded-[var(--radius-sm)] bg-[var(--color-warning-light)] p-3 text-sm text-[var(--color-warning)]">
            This is a suggestion only. A technician will confirm the diagnosis after inspection.
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link to={`/technicians?category=${selectedAppliance}`} className="btn-primary">
              Find a technician
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
            <button onClick={reset} className="btn-secondary">
              Start over
            </button>
          </div>
        </section>
      )}
    </main>
  )
}
