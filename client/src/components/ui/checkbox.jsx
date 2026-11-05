import * as React from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

const Checkbox = React.forwardRef(({ className, checked, onChange, disabled, id, ...props }, ref) => {
  return (
    <label
      htmlFor={id}
      className={cn(
        "relative inline-flex items-center justify-center cursor-pointer select-none",
        disabled && "cursor-not-allowed opacity-50"
      )}
    >
      <input
        type="checkbox"
        id={id}
        ref={ref}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="sr-only peer"
        {...props}
      />
      <div
        className={cn(
          "h-4 w-4 shrink-0 rounded border border-input bg-card shadow-soft-sm transition-all duration-150",
          "peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-1 ring-offset-background",
          "peer-checked:bg-primary peer-checked:border-primary peer-checked:text-primary-foreground",
          "peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
          className
        )}
      >
        <Check className={cn("h-3.5 w-3.5 stroke-[3] text-primary-foreground transition-opacity", checked ? "opacity-100" : "opacity-0")} />
      </div>
    </label>
  )
})
Checkbox.displayName = "Checkbox"

export { Checkbox }

