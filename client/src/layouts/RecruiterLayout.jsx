import * as React from "react"
import { useState } from "react"
import { Outlet } from "react-router-dom"
import { RecruiterSidebar } from "@/components/navigation/RecruiterSidebar"
import { MobileSidebar } from "@/components/navigation/MobileSidebar"
import { RecruiterTopbar } from "@/components/navigation/RecruiterTopbar"
import { cn } from "@/lib/utils"

export function RecruiterLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen min-h-[100dvh] w-full max-w-full bg-background text-foreground antialiased transition-colors duration-200">
      {/* Desktop / Tablet Persistent Fixed Sidebar */}
      <div className="hidden md:block">
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

      {/* Main Application Area: Offset by current sidebar width on desktop */}
      <div
        className={cn(
          "flex flex-col min-w-0 min-h-screen min-h-[100dvh] md:h-screen md:h-[100dvh] md:overflow-hidden transition-[padding] duration-300 ease-in-out",
          isCollapsed ? "md:pl-20" : "md:pl-64"
        )}
      >
        {/* Professional Recruiter Top Navbar (Pinned at top of main area) */}
        <RecruiterTopbar
          isSidebarCollapsed={isCollapsed}
          onToggleSidebarCollapse={() => setIsCollapsed(!isCollapsed)}
          onOpenMobileMenu={() => setMobileOpen(true)}
        />

        {/* Main Content Area: Independently scrollable on desktop */}
        <main className="flex-1 md:overflow-y-auto md:overflow-x-hidden p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
