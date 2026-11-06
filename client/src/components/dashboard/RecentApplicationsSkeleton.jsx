import * as React from "react"
import { cn } from "@/lib/utils"

export function RecentApplicationsSkeleton({ count = 5, className }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border/80 dark:border-white/10 bg-card p-5 space-y-4 animate-pulse select-none",
        className
      )}
      aria-label="Loading recent applications"
    >
      {/* Skeleton Header */}
      <div className="flex items-center justify-between pb-3 border-b border-border/60">
        <div className="space-y-2">
          <div className="h-5 w-48 bg-muted rounded-md" />
          <div className="h-3 w-72 bg-muted/70 rounded-md" />
        </div>
        <div className="h-8 w-24 bg-muted rounded-lg" />
      </div>

      {/* Skeleton Rows (Desktop) */}
      <div className="hidden md:block space-y-3">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between py-3 border-b border-border/40 gap-4"
          >
            <div className="flex items-center gap-3 w-1/4">
              <div className="w-9 h-9 rounded-full bg-muted shrink-0" />
              <div className="space-y-1.5 flex-1">
                <div className="h-3.5 w-3/4 bg-muted rounded" />
                <div className="h-2.5 w-1/2 bg-muted/60 rounded" />
              </div>
            </div>
            <div className="w-1/4 space-y-1">
              <div className="h-3.5 w-4/5 bg-muted rounded" />
              <div className="h-2.5 w-1/3 bg-muted/60 rounded" />
            </div>
            <div className="w-1/6">
              <div className="h-3 w-20 bg-muted rounded" />
            </div>
            <div className="w-1/6">
              <div className="h-5 w-16 bg-muted rounded-md" />
            </div>
            <div className="w-1/6">
              <div className="h-5 w-20 bg-muted rounded-full" />
            </div>
            <div className="w-10">
              <div className="h-7 w-7 bg-muted rounded-lg ml-auto" />
            </div>
          </div>
        ))}
      </div>

      {/* Skeleton Cards (Mobile) */}
      <div className="block md:hidden space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="p-4 rounded-xl border border-border/60 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-muted shrink-0" />
              <div className="space-y-1.5 flex-1">
                <div className="h-3.5 w-32 bg-muted rounded" />
                <div className="h-2.5 w-24 bg-muted/60 rounded" />
              </div>
              <div className="h-5 w-16 bg-muted rounded-full" />
            </div>
            <div className="h-3 w-3/4 bg-muted rounded" />
            <div className="flex items-center justify-between pt-2">
              <div className="h-3 w-20 bg-muted rounded" />
              <div className="h-4 w-14 bg-muted rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

