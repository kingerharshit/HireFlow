import * as React from "react"
import { Link } from "react-router-dom"
import { ArrowLeft, SearchX } from "lucide-react"
import { Button } from "@/components/ui/button"

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6 antialiased selection:bg-brand-peach selection:text-brand-charcoal">
      <div className="w-full max-w-sm text-center space-y-6">
        <div className="w-14 h-14 rounded-2xl bg-secondary text-primary mx-auto flex items-center justify-center shadow-soft-sm">
          <SearchX className="w-7 h-7" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground">
            404 Error
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Page not found
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The link you followed may be broken or the page may have been removed.
          </p>
        </div>

        <div className="pt-2">
          <Link to="/auth/login" className="block w-full">
            <Button variant="default" className="w-full h-11 font-semibold rounded-lg shadow-soft-sm flex items-center justify-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to sign in</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
