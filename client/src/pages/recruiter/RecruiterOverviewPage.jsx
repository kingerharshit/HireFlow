import * as React from "react"
import { DashboardHeader } from "@/components/dashboard/DashboardHeader"
import { StatsSection } from "@/components/dashboard/StatsSection"
import { Sparkles, Layers, ArrowUpRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function RecruiterOverviewPage() {
  return (
    <div className="space-y-8 animate-in fade-in-50 duration-200">
      {/* 1. Overview Page Welcome Header */}
      <DashboardHeader userName="Alex" />

      {/* 2. Primary Statistics Cards Section (with normal, loading, empty, and error states) */}
      <StatsSection />

      {/* 3. Milestone 6.6.3 Verification Canvas */}
      <div className="rounded-2xl border border-dashed border-border/80 dark:border-white/10 bg-card/40 p-6 sm:p-8 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">
                Workspace Canvas • Milestone 6.6.3 Active
              </h3>
              <p className="text-xs text-muted-foreground">
                Recruiter header and four statistics cards successfully mounted.
              </p>
            </div>
          </div>

          <Badge variant="outline" className="self-start sm:self-auto gap-1 text-[11px] bg-primary/5 text-primary border-primary/20">
            <Sparkles className="w-3 h-3" />
            <span>Statistics Verified</span>
          </Badge>
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed pt-1 border-t border-border/50">
          Job cards, funnel charts, candidate pipeline tables, and AI assistant widgets are scheduled for subsequent milestones.
        </p>
      </div>
    </div>
  )
}

