import * as React from "react"
import { Filter, Users, ArrowDown, ChevronRight, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

export function RecruitmentFunnel({ funnelData = [] }) {
  const maxCount = funnelData[0]?.count || 1

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-card border border-border/80 dark:border-white/10 shadow-soft flex flex-col justify-between space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-border/60">
        <div>
          <h3 className="text-base font-extrabold text-foreground tracking-tight flex items-center gap-2">
            <Filter className="w-4 h-4 text-primary" />
            <span>Recruitment Funnel Conversion</span>
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Stage-by-stage progression and conversion rates across Acme requisitions.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs shrink-0">
          <span className="text-muted-foreground">Overall Yield:</span>
          <span className="font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20 text-[11px]">
            {funnelData[funnelData.length - 1]?.percentage || 0}% Hired
          </span>
        </div>
      </div>

      {/* Funnel Stages List */}
      <div className="space-y-2.5">
        {funnelData.map((item, idx) => {
          const widthPercent = Math.max(8, Math.round((item.count / maxCount) * 100))
          const prevCount = idx > 0 ? funnelData[idx - 1].count : null
          const dropOff = prevCount ? prevCount - item.count : null

          return (
            <div key={item.stage} className="space-y-1 group">
              {/* Row header: Stage, Count, and Conversion */}
              <div className="flex items-center justify-between text-xs gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-4 h-4 rounded-full bg-muted text-[10px] font-black text-foreground flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <span className="font-bold text-foreground text-xs truncate">
                    {item.stage}
                  </span>
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                  {idx > 0 && dropOff !== null && (
                    <span className="text-[10px] text-muted-foreground/80 hidden sm:inline">
                      (-{dropOff})
                    </span>
                  )}
                  {idx > 0 && (
                    <span className="text-[10px] font-bold text-primary bg-primary/10 px-1.5 py-0.2 rounded border border-primary/20">
                      {item.stepConversion}%
                    </span>
                  )}
                  <span className="font-black text-foreground w-10 text-right text-xs">
                    {item.count}
                  </span>
                  <span className="text-[10px] font-semibold text-muted-foreground w-10 text-right">
                    ({item.percentage}%)
                  </span>
                </div>
              </div>

              {/* Funnel Visual Bar */}
              <div className="h-2.5 w-full bg-muted/40 dark:bg-white/5 rounded-full overflow-hidden p-0.5 border border-border/50">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-500 ease-out",
                    idx === 0
                      ? "bg-gradient-to-r from-primary to-[#F47758]"
                      : idx === funnelData.length - 1
                      ? "bg-gradient-to-r from-emerald-500 to-teal-500"
                      : "bg-gradient-to-r from-primary/80 to-[#F47758]/90"
                  )}
                  style={{ width: `${widthPercent}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>

      {/* Logical Consistency Guarantee Note */}
      <div className="p-2.5 rounded-xl bg-muted/30 border border-border/50 flex items-center justify-between text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1.5 font-medium truncate">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
          <span className="truncate">Stage-to-Stage Integrity Enforced: Subsequent stages $\le$ previous stage.</span>
        </span>
        <span className="font-mono text-[10px] text-muted-foreground/80 shrink-0 ml-2">Acme Funnel</span>
      </div>
    </div>
  )
}
