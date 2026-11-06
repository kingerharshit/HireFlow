import * as React from "react"
import {
  LayoutDashboard,
  Briefcase,
  Users,
  FileText,
  Calendar,
  BarChart3,
  Settings,
} from "lucide-react"
import { SidebarNavItem } from "./SidebarNavItem"

const WORKSPACE_ITEMS = [
  {
    to: "/recruiter/dashboard",
    label: "Overview",
    icon: LayoutDashboard,
  },
  {
    to: "/recruiter/jobs",
    label: "Jobs",
    icon: Briefcase,
  },
  {
    to: "/recruiter/candidates",
    label: "Candidates",
    icon: Users,
  },
  {
    to: "/recruiter/applications",
    label: "Applications",
    icon: FileText,
  },
  {
    to: "/recruiter/interviews",
    label: "Interviews",
    icon: Calendar,
  },
  {
    to: "/recruiter/analytics",
    label: "Analytics",
    icon: BarChart3,
  },
]

const PREFERENCES_ITEMS = [
  {
    to: "/recruiter/settings",
    label: "Settings",
    icon: Settings,
  },
]

export function SidebarNavigation({ isCollapsed = false, onItemClick }) {
  return (
    <nav className="flex-1 min-h-0 space-y-6 overflow-y-auto px-3 py-2 scrollbar-none select-none">
      {/* Workspace Section */}
      <div className="space-y-1">
        {!isCollapsed ? (
          <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 mb-2 select-none">
            Workspace
          </p>
        ) : (
          <div className="w-6 mx-auto h-[1px] bg-border/60 my-1.5" />
        )}

        <div className="space-y-1">
          {WORKSPACE_ITEMS.map((item) => (
            <SidebarNavItem
              key={item.to}
              to={item.to}
              label={item.label}
              icon={item.icon}
              badge={item.badge}
              isCollapsed={isCollapsed}
              onClick={onItemClick}
            />
          ))}
        </div>
      </div>

      {/* Preferences Section */}
      <div className="space-y-1 pt-2">
        {!isCollapsed ? (
          <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 mb-2 select-none">
            Preferences
          </p>
        ) : (
          <div className="w-6 mx-auto h-[1px] bg-border/60 my-2" />
        )}

        <div className="space-y-1">
          {PREFERENCES_ITEMS.map((item) => (
            <SidebarNavItem
              key={item.to}
              to={item.to}
              label={item.label}
              icon={item.icon}
              isCollapsed={isCollapsed}
              onClick={onItemClick}
            />
          ))}
        </div>
      </div>
    </nav>
  )
}

