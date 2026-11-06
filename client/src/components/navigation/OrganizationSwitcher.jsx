import * as React from "react"
import { useState, useRef, useEffect } from "react"
import { Check, ChevronsUpDown, Building2, Plus, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

const DEMO_ORGANIZATIONS = [
  {
    id: "org-1",
    name: "Acme Technologies",
    initials: "AT",
    plan: "Enterprise",
    members: "12 Members",
    gradient: "from-[#F47758] to-[#D94F2D]",
  },
  {
    id: "org-2",
    name: "Nexus AI Labs",
    initials: "NL",
    plan: "Growth",
    members: "6 Members",
    gradient: "from-blue-500 to-indigo-600",
  },
  {
    id: "org-3",
    name: "Horizon Health",
    initials: "HH",
    plan: "Scale",
    members: "9 Members",
    gradient: "from-emerald-500 to-teal-600",
  },
]

export function OrganizationSwitcher({ className }) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedOrg, setSelectedOrg] = useState(DEMO_ORGANIZATIONS[0])
  const [switchNotice, setSwitchNotice] = useState(null)
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

  const handleSelect = (org) => {
    setSelectedOrg(org)
    setIsOpen(false)
    setSwitchNotice(`Switched to ${org.name} (Demo State)`)
    setTimeout(() => setSwitchNotice(null), 3000)
  }

  return (
    <div className={cn("relative select-none", className)} ref={dropdownRef}>
      {/* Switcher Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={`Select organization. Currently ${selectedOrg.name}`}
        className="flex items-center gap-2 h-9 px-2 sm:px-2.5 rounded-lg border border-border/80 dark:border-white/10 bg-card hover:bg-muted/70 dark:bg-[#181922] transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring shadow-soft-xs"
      >
        {/* Org Monogram Badge */}
        <div
          className={cn(
            "w-6 h-6 rounded-md bg-gradient-to-br text-white flex items-center justify-center font-bold text-[11px] shadow-xs shrink-0",
            selectedOrg.gradient
          )}
        >
          {selectedOrg.initials}
        </div>

        {/* Name and Plan on sm+ screens */}
        <div className="hidden sm:flex flex-col text-left leading-tight min-w-0 max-w-[110px] md:max-w-[140px]">
          <span className="text-xs font-bold text-foreground truncate">
            {selectedOrg.name}
          </span>
          <span className="text-[10px] text-muted-foreground truncate">
            {selectedOrg.plan} Workspace
          </span>
        </div>

        <ChevronsUpDown className="w-3.5 h-3.5 text-muted-foreground shrink-0 ml-0.5" />
      </button>

      {/* Popover Feedback Toast */}
      {switchNotice && (
        <div className="absolute top-full mt-2 left-0 right-0 sm:right-auto sm:w-64 p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 text-[11px] font-semibold text-emerald-800 dark:text-emerald-200 z-50 shadow-soft-md animate-in fade-in-50">
          <span className="flex items-center gap-1.5">
            <Check className="w-3 h-3 text-emerald-600 shrink-0" />
            <span className="truncate">{switchNotice}</span>
          </span>
        </div>
      )}

      {/* Dropdown Popover */}
      {isOpen && (
        <div
          role="listbox"
          className="absolute top-full mt-1.5 right-0 sm:left-0 sm:right-auto w-64 bg-popover text-popover-foreground rounded-xl border border-border/90 shadow-soft-lg p-1.5 z-50 animate-in fade-in-50 zoom-in-95 duration-150"
        >
          <div className="px-2.5 py-1.5 border-b border-border/60 mb-1">
            <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Organizations
            </p>
            <p className="text-[10px] text-muted-foreground">
              Multi-tenant workspace selector (Frontend State)
            </p>
          </div>

          <div className="space-y-0.5">
            {DEMO_ORGANIZATIONS.map((org) => {
              const isSelected = org.id === selectedOrg.id
              return (
                <button
                  key={org.id}
                  type="button"
                  onClick={() => handleSelect(org)}
                  role="option"
                  aria-selected={isSelected}
                  className={cn(
                    "w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors cursor-pointer group",
                    isSelected
                      ? "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary font-semibold"
                      : "text-foreground hover:bg-muted/70"
                  )}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={cn(
                        "w-7 h-7 rounded-md bg-gradient-to-br text-white flex items-center justify-center font-bold text-xs shadow-xs shrink-0",
                        org.gradient
                      )}
                    >
                      {org.initials}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold truncate leading-tight">
                        {org.name}
                      </p>
                      <p className="text-[10px] text-muted-foreground truncate leading-tight mt-0.5">
                        {org.plan} • {org.members}
                      </p>
                    </div>
                  </div>

                  {isSelected && (
                    <Check className="w-4 h-4 text-primary shrink-0 ml-2" />
                  )}
                </button>
              )
            })}
          </div>

          <div className="pt-1 mt-1 border-t border-border/60">
            <button
              type="button"
              onClick={() => {
                setIsOpen(false)
                setSwitchNotice("Organization creation enabled with backend in Milestone 7")
                setTimeout(() => setSwitchNotice(null), 3500)
              }}
              className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors"
            >
              <Plus className="w-3.5 h-3.5 text-primary" />
              <span>Create Organization</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

