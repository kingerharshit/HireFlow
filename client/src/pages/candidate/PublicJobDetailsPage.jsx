import * as React from "react"
import { useState, useMemo } from "react"
import { useParams, useSearchParams, useNavigate, Link } from "react-router-dom"
import {
  Briefcase,
  Building2,
  MapPin,
  Clock,
  Calendar,
  CheckCircle2,
  Share2,
  Bookmark,
  BookmarkCheck,
  Sparkles,
  ArrowLeft,
  ExternalLink,
  FileText,
  Upload,
  User,
  Mail,
  Phone,
  Globe,
  Check,
  X,
  AlertTriangle,
  AlertCircle,
  Coins,
  GraduationCap,
  Send,
  ShieldCheck,
  Eye,
  Info,
  Layers,
  ChevronRight,
  ArrowRight,
  FileCheck,
} from "lucide-react"
import { useJobs } from "@/context/JobsContext"
import { DEMO_JOBS, DEMO_ORGANIZATION } from "@/features/jobs/demoJobsData"
import { BrandLogo } from "@/components/common/BrandLogo"
import { ThemeToggle } from "@/components/common/ThemeToggle"
import { JobStatusBadge } from "@/components/dashboard/JobStatusBadge"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export function PublicJobDetailsPage() {
  const { jobId } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { getJobById, jobs } = useJobs()

  const isPreview = searchParams.get("preview") === "true"

  // Lookup job from context or fallback to demo dataset
  const job = useMemo(() => {
    if (getJobById) {
      const found = getJobById(jobId)
      if (found) return found
    }
    return (jobs || DEMO_JOBS).find((j) => j.id === jobId) || null
  }, [jobId, getJobById, jobs])

  // UI Interactive States
  const [isSaved, setIsSaved] = useState(false)
  const [toastMessage, setToastMessage] = useState(null)
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false)

  // Candidate Application Form States
  const [applicantData, setApplicantData] = useState({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    linkedinUrl: "",
    portfolioUrl: "",
    coverNote: "",
    resumeFileName: "",
    resumeFileSize: "",
    agreeConsent: false,
  })
  const [formErrors, setFormErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [applicationSubmitted, setApplicationSubmitted] = useState(false)

  // Quick toast helper
  const showToast = (message) => {
    setToastMessage(message)
    setTimeout(() => {
      setToastMessage((prev) => (prev === message ? null : prev))
    }, 4000)
  }

  // Handle Share Job: copies public link
  const handleShareJob = async () => {
    const url = window.location.href.split("?")[0]
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url)
        showToast("Job link copied to clipboard! Share it with prospective applicants.")
      } else {
        showToast("Link: " + url)
      }
    } catch {
      showToast("Link: " + url)
    }
  }

  // Handle Save Job
  const handleToggleSave = () => {
    setIsSaved((prev) => {
      const next = !prev
      if (next) {
        showToast(`Saved "${job?.title || "Job"}" to your bookmarks.`)
      } else {
        showToast(`Removed from your saved bookmarks.`)
      }
      return next
    })
  }

  // Handle simulated resume file drop/pick
  const handleSimulateResumeUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const sizeMb = (file.size / (1024 * 1024)).toFixed(2)
      setApplicantData((prev) => ({
        ...prev,
        resumeFileName: file.name,
        resumeFileSize: `${sizeMb} MB`,
      }))
      if (formErrors.resume) {
        setFormErrors((prev) => ({ ...prev, resume: null }))
      }
    }
  }

  const handleSelectSampleResume = () => {
    setApplicantData((prev) => ({
      ...prev,
      resumeFileName: "Alex_Morgan_Senior_Engineer_CV.pdf",
      resumeFileSize: "1.4 MB",
    }))
    if (formErrors.resume) {
      setFormErrors((prev) => ({ ...prev, resume: null }))
    }
  }

  // Validate Application Form
  const validateForm = () => {
    const errors = {}
    if (!applicantData.fullName.trim()) {
      errors.fullName = "Full name is required."
    }
    if (!applicantData.email.trim()) {
      errors.email = "Email address is required."
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(applicantData.email.trim())) {
      errors.email = "Please enter a valid email address."
    }
    if (!applicantData.resumeFileName) {
      errors.resume = "Please upload or attach your resume/CV."
    }
    if (!applicantData.agreeConsent) {
      errors.agreeConsent = "You must consent to the application data processing."
    }
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Handle Submit Application
  const handleSubmitApplication = (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setApplicationSubmitted(true)
    }, 1200)
  }

  // Reset application modal
  const handleCloseApplyModal = () => {
    setIsApplyModalOpen(false)
    // Delay resetting state until modal animation finishes
    setTimeout(() => {
      if (applicationSubmitted) {
        setApplicationSubmitted(false)
        setApplicantData({
          fullName: "",
          email: "",
          phone: "",
          location: "",
          linkedinUrl: "",
          portfolioUrl: "",
          coverNote: "",
          resumeFileName: "",
          resumeFileSize: "",
          agreeConsent: false,
        })
        setFormErrors({})
      }
    }, 300)
  }

  // ==========================================
  // CASE 1: Job Not Found (404 state)
  // ==========================================
  if (!job) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col antialiased selection:bg-primary/20">
        {/* Navigation Bar */}
        <header className="border-b border-border/70 bg-card/80 backdrop-blur-md sticky top-0 z-40">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
            <BrandLogo size="default" to="/recruiter/dashboard" />
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <Link to="/recruiter/jobs">
                <Button variant="outline" size="sm" className="text-xs font-semibold rounded-xl">
                  Recruiter Workspace
                </Button>
              </Link>
            </div>
          </div>
        </header>

        {/* 404 Hero */}
        <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
          <div className="max-w-md w-full text-center space-y-5 bg-card border border-border/80 dark:border-white/10 p-8 rounded-3xl shadow-xl animate-in fade-in-50 zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <Badge variant="outline" className="text-[11px] font-mono text-muted-foreground border-border/80">
                Requisition ID: {jobId}
              </Badge>
              <h1 className="text-2xl font-black tracking-tight text-foreground">
                Job Requisition Not Found
              </h1>
              <p className="text-sm text-muted-foreground leading-relaxed">
                The job requisition you are looking for does not exist or may have been unlisted or removed.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2.5">
              <Link to="/recruiter/jobs" className="w-full sm:w-auto">
                <Button variant="default" className="w-full text-xs font-bold rounded-xl gap-1.5">
                  <Briefcase className="w-4 h-4" />
                  <span>Browse Active Openings</span>
                </Button>
              </Link>
              <Button
                variant="outline"
                onClick={() => navigate(-1)}
                className="w-full sm:w-auto text-xs font-semibold rounded-xl gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Go Back</span>
              </Button>
            </div>
          </div>
        </main>
      </div>
    )
  }

  // ==========================================
  // CASE 2: Non-Published Job without Preview Mode
  // ==========================================
  const isPublished = job.status === "Published"

  if (!isPublished && !isPreview) {
    const getStatusExplanation = () => {
      switch (job.status) {
        case "Paused":
          return {
            title: "Applications Currently Paused",
            desc: "Acme Technologies has temporarily paused new candidate submissions for this requisition while active candidates are being reviewed.",
            badgeColor: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20",
          }
        case "Closed":
          return {
            title: "Requisition Closed",
            desc: "This position at Acme Technologies has been successfully filled or recruitment has completed.",
            badgeColor: "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20",
          }
        case "Draft":
          return {
            title: "Requisition Not Yet Published",
            desc: "This requisition is currently an internal draft undergoing review by the Acme Technologies recruitment team.",
            badgeColor: "bg-muted text-muted-foreground border-border",
          }
        case "Archived":
        default:
          return {
            title: "Requisition Archived",
            desc: "This opening has been archived and is no longer accepting candidate applications.",
            badgeColor: "bg-muted text-muted-foreground border-border",
          }
      }
    }

    const explanation = getStatusExplanation()

    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col antialiased selection:bg-primary/20">
        {/* Navigation Bar */}
        <header className="border-b border-border/70 bg-card/80 backdrop-blur-md sticky top-0 z-40">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BrandLogo size="default" to="/recruiter/dashboard" />
              <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-border/70">
                <span className="text-xs font-bold text-foreground">Acme Technologies</span>
                <span className="text-[11px] text-muted-foreground font-medium">Careers Portal</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <Link to="/recruiter/jobs">
                <Button variant="outline" size="sm" className="text-xs font-semibold rounded-xl">
                  Recruiter Workspace
                </Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Unavailable Hero */}
        <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
          <div className="max-w-lg w-full text-center space-y-6 bg-card border border-border/80 dark:border-white/10 p-8 sm:p-10 rounded-3xl shadow-xl animate-in fade-in-50 zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-2xl bg-muted/80 text-muted-foreground border border-border flex items-center justify-center mx-auto">
              <Briefcase className="w-8 h-8 text-primary" />
            </div>

            <div className="space-y-2.5">
              <div className="flex items-center justify-center gap-2">
                <Badge variant="outline" className={cn("text-xs font-semibold", explanation.badgeColor)}>
                  {job.status} Position
                </Badge>
                <span className="text-xs text-muted-foreground font-mono">
                  {job.id}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
                {explanation.title}
              </h1>

              <div className="p-3.5 rounded-2xl bg-muted/40 dark:bg-white/5 border border-border/60 text-left space-y-1">
                <div className="text-xs font-bold text-foreground flex items-center gap-2">
                  <Building2 className="w-3.5 h-3.5 text-primary" />
                  <span>{job.organizationName || "Acme Technologies"} — {job.department}</span>
                </div>
                <div className="text-sm font-extrabold text-foreground">{job.title}</div>
                <div className="text-[11px] text-muted-foreground flex items-center gap-2">
                  <span>{job.location}</span>
                  <span>•</span>
                  <span>{job.workplaceType}</span>
                </div>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed pt-1">
                {explanation.desc}
              </p>
            </div>

            {/* Recruiter Preview Callout */}
            <div className="p-3.5 rounded-2xl bg-primary/5 border border-primary/20 text-xs text-left space-y-2">
              <div className="flex items-center gap-2 font-bold text-primary">
                <Eye className="w-4 h-4 shrink-0" />
                <span>Are you a recruiter or hiring manager?</span>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                You can review this unpublished requisition in Recruiter Preview Mode using your authorized internal link.
              </p>
              <Link
                to={`/jobs/${job.id}?preview=true`}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline cursor-pointer"
              >
                <span>Open in Recruiter Preview Mode</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2.5">
              <Link to="/recruiter/jobs" className="w-full sm:w-auto">
                <Button variant="default" className="w-full text-xs font-bold rounded-xl gap-1.5">
                  <Briefcase className="w-4 h-4" />
                  <span>View All Open Positions</span>
                </Button>
              </Link>
              <Button
                variant="outline"
                onClick={() => navigate(-1)}
                className="w-full sm:w-auto text-xs font-semibold rounded-xl gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Go Back</span>
              </Button>
            </div>
          </div>
        </main>
      </div>
    )
  }

  // ==========================================
  // CASE 3: Published Requisition OR Preview Mode
  // ==========================================
  const responsibilitiesList = useMemo(() => {
    if (!job.responsibilities) return []
    if (Array.isArray(job.responsibilities)) return job.responsibilities
    return job.responsibilities
      .split(";")
      .map((r) => r.trim())
      .filter(Boolean)
  }, [job.responsibilities])

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col antialiased selection:bg-primary/20">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 max-w-sm w-full p-3.5 rounded-2xl bg-card border border-primary/30 text-xs font-semibold text-foreground shadow-2xl flex items-center justify-between gap-3 animate-in fade-in-50 slide-in-from-top-3 duration-200">
          <div className="flex items-center gap-2.5 min-w-0">
            <Sparkles className="w-4 h-4 text-primary shrink-0" />
            <span className="truncate">{toastMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-[11px] text-muted-foreground hover:text-foreground font-bold px-1.5 py-0.5 rounded-md hover:bg-muted cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Recruiter Preview Mode Sticky Notification Banner */}
      {isPreview && (
        <aside
          aria-label="Recruiter Preview Mode"
          className="bg-gradient-to-r from-amber-500/15 via-primary/15 to-amber-500/15 border-b border-primary/30 text-foreground py-2.5 px-4 sm:px-6 sticky top-0 z-50 backdrop-blur-md shadow-xs"
        >
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs">
            <div className="flex items-center gap-2.5 text-center sm:text-left">
              <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-primary text-white font-black shrink-0">
                <Eye className="w-3.5 h-3.5" />
              </span>
              <div>
                <span className="font-extrabold text-foreground">
                  Recruiter Preview Mode — Internal Requisition
                </span>
                <span className="text-muted-foreground ml-2 hidden md:inline">
                  You are previewing how candidates see this listing. Internal metrics and applicant counts are hidden.
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <JobStatusBadge status={job.status} />
              <Link to="/recruiter/jobs">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 text-[11px] font-bold rounded-lg border-primary/40 hover:bg-primary/10"
                >
                  Back to Jobs
                </Button>
              </Link>
              <Link to={`/recruiter/jobs/edit/${job.id}`}>
                <Button
                  size="sm"
                  variant="default"
                  className="h-7 text-[11px] font-bold rounded-lg"
                >
                  Edit Requisition
                </Button>
              </Link>
            </div>
          </div>
        </aside>
      )}

      {/* Top Careers Navigation Bar */}
      <header className={cn(
        "border-b border-border/70 bg-card/85 backdrop-blur-md z-40 transition-all",
        isPreview ? "relative" : "sticky top-0"
      )}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Brand & Organization Indicator */}
          <div className="flex items-center gap-3 min-w-0">
            <BrandLogo size="default" to="/recruiter/dashboard" />
            <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-border/70 min-w-0">
              <span className="text-xs font-bold text-foreground truncate">
                {job.organizationName || "Acme Technologies"}
              </span>
              <Badge variant="outline" className="text-[10px] font-semibold text-primary border-primary/25 bg-primary/5 shrink-0">
                Careers Portal
              </Badge>
            </div>
          </div>

          {/* Action Links & Theme Toggle */}
          <div className="flex items-center gap-2.5 shrink-0">
            <ThemeToggle />

            <Button
              variant="outline"
              size="sm"
              onClick={handleShareJob}
              className="text-xs font-semibold rounded-xl gap-1.5 hidden sm:inline-flex"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share</span>
            </Button>

            <Button
              variant={isSaved ? "secondary" : "outline"}
              size="sm"
              onClick={handleToggleSave}
              className={cn(
                "text-xs font-semibold rounded-xl gap-1.5 hidden sm:inline-flex",
                isSaved && "text-primary border-primary/30"
              )}
            >
              {isSaved ? <BookmarkCheck className="w-3.5 h-3.5 text-primary" /> : <Bookmark className="w-3.5 h-3.5" />}
              <span>{isSaved ? "Saved" : "Save Job"}</span>
            </Button>

            <Button
              variant="default"
              size="sm"
              onClick={() => setIsApplyModalOpen(true)}
              className="text-xs font-bold rounded-xl gap-1.5 shadow-md shadow-brand-coral/20 hover:scale-[1.02] transition-transform"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Apply Now</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Breadcrumbs & Navigation Ribbon */}
      <nav aria-label="Breadcrumb" className="border-b border-border/50 bg-muted/20 dark:bg-white/[0.02]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5 overflow-hidden">
            <Link
              to="/recruiter/jobs"
              className="hover:text-foreground transition-colors flex items-center gap-1 font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Careers</span>
            </Link>
            <ChevronRight className="w-3 h-3 text-muted-foreground/60 shrink-0" />
            <span className="font-medium text-muted-foreground truncate">{job.department}</span>
            <ChevronRight className="w-3 h-3 text-muted-foreground/60 shrink-0" />
            <span className="font-semibold text-foreground truncate">{job.title}</span>
          </div>

          <div className="hidden md:flex items-center gap-2 text-[11px] font-mono">
            <span>Requisition: {job.id}</span>
          </div>
        </div>
      </nav>

      {/* Main Page Layout: Two Columns on Desktop */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 lg:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ========================================================= */}
          {/* LEFT COLUMN: Main Requisition Content (approx 68% / 8 cols) */}
          {/* ========================================================= */}
          <div className="lg:col-span-8 space-y-8 min-w-0">
            
            {/* 1. Hero Requisition Header */}
            <div className="space-y-4 pb-6 border-b border-border/70">
              {/* Organization & Badges */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-card border border-border text-xs font-bold text-foreground">
                  <Building2 className="w-3.5 h-3.5 text-primary" />
                  <span>{job.organizationName || "Acme Technologies"}</span>
                </div>
                <Badge variant="outline" className="text-xs font-medium border-border/80">
                  {job.department}
                </Badge>
                <Badge variant="outline" className="text-xs font-medium border-border/80">
                  {job.employmentType}
                </Badge>
                <Badge variant="outline" className="text-xs font-medium border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/5">
                  {job.workplaceType}
                </Badge>
                {isPreview && (
                  <Badge variant="outline" className="text-xs font-bold border-amber-500/40 text-amber-600 dark:text-amber-400 bg-amber-500/10">
                    Preview: {job.status}
                  </Badge>
                )}
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-foreground leading-tight">
                {job.title}
              </h1>

              {/* Quick Meta Chips */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-card border border-border/70 flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <span className="text-[11px] text-muted-foreground block font-medium">Location</span>
                    <span className="text-xs font-bold text-foreground truncate block">{job.location}</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-card border border-border/70 flex items-start gap-2.5">
                  <Coins className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <span className="text-[11px] text-muted-foreground block font-medium">Compensation</span>
                    <span className="text-xs font-bold text-foreground truncate block">{job.salaryRange}</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-card border border-border/70 flex items-start gap-2.5 col-span-2 sm:col-span-1">
                  <Calendar className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <span className="text-[11px] text-muted-foreground block font-medium">Deadline</span>
                    <span className="text-xs font-bold text-foreground truncate block">{job.deadline}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Role Overview */}
            <section className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
                <h2 className="text-lg font-extrabold text-foreground tracking-tight">
                  About the Role
                </h2>
              </div>
              <p className="text-sm text-foreground/80 leading-relaxed font-normal whitespace-pre-line pl-9">
                {job.description}
              </p>
            </section>

            {/* 3. Key Responsibilities */}
            {responsibilitiesList.length > 0 && (
              <section className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <h2 className="text-lg font-extrabold text-foreground tracking-tight">
                    Key Responsibilities
                  </h2>
                </div>
                <div className="pl-9 space-y-2.5">
                  {responsibilitiesList.map((resp, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3 h-3" />
                      </div>
                      <span className="text-sm text-foreground/80 leading-relaxed">{resp}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 4. Required Technical Skills */}
            <section className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h2 className="text-lg font-extrabold text-foreground tracking-tight">
                  Required Core Skills
                </h2>
              </div>
              <div className="pl-9 flex flex-wrap gap-2">
                {(job.skills || []).map((skill, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-primary/10 text-primary border border-primary/20 shadow-2xs"
                  >
                    <Check className="w-3 h-3" />
                    <span>{skill}</span>
                  </span>
                ))}
              </div>
            </section>

            {/* 5. Preferred Skills & Bonus Qualifications */}
            {job.preferredSkills && job.preferredSkills.length > 0 && (
              <section className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-muted text-muted-foreground flex items-center justify-center">
                    <Layers className="w-4 h-4" />
                  </div>
                  <h2 className="text-lg font-extrabold text-foreground tracking-tight">
                    Preferred & Nice-to-Have Skills
                  </h2>
                </div>
                <div className="pl-9 flex flex-wrap gap-2">
                  {job.preferredSkills.map((pref, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-semibold bg-muted/60 text-muted-foreground border border-border"
                    >
                      {pref}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* 6. Experience & Education Requirements */}
            <section className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <h2 className="text-lg font-extrabold text-foreground tracking-tight">
                  Qualifications & Experience
                </h2>
              </div>
              <div className="pl-9 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="p-4 rounded-2xl bg-card border border-border/70 space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
                    Experience Level
                  </span>
                  <div className="text-sm font-extrabold text-foreground">
                    {job.experienceLevel || `${job.minExperience}+ years`}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Practical industry experience delivering scalable software solutions.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-card border border-border/70 space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
                    Education
                  </span>
                  <div className="text-sm font-extrabold text-foreground">
                    {job.education}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Relevant formal degree or demonstrable practical project experience.
                  </p>
                </div>
              </div>
            </section>

            {/* 7. About Acme Technologies */}
            <section className="p-5 sm:p-6 rounded-3xl bg-card border border-border/80 dark:border-white/10 shadow-soft space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-black">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-foreground">
                    Working at Acme Technologies
                  </h3>
                  <span className="text-xs text-muted-foreground">
                    Enterprise SaaS & AI-driven Talent Cloud
                  </span>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-foreground/80 leading-relaxed">
                Acme Technologies builds intelligent, high-throughput cloud platforms powering thousands of recruitment and workforce transactions daily. We champion engineering excellence, open feedback, competitive compensation, flexible remote arrangements, and continuous learning.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 text-xs">
                <div className="p-2.5 rounded-xl bg-muted/40 dark:bg-white/5 border border-border/60 text-center font-bold text-foreground">
                  Remote-First Culture
                </div>
                <div className="p-2.5 rounded-xl bg-muted/40 dark:bg-white/5 border border-border/60 text-center font-bold text-foreground">
                  Health & Wellness
                </div>
                <div className="p-2.5 rounded-xl bg-muted/40 dark:bg-white/5 border border-border/60 text-center font-bold text-foreground">
                  Learning Stipend
                </div>
                <div className="p-2.5 rounded-xl bg-muted/40 dark:bg-white/5 border border-border/60 text-center font-bold text-foreground">
                  Equity Grants
                </div>
              </div>
            </section>

            {/* 8. Candidate Application Journey (4 steps) */}
            <section className="p-5 sm:p-6 rounded-3xl bg-muted/30 dark:bg-white/[0.02] border border-border/70 space-y-4">
              <h3 className="text-sm font-extrabold text-foreground flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                <span>Our Transparent Hiring Process</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-card border border-border/70 space-y-1">
                  <span className="text-[10px] font-black text-primary uppercase">Step 01</span>
                  <div className="font-bold text-foreground">Quick Apply</div>
                  <p className="text-[11px] text-muted-foreground">Submit resume & contact details in under 2 minutes.</p>
                </div>
                <div className="p-3 rounded-xl bg-card border border-border/70 space-y-1">
                  <span className="text-[10px] font-black text-primary uppercase">Step 02</span>
                  <div className="font-bold text-foreground">Talent Screen</div>
                  <p className="text-[11px] text-muted-foreground">30-min recruiter conversation discussing your aspirations.</p>
                </div>
                <div className="p-3 rounded-xl bg-card border border-border/70 space-y-1">
                  <span className="text-[10px] font-black text-primary uppercase">Step 03</span>
                  <div className="font-bold text-foreground">Technical Deep Dive</div>
                  <p className="text-[11px] text-muted-foreground">Practical architecture & system collaboration session.</p>
                </div>
                <div className="p-3 rounded-xl bg-card border border-border/70 space-y-1">
                  <span className="text-[10px] font-black text-primary uppercase">Step 04</span>
                  <div className="font-bold text-foreground">Offer & Onboard</div>
                  <p className="text-[11px] text-muted-foreground">Competitive compensation package & seamless setup.</p>
                </div>
              </div>
            </section>

            {/* 9. Bottom Call-to-Action Bar */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/25 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <h3 className="text-base font-extrabold text-foreground">
                  Ready to shape the future of recruitment software?
                </h3>
                <p className="text-xs text-muted-foreground">
                  Join Acme Technologies and work on high-scale distributed applications.
                </p>
              </div>
              <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleShareJob}
                  className="text-xs font-semibold rounded-xl flex-1 sm:flex-none"
                >
                  <Share2 className="w-3.5 h-3.5 mr-1.5" />
                  <span>Share</span>
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => setIsApplyModalOpen(true)}
                  className="text-xs font-bold rounded-xl flex-1 sm:flex-none shadow-md shadow-brand-coral/25"
                >
                  <Send className="w-3.5 h-3.5 mr-1.5" />
                  <span>Apply for this Role</span>
                </Button>
              </div>
            </div>

          </div>

          {/* ========================================================= */}
          {/* RIGHT COLUMN: Sticky Job Overview & Actions (approx 32% / 4 cols) */}
          {/* ========================================================= */}
          <aside aria-label="Job Summary Sidebar" className="lg:col-span-4 space-y-4">
            <div className="sticky top-24 space-y-4">
              
              {/* Main Sticky Action Card */}
              <div className="p-5 sm:p-6 rounded-3xl bg-card border border-border/90 dark:border-white/10 shadow-lg space-y-5">
                
                {/* Compensation Highlight */}
                <div className="space-y-1 pb-4 border-b border-border/70">
                  <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                    Offered Salary
                  </span>
                  <div className="text-xl sm:text-2xl font-black text-foreground text-primary">
                    {job.salaryRange}
                  </div>
                  <span className="text-[11px] text-muted-foreground block">
                    Annual base compensation ({job.currency || "INR"})
                  </span>
                </div>

                {/* Primary Action Buttons */}
                <div className="space-y-2.5">
                  <Button
                    type="button"
                    variant="default"
                    size="lg"
                    onClick={() => setIsApplyModalOpen(true)}
                    className="w-full text-sm font-extrabold rounded-2xl shadow-lg shadow-brand-coral/25 hover:scale-[1.01] transition-transform"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    <span>Apply Now</span>
                  </Button>

                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      type="button"
                      variant={isSaved ? "secondary" : "outline"}
                      onClick={handleToggleSave}
                      className={cn(
                        "text-xs font-semibold rounded-xl w-full",
                        isSaved && "text-primary border-primary/30"
                      )}
                    >
                      {isSaved ? (
                        <>
                          <BookmarkCheck className="w-3.5 h-3.5 mr-1.5 text-primary" />
                          <span>Saved</span>
                        </>
                      ) : (
                        <>
                          <Bookmark className="w-3.5 h-3.5 mr-1.5" />
                          <span>Save Job</span>
                        </>
                      )}
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleShareJob}
                      className="text-xs font-semibold rounded-xl w-full"
                    >
                      <Share2 className="w-3.5 h-3.5 mr-1.5" />
                      <span>Share</span>
                    </Button>
                  </div>
                </div>

                {/* Requisition Meta Checklist */}
                <div className="pt-2 space-y-3 text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-border/50">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-muted-foreground" />
                      <span>Company</span>
                    </span>
                    <span className="font-bold text-foreground">
                      {job.organizationName || "Acme Technologies"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pb-2 border-b border-border/50">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5 text-muted-foreground" />
                      <span>Department</span>
                    </span>
                    <span className="font-bold text-foreground">{job.department}</span>
                  </div>

                  <div className="flex items-center justify-between pb-2 border-b border-border/50">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-muted-foreground" />
                      <span>Workplace</span>
                    </span>
                    <span className="font-bold text-foreground">{job.workplaceType}</span>
                  </div>

                  <div className="flex items-center justify-between pb-2 border-b border-border/50">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                      <span>Location</span>
                    </span>
                    <span className="font-bold text-foreground text-right">{job.location}</span>
                  </div>

                  <div className="flex items-center justify-between pb-2 border-b border-border/50">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                      <span>Employment</span>
                    </span>
                    <span className="font-bold text-foreground">{job.employmentType}</span>
                  </div>

                  <div className="flex items-center justify-between pb-2 border-b border-border/50">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-muted-foreground" />
                      <span>Openings</span>
                    </span>
                    <span className="font-bold text-foreground">{job.openings} positions</span>
                  </div>

                  <div className="flex items-center justify-between pb-2 border-b border-border/50">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                      <span>Deadline</span>
                    </span>
                    <span className="font-bold text-foreground">{job.deadline}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <Info className="w-3.5 h-3.5 text-muted-foreground" />
                      <span>Posted Date</span>
                    </span>
                    <span className="font-bold text-foreground">{job.publishedDate}</span>
                  </div>
                </div>

                {/* Candidate Trust / Privacy Badge */}
                <div className="p-3 rounded-2xl bg-muted/40 dark:bg-white/5 border border-border/60 flex items-start gap-2.5 text-[11px] text-muted-foreground leading-normal">
                  <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>
                    Your applicant data is encrypted and securely reviewed exclusively by Acme Technologies recruiters.
                  </span>
                </div>

              </div>

              {/* Need help / Recruiter contact info */}
              <div className="p-4 rounded-2xl bg-muted/20 border border-border/60 text-xs text-muted-foreground space-y-1">
                <span className="font-bold text-foreground block">Questions regarding this opening?</span>
                <p className="text-[11px] leading-relaxed">
                  Reach out to the Acme Technologies talent team via <span className="font-semibold text-foreground">careers@acmetech.demo</span> referencing requisition <code className="text-[10px] font-mono bg-muted px-1 py-0.5 rounded">{job.id}</code>.
                </p>
              </div>

            </div>
          </aside>

        </div>
      </main>

      {/* Mobile Bottom Sticky Bar */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-card/95 backdrop-blur-md border-t border-border/80 p-3.5 flex items-center justify-between gap-3 shadow-2xl">
        <div className="min-w-0 flex-1">
          <div className="text-xs font-bold text-foreground truncate">{job.title}</div>
          <div className="text-[11px] text-primary font-bold">{job.salaryRange}</div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button
            type="button"
            variant={isSaved ? "secondary" : "outline"}
            size="sm"
            onClick={handleToggleSave}
            className="text-xs font-semibold rounded-xl h-9 px-3"
          >
            {isSaved ? <BookmarkCheck className="w-4 h-4 text-primary" /> : <Bookmark className="w-4 h-4" />}
          </Button>
          <Button
            type="button"
            variant="default"
            size="sm"
            onClick={() => setIsApplyModalOpen(true)}
            className="text-xs font-bold rounded-xl h-9 px-4 shadow-md shadow-brand-coral/25"
          >
            <Send className="w-3.5 h-3.5 mr-1.5" />
            <span>Apply Now</span>
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border/70 bg-card/50 py-8 px-4 sm:px-6 mt-12 mb-16 md:mb-0">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="font-bold text-foreground">Acme Technologies</span>
            <span>•</span>
            <span>Powered by HireFlow Applicant Tracking System</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/recruiter/dashboard" className="hover:text-foreground transition-colors font-medium">
              Recruiter Dashboard
            </Link>
            <Link to="/recruiter/jobs" className="hover:text-foreground transition-colors font-medium">
              All Job Requisitions
            </Link>
          </div>
        </div>
      </footer>

      {/* ========================================================= */}
      {/* INTERACTIVE APPLICATION MODAL / DIALOG */}
      {/* ========================================================= */}
      {isApplyModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-label={`Apply for ${job.title}`}
        >
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-200"
            onClick={handleCloseApplyModal}
            aria-hidden="true"
          />

          {/* Modal Container */}
          <div className="relative w-full max-w-xl bg-card border border-border/90 dark:border-white/10 shadow-2xl rounded-3xl z-50 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 fade-in-50 duration-150 my-auto">
            
            {/* Header */}
            <div className="flex items-start justify-between p-5 sm:p-6 border-b border-border/70 dark:border-white/10 bg-muted/20">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-[10px] font-bold text-primary border-primary/25 bg-primary/5">
                    {job.organizationName || "Acme Technologies"}
                  </Badge>
                  <span className="text-[11px] text-muted-foreground font-mono">{job.id}</span>
                </div>
                <h3 className="text-lg sm:text-xl font-black text-foreground">
                  Apply for {job.title}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {job.department} • {job.location} ({job.workplaceType})
                </p>
              </div>

              <button
                type="button"
                onClick={handleCloseApplyModal}
                className="p-1.5 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
              {applicationSubmitted ? (
                // SUCCESS STATE
                <div className="py-8 text-center space-y-4 animate-in fade-in-50 zoom-in-95 duration-200">
                  <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center mx-auto shadow-md shadow-emerald-500/10">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>

                  <div className="space-y-1.5">
                    <h4 className="text-xl font-black text-foreground">
                      Application Submitted!
                    </h4>
                    <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
                      Thank you for applying to <span className="font-bold text-foreground">{job.title}</span> at <span className="font-bold text-foreground">Acme Technologies</span>.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-muted/40 dark:bg-white/5 border border-border/70 text-left text-xs space-y-2 max-w-sm mx-auto">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Applicant Name:</span>
                      <span className="font-bold text-foreground">{applicantData.fullName}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Confirmation Email:</span>
                      <span className="font-bold text-foreground">{applicantData.email}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Resume Attached:</span>
                      <span className="font-bold text-foreground truncate max-w-[180px]">{applicantData.resumeFileName}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">Application Received</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-muted-foreground max-w-xs mx-auto">
                    A demonstration confirmation notification has been processed. The Acme Technologies hiring team will review your qualifications.
                  </p>

                  <div className="pt-2">
                    <Button
                      type="button"
                      variant="default"
                      onClick={handleCloseApplyModal}
                      className="text-xs font-bold rounded-xl px-6"
                    >
                      Done & Return to Job
                    </Button>
                  </div>
                </div>
              ) : (
                // APPLICATION FORM
                <form id="candidate-apply-form" onSubmit={handleSubmitApplication} className="space-y-4">
                  {/* Full Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground flex items-center justify-between">
                      <span>Full Name *</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-muted-foreground absolute left-3 top-2.5" />
                      <Input
                        type="text"
                        placeholder="e.g. Alex Morgan"
                        value={applicantData.fullName}
                        onChange={(e) => {
                          setApplicantData({ ...applicantData, fullName: e.target.value })
                          if (formErrors.fullName) setFormErrors({ ...formErrors, fullName: null })
                        }}
                        className={cn("pl-9 text-xs rounded-xl", formErrors.fullName && "border-destructive")}
                      />
                    </div>
                    {formErrors.fullName && (
                      <p className="text-[11px] text-destructive font-medium flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>{formErrors.fullName}</span>
                      </p>
                    )}
                  </div>

                  {/* Email & Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-foreground">Email Address *</label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-muted-foreground absolute left-3 top-2.5" />
                        <Input
                          type="email"
                          placeholder="alex.morgan@example.com"
                          value={applicantData.email}
                          onChange={(e) => {
                            setApplicantData({ ...applicantData, email: e.target.value })
                            if (formErrors.email) setFormErrors({ ...formErrors, email: null })
                          }}
                          className={cn("pl-9 text-xs rounded-xl", formErrors.email && "border-destructive")}
                        />
                      </div>
                      {formErrors.email && (
                        <p className="text-[11px] text-destructive font-medium flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          <span>{formErrors.email}</span>
                        </p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-foreground">Phone Number</label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-muted-foreground absolute left-3 top-2.5" />
                        <Input
                          type="tel"
                          placeholder="+91 98765 43210"
                          value={applicantData.phone}
                          onChange={(e) => setApplicantData({ ...applicantData, phone: e.target.value })}
                          className="pl-9 text-xs rounded-xl"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Location & Links */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-foreground">Current City / Country</label>
                      <div className="relative">
                        <MapPin className="w-4 h-4 text-muted-foreground absolute left-3 top-2.5" />
                        <Input
                          type="text"
                          placeholder="e.g. Bangalore, India"
                          value={applicantData.location}
                          onChange={(e) => setApplicantData({ ...applicantData, location: e.target.value })}
                          className="pl-9 text-xs rounded-xl"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-foreground">LinkedIn or Portfolio URL</label>
                      <div className="relative">
                        <Globe className="w-4 h-4 text-muted-foreground absolute left-3 top-2.5" />
                        <Input
                          type="url"
                          placeholder="https://linkedin.com/in/alex"
                          value={applicantData.linkedinUrl}
                          onChange={(e) => setApplicantData({ ...applicantData, linkedinUrl: e.target.value })}
                          className="pl-9 text-xs rounded-xl"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Resume Upload Dropzone */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground flex items-center justify-between">
                      <span>Resume / Curriculum Vitae *</span>
                      <span className="text-[10px] text-muted-foreground font-normal">PDF, DOCX up to 5MB</span>
                    </label>

                    {applicantData.resumeFileName ? (
                      <div className="p-3 rounded-2xl bg-primary/5 border border-primary/20 flex items-center justify-between">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                            <FileCheck className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-foreground truncate">
                              {applicantData.resumeFileName}
                            </div>
                            <span className="text-[10px] text-muted-foreground">
                              {applicantData.resumeFileSize || "Ready to submit"}
                            </span>
                          </div>
                        </div>

                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setApplicantData({ ...applicantData, resumeFileName: "", resumeFileSize: "" })}
                          className="text-xs text-destructive hover:bg-destructive/10 h-7 px-2 font-semibold"
                        >
                          Remove
                        </Button>
                      </div>
                    ) : (
                      <div className={cn(
                        "p-5 rounded-2xl border-2 border-dashed border-border/80 hover:border-primary/40 bg-muted/20 text-center space-y-2 transition-colors",
                        formErrors.resume && "border-destructive/60 bg-destructive/5"
                      )}>
                        <Upload className="w-6 h-6 text-muted-foreground mx-auto" />
                        <div className="text-xs font-semibold text-foreground">
                          Drag and drop your resume file here, or{" "}
                          <label className="text-primary hover:underline cursor-pointer font-bold">
                            browse files
                            <input
                              type="file"
                              accept=".pdf,.doc,.docx"
                              className="hidden"
                              onChange={handleSimulateResumeUpload}
                            />
                          </label>
                        </div>
                        <div className="pt-1 flex items-center justify-center gap-2">
                          <span className="text-[10px] text-muted-foreground">Demo helper:</span>
                          <button
                            type="button"
                            onClick={handleSelectSampleResume}
                            className="text-[11px] font-bold text-primary hover:underline cursor-pointer bg-primary/10 px-2 py-0.5 rounded-md"
                          >
                            Attach Sample Resume (Alex_Morgan_CV.pdf)
                          </button>
                        </div>
                      </div>
                    )}
                    {formErrors.resume && (
                      <p className="text-[11px] text-destructive font-medium flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>{formErrors.resume}</span>
                      </p>
                    )}
                  </div>

                  {/* Cover Note / Message to Recruiter */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground flex items-center justify-between">
                      <span>Cover Note / Why Acme Technologies?</span>
                      <span className="text-[10px] text-muted-foreground font-normal">Optional</span>
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Share a short note highlighting your relevant experience with React 19, distributed architecture, or why you're interested in Acme Technologies..."
                      value={applicantData.coverNote}
                      onChange={(e) => setApplicantData({ ...applicantData, coverNote: e.target.value })}
                      className="w-full text-xs rounded-xl border border-input bg-transparent px-3 py-2 text-foreground shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
                    />
                  </div>

                  {/* Consent Checkbox */}
                  <div className="space-y-1 pt-1">
                    <label className="flex items-start gap-2.5 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={applicantData.agreeConsent}
                        onChange={(e) => {
                          setApplicantData({ ...applicantData, agreeConsent: e.target.checked })
                          if (formErrors.agreeConsent) setFormErrors({ ...formErrors, agreeConsent: null })
                        }}
                        className="mt-0.5 rounded border-border text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                      />
                      <span className="text-[11px] text-muted-foreground leading-snug">
                        I consent to Acme Technologies and HireFlow storing my application data for recruitment review in accordance with privacy policies.
                      </span>
                    </label>
                    {formErrors.agreeConsent && (
                      <p className="text-[11px] text-destructive font-medium flex items-center gap-1 pl-6">
                        <AlertCircle className="w-3 h-3" />
                        <span>{formErrors.agreeConsent}</span>
                      </p>
                    )}
                  </div>
                </form>
              )}
            </div>

            {/* Modal Footer */}
            {!applicationSubmitted && (
              <div className="p-4 sm:p-5 bg-muted/30 dark:bg-white/5 border-t border-border/70 flex items-center justify-between gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleCloseApplyModal}
                  disabled={isSubmitting}
                  className="text-xs font-semibold rounded-xl"
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  form="candidate-apply-form"
                  variant="default"
                  size="sm"
                  disabled={isSubmitting}
                  className="text-xs font-bold rounded-xl shadow-md shadow-brand-coral/25 min-w-[140px]"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Submitting...</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5">
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Application</span>
                    </span>
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

