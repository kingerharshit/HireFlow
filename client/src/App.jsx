import { useState } from "react"
import { Link } from "react-router-dom"
import { useTheme } from "@/context/ThemeContext"
import { ThemeToggle, ThemeSegmentedControl } from "@/components/common/ThemeToggle"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
  Sparkles,
  Users,
  Briefcase,
  CheckCircle2,
  Clock,
  ArrowRight,
  Search,
  FileText,
  Calendar,
  Layers,
  Palette,
  Sliders,
  Check,
  Sun,
  Moon,
  LogIn,
  UserPlus,
  KeyRound,
  MailCheck,
  ShieldAlert,
} from "lucide-react"

function App() {
  const { theme, resolvedTheme } = useTheme()
  const [copiedColor, setCopiedColor] = useState(null)

  const brandColors = [
    {
      name: "Warm Ivory",
      hex: "#FFF8F3",
      token: "--background",
      role: "App Canvas & Clean Backgrounds",
      bgClass: "bg-brand-ivory",
      borderClass: "border-border",
      textDark: true,
    },
    {
      name: "Soft Peach",
      hex: "#F9E1D5",
      token: "--secondary / --accent",
      role: "Secondary Surfaces & Warm Accents",
      bgClass: "bg-brand-peach",
      borderClass: "border-border/60",
      textDark: true,
    },
    {
      name: "Coral",
      hex: "#F47758",
      token: "--primary / --ring",
      role: "Primary CTAs, Brand Accent & Focus",
      bgClass: "bg-brand-coral",
      borderClass: "border-transparent",
      textDark: false,
    },
    {
      name: "Charcoal",
      hex: "#292B32",
      token: "--foreground",
      role: "Primary Typography & Heavy Contrasts",
      bgClass: "bg-brand-charcoal",
      borderClass: "border-transparent",
      textDark: false,
    },
    {
      name: "Pure White",
      hex: "#FFFFFF",
      token: "--card / --popover",
      role: "Elevated Containers & Panels",
      bgClass: "bg-white",
      borderClass: "border-border",
      textDark: true,
    },
  ]

  const handleCopy = (hex) => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(hex)
    }
    setCopiedColor(hex)
    setTimeout(() => setCopiedColor(null), 1800)
  }

  const authRoutes = [
    {
      path: "/auth/login",
      title: "Sign In",
      desc: "Email & password with remember me, forgot link, and validation",
      icon: LogIn,
      badge: "Task 2",
    },
    {
      path: "/auth/register",
      title: "Registration",
      desc: "Candidate & recruiter onboarding with password strength",
      icon: UserPlus,
      badge: "Task 3",
    },
    {
      path: "/auth/forgot-password",
      title: "Forgot Password",
      desc: "Email recovery submission with simulated confirmation",
      icon: KeyRound,
      badge: "Task 4",
    },
    {
      path: "/auth/reset-password",
      title: "Reset Password",
      desc: "New password setup with real-time match validation",
      icon: KeyRound,
      badge: "Task 5",
    },
    {
      path: "/auth/verify-email",
      title: "Email Verification",
      desc: "Activation pending status UI with simulated resend action",
      icon: MailCheck,
      badge: "Task 6",
    },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground antialiased selection:bg-brand-peach selection:text-brand-charcoal transition-colors duration-200">
      {/* Top Navigation Bar */}
      <header className="border-b border-border/80 bg-card/80 backdrop-blur-md sticky top-0 z-50 transition-colors duration-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-coral to-[#E25F3E] flex items-center justify-center text-white shadow-soft-sm font-bold text-lg">
              HF
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-foreground">
                  HireFlow
                </span>
                <Badge variant="secondary" className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5">
                  Milestone 6.5
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground font-medium hidden sm:block">
                Smarter Hiring. Better Connections.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/auth/login" className="hidden sm:inline-flex">
              <Button size="sm" variant="default" className="gap-1.5 font-medium shadow-soft-sm">
                <LogIn className="w-3.5 h-3.5" />
                <span>Launch Auth Portal</span>
              </Button>
            </Link>
            <ThemeSegmentedControl className="hidden md:inline-flex" />
            <ThemeToggle variant="outline" size="icon" />
          </div>
        </div>
      </header>

      {/* Main Content Showcase */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-12">
        {/* Milestone 6.5 Hero Banner */}
        <section className="text-center space-y-4 max-w-3xl mx-auto pt-2">
          <div className="flex items-center justify-center gap-2">
            <Badge variant="default" className="px-3.5 py-1 text-xs font-semibold gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Milestone 6.5 — Authentication Suite
            </Badge>
            <Badge variant="outline" className="px-3 py-1 text-xs font-mono">
              Active: {theme} ({resolvedTheme})
            </Badge>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground">
            HireFlow Authentication Interface
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            A complete, responsive multi-tenant SaaS authentication experience with candidate &amp; recruiter
            onboarding, real-time client validation, split-screen layouts, and light/dark theme harmony.
          </p>
        </section>

        {/* Milestone 6.5 Auth Flow Direct Navigation Hub */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-secondary text-foreground">
                <LogIn className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-foreground">
                  Authentication Routes &amp; Pages
                </h2>
                <p className="text-sm text-muted-foreground">
                  Click any card to navigate directly to the interactive authentication page.
                </p>
              </div>
            </div>

            <Link to="/auth/login">
              <Button variant="default" size="sm" className="gap-1.5">
                <span>Open Login</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {authRoutes.map((route) => {
              const Icon = route.icon
              return (
                <Link key={route.path} to={route.path} className="group block focus:outline-none">
                  <Card className="h-full border border-border/80 bg-card hover:border-primary/60 hover:shadow-soft-md transition-all p-5 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="w-9 h-9 rounded-xl bg-secondary text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors shadow-soft-sm">
                          <Icon className="w-4 h-4" />
                        </div>
                        <Badge variant="outline" className="text-[10px] font-mono">
                          {route.badge}
                        </Badge>
                      </div>

                      <div className="space-y-1">
                        <h3 className="font-bold text-base text-foreground group-hover:text-primary transition-colors flex items-center gap-1.5">
                          <span>{route.title}</span>
                          <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary" />
                        </h3>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {route.desc}
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 mt-3 border-t border-border/60 flex items-center justify-between text-xs font-mono text-muted-foreground">
                      <span>{route.path}</span>
                      <span className="text-primary font-semibold text-[11px] group-hover:underline">
                        Navigate &rarr;
                      </span>
                    </div>
                  </Card>
                </Link>
              )
            })}

            {/* Quick 404 test link */}
            <Link to="/auth/unknown-route" className="group block focus:outline-none">
              <Card className="h-full border border-dashed border-border/80 bg-muted/20 hover:border-destructive/60 hover:shadow-soft-sm transition-all p-5 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-9 h-9 rounded-xl bg-muted text-muted-foreground flex items-center justify-center shadow-soft-sm">
                      <ShieldAlert className="w-4 h-4" />
                    </div>
                    <Badge variant="outline" className="text-[10px] font-mono">
                      Task 8
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-base text-foreground group-hover:text-destructive transition-colors">
                      404 Not Found Fallback
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Tests React Router catch-all route handler and error page layout.
                    </p>
                  </div>
                </div>
                <div className="pt-4 mt-3 border-t border-border/60 flex items-center justify-between text-xs font-mono text-muted-foreground">
                  <span>/auth/unknown-route</span>
                  <span className="text-muted-foreground group-hover:underline">Test 404 &rarr;</span>
                </div>
              </Card>
            </Link>
          </div>
        </section>

        <Separator />

        {/* Design System & Theme Engine Reference */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Palette className="w-5 h-5 text-primary" />
                <h2 className="text-2xl font-bold tracking-tight text-foreground">
                  Design System &amp; Theme Engine Reference
                </h2>
              </div>
              <p className="text-sm text-muted-foreground">
                All authentication pages inherit these centralized tokens, components, and light/dark theme variables.
              </p>
            </div>

            <ThemeSegmentedControl />
          </div>

          {/* Color Tokens Swatches */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {brandColors.map((color) => (
              <Card
                key={color.hex}
                className="overflow-hidden border border-border/80 hover:shadow-soft-md transition-all cursor-pointer group"
                onClick={() => handleCopy(color.hex)}
              >
                <div
                  className={`h-20 ${color.bgClass} ${color.borderClass} border-b flex items-end justify-between p-3 transition-transform group-hover:scale-[1.02]`}
                >
                  <span
                    className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                      color.textDark ? "bg-black/10 text-slate-900" : "bg-white/20 text-white"
                    }`}
                  >
                    {color.hex}
                  </span>
                  <div className="text-xs">
                    {copiedColor === color.hex ? (
                      <span className="inline-flex items-center gap-1 bg-emerald-600 text-white px-2 py-0.5 rounded text-[10px] font-bold">
                        <Check className="w-3 h-3" /> Copied
                      </span>
                    ) : (
                      <span
                        className={`opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                          color.textDark ? "bg-black/10 text-slate-900" : "bg-white/25 text-white"
                        }`}
                      >
                        Copy
                      </span>
                    )}
                  </div>
                </div>
                <div className="p-3.5 space-y-0.5">
                  <h3 className="font-bold text-sm text-foreground">{color.name}</h3>
                  <p className="text-[11px] font-mono text-primary font-semibold">{color.token}</p>
                </div>
              </Card>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/80 bg-card/60 py-6 mt-16 text-center text-xs text-muted-foreground transition-colors duration-200">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            <strong>HireFlow</strong> — Smarter Hiring. Better Connections.
          </span>
          <span className="font-mono text-[11px]">
            Milestone 6.5 • Authentication UI Suite • React Router + React 19 + Vite 6
          </span>
        </div>
      </footer>
    </div>
  )
}

export default App
