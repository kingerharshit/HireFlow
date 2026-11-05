import * as React from "react"
import { cva } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 select-none",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow-soft-sm hover:bg-primary/90",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        outline:
          "border-border text-foreground bg-card/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow-soft-sm hover:bg-destructive/90",
        success:
          "border-emerald-500/20 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800/40",
        warning:
          "border-amber-500/20 bg-amber-50 text-amber-900 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800/40",
        info:
          "border-sky-500/20 bg-sky-50 text-sky-800 dark:bg-sky-950/50 dark:text-sky-300 dark:border-sky-800/40",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({ className, variant, ...props }) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
