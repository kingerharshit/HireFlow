import * as React from "react"
import { cn } from "@/lib/utils"

const STATUS_CONFIGS = {
  Applied: {
    label: "Applied",
    badgeClass: "bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-500/25",
    dotClass: "bg-slate-400 dark:bg-slate-400",
  },
  "Under Review": {
    label: "Under Review",
    badgeClass: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/25",
    dotClass: "bg-amber-500",
  },
  Shortlisted: {
    label: "Shortlisted",
    badgeClass: "bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-500/25",
    dotClass: "bg-sky-500",
  },
  Interview: {
    label: "Interview",
    badgeClass: "bg-violet-500/10 text-violet-700 dark:text-violet-400 border-violet-500/25",
    dotClass: "bg-violet-500",
  },
  Offered: {
    label: "Offered",
    badgeClass: "bg-primary/10 text-primary border-primary/25",
    dotClass: "bg-primary animate-pulse",
  },
  Hired: {
    label: "Hired",
    badgeClass: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/25",
    dotClass: "bg-emerald-500",
  },
  Rejected: {
    label: "Rejected",
    badgeClass: "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/25",
    dotClass: "bg-rose-400",
  },
}

export function ApplicationStatusBadge({ status, className }) {
  const config = STATUS_CONFIGS[status] || STATUS_CONFIGS["Applied"]

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border select-none transition-colors shrink-0",
        config.badgeClass,
        className
      )}
    >
      <span
        className={cn("w-1.5 h-1.5 rounded-full shrink-0", config.dotClass)}
        aria-hidden="true"
      />
      <span>{config.label}</span>
    </span>
  )
}

