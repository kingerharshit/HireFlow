import * as React from "react"
import { cn } from "@/lib/utils"

export function StatCardSkeleton({ className }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border/80 dark:border-white/10 bg-card p-5 sm:p-6 flex flex-col justify-between shadow-soft select-none animate-pulse",
        className
      )}
      aria-hidden="true"
    >
      {/* Top Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="h-4 w-24 bg-muted/80 dark:bg-white/10 rounded" />
        <div className="w-10 h-10 rounded-xl bg-muted/80 dark:bg-white/10 shrink-0" />
      </div>

      {/* Middle Value */}
      <div className="mt-3 space-y-2">
        <div className="h-8 w-20 bg-muted/80 dark:bg-white/10 rounded" />
        <div className="h-3 w-32 bg-muted/70 dark:bg-white/5 rounded" />
      </div>

      {/* Bottom Trend */}
      <div className="mt-4 pt-3 border-t border-border/60 dark:border-white/10 flex items-center justify-between gap-2">
        <div className="h-5 w-16 bg-muted/80 dark:bg-white/10 rounded-full" />
        <div className="h-3 w-20 bg-muted/60 dark:bg-white/5 rounded" />
      </div>
    </div>
  )
}

