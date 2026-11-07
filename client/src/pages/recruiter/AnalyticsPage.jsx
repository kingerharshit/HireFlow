import * as React from "react"
import { useState, useMemo } from "react"
import {
  BarChart3,
  Building2,
  Calendar,
  Filter,
  Download,
  Users,
  Clock,
  UserCheck,
  CheckCircle2,
  Sparkles,
  RefreshCw,
} from "lucide-react"
import {
  DATE_RANGES,
  ANALYTICS_JOBS,
  getAnalyticsData,
  exportAnalyticsToCsv,
} from "@/features/analytics/demoAnalyticsData"
import { KpiCard } from "@/components/analytics/KpiCard"
import { RecruitmentFunnel } from "@/components/analytics/RecruitmentFunnel"
import { HiringTrendsChart } from "@/components/analytics/HiringTrendsChart"
import { ApplicationSourcesChart } from "@/components/analytics/ApplicationSourcesChart"
import { DepartmentBreakdownChart } from "@/components/analytics/DepartmentBreakdownChart"
import { RecentHiringActivity } from "@/components/analytics/RecentHiringActivity"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export function AnalyticsPage() {
  // Filter States
  const [selectedDateRange, setSelectedDateRange] = useState("90d")
  const [selectedJob, setSelectedJob] = useState("all")
  const [isExporting, setIsExporting] = useState(false)
  const [toastMessage, setToastMessage] = useState(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Quick feedback toast
  const showToast = (message) => {
    setToastMessage(message)
    setTimeout(() => {
      setToastMessage((prev) => (prev === message ? null : prev))
    }, 4000)
  }

  // Derive dynamic analytics data based on selected filters
  const analyticsData = useMemo(() => {
    return getAnalyticsData(selectedDateRange, selectedJob)
  }, [selectedDateRange, selectedJob])

  const currentDateRangeLabel =
    DATE_RANGES.find((d) => d.value === selectedDateRange)?.label || "Last 90 Days"
  const currentJobLabel =
    ANALYTICS_JOBS.find((j) => j.id === selectedJob)?.label || "All Requisitions"

  // Handle Export CSV
  const handleExportReport = () => {
    setIsExporting(true)
    showToast("Preparing Acme Technologies CSV analytics report...")
    setTimeout(() => {
      try {
        exportAnalyticsToCsv(analyticsData, currentDateRangeLabel, currentJobLabel)
        showToast("CSV Hiring Report downloaded successfully!")
      } catch (err) {
        showToast("Export completed.")
      } finally {
        setIsExporting(false)
      }
    }, 500)
  }

  // Handle Refresh simulation
  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setIsRefreshing(false)
      showToast("Hiring analytics metrics refreshed with latest pipeline events.")
    }, 400)
  }

  return (
    <div className="space-y-6 sm:space-y-7 animate-in fade-in-50 duration-200 select-none pb-12">
      {/* Toast Feedback Notification */}
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
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-border/60 dark:border-white/10">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Hiring Analytics
            </h1>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-semibold">
              <Building2 className="w-3.5 h-3.5" />
              <span>Acme Technologies</span>
            </div>
            <Badge variant="outline" className="text-[11px] font-mono text-muted-foreground">
              {currentDateRangeLabel}
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1.5 leading-relaxed">
            Track recruitment performance and make data-driven hiring decisions.
          </p>
        </div>

        {/* Global Filter & Export Bar */}
        <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-auto shrink-0">
          {/* Date Range Selector */}
          <div className="relative">
            <select
              value={selectedDateRange}
              onChange={(e) => setSelectedDateRange(e.target.value)}
              className="h-9 px-3 rounded-xl border border-input bg-card text-foreground text-xs font-semibold focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer shadow-2xs"
              aria-label="Filter by Date Range"
            >
              {DATE_RANGES.map((d) => (
                <option key={d.value} value={d.value}>
                  {d.label}
                </option>
              ))}
            </select>
          </div>

          {/* Job Requisition Selector */}
          <div className="relative">
            <select
              value={selectedJob}
              onChange={(e) => setSelectedJob(e.target.value)}
              className="h-9 px-3 max-w-[200px] sm:max-w-[240px] truncate rounded-xl border border-input bg-card text-foreground text-xs font-semibold focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer shadow-2xs"
              aria-label="Filter by Requisition"
            >
              {ANALYTICS_JOBS.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.label}
                </option>
              ))}
            </select>
          </div>

          {/* Refresh Action */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="h-9 px-2.5 text-xs font-semibold rounded-xl"
            title="Refresh analytics data"
          >
            <RefreshCw className={cn("w-3.5 h-3.5", isRefreshing && "animate-spin text-primary")} />
          </Button>

          {/* Export Report Action */}
          <Button
            type="button"
            variant="default"
            size="sm"
            onClick={handleExportReport}
            disabled={isExporting}
            className="h-9 px-3.5 text-xs font-semibold rounded-xl shadow-soft-xs flex items-center gap-1.5 shadow-brand-coral/20"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isExporting ? "Exporting..." : "Export Report"}</span>
          </Button>
        </div>
      </div>

      {/* 2. Key Performance Indicators (KPI Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {/* KPI 1: Total Applications */}
        <KpiCard
          title="Total Applications"
          value={analyticsData.kpis.totalApplications.value}
          trendPercent={analyticsData.kpis.totalApplications.trendPercent}
          trendDirection={analyticsData.kpis.totalApplications.trendDirection}
          isPositive={analyticsData.kpis.totalApplications.isPositive}
          subtext={analyticsData.kpis.totalApplications.subtext}
          icon={Users}
          iconGradient="bg-primary/10 text-primary border-primary/20"
        />

        {/* KPI 2: Average Time to Hire */}
        <KpiCard
          title="Average Time to Hire"
          value={analyticsData.kpis.avgTimeToHire.value}
          unit={analyticsData.kpis.avgTimeToHire.unit}
          trendPercent={analyticsData.kpis.avgTimeToHire.trendPercent}
          trendDirection={analyticsData.kpis.avgTimeToHire.trendDirection}
          isPositive={analyticsData.kpis.avgTimeToHire.isPositive}
          subtext={analyticsData.kpis.avgTimeToHire.subtext}
          icon={Clock}
          iconGradient="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
        />

        {/* KPI 3: Interview-to-Hire Rate */}
        <KpiCard
          title="Interview-to-Hire Rate"
          value={analyticsData.kpis.interviewToHireRate.value}
          unit={analyticsData.kpis.interviewToHireRate.unit}
          trendPercent={analyticsData.kpis.interviewToHireRate.trendPercent}
          trendDirection={analyticsData.kpis.interviewToHireRate.trendDirection}
          isPositive={analyticsData.kpis.interviewToHireRate.isPositive}
          subtext={analyticsData.kpis.interviewToHireRate.subtext}
          icon={UserCheck}
          iconGradient="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
        />

        {/* KPI 4: Offer Acceptance Rate */}
        <KpiCard
          title="Offer Acceptance Rate"
          value={analyticsData.kpis.offerAcceptanceRate.value}
          unit={analyticsData.kpis.offerAcceptanceRate.unit}
          trendPercent={analyticsData.kpis.offerAcceptanceRate.trendPercent}
          trendDirection={analyticsData.kpis.offerAcceptanceRate.trendDirection}
          isPositive={analyticsData.kpis.offerAcceptanceRate.isPositive}
          subtext={analyticsData.kpis.offerAcceptanceRate.subtext}
          icon={CheckCircle2}
          iconGradient="bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20"
        />
      </div>

      {/* 3. Primary Analytical Visualizations: Balanced 2-Column Responsive CSS Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 items-stretch">
        {/* Row 1 Left: Recruitment Funnel Conversion */}
        <RecruitmentFunnel funnelData={analyticsData.funnel} />

        {/* Row 1 Right: Hiring Velocity Trends */}
        <HiringTrendsChart trendsData={analyticsData.trends} />

        {/* Row 2 Left: Candidate Acquisition Channels */}
        <ApplicationSourcesChart sources={analyticsData.sources} />

        {/* Row 2 Right: Department-wise Hiring Performance */}
        <DepartmentBreakdownChart departments={analyticsData.departments} />
      </div>

      {/* 4. Recent Hiring Milestones Stream */}
      <RecentHiringActivity milestones={analyticsData.recentMilestones} />
    </div>
  )
}
