import * as React from "react"
import { createContext, useContext, useState } from "react"
import { DEMO_JOBS } from "@/features/jobs/demoJobsData"

const JobsContext = createContext(null)

export function JobsProvider({ children }) {
  const [jobs, setJobs] = useState(DEMO_JOBS)

  // Create a new job in local session state
  const createJob = (newJobData, asDraft = false) => {
    const status = asDraft ? "Draft" : "Published"
    const visibility = asDraft ? "Internal Recruiter Only" : "Publicly Discoverable"
    const now = new Date()
    const dateStr = now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })

    const formattedSalary =
      newJobData.salaryMin && newJobData.salaryMax
        ? `₹${Number(newJobData.salaryMin).toLocaleString()} - ₹${Number(newJobData.salaryMax).toLocaleString()}`
        : "Competitive"

    const newJob = {
      id: `job-${Date.now().toString().slice(-6)}`,
      organizationId: "org-1",
      organizationName: "Acme Technologies",
      title: newJobData.title,
      department: newJobData.department || "Engineering",
      location: newJobData.location || "Remote — India",
      workplaceType: newJobData.workplaceType || "Remote",
      employmentType: newJobData.employmentType || "Full-time",
      status: status,
      candidateVisibility: visibility,
      openings: Number(newJobData.openings) || 1,
      applicationsCount: 0,
      targetApplications: Number(newJobData.targetApplications) || 50,
      publishedDate: asDraft ? "Not yet published" : dateStr,
      createdDate: dateStr,
      deadline: newJobData.deadline || "Open until filled",
      daysRemaining: asDraft ? "Not yet published" : "30 days left",
      daysAgo: 0,
      salaryMin: Number(newJobData.salaryMin) || 0,
      salaryMax: Number(newJobData.salaryMax) || 0,
      currency: newJobData.currency || "INR",
      salaryRange: formattedSalary,
      experienceLevel: `${newJobData.minExperience || 3}+ yrs (${newJobData.minExperience || 3}-${newJobData.maxExperience || 6} yrs)`,
      minExperience: Number(newJobData.minExperience) || 3,
      maxExperience: Number(newJobData.maxExperience) || 6,
      education: newJobData.education || "Bachelor's degree or equivalent experience",
      skills: Array.isArray(newJobData.skills)
        ? newJobData.skills
        : (newJobData.skills || "").split(",").map((s) => s.trim()).filter(Boolean),
      preferredSkills: Array.isArray(newJobData.preferredSkills)
        ? newJobData.preferredSkills
        : (newJobData.preferredSkills || "").split(",").map((s) => s.trim()).filter(Boolean),
      pipeline: {
        reviewing: 0,
        interviewing: 0,
        shortlisted: 0,
        offered: 0,
      },
      description: newJobData.description || "Exciting opportunity at Acme Technologies.",
      responsibilities: newJobData.responsibilities || "Deliver high-impact results for our multi-tenant SaaS products.",
    }

    setJobs((prev) => [newJob, ...prev])
    return newJob
  }

  // Update existing job
  const updateJob = (jobId, updatedFields) => {
    setJobs((prev) =>
      prev.map((job) => (job.id === jobId ? { ...job, ...updatedFields } : job))
    )
  }

  // Lifecycle Transition: Publish Draft
  const publishJob = (jobId) => {
    const now = new Date()
    const dateStr = now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    setJobs((prev) =>
      prev.map((job) =>
        job.id === jobId
          ? {
              ...job,
              status: "Published",
              candidateVisibility: "Publicly Discoverable",
              publishedDate: dateStr,
              daysRemaining: "30 days left",
            }
          : job
      )
    )
  }

  // Lifecycle Transition: Pause Published Job
  const pauseJob = (jobId) => {
    setJobs((prev) =>
      prev.map((job) =>
        job.id === jobId
          ? {
              ...job,
              status: "Paused",
              candidateVisibility: "Hidden from Candidates",
              daysRemaining: "Paused by recruiter",
            }
          : job
      )
    )
  }

  // Lifecycle Transition: Resume Paused Job
  const resumeJob = (jobId) => {
    setJobs((prev) =>
      prev.map((job) =>
        job.id === jobId
          ? {
              ...job,
              status: "Published",
              candidateVisibility: "Publicly Discoverable",
              daysRemaining: "Active",
            }
          : job
      )
    )
  }

  // Lifecycle Transition: Close Job
  const closeJob = (jobId) => {
    setJobs((prev) =>
      prev.map((job) =>
        job.id === jobId
          ? {
              ...job,
              status: "Closed",
              candidateVisibility: "Applications Closed",
              daysRemaining: "Position Closed",
            }
          : job
      )
    )
  }

  // Lifecycle Transition: Archive Job
  const archiveJob = (jobId) => {
    setJobs((prev) =>
      prev.map((job) =>
        job.id === jobId
          ? {
              ...job,
              status: "Archived",
              candidateVisibility: "Archived",
              daysRemaining: "Archived",
            }
          : job
      )
    )
  }

  const getJobById = (jobId) => jobs.find((j) => j.id === jobId)

  const getPublishedJobs = () => jobs.filter((j) => j.status === "Published")

  return (
    <JobsContext.Provider
      value={{
        jobs,
        createJob,
        updateJob,
        publishJob,
        pauseJob,
        resumeJob,
        closeJob,
        archiveJob,
        getJobById,
        getPublishedJobs,
      }}
    >
      {children}
    </JobsContext.Provider>
  )
}

export function useJobs() {
  const context = useContext(JobsContext)
  if (!context) {
    // Graceful fallback for components used outside JobsProvider
    return {
      jobs: DEMO_JOBS,
      createJob: () => {},
      updateJob: () => {},
      publishJob: () => {},
      pauseJob: () => {},
      resumeJob: () => {},
      closeJob: () => {},
      archiveJob: () => {},
      getJobById: (id) => DEMO_JOBS.find((j) => j.id === id),
      getPublishedJobs: () => DEMO_JOBS.filter((j) => j.status === "Published"),
    }
  }
  return context
}

