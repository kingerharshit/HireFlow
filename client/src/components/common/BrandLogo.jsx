import * as React from "react"
import { Link } from "react-router-dom"
import { cn } from "@/lib/utils"

export function BrandLogo({
  className,
  showTagline = true,
  subtitle = "Smarter Hiring. Better Connections.",
  size = "default",
  to = "/auth/login",
}) {
  const isSmall = size === "sm"

  return (
    <Link
      to={to}
      aria-label="HireFlow Home"
      className={cn(
        "inline-flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xl select-none",
        className
      )}
    >
      {/* High-Contrast Custom Logomark */}
      <div
        className={cn(
          "rounded-xl bg-gradient-to-br from-[#F47758] via-[#EE6543] to-[#D94F2D] text-white flex items-center justify-center font-black tracking-tighter shadow-md shadow-brand-coral/25 border border-white/25 ring-1 ring-black/10 dark:ring-white/20 shrink-0 group-hover:scale-105 transition-all duration-200",
          isSmall ? "w-8 h-8 text-sm" : "w-10 h-10 text-base"
        )}
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={isSmall ? "w-4 h-4" : "w-5 h-5"}
        >
          {/* Stylized interconnected H-F mark */}
          <path d="M4 6v12M12 6v12M4 12h8M12 6h8M12 12h6" />
        </svg>
      </div>

      {/* Brand Wordmark & Tagline */}
      <div className="leading-none">
        <div className="flex items-center gap-1">
          <span
            className={cn(
              "font-extrabold tracking-tight text-foreground transition-colors group-hover:text-primary",
              isSmall ? "text-lg" : "text-xl"
            )}
          >
            HireFlow
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
        </div>
        {showTagline && (
          <span className="block text-[11px] text-muted-foreground font-medium pt-1 tracking-tight">
            {subtitle}
          </span>
        )}
      </div>
    </Link>
  )
}
