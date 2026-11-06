import * as React from "react"
import { useEffect } from "react"
import { X } from "lucide-react"
import { BrandLogo } from "@/components/common/BrandLogo"
import { SidebarNavigation } from "./SidebarNavigation"
import { SidebarProfile } from "./SidebarProfile"
import { cn } from "@/lib/utils"

export function MobileSidebar({ isOpen, onClose }) {
  // Close drawer on Escape key press and prevent background scrolling
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.body.style.overflow = "hidden"
      window.addEventListener("keydown", handleKeyDown)
    } else {
      document.body.style.overflow = ""
    }

    return () => {
      document.body.style.overflow = ""
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true">
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-200 animate-in fade-in-50"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-in drawer panel */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 w-72 max-w-[85vw] bg-card border-r border-border shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-in-out animate-in slide-in-from-left duration-250 select-none"
        )}
      >
        {/* Mobile Header with Logo & Close Button */}
        <div className="h-16 flex items-center justify-between border-b border-border/70 px-4">
          <BrandLogo
            to="/recruiter/dashboard"
            subtitle="Recruitment Workspace"
            size="sm"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation"
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Navigation */}
        <SidebarNavigation isCollapsed={false} onItemClick={onClose} />

        {/* Bottom Profile */}
        <SidebarProfile isCollapsed={false} />
      </div>
    </div>
  )
}

