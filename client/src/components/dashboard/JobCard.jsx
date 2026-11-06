import * as React from "react"
import { useState, useRef, useEffect } from "react"
import {
  MapPin,
  Clock,
  Calendar,
  Hourglass,
  Users,
  MoreVertical,
  ExternalLink,
  Edit3,
  Copy,
  ArrowRight,
  Sparkles,
  Building2,
} from "lucide-react"
import { JobStatusBadge } from "./JobStatusBadge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function JobCard({
  job,
  onView,
  onEdit,
  onViewApplications,
  className,
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)

  // Close actions menu on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const progressPercent = Math.min(
    100,
    Math.round((job.applicationsCount / (job.targetApplications || 1)) * 100)
  )

  return (
    <div
      className={cn(
        "rounded-2xl border border-border/80 dark:border-white/10 bg-card text-card-foreground p-5 sm:p-6 shadow-soft dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)] hover:shadow-soft-md hover:border-primary/40 dark:hover:border-primary/40 transition-all duration-200 select-none flex flex-col justify-between group relative",
        className
      )}
    >
      {/* Top Header: Department Pill, Title, Status & Actions Menu */}
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1 min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary bg-primary/10 dark:bg-primary/15 px-2 py-0.5 rounded-md border border-primary/20">
                <Building2 className="w-3 h-3 shrink-0" aria-hidden="true" />
                <span className="truncate max-w-[130px]">{job.organizationName || "Acme Technologies"}</span>
              </span>
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground bg-muted/60 dark:bg-white/5 px-2 py-0.5 rounded-md">
                {job.department}
              </span>
              <JobStatusBadge status={job.status} />
            </div>

            <h3
              onClick={() => onView && onView(job)}
              className="text-lg sm:text-xl font-extrabold text-foreground tracking-tight group-hover:text-primary transition-colors cursor-pointer truncate pt-0.5"
              title={job.title}
            >
              {job.title}
            </h3>
          </div>

          {/* More Actions Dropdown Menu */}
          <div className="relative shrink-0" ref={menuRef}>
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={`Actions for ${job.title}`}
              aria-expanded={menuOpen}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {menuOpen && (
              <div
                role="menu"
                className="absolute right-0 top-full mt-1.5 w-48 bg-popover text-popover-foreground rounded-xl border border-border/90 shadow-soft-lg p-1.5 z-30 animate-in fade-in-50 zoom-in-95 duration-150"
              >
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false)
                    onView && onView(job)
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-foreground hover:bg-muted/70 transition-colors cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
                  <span>View Requisition</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false)
                    onEdit && onEdit(job)
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-foreground hover:bg-muted/70 transition-colors cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5 text-muted-foreground" />
                  <span>Edit Details</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false)
                    onViewApplications && onViewApplications(job)
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-foreground hover:bg-muted/70 transition-colors cursor-pointer"
                >
                  <Users className="w-3.5 h-3.5 text-muted-foreground" />
                  <span>View Applications</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Short Job Summary */}
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 pt-0.5">
          {job.description}
        </p>
      </div>

      {/* Middle: Metadata Pills Grid */}
      <div className="py-3.5 grid grid-cols-2 gap-2 text-xs text-muted-foreground border-y border-border/60 dark:border-white/10 my-3">
        <div className="flex items-center gap-1.5 truncate">
          <MapPin className="w-3.5 h-3.5 text-primary shrink-0" aria-hidden="true" />
          <span className="truncate">{job.location}</span>
        </div>

        <div className="flex items-center gap-1.5 truncate">
          <Clock className="w-3.5 h-3.5 text-primary shrink-0" aria-hidden="true" />
          <span className="truncate">{job.employmentType}</span>
        </div>

        <div className="flex items-center gap-1.5 truncate">
          <Calendar className="w-3.5 h-3.5 text-muted-foreground/70 shrink-0" aria-hidden="true" />
          <span className="truncate">{job.publishedDate}</span>
        </div>

        <div className="flex items-center gap-1.5 truncate">
          <Hourglass className="w-3.5 h-3.5 text-muted-foreground/70 shrink-0" aria-hidden="true" />
          <span className="truncate">{job.daysRemaining}</span>
        </div>
      </div>

      {/* Application Progress Bar & Pipeline Breakdown */}
      <div className="space-y-1.5 mb-4">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-primary shrink-0" />
            <span className="font-bold text-foreground">
              {job.applicationsCount}
            </span>
            <span className="text-muted-foreground text-[11px]">
              / {job.targetApplications} target applicants
            </span>
          </div>
          <span className="font-bold text-[11px] text-primary">
            {progressPercent}%
          </span>
        </div>

        {/* Visual Progress Bar */}
        <div className="w-full h-1.5 rounded-full bg-muted/80 dark:bg-white/10 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#F47758] to-[#D94F2D] transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Pipeline Stage Chips */}
        {job.pipeline && (
          <div className="flex items-center gap-2 pt-1 text-[11px] text-muted-foreground flex-wrap">
            <span className="font-medium">
              <strong className="text-foreground">{job.pipeline.reviewing}</strong> screening
            </span>
            <span>•</span>
            <span className="font-medium">
              <strong className="text-foreground">{job.pipeline.interviewing}</strong> interviews
            </span>
            <span>•</span>
            <span className="font-medium">
              <strong className="text-primary">{job.pipeline.offered}</strong> offers
            </span>
          </div>
        )}
      </div>

      {/* Footer Action Buttons */}
      <div className="flex items-center gap-2.5 pt-1">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onViewApplications && onViewApplications(job)}
          className="flex-1 text-xs font-semibold rounded-xl h-9 hover:border-primary/50 transition-colors cursor-pointer"
        >
          <span>View Applications ({job.applicationsCount})</span>
        </Button>

        <Button
          type="button"
          variant="default"
          size="sm"
          onClick={() => onView && onView(job)}
          className="text-xs font-semibold rounded-xl h-9 px-3.5 cursor-pointer shadow-soft-xs"
        >
          <span>Details</span>
          <ArrowRight className="w-3.5 h-3.5 ml-1" />
        </Button>
      </div>
    </div>
  )
}

