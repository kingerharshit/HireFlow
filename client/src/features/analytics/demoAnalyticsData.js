/**
 * HireFlow Recruiter Workspace - Centralized Demonstration Analytics Dataset
 * Single source of truth for Acme Technologies (org-1) Hiring Analytics.
 * Derived from and logically consistent with existing Jobs, Candidates, Applications, and Interviews.
 */

export const DATE_RANGES = [
  { label: "Last 7 Days", value: "7d" },
  { label: "Last 30 Days", value: "30d" },
  { label: "Last 90 Days", value: "90d" },
  { label: "This Year (2026)", value: "year" },
]

export const ANALYTICS_JOBS = [
  { id: "all", label: "All Requisitions" },
  { id: "job-sr-frontend", label: "Senior Frontend Developer (Engineering)" },
  { id: "job-backend-dev", label: "Backend Developer (Engineering)" },
  { id: "job-ui-ux-designer", label: "UI/UX Designer (Product Design)" },
  { id: "job-product-manager", label: "Product Manager (Growth & Strategy)" },
  { id: "job-cloud-infra-lead", label: "Cloud Infrastructure Lead (Platform)" },
]

/**
 * Base Acme Technologies analytics state.
 * Dynamically scaled when filters (date range / job) are applied.
 */
export const BASE_ANALYTICS = {
  organizationId: "org-1",
  organizationName: "Acme Technologies",

  kpis: {
    totalApplications: {
      value: 239,
      prevValue: 202,
      trendPercent: 18.3,
      trendDirection: "up", // 'up' is positive for applications
      isPositive: true,
      subtext: "vs previous period (202)",
    },
    avgTimeToHire: {
      value: 24,
      unit: "days",
      prevValue: 27,
      trendPercent: 11.1,
      trendDirection: "down", // 'down' is positive for time-to-hire (faster)
      isPositive: true,
      subtext: "3.2 days faster than benchmark",
    },
    interviewToHireRate: {
      value: 28.5,
      unit: "%",
      prevValue: 26.1,
      trendPercent: 2.4,
      trendDirection: "up",
      isPositive: true,
      subtext: "14 hires from 49 interview rounds",
    },
    offerAcceptanceRate: {
      value: 87.5,
      unit: "%",
      prevValue: 83.3,
      trendPercent: 4.2,
      trendDirection: "up",
      isPositive: true,
      subtext: "14 accepted out of 16 offers",
    },
  },

  // Recruitment Funnel: strictly decreasing numbers (logically consistent)
  funnel: [
    { stage: "Applications Received", count: 239, percentage: 100, stepConversion: 100 },
    { stage: "Screening Passed", count: 142, percentage: 59.4, stepConversion: 59.4 },
    { stage: "Shortlisted", count: 68, percentage: 28.5, stepConversion: 47.9 },
    { stage: "Interview Conducted", count: 34, percentage: 14.2, stepConversion: 50.0 },
    { stage: "Offer Extended", count: 16, percentage: 6.7, stepConversion: 47.1 },
    { stage: "Hired & Onboarded", count: 14, percentage: 5.9, stepConversion: 87.5 },
  ],

  // Monthly Trend Series (Applications vs Hires)
  trends: [
    { period: "May", applications: 22, hires: 1, interviews: 5 },
    { period: "Jun", applications: 28, hires: 2, interviews: 7 },
    { period: "Jul", applications: 34, hires: 2, interviews: 8 },
    { period: "Aug", applications: 41, hires: 3, interviews: 11 },
    { period: "Sep", applications: 52, hires: 4, interviews: 14 },
    { period: "Oct", applications: 62, hires: 4, interviews: 18 },
  ],

  // Candidate Acquisition Channels
  sources: [
    {
      source: "LinkedIn",
      count: 110,
      percentage: 46.0,
      hires: 7,
      conversionRate: 6.4,
      color: "#0A66C2",
    },
    {
      source: "Company Website",
      count: 67,
      percentage: 28.0,
      hires: 4,
      conversionRate: 6.0,
      color: "#F47758", // Brand Coral
    },
    {
      source: "Employee Referrals",
      count: 33,
      percentage: 13.8,
      hires: 3,
      conversionRate: 9.1, // Highest quality conversion
      color: "#10B981", // Emerald
    },
    {
      source: "Job Portals",
      count: 19,
      percentage: 7.9,
      hires: 0,
      conversionRate: 0.0,
      color: "#8B5CF6", // Violet
    },
    {
      source: "Direct Outreach / Other",
      count: 10,
      percentage: 4.2,
      hires: 0,
      conversionRate: 0.0,
      color: "#64748B", // Slate
    },
  ],

  // Department Breakdown
  departments: [
    {
      department: "Engineering",
      applications: 140,
      hires: 9,
      openings: 5,
      avgTimeToHire: 21,
      offerAcceptance: "90%",
      color: "#F47758",
    },
    {
      department: "Platform & Infrastructure",
      applications: 65,
      hires: 2,
      openings: 1,
      avgTimeToHire: 26,
      offerAcceptance: "100%",
      color: "#3B82F6",
    },
    {
      department: "Product Design",
      applications: 34,
      hires: 2,
      openings: 1,
      avgTimeToHire: 23,
      offerAcceptance: "85%",
      color: "#10B981",
    },
    {
      department: "Growth & Strategy",
      applications: 12,
      hires: 1,
      openings: 1,
      avgTimeToHire: 29,
      offerAcceptance: "75%",
      color: "#8B5CF6",
    },
  ],

  // Recent Hiring Milestones (linked to Acme demo records)
  recentMilestones: [
    {
      id: "act-1",
      type: "HIRED",
      candidateName: "Karthik Raman",
      candidateAvatar: "KR",
      candidateGradient: "from-[#F47758] to-[#D94F2D]",
      jobTitle: "Backend Developer",
      department: "Engineering",
      date: "Oct 29, 2026",
      relativeTime: "2 days ago",
      details: "Signed employment contract. Start date scheduled for Nov 16.",
    },
    {
      id: "act-2",
      type: "OFFER_ACCEPTED",
      candidateName: "Rohan Iyer",
      candidateAvatar: "RI",
      candidateGradient: "from-emerald-500 to-teal-600",
      jobTitle: "Backend Developer",
      department: "Engineering",
      date: "Oct 27, 2026",
      relativeTime: "4 days ago",
      details: "Formal offer package accepted (₹34,00,000 CTC + ESOPs).",
    },
    {
      id: "act-3",
      type: "INTERVIEW_COMPLETED",
      candidateName: "Aarav Mehta",
      candidateAvatar: "AM",
      candidateGradient: "from-blue-500 to-indigo-600",
      jobTitle: "Senior Frontend Developer",
      department: "Engineering",
      date: "Oct 26, 2026",
      relativeTime: "5 days ago",
      details: "Evaluator feedback submitted (5/5 Overall: Strong Hire).",
    },
    {
      id: "act-4",
      type: "SHORTLISTED",
      candidateName: "Neha Kapoor",
      candidateAvatar: "NK",
      candidateGradient: "from-fuchsia-500 to-pink-600",
      jobTitle: "Product Manager",
      department: "Growth & Strategy",
      date: "Oct 24, 2026",
      relativeTime: "1 week ago",
      details: "Passed initial PRD review. Moving to Case Study presentation.",
    },
    {
      id: "act-5",
      type: "APPLICATION_RECEIVED",
      candidateName: "Pooja Nair",
      candidateAvatar: "PN",
      candidateGradient: "from-cyan-500 to-blue-600",
      jobTitle: "Senior Frontend Developer",
      department: "Engineering",
      date: "Oct 21, 2026",
      relativeTime: "10 days ago",
      details: "Applied via Company Careers Portal. AI Match Score: 74%.",
    },
  ],
}

