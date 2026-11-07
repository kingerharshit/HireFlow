import * as React from "react"
import { useState } from "react"
import { TrendingUp, Users, UserCheck } from "lucide-react"
import { cn } from "@/lib/utils"

export function HiringTrendsChart({ trendsData = [] }) {
  const [hoveredIndex, setHoveredIndex] = useState(null)

  if (!trendsData || trendsData.length === 0) {
    return (
      <div className="p-8 text-center text-xs text-muted-foreground">
        No trend data available.
      </div>
    )
  }

  // Calculate scales
  const maxApps = Math.max(...trendsData.map((d) => d.applications), 10)
  const yMax = Math.ceil(maxApps / 10) * 10 || 50
  const totalApps = trendsData.reduce((acc, t) => acc + t.applications, 0)
  const totalHires = trendsData.reduce((acc, t) => acc + t.hires, 0)
  const avgMonthlyApps = Math.round(totalApps / trendsData.length)

  // SVG dimensions: exact 3:1 ratio (600 x 200) to eliminate letterboxing and blank space
  const svgWidth = 600
  const svgHeight = 200
  const paddingLeft = 36
  const paddingRight = 20
  const paddingTop = 15
  const paddingBottom = 30

  const chartWidth = svgWidth - paddingLeft - paddingRight
  const chartHeight = svgHeight - paddingTop - paddingBottom

  // Coordinates mapping
  const points = trendsData.map((d, i) => {
    const x = paddingLeft + (i / (trendsData.length - 1)) * chartWidth
    const yApp = paddingTop + chartHeight - (d.applications / yMax) * chartHeight
    const yHire = paddingTop + chartHeight - (d.hires / (yMax * 0.2 || 10)) * chartHeight
    return { ...d, x, yApp, yHire }
  })

  // Generate SVG path strings
  const appPathString = points.reduce(
    (acc, pt, i) => `${acc} ${i === 0 ? "M" : "L"} ${pt.x} ${pt.yApp}`,
    ""
  )

  const appAreaString = `${appPathString} L ${points[points.length - 1].x} ${
    paddingTop + chartHeight
  } L ${points[0].x} ${paddingTop + chartHeight} Z`

  const hirePathString = points.reduce(
    (acc, pt, i) => `${acc} ${i === 0 ? "M" : "L"} ${pt.x} ${pt.yHire}`,
    ""
  )

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-card border border-border/80 dark:border-white/10 shadow-soft flex flex-col justify-between space-y-4">
      {/* Header & Legends */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2 border-b border-border/60">
        <div>
          <h3 className="text-base font-extrabold text-foreground tracking-tight flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            <span>Hiring Velocity & Inflow Trends</span>
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Monthly comparison of candidate applications received against concluded hires.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3.5 text-xs font-semibold select-none shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F47758]" />
            <span className="text-foreground text-[11px]">Applications</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-foreground text-[11px]">Hires</span>
          </div>
        </div>
      </div>

      {/* Responsive SVG Chart: Uses fluid width & auto height with zero letterboxing */}
      <div className="relative w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-auto block overflow-visible select-none"
        >
          <defs>
            <linearGradient id="coralAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F47758" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#F47758" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Gridlines */}
          {[0, 0.33, 0.66, 1].map((ratio) => {
            const y = paddingTop + chartHeight * ratio
            const value = Math.round(yMax * (1 - ratio))
            return (
              <g key={ratio}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={svgWidth - paddingRight}
                  y2={y}
                  stroke="currentColor"
                  className="text-border/60"
                  strokeDasharray="4 4"
                />
                <text
                  x={paddingLeft - 8}
                  y={y + 3.5}
                  textAnchor="end"
                  className="text-[10px] fill-muted-foreground select-none font-mono"
                >
                  {value}
                </text>
              </g>
            )
          })}

          {/* Area fill for Applications */}
          <path d={appAreaString} fill="url(#coralAreaGrad)" />

          {/* Applications Line */}
          <path
            d={appPathString}
            fill="none"
            stroke="#F47758"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Hires Line */}
          <path
            d={hirePathString}
            fill="none"
            stroke="#10B981"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* X Axis ticks */}
          {points.map((pt, i) => (
            <text
              key={i}
              x={pt.x}
              y={svgHeight - 8}
              textAnchor="middle"
              className="text-[11px] font-bold fill-muted-foreground select-none"
            >
              {pt.period}
            </text>
          ))}

          {/* Interactive hover points & vertical crosshair */}
          {points.map((pt, i) => {
            const isHovered = hoveredIndex === i
            return (
              <g
                key={i}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="cursor-pointer"
              >
                {/* Hotspot */}
                <rect
                  x={pt.x - 20}
                  y={paddingTop}
                  width="40"
                  height={chartHeight}
                  fill="transparent"
                />

                {/* Crosshair */}
                {isHovered && (
                  <line
                    x1={pt.x}
                    y1={paddingTop}
                    x2={pt.x}
                    y2={paddingTop + chartHeight}
                    stroke="currentColor"
                    className="text-primary/40"
                    strokeWidth="1.5"
                    strokeDasharray="2 2"
                  />
                )}

                {/* Application Dot */}
                <circle
                  cx={pt.x}
                  cy={pt.yApp}
                  r={isHovered ? 5.5 : 4}
                  fill="#F47758"
                  className="stroke-card transition-all"
                  strokeWidth="2"
                />

                {/* Hire Dot */}
                <circle
                  cx={pt.x}
                  cy={pt.yHire}
                  r={isHovered ? 5 : 3.5}
                  fill="#10B981"
                  className="stroke-card transition-all"
                  strokeWidth="2"
                />
              </g>
            )
          })}
        </svg>

        {/* Floating Tooltip */}
        {hoveredIndex !== null && points[hoveredIndex] && (
          <div
            className="absolute z-20 pointer-events-none p-2.5 rounded-xl bg-card border border-border/90 dark:border-white/10 shadow-xl text-xs space-y-1 animate-in fade-in-50 zoom-in-95 duration-100 min-w-[140px]"
            style={{
              left: `${Math.min(72, Math.max(8, (points[hoveredIndex].x / svgWidth) * 100))}%`,
              top: "5%",
            }}
          >
            <div className="font-extrabold text-foreground border-b border-border/60 pb-1 flex items-center justify-between text-[11px]">
              <span>{points[hoveredIndex].period} 2026</span>
              <span className="text-[10px] text-muted-foreground font-mono">Acme</span>
            </div>
            <div className="flex items-center justify-between gap-3 text-[#F47758] font-bold text-[11px]">
              <span>Applications:</span>
              <span>{points[hoveredIndex].applications}</span>
            </div>
            <div className="flex items-center justify-between gap-3 text-emerald-600 dark:text-emerald-400 font-bold text-[11px]">
              <span>Hires Made:</span>
              <span>{points[hoveredIndex].hires}</span>
            </div>
          </div>
        )}
      </div>

      {/* Velocity Summary Metrics: Utilizes card space cleanly with zero dead areas */}
      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border/50 text-center text-xs">
        <div className="p-2 rounded-xl bg-muted/30 dark:bg-white/5 space-y-0.5">
          <span className="text-[10px] text-muted-foreground uppercase font-bold block">Avg Inflow</span>
          <span className="font-extrabold text-foreground block">
            {avgMonthlyApps} apps/mo
          </span>
        </div>
        <div className="p-2 rounded-xl bg-muted/30 dark:bg-white/5 space-y-0.5">
          <span className="text-[10px] text-muted-foreground uppercase font-bold block">Peak Volume</span>
          <span className="font-extrabold text-primary block">
            Oct ({maxApps} apps)
          </span>
        </div>
        <div className="p-2 rounded-xl bg-muted/30 dark:bg-white/5 space-y-0.5">
          <span className="text-[10px] text-muted-foreground uppercase font-bold block">Total Hires</span>
          <span className="font-extrabold text-emerald-600 dark:text-emerald-400 block">
            {totalHires} concluded
          </span>
        </div>
      </div>
    </div>
  )
}
