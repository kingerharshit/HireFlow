import * as React from "react"
import { createContext, useContext, useState } from "react"
import { DEMO_INTERVIEWS } from "@/features/interviews/demoInterviewsData"

const InterviewsContext = createContext(null)

export function InterviewsProvider({ children }) {
  const [interviews, setInterviews] = useState(DEMO_INTERVIEWS)

  // Format time range helper e.g. "10:30" and "11:30" -> "10:30 AM - 11:30 AM"
  const formatTimeRange = (start, end) => {
    if (!start || !end) return "Time TBA"
    const formatSingle = (t) => {
      const [h, m] = t.split(":")
      const hour = parseInt(h, 10)
      const ampm = hour >= 12 ? "PM" : "AM"
      const formattedHour = hour % 12 === 0 ? 12 : hour % 12
      return `${formattedHour.toString().padStart(2, "0")}:${m} ${ampm}`
    }
    return `${formatSingle(start)} - ${formatSingle(end)}`
  }

  // Format date string helper e.g. "2026-11-15" -> "Nov 15, 2026"
  const formatDateString = (dateStr) => {
    if (!dateStr) return "Date TBA"
    try {
      const [year, month, day] = dateStr.split("-")
      const d = new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10))
      return d.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })
    } catch {
      return dateStr
    }
  }

  // Schedule new interview
  const scheduleInterview = (data) => {
    const newId = `int-${Date.now().toString().slice(-4)}`
    const dateFormatted = formatDateString(data.date)
    const timeFormatted = formatTimeRange(data.startTime, data.endTime)

    const newInterview = {
      id: newId,
      organizationId: "org-1",
      organizationName: "Acme Technologies",
      applicationId: data.applicationId || "app-manual",
      candidateId: data.candidateId,
      candidateName: data.candidateName,
      candidateEmail: data.candidateEmail,
      candidateAvatar: data.candidateAvatar || data.candidateName.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase(),
      candidateAvatarGradient: data.candidateAvatarGradient || "from-primary to-orange-600",
      candidateLocation: data.candidateLocation || "Remote — India",
      jobId: data.jobId,
      jobTitle: data.jobTitle,
      jobDepartment: data.jobDepartment || "Engineering",
      round: data.round || "Technical Assessment (Round 2)",
      roundNumber: data.roundNumber || 2,
      interviewType: data.interviewType || "Online",
      date: data.date,
      dateFormatted: dateFormatted,
      startTime: data.startTime,
      endTime: data.endTime,
      timeFormatted: timeFormatted,
      interviewerName: data.interviewerName,
      interviewerRole: data.interviewerRole || "Senior Interviewer",
      interviewerEmail: data.interviewerEmail || "interviewer@acmetech.demo",
      meetingLink: data.interviewType === "Online" ? (data.meetingLink || `https://meet.google.com/hfw-${newId}`) : null,
      location: data.interviewType === "In-person" ? (data.location || "Acme HQ, Bangalore") : null,
      status: "Scheduled",
      rescheduleReason: null,
      cancelReason: null,
      notes: data.notes || "Standard interview agenda per Acme Technologies rubric.",
      feedback: null,
    }

    setInterviews((prev) => [newInterview, ...prev])
    return newInterview
  }

  // Reschedule existing interview
  const rescheduleInterview = (interviewId, { newDate, newStartTime, newEndTime, reason }) => {
    const dateFormatted = formatDateString(newDate)
    const timeFormatted = formatTimeRange(newStartTime, newEndTime)

    setInterviews((prev) =>
      prev.map((item) => {
        if (item.id === interviewId) {
          return {
            ...item,
            date: newDate,
            dateFormatted,
            startTime: newStartTime,
            endTime: newEndTime,
            timeFormatted,
            status: "Rescheduled",
            rescheduleReason: reason || "Rescheduled per hiring team coordination.",
          }
        }
        return item
      })
    )
  }

  // Mark as Completed
  const completeInterview = (interviewId) => {
    setInterviews((prev) =>
      prev.map((item) =>
        item.id === interviewId
          ? {
              ...item,
              status: "Completed",
            }
          : item
      )
    )
  }

  // Cancel Interview
  const cancelInterview = (interviewId, reason) => {
    setInterviews((prev) =>
      prev.map((item) =>
        item.id === interviewId
          ? {
              ...item,
              status: "Cancelled",
              cancelReason: reason || "Cancelled per recruiter request.",
            }
          : item
      )
    )
  }

  // Restore/Reactivate a cancelled interview
  const restoreInterview = (interviewId) => {
    setInterviews((prev) =>
      prev.map((item) =>
        item.id === interviewId
          ? {
              ...item,
              status: "Scheduled",
              cancelReason: null,
            }
          : item
      )
    )
  }

  // Submit Feedback
  const submitFeedback = (interviewId, feedbackData) => {
    const now = new Date()
    const submittedAt = now.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })

    setInterviews((prev) =>
      prev.map((item) => {
        if (item.id === interviewId) {
          return {
            ...item,
            status: "Completed",
            feedback: {
              submittedAt,
              submittedBy: feedbackData.submittedBy || item.interviewerName,
              overallRating: Number(feedbackData.overallRating) || 4,
              technicalSkillsRating: Number(feedbackData.technicalSkillsRating) || 4,
              communicationRating: Number(feedbackData.communicationRating) || 4,
              problemSolvingRating: Number(feedbackData.problemSolvingRating) || 4,
              recommendation: feedbackData.recommendation || "Hire",
              writtenFeedback: feedbackData.writtenFeedback || "Candidate demonstrated solid competency across primary evaluation criteria.",
            },
          }
        }
        return item
      })
    )
  }

  const getInterviewById = (id) => interviews.find((i) => i.id === id)

  // Dynamic calculated counts
  const totalInterviews = interviews.length
  const upcomingInterviews = interviews.filter(
    (i) => i.status === "Scheduled" || i.status === "Rescheduled"
  ).length
  const completedInterviews = interviews.filter((i) => i.status === "Completed").length
  const pendingFeedbackInterviews = interviews.filter(
    (i) => i.status === "Completed" && !i.feedback
  ).length

  return (
    <InterviewsContext.Provider
      value={{
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
        getInterviewById,
      }}
    >
      {children}
    </InterviewsContext.Provider>
  )
}

export function useInterviews() {
  const context = useContext(InterviewsContext)
  if (!context) {
    // Graceful fallback if rendered outside provider
    return {
      interviews: DEMO_INTERVIEWS,
      totalInterviews: DEMO_INTERVIEWS.length,
      upcomingInterviews: DEMO_INTERVIEWS.filter(
        (i) => i.status === "Scheduled" || i.status === "Rescheduled"
      ).length,
      completedInterviews: DEMO_INTERVIEWS.filter((i) => i.status === "Completed").length,
      pendingFeedbackInterviews: DEMO_INTERVIEWS.filter(
        (i) => i.status === "Completed" && !i.feedback
      ).length,
      scheduleInterview: () => {},
      rescheduleInterview: () => {},
      completeInterview: () => {},
      cancelInterview: () => {},
      restoreInterview: () => {},
      submitFeedback: () => {},
      getInterviewById: (id) => DEMO_INTERVIEWS.find((i) => i.id === id),
    }
  }
  return context
}

