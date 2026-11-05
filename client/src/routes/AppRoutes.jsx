import * as React from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import { AuthLayout } from "@/layouts/AuthLayout"
import { LoginPage } from "@/pages/auth/LoginPage"
import { RegisterPage } from "@/pages/auth/RegisterPage"
import { ForgotPasswordPage } from "@/pages/auth/ForgotPasswordPage"
import { ResetPasswordPage } from "@/pages/auth/ResetPasswordPage"
import { VerifyEmailPage } from "@/pages/auth/VerifyEmailPage"
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

      {/* Preserved Design System Reference */}
      <Route path="/design-system" element={<App />} />

      {/* 404 Catch-All Fallback */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
