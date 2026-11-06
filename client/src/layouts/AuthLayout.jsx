import * as React from "react"
import { useState } from "react"
import { Outlet } from "react-router-dom"
import { ShieldCheck, Lock, CheckCircle2, Sparkles, TrendingUp, Star } from "lucide-react"
import { BrandLogo } from "@/components/common/BrandLogo"
import { ThemeToggle } from "@/components/common/ThemeToggle"
import { Badge } from "@/components/ui/badge"

export function AuthLayout() {
  const [avatarError, setAvatarError] = useState(false)

  // Curated, ultra-reliable professional candidate portrait
  const candidateAvatarUrl =
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80"

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden flex flex-col lg:flex-row bg-background text-foreground antialiased selection:bg-brand-peach selection:text-brand-charcoal transition-colors duration-200">
      {/* ============================================================ */}
      {/* LEFT PANEL: Brand Showcase, Headline & Hiring Intelligence Visual */}
      {/* ============================================================ */}
      <div className="hidden lg:flex lg:w-[52%] xl:w-[55%] bg-gradient-to-br from-brand-ivory via-background to-[#FBF0E8] dark:from-[#1A1C24] dark:via-[#14151C] dark:to-[#171821] border-r border-border/80 dark:border-white/10 flex-col justify-between p-10 xl:p-14 relative overflow-hidden select-none">
        {/* Subtle decorative radial lights */}
        <div className="absolute top-1/4 -left-12 w-80 h-80 bg-brand-peach/40 dark:bg-brand-coral/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-brand-coral/15 dark:bg-brand-coral/5 rounded-full blur-3xl pointer-events-none" />

        {/* Top Brand Lockup with High-Contrast Logo */}
        <div className="relative z-10 flex items-center justify-between">
          <BrandLogo size="default" />

          <Badge
            variant="secondary"
            className="text-xs font-semibold gap-1.5 px-3 py-1 bg-card/80 dark:bg-card/60 backdrop-blur-sm border-border/80 dark:border-white/10"
          >
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

          {/* Professional Hiring Intelligence Card with Real Avatar */}
          <div className="relative pt-2">
            <div className="relative rounded-2xl border border-border/90 dark:border-white/10 bg-card/95 dark:bg-[#1F212B]/95 backdrop-blur-md p-5 sm:p-6 shadow-soft-md dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)] space-y-4">
              {/* Candidate Card Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  {/* Avatar Container with Real Portrait & Polished Initials Fallback */}
                  <div className="relative shrink-0" title="Elena Rostova • Candidate Profile">
                    {!avatarError ? (
                      <img
                        src={candidateAvatarUrl}
                        alt="Elena Rostova"
                        loading="eager"
                        crossOrigin="anonymous"
                        onError={() => setAvatarError(true)}
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-primary/30 dark:ring-primary/50 shadow-sm"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#F47758] via-[#EE6543] to-[#D94F2D] flex items-center justify-center text-white font-black text-sm tracking-wide shadow-sm ring-2 ring-primary/30 dark:ring-primary/50 border border-white/20 select-none">
                        ER
                      </div>
                    )}
                    {/* Active Match Status Dot */}
                    <span
                      className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-card dark:border-[#1F212B] ring-1 ring-emerald-600/40 shadow-xs"
                      title="Available &amp; Active"
                    />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-foreground">Elena Rostova</h4>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/40">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        98% Match
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">Staff Frontend Architect • 8 yrs exp</p>
                  </div>
                </div>

                <div className="flex items-center gap-0.5 text-amber-500 text-xs font-bold">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>4.9</span>
                </div>
              </div>

              {/* Skills Tags */}
              <div className="flex flex-wrap gap-1.5">
                <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-md bg-secondary/80 dark:bg-[#2A2C38] text-secondary-foreground dark:text-[#FBE4D8]">
                  React 19
                </span>
                <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-md bg-secondary/80 dark:bg-[#2A2C38] text-secondary-foreground dark:text-[#FBE4D8]">
                  Design Systems
                </span>
                <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-md bg-secondary/80 dark:bg-[#2A2C38] text-secondary-foreground dark:text-[#FBE4D8]">
                  TypeScript
                </span>
                <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-md bg-secondary/80 dark:bg-[#2A2C38] text-secondary-foreground dark:text-[#FBE4D8]">
                  Distributed UI
                </span>
              </div>

              {/* Scorecard metrics bar */}
              <div className="pt-2 border-t border-border/60 dark:border-white/10 grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2 rounded-lg bg-muted/40 dark:bg-[#181922]">
                  <div className="font-bold text-foreground">9.8 / 10</div>
                  <div className="text-[10px] text-muted-foreground">Architecture</div>
                </div>
                <div className="p-2 rounded-lg bg-muted/40 dark:bg-[#181922]">
                  <div className="font-bold text-foreground">9.6 / 10</div>
                  <div className="text-[10px] text-muted-foreground">Collaboration</div>
                </div>
                <div className="p-2 rounded-lg bg-primary/10 dark:bg-primary/20 text-primary">
                  <div className="font-bold">Interview</div>
                  <div className="text-[10px]">Round 3</div>
                </div>
              </div>
            </div>

            {/* Floating Metric Pill */}
            <div className="absolute -bottom-3.5 -right-2 sm:-right-4 rounded-xl border border-border/80 dark:border-white/10 bg-card/95 dark:bg-[#1F212B]/95 backdrop-blur-md px-3.5 py-2 shadow-soft-sm flex items-center gap-2.5 text-xs">
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
        <div className="relative z-10 pt-4 border-t border-border/60 dark:border-white/10">
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
      {/* RIGHT PANEL: Form Container Area (Responsive & Mobile-safe) */}
      {/* ============================================================ */}
      <div className="w-full lg:w-[48%] xl:w-[45%] flex flex-col justify-between px-4 sm:px-8 lg:px-12 xl:px-16 py-6 sm:py-8 lg:py-12 min-h-screen bg-card lg:bg-background dark:bg-[#14151B] transition-colors duration-200">
        {/* Mobile Top Header with High-Contrast Logo & Theme Toggle */}
        <div className="flex items-center justify-between w-full pb-4 sm:pb-6 lg:pb-0">
          <div className="lg:hidden">
            <BrandLogo size="sm" showTagline={false} />
          </div>

          {/* Theme Toggle Button (top-right) */}
          <div className="ml-auto">
            <ThemeToggle />
          </div>
        </div>

        {/* Central Form Container (Fixed width with 100% max-width for zero horizontal scroll) */}
        <div className="w-full max-w-[380px] sm:max-w-[400px] mx-auto my-auto py-2 sm:py-4">
          <Outlet />
        </div>

        {/* Mobile-Safe Footer */}
        <div className="pt-6 text-center text-xs text-muted-foreground flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-border/40 dark:border-white/10 w-full">
          <span>&copy; {new Date().getFullYear()} HireFlow Inc.</span>
          <div className="flex items-center gap-4">
            <span className="hover:text-foreground transition-colors cursor-pointer">Privacy</span>
            <span className="hover:text-foreground transition-colors cursor-pointer">Terms</span>
            <span className="hover:text-foreground transition-colors cursor-pointer">Security</span>
          </div>
        </div>
      </div>
    </div>
  )
}
