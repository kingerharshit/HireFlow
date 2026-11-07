import * as React from "react"
import { useState, useMemo, useRef, useEffect } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import {
  Briefcase,
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
  CheckCircle2,
  AlertTriangle,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  Download,
  RefreshCw,
  Plus,
  Globe,
  Lock,
  PauseCircle,
  PlayCircle,
  XCircle,
  Archive,
  FileEdit,
  ExternalLink,
  Users,
  Coins,
  GraduationCap,
  ChevronDown,
  Layers,
  AlertCircle,
} from "lucide-react"
import { JobStatusBadge } from "@/components/dashboard/JobStatusBadge"
import {
  JOB_DEPARTMENTS,
  JOB_LOCATIONS,
  EMPLOYMENT_TYPES,
  WORKPLACE_TYPES,
  JOB_STATUS_OPTIONS,
} from "@/features/jobs/demoJobsData"
import { useJobs } from "@/context/JobsContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export function JobsPage() {
  const {
    jobs,
    createJob,
    updateJob,
    publishJob,
    pauseJob,
    resumeJob,
    closeJob,
    archiveJob,
  } = useJobs()

  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  // Filter & Search State
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("All Departments")
  const [selectedLocation, setSelectedLocation] = useState("All Locations")
  const [selectedEmploymentType, setSelectedEmploymentType] = useState("All Types")
  const [selectedStatus, setSelectedStatus] = useState("All Statuses")

  // Sorting State: 'published' | 'applications' | 'title'
  const [sortField, setSortField] = useState("published")
  const [sortDirection, setSortDirection] = useState("desc") // newest first

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(6)

  // Interactive UI State
  const [activeMenuId, setActiveMenuId] = useState(null)
  const [selectedJobForView, setSelectedJobForView] = useState(null)
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [editingJob, setEditingJob] = useState(null) // null for create, object for edit

  // Confirmation dialogs state
  const [jobToClose, setJobToClose] = useState(null)
  const [jobToArchive, setJobToArchive] = useState(null)

  // Form State
  const initialFormData = {
    title: "",
    department: "Engineering",
    workplaceType: "Remote",
    employmentType: "Full-time",
    location: "Remote — India",
    description: "",
    responsibilities: "",
    skills: "React 19, TypeScript, Tailwind CSS",
    preferredSkills: "Next.js, Vite, Web Performance",
    minExperience: 4,
    maxExperience: 8,
    education: "Bachelor's Degree in Computer Science or equivalent practical experience",
    salaryMin: 2400000,
    salaryMax: 3400000,
    currency: "INR",
    openings: 1,
    targetApplications: 50,
    deadline: "2026-12-31",
  }
  const [formData, setFormData] = useState(initialFormData)
  const [formErrors, setFormErrors] = useState({})
  const [toastMessage, setToastMessage] = useState(null)

  const menuContainerRef = useRef(null)

  // Check URL query params for ?action=create
  useEffect(() => {
    if (searchParams.get("action") === "create") {
      setEditingJob(null)
      setFormData(initialFormData)
      setFormErrors({})
      setIsFormModalOpen(true)
      // clear the search param
      searchParams.delete("action")
      setSearchParams(searchParams, { replace: true })
    }
  }, [searchParams])

  // Click outside to close actions menu
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuContainerRef.current && !menuContainerRef.current.contains(e.target)) {
        setActiveMenuId(null)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Reset pagination on filter changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, selectedDepartment, selectedLocation, selectedEmploymentType, selectedStatus])

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
    if (selectedDepartment !== "All Departments") count++
    if (selectedLocation !== "All Locations") count++
    if (selectedEmploymentType !== "All Types") count++
    if (selectedStatus !== "All Statuses") count++
    return count
  }, [searchTerm, selectedDepartment, selectedLocation, selectedEmploymentType, selectedStatus])

  const handleResetFilters = () => {
    setSearchTerm("")
    setSelectedDepartment("All Departments")
    setSelectedLocation("All Locations")
    setSelectedEmploymentType("All Types")
    setSelectedStatus("All Statuses")
    showToast("Filters reset to default view")
  }

  // Dynamically calculated status summary counts
  const summaryCounts = useMemo(() => {
    return {
      total: jobs.length,
      published: jobs.filter((j) => j.status === "Published").length,
      draft: jobs.filter((j) => j.status === "Draft").length,
      paused: jobs.filter((j) => j.status === "Paused").length,
      closed: jobs.filter((j) => j.status === "Closed" || j.status === "Archived").length,
    }
  }, [jobs])

  // Filtered jobs
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const q = searchTerm.toLowerCase().trim()
      const matchesSearch =
        q === "" ||
        job.title.toLowerCase().includes(q) ||
        job.department.toLowerCase().includes(q) ||
        job.location.toLowerCase().includes(q)

      const matchesDepartment =
        selectedDepartment === "All Departments" || job.department === selectedDepartment

      const matchesLocation =
        selectedLocation === "All Locations" || job.location === selectedLocation

      const matchesEmploymentType =
        selectedEmploymentType === "All Types" || job.employmentType === selectedEmploymentType

      const matchesStatus =
        selectedStatus === "All Statuses" || job.status.toLowerCase() === selectedStatus.toLowerCase()

      return matchesSearch && matchesDepartment && matchesLocation && matchesEmploymentType && matchesStatus
    })
  }, [jobs, searchTerm, selectedDepartment, selectedLocation, selectedEmploymentType, selectedStatus])

  // Sorted jobs
  const sortedJobs = useMemo(() => {
    return [...filteredJobs].sort((a, b) => {
      if (sortField === "published") {
        return sortDirection === "desc"
          ? (a.daysAgo || 0) - (b.daysAgo || 0)
          : (b.daysAgo || 0) - (a.daysAgo || 0)
      }
      if (sortField === "applications") {
        return sortDirection === "desc"
          ? (b.applicationsCount || 0) - (a.applicationsCount || 0)
          : (a.applicationsCount || 0) - (b.applicationsCount || 0)
      }
      if (sortField === "title") {
        return sortDirection === "asc"
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title)
      }
      return 0
    })
  }, [filteredJobs, sortField, sortDirection])

  // Pagination
  const totalPages = Math.ceil(sortedJobs.length / pageSize) || 1
  const paginatedJobs = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    return sortedJobs.slice(startIndex, startIndex + pageSize)
  }, [sortedJobs, currentPage, pageSize])

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"))
    } else {
      setSortField(field)
      setSortDirection(field === "title" ? "asc" : "desc")
    }
  }

  // Open Form Modal for Create
  const handleOpenCreateModal = () => {
    setEditingJob(null)
    setFormData(initialFormData)
    setFormErrors({})
    setIsFormModalOpen(true)
  }

  // Open Form Modal for Edit
  const handleOpenEditModal = (job) => {
    setEditingJob(job)
    setFormData({
      title: job.title || "",
      department: job.department || "Engineering",
      workplaceType: job.workplaceType || "Remote",
      employmentType: job.employmentType || "Full-time",
      location: job.location || "Remote — India",
      description: job.description || "",
      responsibilities: job.responsibilities || "",
      skills: Array.isArray(job.skills) ? job.skills.join(", ") : (job.skills || ""),
      preferredSkills: Array.isArray(job.preferredSkills)
        ? job.preferredSkills.join(", ")
        : (job.preferredSkills || ""),
      minExperience: job.minExperience || 4,
      maxExperience: job.maxExperience || 8,
      education: job.education || "Bachelor's Degree in Computer Science",
      salaryMin: job.salaryMin || 2400000,
      salaryMax: job.salaryMax || 3400000,
      currency: job.currency || "INR",
      openings: job.openings || 1,
      targetApplications: job.targetApplications || 50,
      deadline: job.deadline || "2026-12-31",
    })
    setFormErrors({})
    setIsFormModalOpen(true)
    setActiveMenuId(null)
  }

  // Validate Form
  const validateForm = () => {
    const errors = {}
    if (!formData.title.trim()) errors.title = "Job title is required"
    if (!formData.department.trim()) errors.department = "Department is required"
    if (!formData.location.trim()) errors.location = "Location is required"
    if (!formData.description.trim() || formData.description.length < 15) {
      errors.description = "Summary must be at least 15 characters"
    }
    if (!formData.responsibilities.trim()) {
      errors.responsibilities = "Key responsibilities are required"
    }
    if (Number(formData.salaryMin) > Number(formData.salaryMax)) {
      errors.salary = "Minimum salary cannot exceed maximum salary"
    }
    if (Number(formData.minExperience) > Number(formData.maxExperience)) {
      errors.experience = "Minimum experience cannot exceed maximum experience"
    }
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Form Submit: Save as Draft or Publish
  const handleFormSubmit = (asDraft) => {
    if (!validateForm()) {
      showToast("Please resolve validation errors before saving")
      return
    }

    if (editingJob) {
      // Edit existing job
      const status = asDraft ? "Draft" : editingJob.status === "Draft" ? "Published" : editingJob.status
      const visibility = status === "Published" ? "Publicly Discoverable" : "Internal Recruiter Only"
      updateJob(editingJob.id, {
        ...formData,
        status: status,
        candidateVisibility: visibility,
        skills: formData.skills.split(",").map((s) => s.trim()).filter(Boolean),
        preferredSkills: formData.preferredSkills.split(",").map((s) => s.trim()).filter(Boolean),
        salaryRange: `₹${Number(formData.salaryMin).toLocaleString()} - ₹${Number(formData.salaryMax).toLocaleString()}`,
        experienceLevel: `${formData.minExperience}+ yrs (${formData.minExperience}-${formData.maxExperience} yrs)`,
      })
      showToast(`Requisition "${formData.title}" updated successfully!`)
    } else {
      // Create new job
      const created = createJob(formData, asDraft)
      showToast(
        asDraft
          ? `Saved "${created.title}" as Draft (Internal Recruiter Only)`
          : `Published "${created.title}" to Public Candidate Portal!`
      )
    }

    setIsFormModalOpen(false)
  }

  // Lifecycle Action Handlers
  const handlePublish = (job) => {
    publishJob(job.id)
    showToast(`Published "${job.title}" to public candidate portal!`)
    setActiveMenuId(null)
  }

  const handlePause = (job) => {
    pauseJob(job.id)
    showToast(`Paused "${job.title}". Hidden from candidate portal.`)
    setActiveMenuId(null)
  }

  const handleResume = (job) => {
    resumeJob(job.id)
    showToast(`Resumed "${job.title}". Reopened for candidate discovery.`)
    setActiveMenuId(null)
  }

  const handleConfirmClose = () => {
    if (jobToClose) {
      closeJob(jobToClose.id)
      showToast(`Closed "${jobToClose.title}". Candidate applications stopped.`)
      setJobToClose(null)
    }
  }

  const handleConfirmArchive = () => {
    if (jobToArchive) {
      archiveJob(jobToArchive.id)
      showToast(`Archived "${jobToArchive.title}" to historical records.`)
      setJobToArchive(null)
    }
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
              Job Management
            </h1>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-semibold">
              <Building2 className="w-3.5 h-3.5" />
              <span>Acme Technologies</span>
            </div>
            <Badge
              variant="outline"
              className="text-xs font-medium px-2.5 py-0.5 bg-muted/60 text-muted-foreground border-border/70"
            >
              {jobs.length} Total Requisitions
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1.5 leading-relaxed">
            Manage requisitions, candidate visibility, and hiring lifecycle across Acme Technologies.
          </p>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <Button
            type="button"
            variant="default"
            size="sm"
            onClick={handleOpenCreateModal}
            className="h-9 px-3.5 text-xs font-semibold rounded-xl shadow-soft-xs cursor-pointer flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5 shrink-0" />
            <span>Create Job</span>
          </Button>
        </div>
      </div>

      {/* 2. Summary Metric Cards (Dynamically Calculated) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {/* Total Jobs */}
        <div
          onClick={() => setSelectedStatus("All Statuses")}
          className={cn(
            "p-4 rounded-2xl border transition-all duration-150 cursor-pointer text-left bg-card shadow-soft dark:shadow-[0_8px_20px_rgb(0,0,0,0.3)] hover:border-primary/40",
            selectedStatus === "All Statuses"
              ? "border-primary ring-1 ring-primary/30"
              : "border-border/80 dark:border-white/10"
          )}
        >
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold">Total Jobs</span>
            <Briefcase className="w-4 h-4 text-primary" />
          </div>
          <div className="text-2xl font-extrabold text-foreground mt-2">
            {summaryCounts.total}
          </div>
          <p className="text-[11px] text-muted-foreground mt-0.5">All organization roles</p>
        </div>

        {/* Published Jobs */}
        <div
          onClick={() => setSelectedStatus("Published")}
          className={cn(
            "p-4 rounded-2xl border transition-all duration-150 cursor-pointer text-left bg-card shadow-soft dark:shadow-[0_8px_20px_rgb(0,0,0,0.3)] hover:border-emerald-500/40",
            selectedStatus === "Published"
              ? "border-emerald-500 ring-1 ring-emerald-500/30"
              : "border-border/80 dark:border-white/10"
          )}
        >
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold">Published Jobs</span>
            <Globe className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-extrabold text-foreground mt-2">
            {summaryCounts.published}
          </div>
          <p className="text-[11px] text-muted-foreground mt-0.5">Publicly discoverable</p>
        </div>

        {/* Draft Jobs */}
        <div
          onClick={() => setSelectedStatus("Draft")}
          className={cn(
            "p-4 rounded-2xl border transition-all duration-150 cursor-pointer text-left bg-card shadow-soft dark:shadow-[0_8px_20px_rgb(0,0,0,0.3)] hover:border-slate-500/40",
            selectedStatus === "Draft"
              ? "border-slate-500 ring-1 ring-slate-500/30"
              : "border-border/80 dark:border-white/10"
          )}
        >
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold">Draft Jobs</span>
            <FileEdit className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-extrabold text-foreground mt-2">
            {summaryCounts.draft}
          </div>
          <p className="text-[11px] text-muted-foreground mt-0.5">Internal only, unpublished</p>
        </div>

        {/* Paused Jobs */}
        <div
          onClick={() => setSelectedStatus("Paused")}
          className={cn(
            "p-4 rounded-2xl border transition-all duration-150 cursor-pointer text-left bg-card shadow-soft dark:shadow-[0_8px_20px_rgb(0,0,0,0.3)] hover:border-amber-500/40",
            selectedStatus === "Paused"
              ? "border-amber-500 ring-1 ring-amber-500/30"
              : "border-border/80 dark:border-white/10"
          )}
        >
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold">Paused Jobs</span>
            <PauseCircle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-extrabold text-foreground mt-2">
            {summaryCounts.paused}
          </div>
          <p className="text-[11px] text-muted-foreground mt-0.5">Hiring temporarily paused</p>
        </div>

        {/* Closed Jobs */}
        <div
          onClick={() => setSelectedStatus("Closed")}
          className={cn(
            "p-4 rounded-2xl border transition-all duration-150 cursor-pointer text-left bg-card shadow-soft dark:shadow-[0_8px_20px_rgb(0,0,0,0.3)] hover:border-rose-500/40 col-span-2 sm:col-span-1",
            selectedStatus === "Closed"
              ? "border-rose-500 ring-1 ring-rose-500/30"
              : "border-border/80 dark:border-white/10"
          )}
        >
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold">Closed Jobs</span>
            <XCircle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-extrabold text-foreground mt-2">
            {summaryCounts.closed}
          </div>
          <p className="text-[11px] text-muted-foreground mt-0.5">Filled or archived</p>
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
              placeholder="Search by job title or keyword..."
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

          {/* Department Filter Dropdown */}
          <div className="relative">
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="w-full h-9 pl-3 pr-8 text-xs font-medium bg-background border border-border/80 rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer appearance-none truncate"
            >
              {JOB_DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
          </div>

          {/* Location Filter Dropdown */}
          <div className="relative">
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full h-9 pl-3 pr-8 text-xs font-medium bg-background border border-border/80 rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer appearance-none truncate"
            >
              {JOB_LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
          </div>

          {/* Employment Type Dropdown */}
          <div className="relative">
            <select
              value={selectedEmploymentType}
              onChange={(e) => setSelectedEmploymentType(e.target.value)}
              className="w-full h-9 pl-3 pr-8 text-xs font-medium bg-background border border-border/80 rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer appearance-none truncate"
            >
              {EMPLOYMENT_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
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
              Status:
            </span>
            {JOB_STATUS_OPTIONS.map((status) => {
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

      {/* 4. Job Directory Listing (Table / Empty State) */}
      {sortedJobs.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border/80 bg-card/60 p-10 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto text-muted-foreground">
            <Briefcase className="w-6 h-6" />
          </div>
          <div className="space-y-1 max-w-md mx-auto">
            <h4 className="text-base font-bold text-foreground">No requisitions found</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              No jobs match your filter criteria. Try clearing the search term or status selection.
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
          {/* DESKTOP & TABLET: Professional Table Layout */}
          <div className="hidden md:block rounded-2xl border border-border/80 dark:border-white/10 bg-card shadow-soft dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse" role="table">
                <thead>
                  <tr className="border-b border-border/70 dark:border-white/10 bg-muted/40 dark:bg-white/5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground select-none">
                    {/* Job Title Column (Sortable) */}
                    <th
                      scope="col"
                      onClick={() => handleSort("title")}
                      className="py-3.5 px-4 font-semibold cursor-pointer hover:text-foreground transition-colors"
                    >
                      <div className="flex items-center gap-1.5">
                        <span>Job Title</span>
                        {sortField === "title" ? (
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

                    <th scope="col" className="py-3.5 px-4 font-semibold">Department & Workplace</th>
                    <th scope="col" className="py-3.5 px-4 font-semibold">Location</th>

                    {/* Published Date Column (Sortable) */}
                    <th
                      scope="col"
                      onClick={() => handleSort("published")}
                      className="py-3.5 px-4 font-semibold cursor-pointer hover:text-foreground transition-colors"
                    >
                      <div className="flex items-center gap-1.5">
                        <span>Created / Published</span>
                        {sortField === "published" ? (
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

                    {/* Applications Column (Sortable) */}
                    <th
                      scope="col"
                      onClick={() => handleSort("applications")}
                      className="py-3.5 px-4 font-semibold cursor-pointer hover:text-foreground transition-colors"
                    >
                      <div className="flex items-center gap-1.5">
                        <span>Applications</span>
                        {sortField === "applications" ? (
                          sortDirection === "desc" ? (
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
                    <th scope="col" className="py-3.5 px-4 font-semibold">Candidate Visibility</th>
                    <th scope="col" className="py-3.5 px-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 dark:divide-white/5">
                  {paginatedJobs.map((job) => {
                    const progressPercent = Math.min(
                      100,
                      Math.round((job.applicationsCount / (job.targetApplications || 1)) * 100)
                    )
                    return (
                      <tr
                        key={job.id}
                        className="hover:bg-muted/30 dark:hover:bg-white/5 transition-colors group"
                      >
                        {/* Title */}
                        <td className="py-3.5 px-4 align-middle">
                          <div className="min-w-0 space-y-0.5">
                            <button
                              type="button"
                              onClick={() => setSelectedJobForView(job)}
                              className="font-bold text-foreground group-hover:text-primary transition-colors cursor-pointer truncate text-left block text-sm"
                            >
                              {job.title}
                            </button>
                            <span className="text-[11px] text-muted-foreground block">
                              {job.salaryRange}
                            </span>
                          </div>
                        </td>

                        {/* Department & Workplace */}
                        <td className="py-3.5 px-4 align-middle">
                          <div className="space-y-0.5 min-w-0">
                            <span className="font-semibold text-foreground text-xs block truncate">
                              {job.department}
                            </span>
                            <span className="text-[11px] text-muted-foreground block truncate">
                              {job.workplaceType} • {job.employmentType}
                            </span>
                          </div>
                        </td>

                        {/* Location */}
                        <td className="py-3.5 px-4 align-middle">
                          <div className="flex items-center gap-1 text-muted-foreground text-xs">
                            <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                            <span className="truncate">{job.location}</span>
                          </div>
                        </td>

                        {/* Published Date */}
                        <td className="py-3.5 px-4 align-middle">
                          <div className="space-y-0.5">
                            <span className="font-medium text-foreground text-xs block">
                              {job.publishedDate}
                            </span>
                            <span className="text-[11px] text-muted-foreground block">
                              {job.daysRemaining}
                            </span>
                          </div>
                        </td>

                        {/* Applications Volume & Mini Progress */}
                        <td className="py-3.5 px-4 align-middle">
                          <div className="space-y-1.5 w-28">
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="font-bold text-foreground">
                                {job.applicationsCount}
                              </span>
                              <span className="text-muted-foreground">
                                /{job.targetApplications}
                              </span>
                            </div>
                            <div className="w-full h-1.5 rounded-full bg-muted/80 dark:bg-white/10 overflow-hidden">
                              <div
                                className="h-full rounded-full bg-gradient-to-r from-[#F47758] to-[#D94F2D] transition-all duration-300"
                                style={{ width: `${progressPercent}%` }}
                              />
                            </div>
                          </div>
                        </td>

                        {/* Status Badge */}
                        <td className="py-3.5 px-4 align-middle">
                          <JobStatusBadge status={job.status} />
                        </td>

                        {/* Candidate Visibility Badge */}
                        <td className="py-3.5 px-4 align-middle">
                          {job.status === "Published" ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                              <Globe className="w-3 h-3" />
                              <span>Public Portal</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-md border border-border/70">
                              <Lock className="w-3 h-3" />
                              <span>Internal Only</span>
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 align-middle text-right">
                          <div className="relative inline-block text-left">
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedJobForView(job)}
                                className="h-8 px-2 text-xs font-semibold text-muted-foreground hover:text-foreground cursor-pointer"
                                title="View requisition details"
                              >
                                <Eye className="w-3.5 h-3.5 mr-1" />
                                <span>View</span>
                              </Button>

                              <button
                                type="button"
                                onClick={() =>
                                  setActiveMenuId(activeMenuId === job.id ? null : job.id)
                                }
                                aria-label={`Actions for ${job.title}`}
                                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors cursor-pointer"
                              >
                                <MoreVertical className="w-4 h-4" />
                              </button>
                            </div>

                            {/* Dropdown Menu */}
                            {activeMenuId === job.id && (
                              <div
                                role="menu"
                                className="absolute right-0 top-full mt-1.5 w-52 bg-popover text-popover-foreground rounded-xl border border-border/90 shadow-soft-lg p-1.5 z-40 animate-in fade-in-50 zoom-in-95 duration-150 text-left"
                              >
                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveMenuId(null)
                                    setSelectedJobForView(job)
                                  }}
                                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-foreground hover:bg-muted/70 transition-colors cursor-pointer"
                                >
                                  <Eye className="w-3.5 h-3.5 text-muted-foreground" />
                                  <span>View Requisition</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveMenuId(null)
                                    window.open(`/jobs/${job.id}?preview=true`, '_blank')
                                  }}
                                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-foreground hover:bg-muted/70 transition-colors cursor-pointer"
                                >
                                  <ExternalLink className="w-3.5 h-3.5 text-primary" />
                                  <span>Preview as Candidate</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveMenuId(null)
                                    navigate(`/recruiter/jobs/edit/${job.id}`)
                                  }}
                                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-foreground hover:bg-muted/70 transition-colors cursor-pointer"
                                >
                                  <FileEdit className="w-3.5 h-3.5 text-muted-foreground" />
                                  <span>Edit Requisition...</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveMenuId(null)
                                    navigate("/recruiter/applications")
                                  }}
                                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-foreground hover:bg-muted/70 transition-colors cursor-pointer"
                                >
                                  <Users className="w-3.5 h-3.5 text-muted-foreground" />
                                  <span>View Applications ({job.applicationsCount})</span>
                                </button>

                                <div className="my-1 border-t border-border/60" />

                                {/* Lifecycle Action: Publish Draft */}
                                {job.status === "Draft" && (
                                  <button
                                    type="button"
                                    onClick={() => handlePublish(job)}
                                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-emerald-600 hover:bg-emerald-500/10 transition-colors cursor-pointer"
                                  >
                                    <Globe className="w-3.5 h-3.5 text-emerald-600" />
                                    <span>Publish Job Now</span>
                                  </button>
                                )}

                                {/* Lifecycle Action: Pause Published */}
                                {job.status === "Published" && (
                                  <button
                                    type="button"
                                    onClick={() => handlePause(job)}
                                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-amber-600 hover:bg-amber-500/10 transition-colors cursor-pointer"
                                  >
                                    <PauseCircle className="w-3.5 h-3.5 text-amber-600" />
                                    <span>Pause Requisition</span>
                                  </button>
                                )}

                                {/* Lifecycle Action: Resume Paused */}
                                {job.status === "Paused" && (
                                  <button
                                    type="button"
                                    onClick={() => handleResume(job)}
                                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-emerald-600 hover:bg-emerald-500/10 transition-colors cursor-pointer"
                                  >
                                    <PlayCircle className="w-3.5 h-3.5 text-emerald-600" />
                                    <span>Resume Requisition</span>
                                  </button>
                                )}

                                {/* Lifecycle Action: Close Requisition */}
                                {(job.status === "Published" || job.status === "Paused") && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setActiveMenuId(null)
                                      setJobToClose(job)
                                    }}
                                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-rose-600 hover:bg-rose-500/10 transition-colors cursor-pointer"
                                  >
                                    <XCircle className="w-3.5 h-3.5 text-rose-600" />
                                    <span>Close Requisition...</span>
                                  </button>
                                )}

                                {/* Lifecycle Action: Archive Closed */}
                                {job.status === "Closed" && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setActiveMenuId(null)
                                      setJobToArchive(job)
                                    }}
                                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-500/10 transition-colors cursor-pointer"
                                  >
                                    <Archive className="w-3.5 h-3.5 text-slate-600" />
                                    <span>Archive to Records...</span>
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* MOBILE: Clean Card Presentation (Zero Horizontal Overflow) */}
          <div className="block md:hidden space-y-3">
            {paginatedJobs.map((job) => {
              const progressPercent = Math.min(
                100,
                Math.round((job.applicationsCount / (job.targetApplications || 1)) * 100)
              )
              return (
                <div
                  key={job.id}
                  className="rounded-2xl border border-border/80 dark:border-white/10 bg-card p-4 shadow-soft dark:shadow-[0_8px_20px_rgb(0,0,0,0.3)] space-y-3"
                >
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-2.5">
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-md">
                          {job.department}
                        </span>
                        <JobStatusBadge status={job.status} />
                      </div>
                      <h4
                        onClick={() => setSelectedJobForView(job)}
                        className="font-bold text-foreground text-base truncate hover:text-primary transition-colors cursor-pointer pt-0.5"
                      >
                        {job.title}
                      </h4>
                    </div>

                    {job.status === "Published" ? (
                      <span className="p-1 rounded-md text-emerald-600 bg-emerald-500/10 shrink-0" title="Public Portal">
                        <Globe className="w-4 h-4" />
                      </span>
                    ) : (
                      <span className="p-1 rounded-md text-muted-foreground bg-muted/60 shrink-0" title="Internal Only">
                        <Lock className="w-4 h-4" />
                      </span>
                    )}
                  </div>

                  {/* Metadata Row */}
                  <div className="p-2.5 rounded-xl bg-muted/40 dark:bg-white/5 space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-muted-foreground">Location:</span>
                      <span className="font-semibold text-foreground">{job.location}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-muted-foreground">Workplace / Type:</span>
                      <span className="text-muted-foreground font-medium">
                        {job.workplaceType} • {job.employmentType}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-muted-foreground">Compensation:</span>
                      <span className="text-primary font-bold">{job.salaryRange}</span>
                    </div>
                  </div>

                  {/* Applications Progress */}
                  <div className="space-y-1 pt-1 text-xs">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-muted-foreground">
                        Applications: <strong className="text-foreground">{job.applicationsCount}</strong> / {job.targetApplications}
                      </span>
                      <span className="font-semibold text-primary">{progressPercent}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-muted/80 dark:bg-white/10 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#F47758] to-[#D94F2D]"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Mobile Actions Footer */}
                  <div className="flex items-center gap-2 pt-2 border-t border-border/60">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedJobForView(job)}
                      className="flex-1 text-xs font-semibold rounded-xl h-8"
                    >
                      <Eye className="w-3.5 h-3.5 mr-1" />
                      <span>Details</span>
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/recruiter/jobs/edit/${job.id}`)}
                      className="text-xs font-semibold rounded-xl h-8 px-3"
                    >
                      <FileEdit className="w-3.5 h-3.5 mr-1" />
                      <span>Edit</span>
                    </Button>

                    {job.status === "Published" && (
                      <Button
                        type="button"
                        variant="default"
                        size="sm"
                        onClick={() => handlePause(job)}
                        className="text-xs font-semibold rounded-xl h-8 px-2.5 bg-amber-600 hover:bg-amber-700 text-white"
                        title="Pause Requisition"
                      >
                        <PauseCircle className="w-3.5 h-3.5" />
                      </Button>
                    )}

                    {job.status === "Paused" && (
                      <Button
                        type="button"
                        variant="default"
                        size="sm"
                        onClick={() => handleResume(job)}
                        className="text-xs font-semibold rounded-xl h-8 px-2.5 bg-emerald-600 hover:bg-emerald-700 text-white"
                        title="Resume Requisition"
                      >
                        <PlayCircle className="w-3.5 h-3.5" />
                      </Button>
                    )}

                    {job.status === "Draft" && (
                      <Button
                        type="button"
                        variant="default"
                        size="sm"
                        onClick={() => handlePublish(job)}
                        className="text-xs font-semibold rounded-xl h-8 px-2.5 bg-emerald-600 hover:bg-emerald-700 text-white"
                        title="Publish Draft"
                      >
                        <Globe className="w-3.5 h-3.5" />
                      </Button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* 5. Pagination Bar */}
          <div className="rounded-2xl border border-border/80 dark:border-white/10 bg-card p-3.5 sm:p-4 shadow-soft dark:shadow-[0_8px_20px_rgb(0,0,0,0.3)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <span className="text-muted-foreground font-medium">
                Showing{" "}
                <strong className="text-foreground">
                  {Math.min((currentPage - 1) * pageSize + 1, sortedJobs.length)}
                </strong>{" "}
                to{" "}
                <strong className="text-foreground">
                  {Math.min(currentPage * pageSize, sortedJobs.length)}
                </strong>{" "}
                of <strong className="text-foreground">{sortedJobs.length}</strong> requisitions
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

      {/* 6. Job Detail Modal View */}
      {selectedJobForView && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label={`Job Requisition for ${selectedJobForView.title}`}
        >
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-200"
            onClick={() => setSelectedJobForView(null)}
            aria-hidden="true"
          />
          <div className="relative w-full max-w-2xl bg-card border border-border/90 dark:border-white/10 shadow-2xl rounded-2xl z-50 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 fade-in-50 duration-150">
            {/* Header */}
            <div className="flex items-start justify-between p-5 border-b border-border/70 dark:border-white/10">
              <div className="space-y-1.5 min-w-0 pr-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-md border border-primary/20">
                    <Building2 className="w-3 h-3" />
                    <span>{selectedJobForView.organizationName}</span>
                  </span>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-md">
                    {selectedJobForView.department}
                  </span>
                  <JobStatusBadge status={selectedJobForView.status} />
                </div>
                <h3 className="text-xl font-extrabold text-foreground tracking-tight">
                  {selectedJobForView.title}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setSelectedJobForView(null)}
                aria-label="Close requisition view"
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors cursor-pointer shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 space-y-4 overflow-y-auto text-xs">
              {/* Tenant & Visibility Notice */}
              <div className="p-3.5 rounded-xl bg-muted/40 dark:bg-white/5 space-y-2 border border-border/60">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Candidate Portal Visibility:</span>
                  <span className="font-semibold text-foreground flex items-center gap-1.5">
                    {selectedJobForView.status === "Published" ? (
                      <>
                        <Globe className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                          Publicly Discoverable
                        </span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-3.5 h-3.5 text-amber-500" />
                        <span className="text-muted-foreground font-semibold">
                          Internal Recruiter Only ({selectedJobForView.status})
                        </span>
                      </>
                    )}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Workplace & Type:</span>
                  <span className="font-semibold text-foreground">
                    {selectedJobForView.workplaceType} • {selectedJobForView.employmentType}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Location:</span>
                  <span className="font-semibold text-foreground">{selectedJobForView.location}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Target Compensation:</span>
                  <span className="font-bold text-primary">{selectedJobForView.salaryRange}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Required Experience:</span>
                  <span className="font-semibold text-foreground">{selectedJobForView.experienceLevel}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Application Volume:</span>
                  <span className="font-semibold text-foreground">
                    {selectedJobForView.applicationsCount} of {selectedJobForView.targetApplications} target applicants
                  </span>
                </div>
              </div>

              {/* Role Overview */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Role Overview
                </h4>
                <p className="text-xs text-foreground leading-relaxed p-3.5 rounded-xl bg-card border border-border/80">
                  {selectedJobForView.description}
                </p>
              </div>

              {/* Responsibilities */}
              {selectedJobForView.responsibilities && (
                <div className="space-y-1.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Key Responsibilities
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed p-3.5 rounded-xl bg-card border border-border/80">
                    {selectedJobForView.responsibilities}
                  </p>
                </div>
              )}

              {/* Required & Preferred Skills */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Skill Requirements
                </h4>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {selectedJobForView.skills?.map((sk) => (
                    <span
                      key={sk}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-muted/60 text-foreground border border-border/80"
                    >
                      {sk}
                    </span>
                  ))}
                  {selectedJobForView.preferredSkills?.map((psk) => (
                    <span
                      key={psk}
                      className="px-2.5 py-1 rounded-lg text-xs font-medium bg-primary/5 text-primary border border-primary/20"
                    >
                      {psk} (Preferred)
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-muted/30 dark:bg-white/5 border-t border-border/70 flex flex-wrap items-center justify-between gap-2.5">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setSelectedJobForView(null)}
                className="text-xs font-semibold rounded-xl"
              >
                Close View
              </Button>

              <div className="flex flex-wrap items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const j = selectedJobForView
                    window.open(`/jobs/${j.id}?preview=true`, '_blank')
                  }}
                  className="text-xs font-semibold rounded-xl border-primary/30 text-primary hover:bg-primary/10"
                >
                  <ExternalLink className="w-3.5 h-3.5 mr-1" />
                  <span>Preview as Candidate</span>
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const j = selectedJobForView
                    setSelectedJobForView(null)
                    navigate(`/recruiter/jobs/edit/${j.id}`)
                  }}
                  className="text-xs font-semibold rounded-xl"
                >
                  <FileEdit className="w-3.5 h-3.5 mr-1" />
                  <span>Edit Requisition</span>
                </Button>

                <Button
                  type="button"
                  variant="default"
                  size="sm"
                  onClick={() => {
                    setSelectedJobForView(null)
                    navigate("/recruiter/applications")
                  }}
                  className="text-xs font-semibold rounded-xl"
                >
                  <Users className="w-3.5 h-3.5 mr-1" />
                  <span>View {selectedJobForView.applicationsCount} Applications</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 7. Create / Edit Job Form Modal */}
      {isFormModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label={editingJob ? `Edit Job Requisition` : `Create New Job Requisition`}
        >
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-200"
            onClick={() => setIsFormModalOpen(false)}
            aria-hidden="true"
          />
          <div className="relative w-full max-w-2xl bg-card border border-border/90 dark:border-white/10 shadow-2xl rounded-2xl z-50 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 fade-in-50 duration-150">
            {/* Header */}
            <div className="flex items-start justify-between p-5 border-b border-border/70 dark:border-white/10">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-extrabold text-foreground">
                    {editingJob ? "Edit Job Requisition" : "Create New Job Requisition"}
                  </h3>
                  <Badge variant="outline" className="text-xs text-primary border-primary/20 bg-primary/5">
                    Acme Technologies
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Configure requisition details, compensation guidelines, and candidate requirements.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsFormModalOpen(false)}
                className="p-1 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <div className="p-5 space-y-5 overflow-y-auto text-xs">
              {/* Validation alert banner */}
              {Object.keys(formErrors).length > 0 && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 space-y-1">
                  <span className="font-bold flex items-center gap-1.5 text-xs">
                    <AlertCircle className="w-4 h-4" />
                    <span>Please resolve the following:</span>
                  </span>
                  <ul className="list-disc pl-5 text-[11px] space-y-0.5">
                    {Object.values(formErrors).map((err, i) => (
                      <li key={i}>{err}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Section 1: Basic Information */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-primary" />
                  <span>1. Basic Requisition Details</span>
                </h4>

                <div>
                  <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
                    Job Title *
                  </label>
                  <Input
                    type="text"
                    required
                    placeholder="e.g. Staff Fullstack Engineer"
                    value={formData.title}
                    onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                    className="h-9 text-xs rounded-xl"
                  />
                  {formErrors.title && (
                    <span className="text-[10px] text-rose-500 mt-1 block">{formErrors.title}</span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
                      Department *
                    </label>
                    <select
                      value={formData.department}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, department: e.target.value }))
                      }
                      className="w-full h-9 px-3 text-xs font-medium bg-background border border-border/80 rounded-xl text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                    >
                      {JOB_DEPARTMENTS.filter((d) => d !== "All Departments").map((dept) => (
                        <option key={dept} value={dept}>
                          {dept}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
                      Employment Type
                    </label>
                    <select
                      value={formData.employmentType}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, employmentType: e.target.value }))
                      }
                      className="w-full h-9 px-3 text-xs font-medium bg-background border border-border/80 rounded-xl text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                    >
                      {EMPLOYMENT_TYPES.filter((t) => t !== "All Types").map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
                      Workplace Type
                    </label>
                    <select
                      value={formData.workplaceType}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, workplaceType: e.target.value }))
                      }
                      className="w-full h-9 px-3 text-xs font-medium bg-background border border-border/80 rounded-xl text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                    >
                      {WORKPLACE_TYPES.filter((w) => w !== "All Workplace Types").map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
                      Location *
                    </label>
                    <Input
                      type="text"
                      required
                      placeholder="e.g. Remote — India or Bangalore"
                      value={formData.location}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, location: e.target.value }))
                      }
                      className="h-9 text-xs rounded-xl"
                    />
                    {formErrors.location && (
                      <span className="text-[10px] text-rose-500 mt-1 block">
                        {formErrors.location}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Section 2: Job Description & Qualifications */}
              <div className="space-y-3 pt-3 border-t border-border/50">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-primary" />
                  <span>2. Role Summary & Requirements</span>
                </h4>

                <div>
                  <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
                    Job Summary *
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Brief description of the role's mission and team context..."
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, description: e.target.value }))
                    }
                    className="w-full p-2.5 text-xs bg-background border border-border/80 rounded-xl text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  {formErrors.description && (
                    <span className="text-[10px] text-rose-500 mt-0.5 block">
                      {formErrors.description}
                    </span>
                  )}
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
                    Key Responsibilities *
                  </label>
                  <textarea
                    rows={2}
                    placeholder="What will this hire achieve and lead day-to-day..."
                    value={formData.responsibilities}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, responsibilities: e.target.value }))
                    }
                    className="w-full p-2.5 text-xs bg-background border border-border/80 rounded-xl text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  {formErrors.responsibilities && (
                    <span className="text-[10px] text-rose-500 mt-0.5 block">
                      {formErrors.responsibilities}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
                      Required Skills (comma separated)
                    </label>
                    <Input
                      type="text"
                      placeholder="e.g. React 19, TypeScript, Vite"
                      value={formData.skills}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, skills: e.target.value }))
                      }
                      className="h-9 text-xs rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
                      Preferred Skills
                    </label>
                    <Input
                      type="text"
                      placeholder="e.g. GraphQL, Tailwind, CI/CD"
                      value={formData.preferredSkills}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, preferredSkills: e.target.value }))
                      }
                      className="h-9 text-xs rounded-xl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
                      Min Experience (Years)
                    </label>
                    <Input
                      type="number"
                      min="0"
                      max="25"
                      value={formData.minExperience}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, minExperience: e.target.value }))
                      }
                      className="h-9 text-xs rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
                      Max Experience (Years)
                    </label>
                    <Input
                      type="number"
                      min="0"
                      max="30"
                      value={formData.maxExperience}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, maxExperience: e.target.value }))
                      }
                      className="h-9 text-xs rounded-xl"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
                    Education Requirements
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g. Bachelor's in CS or equivalent experience"
                    value={formData.education}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, education: e.target.value }))
                    }
                    className="h-9 text-xs rounded-xl"
                  />
                </div>
              </div>

              {/* Section 3: Compensation & Openings */}
              <div className="space-y-3 pt-3 border-t border-border/50">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Coins className="w-3.5 h-3.5 text-primary" />
                  <span>3. Compensation & Requisition Target</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
                      Min Salary (INR ₹)
                    </label>
                    <Input
                      type="number"
                      value={formData.salaryMin}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, salaryMin: e.target.value }))
                      }
                      className="h-9 text-xs rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
                      Max Salary (INR ₹)
                    </label>
                    <Input
                      type="number"
                      value={formData.salaryMax}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, salaryMax: e.target.value }))
                      }
                      className="h-9 text-xs rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
                      Number of Openings
                    </label>
                    <Input
                      type="number"
                      min="1"
                      value={formData.openings}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, openings: e.target.value }))
                      }
                      className="h-9 text-xs rounded-xl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
                      Target Applications
                    </label>
                    <Input
                      type="number"
                      min="10"
                      value={formData.targetApplications}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, targetApplications: e.target.value }))
                      }
                      className="h-9 text-xs rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
                      Application Deadline
                    </label>
                    <Input
                      type="date"
                      value={formData.deadline}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, deadline: e.target.value }))
                      }
                      className="h-9 text-xs rounded-xl"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Actions Footer */}
            <div className="p-4 bg-muted/30 dark:bg-white/5 border-t border-border/70 flex items-center justify-between gap-2.5">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsFormModalOpen(false)}
                className="text-xs rounded-xl"
              >
                Cancel
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleFormSubmit(true)}
                  className="text-xs font-semibold rounded-xl text-muted-foreground hover:text-foreground"
                >
                  <FileEdit className="w-3.5 h-3.5 mr-1.5" />
                  <span>Save as Draft</span>
                </Button>

                <Button
                  type="button"
                  variant="default"
                  size="sm"
                  onClick={() => handleFormSubmit(false)}
                  className="text-xs font-semibold rounded-xl"
                >
                  <Globe className="w-3.5 h-3.5 mr-1.5" />
                  <span>{editingJob ? "Save & Publish" : "Publish Requisition"}</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 8. Destructive Confirmation Dialog: Close Requisition */}
      {jobToClose && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Confirm Close Requisition"
        >
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-200"
            onClick={() => setJobToClose(null)}
            aria-hidden="true"
          />
          <div className="relative w-full max-w-md bg-card border border-border/90 dark:border-white/10 shadow-2xl rounded-2xl z-50 p-6 space-y-4 animate-in zoom-in-95 fade-in-50 duration-150">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-extrabold text-foreground">
                  Close Requisition?
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Are you sure you want to close <strong className="text-foreground">{jobToClose.title}</strong>? Candidates will no longer be able to discover or apply to this role.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-muted/40 border border-border/60 text-[11px] text-muted-foreground leading-relaxed">
              Active candidates currently in the pipeline will remain accessible under the Applications module.
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setJobToClose(null)}
                className="text-xs rounded-xl"
              >
                Cancel
              </Button>

              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={handleConfirmClose}
                className="text-xs font-semibold rounded-xl bg-rose-600 hover:bg-rose-700 text-white"
              >
                <XCircle className="w-3.5 h-3.5 mr-1" />
                <span>Confirm Close</span>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 9. Destructive Confirmation Dialog: Archive Requisition */}
      {jobToArchive && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Confirm Archive Requisition"
        >
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-200"
            onClick={() => setJobToArchive(null)}
            aria-hidden="true"
          />
          <div className="relative w-full max-w-md bg-card border border-border/90 dark:border-white/10 shadow-2xl rounded-2xl z-50 p-6 space-y-4 animate-in zoom-in-95 fade-in-50 duration-150">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-500/10 text-slate-600 flex items-center justify-center shrink-0">
                <Archive className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-extrabold text-foreground">
                  Archive Requisition?
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Are you sure you want to archive <strong className="text-foreground">{jobToArchive.title}</strong>? It will be moved to historical records under Acme Technologies.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setJobToArchive(null)}
                className="text-xs rounded-xl"
              >
                Cancel
              </Button>

              <Button
                type="button"
                variant="default"
                size="sm"
                onClick={handleConfirmArchive}
                className="text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-900 text-white dark:bg-slate-700"
              >
                <Archive className="w-3.5 h-3.5 mr-1" />
                <span>Confirm Archive</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

