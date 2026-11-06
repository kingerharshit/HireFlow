import * as React from "react"
import { useState, useRef, useEffect } from "react"
import { Link } from "react-router-dom"
import { User, Settings, Shield, LogOut, ChevronDown, Check } from "lucide-react"
import { cn } from "@/lib/utils"

export function RecruiterProfileMenu({ className }) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className={cn("relative select-none", className)} ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label="Recruiter profile menu: Alex Chen, Organization Owner"
        className="flex items-center gap-2 p-1 sm:px-2 sm:py-1 rounded-xl border border-transparent hover:border-border/80 hover:bg-muted/60 transition-all cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {/* Recruiter Avatar Badge */}
        <div className="relative shrink-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#F47758] to-[#D94F2D] text-white flex items-center justify-center font-bold text-xs shadow-soft-xs ring-2 ring-primary/20">
            AC
          </div>
          {/* Active Status Dot */}
          <span
            className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-card"
            title="Available"
          />
        </div>

        {/* Display name & Chevron on desktop */}
        <div className="hidden lg:flex flex-col text-left leading-none">
          <span className="text-xs font-bold text-foreground">Alex Chen</span>
          <span className="text-[10px] text-muted-foreground mt-0.5 font-medium">Owner</span>
        </div>

        <ChevronDown className="hidden sm:inline w-3.5 h-3.5 text-muted-foreground" />
      </button>

      {/* Profile Dropdown Menu */}
      {isOpen && (
        <div
          role="menu"
          aria-label="Profile options"
          className="absolute top-full mt-1.5 right-0 w-60 bg-popover text-popover-foreground rounded-2xl border border-border/90 shadow-soft-xl p-1.5 z-50 animate-in fade-in-50 zoom-in-95 duration-150"
        >
          {/* Header */}
          <div className="px-3 py-2.5 border-b border-border/70 mb-1">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#F47758] to-[#D94F2D] text-white flex items-center justify-center font-bold text-xs shadow-xs shrink-0">
                AC
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-foreground truncate">Alex Chen</p>
                <p className="text-[11px] text-muted-foreground truncate">alex.chen@hireflow.io</p>
              </div>
            </div>

            <div className="mt-2 pt-2 border-t border-border/50 flex items-center justify-between text-[10px]">
              <span className="font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">
                Organization Owner
              </span>
              <span className="text-muted-foreground font-mono">Workspace ID: #HF-01</span>
            </div>
          </div>

          {/* Menu Items */}
          <div className="space-y-0.5">
            <Link
              to="/recruiter/settings"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-foreground hover:bg-muted/70 transition-colors"
            >
              <User className="w-3.5 h-3.5 text-muted-foreground" />
              <span>Recruiter Profile</span>
            </Link>

            <Link
              to="/recruiter/settings"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-foreground hover:bg-muted/70 transition-colors"
            >
              <Settings className="w-3.5 h-3.5 text-muted-foreground" />
              <span>Account Settings</span>
            </Link>

            <Link
              to="/recruiter/settings"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-foreground hover:bg-muted/70 transition-colors"
            >
              <Shield className="w-3.5 h-3.5 text-muted-foreground" />
              <span>Security &amp; Permissions</span>
            </Link>
          </div>

          {/* Sign Out Footer */}
          <div className="pt-1 mt-1 border-t border-border/70">
            <Link
              to="/auth/login"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5 text-destructive" />
              <span>Sign out (Demo)</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

