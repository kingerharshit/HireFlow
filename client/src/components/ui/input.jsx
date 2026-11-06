import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef(({ className, type, error, ...props }, ref) => {
  return (
    <input
      type={type}
      aria-invalid={error ? "true" : undefined}
      className={cn(
        "flex h-10 w-full rounded-lg border border-input bg-card dark:bg-[#181922] px-3.5 py-2 text-sm text-foreground ring-offset-background transition-all duration-150 shadow-soft-sm dark:border-white/10",
        "file:border-0 file:bg-transparent file:text-sm file:font-medium",
        "placeholder:text-muted-foreground/70",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:border-primary dark:focus-visible:border-primary",
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted/40",
        error && "border-destructive dark:border-destructive text-destructive focus-visible:ring-destructive",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Input.displayName = "Input"

export { Input }
