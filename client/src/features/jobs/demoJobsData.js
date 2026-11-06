/**
 * HireFlow Recruiter Dashboard - Demonstration Active Job Roles
 * Clearly identified demonstration records for recruitment pipeline preview.
 * All records belong to Acme Technologies (org-1) in accordance with multi-tenant SaaS architecture.
 */
export const DEMO_ORGANIZATION = {
  id: "org-1",
  name: "Acme Technologies",
}

export const DEMO_JOBS = [
  {
    id: "job-sr-frontend",
    organizationId: "org-1",
    organizationName: "Acme Technologies",
    title: "Senior Frontend Developer",
    department: "Engineering",
    location: "Remote — India",
    employmentType: "Full-time",
    status: "Published",
    applicationsCount: 48,
    targetApplications: 60,
    publishedDate: "Oct 18, 2026",
    daysRemaining: "12 days left",
    salaryRange: "₹28,00,000 - ₹38,00,000",
    experienceLevel: "Senior (5+ yrs)",
    pipeline: {
      reviewing: 24,
      interviewing: 16,
      shortlisted: 6,
      offered: 2,
    },
    description:
      "Leading frontend architecture for Acme Technologies recruitment platform using React 19, Tailwind CSS, and performance-first distributed state.",
  },
  {
    id: "job-backend-dev",
    organizationId: "org-1",
    organizationName: "Acme Technologies",
    title: "Backend Developer",
    department: "Engineering",
    location: "Bangalore, India",
    employmentType: "Full-time",
    status: "Published",
    applicationsCount: 92,
    targetApplications: 100,
    publishedDate: "Oct 24, 2026",
    daysRemaining: "18 days left",
    salaryRange: "₹24,00,000 - ₹34,00,000",
    experienceLevel: "Mid-Senior (4+ yrs)",
    pipeline: {
      reviewing: 45,
      interviewing: 32,
      shortlisted: 12,
      offered: 3,
    },
    description:
      "Building resilient distributed API services, PostgreSQL schemas, and real-time event streaming for Acme Technologies multi-tenant SaaS workloads.",
  },
  {
    id: "job-ui-ux-designer",
    organizationId: "org-1",
    organizationName: "Acme Technologies",
    title: "UI/UX Designer",
    department: "Product Design",
    location: "Chandigarh, India",
    employmentType: "Hybrid",
    status: "Paused",
    applicationsCount: 34,
    targetApplications: 40,
    publishedDate: "Oct 04, 2026",
    daysRemaining: "Paused by recruiter",
    salaryRange: "₹18,00,000 - ₹26,00,000",
    experienceLevel: "Senior (4+ yrs)",
    pipeline: {
      reviewing: 18,
      interviewing: 11,
      shortlisted: 4,
      offered: 1,
    },
    description:
      "Crafting intuitive recruiter workspaces, design tokens, and candidate application flows using accessible typography and micro-interactions.",
  },
  {
    id: "job-product-manager",
    organizationId: "org-1",
    organizationName: "Acme Technologies",
    title: "Product Manager",
    department: "Growth & Strategy",
    location: "Remote — India",
    employmentType: "Full-time",
    status: "Draft",
    applicationsCount: 0,
    targetApplications: 50,
    publishedDate: "Draft saved Nov 02, 2026",
    daysRemaining: "Not yet published",
    salaryRange: "₹30,00,000 - ₹42,00,000",
    experienceLevel: "Lead (6+ yrs)",
    pipeline: {
      reviewing: 0,
      interviewing: 0,
      shortlisted: 0,
      offered: 0,
    },
    description:
      "Defining roadmap priorities, AI matching algorithms, and enterprise tenant retention metrics across Acme Technologies hiring funnels.",
  },
]
