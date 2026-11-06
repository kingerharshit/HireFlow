import * as React from "react"
import { Menu, PanelLeftClose, PanelLeftOpen } from "lucide-react"
import { Breadcrumbs } from "./Breadcrumbs"
import { GlobalSearch } from "./GlobalSearch"
import { OrganizationSwitcher } from "./OrganizationSwitcher"
import { NotificationDropdown } from "./NotificationDropdown"
import { RecruiterProfileMenu } from "./RecruiterProfileMenu"
import { ThemeToggle } from "@/components/common/ThemeToggle"
import { cn } from "@/lib/utils"

export function RecruiterTopbar({
  isSidebarCollapsed = false,
  onToggleSidebarCollapse,
  onOpenMobileMenu,
  className,
}) {
  return (
    <header
      className={cn(
        "h-16 sticky top-0 z-20 flex items-center justify-between border-b border-border/80 dark:border-white/10 bg-card/85 dark:bg-[#14151B]/85 backdrop-blur-md px-3 sm:px-5 lg:px-6 select-none transition-colors duration-200",
        className
      )}
      aria-label="Recruiter Top Navigation"
    >
      {/* ============================================================ */}
      {/* LEFT SECTION: Sidebar toggles & Breadcrumbs                  */}
      {/* ============================================================ */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Mobile Hamburger Trigger */}
        <button
          type="button"
          onClick={onOpenMobileMenu}
          aria-label="Open mobile navigation menu"
          className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Desktop / Tablet Sidebar Toggle Button */}
        {onToggleSidebarCollapse && (
          <button
            type="button"
            onClick={onToggleSidebarCollapse}
            aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="hidden md:inline-flex p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {isSidebarCollapsed ? (
              <PanelLeftOpen className="w-4 h-4" />
            ) : (
              <PanelLeftClose className="w-4 h-4" />
            )}
          </button>
        )}

        {/* Dynamic Breadcrumbs */}
        <Breadcrumbs />
      </div>

      {/* ============================================================ */}
      {/* RIGHT SECTION: Search, Org Switcher, Notifications, Profile   */}
      {/* ============================================================ */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 lg:gap-3 ml-auto">
        {/* Global Search Component */}
        <GlobalSearch />

        {/* Organization Switcher Dropdown */}
        <OrganizationSwitcher />

        {/* Vertical divider */}
        <div className="h-5 w-[1px] bg-border/60 dark:bg-white/10 mx-0.5 hidden sm:block" />

        {/* Notification Bell Dropdown */}
        <NotificationDropdown />

        {/* Theme Toggle Button */}
        <ThemeToggle />

        {/* Recruiter Profile Menu Dropdown */}
        <RecruiterProfileMenu />
      </div>
    </header>
  )
}

