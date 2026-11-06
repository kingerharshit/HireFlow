import * as React from "react"
import { NavLink } from "react-router-dom"
import { cn } from "@/lib/utils"

export function SidebarNavItem({
  to,
  label,
  icon: Icon,
  badge,
  isCollapsed = false,
  onClick,
}) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      title={isCollapsed ? label : undefined}
      className={({ isActive }) =>
        cn(
          "group relative flex items-center rounded-xl transition-all duration-150 select-none outline-none focus-visible:ring-2 focus-visible:ring-ring",
          isCollapsed
            ? "justify-center h-10 w-10 mx-auto"
            : "gap-3 px-3.5 py-2.5 text-sm font-medium w-full",
          isActive
            ? "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary font-semibold shadow-soft-xs"
            : "text-muted-foreground hover:text-foreground hover:bg-muted/70 dark:hover:bg-white/5"
        )
      }
    >
      {({ isActive }) => (
        <>
          {/* Active Accent Bar on Left (expanded mode) */}
          {!isCollapsed && isActive && (
            <span
              className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-primary"
              aria-hidden="true"
            />
          )}

          {/* Icon */}
          <Icon
            className={cn(
              "w-5 h-5 shrink-0 transition-colors",
              isActive
                ? "text-primary stroke-[2.25]"
                : "text-muted-foreground group-hover:text-foreground stroke-[1.75]"
            )}
            aria-hidden="true"
          />

          {/* Label when Expanded */}
          {!isCollapsed && (
            <span className="flex-1 truncate tracking-tight text-left">
              {label}
            </span>
          )}

          {/* Optional Badge when Expanded */}
          {!isCollapsed && badge && (
            <span className="ml-auto px-2 py-0.5 text-[10px] font-bold rounded-full bg-primary/10 text-primary border border-primary/20">
              {badge}
            </span>
          )}

          {/* Tooltip Popup on Hover when Collapsed */}
          {isCollapsed && (
            <div
              role="tooltip"
              className="pointer-events-none absolute left-full ml-3 px-2.5 py-1 rounded-md bg-popover text-popover-foreground text-xs font-semibold shadow-soft-md border border-border/80 whitespace-nowrap opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-150 z-50 hidden md:block"
            >
              {label}
              {badge && (
                <span className="ml-1.5 px-1.5 py-0.2 rounded text-[10px] bg-primary text-primary-foreground">
                  {badge}
                </span>
              )}
            </div>
          )}
        </>
      )}
    </NavLink>
  )
}

