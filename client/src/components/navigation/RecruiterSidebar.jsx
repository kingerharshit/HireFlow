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
        "fixed inset-y-0 left-0 top-0 h-screen h-[100dvh] flex flex-col bg-card border-r border-border/80 dark:border-white/10 z-30 transition-[width] duration-300 ease-in-out select-none overflow-hidden",
        isCollapsed ? "w-20" : "w-64",
        className
      )}
      aria-label="Recruiter Sidebar"
    >
      {/* Top Sidebar Header & Branding Row */}
      <div
        className={cn(
          "h-16 flex items-center border-b border-border/70 dark:border-white/10 transition-colors duration-200 shrink-0",
          isCollapsed ? "justify-center px-2" : "justify-between px-3.5"
        )}
      >
        <BrandLogo
          to="/recruiter/dashboard"
          subtitle="Recruitment Workspace"
          size="sm"
          showWordmark={!isCollapsed}
          className={isCollapsed ? "mx-auto" : "min-w-0 flex-1"}
        />

        {!isCollapsed && onToggleCollapse && (
          <button
            type="button"
            onClick={onToggleCollapse}
            aria-label="Collapse sidebar"
            title="Collapse sidebar (Ctrl+B)"
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring shrink-0 ml-1"
          >
            <PanelLeftClose className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Expand control in Collapsed Sidebar (Centered, aligned with icons) */}
      {isCollapsed && onToggleCollapse && (
        <div className="px-3 pt-2 pb-1 border-b border-border/50 shrink-0">
          <button
            type="button"
            onClick={onToggleCollapse}
            aria-label="Expand sidebar"
            title="Expand sidebar (Ctrl+B)"
            className="w-10 h-10 mx-auto flex items-center justify-center rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <PanelLeftOpen className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Middle Scrollable Navigation (Scrolls internally only if height is exceeded) */}
      <SidebarNavigation isCollapsed={isCollapsed} />

      {/* Bottom Profile & Organization Card (Permanently anchored at bottom) */}
      <SidebarProfile isCollapsed={isCollapsed} />
    </aside>
  )
}
