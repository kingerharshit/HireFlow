import * as React from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import { AuthLayout } from "@/layouts/AuthLayout"
import { LoginPage } from "@/pages/auth/LoginPage"
import { RegisterPage } from "@/pages/auth/RegisterPage"
import { ForgotPasswordPage } from "@/pages/auth/ForgotPasswordPage"
import { ResetPasswordPage } from "@/pages/auth/ResetPasswordPage"
import { VerifyEmailPage } from "@/pages/auth/VerifyEmailPage"
import { RecruiterLayout } from "@/layouts/RecruiterLayout"
import {
  RecruiterDashboardPage,
  RecruiterJobsPage,
  RecruiterCandidatesPage,
  RecruiterApplicationsPage,
  RecruiterInterviewsPage,
  RecruiterAnalyticsPage,
  RecruiterSettingsPage,
} from "@/pages/recruiter/RecruiterPlaceholderPage"
import { NotFoundPage } from "@/pages/NotFoundPage"
import App from "@/App"

export function AppRoutes() {
  return (
    <Routes>
      {/* Root Entry Point: Defaults directly to /auth/login */}
      <Route path="/" element={<Navigate to="/auth/login" replace />} />

      {/* Primary Authentication Suite wrapped in AuthLayout */}
      <Route path="/auth" element={<AuthLayout />}>
        <Route index element={<Navigate to="/auth/login" replace />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
        <Route path="reset-password" element={<ResetPasswordPage />} />
        <Route path="verify-email" element={<VerifyEmailPage />} />
      </Route>

      {/* Recruiter Workspace Shell wrapped in RecruiterLayout */}
      <Route path="/recruiter" element={<RecruiterLayout />}>
        <Route index element={<Navigate to="/recruiter/dashboard" replace />} />
        <Route path="dashboard" element={<RecruiterDashboardPage />} />
        <Route path="jobs" element={<RecruiterJobsPage />} />
        <Route path="candidates" element={<RecruiterCandidatesPage />} />
        <Route path="applications" element={<RecruiterApplicationsPage />} />
        <Route path="interviews" element={<RecruiterInterviewsPage />} />
        <Route path="analytics" element={<RecruiterAnalyticsPage />} />
        <Route path="settings" element={<RecruiterSettingsPage />} />
      </Route>

      {/* Preserved Design System Reference */}
      <Route path="/design-system" element={<App />} />

      {/* 404 Catch-All Fallback */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
