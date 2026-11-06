import * as React from "react"
import {
  LayoutDashboard,
  Briefcase,
  Users,
  FileText,
  Calendar,
  BarChart3,
  Settings,
  Sparkles,
  ArrowRight,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function RecruiterPlaceholderPage({
  title = "Module",
  description = "This workspace view will be implemented in subsequent milestones.",
  icon: Icon = LayoutDashboard,
}) {
  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/60 dark:border-white/10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            {title}
          </h1>
          <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
            {description}
          </p>
        </div>

        <Badge
          variant="outline"
          className="self-start sm:self-auto gap-1.5 px-3 py-1 text-xs font-semibold bg-primary/5 text-primary border-primary/20"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Milestone 6.6.1 Shell Active</span>
        </Badge>
      </div>

      {/* Clean Placeholder Canvas (No fake data or fake stats) */}
      <div className="rounded-2xl border border-dashed border-border/90 dark:border-white/10 bg-card/60 dark:bg-card/30 p-8 sm:p-12 text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-primary/10 dark:bg-primary/20 text-primary mx-auto flex items-center justify-center shadow-soft-xs">
          <Icon className="w-7 h-7 stroke-[2]" />
        </div>

        <div className="max-w-md mx-auto space-y-2">
          <h2 className="text-lg font-bold text-foreground">
            {title} View Ready
          </h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            The recruiter layout, collapsible sidebar, responsive drawer, and theme integration are active for this route. Business features and real backend connections will be built in the upcoming milestone.
          </p>
        </div>

        <div className="pt-2 flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1 font-mono text-[11px] bg-muted/60 dark:bg-white/5 px-2 py-1 rounded">
            Route: /recruiter/{title.toLowerCase()}
          </span>
          <span>•</span>
          <span className="text-primary font-semibold">Shell Verified</span>
        </div>
      </div>
    </div>
  )
}

export function RecruiterDashboardPage() {
  return (
    <RecruiterPlaceholderPage
      title="Overview"
      description="Monitor active recruitment requisitions, candidate pipelines, and scheduling queues."
      icon={LayoutDashboard}
    />
  )
}

export function RecruiterJobsPage() {
  return (
    <RecruiterPlaceholderPage
      title="Jobs"
      description="Manage published job openings, candidate match criteria, and tenant requirements."
      icon={Briefcase}
    />
  )
}

export function RecruiterCandidatesPage() {
  return (
    <RecruiterPlaceholderPage
      title="Candidates"
      description="Review candidate talent pool, AI evaluation scores, and contact profiles."
      icon={Users}
    />
  )
}

export function RecruiterApplicationsPage() {
  return (
    <RecruiterPlaceholderPage
      title="Applications"
      description="Track submitted applications across job requisitions and candidate stages."
      icon={FileText}
    />
  )
}

export function RecruiterInterviewsPage() {
  return (
    <RecruiterPlaceholderPage
      title="Interviews"
      description="Coordinate interview rounds, interviewer feedback rubrics, and calendars."
      icon={Calendar}
    />
  )
}

export function RecruiterAnalyticsPage() {
  return (
    <RecruiterPlaceholderPage
      title="Analytics"
      description="Analyze hiring velocity, conversion funnel stages, and talent pipeline metrics."
      icon={BarChart3}
    />
  )
}

export function RecruiterSettingsPage() {
  return (
    <RecruiterPlaceholderPage
      title="Settings"
      description="Configure workspace preferences, recruitment team members, and tenant identity."
      icon={Settings}
    />
  )
}

