import * as React from "react"
import { useState, useMemo, useRef, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import {
  Users,
  Search,
  Filter,
  ArrowRight,
  MoreVertical,
  Eye,
  Mail,
  Calendar,
  Building2,
  Sparkles,
  X,
  Check,
  MapPin,
  Briefcase,
  Clock,
  Copy,
  ChevronRight,
  AlertCircle,
  FileText,
  UserCheck,
  UserX,
} from "lucide-react"
import { ApplicationStatusBadge } from "./ApplicationStatusBadge"
import { AiMatchBadge } from "./AiMatchBadge"
import {
  DEMO_APPLICATIONS,
  APPLICATION_STATUSES,
  getRecentApplications,
} from "@/features/applications/demoApplicationsData"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export function RecentApplicationsSection({
  applications = getRecentApplications(5),
  className,
}) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("All")
  const [activeMenuId, setActiveMenuId] = useState(null)
  const [selectedCandidate, setSelectedCandidate] = useState(null)
  const [toastMessage, setToastMessage] = useState(null)
  const menuContainerRef = useRef(null)
  const navigate = useNavigate()

  // Close actions menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuContainerRef.current && !menuContainerRef.current.contains(e.target)) {
        setActiveMenuId(null)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Filter applications by search term and status
  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      const matchesSearch =
        searchTerm.trim() === "" ||
        app.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.candidateEmail.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus =
        selectedStatus === "All" || app.status.toLowerCase() === selectedStatus.toLowerCase()

      return matchesSearch && matchesStatus
    })
  }, [applications, searchTerm, selectedStatus])

  const showToast = (message) => {
    setToastMessage(message)
    setTimeout(() => {
      setToastMessage((prev) => (prev === message ? null : prev))
    }, 4000)
  }

  const handleCopyEmail = (email) => {
    navigator.clipboard?.writeText(email)
    showToast(`Copied email to clipboard: ${email}`)
    setActiveMenuId(null)
  }

  const handleSimulateAction = (actionName, candidateName) => {
    showToast(`${actionName} simulated for ${candidateName} • Connects in Milestone 7`)
    setActiveMenuId(null)
  }

  return (
    <section
      className={cn("space-y-4 select-none", className)}
      aria-label="Recent Applications"
      ref={menuContainerRef}
    >
      {/* Toast Feedback Notification */}
      {toastMessage && (
        <div className="p-3 rounded-xl bg-secondary border border-primary/20 text-xs font-semibold text-foreground flex items-center justify-between shadow-soft-sm animate-in fade-in-50 duration-150">
          <span className="flex items-center gap-2 min-w-0">
            <Sparkles className="w-4 h-4 text-primary shrink-0" />
            <span className="truncate">{toastMessage}</span>
          </span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-[11px] text-muted-foreground hover:text-foreground cursor-pointer font-bold px-1.5 shrink-0"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-2 border-b border-border/60 dark:border-white/10">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h2 className="text-xl font-extrabold tracking-tight text-foreground">
              Recent Applications
            </h2>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-semibold">
              <Building2 className="w-3.5 h-3.5" />
              <span>Acme Technologies</span>
            </div>
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-muted text-muted-foreground border border-border/60">
              {filteredApplications.length} of {applications.length} Received
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
            Review candidate submissions, demonstration AI match scores, and hiring stages for active requisitions.
          </p>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto shrink-0">
          <Link
            to="/recruiter/applications"
            className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline underline-offset-4 cursor-pointer"
          >
            <span>View All Applications</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <Input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search candidate, role, or email..."
            className="pl-9 pr-8 h-9 text-xs rounded-xl bg-card border-border/80 focus-visible:ring-primary/40"
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

        {/* Status Filter Pills (Horizontal scroll on smaller screens) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none text-xs">
          <span className="text-[11px] font-medium text-muted-foreground px-1 hidden lg:inline">
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
                    : "bg-card hover:bg-muted/70 text-muted-foreground hover:text-foreground border-border/70"
                )}
              >
                {status}
              </button>
            )
          })}
        </div>
      </div>

      {/* Populated vs Empty State Container */}
      {filteredApplications.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border/80 bg-card/60 p-8 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto text-muted-foreground">
            <Users className="w-6 h-6" />
          </div>
          <div className="space-y-1 max-w-sm mx-auto">
            <h4 className="text-sm font-bold text-foreground">No applications found</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              No candidates match your current search{" "}
              {searchTerm && <strong className="text-foreground">"{searchTerm}"</strong>}{" "}
              {selectedStatus !== "All" && (
                <>with status <strong className="text-foreground">"{selectedStatus}"</strong></>
              )}.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              setSearchTerm("")
              setSelectedStatus("All")
            }}
            className="text-xs rounded-xl"
          >
            Clear Filters
          </Button>
        </div>
      ) : (
        <>
          {/* DESKTOP & TABLET: Professional Table View (Hidden on mobile) */}
          <div className="hidden md:block rounded-2xl border border-border/80 dark:border-white/10 bg-card shadow-soft dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse" role="table">
                <thead>
                  <tr className="border-b border-border/70 dark:border-white/10 bg-muted/40 dark:bg-white/5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    <th scope="col" className="py-3.5 px-4 font-semibold">Candidate</th>
                    <th scope="col" className="py-3.5 px-4 font-semibold">Applied For</th>
                    <th scope="col" className="py-3.5 px-4 font-semibold">Applied Date</th>
                    <th scope="col" className="py-3.5 px-4 font-semibold">AI Match</th>
                    <th scope="col" className="py-3.5 px-4 font-semibold">Status</th>
                    <th scope="col" className="py-3.5 px-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 dark:divide-white/5">
                  {filteredApplications.map((app) => (
                    <tr
                      key={app.id}
                      className="hover:bg-muted/30 dark:hover:bg-white/5 transition-colors group"
                    >
                      {/* Column 1: Candidate Info */}
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
                          </div>
                        </div>
                      </td>

                      {/* Column 2: Applied For Job */}
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

                      {/* Column 4: AI Match Score */}
                      <td className="py-3.5 px-4 align-middle">
                        <AiMatchBadge score={app.aiMatchScore} />
                      </td>

                      {/* Column 5: Application Status */}
                      <td className="py-3.5 px-4 align-middle">
                        <ApplicationStatusBadge status={app.status} />
                      </td>

                      {/* Column 6: Actions Menu */}
                      <td className="py-3.5 px-4 align-middle text-right">
                        <div className="relative inline-block text-left">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedCandidate(app)}
                              className="h-8 px-2 text-xs font-semibold text-muted-foreground hover:text-foreground cursor-pointer"
                              title="View candidate details"
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
                              className="absolute right-0 top-full mt-1.5 w-48 bg-popover text-popover-foreground rounded-xl border border-border/90 shadow-soft-lg p-1.5 z-40 animate-in fade-in-50 zoom-in-95 duration-150"
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
                                <span>Candidate Profile</span>
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  handleSimulateAction("Stage Advance", app.candidateName)
                                }
                                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-foreground hover:bg-muted/70 transition-colors cursor-pointer"
                              >
                                <UserCheck className="w-3.5 h-3.5 text-primary" />
                                <span>Advance Stage</span>
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  handleSimulateAction("Interview Invite", app.candidateName)
                                }
                                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-foreground hover:bg-muted/70 transition-colors cursor-pointer"
                              >
                                <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                                <span>Schedule Interview</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleCopyEmail(app.candidateEmail)}
                                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-foreground hover:bg-muted/70 transition-colors cursor-pointer"
                              >
                                <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                                <span>Copy Email</span>
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

          {/* MOBILE: Clean Card / List Presentation (No Horizontal Table Overflow) */}
          <div className="block md:hidden space-y-3">
            {filteredApplications.map((app) => (
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

                {/* Metadata Row: Date & Match Score */}
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
                    onClick={() => handleSimulateAction("Stage Advance", app.candidateName)}
                    className="text-xs font-semibold rounded-xl h-8 px-3"
                  >
                    <span>Advance</span>
                    <ChevronRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Demonstration Candidate Detail Modal Preview */}
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
                    handleSimulateAction("Interview Invite", selectedCandidate.candidateName)
                    setSelectedCandidate(null)
                  }}
                  className="text-xs font-semibold rounded-xl"
                >
                  <Calendar className="w-3.5 h-3.5 mr-1" />
                  <span>Interview</span>
                </Button>

                <Button
                  type="button"
                  variant="default"
                  size="sm"
                  onClick={() => {
                    handleSimulateAction("Advance Stage", selectedCandidate.candidateName)
                    setSelectedCandidate(null)
                  }}
                  className="text-xs font-semibold rounded-xl"
                >
                  <span>Advance Stage</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

