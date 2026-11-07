import * as React from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import { AuthLayout } from "@/layouts/AuthLayout"
import { LoginPage } from "@/pages/auth/LoginPage"
import { RegisterPage } from "@/pages/auth/RegisterPage"
import { ForgotPasswordPage } from "@/pages/auth/ForgotPasswordPage"
import { ResetPasswordPage } from "@/pages/auth/ResetPasswordPage"
import { VerifyEmailPage } from "@/pages/auth/VerifyEmailPage"
import { RecruiterLayout } from "@/layouts/RecruiterLayout"
import { RecruiterOverviewPage } from "@/pages/recruiter/RecruiterOverviewPage"
import { JobsPage } from "@/pages/recruiter/JobsPage"
import { EditJobPage } from "@/pages/recruiter/EditJobPage"
import { ApplicationsPage } from "@/pages/recruiter/ApplicationsPage"
import { CandidatesPage } from "@/pages/recruiter/CandidatesPage"
import { InterviewsPage } from "@/pages/recruiter/InterviewsPage"
import { AnalyticsPage } from "@/pages/recruiter/AnalyticsPage"
import { SettingsPage } from "@/pages/recruiter/SettingsPage"
import { PublicJobDetailsPage } from "@/pages/candidate/PublicJobDetailsPage"
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
        <Route path="dashboard" element={<RecruiterOverviewPage />} />
        <Route path="jobs" element={<JobsPage />} />
        <Route path="jobs/edit/:jobId" element={<EditJobPage />} />
        <Route path="jobs/:jobId/edit" element={<EditJobPage />} />
        <Route path="candidates" element={<CandidatesPage />} />
        <Route path="applications" element={<ApplicationsPage />} />
        <Route path="interviews" element={<InterviewsPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      {/* Candidate-facing Public Job Details Experience */}
      <Route path="/jobs/:jobId" element={<PublicJobDetailsPage />} />

      {/* Preserved Design System Reference */}
      <Route path="/design-system" element={<App />} />

      {/* 404 Catch-All Fallback */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
