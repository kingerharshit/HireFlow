import * as React from "react"
import { AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

export function AuthFormField({
  id,
  label,
  required,
  error,
  helperText,
  children,
  className,
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      {label && (
        <div className="flex items-center justify-between">
          <label
            htmlFor={id}
            className="text-xs font-semibold uppercase tracking-wider text-muted-foreground select-none flex items-center gap-1"
          >
            <span>{label}</span>
            {required && <span className="text-destructive font-bold">*</span>}
          </label>
        </div>
      )}

      {children}

      {error && (
        <p
          id={`${id}-error`}
          className="text-xs font-medium text-destructive flex items-center gap-1.5 animate-in fade-in-50 duration-150"
        >
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </p>
      )}

      {!error && helperText && (
        <p className="text-xs text-muted-foreground leading-normal">
          {helperText}
        </p>
      )}
    </div>
  )
}

