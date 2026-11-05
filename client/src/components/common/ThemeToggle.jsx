import * as React from "react"
import { Sun, Moon, Monitor } from "lucide-react"
import { useTheme } from "@/context/ThemeContext"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function ThemeToggle({ className, variant = "outline", size = "icon", showLabel = false }) {
  const { theme, resolvedTheme, toggleTheme } = useTheme()
  const isDark = resolvedTheme === "dark"

  return (
    <Button
      variant={variant}
      size={size}
      onClick={toggleTheme}
      className={cn("relative overflow-hidden transition-all duration-200", className)}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode (currently ${theme} mode)`}
      title={`Active theme: ${theme} (${resolvedTheme}). Click to switch.`}
    >
      <div className="flex items-center justify-center">
        {isDark ? (
          <Sun className="h-4 w-4 text-amber-400 transition-transform duration-300 rotate-0 scale-100" />
        ) : (
          <Moon className="h-4 w-4 text-brand-charcoal transition-transform duration-300 rotate-0 scale-100" />
        )}
      </div>
      {showLabel && (
        <span className="text-xs font-semibold capitalize tracking-wide">
          {resolvedTheme} Mode
        </span>
      )}
    </Button>
  )
}

/**
 * Segmented toggle allowing explicit selection of Light, Dark, or System
 */
export function ThemeSegmentedControl({ className }) {
  const { theme, setTheme } = useTheme()

  const options = [
    { value: "light", label: "Light", icon: Sun },
    { value: "system", label: "System", icon: Monitor },
    { value: "dark", label: "Dark", icon: Moon },
  ]

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-xl p-1 bg-muted/60 border border-border/80 shadow-soft-sm",
        className
      )}
      role="group"
      aria-label="Theme selection"
    >
      {options.map(({ value, label, icon: Icon }) => {
        const isActive = theme === value
        return (
          <button
            key={value}
            type="button"
            onClick={() => setTheme(value)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer select-none",
              isActive
                ? "bg-card text-foreground shadow-soft-sm font-semibold"
                : "text-muted-foreground hover:text-foreground hover:bg-card/50"
            )}
            aria-pressed={isActive}
          >
            <Icon className={cn("w-3.5 h-3.5", isActive && value === "light" && "text-amber-500", isActive && value === "dark" && "text-sky-400")} />
            <span>{label}</span>
          </button>
        )
      })}
    </div>
  )
}

