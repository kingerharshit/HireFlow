import * as React from "react"
import { useState } from "react"
import { Link } from "react-router-dom"
import { Info, AlertCircle } from "lucide-react"
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
  const [submittedStatus, setSubmittedStatus] = useState(null)

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
    setSubmittedStatus(null)

    if (validate()) {
      setSubmittedStatus({
        type: "info",
        message: `Client validation passed for ${
          accountType === "recruiter" ? "Recruiter" : "Candidate"
        } account. Registration endpoints will connect in Milestone 7.`,
      })
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200">
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

      {submittedStatus && (
        <div className="p-3.5 rounded-xl bg-secondary/80 border border-primary/20 text-xs flex items-start gap-2.5 animate-in fade-in-50">
          <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p className="font-semibold text-foreground">Prototype Verification</p>
            <p className="text-muted-foreground leading-relaxed">{submittedStatus.message}</p>
          </div>
        </div>
      )}

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

        {/* Create Account Primary Button */}
        <Button
          type="submit"
          variant="default"
          className="w-full h-11 text-sm font-semibold rounded-lg shadow-soft-sm hover:shadow transition-all mt-3"
        >
          Create {accountType === "recruiter" ? "Recruiter" : "Candidate"} account
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
    </div>
  )
}
