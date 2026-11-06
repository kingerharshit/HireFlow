import * as React from "react"
import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import {
  Search,
  Briefcase,
  Users,
  FileText,
  X,
  Sparkles,
  ArrowRight,
  Command,
} from "lucide-react"
import { cn } from "@/lib/utils"

const DEMO_SEARCH_DATA = [
  // Jobs
  {
    id: "job-1",
    category: "Jobs",
    title: "Staff Frontend Architect",
    subtitle: "Engineering • EMEA / Remote • Active",
    to: "/recruiter/jobs",
    icon: Briefcase,
    badge: "12 Candidates",
  },
  {
    id: "job-2",
    category: "Jobs",
    title: "Senior Backend Engineer (Go/Node)",
    subtitle: "Platform • US Remote • Active",
    to: "/recruiter/jobs",
    icon: Briefcase,
    badge: "18 Candidates",
  },
  {
    id: "job-3",
    category: "Jobs",
    title: "Lead Product Designer",
    subtitle: "Design Systems • Global • Draft",
    to: "/recruiter/jobs",
    icon: Briefcase,
    badge: "Draft",
  },
  // Candidates
  {
    id: "cand-1",
    category: "Candidates",
    title: "Elena Rostova",
    subtitle: "Staff Frontend Architect • 8 yrs exp",
    to: "/recruiter/candidates",
    icon: Users,
    badge: "98% Match",
  },
  {
    id: "cand-2",
    category: "Candidates",
    title: "Marcus Vance",
    subtitle: "Senior Distributed Systems • 6 yrs exp",
    to: "/recruiter/candidates",
    icon: Users,
    badge: "94% Match",
  },
  {
    id: "cand-3",
    category: "Candidates",
    title: "Sarah Jenkins",
    subtitle: "Principal UX & Interaction Designer",
    to: "/recruiter/candidates",
    icon: Users,
    badge: "91% Match",
  },
  // Applications
  {
    id: "app-1",
    category: "Applications",
    title: "Application #1042 — Marcus Vance",
    subtitle: "Senior Backend Engineer • Round 3 Interview",
    to: "/recruiter/applications",
    icon: FileText,
    badge: "Interviewing",
  },
  {
    id: "app-2",
    category: "Applications",
    title: "Application #1039 — Elena Rostova",
    subtitle: "Staff Frontend Architect • Score: 9.8/10",
    to: "/recruiter/applications",
    icon: FileText,
    badge: "Under Review",
  },
  {
    id: "app-3",
    category: "Applications",
    title: "Application #1028 — David Kim",
    subtitle: "Lead Product Designer • Screening Stage",
    to: "/recruiter/applications",
    icon: FileText,
    badge: "Screening",
  },
]

const CATEGORIES = ["All", "Jobs", "Candidates", "Applications"]

export function GlobalSearch({ className }) {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("All")
  const inputRef = useRef(null)
  const navigate = useNavigate()

  // Listen for Ctrl+K or Cmd+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        setIsOpen((prev) => !prev)
      } else if (e.key === "Escape" && isOpen) {
        setIsOpen(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen])

  // Focus input on dialog open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
      setTimeout(() => inputRef.current?.focus(), 50)
    } else {
      document.body.style.overflow = ""
      setQuery("")
      setActiveCategory("All")
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  const filteredItems = DEMO_SEARCH_DATA.filter((item) => {
    const matchesCategory =
      activeCategory === "All" || item.category === activeCategory
    const q = query.trim().toLowerCase()
    const matchesQuery =
      !q ||
      item.title.toLowerCase().includes(q) ||
      item.subtitle.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q)
    return matchesCategory && matchesQuery
  })

  const handleSelect = (item) => {
    setIsOpen(false)
    navigate(item.to)
  }

  return (
    <>
      {/* Navbar Search Trigger for Desktop & Tablet */}
      <div className={cn("relative flex items-center", className)}>
        {/* Full input trigger on md+ screens */}
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="hidden sm:flex items-center justify-between w-48 md:w-56 lg:w-64 h-9 px-3 rounded-lg border border-border/80 dark:border-white/10 bg-muted/50 dark:bg-[#181922] hover:bg-muted/80 text-xs text-muted-foreground transition-all cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring shadow-soft-xs"
          aria-label="Search jobs, candidates, and applications"
        >
          <span className="flex items-center gap-2 truncate">
            <Search className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            <span className="truncate">Search workspace...</span>
          </span>
          <kbd className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded border border-border/80 dark:border-white/10 text-[10px] font-mono bg-card dark:bg-[#20222C] text-muted-foreground shadow-xs shrink-0">
            <span className="text-[11px]">⌘</span>K
          </kbd>
        </button>

        {/* Compact search icon button on mobile screens (< sm) */}
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="Open search dialog"
          className="sm:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Search className="w-4 h-4" />
        </button>
      </div>

      {/* Global Search Dialog Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 md:p-12"
          role="dialog"
          aria-modal="true"
          aria-label="Global Workspace Search"
        >
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-200 animate-in fade-in-50"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          {/* Modal Card */}
          <div className="relative w-full max-w-xl bg-card border border-border/90 dark:border-white/10 shadow-2xl rounded-2xl z-50 overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 fade-in-50 duration-150 select-none">
            {/* Input Header */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border/80 dark:border-white/10">
              <Search className="w-4 h-4 text-primary shrink-0" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search jobs, candidates, or applications..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none font-medium"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="p-1 rounded-md text-muted-foreground hover:text-foreground"
                  aria-label="Clear query"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-[11px] font-semibold text-muted-foreground hover:text-foreground px-2 py-1 rounded bg-muted/60"
              >
                ESC
              </button>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 px-4 py-2 bg-muted/30 dark:bg-white/5 border-b border-border/60 overflow-x-auto scrollbar-none">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    "px-2.5 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer shrink-0",
                    activeCategory === cat
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/70"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Results List */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1 divide-y divide-border/40 max-h-[50vh]">
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleSelect(item)}
                      className="w-full flex items-center gap-3 p-2.5 rounded-xl text-left hover:bg-muted/70 dark:hover:bg-white/5 transition-colors group cursor-pointer"
                    >
                      <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-bold text-foreground truncate">
                            {item.title}
                          </p>
                          <span className="text-[10px] font-medium px-1.5 py-0.2 rounded bg-muted text-muted-foreground shrink-0">
                            {item.category}
                          </span>
                        </div>
                        <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                          {item.subtitle}
                        </p>
                      </div>
                      <span className="hidden sm:inline-flex text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary shrink-0 border border-primary/20">
                        {item.badge}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-muted-foreground/60 group-hover:text-primary transition-colors shrink-0" />
                    </button>
                  )
                })
              ) : (
                <div className="py-12 text-center space-y-2">
                  <p className="text-sm font-semibold text-foreground">
                    No results found
                  </p>
                  <p className="text-xs text-muted-foreground">
                    No matches found for &quot;{query}&quot;. Try searching for jobs, candidates, or applications.
                  </p>
                </div>
              )}
            </div>

            {/* Dialog Footer Notice */}
            <div className="px-4 py-2.5 bg-muted/40 dark:bg-[#14151B] border-t border-border/80 flex items-center justify-between text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-primary" />
                <span>Frontend demonstration search • Ready for API indexing</span>
              </span>
              <span className="hidden sm:inline">Use ↑↓ to navigate</span>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

