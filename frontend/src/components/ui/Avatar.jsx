export default function Avatar({ src, name, size = "md", className = "" }) {
  const sizes = {
    sm: "h-8 w-8 text-xs",
    md: "h-11 w-11 text-sm",
    lg: "h-16 w-16 text-lg",
    xl: "h-24 w-24 text-2xl",
  }

  const initials = name ? name.charAt(0).toUpperCase() : "?"

  return (
    <div
      className={`relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-[var(--color-primary-light)] font-semibold text-[var(--color-primary)] ${sizes[size]} ${className}`}
    >
      {src ? (
        <img src={src} alt="" className="h-full w-full object-cover" />
      ) : (
        initials
      )}
    </div>
  )
}
