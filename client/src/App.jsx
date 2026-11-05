import { useState } from "react"
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
  Laptop,
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
                  Milestone 6.4
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground font-medium hidden sm:block">
                Smarter Hiring. Better Connections.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Theme Toggle in Header */}
            <ThemeSegmentedControl className="hidden md:inline-flex" />
            <ThemeToggle variant="outline" size="icon" />
          </div>
        </div>
      </header>

      {/* Main Content Showcase */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-12">
        {/* Hero Section */}
        <section className="text-center space-y-4 max-w-3xl mx-auto pt-2">
          <div className="flex items-center justify-center gap-2">
            <Badge variant="secondary" className="px-3.5 py-1 text-xs font-semibold gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              Theme Engine Active
            </Badge>
            <Badge variant="outline" className="px-3 py-1 text-xs font-mono">
              Active: {theme} ({resolvedTheme} mode)
            </Badge>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground">
            Light &amp; Dark Theme System
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            Fully dynamic, accessible theme management powered by React Context, localStorage persistence,
            and system OS preference synchronization.
          </p>
        </section>

        {/* Theme Controller Panel */}
        <Card className="p-6 border-border/80 bg-card shadow-soft">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                {resolvedTheme === "dark" ? (
                  <Moon className="w-5 h-5 text-sky-400" />
                ) : (
                  <Sun className="w-5 h-5 text-amber-500" />
                )}
                <h2 className="text-lg font-bold text-foreground">
                  Theme Controller &amp; State
                </h2>
              </div>
              <p className="text-xs text-muted-foreground">
                Preference is saved to <code className="px-1.5 py-0.5 rounded bg-muted font-mono">localStorage[&quot;hireflow-theme&quot;]</code>.
                Theme changes propagate without flash (FOUC).
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <ThemeSegmentedControl />
              <ThemeToggle showLabel variant="default" size="default" className="gap-2" />
            </div>
          </div>
        </Card>

        {/* 1. Sample Cards (Demonstrating surface elevation in light and dark) */}
        <section className="space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-secondary text-foreground">
              <Briefcase className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                Elevated Card Surfaces
              </h2>
              <p className="text-sm text-muted-foreground">
                Cards transition between crisp white (light mode) and deep charcoal #22242D (dark mode) with accessible contrast.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Job Requisition Card Preview */}
            <Card className="hover:shadow-soft-md transition-all">
              <CardHeader className="space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant="default">Engineering</Badge>
                  <span className="text-xs font-medium text-muted-foreground">
                    Requisition #HF-409
                  </span>
                </div>
                <CardTitle className="text-xl font-bold text-foreground">
                  Staff Infrastructure Engineer
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Platform Reliability • San Francisco / Remote • Full-time
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <Separator />
                <div className="grid grid-cols-3 gap-2 text-center py-1">
                  <div className="p-2.5 rounded-xl bg-muted/60">
                    <div className="text-xl font-extrabold text-foreground">38</div>
                    <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
                      Applied
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-secondary/70">
                    <div className="text-xl font-extrabold text-secondary-foreground">6</div>
                    <div className="text-[11px] uppercase tracking-wider text-secondary-foreground/80 font-medium">
                      In Review
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-primary/10">
                    <div className="text-xl font-extrabold text-primary">2</div>
                    <div className="text-[11px] uppercase tracking-wider text-primary font-medium">
                      Final Stage
                    </div>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="flex items-center justify-between border-t border-border/80 pt-4">
                <span className="text-xs font-medium text-muted-foreground">
                  Salary: $190,000 - $225,000
                </span>
                <Button size="sm" variant="default" className="gap-1.5">
                  <span>View Pipeline</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </CardFooter>
            </Card>

            {/* Candidate Evaluation Card Preview */}
            <Card className="hover:shadow-soft-md transition-all">
              <CardHeader className="space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant="success" className="gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Interviewing
                  </Badge>
                  <span className="text-xs font-mono font-medium text-muted-foreground">
                    Match: 96%
                  </span>
                </div>
                <CardTitle className="text-xl font-bold text-foreground">
                  Marcus Vance
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Senior Distributed Systems Specialist • 7 yrs experience
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-3">
                <Separator />
                <p className="text-xs text-foreground/80 leading-relaxed">
                  Evaluated with exceptional ratings on cloud resilience, Kubernetes orchestration,
                  and low-latency database sharding. Recommended for executive stage.
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="text-[11px] bg-muted/80 px-2 py-0.5 rounded font-medium text-muted-foreground">
                    Distributed Systems
                  </span>
                  <span className="text-[11px] bg-muted/80 px-2 py-0.5 rounded font-medium text-muted-foreground">
                    Kubernetes
                  </span>
                  <span className="text-[11px] bg-muted/80 px-2 py-0.5 rounded font-medium text-muted-foreground">
                    High Availability
                  </span>
                </div>
              </CardContent>

              <CardFooter className="flex items-center justify-between border-t border-border/80 pt-4">
                <Button size="sm" variant="outline">
                  Download CV
                </Button>
                <Button size="sm" variant="secondary">
                  Schedule Round 2
                </Button>
              </CardFooter>
            </Card>
          </div>
        </section>

        {/* 2. Interactive Buttons */}
        <section className="space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-secondary text-foreground">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                Button Component States
              </h2>
              <p className="text-sm text-muted-foreground">
                Accessible interactive controls rendered in active theme styling.
              </p>
            </div>
          </div>

          <Card className="p-6 sm:p-8 space-y-6">
            <div className="space-y-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Button Variants
              </span>
              <div className="flex flex-wrap gap-3 items-center">
                <Button variant="default">
                  <Users className="w-4 h-4" />
                  Primary Action
                </Button>
                <Button variant="secondary">
                  <Calendar className="w-4 h-4" />
                  Secondary
                </Button>
                <Button variant="outline">
                  <FileText className="w-4 h-4" />
                  Outline Action
                </Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="link">Inline Link</Button>
                <Button disabled>Disabled</Button>
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Button Sizes
              </span>
              <div className="flex flex-wrap gap-3 items-center">
                <Button size="sm" variant="default">
                  Compact (h-8)
                </Button>
                <Button size="default" variant="default">
                  Default (h-10)
                </Button>
                <Button size="lg" variant="default">
                  Large CTA (h-11)
                </Button>
                <Button size="icon" variant="outline" aria-label="Icon Button Action">
                  <Sparkles className="w-4 h-4 text-primary" />
                </Button>
              </div>
            </div>
          </Card>
        </section>

        {/* 3. Inputs & Badges Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Inputs Section */}
          <section className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-secondary text-foreground">
                <Sliders className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold tracking-tight text-foreground">
                  Input Fields &amp; Validation
                </h2>
                <p className="text-sm text-muted-foreground">
                  Theme-aware inputs with focus states and error handling.
                </p>
              </div>
            </div>

            <Card className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Search Candidate
                </label>
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Search by candidate name or keyword..."
                    className="pl-9"
                  />
                  <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-3 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Filled State
                </label>
                <Input
                  type="text"
                  defaultValue="Principal Distributed Systems Architect"
                  readOnly
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Validation Error State
                </label>
                <Input
                  type="email"
                  defaultValue="recruiter-invalid-email"
                  error={true}
                />
                <p className="text-xs text-destructive font-medium">
                  Please provide a valid corporate email address.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Disabled Input
                </label>
                <Input
                  type="text"
                  defaultValue="Auto-Generated Application Key #HF-892"
                  disabled
                />
              </div>
            </Card>
          </section>

          {/* Badges Section */}
          <section className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-secondary text-foreground">
                <Layers className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold tracking-tight text-foreground">
                  Status &amp; Workflow Badges
                </h2>
                <p className="text-sm text-muted-foreground">
                  Status indicators supporting light and dark contrast ratios.
                </p>
              </div>
            </div>

            <Card className="p-6 space-y-6">
              <div className="space-y-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Core Theme Badges
                </span>
                <div className="flex flex-wrap gap-2.5">
                  <Badge variant="default">Primary (Coral)</Badge>
                  <Badge variant="secondary">Secondary (Peach)</Badge>
                  <Badge variant="outline">Outline</Badge>
                  <Badge variant="destructive">Destructive</Badge>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Recruitment Workflow Statuses
                </span>
                <div className="flex flex-wrap gap-2.5">
                  <Badge variant="default" className="gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
                    Active Requisition
                  </Badge>
                  <Badge variant="secondary" className="gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-foreground" />
                    Sourced
                  </Badge>
                  <Badge variant="warning" className="gap-1.5">
                    <Clock className="w-3 h-3" />
                    In Review
                  </Badge>
                  <Badge variant="info" className="gap-1.5">
                    <Calendar className="w-3 h-3" />
                    Interview Scheduled
                  </Badge>
                  <Badge variant="success" className="gap-1.5">
                    <CheckCircle2 className="w-3 h-3" />
                    Hired
                  </Badge>
                  <Badge variant="destructive" className="gap-1.5">
                    Rejected
                  </Badge>
                </div>
              </div>
            </Card>
          </section>
        </div>

        {/* 4. Brand Palette Reference */}
        <section className="space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-secondary text-foreground">
              <Palette className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                Brand Palette Tokens
              </h2>
              <p className="text-sm text-muted-foreground">
                Centralized color tokens preserved across both light and dark display modes.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {brandColors.map((color) => (
              <Card
                key={color.hex}
                className="overflow-hidden border border-border/80 hover:shadow-soft-md transition-all cursor-pointer group"
                onClick={() => handleCopy(color.hex)}
              >
                <div
                  className={`h-24 ${color.bgClass} ${color.borderClass} border-b flex items-end justify-between p-3 transition-transform group-hover:scale-[1.02]`}
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
                <div className="p-4 space-y-1">
                  <h3 className="font-bold text-sm text-foreground">{color.name}</h3>
                  <p className="text-[11px] font-mono text-primary font-semibold">{color.token}</p>
                  <p className="text-xs text-muted-foreground leading-snug pt-1">{color.role}</p>
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
            Milestone 6.4 • Light &amp; Dark Theme Engine • React 19 + Vite 6
          </span>
        </div>
      </footer>
    </div>
  )
}

export default App
