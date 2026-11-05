import * as React from "react"
import { Sparkles } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export function AuthHeader({
  badge = "Smarter Hiring",
  title,
  description,
  className,
}) {
  return (
    <div className={cn("text-center space-y-2 mb-6", className)}>
      {badge && (
        <div className="flex justify-center mb-1">
          <Badge variant="secondary" className="px-3 py-0.5 text-xs font-semibold gap-1.5">
            <Sparkles className="w-3 h-3 text-primary" />
            <span>{badge}</span>
          </Badge>
        </div>
      )}
      <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
        {title}
      </h1>
      {description && (
        <p className="text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto">
          {description}
        </p>
      )}
    </div>
  )
}

