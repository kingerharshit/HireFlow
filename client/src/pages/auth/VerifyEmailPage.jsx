import * as React from "react"
import { useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { MailCheck, RefreshCw, ArrowLeft, Check, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function VerifyEmailPage() {
  const [searchParams] = useSearchParams()
  const emailParam = searchParams.get("email") || "you@company.com"

  const [resendState, setResendState] = useState({
    sent: false,
    message: null,
  })

  const handleResend = () => {
    setResendState({
      sent: true,
      message: "Resend verification request simulated. In production, a fresh activation link will be delivered.",
    })
    setTimeout(() => {
      setResendState((prev) => ({ ...prev, sent: false }))
    }, 4000)
  }

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200">
      {/* Form Header */}
      <div className="space-y-1.5 text-left">
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
          Verify your email
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          We&apos;ve sent an activation link to your email address.
        </p>
      </div>

      {/* Verification Card */}
      <div className="p-5 sm:p-6 rounded-2xl bg-secondary/60 dark:bg-[#181922] border border-border/80 dark:border-white/10 space-y-4 shadow-soft-sm">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-coral to-[#E25F3E] text-white flex items-center justify-center shadow-soft-sm">
          <MailCheck className="w-6 h-6" />
        </div>

        <div className="space-y-1">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Sent to
          </p>
          <p className="text-sm font-bold text-foreground font-mono break-all">
            {emailParam}
          </p>
        </div>

        <div className="pt-1">
          <Badge variant="outline" className="text-[11px] gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
            Verification pending (Prototype)
          </Badge>
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed pt-1">
          Click the link in the email to activate your account. If you don&apos;t see it, check your spam folder.
        </p>
      </div>

      {/* Resend Confirmation Message */}
      {resendState.message && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 text-xs text-emerald-800 dark:text-emerald-300 flex items-start gap-2 animate-in fade-in-50">
          <Check className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
          <span>{resendState.message}</span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-3 pt-2">
        <Button
          type="button"
          variant="outline"
          className="w-full h-11 text-xs font-semibold rounded-lg shadow-soft-sm flex items-center justify-center gap-2"
          onClick={handleResend}
          disabled={resendState.sent}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${resendState.sent ? "animate-spin" : ""}`} />
          <span>{resendState.sent ? "Dispatching simulated link..." : "Resend verification link"}</span>
        </Button>

        <Link to="/auth/login" className="block w-full">
          <Button variant="default" className="w-full h-11 text-sm font-semibold rounded-lg shadow-soft-sm flex items-center justify-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            <span>Return to sign in</span>
          </Button>
        </Link>
      </div>
    </div>
  )
}
