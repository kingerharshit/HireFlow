import * as React from "react"
import { useState } from "react"
import { Outlet, useLocation, Link } from "react-router-dom"
import { Menu, Bell, Sparkles, ChevronRight } from "lucide-react"
import { RecruiterSidebar } from "@/components/navigation/RecruiterSidebar"
import { MobileSidebar } from "@/components/navigation/MobileSidebar"
import { ThemeToggle } from "@/components/common/ThemeToggle"
import { Badge } from "@/components/ui/badge"

const ROUTE_TITLES = {
  "/recruiter": "Overview",
  "/recruiter/dashboard": "Overview",
  "/recruiter/jobs": "Jobs",
  "/recruiter/candidates": "Candidates",
  "/recruiter/applications": "Applications",
  "/recruiter/interviews": "Interviews",
  "/recruiter/analytics": "Analytics",
  "/recruiter/settings": "Settings",
}

export function RecruiterLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  const currentTitle = ROUTE_TITLES[location.pathname] || "Recruiter Workspace"

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden flex bg-background text-foreground antialiased transition-colors duration-200">
      {/* Desktop / Tablet Persistent & Collapsible Sidebar */}
      <div className="hidden md:block shrink-0">
        <RecruiterSidebar
          isCollapsed={isCollapsed}
          onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        />
      </div>

      {/* Mobile Slide-in Drawer */}
      <MobileSidebar
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />

      {/* Main Layout Area: Header + Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top Header Placeholder */}
        <header className="h-16 sticky top-0 z-20 flex items-center justify-between border-b border-border/70 dark:border-white/10 bg-card/80 dark:bg-card/60 backdrop-blur-md px-4 sm:px-6 select-none transition-colors duration-200">
          {/* Left: Mobile trigger & Breadcrumb */}
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger Menu Button */}
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation menu"
              className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Breadcrumb / Page Title */}
            <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Link
                to="/recruiter/dashboard"
                className="hover:text-foreground transition-colors font-medium hidden sm:inline"
              >
                Workspace
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/60 hidden sm:inline" />
              <span className="font-bold text-foreground text-sm sm:text-base tracking-tight">
                {currentTitle}
              </span>
            </nav>
          </div>

          {/* Right: Quick Indicators, Theme Toggle & Notification Placeholder */}
          <div className="flex items-center gap-2.5 sm:gap-3.5">
            {/* AI Status Badge */}
            <Badge
              variant="secondary"
              className="hidden lg:inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 bg-secondary/70 dark:bg-white/5 border border-border/80 dark:border-white/10"
            >
              <Sparkles className="w-3 h-3 text-primary animate-pulse" />
              <span>Multi-Tenant Hub</span>
            </Badge>

            {/* Notification Bell Placeholder */}
            <button
              type="button"
              aria-label="Notifications"
              title="Notifications"
              className="relative p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/70 dark:hover:bg-white/5 transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Bell className="w-4 h-4" />
              <span
                className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary ring-2 ring-card"
                title="1 Unread Notice"
              />
            </button>

            {/* Theme Toggle Button */}
            <ThemeToggle />
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

