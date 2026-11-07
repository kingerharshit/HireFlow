import * as React from "react"
import { useState, useMemo, useRef, useEffect } from "react"
import { Link } from "react-router-dom"
import {
  Calendar,
  Clock,
  Video,
  MapPin,
  Users,
  Building2,
  Search,
  Filter,
  Sparkles,
  X,
  Check,
  Eye,
  MoreVertical,
  Plus,
  RefreshCw,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  AlertCircle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Star,
  MessageSquare,
  FileText,
  SlidersHorizontal,
  Mail,
  User,
  Briefcase,
  Layers,
  ArrowRight,
  CalendarCheck,
  CalendarX,
  History,
  Send,
  HelpCircle,
} from "lucide-react"
import { useInterviews } from "@/context/InterviewsContext"
import {
  INTERVIEW_STATUSES,
  INTERVIEW_TYPES,
  INTERVIEW_ROUNDS,
  DATE_FILTER_OPTIONS,
  RECOMMENDATION_OPTIONS,
  DEMO_INTERVIEWERS,
} from "@/features/interviews/demoInterviewsData"
import { DEMO_APPLICATIONS } from "@/features/applications/demoApplicationsData"
import { DEMO_JOBS } from "@/features/jobs/demoJobsData"
import { InterviewStatusBadge } from "@/components/dashboard/InterviewStatusBadge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export function InterviewsPage() {
  const {
    interviews,
    totalInterviews,
    upcomingInterviews,
    completedInterviews,
    pendingFeedbackInterviews,
    scheduleInterview,
    rescheduleInterview,
    completeInterview,
    cancelInterview,
    restoreInterview,
    submitFeedback,
  } = useInterviews()

  // Tab Filter: "all" | "upcoming" | "completed" | "pending_feedback" | "cancelled"
  const [activeTab, setActiveTab] = useState("all")

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("All Statuses")
  const [selectedType, setSelectedType] = useState("All Types")
  const [selectedDateRange, setSelectedDateRange] = useState("all")
  const [sortField, setSortField] = useState("date") // 'date' | 'candidateName' | 'status'
  const [sortOrder, setSortOrder] = useState("asc") // 'asc' | 'desc'

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(6)

  // Interactive UI State
  const [activeMenuId, setActiveMenuId] = useState(null)
  const [toastMessage, setToastMessage] = useState(null)

  // Modals & Drawers State
  const [isScheduleOpen, setIsScheduleOpen] = useState(false)
  const [interviewToView, setInterviewToView] = useState(null)
  const [interviewToReschedule, setInterviewToReschedule] = useState(null)
  const [interviewToCancel, setInterviewToCancel] = useState(null)
  const [interviewForFeedback, setInterviewForFeedback] = useState(null)

  // Scheduling Form State
  const [scheduleForm, setScheduleForm] = useState({
    applicationId: "",
    candidateName: "",
    candidateEmail: "",
    candidateLocation: "",
    candidateAvatar: "",
    candidateAvatarGradient: "",
    candidateId: "",
    jobId: "",
    jobTitle: "",
    jobDepartment: "",
    round: "Technical Assessment (Round 2)",
    interviewType: "Online",
    date: new Date().toISOString().split("T")[0],
    startTime: "11:00",
    endTime: "12:00",
    interviewerName: "Priya Sharma",
    interviewerRole: "Principal Frontend Architect",
    interviewerEmail: "priya.sharma@acmetech.demo",
    meetingLink: "https://meet.google.com/hfw-live-demo",
    location: "Acme HQ, 3rd Floor — Design Studio Lab, Bangalore",
    notes: "Review architectural challenges, component state isolation, and core problem solving.",
  })
  const [scheduleErrors, setScheduleErrors] = useState({})
  const [isSubmittingSchedule, setIsSubmittingSchedule] = useState(false)

  // Reschedule Form State
  const [rescheduleData, setRescheduleData] = useState({
    newDate: "",
    newStartTime: "",
    newEndTime: "",
    reason: "Candidate requested rescheduling to another date.",
  })
  const [rescheduleErrors, setRescheduleErrors] = useState({})

  // Cancel Form State
  const [cancelReason, setCancelReason] = useState("Scheduling conflict / Position put on hold")

  // Feedback Form State
  const [feedbackForm, setFeedbackForm] = useState({
    overallRating: 4,
    technicalSkillsRating: 4,
    communicationRating: 4,
    problemSolvingRating: 4,
    recommendation: "Hire",
    writtenFeedback: "",
    submittedBy: "Vikram Sen",
  })
  const [feedbackErrors, setFeedbackErrors] = useState({})

  // Helper toast notification
  const showToast = (message) => {
    setToastMessage(message)
    setTimeout(() => {
      setToastMessage((prev) => (prev === message ? null : prev))
    }, 4000)
  }

  // Close menus on outside click
  useEffect(() => {
    const handleDocumentClick = (e) => {
      if (!e.target.closest("[data-menu-container]")) {
        setActiveMenuId(null)
      }
    }
    document.addEventListener("click", handleDocumentClick)
    return () => document.removeEventListener("click", handleDocumentClick)
  }, [])

  // Auto-fill candidate info when application is selected in schedule modal
  const handleSelectApplication = (appId) => {
    const app = DEMO_APPLICATIONS.find((a) => a.id === appId)
    if (app) {
      setScheduleForm((prev) => ({
        ...prev,
        applicationId: app.id,
        candidateId: app.candidateId,
        candidateName: app.candidateName,
        candidateEmail: app.candidateEmail,
        candidateLocation: app.candidateLocation,
        candidateAvatar: app.candidateAvatar,
        candidateAvatarGradient: app.candidateAvatarGradient,
        jobId: app.jobId,
        jobTitle: app.jobTitle,
        jobDepartment: app.jobDepartment,
      }))
      if (scheduleErrors.applicationId) {
        setScheduleErrors((prev) => ({ ...prev, applicationId: null }))
      }
    }
  }

  // Auto-fill interviewer details
  const handleSelectInterviewer = (name) => {
    const intr = DEMO_INTERVIEWERS.find((i) => i.name === name)
    if (intr) {
      setScheduleForm((prev) => ({
        ...prev,
        interviewerName: intr.name,
        interviewerRole: intr.role,
        interviewerEmail: intr.email,
      }))
    }
  }

  // Schedule Validation
  const validateScheduleForm = () => {
    const errors = {}
    if (!scheduleForm.applicationId) {
      errors.applicationId = "Please select a candidate application."
    }
    if (!scheduleForm.date) {
      errors.date = "Interview date is required."
    }
    if (!scheduleForm.startTime) {
      errors.startTime = "Start time is required."
    }
    if (!scheduleForm.endTime) {
      errors.endTime = "End time is required."
    }
    if (scheduleForm.startTime && scheduleForm.endTime) {
      if (scheduleForm.endTime <= scheduleForm.startTime) {
        errors.endTime = "End time must be later than start time."
      }
    }
    if (!scheduleForm.interviewerName.trim()) {
      errors.interviewerName = "Interviewer name is required."
    }
    setScheduleErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Handle Schedule Submit
  const handleScheduleSubmit = (e) => {
    e.preventDefault()
    if (!validateScheduleForm()) return

    setIsSubmittingSchedule(true)
    setTimeout(() => {
      scheduleInterview(scheduleForm)
      setIsSubmittingSchedule(false)
      setIsScheduleOpen(false)
      showToast(`Interview scheduled for ${scheduleForm.candidateName}!`)
      // Reset form
      setScheduleForm({
        applicationId: "",
        candidateName: "",
        candidateEmail: "",
        candidateLocation: "",
        candidateAvatar: "",
        candidateAvatarGradient: "",
        candidateId: "",
        jobId: "",
        jobTitle: "",
        jobDepartment: "",
        round: "Technical Assessment (Round 2)",
        interviewType: "Online",
        date: new Date().toISOString().split("T")[0],
        startTime: "11:00",
        endTime: "12:00",
        interviewerName: "Priya Sharma",
        interviewerRole: "Principal Frontend Architect",
        interviewerEmail: "priya.sharma@acmetech.demo",
        meetingLink: "https://meet.google.com/hfw-live-demo",
        location: "Acme HQ, 3rd Floor — Design Studio Lab, Bangalore",
        notes: "Review architectural challenges, component state isolation, and core problem solving.",
      })
      setScheduleErrors({})
    }, 600)
  }

  // Open Reschedule Modal
  const handleOpenReschedule = (interview) => {
    setActiveMenuId(null)
    setInterviewToReschedule(interview)
    setRescheduleData({
      newDate: interview.date,
      newStartTime: interview.startTime,
      newEndTime: interview.endTime,
      reason: "Candidate requested rescheduling to another date.",
    })
    setRescheduleErrors({})
  }

  // Validate Reschedule Form
  const validateRescheduleForm = () => {
    const errors = {}
    if (!rescheduleData.newDate) {
      errors.newDate = "New date is required."
    }
    if (!rescheduleData.newStartTime) {
      errors.newStartTime = "Start time is required."
    }
    if (!rescheduleData.newEndTime) {
      errors.newEndTime = "End time is required."
    }
    if (rescheduleData.newStartTime && rescheduleData.newEndTime) {
      if (rescheduleData.newEndTime <= rescheduleData.newStartTime) {
        errors.newEndTime = "End time must be later than start time."
      }
    }
    setRescheduleErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Submit Reschedule
  const handleRescheduleSubmit = (e) => {
    e.preventDefault()
    if (!validateRescheduleForm()) return

    rescheduleInterview(interviewToReschedule.id, rescheduleData)
    showToast(`Interview for ${interviewToReschedule.candidateName} rescheduled!`)
    setInterviewToReschedule(null)
  }

  // Submit Cancel
  const handleCancelSubmit = () => {
    if (!interviewToCancel) return
    cancelInterview(interviewToCancel.id, cancelReason)
    showToast(`Interview for ${interviewToCancel.candidateName} cancelled.`)
    setInterviewToCancel(null)
  }

  // Open Feedback Drawer
  const handleOpenFeedback = (interview) => {
    setActiveMenuId(null)
    setInterviewForFeedback(interview)
    if (interview.feedback) {
      setFeedbackForm({
        overallRating: interview.feedback.overallRating || 4,
        technicalSkillsRating: interview.feedback.technicalSkillsRating || 4,
        communicationRating: interview.feedback.communicationRating || 4,
        problemSolvingRating: interview.feedback.problemSolvingRating || 4,
        recommendation: interview.feedback.recommendation || "Hire",
        writtenFeedback: interview.feedback.writtenFeedback || "",
        submittedBy: interview.feedback.submittedBy || interview.interviewerName,
      })
    } else {
      setFeedbackForm({
        overallRating: 4,
        technicalSkillsRating: 4,
        communicationRating: 4,
        problemSolvingRating: 4,
        recommendation: "Hire",
        writtenFeedback: "",
        submittedBy: interview.interviewerName,
      })
    }
    setFeedbackErrors({})
  }

  // Submit Feedback
  const handleFeedbackSubmit = (e) => {
    e.preventDefault()
    if (!feedbackForm.writtenFeedback.trim()) {
      setFeedbackErrors({ writtenFeedback: "Please provide detailed candidate evaluation notes." })
      return
    }

    submitFeedback(interviewForFeedback.id, feedbackForm)
    showToast(`Feedback recorded for ${interviewForFeedback.candidateName}!`)
    setInterviewForFeedback(null)
  }

  // Filter & Search Logic
  const filteredInterviews = useMemo(() => {
    return interviews.filter((item) => {
      // 1. Tab filtering
      if (activeTab === "upcoming") {
        if (item.status !== "Scheduled" && item.status !== "Rescheduled") return false
      } else if (activeTab === "completed") {
        if (item.status !== "Completed") return false
      } else if (activeTab === "pending_feedback") {
        if (item.status !== "Completed" || item.feedback) return false
      } else if (activeTab === "cancelled") {
        if (item.status !== "Cancelled") return false
      }

      // 2. Search filtering
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase()
        const matchesCandidate = item.candidateName.toLowerCase().includes(query)
        const matchesJob = item.jobTitle.toLowerCase().includes(query)
        const matchesInterviewer = item.interviewerName.toLowerCase().includes(query)
        const matchesRound = item.round.toLowerCase().includes(query)
        if (!matchesCandidate && !matchesJob && !matchesInterviewer && !matchesRound) {
          return false
        }
      }

      // 3. Status filter dropdown
      if (selectedStatus !== "All Statuses" && item.status !== selectedStatus) {
        return false
      }

      // 4. Type filter dropdown
      if (selectedType !== "All Types" && item.interviewType !== selectedType) {
        return false
      }

      // 5. Date filter dropdown
      if (selectedDateRange !== "all") {
        const today = new Date().toISOString().split("T")[0]
        if (selectedDateRange === "today" && item.date !== today) return false
        if (selectedDateRange === "upcoming" && item.date < today) return false
        if (selectedDateRange === "past" && item.date >= today) return false
      }

      return true
    })
  }, [interviews, activeTab, searchTerm, selectedStatus, selectedType, selectedDateRange])

  // Sorting
  const sortedInterviews = useMemo(() => {
    return [...filteredInterviews].sort((a, b) => {
      if (sortField === "date") {
        const dateA = `${a.date} ${a.startTime}`
        const dateB = `${b.date} ${b.startTime}`
        return sortOrder === "asc" ? dateA.localeCompare(dateB) : dateB.localeCompare(dateA)
      }
      if (sortField === "candidateName") {
        return sortOrder === "asc"
          ? a.candidateName.localeCompare(b.candidateName)
          : b.candidateName.localeCompare(a.candidateName)
      }
      if (sortField === "status") {
        return sortOrder === "asc"
          ? a.status.localeCompare(b.status)
          : b.status.localeCompare(a.status)
      }
      return 0
    })
  }, [filteredInterviews, sortField, sortOrder])

  // Pagination
  const totalPages = Math.ceil(sortedInterviews.length / pageSize) || 1
  const paginatedInterviews = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    return sortedInterviews.slice(startIndex, startIndex + pageSize)
  }, [sortedInterviews, currentPage, pageSize])

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [activeTab, searchTerm, selectedStatus, selectedType, selectedDateRange, pageSize])

  // Upcoming interviews spotlight (next 3 scheduled/rescheduled)
  const upcomingSpotlight = useMemo(() => {
    return interviews
      .filter((i) => i.status === "Scheduled" || i.status === "Rescheduled")
      .sort((a, b) => `${a.date} ${a.startTime}`.localeCompare(`${b.date} ${b.startTime}`))
      .slice(0, 3)
  }, [interviews])

  // Rating Stars Component
  const StarRating = ({ rating, onChange, editable = false }) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            type="button"
            key={star}
            disabled={!editable}
            onClick={() => editable && onChange && onChange(star)}
            className={cn(
              "p-0.5 rounded transition-transform",
              editable ? "hover:scale-115 cursor-pointer" : "cursor-default",
              star <= rating ? "text-amber-500 fill-amber-500" : "text-muted-foreground/30"
            )}
          >
            <Star className={cn("w-4 h-4", star <= rating && "fill-current")} />
          </button>
        ))}
        <span className="text-xs font-bold text-foreground ml-1.5">{rating}/5</span>
      </div>
    )
  }

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in-50 duration-200 select-none pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 max-w-sm w-full p-3.5 rounded-2xl bg-card border border-primary/30 text-xs font-semibold text-foreground shadow-2xl flex items-center justify-between gap-3 animate-in fade-in-50 slide-in-from-top-3 duration-200">
          <div className="flex items-center gap-2.5 min-w-0">
            <Sparkles className="w-4 h-4 text-primary shrink-0" />
            <span className="truncate">{toastMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-[11px] text-muted-foreground hover:text-foreground font-bold px-1.5 py-0.5 rounded hover:bg-muted cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* 1. Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-2 border-b border-border/60 dark:border-white/10">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Interviews
            </h1>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-semibold">
              <Building2 className="w-3.5 h-3.5" />
              <span>Acme Technologies</span>
            </div>
            <Badge variant="outline" className="text-[11px] font-mono text-muted-foreground">
              Multi-tenant Scoped
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1.5 leading-relaxed">
            Coordinate interview rounds, interviewer feedback rubrics, and schedules across your organization.
          </p>
        </div>

        {/* Schedule Interview Primary Action */}
        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <Button
            type="button"
            variant="default"
            size="sm"
            onClick={() => setIsScheduleOpen(true)}
            className="h-9 px-4 text-xs font-semibold rounded-xl shadow-soft-xs flex items-center gap-1.5 shadow-brand-coral/25"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule Interview</span>
          </Button>
        </div>
      </div>

      {/* 2. Summary Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Card 1: Total Interviews */}
        <div className="p-4 sm:p-5 rounded-2xl bg-card border border-border/80 dark:border-white/10 shadow-soft dark:shadow-[0_4px_20px_rgb(0,0,0,0.3)] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Total Interviews
            </span>
            <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-foreground">
            {totalInterviews}
          </div>
          <p className="text-[11px] text-muted-foreground font-medium">
            All-time coordinated rounds
          </p>
        </div>

        {/* Card 2: Upcoming Interviews */}
        <div className="p-4 sm:p-5 rounded-2xl bg-card border border-border/80 dark:border-white/10 shadow-soft dark:shadow-[0_4px_20px_rgb(0,0,0,0.3)] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Upcoming
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-blue-600 dark:text-blue-400">
            {upcomingInterviews}
          </div>
          <p className="text-[11px] text-muted-foreground font-medium">
            Scheduled & rescheduled rounds
          </p>
        </div>

        {/* Card 3: Completed Interviews */}
        <div className="p-4 sm:p-5 rounded-2xl bg-card border border-border/80 dark:border-white/10 shadow-soft dark:shadow-[0_4px_20px_rgb(0,0,0,0.3)] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Completed
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
            {completedInterviews}
          </div>
          <p className="text-[11px] text-muted-foreground font-medium">
            Conducted candidate reviews
          </p>
        </div>

        {/* Card 4: Pending Feedback */}
        <div className="p-4 sm:p-5 rounded-2xl bg-card border border-border/80 dark:border-white/10 shadow-soft dark:shadow-[0_4px_20px_rgb(0,0,0,0.3)] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Pending Feedback
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400">
            {pendingFeedbackInterviews}
          </div>
          <p className="text-[11px] text-muted-foreground font-medium">
            Awaiting evaluator scores
          </p>
        </div>
      </div>

      {/* 3. Upcoming Interviews Spotlight Ribbon */}
      {upcomingSpotlight.length > 0 && (
        <section aria-labelledby="upcoming-spotlight-title" className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 id="upcoming-spotlight-title" className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <CalendarCheck className="w-3.5 h-3.5 text-primary" />
              <span>Next Upcoming Candidate Rounds</span>
            </h2>
            <button
              type="button"
              onClick={() => setActiveTab("upcoming")}
              className="text-xs font-bold text-primary hover:underline cursor-pointer"
            >
              View all ({upcomingInterviews})
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {upcomingSpotlight.map((spot) => (
              <div
                key={spot.id}
                className="p-4 rounded-2xl bg-card border border-border/80 dark:border-white/10 shadow-soft space-y-3 relative overflow-hidden"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={cn(
                        "w-9 h-9 rounded-xl text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs bg-gradient-to-br",
                        spot.candidateAvatarGradient
                      )}
                    >
                      {spot.candidateAvatar}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-foreground truncate">
                        {spot.candidateName}
                      </div>
                      <div className="text-[11px] text-muted-foreground truncate">
                        {spot.jobTitle}
                      </div>
                    </div>
                  </div>
                  <InterviewStatusBadge status={spot.status} />
                </div>

                <div className="p-2.5 rounded-xl bg-muted/40 dark:bg-white/5 border border-border/50 text-xs space-y-1">
                  <div className="font-semibold text-foreground truncate">{spot.round}</div>
                  <div className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                    <Clock className="w-3 h-3 text-primary shrink-0" />
                    <span>{spot.dateFormatted} • {spot.timeFormatted}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 pt-1">
                  <span className="text-[11px] text-muted-foreground truncate">
                    Interviewer: <span className="font-semibold text-foreground">{spot.interviewerName}</span>
                  </span>

                  {spot.interviewType === "Online" ? (
                    <a
                      href={spot.meetingLink}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-primary hover:underline shrink-0"
                    >
                      <Video className="w-3 h-3" />
                      <span>Join Meet</span>
                    </a>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 shrink-0">
                      <MapPin className="w-3 h-3" />
                      <span>In-Person</span>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 4. Filter Tabs and Controls */}
      <div className="space-y-4">
        {/* Quick Filter Navigation Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar border-b border-border/60">
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={cn(
              "px-3.5 py-2 rounded-xl text-xs font-bold transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer",
              activeTab === "all"
                ? "bg-primary text-white shadow-xs"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            <span>All Interviews</span>
            <span className={cn(
              "px-1.5 py-0.2 rounded-md text-[10px]",
              activeTab === "all" ? "bg-white/20 text-white" : "bg-muted text-muted-foreground"
            )}>
              {totalInterviews}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("upcoming")}
            className={cn(
              "px-3.5 py-2 rounded-xl text-xs font-bold transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer",
              activeTab === "upcoming"
                ? "bg-primary text-white shadow-xs"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Upcoming</span>
            <span className={cn(
              "px-1.5 py-0.2 rounded-md text-[10px]",
              activeTab === "upcoming" ? "bg-white/20 text-white" : "bg-muted text-muted-foreground"
            )}>
              {upcomingInterviews}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("completed")}
            className={cn(
              "px-3.5 py-2 rounded-xl text-xs font-bold transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer",
              activeTab === "completed"
                ? "bg-primary text-white shadow-xs"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Completed</span>
            <span className={cn(
              "px-1.5 py-0.2 rounded-md text-[10px]",
              activeTab === "completed" ? "bg-white/20 text-white" : "bg-muted text-muted-foreground"
            )}>
              {completedInterviews}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("pending_feedback")}
            className={cn(
              "px-3.5 py-2 rounded-xl text-xs font-bold transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer",
              activeTab === "pending_feedback"
                ? "bg-amber-600 text-white shadow-xs"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Needs Feedback</span>
            {pendingFeedbackInterviews > 0 && (
              <span className={cn(
                "px-1.5 py-0.2 rounded-md text-[10px] font-bold",
                activeTab === "pending_feedback" ? "bg-white/20 text-white" : "bg-amber-500/20 text-amber-700 dark:text-amber-400"
              )}>
                {pendingFeedbackInterviews}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("cancelled")}
            className={cn(
              "px-3.5 py-2 rounded-xl text-xs font-bold transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer",
              activeTab === "cancelled"
                ? "bg-rose-600 text-white shadow-xs"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            <XCircle className="w-3.5 h-3.5" />
            <span>Cancelled</span>
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-3" />
            <Input
              type="text"
              placeholder="Search by candidate name, job title, interviewer, or round..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 text-xs rounded-xl h-10 w-full"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-3 text-muted-foreground hover:text-foreground cursor-pointer"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filter Dropdowns */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Status Dropdown */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="h-10 px-3 rounded-xl border border-input bg-card text-foreground text-xs font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer"
              aria-label="Filter by Status"
            >
              {INTERVIEW_STATUSES.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>

            {/* Type Dropdown */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="h-10 px-3 rounded-xl border border-input bg-card text-foreground text-xs font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer"
              aria-label="Filter by Interview Type"
            >
              {INTERVIEW_TYPES.map((tp) => (
                <option key={tp} value={tp}>
                  {tp}
                </option>
              ))}
            </select>

            {/* Date Range Dropdown */}
            <select
              value={selectedDateRange}
              onChange={(e) => setSelectedDateRange(e.target.value)}
              className="h-10 px-3 rounded-xl border border-input bg-card text-foreground text-xs font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer"
              aria-label="Filter by Date"
            >
              {DATE_FILTER_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>

            {/* Reset Filters Button */}
            {(searchTerm || selectedStatus !== "All Statuses" || selectedType !== "All Types" || selectedDateRange !== "all" || activeTab !== "all") && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchTerm("")
                  setSelectedStatus("All Statuses")
                  setSelectedType("All Types")
                  setSelectedDateRange("all")
                  setActiveTab("all")
                }}
                className="h-10 px-2.5 text-xs text-muted-foreground hover:text-foreground font-semibold rounded-xl"
              >
                Reset
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* 5. Interviews Listing (Desktop Table + Mobile Cards) */}
      <div className="space-y-4">
        {filteredInterviews.length === 0 ? (
          // Empty State
          <div className="p-12 text-center rounded-3xl border border-dashed border-border/80 dark:border-white/10 bg-card/60 space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
              <CalendarX className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-extrabold text-foreground">
                No interview sessions found
              </h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                No interviews match your selected criteria or search term. Try adjusting your filters or schedule a new interview round.
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 pt-1">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchTerm("")
                  setSelectedStatus("All Statuses")
                  setSelectedType("All Types")
                  setSelectedDateRange("all")
                  setActiveTab("all")
                }}
                className="text-xs font-semibold rounded-xl"
              >
                Clear Filters
              </Button>
              <Button
                type="button"
                variant="default"
                size="sm"
                onClick={() => setIsScheduleOpen(true)}
                className="text-xs font-bold rounded-xl"
              >
                <Plus className="w-3.5 h-3.5 mr-1" />
                <span>Schedule Interview</span>
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* DESKTOP TABLE VIEW (Visible on md and up) */}
            <div className="hidden md:block rounded-2xl border border-border/80 dark:border-white/10 bg-card overflow-hidden shadow-soft">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-muted-foreground">
                  <thead className="bg-muted/40 dark:bg-white/5 border-b border-border/70 text-[11px] font-bold uppercase tracking-wider text-muted-foreground select-none">
                    <tr>
                      <th className="py-3.5 px-4 font-bold">Candidate</th>
                      <th className="py-3.5 px-4 font-bold">Job Requisition & Round</th>
                      <th className="py-3.5 px-4 font-bold">Date & Time</th>
                      <th className="py-3.5 px-4 font-bold">Type & Venue</th>
                      <th className="py-3.5 px-4 font-bold">Interviewer</th>
                      <th className="py-3.5 px-4 font-bold">Status</th>
                      <th className="py-3.5 px-4 font-bold">Feedback</th>
                      <th className="py-3.5 px-4 text-right font-bold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {paginatedInterviews.map((item) => (
                      <tr
                        key={item.id}
                        className="hover:bg-muted/30 dark:hover:bg-white/[0.02] transition-colors"
                      >
                        {/* 1. Candidate Column */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div
                              className={cn(
                                "w-8 h-8 rounded-xl text-white font-bold text-[11px] flex items-center justify-center shrink-0 bg-gradient-to-br shadow-2xs",
                                item.candidateAvatarGradient
                              )}
                            >
                              {item.candidateAvatar}
                            </div>
                            <div className="min-w-0">
                              <button
                                type="button"
                                onClick={() => setInterviewToView(item)}
                                className="font-extrabold text-foreground hover:text-primary transition-colors text-xs truncate block text-left cursor-pointer"
                              >
                                {item.candidateName}
                              </button>
                              <span className="text-[11px] text-muted-foreground truncate block">
                                {item.candidateEmail}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* 2. Job & Round Column */}
                        <td className="py-3.5 px-4">
                          <div className="space-y-0.5">
                            <div className="font-bold text-foreground text-xs truncate max-w-[200px]">
                              {item.jobTitle}
                            </div>
                            <div className="inline-flex items-center gap-1 text-[11px] text-primary font-medium truncate max-w-[200px]">
                              <span>{item.round}</span>
                            </div>
                          </div>
                        </td>

                        {/* 3. Date & Time Column */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="space-y-0.5">
                            <div className="font-bold text-foreground text-xs flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-primary shrink-0" />
                              <span>{item.dateFormatted}</span>
                            </div>
                            <div className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                              <Clock className="w-3 h-3 text-muted-foreground shrink-0" />
                              <span>{item.timeFormatted}</span>
                            </div>
                          </div>
                        </td>

                        {/* 4. Type & Venue Column */}
                        <td className="py-3.5 px-4">
                          {item.interviewType === "Online" ? (
                            <div className="space-y-1">
                              <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400">
                                <Video className="w-3.5 h-3.5 shrink-0" />
                                <span>Online Meet</span>
                              </span>
                              {item.meetingLink && (
                                <a
                                  href={item.meetingLink}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-[11px] font-bold text-primary hover:underline flex items-center gap-1"
                                >
                                  <span>Google Meet</span>
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              )}
                            </div>
                          ) : (
                            <div className="space-y-1">
                              <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                                <MapPin className="w-3.5 h-3.5 shrink-0" />
                                <span>In-person</span>
                              </span>
                              <span className="text-[11px] text-muted-foreground block truncate max-w-[160px]" title={item.location}>
                                {item.location}
                              </span>
                            </div>
                          )}
                        </td>

                        {/* 5. Interviewer Column */}
                        <td className="py-3.5 px-4">
                          <div className="space-y-0.5">
                            <div className="font-bold text-foreground text-xs truncate max-w-[160px]">
                              {item.interviewerName}
                            </div>
                            <div className="text-[11px] text-muted-foreground truncate max-w-[160px]">
                              {item.interviewerRole}
                            </div>
                          </div>
                        </td>

                        {/* 6. Status Column */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <InterviewStatusBadge status={item.status} />
                        </td>

                        {/* 7. Feedback Column */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          {item.feedback ? (
                            <div className="space-y-1">
                              <div className="flex items-center gap-1">
                                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                                <span className="font-bold text-xs text-foreground">
                                  {item.feedback.overallRating}/5
                                </span>
                              </div>
                              <Badge
                                variant="outline"
                                className={cn(
                                  "text-[10px] font-bold px-1.5 py-0.2",
                                  item.feedback.recommendation === "Strong Hire" && "border-emerald-500/40 text-emerald-600 bg-emerald-500/10",
                                  item.feedback.recommendation === "Hire" && "border-teal-500/40 text-teal-600 bg-teal-500/10",
                                  item.feedback.recommendation === "Hold" && "border-amber-500/40 text-amber-600 bg-amber-500/10",
                                  item.feedback.recommendation === "Reject" && "border-rose-500/40 text-rose-600 bg-rose-500/10"
                                )}
                              >
                                {item.feedback.recommendation}
                              </Badge>
                            </div>
                          ) : item.status === "Completed" ? (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => handleOpenFeedback(item)}
                              className="h-7 px-2 text-[11px] font-bold text-amber-600 border-amber-500/30 hover:bg-amber-500/10 rounded-lg"
                            >
                              Add Feedback
                            </Button>
                          ) : (
                            <span className="text-[11px] text-muted-foreground">
                              Not conducted
                            </span>
                          )}
                        </td>

                        {/* 8. Action Dropdown Column */}
                        <td className="py-3.5 px-4 text-right relative" data-menu-container>
                          <div className="inline-flex items-center gap-1 justify-end">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => setInterviewToView(item)}
                              className="h-8 w-8 p-0 rounded-lg text-muted-foreground hover:text-foreground"
                              title="View dossier"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>

                            <button
                              type="button"
                              onClick={() => setActiveMenuId(activeMenuId === item.id ? null : item.id)}
                              className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                              aria-label="More actions"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Action Dropdown Menu */}
                          {activeMenuId === item.id && (
                            <div className="absolute right-4 top-12 z-30 w-48 rounded-2xl bg-card border border-border/80 dark:border-white/10 shadow-xl p-1.5 space-y-0.5 animate-in fade-in-50 zoom-in-95 duration-100 text-left">
                              <button
                                type="button"
                                onClick={() => {
                                  setActiveMenuId(null)
                                  setInterviewToView(item)
                                }}
                                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-foreground hover:bg-muted transition-colors cursor-pointer"
                              >
                                <Eye className="w-3.5 h-3.5 text-muted-foreground" />
                                <span>View Details</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleOpenFeedback(item)}
                                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-foreground hover:bg-muted transition-colors cursor-pointer"
                              >
                                <MessageSquare className="w-3.5 h-3.5 text-muted-foreground" />
                                <span>{item.feedback ? "Edit Feedback" : "Submit Feedback"}</span>
                              </button>

                              {item.status !== "Completed" && item.status !== "Cancelled" && (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => handleOpenReschedule(item)}
                                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-foreground hover:bg-muted transition-colors cursor-pointer"
                                  >
                                    <RefreshCw className="w-3.5 h-3.5 text-muted-foreground" />
                                    <span>Reschedule Round</span>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => {
                                      setActiveMenuId(null)
                                      completeInterview(item.id)
                                      showToast(`Marked interview for ${item.candidateName} as Completed!`)
                                    }}
                                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-emerald-600 hover:bg-emerald-500/10 transition-colors cursor-pointer"
                                  >
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                    <span>Mark as Completed</span>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => {
                                      setActiveMenuId(null)
                                      setInterviewToCancel(item)
                                    }}
                                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-rose-600 hover:bg-rose-500/10 transition-colors cursor-pointer"
                                  >
                                    <XCircle className="w-3.5 h-3.5 text-rose-600" />
                                    <span>Cancel Interview</span>
                                  </button>
                                </>
                              )}

                              {item.status === "Cancelled" && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveMenuId(null)
                                    restoreInterview(item.id)
                                    showToast(`Reactivated interview for ${item.candidateName}!`)
                                  }}
                                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-primary hover:bg-primary/10 transition-colors cursor-pointer"
                                >
                                  <Calendar className="w-3.5 h-3.5 text-primary" />
                                  <span>Reactivate Interview</span>
                                </button>
                              )}
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* MOBILE CARDS VIEW (Visible below md, zero horizontal overflow) */}
            <div className="block md:hidden space-y-3">
              {paginatedInterviews.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-border/80 dark:border-white/10 bg-card p-4 shadow-soft space-y-3"
                >
                  {/* Card Top */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={cn(
                          "w-9 h-9 rounded-xl text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs bg-gradient-to-br",
                          item.candidateAvatarGradient
                        )}
                      >
                        {item.candidateAvatar}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-extrabold text-foreground truncate">
                          {item.candidateName}
                        </div>
                        <div className="text-[11px] text-muted-foreground truncate">
                          {item.jobTitle}
                        </div>
                      </div>
                    </div>
                    <InterviewStatusBadge status={item.status} />
                  </div>

                  {/* Round & Details */}
                  <div className="p-3 rounded-xl bg-muted/40 dark:bg-white/5 border border-border/50 text-xs space-y-1.5">
                    <div className="font-bold text-foreground">{item.round}</div>
                    <div className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                      <Calendar className="w-3 h-3 text-primary shrink-0" />
                      <span>{item.dateFormatted}</span>
                      <span>•</span>
                      <Clock className="w-3 h-3 text-muted-foreground shrink-0" />
                      <span>{item.timeFormatted}</span>
                    </div>
                    <div className="text-[11px] text-muted-foreground flex items-center gap-1.5 pt-0.5">
                      {item.interviewType === "Online" ? (
                        <>
                          <Video className="w-3 h-3 text-blue-500 shrink-0" />
                          <span className="text-blue-600 dark:text-blue-400 font-semibold">Online Google Meet</span>
                        </>
                      ) : (
                        <>
                          <MapPin className="w-3 h-3 text-emerald-500 shrink-0" />
                          <span className="truncate">{item.location}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Interviewer & Feedback Summary */}
                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-muted-foreground text-[11px]">
                      Interviewer: <span className="font-bold text-foreground">{item.interviewerName}</span>
                    </span>

                    {item.feedback ? (
                      <span className="inline-flex items-center gap-1 font-bold text-amber-600 text-xs">
                        <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                        <span>{item.feedback.overallRating}/5 ({item.feedback.recommendation})</span>
                      </span>
                    ) : item.status === "Completed" ? (
                      <span className="text-[11px] font-bold text-amber-600">Pending Feedback</span>
                    ) : null}
                  </div>

                  {/* Mobile Actions */}
                  <div className="pt-2 border-t border-border/60 flex items-center justify-between gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setInterviewToView(item)}
                      className="text-xs font-semibold rounded-xl flex-1"
                    >
                      Details
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenFeedback(item)}
                      className="text-xs font-semibold rounded-xl flex-1"
                    >
                      {item.feedback ? "Feedback" : "Add Feedback"}
                    </Button>

                    {item.status !== "Completed" && item.status !== "Cancelled" && (
                      <Button
                        type="button"
                        variant="default"
                        size="sm"
                        onClick={() => handleOpenReschedule(item)}
                        className="text-xs font-semibold rounded-xl px-3"
                      >
                        Reschedule
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 text-xs text-muted-foreground">
              <div>
                Showing <span className="font-bold text-foreground">{(currentPage - 1) * pageSize + 1}</span> to{" "}
                <span className="font-bold text-foreground">
                  {Math.min(currentPage * pageSize, sortedInterviews.length)}
                </span>{" "}
                of <span className="font-bold text-foreground">{sortedInterviews.length}</span> interviews
              </div>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage <= 1}
                  className="h-8 text-xs font-semibold rounded-xl gap-1"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Previous</span>
                </Button>

                <span className="text-xs font-bold text-foreground px-2">
                  Page {currentPage} of {totalPages}
                </span>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage >= totalPages}
                  className="h-8 text-xs font-semibold rounded-xl gap-1"
                >
                  <span>Next</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ========================================================= */}
      {/* 6. SCHEDULE INTERVIEW DRAWER / MODAL */}
      {/* ========================================================= */}
      {isScheduleOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-label="Schedule Interview"
        >
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsScheduleOpen(false)}
            aria-hidden="true"
          />

          <div className="relative w-full max-w-xl bg-card border border-border/90 dark:border-white/10 shadow-2xl rounded-3xl z-50 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 fade-in-50 duration-150 my-auto">
            {/* Header */}
            <div className="flex items-start justify-between p-5 sm:p-6 border-b border-border/70 bg-muted/20">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg sm:text-xl font-black text-foreground">
                    Schedule Interview Round
                  </h3>
                  <Badge variant="outline" className="text-[10px] font-bold text-primary border-primary/25 bg-primary/5">
                    Acme Technologies
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Link candidate application, assign panel interviewers, and configure agenda.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsScheduleOpen(false)}
                className="p-1.5 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body Form */}
            <form id="schedule-interview-form" onSubmit={handleScheduleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-4">
              {/* Select Candidate Application */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground flex items-center justify-between">
                  <span>Candidate Application *</span>
                  <span className="text-[10px] text-muted-foreground font-normal">From active Acme applicants</span>
                </label>
                <select
                  value={scheduleForm.applicationId}
                  onChange={(e) => handleSelectApplication(e.target.value)}
                  className={cn(
                    "w-full h-10 px-3 rounded-xl border border-input bg-card text-foreground text-xs font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer",
                    scheduleErrors.applicationId && "border-destructive"
                  )}
                >
                  <option value="">-- Choose Candidate from Applications --</option>
                  {DEMO_APPLICATIONS.map((app) => (
                    <option key={app.id} value={app.id}>
                      {app.candidateName} — {app.jobTitle} ({app.status})
                    </option>
                  ))}
                </select>
                {scheduleErrors.applicationId && (
                  <p className="text-[11px] text-destructive font-medium flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{scheduleErrors.applicationId}</span>
                  </p>
                )}
              </div>

              {/* Job Requisition Display */}
              {scheduleForm.candidateName && (
                <div className="p-3 rounded-2xl bg-muted/40 dark:bg-white/5 border border-border/60 flex items-center justify-between text-xs">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">Associated Job</span>
                    <div className="font-extrabold text-foreground">{scheduleForm.jobTitle}</div>
                  </div>
                  <Badge variant="outline" className="text-[10px] font-mono">
                    {scheduleForm.jobDepartment}
                  </Badge>
                </div>
              )}

              {/* Interview Round */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">Interview Round *</label>
                <select
                  value={scheduleForm.round}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, round: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl border border-input bg-card text-foreground text-xs font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer"
                >
                  {INTERVIEW_ROUNDS.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              {/* Interview Type: Online vs In-person */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">Interview Format *</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setScheduleForm({ ...scheduleForm, interviewType: "Online" })}
                    className={cn(
                      "py-2.5 px-3 rounded-xl text-xs font-bold border flex items-center justify-center gap-2 cursor-pointer transition-colors",
                      scheduleForm.interviewType === "Online"
                        ? "bg-primary/10 border-primary text-primary"
                        : "border-border text-muted-foreground hover:bg-muted"
                    )}
                  >
                    <Video className="w-4 h-4" />
                    <span>Online (Google Meet)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setScheduleForm({ ...scheduleForm, interviewType: "In-person" })}
                    className={cn(
                      "py-2.5 px-3 rounded-xl text-xs font-bold border flex items-center justify-center gap-2 cursor-pointer transition-colors",
                      scheduleForm.interviewType === "In-person"
                        ? "bg-primary/10 border-primary text-primary"
                        : "border-border text-muted-foreground hover:bg-muted"
                    )}
                  >
                    <MapPin className="w-4 h-4" />
                    <span>In-person (Onsite)</span>
                  </button>
                </div>
              </div>

              {/* Date & Time Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">Date *</label>
                  <Input
                    type="date"
                    value={scheduleForm.date}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, date: e.target.value })}
                    className={cn("text-xs rounded-xl", scheduleErrors.date && "border-destructive")}
                  />
                  {scheduleErrors.date && (
                    <p className="text-[11px] text-destructive font-medium">{scheduleErrors.date}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">Start Time *</label>
                  <Input
                    type="time"
                    value={scheduleForm.startTime}
                    onChange={(e) => {
                      setScheduleForm({ ...scheduleForm, startTime: e.target.value })
                      if (scheduleErrors.endTime) setScheduleErrors((prev) => ({ ...prev, endTime: null }))
                    }}
                    className={cn("text-xs rounded-xl", scheduleErrors.startTime && "border-destructive")}
                  />
                  {scheduleErrors.startTime && (
                    <p className="text-[11px] text-destructive font-medium">{scheduleErrors.startTime}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">End Time *</label>
                  <Input
                    type="time"
                    value={scheduleForm.endTime}
                    onChange={(e) => {
                      setScheduleForm({ ...scheduleForm, endTime: e.target.value })
                      if (scheduleErrors.endTime) setScheduleErrors((prev) => ({ ...prev, endTime: null }))
                    }}
                    className={cn("text-xs rounded-xl", scheduleErrors.endTime && "border-destructive")}
                  />
                  {scheduleErrors.endTime && (
                    <p className="text-[11px] text-destructive font-medium">{scheduleErrors.endTime}</p>
                  )}
                </div>
              </div>

              {/* Interviewer Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">Assigned Interviewer *</label>
                <select
                  value={scheduleForm.interviewerName}
                  onChange={(e) => handleSelectInterviewer(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-input bg-card text-foreground text-xs font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer"
                >
                  {DEMO_INTERVIEWERS.map((i) => (
                    <option key={i.name} value={i.name}>
                      {i.name} — {i.role}
                    </option>
                  ))}
                </select>
              </div>

              {/* Meeting Link / Location */}
              {scheduleForm.interviewType === "Online" ? (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">Meeting Link</label>
                  <Input
                    type="url"
                    value={scheduleForm.meetingLink}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, meetingLink: e.target.value })}
                    className="text-xs rounded-xl"
                  />
                </div>
              ) : (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">Room Location / Venue</label>
                  <Input
                    type="text"
                    value={scheduleForm.location}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, location: e.target.value })}
                    className="text-xs rounded-xl"
                  />
                </div>
              )}

              {/* Agenda Notes */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">Instructions & Agenda Notes</label>
                <textarea
                  rows={2}
                  value={scheduleForm.notes}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, notes: e.target.value })}
                  className="w-full text-xs rounded-xl border border-input bg-transparent px-3 py-2 text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
                />
              </div>
            </form>

            {/* Footer */}
            <div className="p-4 sm:p-5 bg-muted/30 border-t border-border/70 flex items-center justify-between gap-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsScheduleOpen(false)}
                className="text-xs font-semibold rounded-xl"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                form="schedule-interview-form"
                variant="default"
                size="sm"
                disabled={isSubmittingSchedule}
                className="text-xs font-bold rounded-xl shadow-md shadow-brand-coral/25 min-w-[140px]"
              >
                {isSubmittingSchedule ? "Scheduling..." : "Schedule Session"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 7. RESCHEDULE INTERVIEW MODAL */}
      {/* ========================================================= */}
      {interviewToReschedule && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-label="Reschedule Interview"
        >
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setInterviewToReschedule(null)}
            aria-hidden="true"
          />

          <div className="relative w-full max-w-lg bg-card border border-border/90 dark:border-white/10 shadow-2xl rounded-3xl z-50 overflow-hidden flex flex-col animate-in zoom-in-95 fade-in-50 duration-150 my-auto">
            <div className="flex items-start justify-between p-5 border-b border-border/70 bg-muted/20">
              <div>
                <h3 className="text-lg font-black text-foreground">
                  Reschedule Interview Session
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Update date and time for {interviewToReschedule.candidateName}.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setInterviewToReschedule(null)}
                className="p-1.5 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRescheduleSubmit} className="p-5 space-y-4">
              {/* Existing schedule notice */}
              <div className="p-3 rounded-2xl bg-muted/40 dark:bg-white/5 border border-border/60 text-xs space-y-1">
                <span className="text-[10px] font-bold uppercase text-muted-foreground">Current Schedule</span>
                <div className="font-extrabold text-foreground">
                  {interviewToReschedule.dateFormatted} • {interviewToReschedule.timeFormatted}
                </div>
                <div className="text-[11px] text-muted-foreground">
                  {interviewToReschedule.round} with {interviewToReschedule.interviewerName}
                </div>
              </div>

              {/* New Date & Times */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">New Date *</label>
                  <Input
                    type="date"
                    value={rescheduleData.newDate}
                    onChange={(e) => setRescheduleData({ ...rescheduleData, newDate: e.target.value })}
                    className={cn("text-xs rounded-xl", rescheduleErrors.newDate && "border-destructive")}
                  />
                  {rescheduleErrors.newDate && (
                    <p className="text-[11px] text-destructive font-medium">{rescheduleErrors.newDate}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">New Start *</label>
                  <Input
                    type="time"
                    value={rescheduleData.newStartTime}
                    onChange={(e) => setRescheduleData({ ...rescheduleData, newStartTime: e.target.value })}
                    className={cn("text-xs rounded-xl", rescheduleErrors.newStartTime && "border-destructive")}
                  />
                  {rescheduleErrors.newStartTime && (
                    <p className="text-[11px] text-destructive font-medium">{rescheduleErrors.newStartTime}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">New End *</label>
                  <Input
                    type="time"
                    value={rescheduleData.newEndTime}
                    onChange={(e) => setRescheduleData({ ...rescheduleData, newEndTime: e.target.value })}
                    className={cn("text-xs rounded-xl", rescheduleErrors.newEndTime && "border-destructive")}
                  />
                  {rescheduleErrors.newEndTime && (
                    <p className="text-[11px] text-destructive font-medium">{rescheduleErrors.newEndTime}</p>
                  )}
                </div>
              </div>

              {/* Reason */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">Reason for Rescheduling</label>
                <select
                  value={rescheduleData.reason}
                  onChange={(e) => setRescheduleData({ ...rescheduleData, reason: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl border border-input bg-card text-foreground text-xs font-medium cursor-pointer"
                >
                  <option value="Candidate requested rescheduling to another date.">
                    Candidate requested date change
                  </option>
                  <option value="Interviewer conflict / panel unavailable.">
                    Interviewer calendar conflict
                  </option>
                  <option value="Hiring team emergency / holiday adjustment.">
                    Hiring team / internal schedule adjustment
                  </option>
                  <option value="Technical or connectivity requirement change.">
                    Format or technical change
                  </option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-between gap-3 border-t border-border/70">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setInterviewToReschedule(null)}
                  className="text-xs font-semibold rounded-xl"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="default"
                  size="sm"
                  className="text-xs font-bold rounded-xl"
                >
                  Confirm Reschedule
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 8. CANCEL INTERVIEW MODAL */}
      {/* ========================================================= */}
      {interviewToCancel && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-label="Cancel Interview"
        >
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setInterviewToCancel(null)}
            aria-hidden="true"
          />

          <div className="relative w-full max-w-md bg-card border border-border/90 dark:border-white/10 shadow-2xl rounded-3xl z-50 p-6 space-y-4 animate-in zoom-in-95 fade-in-50 duration-150 my-auto text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-600 flex items-center justify-center mx-auto">
              <XCircle className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-black text-foreground">
                Cancel Interview Round?
              </h3>
              <p className="text-xs text-muted-foreground">
                Are you sure you want to cancel the interview for <span className="font-bold text-foreground">{interviewToCancel.candidateName}</span>?
              </p>
            </div>

            <div className="space-y-1 text-left">
              <label className="text-xs font-bold text-foreground">Reason for Cancellation</label>
              <select
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-input bg-card text-foreground text-xs font-medium cursor-pointer"
              >
                <option value="Candidate accepted another offer / withdrew application.">
                  Candidate withdrew application
                </option>
                <option value="Position filled / Requisition closed.">
                  Position filled or closed
                </option>
                <option value="Candidate does not meet baseline requirements.">
                  Requirements changed
                </option>
                <option value="Scheduling conflict / duplicate entry.">
                  Duplicate entry / scheduling conflict
                </option>
              </select>
            </div>

            <div className="pt-2 flex items-center justify-center gap-2.5">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setInterviewToCancel(null)}
                className="text-xs font-semibold rounded-xl flex-1"
              >
                Keep Scheduled
              </Button>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={handleCancelSubmit}
                className="text-xs font-bold rounded-xl flex-1"
              >
                Cancel Session
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 9. INTERVIEW FEEDBACK DRAWER / MODAL */}
      {/* ========================================================= */}
      {interviewForFeedback && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-label="Interview Feedback Rubric"
        >
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setInterviewForFeedback(null)}
            aria-hidden="true"
          />

          <div className="relative w-full max-w-xl bg-card border border-border/90 dark:border-white/10 shadow-2xl rounded-3xl z-50 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 fade-in-50 duration-150 my-auto">
            {/* Header */}
            <div className="flex items-start justify-between p-5 border-b border-border/70 bg-muted/20">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-black text-foreground">
                    Candidate Evaluation Rubric
                  </h3>
                  <Badge variant="outline" className="text-[10px] font-bold text-primary border-primary/25 bg-primary/5">
                    Demonstration Rubric
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Record structured interview ratings and hiring recommendation for Acme Technologies panel.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setInterviewForFeedback(null)}
                className="p-1.5 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form id="feedback-form" onSubmit={handleFeedbackSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-4">
              {/* Candidate Info banner */}
              <div className="p-3.5 rounded-2xl bg-muted/40 dark:bg-white/5 border border-border/60 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <div
                    className={cn(
                      "w-8 h-8 rounded-xl text-white font-bold text-xs flex items-center justify-center bg-gradient-to-br",
                      interviewForFeedback.candidateAvatarGradient
                    )}
                  >
                    {interviewForFeedback.candidateAvatar}
                  </div>
                  <div>
                    <div className="font-extrabold text-foreground">{interviewForFeedback.candidateName}</div>
                    <div className="text-[11px] text-muted-foreground">{interviewForFeedback.jobTitle}</div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-semibold text-primary block">{interviewForFeedback.round}</span>
                  <span className="text-[10px] text-muted-foreground">Conducted on {interviewForFeedback.dateFormatted}</span>
                </div>
              </div>

              {/* 4 Dimension Star Ratings */}
              <div className="p-4 rounded-2xl bg-card border border-border/80 space-y-3.5">
                <div className="flex items-center justify-between text-xs pb-2 border-b border-border/50">
                  <span className="font-bold text-foreground">Overall Performance Rating *</span>
                  <StarRating
                    rating={feedbackForm.overallRating}
                    onChange={(r) => setFeedbackForm({ ...feedbackForm, overallRating: r })}
                    editable
                  />
                </div>

                <div className="flex items-center justify-between text-xs pb-2 border-b border-border/50">
                  <span className="font-semibold text-muted-foreground">Technical Competency & Architecture</span>
                  <StarRating
                    rating={feedbackForm.technicalSkillsRating}
                    onChange={(r) => setFeedbackForm({ ...feedbackForm, technicalSkillsRating: r })}
                    editable
                  />
                </div>

                <div className="flex items-center justify-between text-xs pb-2 border-b border-border/50">
                  <span className="font-semibold text-muted-foreground">Communication & Team Collaboration</span>
                  <StarRating
                    rating={feedbackForm.communicationRating}
                    onChange={(r) => setFeedbackForm({ ...feedbackForm, communicationRating: r })}
                    editable
                  />
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-muted-foreground">Problem Solving & Analytical Thinking</span>
                  <StarRating
                    rating={feedbackForm.problemSolvingRating}
                    onChange={(r) => setFeedbackForm({ ...feedbackForm, problemSolvingRating: r })}
                    editable
                  />
                </div>
              </div>

              {/* Hiring Recommendation */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">Hiring Recommendation *</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {RECOMMENDATION_OPTIONS.map((opt) => (
                    <button
                      type="button"
                      key={opt.value}
                      onClick={() => setFeedbackForm({ ...feedbackForm, recommendation: opt.value })}
                      className={cn(
                        "p-2.5 rounded-xl border text-center transition-colors cursor-pointer",
                        feedbackForm.recommendation === opt.value
                          ? "bg-primary/10 border-primary text-primary font-bold shadow-xs"
                          : "border-border text-muted-foreground hover:bg-muted font-medium text-xs"
                      )}
                    >
                      <div className="text-xs">{opt.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Written Feedback Notes */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground flex items-center justify-between">
                  <span>Written Assessment & Justification *</span>
                  <span className="text-[10px] text-muted-foreground">Visible to hiring committee</span>
                </label>
                <textarea
                  rows={4}
                  placeholder="Detail the candidate's core strengths, areas for improvement, system architecture choices, and whether they meet Acme's bar..."
                  value={feedbackForm.writtenFeedback}
                  onChange={(e) => {
                    setFeedbackForm({ ...feedbackForm, writtenFeedback: e.target.value })
                    if (feedbackErrors.writtenFeedback) setFeedbackErrors({})
                  }}
                  className={cn(
                    "w-full text-xs rounded-xl border border-input bg-transparent px-3 py-2 text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none",
                    feedbackErrors.writtenFeedback && "border-destructive"
                  )}
                />
                {feedbackErrors.writtenFeedback && (
                  <p className="text-[11px] text-destructive font-medium">{feedbackErrors.writtenFeedback}</p>
                )}
              </div>

              {/* Evaluator identity */}
              <div className="p-3 rounded-xl bg-muted/30 text-[11px] text-muted-foreground flex items-center justify-between">
                <span>Evaluator: <strong className="text-foreground">{feedbackForm.submittedBy}</strong></span>
                <span>Session: <strong>{interviewForFeedback.id}</strong></span>
              </div>
            </form>

            {/* Footer */}
            <div className="p-4 sm:p-5 bg-muted/30 border-t border-border/70 flex items-center justify-between gap-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setInterviewForFeedback(null)}
                className="text-xs font-semibold rounded-xl"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                form="feedback-form"
                variant="default"
                size="sm"
                className="text-xs font-bold rounded-xl shadow-md shadow-brand-coral/25 min-w-[140px]"
              >
                Submit Feedback
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 10. INTERVIEW DETAILS DOSSIER DRAWER */}
      {/* ========================================================= */}
      {interviewToView && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-label="Interview Dossier"
        >
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setInterviewToView(null)}
            aria-hidden="true"
          />

          <div className="relative w-full max-w-xl bg-card border border-border/90 dark:border-white/10 shadow-2xl rounded-3xl z-50 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 fade-in-50 duration-150 my-auto">
            {/* Header */}
            <div className="flex items-start justify-between p-5 sm:p-6 border-b border-border/70 bg-muted/20">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-[10px] font-bold text-primary border-primary/25 bg-primary/5">
                    Acme Technologies Interview Dossier
                  </Badge>
                  <span className="text-[11px] text-muted-foreground font-mono">{interviewToView.id}</span>
                </div>
                <h3 className="text-lg sm:text-xl font-black text-foreground">
                  {interviewToView.round}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setInterviewToView(null)}
                className="p-1.5 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Dossier Body */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
              {/* Candidate Info */}
              <div className="p-4 rounded-2xl bg-card border border-border/80 flex items-start gap-3.5">
                <div
                  className={cn(
                    "w-12 h-12 rounded-2xl text-white font-extrabold text-sm flex items-center justify-center shrink-0 shadow-xs bg-gradient-to-br",
                    interviewToView.candidateAvatarGradient
                  )}
                >
                  {interviewToView.candidateAvatar}
                </div>
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-sm font-black text-foreground">{interviewToView.candidateName}</h4>
                    <InterviewStatusBadge status={interviewToView.status} />
                  </div>
                  <div className="text-xs text-muted-foreground">{interviewToView.jobTitle} • {interviewToView.jobDepartment}</div>
                  <div className="text-[11px] text-muted-foreground flex items-center gap-2">
                    <span>{interviewToView.candidateEmail}</span>
                    <span>•</span>
                    <span>{interviewToView.candidateLocation}</span>
                  </div>
                </div>
              </div>

              {/* Schedule Details */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-muted/40 dark:bg-white/5 border border-border/60 space-y-1">
                  <span className="text-[10px] font-bold uppercase text-muted-foreground">Session Date & Time</span>
                  <div className="font-extrabold text-foreground">{interviewToView.dateFormatted}</div>
                  <div className="text-[11px] text-primary font-bold">{interviewToView.timeFormatted}</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-muted/40 dark:bg-white/5 border border-border/60 space-y-1">
                  <span className="text-[10px] font-bold uppercase text-muted-foreground">Format & Venue</span>
                  <div className="font-extrabold text-foreground">{interviewToView.interviewType}</div>
                  <div className="text-[11px] text-muted-foreground truncate">
                    {interviewToView.interviewType === "Online" ? "Google Meet Link" : interviewToView.location}
                  </div>
                </div>
              </div>

              {/* Interviewer details */}
              <div className="p-3.5 rounded-2xl bg-card border border-border/70 text-xs flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase text-muted-foreground block">Assigned Interviewer</span>
                  <div className="font-extrabold text-foreground">{interviewToView.interviewerName}</div>
                  <div className="text-[11px] text-muted-foreground">{interviewToView.interviewerRole}</div>
                </div>
                <div className="text-right text-[11px] text-muted-foreground">
                  <span>{interviewToView.interviewerEmail}</span>
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-1 text-xs">
                <span className="font-bold text-foreground block">Session Agenda & Notes</span>
                <p className="text-muted-foreground p-3 rounded-xl bg-muted/20 border border-border/50 leading-relaxed">
                  {interviewToView.notes}
                </p>
              </div>

              {/* Reschedule / Cancellation Reason if any */}
              {interviewToView.rescheduleReason && (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 text-xs text-amber-700 dark:text-amber-400 space-y-1">
                  <span className="font-bold flex items-center gap-1.5">
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Reschedule Note:</span>
                  </span>
                  <p className="text-[11px] leading-relaxed">{interviewToView.rescheduleReason}</p>
                </div>
              )}

              {interviewToView.cancelReason && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/25 text-xs text-rose-700 dark:text-rose-400 space-y-1">
                  <span className="font-bold flex items-center gap-1.5">
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Cancellation Reason:</span>
                  </span>
                  <p className="text-[11px] leading-relaxed">{interviewToView.cancelReason}</p>
                </div>
              )}

              {/* Evaluator Feedback Section */}
              <div className="space-y-2 pt-2 border-t border-border/60">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Evaluator Feedback
                  </h4>
                  {interviewToView.feedback && (
                    <Badge
                      variant="outline"
                      className="text-[10px] font-bold border-primary/30 text-primary bg-primary/5"
                    >
                      Recommendation: {interviewToView.feedback.recommendation}
                    </Badge>
                  )}
                </div>

                {interviewToView.feedback ? (
                  <div className="p-4 rounded-2xl bg-muted/40 dark:bg-white/5 border border-border/60 space-y-3 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Overall Rating</span>
                      <StarRating rating={interviewToView.feedback.overallRating} />
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                      <span>Technical Competency</span>
                      <span>{interviewToView.feedback.technicalSkillsRating}/5</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                      <span>Communication</span>
                      <span>{interviewToView.feedback.communicationRating}/5</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                      <span>Problem Solving</span>
                      <span>{interviewToView.feedback.problemSolvingRating}/5</span>
                    </div>

                    <div className="pt-2 border-t border-border/40 space-y-1">
                      <span className="font-bold text-foreground text-[11px]">Written Assessment:</span>
                      <p className="text-[11px] text-muted-foreground leading-relaxed italic">
                        "{interviewToView.feedback.writtenFeedback}"
                      </p>
                      <span className="text-[10px] text-muted-foreground block pt-1">
                        Recorded on {interviewToView.feedback.submittedAt} by {interviewToView.feedback.submittedBy}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-muted/20 border border-dashed border-border/70 text-center space-y-2">
                    <p className="text-xs text-muted-foreground">
                      No evaluator feedback has been recorded for this session yet.
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const itm = interviewToView
                        setInterviewToView(null)
                        handleOpenFeedback(itm)
                      }}
                      className="text-xs font-semibold rounded-xl"
                    >
                      <MessageSquare className="w-3.5 h-3.5 mr-1" />
                      <span>Record Feedback</span>
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 sm:p-5 bg-muted/30 border-t border-border/70 flex items-center justify-between gap-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setInterviewToView(null)}
                className="text-xs font-semibold rounded-xl"
              >
                Close View
              </Button>

              <div className="flex items-center gap-2">
                {interviewToView.meetingLink && interviewToView.interviewType === "Online" && (
                  <a
                    href={interviewToView.meetingLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-primary text-white shadow-xs"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Join Meeting</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

