import * as React from "react"
import { TrendingUp, TrendingDown } from "lucide-react"
import { cn } from "@/lib/utils"

export function StatCard({
  title,
  value,
  label,
  change,
  isPositive = true,
  period = "vs. last month",
  icon: Icon,
  className,
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border/80 dark:border-white/10 bg-card text-card-foreground shadow-soft dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)] p-5 sm:p-6 transition-all duration-200 hover:shadow-soft-md hover:border-primary/40 dark:hover:border-primary/40 -translate-y-0 hover:-translate-y-0.5 select-none flex flex-col justify-between group",
        className
      )}
    >
      {/* Top Header: Title & Icon */}
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground truncate">
          {title}
        </span>
        {Icon && (
          <div className="w-10 h-10 rounded-xl bg-primary/10 dark:bg-primary/20 text-primary flex items-center justify-center shrink-0 shadow-soft-xs group-hover:scale-105 transition-transform duration-200">
            <Icon className="w-5 h-5 stroke-[2]" aria-hidden="true" />
          </div>
        )}
      </div>

      {/* Middle: Value & Label */}
      <div className="mt-3">
        <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground leading-none">
          {value}
        </div>
        {label && (
          <p className="text-xs text-muted-foreground font-medium mt-1.5 truncate">
            {label}
          </p>
        )}
      </div>

      {/* Bottom: Trend Indicator & Comparison Period */}
      <div className="mt-4 pt-3 border-t border-border/60 dark:border-white/10 flex items-center justify-between gap-2 text-xs">
        <span
          className={cn(
            "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold shrink-0 border",
            isPositive
              ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200/80 dark:border-emerald-800/40"
              : "bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200/80 dark:border-rose-800/40"
          )}
        >
          {isPositive ? (
            <TrendingUp className="w-3 h-3 stroke-[2.5]" aria-hidden="true" />
          ) : (
            <TrendingDown className="w-3 h-3 stroke-[2.5]" aria-hidden="true" />
          )}
          <span>{change}</span>
        </span>

        {period && (
          <span className="text-[11px] text-muted-foreground truncate text-right">
            {period}
          </span>
        )}
      </div>
    </div>
  )
}

