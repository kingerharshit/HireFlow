import * as React from "react"
import { useState, useMemo, useRef, useEffect } from "react"
import { Link } from "react-router-dom"
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
  FileText,
  SlidersHorizontal,
  ChevronDown,
  Copy,
  Plus,
} from "lucide-react"
import { ApplicationStatusBadge } from "@/components/dashboard/ApplicationStatusBadge"
import { AiMatchBadge } from "@/components/dashboard/AiMatchBadge"
import {
  DEMO_APPLICATIONS,
  APPLICATION_STATUSES,
  APPLICATION_JOBS,
  DATE_RANGE_OPTIONS,
  AI_SCORE_OPTIONS,
} from "@/features/applications/demoApplicationsData"
import { useInterviews } from "@/context/InterviewsContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export function ApplicationsPage() {
  const { scheduleInterview } = useInterviews()

  // Primary application dataset in local component state to support live demonstration interactions
  const [applications, setApplications] = useState(DEMO_APPLICATIONS)

  // Filters State
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("All")
  const [selectedJob, setSelectedJob] = useState("All Jobs")
  const [selectedDateRange, setSelectedDateRange] = useState("all")
  const [selectedScoreRange, setSelectedScoreRange] = useState("all")

  // Sorting State
  const [sortField, setSortField] = useState("daysAgo") // 'daysAgo' | 'aiMatchScore' | 'candidateName'
  const [sortDirection, setSortDirection] = useState("asc") // 'asc' | 'desc'

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(6)

  // Interactive UI State
  const [activeMenuId, setActiveMenuId] = useState(null)
  const [selectedCandidate, setSelectedCandidate] = useState(null)
  const [candidateToReject, setCandidateToReject] = useState(null)
  const [candidateToInterview, setCandidateToInterview] = useState(null)
  const [interviewForm, setInterviewForm] = useState({
    type: "Technical Architecture Review",
    date: "2026-11-03",
    time: "15:00",
    notes: "Panel discussion with senior platform engineers",
  })
  const [toastMessage, setToastMessage] = useState(null)

  const menuContainerRef = useRef(null)

  // Close actions dropdown menu on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuContainerRef.current && !menuContainerRef.current.contains(e.target)) {
        setActiveMenuId(null)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Reset to page 1 whenever search or filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, selectedStatus, selectedJob, selectedDateRange, selectedScoreRange])

  // Toast feedback helper
  const showToast = (message) => {
    setToastMessage(message)
    setTimeout(() => {
      setToastMessage((prev) => (prev === message ? null : prev))
    }, 4500)
  }

  // Count active filters (for reset indicator)
  const activeFiltersCount = useMemo(() => {
    let count = 0
    if (searchTerm.trim()) count++
    if (selectedStatus !== "All") count++
    if (selectedJob !== "All Jobs") count++
    if (selectedDateRange !== "all") count++
    if (selectedScoreRange !== "all") count++
    return count
  }, [searchTerm, selectedStatus, selectedJob, selectedDateRange, selectedScoreRange])

  // Reset all filters
  const handleResetFilters = () => {
    setSearchTerm("")
    setSelectedStatus("All")
    setSelectedJob("All Jobs")
    setSelectedDateRange("all")
    setSelectedScoreRange("all")
    showToast("Filters reset to default view")
  }

  // Dynamic status summary counts calculated directly from current application dataset
  const statusCounts = useMemo(() => {
    return {
      total: applications.length,
      underReview: applications.filter((a) => a.status === "Under Review").length,
      pipeline: applications.filter((a) => a.status === "Shortlisted" || a.status === "Interview")
        .length,
      offered: applications.filter((a) => a.status === "Offered").length,
      hired: applications.filter((a) => a.status === "Hired").length,
      rejected: applications.filter((a) => a.status === "Rejected").length,
    }
  }, [applications])

  // Filtered applications
  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      // 1. Search text filter
      const matchesSearch =
        searchTerm.trim() === "" ||
        app.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.candidateEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.jobTitle.toLowerCase().includes(searchTerm.toLowerCase())

      // 2. Status filter
      const matchesStatus =
        selectedStatus === "All" || app.status.toLowerCase() === selectedStatus.toLowerCase()

      // 3. Job title filter
      const matchesJob = selectedJob === "All Jobs" || app.jobTitle === selectedJob

      // 4. Date range filter (using daysAgo)
      let matchesDate = true
      if (selectedDateRange !== "all") {
        const maxDays = parseInt(selectedDateRange, 10)
        matchesDate = (app.daysAgo || 0) <= maxDays
      }

      // 5. AI score range filter
      let matchesScore = true
      if (selectedScoreRange !== "all") {
        const minScore = parseInt(selectedScoreRange, 10)
        matchesScore = app.aiMatchScore >= minScore
      }

      return matchesSearch && matchesStatus && matchesJob && matchesDate && matchesScore
    })
  }, [applications, searchTerm, selectedStatus, selectedJob, selectedDateRange, selectedScoreRange])

  // Sorted applications
  const sortedApplications = useMemo(() => {
    return [...filteredApplications].sort((a, b) => {
      if (sortField === "daysAgo") {
        // daysAgo: smaller is more recent
        return sortDirection === "asc" ? a.daysAgo - b.daysAgo : b.daysAgo - a.daysAgo
      }
      if (sortField === "aiMatchScore") {
        return sortDirection === "asc"
          ? b.aiMatchScore - a.aiMatchScore
          : a.aiMatchScore - b.aiMatchScore
      }
      if (sortField === "candidateName") {
        return sortDirection === "asc"
          ? a.candidateName.localeCompare(b.candidateName)
          : b.candidateName.localeCompare(a.candidateName)
      }
      return 0
    })
  }, [filteredApplications, sortField, sortDirection])

  // Paginated applications
  const totalPages = Math.ceil(sortedApplications.length / pageSize) || 1
  const paginatedApplications = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    return sortedApplications.slice(startIndex, startIndex + pageSize)
  }, [sortedApplications, currentPage, pageSize])

  // Sorting toggle handler
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"))
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  // Frontend State Update: Status Change
  const updateCandidateStatus = (candidateId, newStatus) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === candidateId ? { ...app, status: newStatus } : app))
    )
    if (selectedCandidate && selectedCandidate.id === candidateId) {
      setSelectedCandidate((prev) => ({ ...prev, status: newStatus }))
    }
    const candidate = applications.find((a) => a.id === candidateId)
    showToast(
      `Updated ${candidate?.candidateName || "Candidate"} to "${newStatus}" (Demo State)`
    )
    setActiveMenuId(null)
  }

  // Destructive Action: Confirm Rejection
  const handleConfirmRejection = () => {
    if (candidateToReject) {
      updateCandidateStatus(candidateToReject.id, "Rejected")
      showToast(`${candidateToReject.candidateName} marked as Rejected`)
      setCandidateToReject(null)
    }
  }

  // Interview Action: Confirm Schedule
  const handleConfirmInterview = () => {
    if (candidateToInterview) {
      updateCandidateStatus(candidateToInterview.id, "Interview")
      if (scheduleInterview) {
        const startH = interviewForm.time.split(":")[0] || "10"
        const startM = interviewForm.time.split(":")[1] || "00"
        const endH = String(Math.min(23, Number(startH) + 1)).padStart(2, "0")
        scheduleInterview({
          applicationId: candidateToInterview.id,
          candidateId: candidateToInterview.candidateId,
          candidateName: candidateToInterview.candidateName,
          candidateEmail: candidateToInterview.candidateEmail,
          candidateLocation: candidateToInterview.candidateLocation,
          candidateAvatar: candidateToInterview.candidateAvatar,
          candidateAvatarGradient: candidateToInterview.candidateAvatarGradient,
          jobId: candidateToInterview.jobId,
          jobTitle: candidateToInterview.jobTitle,
          jobDepartment: candidateToInterview.jobDepartment,
          round: interviewForm.type || "Technical Architecture Review",
          interviewType: "Online",
          date: interviewForm.date,
          startTime: interviewForm.time,
          endTime: `${endH}:${startM}`,
          interviewerName: "Priya Sharma",
          notes: interviewForm.notes,
        })
      }
      showToast(
        `Interview scheduled for ${candidateToInterview.candidateName} on ${interviewForm.date} at ${interviewForm.time}`
      )
      setCandidateToInterview(null)
    }
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

      {/* 1. Page Header & Organization Tenant Context */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/60 dark:border-white/10">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Applications
            </h1>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-semibold">
              <Building2 className="w-3.5 h-3.5" />
              <span>Acme Technologies</span>
            </div>
            <Badge
              variant="outline"
              className="text-xs font-medium px-2.5 py-0.5 bg-muted/60 text-muted-foreground border-border/70"
            >
              {applications.length} Total Candidates
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1.5 leading-relaxed">
            Review and manage candidates applying to your organization's jobs.
          </p>
        </div>

        {/* Header Quick Actions */}
        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => showToast("Exporting Acme Technologies candidate dataset (CSV demo)...")}
            className="h-9 px-3 text-xs font-semibold rounded-xl"
          >
            <Download className="w-3.5 h-3.5 mr-1.5" />
            <span>Export CSV</span>
          </Button>

          <Button
            type="button"
            variant="default"
            size="sm"
            onClick={() => {
              setApplications(DEMO_APPLICATIONS)
              showToast("Applications dataset refreshed from Acme Technologies central source")
            }}
            className="h-9 px-3 text-xs font-semibold rounded-xl shadow-soft-xs"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
            <span>Refresh</span>
          </Button>
        </div>
      </div>

      {/* 2. Status Summary Cards (Interactive quick-filter pills) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {/* Card 1: Total */}
        <div
          onClick={() => setSelectedStatus("All")}
          className={cn(
            "p-4 rounded-2xl border transition-all duration-150 cursor-pointer text-left bg-card shadow-soft dark:shadow-[0_8px_20px_rgb(0,0,0,0.3)] hover:border-primary/40",
            selectedStatus === "All" ? "border-primary ring-1 ring-primary/30" : "border-border/80 dark:border-white/10"
          )}
        >
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold">All Applications</span>
            <Users className="w-4 h-4 text-primary" />
          </div>
          <div className="text-2xl font-extrabold text-foreground mt-2">
            {statusCounts.total}
          </div>
          <p className="text-[11px] text-muted-foreground mt-0.5">Across all open roles</p>
        </div>

        {/* Card 2: Under Review */}
        <div
          onClick={() => setSelectedStatus("Under Review")}
          className={cn(
            "p-4 rounded-2xl border transition-all duration-150 cursor-pointer text-left bg-card shadow-soft dark:shadow-[0_8px_20px_rgb(0,0,0,0.3)] hover:border-amber-500/40",
            selectedStatus === "Under Review" ? "border-amber-500 ring-1 ring-amber-500/30" : "border-border/80 dark:border-white/10"
          )}
        >
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold">Under Review</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-extrabold text-foreground mt-2">
            {statusCounts.underReview}
          </div>
          <p className="text-[11px] text-muted-foreground mt-0.5">Awaiting initial review</p>
        </div>

        {/* Card 3: In Pipeline (Interview / Shortlist) */}
        <div
          onClick={() => setSelectedStatus("Interview")}
          className={cn(
            "p-4 rounded-2xl border transition-all duration-150 cursor-pointer text-left bg-card shadow-soft dark:shadow-[0_8px_20px_rgb(0,0,0,0.3)] hover:border-violet-500/40",
            selectedStatus === "Interview" ? "border-violet-500 ring-1 ring-violet-500/30" : "border-border/80 dark:border-white/10"
          )}
        >
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold">In Interviews</span>
            <Sparkles className="w-4 h-4 text-violet-500" />
          </div>
          <div className="text-2xl font-extrabold text-foreground mt-2">
            {statusCounts.pipeline}
          </div>
          <p className="text-[11px] text-muted-foreground mt-0.5">Shortlisted or active rounds</p>
        </div>

        {/* Card 4: Offered */}
        <div
          onClick={() => setSelectedStatus("Offered")}
          className={cn(
            "p-4 rounded-2xl border transition-all duration-150 cursor-pointer text-left bg-card shadow-soft dark:shadow-[0_8px_20px_rgb(0,0,0,0.3)] hover:border-primary/40",
            selectedStatus === "Offered" ? "border-primary ring-1 ring-primary/30" : "border-border/80 dark:border-white/10"
          )}
        >
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold">Offers Extended</span>
            <CheckCircle2 className="w-4 h-4 text-primary" />
          </div>
          <div className="text-2xl font-extrabold text-foreground mt-2">
            {statusCounts.offered}
          </div>
          <p className="text-[11px] text-muted-foreground mt-0.5">Pending candidate acceptance</p>
        </div>

        {/* Card 5: Hired */}
        <div
          onClick={() => setSelectedStatus("Hired")}
          className={cn(
            "p-4 rounded-2xl border transition-all duration-150 cursor-pointer text-left bg-card shadow-soft dark:shadow-[0_8px_20px_rgb(0,0,0,0.3)] hover:border-emerald-500/40 col-span-2 sm:col-span-1",
            selectedStatus === "Hired" ? "border-emerald-500 ring-1 ring-emerald-500/30" : "border-border/80 dark:border-white/10"
          )}
        >
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold">Hired Candidates</span>
            <UserCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-extrabold text-foreground mt-2">
            {statusCounts.hired}
          </div>
          <p className="text-[11px] text-muted-foreground mt-0.5">Successfully joined Acme</p>
        </div>
      </div>

      {/* 3. Comprehensive Filters & Search Toolbar */}
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
              placeholder="Search candidate, role, or email..."
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

          {/* Job Filter Dropdown */}
          <div className="relative">
            <select
              value={selectedJob}
              onChange={(e) => setSelectedJob(e.target.value)}
              className="w-full h-9 pl-3 pr-8 text-xs font-medium bg-background border border-border/80 rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer appearance-none truncate"
            >
              {APPLICATION_JOBS.map((job) => (
                <option key={job} value={job}>
                  {job}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
          </div>

          {/* Date Range Dropdown */}
          <div className="relative">
            <select
              value={selectedDateRange}
              onChange={(e) => setSelectedDateRange(e.target.value)}
              className="w-full h-9 pl-3 pr-8 text-xs font-medium bg-background border border-border/80 rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer appearance-none truncate"
            >
              {DATE_RANGE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
          </div>

          {/* AI Match Score Range Dropdown */}
          <div className="relative">
            <select
              value={selectedScoreRange}
              onChange={(e) => setSelectedScoreRange(e.target.value)}
              className="w-full h-9 pl-3 pr-8 text-xs font-medium bg-background border border-border/80 rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer appearance-none truncate"
            >
              {AI_SCORE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
          </div>
        </div>

        {/* Row 2: Status Pills + Reset All Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-border/50">
          {/* Status Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none text-xs">
            <span className="text-[11px] font-semibold text-muted-foreground pr-1 shrink-0">
              Status:
            </span>
            {APPLICATION_STATUSES.map((status) => {
              const isSelected = selectedStatus === status
              return (
                <button
                  key={status}
                  type="button"
                  onClick={() => setSelectedStatus(status)}
                  className={cn(
                    "px-2.5 py-1 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer whitespace-nowrap shrink-0 border",
                    isSelected
                      ? "bg-primary text-primary-foreground border-primary shadow-soft-xs font-semibold"
                      : "bg-background hover:bg-muted/70 text-muted-foreground hover:text-foreground border-border/70"
                  )}
                >
                  {status}
                </button>
              )
            })}
          </div>

          {/* Reset Filters Action */}
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

      {/* 4. Applications Table vs Empty State */}
      {sortedApplications.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border/80 bg-card/60 p-10 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto text-muted-foreground">
            <Users className="w-6 h-6" />
          </div>
          <div className="space-y-1 max-w-md mx-auto">
            <h4 className="text-base font-bold text-foreground">No applications found</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              No candidate records match your combined filter criteria. Try adjusting the search query, job selection, or status filters.
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
          {/* DESKTOP & TABLET: Enterprise ATS Applications Table */}
          <div className="hidden md:block rounded-2xl border border-border/80 dark:border-white/10 bg-card shadow-soft dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse" role="table">
                <thead>
                  <tr className="border-b border-border/70 dark:border-white/10 bg-muted/40 dark:bg-white/5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground select-none">
                    {/* Candidate Column (Sortable) */}
                    <th
                      scope="col"
                      onClick={() => handleSort("candidateName")}
                      className="py-3.5 px-4 font-semibold cursor-pointer hover:text-foreground transition-colors"
                    >
                      <div className="flex items-center gap-1.5">
                        <span>Candidate</span>
                        {sortField === "candidateName" ? (
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

                    <th scope="col" className="py-3.5 px-4 font-semibold">Applied For</th>

                    {/* Applied Date Column (Sortable) */}
                    <th
                      scope="col"
                      onClick={() => handleSort("daysAgo")}
                      className="py-3.5 px-4 font-semibold cursor-pointer hover:text-foreground transition-colors"
                    >
                      <div className="flex items-center gap-1.5">
                        <span>Applied Date</span>
                        {sortField === "daysAgo" ? (
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

                    {/* AI Match Score Column (Sortable) */}
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

                    <th scope="col" className="py-3.5 px-4 font-semibold">Status</th>
                    <th scope="col" className="py-3.5 px-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 dark:divide-white/5">
                  {paginatedApplications.map((app) => (
                    <tr
                      key={app.id}
                      className="hover:bg-muted/30 dark:hover:bg-white/5 transition-colors group"
                    >
                      {/* Column 1: Candidate */}
                      <td className="py-3.5 px-4 align-middle">
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              "w-9 h-9 rounded-full bg-gradient-to-br flex items-center justify-center text-white font-bold text-xs shadow-soft-xs shrink-0 select-none",
                              app.candidateAvatarGradient || "from-[#F47758] to-[#D94F2D]"
                            )}
                          >
                            {app.candidateAvatar}
                          </div>
                          <div className="min-w-0">
                            <button
                              type="button"
                              onClick={() => setSelectedCandidate(app)}
                              className="font-bold text-foreground group-hover:text-primary transition-colors cursor-pointer truncate text-left block text-sm"
                            >
                              {app.candidateName}
                            </button>
                            <span className="text-[11px] text-muted-foreground truncate block">
                              {app.candidateEmail}
                            </span>
                            <span className="text-[10px] text-muted-foreground/80 truncate block pt-0.5">
                              {app.candidateLocation}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Column 2: Applied For */}
                      <td className="py-3.5 px-4 align-middle">
                        <div className="space-y-0.5 min-w-0">
                          <span className="font-semibold text-foreground text-xs block truncate">
                            {app.jobTitle}
                          </span>
                          <span className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                            <span className="truncate">{app.jobDepartment}</span>
                            <span>•</span>
                            <span className="truncate">{app.jobLocation}</span>
                          </span>
                        </div>
                      </td>

                      {/* Column 3: Applied Date */}
                      <td className="py-3.5 px-4 align-middle">
                        <div className="space-y-0.5">
                          <span className="font-medium text-foreground text-xs block">
                            {app.appliedDate}
                          </span>
                          <span className="text-[11px] text-muted-foreground block">
                            {app.appliedRelative}
                          </span>
                        </div>
                      </td>

                      {/* Column 4: AI Match */}
                      <td className="py-3.5 px-4 align-middle">
                        <AiMatchBadge score={app.aiMatchScore} />
                      </td>

                      {/* Column 5: Status */}
                      <td className="py-3.5 px-4 align-middle">
                        <ApplicationStatusBadge status={app.status} />
                      </td>

                      {/* Column 6: Actions */}
                      <td className="py-3.5 px-4 align-middle text-right">
                        <div className="relative inline-block text-left">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedCandidate(app)}
                              className="h-8 px-2 text-xs font-semibold text-muted-foreground hover:text-foreground cursor-pointer"
                              title="View full candidate profile"
                            >
                              <Eye className="w-3.5 h-3.5 mr-1" />
                              <span>View</span>
                            </Button>

                            <button
                              type="button"
                              onClick={() =>
                                setActiveMenuId(activeMenuId === app.id ? null : app.id)
                              }
                              aria-label={`Actions for ${app.candidateName}`}
                              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors cursor-pointer"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Desktop Actions Dropdown Menu */}
                          {activeMenuId === app.id && (
                            <div
                              role="menu"
                              className="absolute right-0 top-full mt-1.5 w-52 bg-popover text-popover-foreground rounded-xl border border-border/90 shadow-soft-lg p-1.5 z-40 animate-in fade-in-50 zoom-in-95 duration-150"
                            >
                              <button
                                type="button"
                                onClick={() => {
                                  setActiveMenuId(null)
                                  setSelectedCandidate(app)
                                }}
                                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-foreground hover:bg-muted/70 transition-colors cursor-pointer"
                              >
                                <Eye className="w-3.5 h-3.5 text-muted-foreground" />
                                <span>View Full Profile</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  setActiveMenuId(null)
                                  updateCandidateStatus(app.id, "Shortlisted")
                                }}
                                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-foreground hover:bg-muted/70 transition-colors cursor-pointer"
                              >
                                <Sparkles className="w-3.5 h-3.5 text-sky-500" />
                                <span>Shortlist Candidate</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  setActiveMenuId(null)
                                  setCandidateToInterview(app)
                                }}
                                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-foreground hover:bg-muted/70 transition-colors cursor-pointer"
                              >
                                <Calendar className="w-3.5 h-3.5 text-violet-500" />
                                <span>Schedule Interview</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  setActiveMenuId(null)
                                  updateCandidateStatus(app.id, "Offered")
                                }}
                                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-foreground hover:bg-muted/70 transition-colors cursor-pointer"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                                <span>Extend Formal Offer</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleCopyEmail(app.candidateEmail)}
                                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-foreground hover:bg-muted/70 transition-colors cursor-pointer"
                              >
                                <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                                <span>Copy Email Address</span>
                              </button>

                              <div className="my-1 border-t border-border/60" />

                              <button
                                type="button"
                                onClick={() => {
                                  setActiveMenuId(null)
                                  setCandidateToReject(app)
                                }}
                                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-rose-600 hover:bg-rose-500/10 transition-colors cursor-pointer"
                              >
                                <UserX className="w-3.5 h-3.5 text-rose-500" />
                                <span>Reject Application...</span>
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

          {/* MOBILE: Clean Card Presentation (No Horizontal Scroll Overflow) */}
          <div className="block md:hidden space-y-3">
            {paginatedApplications.map((app) => (
              <div
                key={app.id}
                className="rounded-2xl border border-border/80 dark:border-white/10 bg-card p-4 shadow-soft dark:shadow-[0_8px_20px_rgb(0,0,0,0.3)] space-y-3"
              >
                {/* Mobile Card Header */}
                <div className="flex items-start justify-between gap-2.5">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={cn(
                        "w-9 h-9 rounded-full bg-gradient-to-br flex items-center justify-center text-white font-bold text-xs shrink-0 select-none",
                        app.candidateAvatarGradient || "from-[#F47758] to-[#D94F2D]"
                      )}
                    >
                      {app.candidateAvatar}
                    </div>
                    <div className="min-w-0">
                      <h4
                        onClick={() => setSelectedCandidate(app)}
                        className="font-bold text-foreground text-sm truncate hover:text-primary transition-colors cursor-pointer"
                      >
                        {app.candidateName}
                      </h4>
                      <p className="text-[11px] text-muted-foreground truncate">
                        {app.candidateEmail}
                      </p>
                    </div>
                  </div>

                  <ApplicationStatusBadge status={app.status} />
                </div>

                {/* Role Applied For */}
                <div className="p-2.5 rounded-xl bg-muted/40 dark:bg-white/5 space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-muted-foreground">Requisition:</span>
                    <span className="font-semibold text-foreground truncate max-w-[200px]">
                      {app.jobTitle}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-muted-foreground">Department:</span>
                    <span className="text-muted-foreground font-medium">{app.jobDepartment}</span>
                  </div>
                </div>

                {/* Metadata Row */}
                <div className="flex items-center justify-between pt-1 text-xs">
                  <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                    <Clock className="w-3.5 h-3.5 text-primary" />
                    <span>Applied {app.appliedRelative}</span>
                  </div>

                  <AiMatchBadge score={app.aiMatchScore} showProgress={false} />
                </div>

                {/* Mobile Actions Footer */}
                <div className="flex items-center gap-2 pt-2 border-t border-border/60">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedCandidate(app)}
                    className="flex-1 text-xs font-semibold rounded-xl h-8"
                  >
                    <Eye className="w-3.5 h-3.5 mr-1.5" />
                    <span>View Profile</span>
                  </Button>

                  <Button
                    type="button"
                    variant="default"
                    size="sm"
                    onClick={() => setCandidateToInterview(app)}
                    className="text-xs font-semibold rounded-xl h-8 px-3"
                  >
                    <Calendar className="w-3.5 h-3.5 mr-1" />
                    <span>Interview</span>
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setCandidateToReject(app)}
                    className="text-xs font-semibold rounded-xl h-8 px-2 text-rose-600 hover:bg-rose-500/10 border-rose-200 dark:border-rose-900/50"
                    title="Reject Candidate"
                  >
                    <UserX className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* 5. Pagination Bar */}
          <div className="rounded-2xl border border-border/80 dark:border-white/10 bg-card p-3.5 sm:p-4 shadow-soft dark:shadow-[0_8px_20px_rgb(0,0,0,0.3)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            {/* Info and Page Size Selector */}
            <div className="flex items-center gap-3">
              <span className="text-muted-foreground font-medium">
                Showing{" "}
                <strong className="text-foreground">
                  {Math.min((currentPage - 1) * pageSize + 1, sortedApplications.length)}
                </strong>{" "}
                to{" "}
                <strong className="text-foreground">
                  {Math.min(currentPage * pageSize, sortedApplications.length)}
                </strong>{" "}
                of <strong className="text-foreground">{sortedApplications.length}</strong> applications
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

            {/* Pagination Controls */}
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

      {/* 6. Candidate Profile Detail Modal */}
      {selectedCandidate && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label={`Candidate Profile for ${selectedCandidate.candidateName}`}
        >
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-200"
            onClick={() => setSelectedCandidate(null)}
            aria-hidden="true"
          />

          {/* Modal Panel */}
          <div className="relative w-full max-w-lg bg-card border border-border/90 dark:border-white/10 shadow-2xl rounded-2xl z-50 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 fade-in-50 duration-150">
            {/* Modal Header */}
            <div className="flex items-start justify-between p-5 border-b border-border/70 dark:border-white/10">
              <div className="flex items-center gap-3 min-w-0 pr-3">
                <div
                  className={cn(
                    "w-12 h-12 rounded-full bg-gradient-to-br flex items-center justify-center text-white font-bold text-base shadow-soft-xs shrink-0 select-none",
                    selectedCandidate.candidateAvatarGradient || "from-[#F47758] to-[#D94F2D]"
                  )}
                >
                  {selectedCandidate.candidateAvatar}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-lg font-extrabold text-foreground tracking-tight truncate">
                      {selectedCandidate.candidateName}
                    </h3>
                    <ApplicationStatusBadge status={selectedCandidate.status} />
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {selectedCandidate.candidateEmail}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedCandidate(null)}
                aria-label="Close dialog"
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors cursor-pointer shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4 overflow-y-auto text-xs">
              {/* Tenant and Requisition Context */}
              <div className="p-3.5 rounded-xl bg-muted/40 dark:bg-white/5 space-y-2 border border-border/60">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Organization Tenant:</span>
                  <span className="font-semibold text-foreground flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-primary" />
                    {selectedCandidate.organizationName}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Applied Requisition:</span>
                  <span className="font-semibold text-foreground">
                    {selectedCandidate.jobTitle}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Department & Location:</span>
                  <span className="font-semibold text-foreground">
                    {selectedCandidate.jobDepartment} • {selectedCandidate.jobLocation}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Candidate Location:</span>
                  <span className="font-semibold text-foreground flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                    {selectedCandidate.candidateLocation}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Experience Profile:</span>
                  <span className="font-semibold text-foreground">
                    {selectedCandidate.candidateExperience}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Date Submitted:</span>
                  <span className="font-semibold text-foreground">
                    {selectedCandidate.appliedDate} ({selectedCandidate.appliedRelative})
                  </span>
                </div>
              </div>

              {/* AI Match Breakdown Card */}
              <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-primary flex items-center gap-1.5 text-xs">
                    <Sparkles className="w-4 h-4" />
                    <span>AI Candidate Match Score</span>
                  </span>
                  <AiMatchBadge score={selectedCandidate.aiMatchScore} />
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Demonstration scoring calculated from candidate resume keywords, years of experience, and requirement overlap. Automated model re-scoring connects in Milestone 7.
                </p>
              </div>

              {/* Evaluation Notes */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Recruiter Screening Notes
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed p-3 rounded-xl bg-card border border-border/80">
                  {selectedCandidate.notes}
                </p>
              </div>

              {/* Stage Control Row */}
              <div className="p-3.5 rounded-xl bg-muted/30 border border-border/60 space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
                  Move Application Stage:
                </span>
                <div className="flex items-center gap-2 flex-wrap">
                  {["Applied", "Under Review", "Shortlisted", "Interview", "Offered", "Hired"].map(
                    (st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => updateCandidateStatus(selectedCandidate.id, st)}
                        className={cn(
                          "px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors cursor-pointer",
                          selectedCandidate.status === st
                            ? "bg-primary text-primary-foreground border-primary font-bold shadow-soft-xs"
                            : "bg-card hover:bg-muted text-muted-foreground hover:text-foreground border-border/70"
                        )}
                      >
                        {st}
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-muted/30 dark:bg-white/5 border-t border-border/70 flex items-center justify-between gap-2.5">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setSelectedCandidate(null)}
                className="text-xs font-semibold rounded-xl"
              >
                Close
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const cand = selectedCandidate
                    setSelectedCandidate(null)
                    setCandidateToReject(cand)
                  }}
                  className="text-xs font-semibold rounded-xl text-rose-600 hover:bg-rose-500/10 border-rose-200 dark:border-rose-900/40"
                >
                  <UserX className="w-3.5 h-3.5 mr-1" />
                  <span>Reject</span>
                </Button>

                <Button
                  type="button"
                  variant="default"
                  size="sm"
                  onClick={() => {
                    const cand = selectedCandidate
                    setSelectedCandidate(null)
                    setCandidateToInterview(cand)
                  }}
                  className="text-xs font-semibold rounded-xl"
                >
                  <Calendar className="w-3.5 h-3.5 mr-1" />
                  <span>Schedule Interview</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 7. Destructive Confirmation Dialog: Candidate Rejection */}
      {candidateToReject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Confirm Rejection"
        >
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-200"
            onClick={() => setCandidateToReject(null)}
            aria-hidden="true"
          />
          <div className="relative w-full max-w-md bg-card border border-border/90 dark:border-white/10 shadow-2xl rounded-2xl z-50 p-6 space-y-4 animate-in zoom-in-95 fade-in-50 duration-150">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-extrabold text-foreground">
                  Confirm Candidate Rejection
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Are you sure you want to mark{" "}
                  <strong className="text-foreground">{candidateToReject.candidateName}</strong> as{" "}
                  <span className="text-rose-600 font-semibold">Rejected</span> for{" "}
                  <strong className="text-foreground">{candidateToReject.jobTitle}</strong>?
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-muted/40 border border-border/60 text-[11px] text-muted-foreground leading-relaxed">
              In production, an automated status notification and candidate feedback email will be queued under tenant <strong className="text-foreground">Acme Technologies</strong>.
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setCandidateToReject(null)}
                className="text-xs rounded-xl"
              >
                Cancel
              </Button>

              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={handleConfirmRejection}
                className="text-xs font-semibold rounded-xl bg-rose-600 hover:bg-rose-700 text-white"
              >
                <UserX className="w-3.5 h-3.5 mr-1" />
                <span>Confirm Rejection</span>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 8. Interview Scheduling Modal */}
      {candidateToInterview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Schedule Interview"
        >
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-200"
            onClick={() => setCandidateToInterview(null)}
            aria-hidden="true"
          />
          <div className="relative w-full max-w-md bg-card border border-border/90 dark:border-white/10 shadow-2xl rounded-2xl z-50 p-6 space-y-4 animate-in zoom-in-95 fade-in-50 duration-150">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-base font-extrabold text-foreground">
                  Schedule Interview
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Candidate: <strong className="text-foreground">{candidateToInterview.candidateName}</strong>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setCandidateToInterview(null)}
                className="p-1 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
                  Interview Round
                </label>
                <select
                  value={interviewForm.type}
                  onChange={(e) =>
                    setInterviewForm((prev) => ({ ...prev, type: e.target.value }))
                  }
                  className="w-full h-9 px-3 text-xs font-medium bg-background border border-border/80 rounded-xl text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                >
                  <option value="Initial Screening">Initial Recruiter Screening</option>
                  <option value="Technical Architecture Review">Technical Architecture Review</option>
                  <option value="Live Coding Exercise">Live Coding Exercise</option>
                  <option value="Culture & Values Panel">Culture & Values Panel</option>
                  <option value="Executive Final Round">Executive Final Round</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={interviewForm.date}
                    onChange={(e) =>
                      setInterviewForm((prev) => ({ ...prev, date: e.target.value }))
                    }
                    className="w-full h-9 px-2 text-xs font-medium bg-background border border-border/80 rounded-xl text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
                    Time (IST)
                  </label>
                  <input
                    type="time"
                    value={interviewForm.time}
                    onChange={(e) =>
                      setInterviewForm((prev) => ({ ...prev, time: e.target.value }))
                    }
                    className="w-full h-9 px-2 text-xs font-medium bg-background border border-border/80 rounded-xl text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
                  Notes / Agenda
                </label>
                <textarea
                  rows={2}
                  value={interviewForm.notes}
                  onChange={(e) =>
                    setInterviewForm((prev) => ({ ...prev, notes: e.target.value }))
                  }
                  className="w-full p-2.5 text-xs bg-background border border-border/80 rounded-xl text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Add notes for interviewers..."
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setCandidateToInterview(null)}
                className="text-xs rounded-xl"
              >
                Cancel
              </Button>

              <Button
                type="button"
                variant="default"
                size="sm"
                onClick={handleConfirmInterview}
                className="text-xs font-semibold rounded-xl"
              >
                <Calendar className="w-3.5 h-3.5 mr-1" />
                <span>Confirm & Send Invite</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

