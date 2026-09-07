import { Link } from "react-router-dom"

const variants = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  ghost: "btn-ghost",
  danger: "btn-danger",
}

const sizes = {
  sm: "btn-sm",
  md: "",
  lg: "",
}

export default function Button({
  variant = "primary",
  size = "md",
  to,
  href,
  disabled,
  loading,
  className = "",
  children,
  ...props
}) {
  const classes = `${variants[variant] || variants.primary} ${sizes[size] || ""} ${className}`.trim()

  if (to && !disabled) {
    return (
      <Link to={to} className={classes} {...props}>
        {loading ? (
          <span className="inline-flex items-center gap-2">
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            {loading}
          </span>
        ) : children}
      </Link>
    )
  }

  if (href && !disabled) {
    return (
      <a href={href} className={classes} {...props}>
        {children}
      </a>
    )
  }

  return (
    <button disabled={disabled || loading} className={classes} {...props}>
      {loading ? (
        <span className="inline-flex items-center gap-2">
          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          {loading}
        </span>
      ) : children}
    </button>
  )
}
