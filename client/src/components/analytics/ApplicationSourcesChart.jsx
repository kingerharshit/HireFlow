import * as React from "react"
import { Share2, Globe, Users, ExternalLink, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

export function ApplicationSourcesChart({ sources = [] }) {
  const totalApps = sources.reduce((acc, s) => acc + s.count, 0) || 1

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-card border border-border/80 dark:border-white/10 shadow-soft flex flex-col justify-between space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-border/60">
        <div>
          <h3 className="text-base font-extrabold text-foreground tracking-tight flex items-center gap-2">
            <Share2 className="w-4 h-4 text-primary" />
            <span>Candidate Acquisition Channels</span>
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Breakdown of candidate origin channels, application volume, and resulting hires.
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-muted-foreground shrink-0">
          <span>Top Channel:</span>
          <span className="font-extrabold text-primary">LinkedIn (46%)</span>
        </div>
      </div>

      {/* Multi-segment Stacked Distribution Bar */}
      <div className="space-y-1">
        <div className="h-2.5 w-full rounded-full overflow-hidden flex p-0.5 bg-muted/40 dark:bg-white/5 border border-border/60">
          {sources.map((s) => (
            <div
              key={s.source}
              className="h-full first:rounded-l-full last:rounded-r-full transition-all duration-300 hover:opacity-85"
              style={{
                width: `${Math.max(2, s.percentage)}%`,
                backgroundColor: s.color,
              }}
              title={`${s.source}: ${s.count} candidates (${s.percentage}%)`}
            />
          ))}
        </div>
        <div className="flex items-center justify-between text-[10px] text-muted-foreground font-mono">
          <span>0%</span>
          <span>50%</span>
          <span>100% Volume</span>
        </div>
      </div>

      {/* Channel Breakdown Cards */}
      <div className="space-y-2">
        {sources.map((s) => (
          <div
            key={s.source}
            className="p-2.5 rounded-xl bg-muted/30 dark:bg-white/[0.02] border border-border/60 flex items-center justify-between gap-3 text-xs hover:bg-muted/50 transition-colors"
          >
            {/* Left: Source Icon / Color + Name */}
            <div className="flex items-center gap-2 min-w-0">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: s.color }}
              />
              <div className="min-w-0">
                <span className="font-bold text-foreground block truncate text-xs">
                  {s.source}
                </span>
                <span className="text-[10px] text-muted-foreground">
                  {s.hires} hire{s.hires === 1 ? "" : "s"} generated
                </span>
              </div>
            </div>

            {/* Right: Count, Percentage & Conversion Rate */}
            <div className="flex items-center gap-2.5 shrink-0 text-right">
              {s.conversionRate > 0 && (
                <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20 hidden sm:inline">
                  {s.conversionRate}% hire rate
                </span>
              )}
              <div>
                <span className="font-black text-foreground block text-xs">
                  {s.count}
                </span>
                <span className="text-[10px] font-semibold text-muted-foreground">
                  {s.percentage}% share
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Insight Highlight */}
      <div className="p-2.5 rounded-xl bg-primary/5 border border-primary/20 flex items-start gap-2 text-xs text-muted-foreground">
        <Sparkles className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
        <span className="text-[11px] leading-tight">
          <strong className="text-foreground">Referral Efficiency:</strong> Employee referrals demonstrate the highest conversion yield at 9.1% with 3 senior hires from 33 applicants.
        </span>
      </div>
    </div>
  )
}
