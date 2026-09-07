export default function Card({ className = "", hover = false, padding = "p-6", children, ...props }) {
  return (
    <div
      className={`card ${hover ? "cursor-pointer" : ""} ${padding} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ children, className = "" }) {
  return <div className={`mb-4 ${className}`}>{children}</div>
}

export function CardTitle({ children, className = "" }) {
  return <h3 className={`text-lg font-semibold text-[var(--color-ink)] ${className}`}>{children}</h3>
}
