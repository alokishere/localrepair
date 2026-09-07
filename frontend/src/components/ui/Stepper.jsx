export default function Stepper({ steps, currentStep }) {
  return (
    <nav aria-label="Progress" className="flex items-center gap-2">
      {steps.map((step, index) => {
        const isCompleted = index < currentStep
        const isCurrent = index === currentStep

        return (
          <div key={index} className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                  isCompleted
                    ? "bg-[var(--color-ink)] text-[var(--color-ink-inverse)]"
                    : isCurrent
                      ? "bg-[var(--color-primary)] text-white"
                      : "bg-[var(--color-surface-light)] text-[var(--color-ink-muted)]"
                }`}
              >
                {isCompleted ? (
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                ) : (
                  index + 1
                )}
              </div>
              <span
                className={`hidden text-sm font-medium sm:inline ${
                  isCurrent ? "text-[var(--color-ink)]" : "text-[var(--color-ink-muted)]"
                }`}
              >
                {step}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`mx-1 h-px w-6 sm:w-10 ${
                  isCompleted ? "bg-[var(--color-ink)]" : "bg-[var(--color-border)]"
                }`}
              />
            )}
          </div>
        )
      })}
    </nav>
  )
}
