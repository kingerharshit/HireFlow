/**
 * HireFlow Recruiter Workspace - Centralized Demonstration Settings Dataset
 * Single source of truth for Acme Technologies (org-1) and Recruiter Preferences.
 */

export const INDUSTRY_OPTIONS = [
  "Enterprise B2B SaaS & Cloud Software",
  "Fintech & Digital Payments",
  "AI & Machine Learning Infrastructure",
  "Healthcare & Life Sciences",
  "E-Commerce & Logistics",
  "Consumer Tech & Social",
]

export const COMPANY_SIZE_OPTIONS = [
  "1 - 10 Employees (Seed)",
  "11 - 50 Employees (Early Stage)",
  "51 - 200 Employees (Growth)",
  "250 - 500 Employees (Mid-Market)",
  "500+ Employees (Enterprise)",
]

export const TIMEZONE_OPTIONS = [
  { value: "Asia/Kolkata", label: "Asia/Kolkata (IST, UTC+05:30)" },
  { value: "America/New_York", label: "America/New_York (EST, UTC-05:00)" },
  { value: "America/Los_Angeles", label: "America/Los_Angeles (PST, UTC-08:00)" },
  { value: "Europe/London", label: "Europe/London (GMT, UTC+00:00)" },
  { value: "Europe/Berlin", label: "Europe/Berlin (CET, UTC+01:00)" },
  { value: "Asia/Singapore", label: "Asia/Singapore (SGT, UTC+08:00)" },
  { value: "Asia/Tokyo", label: "Asia/Tokyo (JST, UTC+09:00)" },
]

export const LANGUAGE_OPTIONS = [
  { value: "en-US", label: "English (United States)" },
  { value: "en-GB", label: "English (United Kingdom)" },
  { value: "hi-IN", label: "Hindi (India)" },
  { value: "es-ES", label: "Spanish (Español)" },
  { value: "fr-FR", label: "French (Français)" },
  { value: "de-DE", label: "German (Deutsch)" },
]

export const CURRENCY_OPTIONS = [
  { value: "INR", label: "INR (₹) - Indian Rupee" },
  { value: "USD", label: "USD ($) - US Dollar" },
  { value: "EUR", label: "EUR (€) - Euro" },
  { value: "GBP", label: "GBP (£) - British Pound" },
  { value: "SGD", label: "SGD (S$) - Singapore Dollar" },
]

export const DEFAULT_SETTINGS = {
  general: {
    organizationName: "Acme Technologies",
    organizationWebsite: "https://acmetech.demo",
    industry: "Enterprise B2B SaaS & Cloud Software",
    companySize: "250 - 500 Employees (Mid-Market)",
    defaultTimezone: "Asia/Kolkata (IST, UTC+05:30)",
    defaultLanguage: "English (United States)",
    currency: "INR (₹) - Indian Rupee",
  },
  organizationProfile: {
    logoInitials: "AT",
    logoGradient: "from-[#F47758] to-[#D94F2D]",
    logoUrl: null,
    companyDescription:
      "Acme Technologies builds intelligent, high-throughput cloud platforms powering thousands of recruitment and workforce transactions daily. We champion engineering excellence, open feedback, competitive compensation, flexible remote arrangements, and continuous learning.",
    headquarters: "Bangalore, Karnataka, India",
    website: "https://acmetech.demo",
    industry: "Enterprise B2B SaaS & Cloud Software",
    companySize: "250 - 500 Employees",
    publicCareersUrl: "https://hireflow.demo/jobs/job-sr-frontend",
    contactEmail: "careers@acmetech.demo",
    linkedinUrl: "https://linkedin.com/company/acme-technologies-demo",
  },
  personalProfile: {
    fullName: "Alex Morgan",
    email: "alex.morgan@acmetech.demo",
    jobTitle: "Lead Technical Recruiter",
    phone: "+91 98765 43210",
    avatarInitials: "AM",
    avatarGradient: "from-[#F47758] to-[#EE6543]",
    department: "Talent Acquisition & People Operations",
    location: "Bangalore, India",
    bio: "Passionate about scaling high-performing distributed engineering and product teams across Asia-Pacific.",
  },
  notifications: {
    newApplications: true,
    interviewReminders: true,
    interviewFeedbackReminders: true,
    candidateStatusUpdates: true,
    weeklyHiringReports: true,
    productAnnouncements: false,
    channelEmail: true,
    channelInApp: true,
  },
  security: {
    twoFactorEnabled: false,
    twoFactorMethod: "Authenticator App (TOTP)",
    anonymousAnalytics: false,
    publicDirectoryListing: true,
    activeSessions: [
      {
        id: "sess-1",
        device: "Chrome 122 on Windows 11",
        location: "Bangalore, Karnataka, India",
        ipAddress: "103.21.244.12",
        lastActive: "Active Now",
        isCurrent: true,
      },
      {
        id: "sess-2",
        device: "HireFlow iOS App on iPhone 15 Pro",
        location: "Bangalore, Karnataka, India",
        ipAddress: "103.21.244.12",
        lastActive: "2 hours ago",
        isCurrent: false,
      },
      {
        id: "sess-3",
        device: "Safari 17.4 on macOS Sonoma",
        location: "Mumbai, Maharashtra, India",
        ipAddress: "49.36.120.88",
        lastActive: "3 days ago",
        isCurrent: false,
      },
    ],
  },
  appearance: {
    density: "comfortable",
    highContrastBorders: false,
    reducedMotion: false,
  },
}

const STORAGE_KEY = "hireflow_recruiter_settings_v1"

export function loadSettingsFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) }
    }
  } catch (err) {
    // Ignore storage parse error
  }
  return DEFAULT_SETTINGS
}

export function saveSettingsToStorage(settings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  } catch (err) {
    // Ignore storage set error
  }
}

