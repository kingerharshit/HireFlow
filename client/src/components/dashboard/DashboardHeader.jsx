import * as React from "react"
import { useState } from "react"
import { Plus, Calendar, Sparkles, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function DashboardHeader({
  userName = "Alex",
  className,
}) {
  const [toastMessage, setToastMessage] = useState(null)

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 17) return "Good afternoon"
    return "Good evening"
  }

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date())

  const handleCreateJob = () => {
    setToastMessage("Job creation workflow scheduled for upcoming milestone")
    setTimeout(() => setToastMessage(null), 3500)
  }

  return (
    <div className={cn("space-y-4 select-none", className)}>
      {/* Toast feedback notice */}
      {toastMessage && (
        <div className="p-3 rounded-xl bg-secondary border border-primary/20 text-xs font-semibold text-foreground flex items-center justify-between shadow-soft-sm animate-in fade-in-50 duration-150">
          <span className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary shrink-0" />
            <span>{toastMessage}</span>
          </span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-[11px] text-muted-foreground hover:text-foreground cursor-pointer font-bold px-1.5"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Header Container */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/60 dark:border-white/10">
        {/* Left: Greeting & Subtitle */}
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              {getGreeting()}, {userName}
            </h1>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Workspace Active" />
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Here&apos;s what&apos;s happening with your recruitment workspace.
          </p>
        </div>

        {/* Right: Date Badge & Action Button */}
        <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
          {/* Current Date Display */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-border/80 dark:border-white/10 bg-card text-xs font-medium text-muted-foreground shadow-soft-xs">
            <Calendar className="w-3.5 h-3.5 text-primary shrink-0" />
            <span className="truncate">{formattedDate}</span>
          </div>

          {/* Create Job Primary Button */}
          <Button
            type="button"
            variant="default"
            onClick={handleCreateJob}
            className="h-9 px-4 text-xs font-semibold rounded-xl shadow-soft-sm hover:shadow transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4 shrink-0" />
            <span>Create Job</span>
          </Button>
        </div>
      </div>
    </div>
  )
}

