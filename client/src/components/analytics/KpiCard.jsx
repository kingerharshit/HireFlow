import * as React from "react"
import { TrendingUp, TrendingDown } from "lucide-react"
import { cn } from "@/lib/utils"

export function KpiCard({
  title,
  value,
  unit,
  trendPercent,
  trendDirection = "up",
  isPositive = true,
  subtext,
  icon: Icon,
  iconGradient = "from-primary/15 to-primary/5 text-primary border-primary/20",
}) {
  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-card border border-border/80 dark:border-white/10 shadow-soft dark:shadow-[0_4px_20px_rgb(0,0,0,0.3)] transition-all duration-200 hover:shadow-md space-y-3 group">
      {/* Top row: Label & Icon */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider truncate">
          {title}
        </span>
        <div
          className={cn(
            "w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border transition-transform duration-200 group-hover:scale-105",
            iconGradient
          )}
        >
          {Icon && <Icon className="w-4 h-4 stroke-[2.2]" />}
        </div>
      </div>

      {/* Main Metric Value */}
      <div className="flex items-baseline gap-1.5">
        <span className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
          {value}
        </span>
        {unit && (
          <span className="text-sm font-bold text-muted-foreground">
            {unit}
          </span>
        )}
      </div>

      {/* Bottom row: Trend indicator & subtext */}
      <div className="flex items-center gap-2 pt-0.5 text-xs">
        <span
          className={cn(
            "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold border",
            isPositive
              ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/25"
              : "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/25"
          )}
        >
          {trendDirection === "up" ? (
            <TrendingUp className="w-3 h-3 stroke-[2.5]" />
          ) : (
            <TrendingDown className="w-3 h-3 stroke-[2.5]" />
          )}
          <span>{trendPercent}%</span>
        </span>
        <span className="text-[11px] text-muted-foreground truncate" title={subtext}>
          {subtext}
        </span>
      </div>
    </div>
  )
}

