import * as React from "react"
import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import {
  Briefcase,
  Building2,
  ArrowLeft,
  Sparkles,
  Save,
  X,
  FileText,
  Coins,
  GraduationCap,
  AlertCircle,
  CheckCircle2,
  Globe,
  Lock,
  PauseCircle,
  XCircle,
  Archive,
  Layers,
  MapPin,
  ExternalLink,
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

export function EditJobPage() {
  const { jobId } = useParams()
  const navigate = useNavigate()
  const { getJobById, updateJob } = useJobs()

  const existingJob = getJobById(jobId)

  const [formData, setFormData] = useState({
    title: "",
    department: "Engineering",
    workplaceType: "Remote",
    employmentType: "Full-time",
    location: "Remote — India",
    description: "",
    responsibilities: "",
    skills: "",
    preferredSkills: "",
    minExperience: 4,
    maxExperience: 8,
    education: "Bachelor's Degree in Computer Science or equivalent practical experience",
    salaryMin: 2400000,
    salaryMax: 3400000,
    currency: "INR",
    openings: 1,
    targetApplications: 50,
    deadline: "2026-12-31",
    status: "Published",
  })

  const [formErrors, setFormErrors] = useState({})
  const [toastMessage, setToastMessage] = useState(null)
  const [isSaving, setIsSaving] = useState(false)

  // Prepopulate form when existingJob is loaded
  useEffect(() => {
    if (existingJob) {
      setFormData({
        title: existingJob.title || "",
        department: existingJob.department || "Engineering",
        workplaceType: existingJob.workplaceType || "Remote",
        employmentType: existingJob.employmentType || "Full-time",
        location: existingJob.location || "Remote — India",
        description: existingJob.description || "",
        responsibilities: existingJob.responsibilities || "",
        skills: Array.isArray(existingJob.skills)
          ? existingJob.skills.join(", ")
          : (existingJob.skills || ""),
        preferredSkills: Array.isArray(existingJob.preferredSkills)
          ? existingJob.preferredSkills.join(", ")
          : (existingJob.preferredSkills || ""),
        minExperience: existingJob.minExperience || 4,
        maxExperience: existingJob.maxExperience || 8,
        education: existingJob.education || "Bachelor's Degree in Computer Science",
        salaryMin: existingJob.salaryMin || 2400000,
        salaryMax: existingJob.salaryMax || 3400000,
        currency: existingJob.currency || "INR",
        openings: existingJob.openings || 1,
        targetApplications: existingJob.targetApplications || 50,
        deadline: existingJob.deadline || "2026-12-31",
        status: existingJob.status || "Published",
      })
    }
  }, [existingJob])

  const showToast = (message) => {
    setToastMessage(message)
    setTimeout(() => {
      setToastMessage((prev) => (prev === message ? null : prev))
    }, 4500)
  }

  // Handle Invalid Job ID or Missing Record (Prevents blank page!)
  if (!existingJob) {
    return (
      <div className="space-y-6 animate-in fade-in-50 duration-200 select-none pb-12">
        <div className="flex items-center gap-2 pb-4 border-b border-border/60">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => navigate("/recruiter/jobs")}
            className="text-xs font-semibold text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
            <span>Back to Job Management</span>
          </Button>
        </div>

        <div className="rounded-2xl border border-dashed border-rose-300 dark:border-rose-900/60 bg-card/60 p-10 text-center space-y-4 max-w-lg mx-auto mt-8">
          <div className="w-14 h-14 rounded-2xl bg-rose-500/10 text-rose-600 flex items-center justify-center mx-auto">
            <AlertCircle className="w-7 h-7" />
          </div>
          <div className="space-y-1.5">
            <h2 className="text-lg font-bold text-foreground">
              Job Requisition Not Found
            </h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              No active or archived requisition exists with ID{" "}
              <code className="px-1.5 py-0.5 rounded bg-muted font-mono text-foreground font-semibold">
                "{jobId}"
              </code>{" "}
              under organization <strong className="text-foreground">Acme Technologies</strong>.
            </p>
          </div>
          <Button
            type="button"
            variant="default"
            size="sm"
            onClick={() => navigate("/recruiter/jobs")}
            className="text-xs font-semibold rounded-xl"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
            <span>Return to Job Management</span>
          </Button>
        </div>
      </div>
    )
  }

  // Form Validation
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

  // Save Changes
  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validateForm()) {
      showToast("Please resolve validation errors before saving")
      return
    }

    setIsSaving(true)

    // Compute updated fields
    const updatedStatus = formData.status
    const visibility =
      updatedStatus === "Published"
        ? "Publicly Discoverable"
        : updatedStatus === "Paused"
        ? "Hidden from Candidates"
        : updatedStatus === "Draft"
        ? "Internal Recruiter Only"
        : "Applications Closed"

    const formattedSalary =
      formData.salaryMin && formData.salaryMax
        ? `₹${Number(formData.salaryMin).toLocaleString()} - ₹${Number(formData.salaryMax).toLocaleString()}`
        : existingJob.salaryRange

    const experienceLabel = `${formData.minExperience}+ yrs (${formData.minExperience}-${formData.maxExperience} yrs)`

    // Update job in centralized state (preserves ID, organizationId, applications count)
    updateJob(existingJob.id, {
      ...formData,
      status: updatedStatus,
      candidateVisibility: visibility,
      salaryRange: formattedSalary,
      experienceLevel: experienceLabel,
      skills: formData.skills.split(",").map((s) => s.trim()).filter(Boolean),
      preferredSkills: formData.preferredSkills.split(",").map((s) => s.trim()).filter(Boolean),
    })

    showToast(`Updated requisition "${formData.title}" successfully!`)

    // Navigate back to jobs page after saving
    setTimeout(() => {
      navigate("/recruiter/jobs")
    }, 600)
  }

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200 select-none pb-12">
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

      {/* Top Back Navigation Bar */}
      <div className="flex items-center justify-between pb-2 border-b border-border/60">
        <Link
          to="/recruiter/jobs"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Job Management</span>
        </Link>

        <div className="flex items-center gap-2">
          <span className="text-[11px] text-muted-foreground font-mono">
            Job ID: {existingJob.id}
          </span>
          <JobStatusBadge status={existingJob.status} />
        </div>
      </div>

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Edit Job Requisition
            </h1>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-semibold">
              <Building2 className="w-3.5 h-3.5" />
              <span>Acme Technologies</span>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1.5 leading-relaxed">
            Editing requisition: <strong className="text-foreground">{existingJob.title}</strong> • Updates reflect immediately across the Recruiter Workspace.
          </p>
        </div>

        {/* Quick Save/Cancel Top Controls */}
        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 flex-wrap">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => window.open(`/jobs/${existingJob.id}?preview=true`, '_blank')}
            className="h-9 px-3.5 text-xs font-semibold rounded-xl border-primary/30 text-primary hover:bg-primary/10"
          >
            <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
            <span>Preview as Candidate</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => navigate("/recruiter/jobs")}
            className="h-9 px-3.5 text-xs font-semibold rounded-xl"
          >
            Cancel
          </Button>

          <Button
            type="button"
            variant="default"
            size="sm"
            onClick={handleSubmit}
            disabled={isSaving}
            className="h-9 px-4 text-xs font-semibold rounded-xl shadow-soft-xs"
          >
            <Save className="w-3.5 h-3.5 mr-1.5" />
            <span>Save Changes</span>
          </Button>
        </div>
      </div>

      {/* Main Form Container */}
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-border/80 dark:border-white/10 bg-card p-5 sm:p-7 shadow-soft dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)] space-y-6"
      >
        {/* Validation Errors Alert Banner */}
        {Object.keys(formErrors).length > 0 && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-600 space-y-1">
            <span className="font-bold flex items-center gap-1.5 text-xs">
              <AlertCircle className="w-4 h-4" />
              <span>Please resolve the following form errors:</span>
            </span>
            <ul className="list-disc pl-5 text-[11px] space-y-0.5">
              {Object.values(formErrors).map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Section 1: Basic Information */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-border/60">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-primary" />
              <span>1. Basic Requisition Information</span>
            </h3>
            <span className="text-[11px] text-muted-foreground font-medium">Core Identifiers</span>
          </div>

          <div>
            <label className="text-xs font-semibold text-foreground block mb-1">
              Job Title *
            </label>
            <Input
              type="text"
              required
              placeholder="e.g. Senior Frontend Developer"
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              className="h-10 text-xs rounded-xl"
            />
            {formErrors.title && (
              <span className="text-[11px] text-rose-500 mt-1 block">{formErrors.title}</span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">
                Department *
              </label>
              <select
                value={formData.department}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, department: e.target.value }))
                }
                className="w-full h-10 px-3 text-xs font-medium bg-background border border-border/80 rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer"
              >
                {JOB_DEPARTMENTS.filter((d) => d !== "All Departments").map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">
                Employment Type
              </label>
              <select
                value={formData.employmentType}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, employmentType: e.target.value }))
                }
                className="w-full h-10 px-3 text-xs font-medium bg-background border border-border/80 rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer"
              >
                {EMPLOYMENT_TYPES.filter((t) => t !== "All Types").map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">
                Workplace Type
              </label>
              <select
                value={formData.workplaceType}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, workplaceType: e.target.value }))
                }
                className="w-full h-10 px-3 text-xs font-medium bg-background border border-border/80 rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer"
              >
                {WORKPLACE_TYPES.filter((w) => w !== "All Workplace Types").map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">
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
                className="h-10 text-xs rounded-xl"
              />
              {formErrors.location && (
                <span className="text-[11px] text-rose-500 mt-1 block">
                  {formErrors.location}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Section 2: Role Overview & Responsibilities */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between pb-2 border-b border-border/60">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" />
              <span>2. Role Summary & Responsibilities</span>
            </h3>
            <span className="text-[11px] text-muted-foreground font-medium">Job Description</span>
          </div>

          <div>
            <label className="text-xs font-semibold text-foreground block mb-1">
              Job Summary *
            </label>
            <textarea
              rows={3}
              placeholder="Detailed description of the role's mission and team context..."
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, description: e.target.value }))
              }
              className="w-full p-3 text-xs bg-background border border-border/80 rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
            {formErrors.description && (
              <span className="text-[11px] text-rose-500 mt-0.5 block">
                {formErrors.description}
              </span>
            )}
          </div>

          <div>
            <label className="text-xs font-semibold text-foreground block mb-1">
              Key Responsibilities *
            </label>
            <textarea
              rows={3}
              placeholder="Key deliverables and leadership duties..."
              value={formData.responsibilities}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, responsibilities: e.target.value }))
              }
              className="w-full p-3 text-xs bg-background border border-border/80 rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
            {formErrors.responsibilities && (
              <span className="text-[11px] text-rose-500 mt-0.5 block">
                {formErrors.responsibilities}
              </span>
            )}
          </div>
        </div>

        {/* Section 3: Requirements & Skills */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between pb-2 border-b border-border/60">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-primary" />
              <span>3. Requirements & Experience</span>
            </h3>
            <span className="text-[11px] text-muted-foreground font-medium">Candidate Rubrics</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">
                Required Skills (comma separated)
              </label>
              <Input
                type="text"
                placeholder="e.g. React 19, TypeScript, Vite"
                value={formData.skills}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, skills: e.target.value }))
                }
                className="h-10 text-xs rounded-xl"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">
                Preferred Skills
              </label>
              <Input
                type="text"
                placeholder="e.g. Next.js, Web Performance, CI/CD"
                value={formData.preferredSkills}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, preferredSkills: e.target.value }))
                }
                className="h-10 text-xs rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">
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
                className="h-10 text-xs rounded-xl"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">
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
                className="h-10 text-xs rounded-xl"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">
                Number of Openings
              </label>
              <Input
                type="number"
                min="1"
                value={formData.openings}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, openings: e.target.value }))
                }
                className="h-10 text-xs rounded-xl"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-foreground block mb-1">
              Education Credentials
            </label>
            <Input
              type="text"
              placeholder="e.g. Bachelor's in CS or equivalent practical experience"
              value={formData.education}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, education: e.target.value }))
              }
              className="h-10 text-xs rounded-xl"
            />
          </div>
        </div>

        {/* Section 4: Compensation & Requisition Target */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between pb-2 border-b border-border/60">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Coins className="w-4 h-4 text-primary" />
              <span>4. Target Compensation & Timeline</span>
            </h3>
            <span className="text-[11px] text-muted-foreground font-medium">Budget & Deadlines</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">
                Min Salary (INR ₹)
              </label>
              <Input
                type="number"
                value={formData.salaryMin}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, salaryMin: e.target.value }))
                }
                className="h-10 text-xs rounded-xl"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">
                Max Salary (INR ₹)
              </label>
              <Input
                type="number"
                value={formData.salaryMax}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, salaryMax: e.target.value }))
                }
                className="h-10 text-xs rounded-xl"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">
                Currency
              </label>
              <select
                value={formData.currency}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, currency: e.target.value }))
                }
                className="w-full h-10 px-3 text-xs font-medium bg-background border border-border/80 rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer"
              >
                <option value="INR">INR (₹)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">
                Target Applications
              </label>
              <Input
                type="number"
                min="10"
                value={formData.targetApplications}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, targetApplications: e.target.value }))
                }
                className="h-10 text-xs rounded-xl"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">
                Application Deadline
              </label>
              <Input
                type="date"
                value={formData.deadline}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, deadline: e.target.value }))
                }
                className="h-10 text-xs rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* Section 5: Lifecycle Status & Candidate Visibility */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between pb-2 border-b border-border/60">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Globe className="w-4 h-4 text-primary" />
              <span>5. Lifecycle Status & Candidate Visibility</span>
            </h3>
            <span className="text-[11px] text-muted-foreground font-medium">Portal Access</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">
                Requisition Lifecycle Status
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, status: e.target.value }))
                }
                className="w-full h-10 px-3 text-xs font-medium bg-background border border-border/80 rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer"
              >
                <option value="Published">Published (Active on Candidate Portal)</option>
                <option value="Draft">Draft (Internal Recruiter Only)</option>
                <option value="Paused">Paused (Hidden from Candidates)</option>
                <option value="Closed">Closed (Applications Stopped)</option>
                <option value="Archived">Archived (Historical Record)</option>
              </select>
            </div>

            <div className="p-3 rounded-xl bg-muted/40 border border-border/60 text-xs flex items-center justify-between">
              <span className="text-muted-foreground">Candidate Portal Access:</span>
              {formData.status === "Published" ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  <Globe className="w-3.5 h-3.5" />
                  <span>Publicly Discoverable</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                  <Lock className="w-3.5 h-3.5 text-amber-500" />
                  <span>Restricted to Recruiters</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Form Actions Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-border/60 gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => navigate("/recruiter/jobs")}
            className="text-xs font-semibold rounded-xl h-10 px-4"
          >
            Discard Changes
          </Button>

          <Button
            type="submit"
            variant="default"
            size="sm"
            disabled={isSaving}
            className="text-xs font-semibold rounded-xl h-10 px-5 shadow-soft-xs"
          >
            <Save className="w-3.5 h-3.5 mr-1.5" />
            <span>Save & Apply Changes</span>
          </Button>
        </div>
      </form>
    </div>
  )
}

