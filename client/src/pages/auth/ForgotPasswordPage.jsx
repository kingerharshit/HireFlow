import * as React from "react"
import { useState } from "react"
import { Link } from "react-router-dom"
import { ArrowLeft, Mail, AlertCircle, CheckCircle2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const validate = () => {
    if (!email.trim()) {
      setError("Email address is required")
      return false
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address")
      return false
    }
    setError(null)
    return true
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return

    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      setIsSubmitted(true)
    }, 700)
  }

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200">
      {/* Form Header */}
      <div className="space-y-1.5 text-left">
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
          {isSubmitted ? "Check your inbox" : "Reset your password"}
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {isSubmitted
            ? `We've simulated sending password reset instructions to ${email}.`
            : "Enter your registered email address and we'll send you recovery instructions."}
        </p>
      </div>

      {isSubmitted ? (
        <div className="space-y-6 animate-in fade-in-50 duration-200">
          <div className="p-5 sm:p-6 rounded-2xl bg-secondary/60 dark:bg-[#181922] border border-border/80 dark:border-white/10 space-y-3.5 shadow-soft-sm">
            <div className="w-11 h-11 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-soft-sm">
              <Mail className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-sm text-foreground">
                Recovery Request Simulated
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                In production, an email with a secure single-use recovery token will be dispatched.
                You can preview the reset experience using the demo button below.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <Link to="/auth/reset-password" className="block w-full">
              <Button variant="default" className="w-full h-11 font-semibold rounded-lg shadow-soft-sm">
                Proceed to Reset Password UI (Demo)
              </Button>
            </Link>

            <Button
              type="button"
              variant="outline"
              className="w-full h-10 text-xs font-medium"
              onClick={() => {
                setIsSubmitted(false)
                setEmail("")
              }}
            >
              Try a different email address
            </Button>
          </div>

          <div className="text-center pt-2">
            <Link
              to="/auth/login"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline underline-offset-4"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to sign in</span>
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="space-y-1.5">
            <label
              htmlFor="forgotEmail"
              className="text-xs font-semibold uppercase tracking-wider text-muted-foreground select-none"
            >
              Email address
            </label>
            <Input
              id="forgotEmail"
              type="email"
              autoComplete="email"
              placeholder="you@company.com"
              value={email}
              disabled={isLoading}
              onChange={(e) => {
                setEmail(e.target.value)
                if (error) setError(null)
              }}
              error={Boolean(error)}
              className="h-10"
            />
            {error && (
              <p className="text-xs font-medium text-destructive flex items-center gap-1 mt-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{error}</span>
              </p>
            )}
            <p className="text-[11px] text-muted-foreground pt-0.5">
              We&apos;ll send a secure password recovery link to this address.
            </p>
          </div>

          <Button
            type="submit"
            variant="default"
            disabled={isLoading}
            className="w-full h-11 text-sm font-semibold rounded-lg shadow-soft-sm hover:shadow transition-all mt-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                <span>Sending recovery link...</span>
              </>
            ) : (
              <span>Send recovery link</span>
            )}
          </Button>

          <div className="text-center pt-3">
            <Link
              to="/auth/login"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline underline-offset-4"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to sign in</span>
            </Link>
          </div>
        </form>
      )}
    </div>
  )
}
