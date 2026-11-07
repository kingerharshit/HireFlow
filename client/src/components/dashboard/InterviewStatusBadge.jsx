import * as React from "react"
import { Calendar, RefreshCw, CheckCircle2, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"

const STATUS_CONFIGS = {
  Scheduled: {
    label: "Scheduled",
    badgeClass: "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/25",
    dotClass: "bg-blue-500 animate-pulse",
    icon: Calendar,
  },
  Rescheduled: {
    label: "Rescheduled",
    badgeClass: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/25",
    dotClass: "bg-amber-500",
    icon: RefreshCw,
  },
  Completed: {
    label: "Completed",
    badgeClass: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/25",
    dotClass: "bg-emerald-500",
    icon: CheckCircle2,
  },
  Cancelled: {
    label: "Cancelled",
    badgeClass: "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/25",
    dotClass: "bg-rose-400",
    icon: XCircle,
  },
}

export function InterviewStatusBadge({ status, className }) {
  const config = STATUS_CONFIGS[status] || STATUS_CONFIGS["Scheduled"]
  const Icon = config.icon

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border select-none transition-colors shrink-0",
        config.badgeClass,
        className
      )}
    >
      <Icon className="w-3 h-3 shrink-0" aria-hidden="true" />
      <span>{config.label}</span>
    </span>
  )
}

