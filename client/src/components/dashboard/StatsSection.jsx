import * as React from "react"
import { useState } from "react"
import { BarChart3, AlertCircle, RotateCcw, Sparkles } from "lucide-react"
import { StatCard } from "./StatCard"
import { StatCardSkeleton } from "./StatCardSkeleton"
import { DEMO_STATISTICS } from "@/features/dashboard/dashboardStatsData"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function StatsSection({
  stats = DEMO_STATISTICS,
  className,
}) {
  const [uiState, setUiState] = useState("normal") // 'normal' | 'loading' | 'empty' | 'error'

  return (
    <section className={cn("space-y-4 select-none", className)} aria-label="Recruiter Statistics">
      {/* Section Subheader */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
            Key Metrics
          </h2>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
            Demonstration Data
          </span>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 1. LOADING SKELETON STATE                                    */}
      {/* ============================================================ */}
      {uiState === "loading" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 animate-in fade-in-50 duration-200">
          {[1, 2, 3, 4].map((i) => (
            <StatCardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* ============================================================ */}
      {/* 2. EMPTY STATE                                               */}
      {/* ============================================================ */}
      {uiState === "empty" && (
        <div className="rounded-2xl border border-dashed border-border/90 dark:border-white/10 bg-card/60 p-8 sm:p-12 text-center space-y-4 animate-in fade-in-50 duration-200">
          <div className="w-12 h-12 rounded-2xl bg-muted text-muted-foreground mx-auto flex items-center justify-center">
            <BarChart3 className="w-6 h-6 stroke-[2]" />
          </div>

          <div className="max-w-sm mx-auto space-y-1.5">
            <h3 className="text-base font-bold text-foreground">
              No recruitment metrics yet
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Once job requisitions are published and candidates submit applications, real-time metrics and funnel analytics will populate here.
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={() => setUiState("normal")}
            className="text-xs font-semibold h-9 rounded-xl"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
            <span>Restore Demonstration Data</span>
          </Button>
        </div>
      )}

      {/* ============================================================ */}
      {/* 3. ERROR STATE                                               */}
      {/* ============================================================ */}
      {uiState === "error" && (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-6 sm:p-8 text-center space-y-3 text-destructive animate-in fade-in-50 duration-200">
          <div className="w-11 h-11 rounded-xl bg-destructive/20 text-destructive mx-auto flex items-center justify-center">
            <AlertCircle className="w-6 h-6 stroke-[2.25]" />
          </div>

          <div className="max-w-sm mx-auto space-y-1">
            <h3 className="text-sm font-bold text-foreground">
              Unable to load statistics
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              We encountered an issue retrieving the latest workspace metrics. Please check your connection and retry.
            </p>
          </div>

          <Button
            type="button"
            variant="destructive"
            onClick={() => setUiState("normal")}
            className="text-xs font-semibold h-8 rounded-xl px-4 mt-1"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
            <span>Retry Connection</span>
          </Button>
        </div>
      )}

      {/* ============================================================ */}
      {/* 4. POPULATED NORMAL STATE                                    */}
      {/* ============================================================ */}
      {uiState === "normal" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 animate-in fade-in-50 duration-200">
          {stats.map((item) => (
            <StatCard
              key={item.id}
              title={item.title}
              value={item.value}
              label={item.label}
              change={item.change}
              isPositive={item.isPositive}
              period={item.period}
              icon={item.icon}
            />
          ))}
        </div>
      )}
    </section>
  )
}

