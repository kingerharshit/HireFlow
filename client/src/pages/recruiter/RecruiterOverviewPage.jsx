import * as React from "react"
import { DashboardHeader } from "@/components/dashboard/DashboardHeader"
import { StatsSection } from "@/components/dashboard/StatsSection"
import { ActiveJobsSection } from "@/components/dashboard/ActiveJobsSection"
import { RecentApplicationsSection } from "@/components/dashboard/RecentApplicationsSection"
import { Sparkles, Layers } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function RecruiterOverviewPage() {
  return (
    <div className="space-y-8 animate-in fade-in-50 duration-200">
      {/* 1. Overview Page Welcome Header */}
      <DashboardHeader userName="Alex" />

      {/* 2. Primary Key Metrics Statistics Cards Section */}
      <StatsSection />

      {/* 3. Active Job Roles Section */}
      <ActiveJobsSection />

      {/* 4. Recent Applications Section */}
      <RecentApplicationsSection />

      {/* 5. Milestone 6.6.5 Completed Canvas */}
      <div className="rounded-2xl border border-dashed border-border/80 dark:border-white/10 bg-card/40 p-5 sm:p-6 space-y-2 select-none">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">
                Recruiter Workspace • Milestone 6.6.5 Active
              </h3>
              <p className="text-xs text-muted-foreground">
                Recent applications table, status badges, AI match scores, and candidate profile drawer mounted.
              </p>
            </div>
          </div>

          <Badge variant="outline" className="self-start sm:self-auto gap-1 text-[11px] bg-primary/5 text-primary border-primary/20">
            <Sparkles className="w-3 h-3" />
            <span>Applications Pipeline Verified</span>
          </Badge>
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed pt-2 border-t border-border/50">
          Hiring funnel analytics charts and AI recruitment assistant are scheduled for subsequent milestones.
        </p>
      </div>
    </div>
  )
}