/**
 * Filter data generator that proportionally scales metrics based on
 * date range and job selection while guaranteeing strict logical consistency.
 */
export function getAnalyticsData(dateRange = "90d", jobId = "all") {
  // Scaling factors based on date range
  let timeMultiplier = 1.0
  if (dateRange === "7d") timeMultiplier = 0.18
  else if (dateRange === "30d") timeMultiplier = 0.52
  else if (dateRange === "90d") timeMultiplier = 1.0
  else if (dateRange === "year") timeMultiplier = 1.45

  // Job specific weighting
  let jobWeight = 1.0
  let jobName = "All Requisitions"
  if (jobId === "job-sr-frontend") {
    jobWeight = 0.20
    jobName = "Senior Frontend Developer"
  } else if (jobId === "job-backend-dev") {
    jobWeight = 0.38
    jobName = "Backend Developer"
  } else if (jobId === "job-ui-ux-designer") {
    jobWeight = 0.14
    jobName = "UI/UX Designer"
  } else if (jobId === "job-product-manager") {
    jobWeight = 0.08
    jobName = "Product Manager"
  } else if (jobId === "job-cloud-infra-lead") {
    jobWeight = 0.27
    jobName = "Cloud Infrastructure Lead"
  }

  const multiplier = timeMultiplier * jobWeight

  // Calculate scaled Total Applications
  const scaledApps = Math.max(12, Math.round(BASE_ANALYTICS.kpis.totalApplications.value * multiplier))
  const prevApps = Math.round(scaledApps * 0.85)
  const appTrend = Math.round(((scaledApps - prevApps) / prevApps) * 1000) / 10

  // Calculate scaled Funnel with guaranteed logical consistency (each step <= previous)
  const fScreening = Math.max(8, Math.round(scaledApps * 0.594))
  const fShortlisted = Math.max(5, Math.round(fScreening * 0.479))
  const fInterview = Math.max(3, Math.round(fShortlisted * 0.500))
  const fOffer = Math.max(2, Math.round(fInterview * 0.471))
  const fHired = Math.max(1, Math.min(fOffer, Math.round(fOffer * 0.875)))

  const funnel = [
    {
      stage: "Applications Received",
      count: scaledApps,
      percentage: 100,
      stepConversion: 100,
    },
    {
      stage: "Screening Passed",
      count: fScreening,
      percentage: Math.round((fScreening / scaledApps) * 1000) / 10,
      stepConversion: Math.round((fScreening / scaledApps) * 1000) / 10,
    },
    {
      stage: "Shortlisted",
      count: fShortlisted,
      percentage: Math.round((fShortlisted / scaledApps) * 1000) / 10,
      stepConversion: Math.round((fShortlisted / fScreening) * 1000) / 10,
    },
    {
      stage: "Interview Conducted",
      count: fInterview,
      percentage: Math.round((fInterview / scaledApps) * 1000) / 10,
      stepConversion: Math.round((fInterview / fShortlisted) * 1000) / 10,
    },
    {
      stage: "Offer Extended",
      count: fOffer,
      percentage: Math.round((fOffer / scaledApps) * 1000) / 10,
      stepConversion: Math.round((fOffer / fInterview) * 1000) / 10,
    },
    {
      stage: "Hired & Onboarded",
      count: fHired,
      percentage: Math.round((fHired / scaledApps) * 1000) / 10,
      stepConversion: Math.round((fHired / fOffer) * 1000) / 10,
    },
  ]

  // Scaled KPIs
  const kpis = {
    totalApplications: {
      value: scaledApps,
      prevValue: prevApps,
      trendPercent: appTrend,
      trendDirection: "up",
      isPositive: true,
      subtext: `vs previous period (${prevApps})`,
    },
    avgTimeToHire: {
      value: jobId === "all" ? 24 : Math.round(20 + jobWeight * 12),
      unit: "days",
      prevValue: 27,
      trendPercent: 11.1,
      trendDirection: "down",
      isPositive: true,
      subtext: "3.2 days faster than benchmark",
    },
    interviewToHireRate: {
      value: Math.round((fHired / fInterview) * 1000) / 10,
      unit: "%",
      prevValue: 26.1,
      trendPercent: 2.4,
      trendDirection: "up",
      isPositive: true,
      subtext: `${fHired} hires from ${fInterview} interviewees`,
    },
    offerAcceptanceRate: {
      value: Math.round((fHired / fOffer) * 1000) / 10,
      unit: "%",
      prevValue: 83.3,
      trendPercent: 4.2,
      trendDirection: "up",
      isPositive: true,
      subtext: `${fHired} accepted out of ${fOffer} offers`,
    },
  }

  // Scaled Trends
  const trends = BASE_ANALYTICS.trends.map((t, idx) => {
    const factor = Math.max(0.2, multiplier * (0.8 + idx * 0.08))
    return {
      period: t.period,
      applications: Math.max(3, Math.round(t.applications * factor)),
      hires: Math.max(0, Math.round(t.hires * factor)),
      interviews: Math.max(1, Math.round(t.interviews * factor)),
    }
  })

  // Scaled Sources
  const sources = BASE_ANALYTICS.sources.map((s) => {
    const count = Math.max(1, Math.round(scaledApps * (s.percentage / 100)))
    const hires = Math.max(0, Math.round(fHired * (s.percentage / 100)))
    return {
      ...s,
      count,
      hires,
    }
  })

  // Departments (when filtering by a specific job, department highlights that job's department)
  const departments = BASE_ANALYTICS.departments.map((dept) => {
    const isSelectedDept =
      jobId === "all" ||
      (jobId.includes("frontend") && dept.department.includes("Engineering")) ||
      (jobId.includes("backend") && dept.department.includes("Engineering")) ||
      (jobId.includes("designer") && dept.department.includes("Design")) ||
      (jobId.includes("manager") && dept.department.includes("Growth")) ||
      (jobId.includes("infra") && dept.department.includes("Platform"))

    return {
      ...dept,
      applications: Math.max(4, Math.round(dept.applications * (isSelectedDept ? 1.0 : 0.6) * timeMultiplier)),
      hires: Math.max(1, Math.round(dept.hires * (isSelectedDept ? 1.0 : 0.5) * timeMultiplier)),
      isHighlighted: isSelectedDept,
    }
  })

  return {
    organizationName: "Acme Technologies",
    jobName,
    dateRange,
    kpis,
    funnel,
    trends,
    sources,
    departments,
    recentMilestones: BASE_ANALYTICS.recentMilestones,
  }
}

