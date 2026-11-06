import * as React from "react"
import { useState } from "react"
import { Link } from "react-router-dom"
import { Info, AlertCircle, Loader2, CheckCircle2, ArrowRight, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { PasswordInput } from "@/components/auth/PasswordInput"
import { PasswordStrengthIndicator } from "@/components/auth/PasswordStrengthIndicator"
import { AccountTypeSelector } from "@/components/auth/AccountTypeSelector"

export function RegisterPage() {
  const [accountType, setAccountType] = useState("candidate")
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    organizationName: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  })

  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const validate = () => {
    const newErrors = {}

    if (!formData.fullName.trim() || formData.fullName.trim().length < 2) {
      newErrors.fullName = "Please enter your full name (min 2 characters)"
    }

    if (!formData.email.trim()) {
      newErrors.email = accountType === "recruiter" ? "Work email is required" : "Email address is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (accountType === "recruiter" && !formData.organizationName.trim()) {
      newErrors.organizationName = "Organization or company name is required"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password"
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = "You must agree to the Terms of Service to continue"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!validate()) return

    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      setIsSuccess(true)
    }, 850)
  }

  const handleReset = () => {
    setIsSuccess(false)
    setFormData({
      fullName: "",
      email: "",
      organizationName: "",
      password: "",
      confirmPassword: "",
      agreeTerms: false,
    })
    setErrors({})
  }

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200">
      {/* ============================================================ */}
      {/* SUCCESS STATE                                                */}
      {/* ============================================================ */}
      {isSuccess ? (
        <div className="space-y-5 text-left animate-in fade-in-50 duration-200">
          <div className="p-5 sm:p-6 rounded-2xl bg-emerald-50/90 dark:bg-emerald-950/40 border border-emerald-200/90 dark:border-emerald-800/50 space-y-3.5 shadow-soft-sm">
            <div className="w-11 h-11 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-sm">
              <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
            </div>

            <div className="space-y-1">
              <h3 className="font-extrabold text-lg text-emerald-950 dark:text-emerald-200 tracking-tight">
                Account Created Successfully
              </h3>
              <p className="text-xs text-emerald-800/90 dark:text-emerald-300 leading-relaxed">
                Welcome to HireFlow! Your <strong className="font-semibold">{accountType === "recruiter" ? "Recruiter" : "Candidate"}</strong> account for <strong className="font-semibold">{formData.email}</strong> is ready.
              </p>
            </div>

            <div className="pt-1 text-[11px] text-emerald-900/80 dark:text-emerald-400/90 border-t border-emerald-200/60 dark:border-emerald-800/40">
              <strong>Milestone Notice:</strong> Authentication endpoints will be wired with backend JWT session creation in Milestone 7.
            </div>
          </div>

          <div className="space-y-2.5 pt-2">
            <Link to="/auth/login" className="block w-full">
              <Button
                variant="default"
                className="w-full h-11 text-sm font-semibold rounded-lg shadow-soft-sm flex items-center justify-center gap-2"
              >
                <span>Proceed to Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>

            <Button
              type="button"
              variant="outline"
              className="w-full h-10 text-xs font-medium"
              onClick={handleReset}
            >
              <RotateCcw className="w-3.5 h-3.5 mr-2" />
              <span>Register another account</span>
            </Button>
          </div>
        </div>
      ) : (
        /* ============================================================ */
        /* STANDARD REGISTRATION FORM                                   */
        /* ============================================================ */
        <>
          {/* Form Header */}
          <div className="space-y-1.5 text-left">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Create your account
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {accountType === "candidate"
                ? "Discover opportunities and apply to modern tech companies."
                : "Set up your company workspace and start hiring top talent."}
            </p>
          </div>

          {/* Account Type Selector Tab Switcher */}
          <AccountTypeSelector
            value={accountType}
            onChange={(type) => {
              setAccountType(type)
              setErrors({})
            }}
          />

          {/* Main Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5" noValidate>
            {/* Full Name */}
            <div className="space-y-1">
              <label
                htmlFor="registerName"
                className="text-xs font-semibold uppercase tracking-wider text-muted-foreground select-none"
              >
                Full name
              </label>
              <Input
                id="registerName"
                type="text"
                placeholder="e.g. Eleanor Vance"
                value={formData.fullName}
                disabled={isLoading}
                onChange={(e) => {
                  setFormData({ ...formData, fullName: e.target.value })
                  if (errors.fullName) setErrors({ ...errors, fullName: null })
                }}
                error={Boolean(errors.fullName)}
                className="h-10"
              />
              {errors.fullName && (
                <p className="text-xs font-medium text-destructive flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.fullName}</span>
                </p>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-1">
              <label
                htmlFor="registerEmail"
                className="text-xs font-semibold uppercase tracking-wider text-muted-foreground select-none"
              >
                {accountType === "recruiter" ? "Work corporate email" : "Email address"}
              </label>
              <Input
                id="registerEmail"
                type="email"
                autoComplete="email"
                placeholder={accountType === "recruiter" ? "you@company.com" : "you@email.com"}
                value={formData.email}
                disabled={isLoading}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value })
                  if (errors.email) setErrors({ ...errors, email: null })
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

            {/* Recruiter Organization Name */}
            {accountType === "recruiter" && (
              <div className="space-y-1 animate-in fade-in-50 duration-150">
                <label
                  htmlFor="registerOrg"
                  className="text-xs font-semibold uppercase tracking-wider text-muted-foreground select-none"
                >
                  Organization / Company name
                </label>
                <Input
                  id="registerOrg"
                  type="text"
                  placeholder="e.g. Acme Technologies"
                  value={formData.organizationName}
                  disabled={isLoading}
                  onChange={(e) => {
                    setFormData({ ...formData, organizationName: e.target.value })
                    if (errors.organizationName) setErrors({ ...errors, organizationName: null })
                  }}
                  error={Boolean(errors.organizationName)}
                  className="h-10"
                />
                {errors.organizationName && (
                  <p className="text-xs font-medium text-destructive flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.organizationName}</span>
                  </p>
                )}
              </div>
            )}

            {/* Password */}
            <div className="space-y-1">
              <label
                htmlFor="registerPassword"
                className="text-xs font-semibold uppercase tracking-wider text-muted-foreground select-none"
              >
                Password
              </label>
              <PasswordInput
                id="registerPassword"
                autoComplete="new-password"
                placeholder="At least 8 characters"
                value={formData.password}
                disabled={isLoading}
                onChange={(e) => {
                  setFormData({ ...formData, password: e.target.value })
                  if (errors.password) setErrors({ ...errors, password: null })
                }}
                error={Boolean(errors.password)}
                className="h-10"
              />
              {formData.password && (
                <PasswordStrengthIndicator password={formData.password} />
              )}
              {errors.password && (
                <p className="text-xs font-medium text-destructive flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.password}</span>
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1">
              <label
                htmlFor="registerConfirmPassword"
                className="text-xs font-semibold uppercase tracking-wider text-muted-foreground select-none"
              >
                Confirm password
              </label>
              <PasswordInput
                id="registerConfirmPassword"
                autoComplete="new-password"
                placeholder="Re-enter your password"
                value={formData.confirmPassword}
                disabled={isLoading}
                onChange={(e) => {
                  setFormData({ ...formData, confirmPassword: e.target.value })
                  if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: null })
                }}
                error={Boolean(errors.confirmPassword)}
                className="h-10"
              />
              {errors.confirmPassword && (
                <p className="text-xs font-medium text-destructive flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.confirmPassword}</span>
                </p>
              )}
            </div>

            {/* Terms and Conditions Checkbox */}
            <div className="pt-1 space-y-1">
              <div className="flex items-start gap-2.5">
                <Checkbox
                  id="agreeTerms"
                  checked={formData.agreeTerms}
                  disabled={isLoading}
                  onChange={(e) => {
                    setFormData({ ...formData, agreeTerms: e.target.checked })
                    if (errors.agreeTerms) setErrors({ ...errors, agreeTerms: null })
                  }}
                  className="mt-0.5"
                />
                <label
                  htmlFor="agreeTerms"
                  className="text-xs text-muted-foreground leading-normal cursor-pointer select-none"
                >
                  I agree to the{" "}
                  <Link to="#" className="font-semibold text-foreground hover:text-primary underline underline-offset-2">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link to="#" className="font-semibold text-foreground hover:text-primary underline underline-offset-2">
                    Privacy Policy
                  </Link>
                  .
                </label>
              </div>
              {errors.agreeTerms && (
                <p className="text-xs font-medium text-destructive flex items-center gap-1 pl-6">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.agreeTerms}</span>
                </p>
              )}
            </div>

            {/* Create Account Primary Button with Loading Spinner */}
            <Button
              type="submit"
              variant="default"
              disabled={isLoading}
              className="w-full h-11 text-sm font-semibold rounded-lg shadow-soft-sm hover:shadow transition-all mt-3"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  <span>Creating account...</span>
                </>
              ) : (
                <span>Create {accountType === "recruiter" ? "Recruiter" : "Candidate"} account</span>
              )}
            </Button>
          </form>

          {/* Sign in Link */}
          <div className="text-center text-xs text-muted-foreground pt-1">
            <span>Already have an account? </span>
            <Link
              to="/auth/login"
              className="font-semibold text-primary hover:underline underline-offset-4"
            >
              Sign in
            </Link>
          </div>
        </>
      )}
    </div>
  )
}
