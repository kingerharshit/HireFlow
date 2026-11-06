import * as React from "react"
import { User, Building2 } from "lucide-react"
import { cn } from "@/lib/utils"

export function AccountTypeSelector({ value, onChange, className }) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground select-none">
        Account Type
      </label>
      <div
        className="grid grid-cols-2 p-1 rounded-xl bg-muted/60 dark:bg-[#181922] border border-border/80 dark:border-white/10 text-center"
        role="group"
        aria-label="Select Account Type"
      >
        <button
          type="button"
          onClick={() => onChange("candidate")}
          className={cn(
            "flex items-center justify-center gap-2 py-2 px-2 sm:px-3 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer select-none min-w-0",
            value === "candidate"
              ? "bg-card dark:bg-[#252836] text-foreground dark:text-white shadow-soft-sm font-bold"
              : "text-muted-foreground hover:text-foreground hover:bg-card/40 dark:hover:bg-white/5"
          )}
          aria-pressed={value === "candidate"}
        >
          <User className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">Candidate</span>
        </button>

        <button
          type="button"
          onClick={() => onChange("recruiter")}
          className={cn(
            "flex items-center justify-center gap-2 py-2 px-2 sm:px-3 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer select-none min-w-0",
            value === "recruiter"
              ? "bg-card dark:bg-[#252836] text-foreground dark:text-white shadow-soft-sm font-bold"
              : "text-muted-foreground hover:text-foreground hover:bg-card/40 dark:hover:bg-white/5"
          )}
          aria-pressed={value === "recruiter"}
        >
          <Building2 className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">Recruiter / Org</span>
        </button>
      </div>
      <p className="text-[11px] text-muted-foreground">
        {value === "candidate"
          ? "Apply for roles and track your interview submissions."
          : "Publish requisitions, evaluate pipelines, and manage your hiring team."}
      </p>
    </div>
  )
}
