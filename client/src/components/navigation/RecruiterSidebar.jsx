import * as React from "react"
import { PanelLeftClose, PanelLeftOpen } from "lucide-react"
import { BrandLogo } from "@/components/common/BrandLogo"
import { SidebarNavigation } from "./SidebarNavigation"
import { SidebarProfile } from "./SidebarProfile"
import { cn } from "@/lib/utils"

export function RecruiterSidebar({
  isCollapsed = false,
  onToggleCollapse,
  className,
}) {
  return (
    <aside
      className={cn(
        "h-screen sticky top-0 flex flex-col bg-card border-r border-border/80 dark:border-white/10 z-30 transition-[width] duration-300 ease-in-out select-none",
        isCollapsed ? "w-20" : "w-64",
        className
      )}
      aria-label="Recruiter Sidebar"
    >
      {/* Top Sidebar Header & Branding */}
      <div
        className={cn(
          "h-16 flex items-center border-b border-border/70 dark:border-white/10 px-4",
          isCollapsed ? "justify-center" : "justify-between"
        )}
      >
        {!isCollapsed ? (
          <>
            <BrandLogo
              to="/recruiter/dashboard"
              subtitle="Recruitment Workspace"
              size="sm"
            />
            {onToggleCollapse && (
              <button
                type="button"
                onClick={onToggleCollapse}
                aria-label="Collapse sidebar"
                title="Collapse sidebar (Ctrl+B)"
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <PanelLeftClose className="w-4 h-4" />
              </button>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center gap-1">
            <BrandLogo
              to="/recruiter/dashboard"
              showTagline={false}
              size="sm"
            />
            {onToggleCollapse && (
              <button
                type="button"
                onClick={onToggleCollapse}
                aria-label="Expand sidebar"
                title="Expand sidebar"
                className="mt-1 p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <PanelLeftOpen className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Middle Scrollable Navigation */}
      <SidebarNavigation isCollapsed={isCollapsed} />

      {/* Bottom Profile & Organization Card */}
      <SidebarProfile isCollapsed={isCollapsed} />
    </aside>
  )
}

