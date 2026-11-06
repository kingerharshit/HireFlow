import * as React from "react"
import { useState } from "react"
import { Link } from "react-router-dom"
import { CheckCircle2, ArrowRight, AlertCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PasswordInput } from "@/components/auth/PasswordInput"
import { PasswordStrengthIndicator } from "@/components/auth/PasswordStrengthIndicator"

export function ResetPasswordPage() {
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const validate = () => {
    const newErrors = {}

    if (!formData.newPassword) {
      newErrors.newPassword = "New password is required"
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters"
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your new password"
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
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
    }, 700)
  }

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200">
      {/* Form Header */}
      <div className="space-y-1.5 text-left">
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
          {isSuccess ? "Password updated" : "Set new password"}
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {isSuccess
            ? "Your password reset has been simulated. You can now log in."
            : "Choose a strong password with at least 8 characters."}
        </p>
      </div>

      {isSuccess ? (
        <div className="space-y-6 animate-in fade-in-50 duration-200">
          <div className="p-5 sm:p-6 rounded-2xl bg-secondary/60 dark:bg-[#181922] border border-border/80 dark:border-white/10 space-y-3.5 shadow-soft-sm">
            <div className="w-11 h-11 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-soft-sm">
              <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-sm text-foreground">
                Credentials Ready
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Client validation passed. In production, password hash updates will be stored
                in the backend authentication database.
              </p>
            </div>
          </div>

          <Link to="/auth/login" className="block w-full">
            <Button
              variant="default"
              className="w-full h-11 font-semibold rounded-lg shadow-soft-sm flex items-center justify-center gap-2"
            >
              <span>Sign in with new password</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* New Password */}
          <div className="space-y-1">
            <label
              htmlFor="resetNewPassword"
              className="text-xs font-semibold uppercase tracking-wider text-muted-foreground select-none"
            >
              New password
            </label>
            <PasswordInput
              id="resetNewPassword"
              autoComplete="new-password"
              placeholder="At least 8 characters"
              value={formData.newPassword}
              disabled={isLoading}
              onChange={(e) => {
                setFormData({ ...formData, newPassword: e.target.value })
                if (errors.newPassword) setErrors({ ...errors, newPassword: null })
              }}
              error={Boolean(errors.newPassword)}
              className="h-10"
            />
            {formData.newPassword && (
              <PasswordStrengthIndicator password={formData.newPassword} />
            )}
            {errors.newPassword && (
              <p className="text-xs font-medium text-destructive flex items-center gap-1 mt-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.newPassword}</span>
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-1">
            <label
              htmlFor="resetConfirmPassword"
              className="text-xs font-semibold uppercase tracking-wider text-muted-foreground select-none"
            >
              Confirm new password
            </label>
            <PasswordInput
              id="resetConfirmPassword"
              autoComplete="new-password"
              placeholder="Re-enter your new password"
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

          <Button
            type="submit"
            variant="default"
            disabled={isLoading}
            className="w-full h-11 text-sm font-semibold rounded-lg shadow-soft-sm hover:shadow transition-all mt-3"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                <span>Updating password...</span>
              </>
            ) : (
              <span>Update password</span>
            )}
          </Button>

          <div className="text-center pt-2">
            <Link
              to="/auth/login"
              className="text-xs font-semibold text-primary hover:underline underline-offset-4"
            >
              Cancel and return to sign in
            </Link>
          </div>
        </form>
      )}
    </div>
  )
}
