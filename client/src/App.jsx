import { useState } from "react"
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
  Type,
  MousePointerClick,
  Sliders,
  Check,
} from "lucide-react"

function App() {
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
    <div className="min-h-screen bg-background text-foreground antialiased selection:bg-brand-peach selection:text-foreground">
      {/* Top Banner / Navigation Mockup */}
      <header className="border-b border-border/80 bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
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
                  Design System
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground font-medium hidden sm:block">
                Smarter Hiring. Better Connections.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="outline" className="hidden sm:inline-flex gap-1.5 text-xs font-medium py-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Milestone 6.3 Active
            </Badge>
            <Button size="sm" variant="default" className="gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Showcase</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-12">
        {/* Hero Section */}
        <section className="text-center space-y-4 max-w-3xl mx-auto pt-2">
          <Badge variant="secondary" className="px-3.5 py-1 text-xs font-semibold gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            Global Design Foundation
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground">
            HireFlow Design System
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            A warm, welcoming, and high-performance visual language designed for modern enterprise
            recruitment technology.
          </p>
        </section>

        {/* 1. Brand Color Palette */}
        <section className="space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-secondary text-foreground">
              <Palette className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                Brand Color Palette
              </h2>
              <p className="text-sm text-muted-foreground">
                Centralized semantic tokens derived from HireFlow&apos;s warm, human-centric visual identity.
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
                  className={`h-28 ${color.bgClass} ${color.borderClass} border-b flex items-end justify-between p-3 transition-transform group-hover:scale-[1.02]`}
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

        {/* 2. Typography Hierarchy */}
        <section className="space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-secondary text-foreground">
              <Type className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                Typography Scale &amp; Hierarchy
              </h2>
              <p className="text-sm text-muted-foreground">
                Set in <strong className="text-foreground">Inter</strong> for optical clarity, readability, and structured SaaS ergonomics.
              </p>
            </div>
          </div>

          <Card className="p-6 sm:p-8 space-y-6">
            <div className="space-y-1 pb-4 border-b border-border/70">
              <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                Display Heading — 36px / 44px • font-extrabold
              </span>
              <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                Smarter Hiring. Better Connections.
              </div>
            </div>

            <div className="space-y-1 pb-4 border-b border-border/70">
              <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                Page Heading — 24px / 32px • font-bold
              </span>
              <div className="text-2xl font-bold tracking-tight text-foreground">
                Candidate Pipeline &amp; Talent Analytics
              </div>
            </div>

            <div className="space-y-1 pb-4 border-b border-border/70">
              <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                Section Heading — 20px / 28px • font-semibold
              </span>
              <div className="text-xl font-semibold tracking-tight text-foreground">
                Structured Interview Evaluation &amp; Scorecards
              </div>
            </div>

            <div className="space-y-1 pb-4 border-b border-border/70">
              <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                Body Text — 16px / 24px • text-foreground/90
              </span>
              <p className="text-base leading-relaxed text-foreground/90 max-w-4xl">
                HireFlow empowers modern recruiting teams with automated applicant tracking, AI-assisted resume screening,
                and collaborative scorecards—delivering seamless experiences for both hiring managers and candidates.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              <div className="space-y-1">
                <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                  Secondary Text — 14px
                </span>
                <p className="text-sm text-muted-foreground leading-normal">
                  Average response time is 2.4 days across all active talent pools.
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                  Form Label — 12px uppercase
                </span>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Application Stage
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                  Metadata — 12px
                </span>
                <p className="text-xs text-muted-foreground">
                  Requisition ID: #HF-942 • Remote / Full-time
                </p>
              </div>
            </div>
          </Card>
        </section>

        {/* 3. Buttons & Interactive States */}
        <section className="space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-secondary text-foreground">
              <MousePointerClick className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                Button Component System
              </h2>
              <p className="text-sm text-muted-foreground">
                Accessible interactive controls with rounded-lg styling, soft shadows, and warm active micro-interactions.
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
                  Primary (Coral)
                </Button>
                <Button variant="secondary">
                  <Calendar className="w-4 h-4" />
                  Secondary (Peach)
                </Button>
                <Button variant="outline">
                  <FileText className="w-4 h-4" />
                  Outline
                </Button>
                <Button variant="ghost">Ghost Action</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="link">Inline Link</Button>
                <Button disabled>Disabled State</Button>
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Button Sizes
              </span>
              <div className="flex flex-wrap gap-3 items-center">
                <Button size="sm" variant="default">
                  Small (h-8)
                </Button>
                <Button size="default" variant="default">
                  Default (h-10)
                </Button>
                <Button size="lg" variant="default">
                  Large (h-11)
                </Button>
                <Button size="icon" variant="outline" aria-label="Quick Action">
                  <Sparkles className="w-4 h-4 text-primary" />
                </Button>
              </div>
            </div>
          </Card>
        </section>

        {/* 4. Form Inputs & Status Badges (Grid layout) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Inputs Section */}
          <section className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-secondary text-foreground">
                <Sliders className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold tracking-tight text-foreground">
                  Input Fields &amp; States
                </h2>
                <p className="text-sm text-muted-foreground">
                  Clean input surfaces with warm borders and coral focus rings.
                </p>
              </div>
            </div>

            <Card className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Default Input
                </label>
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Search candidates, skills, or titles..."
                    className="pl-9"
                  />
                  <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-3 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Pre-filled Input
                </label>
                <Input
                  type="text"
                  defaultValue="Senior Full-Stack Engineer — Platform Team"
                  readOnly
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Error Validation State
                </label>
                <Input
                  type="email"
                  defaultValue="candidate-invalid-email@"
                  error={true}
                />
                <p className="text-xs text-destructive font-medium">
                  Please provide a valid corporate email address.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Disabled Field
                </label>
                <Input
                  type="text"
                  defaultValue="Automated Reference Code #HF-REF-2026"
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
                  Workflow Status Badges
                </h2>
                <p className="text-sm text-muted-foreground">
                  Consistent state indicators for applicant workflows.
                </p>
              </div>
            </div>

            <Card className="p-6 space-y-6">
              <div className="space-y-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Core Variant Tokens
                </span>
                <div className="flex flex-wrap gap-2.5">
                  <Badge variant="default">Primary / Coral</Badge>
                  <Badge variant="secondary">Secondary / Peach</Badge>
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
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-charcoal" />
                    Application Received
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
                    Offer Accepted
                  </Badge>
                  <Badge variant="destructive" className="gap-1.5">
                    Rejected
                  </Badge>
                </div>
              </div>
            </Card>
          </section>
        </div>

        {/* 5. Composable Card Architecture Showcase */}
        <section className="space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-secondary text-foreground">
              <Briefcase className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                Card Architecture Example
              </h2>
              <p className="text-sm text-muted-foreground">
                Demonstrating rounded-2xl elevation, clean typography, whitespace, and composability.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Requisition Card Preview */}
            <Card className="hover:shadow-soft-md transition-shadow">
              <CardHeader className="space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant="default">Engineering</Badge>
                  <span className="text-xs font-medium text-muted-foreground">
                    Opened 3 days ago
                  </span>
                </div>
                <CardTitle className="text-xl font-bold text-foreground">
                  Lead Frontend Architect (React / UI Systems)
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Core Experience Team • San Francisco, CA (Hybrid / Remote)
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <Separator />
                <div className="grid grid-cols-3 gap-2 text-center py-1">
                  <div className="p-2.5 rounded-xl bg-muted/50">
                    <div className="text-xl font-extrabold text-foreground">42</div>
                    <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
                      Applied
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-secondary/60">
                    <div className="text-xl font-extrabold text-brand-charcoal">8</div>
                    <div className="text-[11px] uppercase tracking-wider text-brand-charcoal/70 font-medium">
                      In Review
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-brand-peach/40">
                    <div className="text-xl font-extrabold text-primary">3</div>
                    <div className="text-[11px] uppercase tracking-wider text-primary font-medium">
                      Final Stage
                    </div>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="flex items-center justify-between border-t border-border/80 pt-4">
                <span className="text-xs font-medium text-muted-foreground">
                  Target Comp: $185k - $220k
                </span>
                <Button size="sm" variant="default" className="gap-1.5">
                  <span>View Pipeline</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </CardFooter>
            </Card>

            {/* Candidate Card Preview */}
            <Card className="hover:shadow-soft-md transition-shadow">
              <CardHeader className="space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant="success" className="gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Interview Stage
                  </Badge>
                  <span className="text-xs font-mono font-medium text-muted-foreground">
                    Score: 94% Match
                  </span>
                </div>
                <CardTitle className="text-xl font-bold text-foreground">
                  Elena Rostova
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Staff Product Designer • 8+ years exp • Former Stripe &amp; Linear
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-3">
                <Separator />
                <p className="text-xs text-foreground/80 leading-relaxed">
                  Strong background in enterprise design systems, accessible components, and recruitment tooling.
                  Evaluated with high feedback on system architecture and design token scaling.
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="text-[11px] bg-muted px-2 py-0.5 rounded font-medium text-muted-foreground">
                    Design Tokens
                  </span>
                  <span className="text-[11px] bg-muted px-2 py-0.5 rounded font-medium text-muted-foreground">
                    Tailwind CSS
                  </span>
                  <span className="text-[11px] bg-muted px-2 py-0.5 rounded font-medium text-muted-foreground">
                    Accessibility (a11y)
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
      </main>

      {/* Footer */}
      <footer className="border-t border-border/80 bg-card/60 py-6 mt-16 text-center text-xs text-muted-foreground">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            <strong>HireFlow</strong> — Smarter Hiring. Better Connections.
          </span>
          <span className="font-mono text-[11px]">
            Milestone 6.3 • Global Design System • React 19 + Vite 6 + Tailwind CSS
          </span>
        </div>
      </footer>
    </div>
  )
}

export default App
