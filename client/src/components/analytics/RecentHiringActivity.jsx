import * as React from "react"
import { History, UserCheck, CheckCircle2, CalendarCheck, Star, FileText } from "lucide-react"
import { cn } from "@/lib/utils"

const TYPE_CONFIGS = {
  HIRED: {
    label: "Candidate Hired",
    badgeClass: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/25",
    icon: UserCheck,
  },
  OFFER_ACCEPTED: {
    label: "Offer Accepted",
    badgeClass: "bg-teal-500/10 text-teal-700 dark:text-teal-400 border-teal-500/25",
    icon: CheckCircle2,
  },
  INTERVIEW_COMPLETED: {
    label: "Interview Done",
    badgeClass: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/25",
    icon: CalendarCheck,
  },
  SHORTLISTED: {
    label: "Shortlisted",
    badgeClass: "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/25",
    icon: Star,
  },
  APPLICATION_RECEIVED: {
    label: "New Applicant",
    badgeClass: "bg-primary/10 text-primary border-primary/25",
    icon: FileText,
  },
}

export function RecentHiringActivity({ milestones = [] }) {
  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-card border border-border/80 dark:border-white/10 shadow-soft space-y-3.5">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-border/60">
        <div>
          <h3 className="text-base font-extrabold text-foreground tracking-tight flex items-center gap-2">
            <History className="w-4 h-4 text-primary" />
            <span>Recent Recruitment Milestones</span>
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Real-time pipeline activity across Acme Technologies requisitions.
          </p>
        </div>

        <span className="text-[10px] font-mono text-muted-foreground bg-muted/60 px-2 py-0.5 rounded">
          Live Stream
        </span>
      </div>

      {/* Activity Responsive Grid: Uses horizontal space effectively across all breakpoints */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
        {milestones.map((item) => {
          const config = TYPE_CONFIGS[item.type] || TYPE_CONFIGS.APPLICATION_RECEIVED
          const Icon = config.icon

          return (
            <div
              key={item.id}
              className="p-3 rounded-xl bg-muted/30 dark:bg-white/[0.02] border border-border/60 flex flex-col justify-between space-y-2 text-xs hover:bg-muted/50 transition-colors"
            >
              {/* Card Top: Type badge & relative time */}
              <div className="flex items-center justify-between gap-1.5">
                <span
                  className={cn(
                    "inline-flex items-center gap-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold border",
                    config.badgeClass
                  )}
                >
                  <Icon className="w-2.5 h-2.5" />
                  <span>{config.label}</span>
                </span>
                <span className="text-[10px] text-muted-foreground font-medium">
                  {item.relativeTime}
                </span>
              </div>

              {/* Card Center: Avatar & Candidate */}
              <div className="flex items-center gap-2 min-w-0 pt-0.5">
                <div
                  className={cn(
                    "w-7 h-7 rounded-lg text-white font-bold text-[10px] flex items-center justify-center shrink-0 shadow-2xs bg-gradient-to-br",
                    item.candidateGradient
                  )}
                >
                  {item.candidateAvatar}
                </div>
                <div className="min-w-0">
                  <span className="font-extrabold text-foreground text-xs truncate block">
                    {item.candidateName}
                  </span>
                  <span className="text-[10px] text-muted-foreground truncate block">
                    {item.jobTitle}
                  </span>
                </div>
              </div>

              {/* Card Bottom: Milestone Detail */}
              <p className="text-[10px] text-muted-foreground/90 line-clamp-2 leading-relaxed pt-1 border-t border-border/40">
                {item.details}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
