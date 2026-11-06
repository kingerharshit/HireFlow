import * as React from "react"
import { Link, useLocation } from "react-router-dom"
import { ChevronRight, Home } from "lucide-react"
import { cn } from "@/lib/utils"

const ROUTE_LABELS = {
  "/recruiter": "Overview",
  "/recruiter/dashboard": "Overview",
  "/recruiter/jobs": "Jobs",
  "/recruiter/candidates": "Candidates",
  "/recruiter/applications": "Applications",
  "/recruiter/interviews": "Interviews",
  "/recruiter/analytics": "Analytics",
  "/recruiter/settings": "Settings",
}

export function Breadcrumbs({ className }) {
  const location = useLocation()
  const pathname = location.pathname

  const isEditJob =
    pathname.startsWith("/recruiter/jobs/edit/") || pathname.match(/^\/recruiter\/jobs\/[^/]+\/edit/)

  const currentTitle = isEditJob
    ? "Edit Requisition"
    : ROUTE_LABELS[pathname] || "Workspace"

  return (
    <nav
      aria-label="Breadcrumb navigation"
      className={cn("flex items-center gap-1.5 text-xs text-muted-foreground select-none", className)}
    >
      {/* Root Breadcrumb link */}
      <Link
        to="/recruiter/dashboard"
        className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground font-medium transition-colors"
      >
        <Home className="w-3.5 h-3.5 text-muted-foreground/70" />
        <span className="hidden sm:inline">Workspace</span>
      </Link>

      {/* Separator Chevron */}
      <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/40 shrink-0" aria-hidden="true" />

      {/* Intermediate Jobs link if on Edit Job page */}
      {isEditJob && (
        <>
          <Link
            to="/recruiter/jobs"
            className="text-muted-foreground hover:text-foreground font-medium transition-colors"
          >
            Jobs
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/40 shrink-0" aria-hidden="true" />
        </>
      )}

      {/* Current Active Page Title */}
      <span
        aria-current="page"
        className="font-bold text-foreground text-sm tracking-tight truncate max-w-[140px] sm:max-w-none"
      >
        {currentTitle}
      </span>
    </nav>
  )
}

