import * as React from "react"
import { CheckCircle2, PauseCircle, FileEdit, XCircle, Archive } from "lucide-react"
import { cn } from "@/lib/utils"

export function JobStatusBadge({ status = "Published", className }) {
  const normalizedStatus = status.toLowerCase()

  if (normalizedStatus === "published" || normalizedStatus === "active") {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/40 shrink-0",
          className
        )}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true" />
        <span>Published</span>
      </span>
    )
  }

  if (normalizedStatus === "paused") {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/40 shrink-0",
          className
        )}
      >
        <PauseCircle className="w-3 h-3 text-amber-600 dark:text-amber-400 shrink-0" aria-hidden="true" />
        <span>Paused</span>
      </span>
    )
  }

  if (normalizedStatus === "draft") {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-muted/80 dark:bg-white/10 text-muted-foreground border border-border/80 dark:border-white/10 shrink-0",
          className
        )}
      >
        <FileEdit className="w-3 h-3 text-muted-foreground shrink-0" aria-hidden="true" />
        <span>Draft</span>
      </span>
    )
  }

  if (normalizedStatus === "archived") {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border border-slate-300/80 dark:border-slate-700/60 shrink-0",
          className
        )}
      >
        <Archive className="w-3 h-3 text-slate-500 shrink-0" aria-hidden="true" />
        <span>Archived</span>
      </span>
    )
  }

  // Closed / Default fallback
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200/80 dark:border-rose-800/40 shrink-0",
        className
      )}
    >
      <XCircle className="w-3 h-3 text-rose-500 shrink-0" aria-hidden="true" />
      <span>Closed</span>
    </span>
  )
}

