import * as React from "react"
import { Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

export function AiMatchBadge({ score, showProgress = true, className }) {
  const numericScore = Number(score) || 0

  let colorStyles = {
    badge: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/25",
    bar: "bg-emerald-500",
    label: "High Match",
  }

  if (numericScore >= 90) {
    colorStyles = {
      badge: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/25",
      bar: "bg-emerald-500",
      label: "Top Match",
    }
  } else if (numericScore >= 80) {
    colorStyles = {
      badge: "bg-primary/10 text-primary border-primary/25",
      bar: "bg-primary",
      label: "Strong Match",
    }
  } else if (numericScore >= 70) {
    colorStyles = {
      badge: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/25",
      bar: "bg-amber-500",
      label: "Moderate Match",
    }
  } else {
    colorStyles = {
      badge: "bg-slate-500/10 text-slate-700 dark:text-slate-400 border-slate-500/25",
      bar: "bg-slate-400",
      label: "Low Match",
    }
  }

  return (
    <div
      className={cn("inline-flex flex-col gap-1 select-none", className)}
      title={`Demonstration AI Match Score: ${numericScore}% (${colorStyles.label})`}
    >
      <div
        className={cn(
          "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-bold border transition-colors shrink-0",
          colorStyles.badge
        )}
      >
        <Sparkles className="w-3 h-3 shrink-0" aria-hidden="true" />
        <span>{numericScore}%</span>
      </div>

      {showProgress && (
        <div className="w-14 h-1 rounded-full bg-muted/80 dark:bg-white/10 overflow-hidden">
          <div
            className={cn("h-full rounded-full transition-all duration-300", colorStyles.bar)}
            style={{ width: `${Math.min(100, Math.max(0, numericScore))}%` }}
          />
        </div>
      )}
    </div>
  )
}

