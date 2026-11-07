import * as React from "react"
import { Building2, Briefcase, Clock, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

export function DepartmentBreakdownChart({ departments = [] }) {
  const maxApps = Math.max(...departments.map((d) => d.applications), 10)

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-card border border-border/80 dark:border-white/10 shadow-soft flex flex-col justify-between space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-border/60">
        <div>
          <h3 className="text-base font-extrabold text-foreground tracking-tight flex items-center gap-2">
            <Building2 className="w-4 h-4 text-primary" />
            <span>Department-wise Hiring Performance</span>
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Application volume, resulting hires, and velocity segmented by department.
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-muted-foreground shrink-0">
          <span>Departments:</span>
          <span className="font-extrabold text-foreground">{departments.length} active</span>
        </div>
      </div>

      {/* Department Cards Grid: 2x2 grid that uses available horizontal space comfortably */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {departments.map((dept) => {
          const appWidth = Math.max(10, Math.round((dept.applications / maxApps) * 100))

          return (
            <div
              key={dept.department}
              className={cn(
                "p-3.5 rounded-xl border transition-all duration-200 flex flex-col justify-between space-y-2.5",
                dept.isHighlighted
                  ? "bg-card border-border/90 shadow-2xs hover:shadow-soft"
                  : "bg-muted/20 border-border/60 opacity-80"
              )}
            >
              {/* Department Title & Openings */}
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-0.5 min-w-0">
                  <h4 className="font-extrabold text-foreground text-xs truncate">
                    {dept.department}
                  </h4>
                  <span className="text-[11px] text-muted-foreground block">
                    {dept.openings} open requisition{dept.openings === 1 ? "" : "s"}
                  </span>
                </div>
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0 mt-1"
                  style={{ backgroundColor: dept.color }}
                />
              </div>

              {/* Progress Bar of Applications */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] font-semibold">
                  <span className="text-muted-foreground">Applications Inflow</span>
                  <span className="font-bold text-foreground">{dept.applications} candidates</span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted/60 dark:bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${appWidth}%`,
                      backgroundColor: dept.color,
                    }}
                  />
                </div>
              </div>

              {/* Metrics Pill Row */}
              <div className="grid grid-cols-3 gap-1.5 pt-1 border-t border-border/50 text-center text-xs">
                <div className="p-1.5 rounded-lg bg-muted/30 dark:bg-white/5 space-y-0.5">
                  <span className="text-[9px] text-muted-foreground uppercase font-bold block">Hired</span>
                  <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 block">
                    {dept.hires}
                  </span>
                </div>

                <div className="p-1.5 rounded-lg bg-muted/30 dark:bg-white/5 space-y-0.5">
                  <span className="text-[9px] text-muted-foreground uppercase font-bold block">Avg Time</span>
                  <span className="text-xs font-bold text-foreground block">
                    {dept.avgTimeToHire}d
                  </span>
                </div>

                <div className="p-1.5 rounded-lg bg-muted/30 dark:bg-white/5 space-y-0.5">
                  <span className="text-[9px] text-muted-foreground uppercase font-bold block">Offer %</span>
                  <span className="text-xs font-bold text-primary block">
                    {dept.offerAcceptance}
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
