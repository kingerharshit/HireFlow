import * as React from "react"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import {
  Briefcase,
  Plus,
  ArrowRight,
  ExternalLink,
  Sparkles,
  X,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  Building2,
} from "lucide-react"
import { JobCard } from "./JobCard"
import { JobStatusBadge } from "./JobStatusBadge"
import { DEMO_JOBS } from "@/features/jobs/demoJobsData"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function ActiveJobsSection({
  jobs = DEMO_JOBS,
  className,
}) {
  const [selectedJob, setSelectedJob] = useState(null)
  const [toastMessage, setToastMessage] = useState(null)
  const navigate = useNavigate()

  const handleView = (job) => {
    setSelectedJob(job)
  }

  const handleEdit = (job) => {
    setToastMessage(`Edit Requisition simulated for "${job.title}" • Backend forms connect in Milestone 7`)
    setTimeout(() => setToastMessage(null), 4000)
  }

  const handleViewApplications = (job) => {
    navigate("/recruiter/applications")
  }

  const handleCreateJob = () => {
    setToastMessage("Job Creation modal simulated • Full requisition editor connects in Milestone 7")
    setTimeout(() => setToastMessage(null), 4000)
  }

  return (
    <section className={cn("space-y-4 select-none", className)} aria-label="Active Job Roles">
      {/* Toast Feedback Notification */}
      {toastMessage && (
        <div className="p-3 rounded-xl bg-secondary border border-primary/20 text-xs font-semibold text-foreground flex items-center justify-between shadow-soft-sm animate-in fade-in-50 duration-150">
          <span className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary shrink-0" />
            <span>{toastMessage}</span>
          </span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-[11px] text-muted-foreground hover:text-foreground cursor-pointer font-bold px-1.5"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Section Header with Clear Organization Context */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-2 border-b border-border/60 dark:border-white/10">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h2 className="text-xl font-extrabold tracking-tight text-foreground">
              Active Job Roles
            </h2>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-semibold">
              <Building2 className="w-3.5 h-3.5" />
              <span>Acme Technologies</span>
            </div>
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-muted text-muted-foreground border border-border/60">
              {jobs.length} Openings
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
            Manage open requisitions and candidate pipelines currently active for <strong className="text-foreground font-semibold">Acme Technologies</strong>.
          </p>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto shrink-0">
          <Link
            to="/recruiter/jobs"
            className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline underline-offset-4 cursor-pointer"
          >
            <span>View All Jobs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <Button
            type="button"
            variant="default"
            size="sm"
            onClick={handleCreateJob}
            className="h-8 px-3 text-xs font-semibold rounded-xl shadow-soft-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 shrink-0" />
            <span>Post Job</span>
          </Button>
        </div>
      </div>

      {/* Two-Column Responsive Job Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
        {jobs.map((job) => (
          <JobCard
            key={job.id}
            job={job}
            onView={handleView}
            onEdit={handleEdit}
            onViewApplications={handleViewApplications}
          />
        ))}
      </div>

      {/* Demonstration Job Detail Modal Preview */}
      {selectedJob && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label={`Requisition preview for ${selectedJob.title}`}
        >
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-200"
            onClick={() => setSelectedJob(null)}
            aria-hidden="true"
          />

          {/* Modal Panel */}
          <div className="relative w-full max-w-lg bg-card border border-border/90 dark:border-white/10 shadow-2xl rounded-2xl z-50 overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 fade-in-50 duration-150">
            {/* Modal Header */}
            <div className="flex items-start justify-between p-5 border-b border-border/70 dark:border-white/10">
              <div className="space-y-1.5 min-w-0 pr-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-md border border-primary/20">
                    <Building2 className="w-3 h-3" />
                    <span>{selectedJob.organizationName || "Acme Technologies"}</span>
                  </span>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-md">
                    {selectedJob.department}
                  </span>
                  <JobStatusBadge status={selectedJob.status} />
                </div>
                <h3 className="text-xl font-extrabold text-foreground tracking-tight">
                  {selectedJob.title}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setSelectedJob(null)}
                aria-label="Close dialog"
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4 overflow-y-auto">
              <div className="p-3.5 rounded-xl bg-muted/40 dark:bg-white/5 space-y-2 border border-border/60 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Hiring Organization:</span>
                  <span className="font-semibold text-foreground flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-primary" />
                    {selectedJob.organizationName || "Acme Technologies"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Department:</span>
                  <span className="font-semibold text-foreground">{selectedJob.department}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Location:</span>
                  <span className="font-semibold text-foreground">{selectedJob.location}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Employment Type:</span>
                  <span className="font-semibold text-foreground">{selectedJob.employmentType}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Compensation Range:</span>
                  <span className="font-semibold text-primary">{selectedJob.salaryRange}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Experience Requirement:</span>
                  <span className="font-semibold text-foreground">{selectedJob.experienceLevel}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Applications Received:</span>
                  <span className="font-semibold text-foreground">
                    {selectedJob.applicationsCount} of {selectedJob.targetApplications} target
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Role Overview
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {selectedJob.description}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-primary/5 border border-primary/20 text-xs text-muted-foreground space-y-1">
                <span className="font-semibold text-primary flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Tenant Demonstration Requisition</span>
                </span>
                <p className="text-[11px] leading-relaxed">
                  This requisition belongs strictly to tenant <strong className="text-foreground font-semibold">Acme Technologies</strong>. In production, multi-tenant boundaries are enforced at the API gateway and database levels. Deep candidate ranking algorithms connect in Milestone 7.
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-muted/30 dark:bg-white/5 border-t border-border/70 flex items-center justify-between gap-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setSelectedJob(null)}
                className="text-xs font-semibold rounded-xl"
              >
                Close Preview
              </Button>

              <Button
                type="button"
                variant="default"
                size="sm"
                onClick={() => {
                  setSelectedJob(null)
                  navigate("/recruiter/applications")
                }}
                className="text-xs font-semibold rounded-xl"
              >
                <span>View {selectedJob.applicationsCount} Applications</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

