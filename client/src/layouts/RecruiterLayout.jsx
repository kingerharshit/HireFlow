import * as React from "react"
import { useState } from "react"
import { Outlet } from "react-router-dom"
import { RecruiterSidebar } from "@/components/navigation/RecruiterSidebar"
import { MobileSidebar } from "@/components/navigation/MobileSidebar"
import { RecruiterTopbar } from "@/components/navigation/RecruiterTopbar"

export function RecruiterLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

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

      {/* Main Layout Area: Top Navigation + Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Professional Recruiter Top Navbar */}
        <RecruiterTopbar
          isSidebarCollapsed={isCollapsed}
          onToggleSidebarCollapse={() => setIsCollapsed(!isCollapsed)}
          onOpenMobileMenu={() => setMobileOpen(true)}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
