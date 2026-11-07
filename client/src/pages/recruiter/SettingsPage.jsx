import * as React from "react"
import { useState, useEffect } from "react"
import {
  SlidersHorizontal,
  Building2,
  User,
  Bell,
  ShieldCheck,
  Palette,
  Check,
  Sparkles,
  Save,
  RotateCcw,
  Globe,
  Upload,
  Trash2,
  Lock,
  Smartphone,
  Laptop,
  LogOut,
  AlertTriangle,
  Info,
  Sun,
  Moon,
  Monitor,
  Eye,
  EyeOff,
  CheckCircle2,
  X,
  ExternalLink,
  Mail,
  Phone,
  Briefcase,
  MapPin,
  ChevronRight,
} from "lucide-react"
import { useTheme } from "@/context/ThemeContext"
import {
  DEFAULT_SETTINGS,
  INDUSTRY_OPTIONS,
  COMPANY_SIZE_OPTIONS,
  TIMEZONE_OPTIONS,
  LANGUAGE_OPTIONS,
  CURRENCY_OPTIONS,
  loadSettingsFromStorage,
  saveSettingsToStorage,
} from "@/features/settings/demoSettingsData"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export function SettingsPage() {
  const { theme, setTheme } = useTheme()

  // Primary active tab
  const [activeTab, setActiveTab] = useState("general")

  // Settings State (loaded from storage with default fallback)
  const [settings, setSettings] = useState(() => loadSettingsFromStorage())

  // Form states per section for editing
  const [generalForm, setGeneralForm] = useState(settings.general)
  const [orgForm, setOrgForm] = useState(settings.organizationProfile)
  const [profileForm, setProfileForm] = useState(settings.personalProfile)
  const [notifForm, setNotifForm] = useState(settings.notifications)
  const [securityForm, setSecurityForm] = useState(settings.security)
  const [appearanceForm, setAppearanceForm] = useState(settings.appearance)

  // Password Change Form State
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [showCurrentPw, setShowCurrentPw] = useState(false)
  const [showNewPw, setShowNewPw] = useState(false)
  const [passwordErrors, setPasswordErrors] = useState({})

  // Sign out modal state
  const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false)

  // Feedback Toast
  const [toastMessage, setToastMessage] = useState(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev))
    }, 4000)
  }

  // Navigation Items
  const NAV_ITEMS = [
    { id: "general", label: "General", icon: SlidersHorizontal, desc: "Organization identity & defaults" },
    { id: "organization", label: "Organization Profile", icon: Building2, desc: "Company branding & careers page" },
    { id: "profile", label: "Personal Profile", icon: User, desc: "Recruiter identity & contact" },
    { id: "notifications", label: "Notification Preferences", icon: Bell, desc: "Alerts & email digest toggles" },
    { id: "security", label: "Security & Privacy", icon: ShieldCheck, desc: "Password, 2FA & active sessions" },
    { id: "appearance", label: "Appearance", icon: Palette, desc: "Theme & interface display" },
  ]

  // Track unsaved changes
  useEffect(() => {
    const isDirty =
      JSON.stringify(generalForm) !== JSON.stringify(settings.general) ||
      JSON.stringify(orgForm) !== JSON.stringify(settings.organizationProfile) ||
      JSON.stringify(profileForm) !== JSON.stringify(settings.personalProfile) ||
      JSON.stringify(notifForm) !== JSON.stringify(settings.notifications) ||
      JSON.stringify(securityForm) !== JSON.stringify(settings.security) ||
      JSON.stringify(appearanceForm) !== JSON.stringify(settings.appearance)
    setHasUnsavedChanges(isDirty)
  }, [generalForm, orgForm, profileForm, notifForm, securityForm, appearanceForm, settings])

  // Save General Settings
  const handleSaveGeneral = (e) => {
    e.preventDefault()
    if (!generalForm.organizationName.trim()) {
      showToast("Organization name is required.")
      return
    }
    const updated = { ...settings, general: generalForm }
    setSettings(updated)
    saveSettingsToStorage(updated)
    showToast("General organization settings saved successfully!")
  }

  // Save Organization Profile
  const handleSaveOrgProfile = (e) => {
    e.preventDefault()
    const updated = { ...settings, organizationProfile: orgForm }
    setSettings(updated)
    saveSettingsToStorage(updated)
    showToast("Organization profile and branding updated!")
  }

  // Save Personal Profile
  const handleSaveProfile = (e) => {
    e.preventDefault()
    if (!profileForm.fullName.trim() || !profileForm.email.trim()) {
      showToast("Full name and email address are required.")
      return
    }
    const updated = { ...settings, personalProfile: profileForm }
    setSettings(updated)
    saveSettingsToStorage(updated)
    showToast("Recruiter profile updated successfully!")
  }

  // Save Notifications
  const handleSaveNotifications = () => {
    const updated = { ...settings, notifications: notifForm }
    setSettings(updated)
    saveSettingsToStorage(updated)
    showToast("Notification preferences updated!")
  }

  // Save Security & Privacy
  const handleToggle2FA = () => {
    const next2FA = !securityForm.twoFactorEnabled
    const updatedSecurity = { ...securityForm, twoFactorEnabled: next2FA }
    setSecurityForm(updatedSecurity)
    const updated = { ...settings, security: updatedSecurity }
    setSettings(updated)
    saveSettingsToStorage(updated)
    showToast(
      next2FA
        ? "Two-factor authentication enabled (Demonstration Mode)!"
        : "Two-factor authentication disabled."
    )
  }

  // Password Submit (Demo UI)
  const handlePasswordSubmit = (e) => {
    e.preventDefault()
    const errors = {}
    if (!passwordForm.currentPassword) {
      errors.currentPassword = "Enter your current password."
    }
    if (!passwordForm.newPassword || passwordForm.newPassword.length < 8) {
      errors.newPassword = "New password must be at least 8 characters."
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      errors.confirmPassword = "Passwords do not match."
    }
    if (Object.keys(errors).length > 0) {
      setPasswordErrors(errors)
      return
    }

    setPasswordErrors({})
    setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" })
    showToast("Password updated successfully! (Demonstration UI)")
  }

  // Sign out other sessions
  const handleSignOutOtherSessions = () => {
    const currentOnly = securityForm.activeSessions.filter((s) => s.isCurrent)
    const updatedSecurity = { ...securityForm, activeSessions: currentOnly }
    setSecurityForm(updatedSecurity)
    const updated = { ...settings, security: updatedSecurity }
    setSettings(updated)
    saveSettingsToStorage(updated)
    setIsSignOutModalOpen(false)
    showToast("Signed out of all other active sessions.")
  }

  // Reset to Defaults
  const handleResetDefaults = () => {
    setSettings(DEFAULT_SETTINGS)
    setGeneralForm(DEFAULT_SETTINGS.general)
    setOrgForm(DEFAULT_SETTINGS.organizationProfile)
    setProfileForm(DEFAULT_SETTINGS.personalProfile)
    setNotifForm(DEFAULT_SETTINGS.notifications)
    setSecurityForm(DEFAULT_SETTINGS.security)
    setAppearanceForm(DEFAULT_SETTINGS.appearance)
    saveSettingsToStorage(DEFAULT_SETTINGS)
    showToast("Settings reset to default configuration.")
  }

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200 select-none pb-12">
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
              Settings
            </h1>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-semibold">
              <Building2 className="w-3.5 h-3.5" />
              <span>{generalForm.organizationName}</span>
            </div>
            <Badge variant="outline" className="text-[11px] font-mono text-muted-foreground">
              Recruiter Workspace
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1.5 leading-relaxed">
            Manage your workspace defaults, company branding, recruiter identity, notification channels, and security settings.
          </p>
        </div>

        {/* Global Controls */}
        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          {hasUnsavedChanges && (
            <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-1 rounded-lg border border-amber-500/20">
              Unsaved changes
            </span>
          )}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleResetDefaults}
            className="h-9 px-3 text-xs font-semibold rounded-xl text-muted-foreground hover:text-foreground"
            title="Reset to default settings"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1" />
            <span>Reset Defaults</span>
          </Button>
        </div>
      </div>

      {/* 2. Main Settings Layout: Left Sidebar Nav on Desktop, Tabs on Mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ========================================================= */}
        {/* LEFT SETTINGS NAVIGATION (4 cols on lg) */}
        {/* ========================================================= */}
        <aside className="lg:col-span-4 space-y-2">
          {/* Mobile Horizontal Tabs (< lg) */}
          <div className="flex lg:hidden overflow-x-auto gap-1.5 pb-2 no-scrollbar border-b border-border/60">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon
              const isActive = activeTab === item.id
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={cn(
                    "px-3 py-2 rounded-xl text-xs font-bold shrink-0 flex items-center gap-1.5 transition-colors cursor-pointer",
                    isActive
                      ? "bg-primary text-white shadow-xs"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              )
            })}
          </div>

          {/* Desktop Vertical Nav List (>= lg) */}
          <div className="hidden lg:block p-2 rounded-2xl bg-card border border-border/80 dark:border-white/10 shadow-soft space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon
              const isActive = activeTab === item.id

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={cn(
                    "w-full flex items-center justify-between p-3 rounded-xl text-left transition-all cursor-pointer group",
                    isActive
                      ? "bg-primary/10 text-primary border border-primary/20 shadow-2xs font-bold"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/60 font-medium"
                  )}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors",
                        isActive
                          ? "bg-primary text-white"
                          : "bg-muted text-muted-foreground group-hover:text-foreground"
                      )}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs block truncate">{item.label}</span>
                      <span className="text-[10px] text-muted-foreground/80 block truncate font-normal">
                        {item.desc}
                      </span>
                    </div>
                  </div>
                  <ChevronRight
                    className={cn(
                      "w-4 h-4 shrink-0 transition-transform",
                      isActive ? "text-primary translate-x-0.5" : "text-muted-foreground/40"
                    )}
                  />
                </button>
              )
            })}
          </div>

          {/* Workspace Info Card */}
          <div className="hidden lg:block p-4 rounded-2xl bg-muted/30 border border-border/60 text-xs space-y-2">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
              Organization Context
            </span>
            <div className="font-extrabold text-foreground">{generalForm.organizationName}</div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              HireFlow Multi-Tenant Cloud ATS. Configuration changes are scoped exclusively to your tenant workspace.
            </p>
          </div>
        </aside>

        {/* ========================================================= */}
        {/* RIGHT SETTINGS CONTENT AREA (8 cols on lg) */}
        {/* ========================================================= */}
        <main className="lg:col-span-8 min-w-0">
          
          {/* ========================================== */}
          {/* TAB 1: GENERAL SETTINGS */}
          {/* ========================================== */}
          {activeTab === "general" && (
            <div className="p-5 sm:p-6 rounded-2xl bg-card border border-border/80 dark:border-white/10 shadow-soft space-y-6">
              <div className="pb-3 border-b border-border/60">
                <h2 className="text-lg font-black text-foreground">General Workspace Settings</h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Configure high-level organization identity, default timezone, and regional settings.
                </p>
              </div>

              <form onSubmit={handleSaveGeneral} className="space-y-4">
                {/* Organization Name & Website */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground">Organization Name *</label>
                    <Input
                      type="text"
                      value={generalForm.organizationName}
                      onChange={(e) => setGeneralForm({ ...generalForm, organizationName: e.target.value })}
                      className="text-xs rounded-xl"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground">Organization Website</label>
                    <Input
                      type="url"
                      value={generalForm.organizationWebsite}
                      onChange={(e) => setGeneralForm({ ...generalForm, organizationWebsite: e.target.value })}
                      className="text-xs rounded-xl"
                    />
                  </div>
                </div>

                {/* Industry & Company Size */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground">Industry Sector</label>
                    <select
                      value={generalForm.industry}
                      onChange={(e) => setGeneralForm({ ...generalForm, industry: e.target.value })}
                      className="w-full h-10 px-3 rounded-xl border border-input bg-card text-foreground text-xs font-medium cursor-pointer"
                    >
                      {INDUSTRY_OPTIONS.map((ind) => (
                        <option key={ind} value={ind}>
                          {ind}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground">Company Size</label>
                    <select
                      value={generalForm.companySize}
                      onChange={(e) => setGeneralForm({ ...generalForm, companySize: e.target.value })}
                      className="w-full h-10 px-3 rounded-xl border border-input bg-card text-foreground text-xs font-medium cursor-pointer"
                    >
                      {COMPANY_SIZE_OPTIONS.map((sz) => (
                        <option key={sz} value={sz}>
                          {sz}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Timezone & Language */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground">Default Timezone</label>
                    <select
                      value={generalForm.defaultTimezone}
                      onChange={(e) => setGeneralForm({ ...generalForm, defaultTimezone: e.target.value })}
                      className="w-full h-10 px-3 rounded-xl border border-input bg-card text-foreground text-xs font-medium cursor-pointer"
                    >
                      {TIMEZONE_OPTIONS.map((tz) => (
                        <option key={tz.value} value={tz.label}>
                          {tz.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground">Default Interface Language</label>
                    <select
                      value={generalForm.defaultLanguage}
                      onChange={(e) => setGeneralForm({ ...generalForm, defaultLanguage: e.target.value })}
                      className="w-full h-10 px-3 rounded-xl border border-input bg-card text-foreground text-xs font-medium cursor-pointer"
                    >
                      {LANGUAGE_OPTIONS.map((lang) => (
                        <option key={lang.value} value={lang.label}>
                          {lang.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Currency */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">Primary Compensation Currency</label>
                  <select
                    value={generalForm.currency}
                    onChange={(e) => setGeneralForm({ ...generalForm, currency: e.target.value })}
                    className="w-full sm:w-1/2 h-10 px-3 rounded-xl border border-input bg-card text-foreground text-xs font-medium cursor-pointer"
                  >
                    {CURRENCY_OPTIONS.map((cur) => (
                      <option key={cur.value} value={cur.label}>
                        {cur.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Footer Save */}
                <div className="pt-4 border-t border-border/60 flex items-center justify-between">
                  <span className="text-[11px] text-muted-foreground">
                    Changes apply immediately across all recruiter workspace modules.
                  </span>
                  <Button type="submit" variant="default" size="sm" className="text-xs font-bold rounded-xl shadow-xs">
                    <Save className="w-3.5 h-3.5 mr-1" />
                    <span>Save General Settings</span>
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* ========================================== */}
          {/* TAB 2: ORGANIZATION PROFILE */}
          {/* ========================================== */}
          {activeTab === "organization" && (
            <div className="p-5 sm:p-6 rounded-2xl bg-card border border-border/80 dark:border-white/10 shadow-soft space-y-6">
              <div className="pb-3 border-b border-border/60">
                <h2 className="text-lg font-black text-foreground">Organization Profile & Branding</h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Manage your candidate-facing careers profile, public logo, and company description.
                </p>
              </div>

              <form onSubmit={handleSaveOrgProfile} className="space-y-5">
                {/* Logo Preview & Upload */}
                <div className="p-4 rounded-2xl bg-muted/40 dark:bg-white/5 border border-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div
                      className={cn(
                        "w-16 h-16 rounded-2xl text-white font-black text-xl flex items-center justify-center shrink-0 shadow-md bg-gradient-to-br ring-2 ring-primary/20",
                        orgForm.logoGradient
                      )}
                    >
                      {orgForm.logoInitials}
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold text-foreground">{generalForm.organizationName} Logo</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Rendered on public job posts and candidate notifications.
                      </p>
                      <span className="text-[10px] text-muted-foreground font-mono">PNG, SVG or JPG (up to 2MB)</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => showToast("Logo uploaded successfully (Demonstration Mode)!")}
                      className="text-xs font-semibold rounded-xl"
                    >
                      <Upload className="w-3.5 h-3.5 mr-1" />
                      <span>Change Logo</span>
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setOrgForm({ ...orgForm, logoInitials: "AT", logoGradient: "from-[#F47758] to-[#D94F2D]" })
                        showToast("Reset to default brand initials.")
                      }}
                      className="text-xs font-semibold rounded-xl text-muted-foreground hover:text-foreground"
                    >
                      Reset
                    </Button>
                  </div>
                </div>

                {/* Company Description */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">Company Description</label>
                  <textarea
                    rows={4}
                    value={orgForm.companyDescription}
                    onChange={(e) => setOrgForm({ ...orgForm, companyDescription: e.target.value })}
                    className="w-full text-xs rounded-xl border border-input bg-transparent px-3 py-2 text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
                  />
                  <p className="text-[11px] text-muted-foreground">
                    This summary appears in the candidate-facing job details view.
                  </p>
                </div>

                {/* Location & Links */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground">Headquarters Location</label>
                    <Input
                      type="text"
                      value={orgForm.headquarters}
                      onChange={(e) => setOrgForm({ ...orgForm, headquarters: e.target.value })}
                      className="text-xs rounded-xl"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground">Talent Team Contact Email</label>
                    <Input
                      type="email"
                      value={orgForm.contactEmail}
                      onChange={(e) => setOrgForm({ ...orgForm, contactEmail: e.target.value })}
                      className="text-xs rounded-xl"
                    />
                  </div>
                </div>

                {/* LinkedIn Profile */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">Company LinkedIn Page</label>
                  <Input
                    type="url"
                    value={orgForm.linkedinUrl}
                    onChange={(e) => setOrgForm({ ...orgForm, linkedinUrl: e.target.value })}
                    className="text-xs rounded-xl"
                  />
                </div>

                {/* Public Careers Page Preview Link */}
                <div className="p-3.5 rounded-2xl bg-primary/5 border border-primary/20 flex items-center justify-between text-xs">
                  <div className="space-y-0.5">
                    <span className="font-bold text-primary flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5" />
                      <span>Public Careers Requisitions Live</span>
                    </span>
                    <p className="text-[11px] text-muted-foreground">
                      Explore how candidates view Acme Technologies published job requisitions.
                    </p>
                  </div>
                  <a
                    href="/jobs/job-sr-frontend"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline shrink-0"
                  >
                    <span>View Public Page</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                {/* Footer Save */}
                <div className="pt-4 border-t border-border/60 flex items-center justify-between">
                  <span className="text-[11px] text-muted-foreground">
                    Public branding is verified for Acme Technologies.
                  </span>
                  <Button type="submit" variant="default" size="sm" className="text-xs font-bold rounded-xl shadow-xs">
                    <Save className="w-3.5 h-3.5 mr-1" />
                    <span>Save Organization Profile</span>
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* ========================================== */}
          {/* TAB 3: PERSONAL PROFILE */}
          {/* ========================================== */}
          {activeTab === "profile" && (
            <div className="p-5 sm:p-6 rounded-2xl bg-card border border-border/80 dark:border-white/10 shadow-soft space-y-6">
              <div className="pb-3 border-b border-border/60">
                <h2 className="text-lg font-black text-foreground">Personal Recruiter Profile</h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Manage your recruiter identity, contact coordinates, and panel assignment details.
                </p>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-5">
                {/* Photo & Identity Banner */}
                <div className="p-4 rounded-2xl bg-muted/40 dark:bg-white/5 border border-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div
                      className={cn(
                        "w-14 h-14 rounded-2xl text-white font-extrabold text-lg flex items-center justify-center shrink-0 shadow-md bg-gradient-to-br ring-2 ring-primary/20",
                        profileForm.avatarGradient
                      )}
                    >
                      {profileForm.avatarInitials}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-extrabold text-foreground">{profileForm.fullName}</h4>
                        <Badge variant="outline" className="text-[10px] text-primary border-primary/25 bg-primary/5">
                          Verified Recruiter
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{profileForm.jobTitle}</p>
                      <span className="text-[10px] text-muted-foreground">{profileForm.email}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => showToast("Profile avatar updated (Demonstration Mode)!")}
                      className="text-xs font-semibold rounded-xl"
                    >
                      <Upload className="w-3.5 h-3.5 mr-1" />
                      <span>Change Avatar</span>
                    </Button>
                  </div>
                </div>

                {/* Name & Title */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground">Full Name *</label>
                    <Input
                      type="text"
                      value={profileForm.fullName}
                      onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                      className="text-xs rounded-xl"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground">Job Title *</label>
                    <Input
                      type="text"
                      value={profileForm.jobTitle}
                      onChange={(e) => setProfileForm({ ...profileForm, jobTitle: e.target.value })}
                      className="text-xs rounded-xl"
                    />
                  </div>
                </div>

                {/* Email & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground">Work Email *</label>
                    <Input
                      type="email"
                      value={profileForm.email}
                      onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                      className="text-xs rounded-xl"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground">Phone Number</label>
                    <Input
                      type="tel"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      className="text-xs rounded-xl"
                    />
                  </div>
                </div>

                {/* Department & Location */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground">Department</label>
                    <Input
                      type="text"
                      value={profileForm.department}
                      onChange={(e) => setProfileForm({ ...profileForm, department: e.target.value })}
                      className="text-xs rounded-xl"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground">Location</label>
                    <Input
                      type="text"
                      value={profileForm.location}
                      onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                      className="text-xs rounded-xl"
                    />
                  </div>
                </div>

                {/* Recruiter Bio */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">Recruiter Bio</label>
                  <textarea
                    rows={2}
                    value={profileForm.bio}
                    onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                    className="w-full text-xs rounded-xl border border-input bg-transparent px-3 py-2 text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
                  />
                </div>

                {/* Footer Save */}
                <div className="pt-4 border-t border-border/60 flex items-center justify-between">
                  <span className="text-[11px] text-muted-foreground">
                    Alex Morgan profile active for Acme Technologies.
                  </span>
                  <Button type="submit" variant="default" size="sm" className="text-xs font-bold rounded-xl shadow-xs">
                    <Save className="w-3.5 h-3.5 mr-1" />
                    <span>Save Personal Profile</span>
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* ========================================== */}
          {/* TAB 4: NOTIFICATION PREFERENCES */}
          {/* ========================================== */}
          {activeTab === "notifications" && (
            <div className="p-5 sm:p-6 rounded-2xl bg-card border border-border/80 dark:border-white/10 shadow-soft space-y-6">
              <div className="pb-3 border-b border-border/60">
                <h2 className="text-lg font-black text-foreground">Notification Preferences</h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Control which recruitment events trigger alerts and select your delivery channels.
                </p>
              </div>

              {/* Delivery Channels */}
              <div className="p-4 rounded-2xl bg-muted/40 dark:bg-white/5 border border-border/60 space-y-3">
                <span className="text-xs font-bold text-foreground uppercase tracking-wider block">
                  Active Delivery Channels
                </span>
                <div className="flex flex-wrap items-center gap-6 text-xs">
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifForm.channelEmail}
                      onChange={(e) => setNotifForm({ ...notifForm, channelEmail: e.target.checked })}
                      className="rounded border-border text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                    />
                    <span className="font-semibold text-foreground">Email Notifications ({profileForm.email})</span>
                  </label>

                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifForm.channelInApp}
                      onChange={(e) => setNotifForm({ ...notifForm, channelInApp: e.target.checked })}
                      className="rounded border-border text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                    />
                    <span className="font-semibold text-foreground">In-App Recruiter Notifications</span>
                  </label>
                </div>
              </div>

              {/* Toggles List */}
              <div className="space-y-3">
                {/* 1. New application notifications */}
                <div className="p-3.5 rounded-xl border border-border/60 hover:bg-muted/30 transition-colors flex items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-foreground block">New Application Notifications</span>
                    <p className="text-[11px] text-muted-foreground">
                      Receive an immediate alert when a candidate applies to any Acme published job.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifForm.newApplications}
                    onChange={(e) => setNotifForm({ ...notifForm, newApplications: e.target.checked })}
                    className="w-5 h-5 rounded border-border text-primary focus:ring-primary cursor-pointer shrink-0"
                  />
                </div>

                {/* 2. Interview reminders */}
                <div className="p-3.5 rounded-xl border border-border/60 hover:bg-muted/30 transition-colors flex items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-foreground block">Interview Reminders</span>
                    <p className="text-[11px] text-muted-foreground">
                      Receive calendar alerts 1 hour and 15 minutes before scheduled candidate interviews.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifForm.interviewReminders}
                    onChange={(e) => setNotifForm({ ...notifForm, interviewReminders: e.target.checked })}
                    className="w-5 h-5 rounded border-border text-primary focus:ring-primary cursor-pointer shrink-0"
                  />
                </div>

                {/* 3. Interview feedback reminders */}
                <div className="p-3.5 rounded-xl border border-border/60 hover:bg-muted/30 transition-colors flex items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-foreground block">Interview Feedback Reminders</span>
                    <p className="text-[11px] text-muted-foreground">
                      Remind interview panel members when candidate evaluation scores are pending submission.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifForm.interviewFeedbackReminders}
                    onChange={(e) => setNotifForm({ ...notifForm, interviewFeedbackReminders: e.target.checked })}
                    className="w-5 h-5 rounded border-border text-primary focus:ring-primary cursor-pointer shrink-0"
                  />
                </div>

                {/* 4. Candidate status updates */}
                <div className="p-3.5 rounded-xl border border-border/60 hover:bg-muted/30 transition-colors flex items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-foreground block">Candidate Status Updates</span>
                    <p className="text-[11px] text-muted-foreground">
                      Get notified when candidate stages advance to Shortlisted, Offered, or Hired.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifForm.candidateStatusUpdates}
                    onChange={(e) => setNotifForm({ ...notifForm, candidateStatusUpdates: e.target.checked })}
                    className="w-5 h-5 rounded border-border text-primary focus:ring-primary cursor-pointer shrink-0"
                  />
                </div>

                {/* 5. Weekly hiring reports */}
                <div className="p-3.5 rounded-xl border border-border/60 hover:bg-muted/30 transition-colors flex items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-foreground block">Weekly Hiring Analytics Digest</span>
                    <p className="text-[11px] text-muted-foreground">
                      Weekly Monday morning summary of pipeline conversion, time-to-hire velocity, and candidate volume.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifForm.weeklyHiringReports}
                    onChange={(e) => setNotifForm({ ...notifForm, weeklyHiringReports: e.target.checked })}
                    className="w-5 h-5 rounded border-border text-primary focus:ring-primary cursor-pointer shrink-0"
                  />
                </div>

                {/* 6. Product announcements */}
                <div className="p-3.5 rounded-xl border border-border/60 hover:bg-muted/30 transition-colors flex items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-foreground block">HireFlow Product & Feature Updates</span>
                    <p className="text-[11px] text-muted-foreground">
                      Quarterly product release notes and ATS enhancements.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifForm.productAnnouncements}
                    onChange={(e) => setNotifForm({ ...notifForm, productAnnouncements: e.target.checked })}
                    className="w-5 h-5 rounded border-border text-primary focus:ring-primary cursor-pointer shrink-0"
                  />
                </div>
              </div>

              {/* Save */}
              <div className="pt-4 border-t border-border/60 flex items-center justify-between">
                <span className="text-[11px] text-muted-foreground">
                  Preferences stored in session memory.
                </span>
                <Button
                  type="button"
                  variant="default"
                  size="sm"
                  onClick={handleSaveNotifications}
                  className="text-xs font-bold rounded-xl shadow-xs"
                >
                  <Save className="w-3.5 h-3.5 mr-1" />
                  <span>Save Preferences</span>
                </Button>
              </div>
            </div>
          )}

          {/* ========================================== */}
          {/* TAB 5: SECURITY & PRIVACY */}
          {/* ========================================== */}
          {activeTab === "security" && (
            <div className="space-y-6">
              {/* Notice Banner */}
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-2.5 text-xs text-amber-800 dark:text-amber-300">
                <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  <strong>Demonstration UI Notice:</strong> Security operations below illustrate enterprise ATS credential management, two-factor controls, and device session tracking in frontend demonstration mode.
                </span>
              </div>

              {/* 1. Change Password */}
              <div className="p-5 sm:p-6 rounded-2xl bg-card border border-border/80 dark:border-white/10 shadow-soft space-y-4">
                <div className="pb-2 border-b border-border/60">
                  <h3 className="text-base font-extrabold text-foreground flex items-center gap-2">
                    <Lock className="w-4 h-4 text-primary" />
                    <span>Change Account Password</span>
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Update your recruiter workspace credentials. Must be at least 8 characters.
                  </p>
                </div>

                <form onSubmit={handlePasswordSubmit} className="space-y-3.5 max-w-md">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-foreground">Current Password</label>
                    <div className="relative">
                      <Input
                        type={showCurrentPw ? "text" : "password"}
                        value={passwordForm.currentPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                        className={cn("text-xs rounded-xl pr-9", passwordErrors.currentPassword && "border-destructive")}
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPw(!showCurrentPw)}
                        className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground cursor-pointer"
                      >
                        {showCurrentPw ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    {passwordErrors.currentPassword && (
                      <p className="text-[11px] text-destructive">{passwordErrors.currentPassword}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-foreground">New Password</label>
                    <div className="relative">
                      <Input
                        type={showNewPw ? "text" : "password"}
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                        className={cn("text-xs rounded-xl pr-9", passwordErrors.newPassword && "border-destructive")}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPw(!showNewPw)}
                        className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground cursor-pointer"
                      >
                        {showNewPw ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    {passwordErrors.newPassword && (
                      <p className="text-[11px] text-destructive">{passwordErrors.newPassword}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-foreground">Confirm New Password</label>
                    <Input
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                      className={cn("text-xs rounded-xl", passwordErrors.confirmPassword && "border-destructive")}
                    />
                    {passwordErrors.confirmPassword && (
                      <p className="text-[11px] text-destructive">{passwordErrors.confirmPassword}</p>
                    )}
                  </div>

                  <Button type="submit" variant="default" size="sm" className="text-xs font-bold rounded-xl mt-2">
                    Update Password (Demo)
                  </Button>
                </form>
              </div>

              {/* 2. Two-Factor Authentication */}
              <div className="p-5 sm:p-6 rounded-2xl bg-card border border-border/80 dark:border-white/10 shadow-soft space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-border/60">
                  <div>
                    <h3 className="text-base font-extrabold text-foreground flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-primary" />
                      <span>Two-Factor Authentication (2FA)</span>
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Add an additional layer of security to your recruiter session via TOTP Authenticator.
                    </p>
                  </div>

                  <Button
                    type="button"
                    variant={securityForm.twoFactorEnabled ? "destructive" : "default"}
                    size="sm"
                    onClick={handleToggle2FA}
                    className="text-xs font-bold rounded-xl shrink-0"
                  >
                    {securityForm.twoFactorEnabled ? "Disable 2FA" : "Enable 2FA (Demo)"}
                  </Button>
                </div>

                <div className="flex items-center gap-3 text-xs">
                  <span className="text-muted-foreground">Current Status:</span>
                  <Badge
                    variant="outline"
                    className={cn(
                      "font-bold text-xs",
                      securityForm.twoFactorEnabled
                        ? "text-emerald-600 border-emerald-500/30 bg-emerald-500/10"
                        : "text-muted-foreground border-border"
                    )}
                  >
                    {securityForm.twoFactorEnabled ? "Active: Authenticator App (Demo)" : "Not Enabled"}
                  </Badge>
                </div>
              </div>

              {/* 3. Active Sessions */}
              <div className="p-5 sm:p-6 rounded-2xl bg-card border border-border/80 dark:border-white/10 shadow-soft space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-border/60">
                  <div>
                    <h3 className="text-base font-extrabold text-foreground flex items-center gap-2">
                      <Laptop className="w-4 h-4 text-primary" />
                      <span>Active Browser & Device Sessions</span>
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Devices currently authorized for Alex Morgan ({generalForm.organizationName}).
                    </p>
                  </div>

                  {securityForm.activeSessions.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setIsSignOutModalOpen(true)}
                      className="text-xs font-semibold rounded-xl text-destructive hover:bg-destructive/10 border-destructive/30 shrink-0"
                    >
                      <LogOut className="w-3.5 h-3.5 mr-1" />
                      <span>Sign out other devices</span>
                    </Button>
                  )}
                </div>

                <div className="space-y-2.5">
                  {securityForm.activeSessions.map((sess) => (
                    <div
                      key={sess.id}
                      className="p-3.5 rounded-xl bg-muted/30 border border-border/60 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-card border border-border flex items-center justify-center shrink-0">
                          {sess.device.includes("iOS") ? (
                            <Smartphone className="w-4 h-4 text-primary" />
                          ) : (
                            <Laptop className="w-4 h-4 text-primary" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-foreground truncate">{sess.device}</span>
                            {sess.isCurrent && (
                              <Badge variant="outline" className="text-[10px] text-emerald-600 border-emerald-500/30 bg-emerald-500/10">
                                Current Session
                              </Badge>
                            )}
                          </div>
                          <span className="text-[11px] text-muted-foreground">
                            {sess.location} • IP: {sess.ipAddress}
                          </span>
                        </div>
                      </div>

                      <span className="text-[11px] text-muted-foreground shrink-0 font-medium">
                        {sess.lastActive}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. Privacy Preferences */}
              <div className="p-5 sm:p-6 rounded-2xl bg-card border border-border/80 dark:border-white/10 shadow-soft space-y-4">
                <div className="pb-2 border-b border-border/60">
                  <h3 className="text-base font-extrabold text-foreground flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-primary" />
                    <span>Privacy & Data Permissions</span>
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Manage tenant discoverability and aggregated hiring telemetry preferences.
                  </p>
                </div>

                <div className="space-y-3">
                  <label className="p-3.5 rounded-xl border border-border/60 hover:bg-muted/30 transition-colors flex items-center justify-between gap-4 cursor-pointer">
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-foreground block">
                        Public Candidate Directory Listing
                      </span>
                      <p className="text-[11px] text-muted-foreground">
                        Include Acme Technologies in HireFlow's public employer directory and search indices.
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={securityForm.publicDirectoryListing}
                      onChange={(e) => setSecurityForm({ ...securityForm, publicDirectoryListing: e.target.checked })}
                      className="w-5 h-5 rounded border-border text-primary focus:ring-primary cursor-pointer shrink-0"
                    />
                  </label>

                  <label className="p-3.5 rounded-xl border border-border/60 hover:bg-muted/30 transition-colors flex items-center justify-between gap-4 cursor-pointer">
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-foreground block">
                        Anonymous Benchmark Reporting Telemetry
                      </span>
                      <p className="text-[11px] text-muted-foreground">
                        Share anonymized velocity numbers to access cross-industry hiring time benchmarks.
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={securityForm.anonymousAnalytics}
                      onChange={(e) => setSecurityForm({ ...securityForm, anonymousAnalytics: e.target.checked })}
                      className="w-5 h-5 rounded border-border text-primary focus:ring-primary cursor-pointer shrink-0"
                    />
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* ========================================== */}
          {/* TAB 6: APPEARANCE */}
          {/* ========================================== */}
          {activeTab === "appearance" && (
            <div className="p-5 sm:p-6 rounded-2xl bg-card border border-border/80 dark:border-white/10 shadow-soft space-y-6">
              <div className="pb-3 border-b border-border/60">
                <h2 className="text-lg font-black text-foreground">Appearance & Interface Preferences</h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Customize your recruiter workspace theme, interface density, and display preferences.
                </p>
              </div>

              {/* Theme Selection: Connected to existing application ThemeContext */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-foreground uppercase tracking-wider block">
                  Workspace Theme
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  {/* Light Theme Card */}
                  <button
                    type="button"
                    onClick={() => setTheme("light")}
                    className={cn(
                      "p-4 rounded-2xl border text-left transition-all cursor-pointer space-y-3 group",
                      theme === "light"
                        ? "bg-primary/10 border-primary ring-2 ring-primary/20 shadow-soft"
                        : "bg-muted/30 border-border/70 hover:bg-muted/60"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                        <Sun className="w-4 h-4" />
                      </div>
                      {theme === "light" && <CheckCircle2 className="w-4 h-4 text-primary" />}
                    </div>
                    <div>
                      <span className="font-extrabold text-foreground text-xs block">Light Theme</span>
                      <span className="text-[10px] text-muted-foreground block">
                        Warm cream and ivory background with coral accents
                      </span>
                    </div>
                  </button>

                  {/* Dark Theme Card */}
                  <button
                    type="button"
                    onClick={() => setTheme("dark")}
                    className={cn(
                      "p-4 rounded-2xl border text-left transition-all cursor-pointer space-y-3 group",
                      theme === "dark"
                        ? "bg-primary/10 border-primary ring-2 ring-primary/20 shadow-soft"
                        : "bg-muted/30 border-border/70 hover:bg-muted/60"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                        <Moon className="w-4 h-4" />
                      </div>
                      {theme === "dark" && <CheckCircle2 className="w-4 h-4 text-primary" />}
                    </div>
                    <div>
                      <span className="font-extrabold text-foreground text-xs block">Dark Theme</span>
                      <span className="text-[10px] text-muted-foreground block">
                        Rich charcoal surface with glowing coral highlights
                      </span>
                    </div>
                  </button>

                  {/* System Theme Card */}
                  <button
                    type="button"
                    onClick={() => setTheme("system")}
                    className={cn(
                      "p-4 rounded-2xl border text-left transition-all cursor-pointer space-y-3 group",
                      theme === "system"
                        ? "bg-primary/10 border-primary ring-2 ring-primary/20 shadow-soft"
                        : "bg-muted/30 border-border/70 hover:bg-muted/60"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div className="w-8 h-8 rounded-xl bg-muted text-foreground flex items-center justify-center">
                        <Monitor className="w-4 h-4" />
                      </div>
                      {theme === "system" && <CheckCircle2 className="w-4 h-4 text-primary" />}
                    </div>
                    <div>
                      <span className="font-extrabold text-foreground text-xs block">System Default</span>
                      <span className="text-[10px] text-muted-foreground block">
                        Synchronizes automatically with device OS settings
                      </span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Interface Density */}
              <div className="space-y-3 pt-2 border-t border-border/60">
                <label className="text-xs font-bold text-foreground uppercase tracking-wider block">
                  Interface Layout Density
                </label>
                <div className="grid grid-cols-2 gap-3 max-w-md">
                  <button
                    type="button"
                    onClick={() => setAppearanceForm({ ...appearanceForm, density: "comfortable" })}
                    className={cn(
                      "p-3 rounded-xl border text-center transition-colors cursor-pointer text-xs",
                      appearanceForm.density === "comfortable"
                        ? "bg-primary/10 border-primary text-primary font-bold shadow-xs"
                        : "border-border text-muted-foreground hover:bg-muted"
                    )}
                  >
                    Comfortable (Standard)
                  </button>
                  <button
                    type="button"
                    onClick={() => setAppearanceForm({ ...appearanceForm, density: "compact" })}
                    className={cn(
                      "p-3 rounded-xl border text-center transition-colors cursor-pointer text-xs",
                      appearanceForm.density === "compact"
                        ? "bg-primary/10 border-primary text-primary font-bold shadow-xs"
                        : "border-border text-muted-foreground hover:bg-muted"
                    )}
                  >
                    Compact (High-Density)
                  </button>
                </div>
              </div>

              {/* Accessibility Toggles */}
              <div className="space-y-3 pt-2 border-t border-border/60">
                <label className="text-xs font-bold text-foreground uppercase tracking-wider block">
                  Accessibility & Motion
                </label>

                <div className="space-y-2.5">
                  <label className="p-3.5 rounded-xl border border-border/60 hover:bg-muted/30 transition-colors flex items-center justify-between gap-4 cursor-pointer">
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-foreground block">High-Contrast Border Accents</span>
                      <p className="text-[11px] text-muted-foreground">
                        Enhances card outlines and input boundaries for increased visual separation.
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={appearanceForm.highContrastBorders}
                      onChange={(e) => setAppearanceForm({ ...appearanceForm, highContrastBorders: e.target.checked })}
                      className="w-5 h-5 rounded border-border text-primary focus:ring-primary cursor-pointer shrink-0"
                    />
                  </label>

                  <label className="p-3.5 rounded-xl border border-border/60 hover:bg-muted/30 transition-colors flex items-center justify-between gap-4 cursor-pointer">
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-foreground block">Reduced UI Transitions</span>
                      <p className="text-[11px] text-muted-foreground">
                        Minimizes motion effects across dropdowns, charts, and slide-in panels.
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={appearanceForm.reducedMotion}
                      onChange={(e) => setAppearanceForm({ ...appearanceForm, reducedMotion: e.target.checked })}
                      className="w-5 h-5 rounded border-border text-primary focus:ring-primary cursor-pointer shrink-0"
                    />
                  </label>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* ========================================================= */}
      {/* SIGN OUT SESSIONS CONFIRMATION MODAL */}
      {/* ========================================================= */}
      {isSignOutModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-label="Confirm Sign Out Sessions"
        >
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setIsSignOutModalOpen(false)}
            aria-hidden="true"
          />

          <div className="relative w-full max-w-md bg-card border border-border/90 dark:border-white/10 shadow-2xl rounded-3xl z-50 p-6 space-y-4 animate-in zoom-in-95 fade-in-50 duration-150 my-auto text-center">
            <div className="w-12 h-12 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center mx-auto">
              <LogOut className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-black text-foreground">
                Sign Out All Other Sessions?
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                This will immediately revoke active sessions on your iPhone and macOS devices. You will stay signed in on this Windows browser.
              </p>
            </div>

            <div className="pt-2 flex items-center justify-center gap-2.5">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsSignOutModalOpen(false)}
                className="text-xs font-semibold rounded-xl flex-1"
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={handleSignOutOtherSessions}
                className="text-xs font-bold rounded-xl flex-1"
              >
                Sign Out Devices
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

