import * as React from "react"
import { useState } from "react"
import { Link } from "react-router-dom"
import { ChevronsUpDown, LogOut, ShieldCheck, User } from "lucide-react"
import { cn } from "@/lib/utils"

export function SidebarProfile({ isCollapsed = false }) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="relative border-t border-border/80 dark:border-white/10 p-3 select-none shrink-0 mt-auto bg-card">
      {/* Dropdown Menu Popup (Interactive Placeholder) */}
      {menuOpen && (
        <div
          role="menu"
          className={cn(
            "absolute bottom-full mb-2 bg-popover text-popover-foreground rounded-xl border border-border/90 shadow-soft-lg p-1.5 z-50 animate-in fade-in-50 zoom-in-95 duration-150",
            isCollapsed ? "left-3 w-56" : "left-3 right-3"
          )}
        >
          <div className="px-2.5 py-2 border-b border-border/60 mb-1">
            <p className="text-xs font-bold text-foreground">Alex Chen</p>
            <p className="text-[11px] text-muted-foreground">alex.chen@hireflow.io</p>
            <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-semibold text-primary">
              <ShieldCheck className="w-3 h-3" />
              Organization Owner
            </span>
          </div>

          <Link
            to="/recruiter/settings"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-foreground hover:bg-muted/70 transition-colors"
          >
            <User className="w-3.5 h-3.5 text-muted-foreground" />
            <span>Profile &amp; Account</span>
          </Link>

          <Link
            to="/auth/login"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors mt-0.5"
          >
            <LogOut className="w-3.5 h-3.5 text-destructive" />
            <span>Sign out</span>
          </Link>
        </div>
      )}

      {/* Main Profile Trigger Button */}
      <button
        type="button"
        onClick={() => setMenuOpen(!menuOpen)}
        title={isCollapsed ? "Alex Chen • Organization Owner" : undefined}
        aria-expanded={menuOpen}
        aria-haspopup="true"
        className={cn(
          "w-full flex items-center rounded-xl p-2 transition-all duration-150 text-left cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring hover:bg-muted/70 dark:hover:bg-white/5",
          isCollapsed ? "justify-center" : "gap-3"
        )}
      >
        {/* Recruiter Avatar Initials */}
        <div className="relative shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#F47758] to-[#D94F2D] text-white flex items-center justify-center font-bold text-xs shadow-soft-xs ring-2 ring-primary/20">
            AC
          </div>
          {/* Active Presence Dot */}
          <span
            className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-card dark:border-[#14151B]"
            title="Active"
          />
        </div>

        {/* User & Organization Details when Expanded */}
        {!isCollapsed && (
          <>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-foreground truncate leading-tight">
                Alex Chen
              </p>
              <p className="text-[11px] text-muted-foreground truncate leading-tight mt-0.5 font-medium">
                Organization Owner
              </p>
            </div>
            <ChevronsUpDown className="w-4 h-4 text-muted-foreground shrink-0" />
          </>
        )}
      </button>
    </div>
  )
}

