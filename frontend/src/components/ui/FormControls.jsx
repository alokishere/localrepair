export function Input({ label, error, className = "", ...props }) {
  return (
    <label className="block">
      {label && (
        <span className="mb-2 block text-sm font-medium text-[var(--color-ink)]">
          {label}
        </span>
      )}
      <input
        className={`input ${error ? "border-[var(--color-danger)]" : ""} ${className}`}
        {...props}
      />
      {error && (
        <span className="mt-1 block text-xs text-[var(--color-danger)]">{error}</span>
      )}
    </label>
  )
}

export function Textarea({ label, error, className = "", ...props }) {
  return (
    <label className="block">
      {label && (
        <span className="mb-2 block text-sm font-medium text-[var(--color-ink)]">
          {label}
        </span>
      )}
      <textarea
        className={`input min-h-[100px] resize-y ${error ? "border-[var(--color-danger)]" : ""} ${className}`}
        {...props}
      />
      {error && (
        <span className="mt-1 block text-xs text-[var(--color-danger)]">{error}</span>
      )}
    </label>
  )
}

export function Select({ label, error, children, className = "", ...props }) {
  return (
    <label className="block">
      {label && (
        <span className="mb-2 block text-sm font-medium text-[var(--color-ink)]">
          {label}
        </span>
      )}
      <select
        className={`input appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23717171%22%20stroke-width%3D%222%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:20px] bg-[right_12px_center] bg-no-repeat pr-10 ${error ? "border-[var(--color-danger)]" : ""} ${className}`}
        {...props}
      >
        {children}
      </select>
      {error && (
        <span className="mt-1 block text-xs text-[var(--color-danger)]">{error}</span>
      )}
    </label>
  )
}
