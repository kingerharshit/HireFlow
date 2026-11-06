import * as React from "react"
import { useState } from "react"
import { Link } from "react-router-dom"
import { LogIn, Loader2, AlertCircle, CheckCircle2, RotateCcw, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { PasswordInput } from "@/components/auth/PasswordInput"

export function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  })

  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [authError, setAuthError] = useState(null)
  const [authSuccess, setAuthSuccess] = useState(false)

  const validate = () => {
    const newErrors = {}

    if (!formData.email.trim()) {
      newErrors.email = "Email address is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setAuthError(null)

    if (!validate()) return

    setIsLoading(true)

    // Simulate authentic network latency (800ms)
    setTimeout(() => {
      setIsLoading(false)

      // Test trigger: if user tests with "error" in email, show error state
      if (formData.email.toLowerCase().includes("error")) {
        setAuthError("Invalid credentials. The email or password you entered is incorrect.")
      } else {
        setAuthSuccess(true)
      }
    }, 850)
  }

  const handleGooglePlaceholder = () => {
    setAuthError(null)
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      setAuthError("Google OAuth is a visual prototype and will be activated with backend integration in Milestone 7.")
    }, 600)
  }

  const handleQuickFill = (valid = true) => {
    setAuthError(null)
    setErrors({})
    if (valid) {
      setFormData({
        email: "recruiter@hireflow.io",
        password: "Password123!",
        rememberMe: true,
      })
    } else {
      setFormData({
        email: "error@hireflow.io",
        password: "WrongPassword123!",
        rememberMe: false,
      })
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200">
      {/* ============================================================ */}
      {/* SUCCESS STATE                                                */}
      {/* ============================================================ */}
      {authSuccess ? (
        <div className="space-y-5 text-left animate-in fade-in-50 duration-200">
          <div className="p-5 sm:p-6 rounded-2xl bg-emerald-50/90 dark:bg-emerald-950/40 border border-emerald-200/90 dark:border-emerald-800/50 space-y-3.5 shadow-soft-sm">
            <div className="w-11 h-11 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-sm">
              <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
            </div>

            <div className="space-y-1">
              <h3 className="font-extrabold text-lg text-emerald-950 dark:text-emerald-200 tracking-tight">
                Authentication Successful
              </h3>
              <p className="text-xs text-emerald-800/90 dark:text-emerald-300 leading-relaxed">
                Welcome back to HireFlow! Client credentials for <strong className="font-semibold">{formData.email}</strong> have been verified.
              </p>
            </div>

            <div className="pt-1 text-[11px] text-emerald-900/80 dark:text-emerald-400/90 border-t border-emerald-200/60 dark:border-emerald-800/40">
              <strong>Milestone Notice:</strong> In production, session JWTs will be stored and you will be routed to your recruitment dashboard.
            </div>
          </div>

          <div className="space-y-2.5 pt-2">
            <Link to="/recruiter/dashboard" className="block w-full">
              <Button
                variant="default"
                className="w-full h-11 text-sm font-semibold rounded-lg shadow-soft-sm flex items-center justify-center gap-2"
              >
                <span>Enter Recruiter Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>

            <Button
              type="button"
              variant="outline"
              className="w-full h-10 text-xs font-medium"
              onClick={() => {
                setAuthSuccess(false)
                setFormData({ email: "", password: "", rememberMe: false })
              }}
            >
              <RotateCcw className="w-3.5 h-3.5 mr-2" />
              <span>Reset &amp; Sign in Again</span>
            </Button>
          </div>
        </div>
      ) : (
        /* ============================================================ */
        /* STANDARD LOGIN FORM WITH ERROR & LOADING STATES              */
        /* ============================================================ */
        <>
          {/* Form Header */}
          <div className="space-y-1.5 text-left">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Welcome back
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Enter your credentials to access your recruitment portal.
            </p>
          </div>

          {/* Global Auth Error Alert State */}
          {authError && (
            <div
              role="alert"
              className="p-3.5 rounded-xl bg-destructive/10 dark:bg-destructive/20 border border-destructive/30 dark:border-destructive/40 text-xs flex items-start gap-2.5 text-destructive dark:text-red-400 animate-in fade-in-50 duration-150"
            >
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="space-y-0.5 flex-1">
                <p className="font-bold">Authentication Notice</p>
                <p className="leading-relaxed">{authError}</p>
              </div>
            </div>
          )}

          {/* Google OAuth Button */}
          <div className="space-y-4">
            <Button
              type="button"
              variant="outline"
              disabled={isLoading}
              className="w-full h-10 font-medium text-sm flex items-center justify-center gap-2.5 border-border/90 dark:border-white/10 bg-card hover:bg-muted/50 text-foreground transition-all shadow-soft-sm disabled:opacity-60"
              onClick={handleGooglePlaceholder}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </Button>

            {/* Divider with "OR" */}
            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border/80 dark:border-white/10" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card lg:bg-background dark:bg-[#14151B] px-3 text-muted-foreground font-semibold text-[11px] tracking-wider">
                  or continue with email
                </span>
              </div>
            </div>
          </div>

          {/* Main Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Email Field */}
            <div className="space-y-1.5">
              <label
                htmlFor="loginEmail"
                className="text-xs font-semibold uppercase tracking-wider text-muted-foreground select-none"
              >
                Email address
              </label>
              <Input
                id="loginEmail"
                type="email"
                autoComplete="email"
                placeholder="you@company.com"
                value={formData.email}
                disabled={isLoading}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value })
                  if (errors.email) setErrors({ ...errors, email: null })
                  if (authError) setAuthError(null)
                }}
                error={Boolean(errors.email)}
                className="h-10"
              />
              {errors.email && (
                <p className="text-xs font-medium text-destructive flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.email}</span>
                </p>
              )}
            </div>

            {/* Password Field with right-aligned Forgot link */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="loginPassword"
                  className="text-xs font-semibold uppercase tracking-wider text-muted-foreground select-none"
                >
                  Password
                </label>
                <Link
                  to="/auth/forgot-password"
                  className="text-xs font-semibold text-primary hover:underline underline-offset-4"
                  tabIndex={-1}
                >
                  Forgot password?
                </Link>
              </div>
              <PasswordInput
                id="loginPassword"
                autoComplete="current-password"
                placeholder="••••••••"
                value={formData.password}
                disabled={isLoading}
                onChange={(e) => {
                  setFormData({ ...formData, password: e.target.value })
                  if (errors.password) setErrors({ ...errors, password: null })
                  if (authError) setAuthError(null)
                }}
                error={Boolean(errors.password)}
                className="h-10"
              />
              {errors.password && (
                <p className="text-xs font-medium text-destructive flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.password}</span>
                </p>
              )}
            </div>

            {/* Remember me Checkbox */}
            <div className="flex items-center gap-2 pt-0.5">
              <Checkbox
                id="rememberMe"
                checked={formData.rememberMe}
                disabled={isLoading}
                onChange={(e) =>
                  setFormData({ ...formData, rememberMe: e.target.checked })
                }
              />
              <label
                htmlFor="rememberMe"
                className="text-xs font-medium text-muted-foreground hover:text-foreground cursor-pointer select-none"
              >
                Remember this device for 30 days
              </label>
            </div>

            {/* Sign In Primary CTA Button with Loading Spinner */}
            <Button
              type="submit"
              variant="default"
              disabled={isLoading}
              className="w-full h-11 text-sm font-semibold rounded-lg shadow-soft-sm hover:shadow transition-all mt-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4 mr-2" />
                  <span>Sign in</span>
                </>
              )}
            </Button>
          </form>

          {/* Quick Demo Pre-fill triggers for reviewer convenience */}
          <div className="pt-2 border-t border-border/50 flex flex-wrap items-center justify-between gap-2 text-[11px] text-muted-foreground">
            <span className="font-medium">Demo Shortcuts:</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleQuickFill(true)}
                className="text-primary hover:underline font-semibold cursor-pointer"
              >
                Fill Valid (Success)
              </button>
              <span className="text-muted-foreground/60">•</span>
              <button
                type="button"
                onClick={() => handleQuickFill(false)}
                className="text-destructive hover:underline font-semibold cursor-pointer"
              >
                Fill Invalid (Error)
              </button>
            </div>
          </div>

          {/* Registration Link */}
          <div className="text-center text-xs text-muted-foreground pt-1">
            <span>Don&apos;t have an account? </span>
            <Link
              to="/auth/register"
              className="font-semibold text-primary hover:underline underline-offset-4"
            >
              Create account
            </Link>
          </div>
        </>
      )}
    </div>
  )
}
