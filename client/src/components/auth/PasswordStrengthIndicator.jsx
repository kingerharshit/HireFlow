import * as React from "react"
import { cn } from "@/lib/utils"

export function getPasswordStrength(password = "") {
  const criteria = [
    { label: "At least 8 characters", met: password.length >= 8 },
    { label: "Contains lowercase letter", met: /[a-z]/.test(password) },
    { label: "Contains uppercase letter", met: /[A-Z]/.test(password) },
    { label: "Contains number", met: /[0-9]/.test(password) },
    { label: "Contains special character", met: /[^A-Za-z0-9]/.test(password) },
  ]

  const score = criteria.filter((c) => c.met).length

  let label = "Very Weak"
  let colorClass = "bg-destructive text-destructive"
  let percent = 0

  if (score === 0) {
    label = "Very Weak"
    colorClass = "bg-muted text-muted-foreground"
    percent = 0
  } else if (score <= 2) {
    label = "Weak"
    colorClass = "bg-destructive text-destructive"
    percent = 25
  } else if (score === 3) {
    label = "Fair"
    colorClass = "bg-amber-500 text-amber-500"
    percent = 50
  } else if (score === 4) {
    label = "Good"
    colorClass = "bg-sky-500 text-sky-500"
    percent = 75
  } else if (score === 5) {
    label = "Strong"
    colorClass = "bg-emerald-600 text-emerald-600"
    percent = 100
  }

  return { score, label, colorClass, percent, criteria }
}

export function PasswordStrengthIndicator({ password = "", className }) {
  if (!password) return null

  const { score, label, colorClass } = getPasswordStrength(password)

  return (
    <div className={cn("space-y-1.5 pt-1 animate-in fade-in-50 duration-150", className)}>
      <div className="flex items-center justify-between text-[11px]">
        <span className="text-muted-foreground font-medium">Strength:</span>
        <span className={cn("font-bold", colorClass.split(" ")[1])}>{label}</span>
      </div>

      {/* 4-segment sleek progress indicator */}
      <div className="grid grid-cols-4 gap-1.5">
        {[1, 2, 3, 4].map((seg) => {
          const isFilled =
            (seg === 1 && score >= 1) ||
            (seg === 2 && score >= 3) ||
            (seg === 3 && score >= 4) ||
            (seg === 4 && score >= 5)

          return (
            <div
              key={seg}
              className={cn(
                "h-1 rounded-full transition-all duration-300",
                isFilled ? colorClass.split(" ")[0] : "bg-muted/90"
              )}
            />
          )
        })}
      </div>

      <p className="text-[10px] text-muted-foreground leading-normal">
        Use 8+ characters with uppercase, lowercase, numbers, and symbols.
      </p>
    </div>
  )
}
