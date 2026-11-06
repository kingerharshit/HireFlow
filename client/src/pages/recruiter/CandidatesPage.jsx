import * as React from "react"
import { useState, useMemo, useRef, useEffect } from "react"
import {
  Users,
  Building2,
  Search,
  Filter,
  Sparkles,
  X,
  Check,
  Eye,
  MoreVertical,
  Calendar,
  Clock,
  MapPin,
  Briefcase,
  Mail,
  Phone,
  CheckCircle2,
  AlertTriangle,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  Download,
  RefreshCw,
  UserCheck,
  UserX,
  UserPlus,
  Star,
  FileText,
  SlidersHorizontal,
  ChevronDown,
  Copy,
  Plus,
  ExternalLink,
  GraduationCap,
  History,
  ShieldCheck,
} from "lucide-react"
import { AiMatchBadge } from "@/components/dashboard/AiMatchBadge"
import { ApplicationStatusBadge } from "@/components/dashboard/ApplicationStatusBadge"
import {
  DEMO_CANDIDATES,
  CANDIDATE_STATUSES,
  CANDIDATE_SKILLS,
  EXPERIENCE_RANGES,
  CANDIDATE_LOCATIONS,
} from "@/features/candidates/demoCandidatesData"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export function CandidatesPage() {
  // Candidate directory state
  const [candidates, setCandidates] = useState(DEMO_CANDIDATES)

  // Filters State
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("All Candidates")
  const [selectedSkill, setSelectedSkill] = useState("All Skills")
  const [selectedExpRange, setSelectedExpRange] = useState("all")
  const [selectedLocation, setSelectedLocation] = useState("All Locations")

  // Sorting State: 'addedDaysAgo' | 'aiMatchScore' | 'experienceYears' | 'name'
  const [sortField, setSortField] = useState("addedDaysAgo")
  const [sortDirection, setSortDirection] = useState("asc") // 'asc' for most recent (lowest daysAgo)

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(6)

  // Interactive UI State
  const [activeMenuId, setActiveMenuId] = useState(null)
  const [selectedCandidate, setSelectedCandidate] = useState(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [newCandidateForm, setNewCandidateForm] = useState({
    name: "",
    email: "",
    designation: "",
    location: "Bangalore, India",
    experienceYears: "4",
    primarySkill: "React 19",
  })
  const [toastMessage, setToastMessage] = useState(null)

  const menuContainerRef = useRef(null)

  // Close actions menu on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuContainerRef.current && !menuContainerRef.current.contains(e.target)) {
        setActiveMenuId(null)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, selectedStatus, selectedSkill, selectedExpRange, selectedLocation])

  const showToast = (message) => {
    setToastMessage(message)
    setTimeout(() => {
      setToastMessage((prev) => (prev === message ? null : prev))
    }, 4500)
  }

  // Active filters count
  const activeFiltersCount = useMemo(() => {
    let count = 0
    if (searchTerm.trim()) count++
    if (selectedStatus !== "All Candidates") count++
    if (selectedSkill !== "All Skills") count++
    if (selectedExpRange !== "all") count++
    if (selectedLocation !== "All Locations") count++
    return count
  }, [searchTerm, selectedStatus, selectedSkill, selectedExpRange, selectedLocation])

  // Reset all filters
  const handleResetFilters = () => {
    setSearchTerm("")
    setSelectedStatus("All Candidates")
    setSelectedSkill("All Skills")
    setSelectedExpRange("all")
    setSelectedLocation("All Locations")
    showToast("Filters reset to default view")
  }

  // Summary counts calculated from current candidate list
  const summaryCounts = useMemo(() => {
    return {
      total: candidates.length,
      shortlisted: candidates.filter((c) => c.candidateStatus === "Shortlisted").length,
      interviewing: candidates.filter((c) => c.candidateStatus === "Interviewing").length,
      recentlyAdded: candidates.filter((c) => (c.addedDaysAgo || 0) <= 7).length,
      talentPool: candidates.filter((c) => c.inTalentPool).length,
    }
  }, [candidates])

  // Filter candidates
  const filteredCandidates = useMemo(() => {
    return candidates.filter((cand) => {
      // 1. Search text (name, email, skills)
      const q = searchTerm.toLowerCase().trim()
      const matchesSearch =
        q === "" ||
        cand.name.toLowerCase().includes(q) ||
        cand.email.toLowerCase().includes(q) ||
        cand.currentDesignation.toLowerCase().includes(q) ||
        cand.skills.some((s) => s.toLowerCase().includes(q))

      // 2. Status filter
      let matchesStatus = true
      if (selectedStatus === "Talent Pool Only") {
        matchesStatus = cand.inTalentPool
      } else if (selectedStatus !== "All Candidates") {
        matchesStatus = cand.candidateStatus.toLowerCase() === selectedStatus.toLowerCase()
      }

      // 3. Skill filter
      const matchesSkill =
        selectedSkill === "All Skills" || cand.skills.includes(selectedSkill)

      // 4. Experience range filter
      let matchesExp = true
      if (selectedExpRange !== "all") {
        const range = EXPERIENCE_RANGES.find((r) => r.value === selectedExpRange)
        if (range) {
          matchesExp =
            cand.experienceYears >= range.min && cand.experienceYears <= range.max
        }
      }

      // 5. Location filter
      const matchesLocation =
        selectedLocation === "All Locations" || cand.location === selectedLocation

      return matchesSearch && matchesStatus && matchesSkill && matchesExp && matchesLocation
    })
  }, [candidates, searchTerm, selectedStatus, selectedSkill, selectedExpRange, selectedLocation])

  // Sort candidates
  const sortedCandidates = useMemo(() => {
    return [...filteredCandidates].sort((a, b) => {
      if (sortField === "addedDaysAgo") {
        // daysAgo: smaller is more recent
        return sortDirection === "asc"
          ? (a.addedDaysAgo || 0) - (b.addedDaysAgo || 0)
          : (b.addedDaysAgo || 0) - (a.addedDaysAgo || 0)
      }
      if (sortField === "aiMatchScore") {
        return sortDirection === "asc"
          ? (b.aiMatchScore || 0) - (a.aiMatchScore || 0)
          : (a.aiMatchScore || 0) - (b.aiMatchScore || 0)
      }
      if (sortField === "experienceYears") {
        return sortDirection === "asc"
          ? (b.experienceYears || 0) - (a.experienceYears || 0)
          : (a.experienceYears || 0) - (b.experienceYears || 0)
      }
      if (sortField === "name") {
        return sortDirection === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name)
      }
      return 0
    })
  }, [filteredCandidates, sortField, sortDirection])

  // Paginated candidates
  const totalPages = Math.ceil(sortedCandidates.length / pageSize) || 1
  const paginatedCandidates = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    return sortedCandidates.slice(startIndex, startIndex + pageSize)
  }, [sortedCandidates, currentPage, pageSize])

  // Sorting handler
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"))
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  // Toggle Talent Pool Membership
  const toggleTalentPool = (candidateId) => {
    setCandidates((prev) =>
      prev.map((c) => {
        if (c.id === candidateId) {
          const nextVal = !c.inTalentPool
          showToast(
            nextVal
              ? `Added ${c.name} to Acme Technologies Talent Pool`
              : `Removed ${c.name} from Talent Pool`
          )
          return { ...c, inTalentPool: nextVal }
        }
        return c
      })
    )
    if (selectedCandidate && selectedCandidate.id === candidateId) {
      setSelectedCandidate((prev) => ({ ...prev, inTalentPool: !prev.inTalentPool }))
    }
    setActiveMenuId(null)
  }

  // Update Candidate Status
  const updateCandidateStatus = (candidateId, newStatus) => {
    setCandidates((prev) =>
      prev.map((c) => (c.id === candidateId ? { ...c, candidateStatus: newStatus } : c))
    )
    if (selectedCandidate && selectedCandidate.id === candidateId) {
      setSelectedCandidate((prev) => ({ ...prev, candidateStatus: newStatus }))
    }
    const cand = candidates.find((c) => c.id === candidateId)
    showToast(`Updated ${cand?.name || "Candidate"} to "${newStatus}" (Demo State)`)
    setActiveMenuId(null)
  }

  // Handle Add Candidate to Talent Pool
  const handleAddCandidateSubmit = (e) => {
    e.preventDefault()
    if (!newCandidateForm.name.trim() || !newCandidateForm.email.trim()) {
      showToast("Please provide candidate name and email")
      return
    }

    const newCand = {
      id: `cand-${Date.now().toString().slice(-4)}`,
      organizationId: "org-1",
      organizationName: "Acme Technologies",
      name: newCandidateForm.name,
      email: newCandidateForm.email,
      phone: "+91 98000 00000",
      avatar: newCandidateForm.name
        .split(" ")
        .map((p) => p[0])
        .join("")
        .toUpperCase()
        .slice(0, 2),
      avatarGradient: "from-primary to-orange-600",
      currentDesignation: newCandidateForm.designation || "Software Specialist",
      currentCompany: "Independent Talent Network",
      experienceYears: Number(newCandidateForm.experienceYears) || 3,
      experienceSummary: `Professional software background with expertise in ${newCandidateForm.primarySkill}.`,
      location: newCandidateForm.location,
      skills: [newCandidateForm.primarySkill, "JavaScript", "REST APIs"],
      primarySkill: newCandidateForm.primarySkill,
      aiMatchScore: 82,
      candidateStatus: "Under Review",
      inTalentPool: true,
      addedDate: "Just now",
      addedDaysAgo: 0,
      education: "Bachelor's Degree in Computer Science",
      resumeFileName: `${newCandidateForm.name.replace(/\s+/g, "_")}_Resume.pdf`,
      resumeFileSize: "1.0 MB",
      workHistory: [
        {
          role: newCandidateForm.designation || "Software Specialist",
          company: "Independent Talent Network",
          period: "2023 - Present",
          description: "Active contributor in modern software engineering practices.",
        },
      ],
      acmeApplications: [],
      timeline: [
        {
          step: "Added to Acme Talent Pool",
          date: "Just now",
          note: "Directly added by recruiter in workspace.",
        },
      ],
    }

    setCandidates((prev) => [newCand, ...prev])
    setIsAddModalOpen(false)
    setNewCandidateForm({
      name: "",
      email: "",
      designation: "",
      location: "Bangalore, India",
      experienceYears: "4",
      primarySkill: "React 19",
    })
    showToast(`Added ${newCand.name} to Acme Technologies talent pool!`)
  }

  const handleCopyEmail = (email) => {
    navigator.clipboard?.writeText(email)
    showToast(`Copied email to clipboard: ${email}`)
    setActiveMenuId(null)
  }

  return (
    <div
      className="space-y-6 animate-in fade-in-50 duration-200 select-none pb-8"
      ref={menuContainerRef}
    >
      {/* Toast Feedback Notification */}
      {toastMessage && (
        <div className="p-3.5 rounded-xl bg-secondary border border-primary/25 text-xs font-semibold text-foreground flex items-center justify-between shadow-soft-sm animate-in fade-in-50 duration-150 sticky top-2 z-40">
          <span className="flex items-center gap-2 min-w-0">
            <Sparkles className="w-4 h-4 text-primary shrink-0" />
            <span className="truncate">{toastMessage}</span>
          </span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-[11px] text-muted-foreground hover:text-foreground cursor-pointer font-bold px-2 shrink-0"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* 1. Header & Organization Identity */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/60 dark:border-white/10">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Candidate Directory
            </h1>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-semibold">
              <Building2 className="w-3.5 h-3.5" />
              <span>Acme Technologies</span>
            </div>
            <Badge
              variant="outline"
              className="text-xs font-medium px-2.5 py-0.5 bg-muted/60 text-muted-foreground border-border/70"
            >
              {candidates.length} Verified Profiles
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1.5 leading-relaxed">
            Manage verified candidate profiles, talent pools, and requisition relationships for Acme Technologies.
          </p>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <Button
            type="button"
            variant="default"
            size="sm"
            onClick={() => setIsAddModalOpen(true)}
            className="h-9 px-3.5 text-xs font-semibold rounded-xl shadow-soft-xs cursor-pointer flex items-center gap-1.5"
          >
            <UserPlus className="w-3.5 h-3.5 shrink-0" />
            <span>Add to Talent Pool</span>
          </Button>
        </div>
      </div>

      {/* 2. Summary Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Candidates */}
        <div
          onClick={() => setSelectedStatus("All Candidates")}
          className={cn(
            "p-4 rounded-2xl border transition-all duration-150 cursor-pointer text-left bg-card shadow-soft dark:shadow-[0_8px_20px_rgb(0,0,0,0.3)] hover:border-primary/40",
            selectedStatus === "All Candidates" ? "border-primary ring-1 ring-primary/30" : "border-border/80 dark:border-white/10"
          )}
        >
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold">Total Candidates</span>
            <Users className="w-4 h-4 text-primary" />
          </div>
          <div className="text-2xl font-extrabold text-foreground mt-2">
            {summaryCounts.total}
          </div>
          <p className="text-[11px] text-muted-foreground mt-0.5">Acme candidate network</p>
        </div>

        {/* Shortlisted */}
        <div
          onClick={() => setSelectedStatus("Shortlisted")}
          className={cn(
            "p-4 rounded-2xl border transition-all duration-150 cursor-pointer text-left bg-card shadow-soft dark:shadow-[0_8px_20px_rgb(0,0,0,0.3)] hover:border-sky-500/40",
            selectedStatus === "Shortlisted" ? "border-sky-500 ring-1 ring-sky-500/30" : "border-border/80 dark:border-white/10"
          )}
        >
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold">Shortlisted</span>
            <Sparkles className="w-4 h-4 text-sky-500" />
          </div>
          <div className="text-2xl font-extrabold text-foreground mt-2">
            {summaryCounts.shortlisted}
          </div>
          <p className="text-[11px] text-muted-foreground mt-0.5">Approved for team evaluation</p>
        </div>

        {/* Interviewing */}
        <div
          onClick={() => setSelectedStatus("Interviewing")}
          className={cn(
            "p-4 rounded-2xl border transition-all duration-150 cursor-pointer text-left bg-card shadow-soft dark:shadow-[0_8px_20px_rgb(0,0,0,0.3)] hover:border-violet-500/40",
            selectedStatus === "Interviewing" ? "border-violet-500 ring-1 ring-violet-500/30" : "border-border/80 dark:border-white/10"
          )}
        >
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold">Interviewing</span>
            <Calendar className="w-4 h-4 text-violet-500" />
          </div>
          <div className="text-2xl font-extrabold text-foreground mt-2">
            {summaryCounts.interviewing}
          </div>
          <p className="text-[11px] text-muted-foreground mt-0.5">In active evaluation rounds</p>
        </div>

        {/* Recently Added */}
        <div
          onClick={() => {
            handleResetFilters()
            setSortField("addedDaysAgo")
            setSortDirection("asc")
          }}
          className={cn(
            "p-4 rounded-2xl border transition-all duration-150 cursor-pointer text-left bg-card shadow-soft dark:shadow-[0_8px_20px_rgb(0,0,0,0.3)] hover:border-emerald-500/40",
            "border-border/80 dark:border-white/10"
          )}
        >
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold">Recently Added</span>
            <Clock className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-extrabold text-foreground mt-2">
            {summaryCounts.recentlyAdded}
          </div>
          <p className="text-[11px] text-muted-foreground mt-0.5">Added in last 7 days</p>
        </div>
      </div>

      {/* 3. Search and Combined Multi-Filters Bar */}
      <div className="rounded-2xl border border-border/80 dark:border-white/10 bg-card p-4 sm:p-5 shadow-soft dark:shadow-[0_8px_20px_rgb(0,0,0,0.3)] space-y-4">
        {/* Row 1: Search + Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <Input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search candidate, skill, or email..."
              className="pl-9 pr-8 h-9 text-xs rounded-xl bg-background border-border/80 focus-visible:ring-primary/40"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-muted-foreground hover:text-foreground cursor-pointer"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Skill Filter Dropdown */}
          <div className="relative">
            <select
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
              className="w-full h-9 pl-3 pr-8 text-xs font-medium bg-background border border-border/80 rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer appearance-none truncate"
            >
              {CANDIDATE_SKILLS.map((sk) => (
                <option key={sk} value={sk}>
                  {sk}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
          </div>

          {/* Experience Range Dropdown */}
          <div className="relative">
            <select
              value={selectedExpRange}
              onChange={(e) => setSelectedExpRange(e.target.value)}
              className="w-full h-9 pl-3 pr-8 text-xs font-medium bg-background border border-border/80 rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer appearance-none truncate"
            >
              {EXPERIENCE_RANGES.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
          </div>

          {/* Location Dropdown */}
          <div className="relative">
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full h-9 pl-3 pr-8 text-xs font-medium bg-background border border-border/80 rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer appearance-none truncate"
            >
              {CANDIDATE_LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
          </div>
        </div>

        {/* Row 2: Status Pills + Reset All */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-border/50">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none text-xs">
            <span className="text-[11px] font-semibold text-muted-foreground pr-1 shrink-0">
              Filter:
            </span>
            {CANDIDATE_STATUSES.map((status) => {
              const isSelected = selectedStatus === status
              return (
                <button
                  key={status}
                  type="button"
                  onClick={() => setSelectedStatus(status)}
                  className={cn(
                    "px-2.5 py-1 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer whitespace-nowrap shrink-0 border flex items-center gap-1",
                    isSelected
                      ? "bg-primary text-primary-foreground border-primary shadow-soft-xs font-semibold"
                      : "bg-background hover:bg-muted/70 text-muted-foreground hover:text-foreground border-border/70"
                  )}
                >
                  {status === "Talent Pool Only" && (
                    <Star className="w-3 h-3 fill-current shrink-0" />
                  )}
                  <span>{status}</span>
                </button>
              )
            })}
          </div>

          {/* Active filter count + Reset button */}
          {activeFiltersCount > 0 && (
            <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
              <span className="text-[11px] text-muted-foreground font-medium">
                {activeFiltersCount} active {activeFiltersCount === 1 ? "filter" : "filters"}
              </span>
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-xs font-semibold text-primary hover:underline cursor-pointer flex items-center gap-1"
              >
                <X className="w-3.5 h-3.5" />
                <span>Reset All</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 4. Candidate Directory Table vs Empty State */}
      {sortedCandidates.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border/80 bg-card/60 p-10 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto text-muted-foreground">
            <Users className="w-6 h-6" />
          </div>
          <div className="space-y-1 max-w-md mx-auto">
            <h4 className="text-base font-bold text-foreground">No candidates found</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              No candidate records match your combined filter criteria. Try adjusting the search query, skill, or status selections.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleResetFilters}
            className="text-xs rounded-xl"
          >
            Clear All Filters
          </Button>
        </div>
      ) : (
        <>
          {/* DESKTOP & TABLET: Professional Directory Table */}
          <div className="hidden md:block rounded-2xl border border-border/80 dark:border-white/10 bg-card shadow-soft dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse" role="table">
                <thead>
                  <tr className="border-b border-border/70 dark:border-white/10 bg-muted/40 dark:bg-white/5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground select-none">
                    {/* Candidate Name (Sortable) */}
                    <th
                      scope="col"
                      onClick={() => handleSort("name")}
                      className="py-3.5 px-4 font-semibold cursor-pointer hover:text-foreground transition-colors"
                    >
                      <div className="flex items-center gap-1.5">
                        <span>Candidate</span>
                        {sortField === "name" ? (
                          sortDirection === "asc" ? (
                            <ArrowUp className="w-3 h-3 text-primary" />
                          ) : (
                            <ArrowDown className="w-3 h-3 text-primary" />
                          )
                        ) : (
                          <ArrowUpDown className="w-3 h-3 text-muted-foreground/60" />
                        )}
                      </div>
                    </th>

                    <th scope="col" className="py-3.5 px-4 font-semibold">Designation & Exp</th>
                    <th scope="col" className="py-3.5 px-4 font-semibold">Primary Skills</th>
                    <th scope="col" className="py-3.5 px-4 font-semibold">Location</th>

                    {/* AI Match Score (Sortable) */}
                    <th
                      scope="col"
                      onClick={() => handleSort("aiMatchScore")}
                      className="py-3.5 px-4 font-semibold cursor-pointer hover:text-foreground transition-colors"
                    >
                      <div className="flex items-center gap-1.5">
                        <span>AI Match</span>
                        {sortField === "aiMatchScore" ? (
                          sortDirection === "asc" ? (
                            <ArrowDown className="w-3 h-3 text-primary" />
                          ) : (
                            <ArrowUp className="w-3 h-3 text-primary" />
                          )
                        ) : (
                          <ArrowUpDown className="w-3 h-3 text-muted-foreground/60" />
                        )}
                      </div>
                    </th>

                    <th scope="col" className="py-3.5 px-4 font-semibold">Status / Pool</th>
                    <th scope="col" className="py-3.5 px-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 dark:divide-white/5">
                  {paginatedCandidates.map((cand) => (
                    <tr
                      key={cand.id}
                      className="hover:bg-muted/30 dark:hover:bg-white/5 transition-colors group"
                    >
                      {/* Column 1: Candidate */}
                      <td className="py-3.5 px-4 align-middle">
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              "w-9 h-9 rounded-full bg-gradient-to-br flex items-center justify-center text-white font-bold text-xs shadow-soft-xs shrink-0 select-none",
                              cand.avatarGradient || "from-[#F47758] to-[#D94F2D]"
                            )}
                          >
                            {cand.avatar}
                          </div>
                          <div className="min-w-0">
                            <button
                              type="button"
                              onClick={() => setSelectedCandidate(cand)}
                              className="font-bold text-foreground group-hover:text-primary transition-colors cursor-pointer truncate text-left block text-sm"
                            >
                              {cand.name}
                            </button>
                            <span className="text-[11px] text-muted-foreground truncate block">
                              {cand.email}
                            </span>
                            <span className="text-[10px] text-muted-foreground/80 truncate block pt-0.5">
                              {cand.currentCompany}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Column 2: Designation & Exp */}
                      <td className="py-3.5 px-4 align-middle">
                        <div className="space-y-0.5 min-w-0">
                          <span className="font-semibold text-foreground text-xs block truncate">
                            {cand.currentDesignation}
                          </span>
                          <span className="text-[11px] text-muted-foreground font-medium block">
                            {cand.experienceYears} Years Exp
                          </span>
                        </div>
                      </td>

                      {/* Column 3: Skills Badges */}
                      <td className="py-3.5 px-4 align-middle">
                        <div className="flex items-center gap-1.5 flex-wrap max-w-xs">
                          {cand.skills.slice(0, 2).map((sk) => (
                            <span
                              key={sk}
                              className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-muted/60 dark:bg-white/5 text-foreground border border-border/60"
                            >
                              {sk}
                            </span>
                          ))}
                          {cand.skills.length > 2 && (
                            <span className="text-[10px] text-muted-foreground font-medium">
                              +{cand.skills.length - 2}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Column 4: Location */}
                      <td className="py-3.5 px-4 align-middle">
                        <div className="flex items-center gap-1 text-muted-foreground text-xs">
                          <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                          <span className="truncate">{cand.location}</span>
                        </div>
                      </td>

                      {/* Column 5: AI Match */}
                      <td className="py-3.5 px-4 align-middle">
                        {cand.aiMatchScore ? (
                          <AiMatchBadge score={cand.aiMatchScore} />
                        ) : (
                          <span className="text-[11px] text-muted-foreground">General Pool</span>
                        )}
                      </td>

                      {/* Column 6: Status & Pool Star */}
                      <td className="py-3.5 px-4 align-middle">
                        <div className="flex items-center gap-2">
                          <ApplicationStatusBadge status={cand.candidateStatus} />
                          <button
                            type="button"
                            onClick={() => toggleTalentPool(cand.id)}
                            className="p-1 rounded-md text-muted-foreground hover:text-amber-500 transition-colors cursor-pointer"
                            title={cand.inTalentPool ? "In Acme Talent Pool" : "Add to Talent Pool"}
                          >
                            <Star
                              className={cn(
                                "w-4 h-4",
                                cand.inTalentPool
                                  ? "fill-amber-400 text-amber-500"
                                  : "text-muted-foreground/40 hover:text-amber-400"
                              )}
                            />
                          </button>
                        </div>
                      </td>

                      {/* Column 7: Actions */}
                      <td className="py-3.5 px-4 align-middle text-right">
                        <div className="relative inline-block text-left">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedCandidate(cand)}
                              className="h-8 px-2 text-xs font-semibold text-muted-foreground hover:text-foreground cursor-pointer"
                              title="View full candidate profile"
                            >
                              <Eye className="w-3.5 h-3.5 mr-1" />
                              <span>View</span>
                            </Button>

                            <button
                              type="button"
                              onClick={() =>
                                setActiveMenuId(activeMenuId === cand.id ? null : cand.id)
                              }
                              aria-label={`Actions for ${cand.name}`}
                              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors cursor-pointer"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Desktop Actions Dropdown */}
                          {activeMenuId === cand.id && (
                            <div
                              role="menu"
                              className="absolute right-0 top-full mt-1.5 w-52 bg-popover text-popover-foreground rounded-xl border border-border/90 shadow-soft-lg p-1.5 z-40 animate-in fade-in-50 zoom-in-95 duration-150"
                            >
                              <button
                                type="button"
                                onClick={() => {
                                  setActiveMenuId(null)
                                  setSelectedCandidate(cand)
                                }}
                                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-foreground hover:bg-muted/70 transition-colors cursor-pointer"
                              >
                                <Eye className="w-3.5 h-3.5 text-muted-foreground" />
                                <span>View Full Profile</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => toggleTalentPool(cand.id)}
                                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-foreground hover:bg-muted/70 transition-colors cursor-pointer"
                              >
                                <Star
                                  className={cn(
                                    "w-3.5 h-3.5",
                                    cand.inTalentPool
                                      ? "fill-amber-400 text-amber-500"
                                      : "text-muted-foreground"
                                  )}
                                />
                                <span>
                                  {cand.inTalentPool ? "Remove from Pool" : "Add to Talent Pool"}
                                </span>
                              </button>

                              <button
                                type="button"
                                onClick={() => updateCandidateStatus(cand.id, "Shortlisted")}
                                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-foreground hover:bg-muted/70 transition-colors cursor-pointer"
                              >
                                <Sparkles className="w-3.5 h-3.5 text-sky-500" />
                                <span>Shortlist Candidate</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => updateCandidateStatus(cand.id, "Interviewing")}
                                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-foreground hover:bg-muted/70 transition-colors cursor-pointer"
                              >
                                <Calendar className="w-3.5 h-3.5 text-violet-500" />
                                <span>Move to Interviewing</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleCopyEmail(cand.email)}
                                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-foreground hover:bg-muted/70 transition-colors cursor-pointer"
                              >
                                <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                                <span>Copy Email Address</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* MOBILE: Clean Card Presentation (Zero Horizontal Overflow) */}
          <div className="block md:hidden space-y-3">
            {paginatedCandidates.map((cand) => (
              <div
                key={cand.id}
                className="rounded-2xl border border-border/80 dark:border-white/10 bg-card p-4 shadow-soft dark:shadow-[0_8px_20px_rgb(0,0,0,0.3)] space-y-3"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-2.5">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={cn(
                        "w-9 h-9 rounded-full bg-gradient-to-br flex items-center justify-center text-white font-bold text-xs shrink-0 select-none",
                        cand.avatarGradient || "from-[#F47758] to-[#D94F2D]"
                      )}
                    >
                      {cand.avatar}
                    </div>
                    <div className="min-w-0">
                      <h4
                        onClick={() => setSelectedCandidate(cand)}
                        className="font-bold text-foreground text-sm truncate hover:text-primary transition-colors cursor-pointer"
                      >
                        {cand.name}
                      </h4>
                      <p className="text-[11px] text-muted-foreground truncate">{cand.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <ApplicationStatusBadge status={cand.candidateStatus} />
                    <button
                      type="button"
                      onClick={() => toggleTalentPool(cand.id)}
                      className="p-1 rounded-md text-muted-foreground hover:text-amber-500 cursor-pointer"
                    >
                      <Star
                        className={cn(
                          "w-4 h-4",
                          cand.inTalentPool
                            ? "fill-amber-400 text-amber-500"
                            : "text-muted-foreground/40"
                        )}
                      />
                    </button>
                  </div>
                </div>

                {/* Role and Experience */}
                <div className="p-2.5 rounded-xl bg-muted/40 dark:bg-white/5 space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-muted-foreground">Designation:</span>
                    <span className="font-semibold text-foreground truncate max-w-[200px]">
                      {cand.currentDesignation}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-muted-foreground">Experience & Location:</span>
                    <span className="text-muted-foreground font-medium">
                      {cand.experienceYears} yrs • {cand.location}
                    </span>
                  </div>
                </div>

                {/* Skills tags */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  {cand.skills.slice(0, 3).map((sk) => (
                    <span
                      key={sk}
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-muted/60 text-foreground border border-border/60"
                    >
                      {sk}
                    </span>
                  ))}
                  {cand.skills.length > 3 && (
                    <span className="text-[10px] text-muted-foreground font-medium">
                      +{cand.skills.length - 3}
                    </span>
                  )}
                </div>

                {/* Match Score & Actions Footer */}
                <div className="flex items-center justify-between pt-2 border-t border-border/60">
                  <div className="flex items-center gap-1.5">
                    {cand.aiMatchScore && (
                      <AiMatchBadge score={cand.aiMatchScore} showProgress={false} />
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedCandidate(cand)}
                      className="text-xs font-semibold rounded-xl h-8 px-3"
                    >
                      <Eye className="w-3.5 h-3.5 mr-1" />
                      <span>Profile</span>
                    </Button>

                    <Button
                      type="button"
                      variant="default"
                      size="sm"
                      onClick={() => updateCandidateStatus(cand.id, "Shortlisted")}
                      className="text-xs font-semibold rounded-xl h-8 px-3"
                    >
                      <Sparkles className="w-3.5 h-3.5 mr-1" />
                      <span>Shortlist</span>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 5. Pagination */}
          <div className="rounded-2xl border border-border/80 dark:border-white/10 bg-card p-3.5 sm:p-4 shadow-soft dark:shadow-[0_8px_20px_rgb(0,0,0,0.3)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <span className="text-muted-foreground font-medium">
                Showing{" "}
                <strong className="text-foreground">
                  {Math.min((currentPage - 1) * pageSize + 1, sortedCandidates.length)}
                </strong>{" "}
                to{" "}
                <strong className="text-foreground">
                  {Math.min(currentPage * pageSize, sortedCandidates.length)}
                </strong>{" "}
                of <strong className="text-foreground">{sortedCandidates.length}</strong> candidates
              </span>

              <div className="flex items-center gap-1.5 pl-2 border-l border-border/60">
                <span className="text-muted-foreground text-[11px]">Per page:</span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value))
                    setCurrentPage(1)
                  }}
                  className="h-7 px-2 text-xs bg-background border border-border/80 rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                >
                  <option value={5}>5</option>
                  <option value={6}>6</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-1.5 self-end sm:self-auto">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="h-8 px-2.5 text-xs font-semibold rounded-lg disabled:opacity-40"
              >
                <ChevronLeft className="w-3.5 h-3.5 mr-1" />
                <span>Prev</span>
              </Button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }).map((_, index) => {
                  const pageNumber = index + 1
                  const isCurrent = currentPage === pageNumber
                  return (
                    <button
                      key={pageNumber}
                      type="button"
                      onClick={() => setCurrentPage(pageNumber)}
                      className={cn(
                        "w-8 h-8 rounded-lg text-xs font-bold transition-all duration-150 cursor-pointer",
                        isCurrent
                          ? "bg-primary text-primary-foreground shadow-soft-xs"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/70"
                      )}
                    >
                      {pageNumber}
                    </button>
                  )
                })}
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="h-8 px-2.5 text-xs font-semibold rounded-lg disabled:opacity-40"
              >
                <span>Next</span>
                <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </div>
          </div>
        </>
      )}

      {/* 6. Candidate Profile Detail Drawer/Modal */}
      {selectedCandidate && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label={`Candidate Profile for ${selectedCandidate.name}`}
        >
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-200"
            onClick={() => setSelectedCandidate(null)}
            aria-hidden="true"
          />

          <div className="relative w-full max-w-2xl bg-card border border-border/90 dark:border-white/10 shadow-2xl rounded-2xl z-50 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 fade-in-50 duration-150">
            {/* Drawer Header */}
            <div className="flex items-start justify-between p-5 border-b border-border/70 dark:border-white/10">
              <div className="flex items-center gap-3.5 min-w-0 pr-3">
                <div
                  className={cn(
                    "w-14 h-14 rounded-full bg-gradient-to-br flex items-center justify-center text-white font-bold text-lg shadow-soft-xs shrink-0 select-none",
                    selectedCandidate.avatarGradient || "from-[#F47758] to-[#D94F2D]"
                  )}
                >
                  {selectedCandidate.avatar}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-xl font-extrabold text-foreground tracking-tight truncate">
                      {selectedCandidate.name}
                    </h3>
                    <ApplicationStatusBadge status={selectedCandidate.candidateStatus} />
                    {selectedCandidate.inTalentPool && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
                        <Star className="w-3 h-3 fill-current" />
                        <span>Talent Pool</span>
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground truncate mt-0.5">
                    {selectedCandidate.currentDesignation} • {selectedCandidate.currentCompany}
                  </p>
                  <p className="text-[11px] text-muted-foreground truncate">
                    {selectedCandidate.email} • {selectedCandidate.phone} • {selectedCandidate.location}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedCandidate(null)}
                aria-label="Close profile"
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors cursor-pointer shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body (Scrollable) */}
            <div className="p-5 space-y-5 overflow-y-auto text-xs">
              {/* Tenant Context Banner */}
              <div className="p-3 rounded-xl bg-primary/5 border border-primary/20 flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-primary shrink-0" />
                  <span>
                    Authorized Talent Record for <strong className="text-foreground">{selectedCandidate.organizationName}</strong>
                  </span>
                </span>
                <span className="text-[11px] font-semibold text-primary">
                  {selectedCandidate.experienceYears} Years Verified Exp
                </span>
              </div>

              {/* Bio / Summary */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Professional Summary
                </h4>
                <p className="text-xs text-foreground leading-relaxed p-3.5 rounded-xl bg-muted/40 dark:bg-white/5 border border-border/60">
                  {selectedCandidate.experienceSummary}
                </p>
              </div>

              {/* Skills */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Primary & Secondary Competencies
                </h4>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {selectedCandidate.skills.map((sk) => (
                    <span
                      key={sk}
                      className="px-2.5 py-1 rounded-lg text-xs font-medium bg-card border border-border/80 text-foreground shadow-soft-xs"
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              {/* Work History */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Work Experience History
                </h4>
                <div className="space-y-2">
                  {selectedCandidate.workHistory?.map((wh, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-muted/30 border border-border/60 space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-foreground text-xs">
                          {wh.role} • {wh.company}
                        </span>
                        <span className="text-[11px] text-muted-foreground">{wh.period}</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground leading-relaxed">
                        {wh.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Education & Resume */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-card border border-border/80 space-y-1">
                  <div className="flex items-center gap-1.5 text-muted-foreground font-semibold text-xs">
                    <GraduationCap className="w-4 h-4 text-primary" />
                    <span>Education Credentials</span>
                  </div>
                  <p className="text-xs text-foreground font-medium pt-1">
                    {selectedCandidate.education}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-card border border-border/80 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-muted-foreground font-semibold text-xs">
                      <FileText className="w-4 h-4 text-primary" />
                      <span>Demonstration Resume</span>
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {selectedCandidate.resumeFileSize}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs font-medium text-foreground truncate max-w-[170px]">
                      {selectedCandidate.resumeFileName}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        showToast(`Resume preview simulated for ${selectedCandidate.name}`)
                      }
                      className="text-xs font-semibold text-primary hover:underline cursor-pointer flex items-center gap-1"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>PDF</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Applications to Acme Technologies */}
              {selectedCandidate.acmeApplications?.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Applications to Acme Technologies
                  </h4>
                  <div className="space-y-2">
                    {selectedCandidate.acmeApplications.map((app) => (
                      <div
                        key={app.id}
                        className="p-3.5 rounded-xl bg-muted/40 dark:bg-white/5 border border-border/60 flex items-center justify-between gap-3"
                      >
                        <div className="space-y-0.5">
                          <span className="font-bold text-foreground text-xs block">
                            {app.jobTitle}
                          </span>
                          <span className="text-[11px] text-muted-foreground block">
                            {app.department} • Applied {app.appliedDate}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <AiMatchBadge score={app.aiMatchScore} />
                          <ApplicationStatusBadge status={app.status} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Application Timeline */}
              {selectedCandidate.timeline?.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Recruitment Interaction Timeline
                  </h4>
                  <div className="space-y-2 border-l-2 border-primary/30 pl-3.5 ml-1.5 py-1">
                    {selectedCandidate.timeline.map((step, idx) => (
                      <div key={idx} className="space-y-0.5 relative">
                        <div className="w-2 h-2 rounded-full bg-primary absolute -left-[20px] top-1.5" />
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-foreground text-xs">{step.step}</span>
                          <span className="text-[10px] text-muted-foreground">{step.date}</span>
                        </div>
                        <p className="text-[11px] text-muted-foreground">{step.note}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Demonstration Disclaimer */}
              <div className="p-3 rounded-xl bg-muted/30 border border-border/60 text-[11px] text-muted-foreground leading-relaxed">
                Demonstration candidate record for <strong className="text-foreground">Acme Technologies</strong>. In production, candidate profiles respect multi-tenant privacy boundaries and recruiter access is verified via backend authorization.
              </div>
            </div>

            {/* Drawer Footer Actions */}
            <div className="p-4 bg-muted/30 dark:bg-white/5 border-t border-border/70 flex items-center justify-between gap-2.5">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setSelectedCandidate(null)}
                className="text-xs font-semibold rounded-xl"
              >
                Close Profile
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => toggleTalentPool(selectedCandidate.id)}
                  className="text-xs font-semibold rounded-xl"
                >
                  <Star
                    className={cn(
                      "w-3.5 h-3.5 mr-1.5",
                      selectedCandidate.inTalentPool
                        ? "fill-amber-400 text-amber-500"
                        : "text-muted-foreground"
                    )}
                  />
                  <span>{selectedCandidate.inTalentPool ? "In Pool" : "Add to Pool"}</span>
                </Button>

                <Button
                  type="button"
                  variant="default"
                  size="sm"
                  onClick={() => {
                    updateCandidateStatus(selectedCandidate.id, "Shortlisted")
                  }}
                  className="text-xs font-semibold rounded-xl"
                >
                  <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                  <span>Shortlist</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 7. Add to Talent Pool Modal Dialog */}
      {isAddModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Add Candidate to Talent Pool"
        >
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-200"
            onClick={() => setIsAddModalOpen(false)}
            aria-hidden="true"
          />
          <div className="relative w-full max-w-md bg-card border border-border/90 dark:border-white/10 shadow-2xl rounded-2xl z-50 p-6 space-y-4 animate-in zoom-in-95 fade-in-50 duration-150">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-base font-extrabold text-foreground">
                  Add to Talent Pool
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Save a new prospective candidate directly to Acme Technologies.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddCandidateSubmit} className="space-y-3 text-xs">
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
                  Full Name *
                </label>
                <Input
                  type="text"
                  required
                  placeholder="e.g. Shalini Roy"
                  value={newCandidateForm.name}
                  onChange={(e) =>
                    setNewCandidateForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="h-9 text-xs rounded-xl"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
                  Email Address *
                </label>
                <Input
                  type="email"
                  required
                  placeholder="e.g. shalini.roy@example.com"
                  value={newCandidateForm.email}
                  onChange={(e) =>
                    setNewCandidateForm((prev) => ({ ...prev, email: e.target.value }))
                  }
                  className="h-9 text-xs rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
                    Current Designation
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g. Senior Frontend"
                    value={newCandidateForm.designation}
                    onChange={(e) =>
                      setNewCandidateForm((prev) => ({ ...prev, designation: e.target.value }))
                    }
                    className="h-9 text-xs rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
                    Experience (Years)
                  </label>
                  <Input
                    type="number"
                    min="0"
                    max="30"
                    value={newCandidateForm.experienceYears}
                    onChange={(e) =>
                      setNewCandidateForm((prev) => ({ ...prev, experienceYears: e.target.value }))
                    }
                    className="h-9 text-xs rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
                    Location
                  </label>
                  <select
                    value={newCandidateForm.location}
                    onChange={(e) =>
                      setNewCandidateForm((prev) => ({ ...prev, location: e.target.value }))
                    }
                    className="w-full h-9 px-2 text-xs font-medium bg-background border border-border/80 rounded-xl text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                  >
                    {CANDIDATE_LOCATIONS.filter((l) => l !== "All Locations").map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
                    Primary Skill
                  </label>
                  <select
                    value={newCandidateForm.primarySkill}
                    onChange={(e) =>
                      setNewCandidateForm((prev) => ({ ...prev, primarySkill: e.target.value }))
                    }
                    className="w-full h-9 px-2 text-xs font-medium bg-background border border-border/80 rounded-xl text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                  >
                    {CANDIDATE_SKILLS.filter((s) => s !== "All Skills").map((sk) => (
                      <option key={sk} value={sk}>
                        {sk}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-muted/40 border border-border/60 text-[11px] text-muted-foreground">
                This adds the candidate to Acme Technologies talent directory in local demonstration state.
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAddModalOpen(false)}
                  className="text-xs rounded-xl"
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  variant="default"
                  size="sm"
                  className="text-xs font-semibold rounded-xl"
                >
                  <UserPlus className="w-3.5 h-3.5 mr-1.5" />
                  <span>Save Candidate</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