/**
 * Generates and downloads a clean CSV file representing the analytics dataset.
 */
export function exportAnalyticsToCsv(analyticsData, dateRangeLabel, jobLabel) {
  const dateStr = new Date().toISOString().split("T")[0]
  const rows = []

  // Metadata
  rows.push(["HireFlow Enterprise ATS - Hiring Performance Report"])
  rows.push(["Organization", analyticsData.organizationName])
  rows.push(["Generated Date", dateStr])
  rows.push(["Reporting Period", dateRangeLabel])
  rows.push(["Requisition Filter", jobLabel])
  rows.push([])

  // KPIs
  rows.push(["--- KEY PERFORMANCE INDICATORS ---"])
  rows.push(["Metric", "Current Value", "Comparison / Benchmark", "Trend"])
  rows.push([
    "Total Applications",
    analyticsData.kpis.totalApplications.value,
    analyticsData.kpis.totalApplications.subtext,
    `+${analyticsData.kpis.totalApplications.trendPercent}%`,
  ])
  rows.push([
    "Average Time to Hire",
    `${analyticsData.kpis.avgTimeToHire.value} days`,
    analyticsData.kpis.avgTimeToHire.subtext,
    `-${analyticsData.kpis.avgTimeToHire.trendPercent}%`,
  ])
  rows.push([
    "Interview-to-Hire Rate",
    `${analyticsData.kpis.interviewToHireRate.value}%`,
    analyticsData.kpis.interviewToHireRate.subtext,
    `+${analyticsData.kpis.interviewToHireRate.trendPercent}%`,
  ])
  rows.push([
    "Offer Acceptance Rate",
    `${analyticsData.kpis.offerAcceptanceRate.value}%`,
    analyticsData.kpis.offerAcceptanceRate.subtext,
    `+${analyticsData.kpis.offerAcceptanceRate.trendPercent}%`,
  ])
  rows.push([])

  // Funnel
  rows.push(["--- RECRUITMENT FUNNEL CONVERSION ---"])
  rows.push(["Stage", "Candidates", "Overall Conversion %", "Step-to-Step Conversion %"])
  analyticsData.funnel.forEach((item) => {
    rows.push([item.stage, item.count, `${item.percentage}%`, `${item.stepConversion}%`])
  })
  rows.push([])

  // Application Sources
  rows.push(["--- CANDIDATE APPLICATION SOURCES ---"])
  rows.push(["Source Channel", "Applications", "Share %", "Hires Generated", "Conversion %"])
  analyticsData.sources.forEach((item) => {
    rows.push([item.source, item.count, `${item.percentage}%`, item.hires, `${item.conversionRate}%`])
  })
  rows.push([])

  // Department Breakdown
  rows.push(["--- DEPARTMENT BREAKDOWN ---"])
  rows.push(["Department", "Applications", "Hires", "Avg Time to Hire", "Offer Acceptance"])
  analyticsData.departments.forEach((item) => {
    rows.push([item.department, item.applications, item.hires, `${item.avgTimeToHire} days`, item.offerAcceptance])
  })

  // Format as CSV content
  const csvContent =
    "data:text/csv;charset=utf-8," +
    rows
      .map((row) =>
        row
          .map((cell) => {
            const str = String(cell ?? "")
            return str.includes(",") || str.includes('"') ? `"${str.replace(/"/g, '""')}"` : str
          })
          .join(",")
      )
      .join("\n")

  // Native browser blob trigger
  const encodedUri = encodeURI(csvContent)
  const link = document.createElement("a")
  link.setAttribute("href", encodedUri)
  const sanitizedJob = jobLabel.replace(/[^a-zA-Z0-9]/g, "_").slice(0, 20)
  link.setAttribute("download", `HireFlow_Analytics_Acme_${sanitizedJob}_${dateStr}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

