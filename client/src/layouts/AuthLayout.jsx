import * as React from "react"
import { Outlet, Link } from "react-router-dom"
import { ShieldCheck, Lock, CheckCircle2, Sparkles, TrendingUp } from "lucide-react"
import { ThemeToggle } from "@/components/common/ThemeToggle"
import { Badge } from "@/components/ui/badge"

export function AuthLayout() {
  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-background text-foreground antialiased selection:bg-brand-peach selection:text-brand-charcoal transition-colors duration-200">
      {/* ============================================================ */}
      {/* LEFT PANEL: Brand Showcase, Headline & Hiring Intelligence Visual */}
      {/* ============================================================ */}
      <div className="hidden lg:flex lg:w-[52%] xl:w-[55%] bg-gradient-to-br from-brand-ivory via-background to-[#FBF0E8] dark:from-brand-charcoal dark:via-background dark:to-[#1a1c22] border-r border-border/80 flex-col justify-between p-10 xl:p-14 relative overflow-hidden">
        {/* Subtle decorative radial lights */}
        <div className="absolute top-1/4 -left-12 w-80 h-80 bg-brand-peach/40 dark:bg-brand-coral/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-brand-coral/15 dark:bg-brand-coral/5 rounded-full blur-3xl pointer-events-none" />

        {/* Top Brand Lockup */}
        <div className="relative z-10 flex items-center justify-between">
          <Link
            to="/auth/login"
            className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xl"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-coral to-[#E25F3E] flex items-center justify-center text-white shadow-soft-sm font-bold text-lg group-hover:scale-105 transition-transform">
              HF
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-foreground">
                HireFlow
              </span>
              <span className="block text-[11px] text-muted-foreground font-medium">
                Smarter Hiring. Better Connections.
              </span>
            </div>
          </Link>

          <Badge variant="secondary" className="text-xs font-semibold gap-1.5 px-3 py-1 bg-card/80 backdrop-blur-sm border-border/80">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            AI Recruitment SaaS
          </Badge>
        </div>

        {/* Center Content: Headline & Visual Card */}
        <div className="relative z-10 my-auto py-8 space-y-8 max-w-lg">
          <div className="space-y-3.5">
            <h1 className="text-3xl sm:text-4xl xl:text-[42px] font-extrabold tracking-tight text-foreground leading-[1.15]">
              Find the right talent.<br />
              <span className="text-primary">Build the future.</span>
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              HireFlow unifies AI-assisted candidate screening, collaborative evaluations,
              and multi-tenant pipeline intelligence into one modern workspace.
            </p>
          </div>

          {/* Professional Hiring Visual Card */}
          <div className="relative pt-2">
            <div className="relative rounded-2xl border border-border/90 bg-card/95 dark:bg-card/80 backdrop-blur-md p-5 sm:p-6 shadow-soft-md space-y-4">
              {/* Candidate Card Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-brand-coral to-brand-peach flex items-center justify-center text-white font-bold text-sm shadow-sm shrink-0">
                    ER
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-foreground">Elena Rostova</h4>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/40">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        98% Match
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">Staff Frontend Architect • 8 yrs exp</p>
                  </div>
                </div>
              </div>

              {/* Skills Tags */}
              <div className="flex flex-wrap gap-1.5">
                <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-md bg-secondary/80 text-secondary-foreground">
                  React 19
                </span>
                <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-md bg-secondary/80 text-secondary-foreground">
                  Design Systems
                </span>
                <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-md bg-secondary/80 text-secondary-foreground">
                  TypeScript
                </span>
                <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-md bg-secondary/80 text-secondary-foreground">
                  Distributed UI
                </span>
              </div>

              {/* Scorecard metrics bar */}
              <div className="pt-2 border-t border-border/60 grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2 rounded-lg bg-muted/40">
                  <div className="font-bold text-foreground">9.8 / 10</div>
                  <div className="text-[10px] text-muted-foreground">Architecture</div>
                </div>
                <div className="p-2 rounded-lg bg-muted/40">
                  <div className="font-bold text-foreground">9.6 / 10</div>
                  <div className="text-[10px] text-muted-foreground">Collaboration</div>
                </div>
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <div className="font-bold">Interview</div>
                  <div className="text-[10px]">Round 3</div>
                </div>
              </div>
            </div>

            {/* Floating Metric Pill */}
            <div className="absolute -bottom-3.5 -right-2 sm:-right-4 rounded-xl border border-border/80 bg-card/95 dark:bg-card/90 backdrop-blur-md px-3.5 py-2 shadow-soft-sm flex items-center gap-2.5 text-xs">
              <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-foreground block">65% Faster Sourcing</span>
                <span className="text-muted-foreground text-[10px]">AI-Assisted Screening</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Trust Indicators */}
        <div className="relative z-10 pt-4 border-t border-border/60">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
            Enterprise Trust &amp; Security
          </p>
          <div className="flex flex-wrap items-center gap-5 text-xs text-muted-foreground font-medium">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-primary" /> SOC-2 Type II
            </span>
            <span className="flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-primary" /> Role-Based Multi-Tenancy
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-primary" /> 99.9% Platform SLA
            </span>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* RIGHT PANEL: Form Container Area (Linear/Stripe-inspired)  */}
      {/* ============================================================ */}
      <div className="w-full lg:w-[48%] xl:w-[45%] flex flex-col justify-between p-6 sm:p-10 lg:p-12 xl:p-16 min-h-screen bg-card lg:bg-background transition-colors duration-200">
        {/* Mobile Top Header (hidden on desktop) */}
        <div className="flex items-center justify-between pb-6 lg:pb-0">
          <Link to="/auth/login" className="flex items-center gap-2.5 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-coral to-[#E25F3E] flex items-center justify-center text-white font-bold text-sm shadow-soft-sm">
              HF
            </div>
            <span className="font-extrabold text-lg tracking-tight text-foreground">
              HireFlow
            </span>
          </Link>

          {/* Theme Toggle Button (top-right) */}
          <div className="ml-auto">
            <ThemeToggle />
          </div>
        </div>

        {/* Central Form Container */}
        <div className="w-full max-w-[390px] mx-auto my-auto py-4">
          <Outlet />
        </div>

        {/* Footer */}
        <div className="pt-6 text-center text-xs text-muted-foreground flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-border/40">
          <span>&copy; {new Date().getFullYear()} HireFlow Inc.</span>
          <div className="flex items-center gap-3">
            <Link to="#" className="hover:text-foreground transition-colors">
              Privacy
            </Link>
            <Link to="#" className="hover:text-foreground transition-colors">
              Terms
            </Link>
            <Link to="#" className="hover:text-foreground transition-colors">
              Security
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
