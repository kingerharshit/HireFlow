import { Briefcase, FileText, Users, UserCheck } from "lucide-react"

/**
 * HireFlow Recruiter Dashboard - Demonstration Statistics Data
 * Ready for backend endpoint wiring in Milestone 7.
 */
export const DEMO_STATISTICS = [
  {
    id: "active-jobs",
    title: "Active Jobs",
    value: "12",
    label: "Published requisitions",
    change: "+16.7%",
    isPositive: true,
    period: "vs. last month",
    icon: Briefcase,
    color: "coral",
  },
  {
    id: "total-applications",
    title: "Total Applications",
    value: "348",
    label: "Submitted candidates",
    change: "+24.5%",
    isPositive: true,
    period: "vs. last month",
    icon: FileText,
    color: "blue",
  },
  {
    id: "shortlisted-candidates",
    title: "Shortlisted Candidates",
    value: "64",
    label: "Passed AI screening",
    change: "+12.0%",
    isPositive: true,
    period: "vs. last month",
    icon: Users,
    color: "emerald",
  },
  {
    id: "hired-candidates",
    title: "Hired Candidates",
    value: "8",
    label: "Accepted offers",
    change: "+33.3%",
    isPositive: true,
    period: "vs. last quarter",
    icon: UserCheck,
    color: "amber",
  },
]

