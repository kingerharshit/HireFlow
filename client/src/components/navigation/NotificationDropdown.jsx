import * as React from "react"
import { useState, useRef, useEffect } from "react"
import { Link } from "react-router-dom"
import { Bell, CheckCheck, FileText, Calendar, Briefcase, ExternalLink, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

const INITIAL_NOTIFICATIONS = [
  {
    id: "notif-1",
    title: "New Candidate Application",
    description: "Elena Rostova submitted an application for Staff Frontend Architect.",
    timestamp: "8 min ago",
    isRead: false,
    icon: FileText,
    iconColor: "text-emerald-500 bg-emerald-500/10",
  },
  {
    id: "notif-2",
    title: "Interview Confirmed",
    description: "Round 3 technical evaluation set for Marcus Vance with Team Leads.",
    timestamp: "1 hour ago",
    isRead: false,
    icon: Calendar,
    iconColor: "text-primary bg-primary/10",
  },
  {
    id: "notif-3",
    title: "Job Requisition Published",
    description: "Senior Backend Engineer is now public and accepting applications.",
    timestamp: "Yesterday",
    isRead: true,
    icon: Briefcase,
    iconColor: "text-blue-500 bg-blue-500/10",
  },
]

export function NotificationDropdown({ className }) {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS)
  const dropdownRef = useRef(null)

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const unreadCount = notifications.filter((n) => !n.isRead).length

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
  }

  const toggleRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: !n.isRead } : n))
    )
  }

  return (
    <div className={cn("relative select-none", className)} ref={dropdownRef}>
      {/* Bell Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label={`Notifications. ${unreadCount} unread`}
        className="relative p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/70 dark:hover:bg-white/5 transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span
            className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary ring-2 ring-card"
            title={`${unreadCount} unread demonstration notifications`}
          />
        )}
      </button>

      {/* Popover Card */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="Notifications popover"
          className="absolute top-full mt-1.5 right-0 w-80 sm:w-96 bg-popover text-popover-foreground rounded-2xl border border-border/90 shadow-soft-xl p-0 z-50 overflow-hidden animate-in fade-in-50 zoom-in-95 duration-150"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border/70 bg-card">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-foreground">Notifications</span>
              {unreadCount > 0 ? (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-primary/10 text-primary border border-primary/20">
                  {unreadCount} new
                </span>
              ) : (
                <span className="text-[11px] text-muted-foreground">All caught up</span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline cursor-pointer"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Mark all as read</span>
              </button>
            )}
          </div>

          {/* Notification List */}
          <div className="divide-y divide-border/50 max-h-80 overflow-y-auto">
            {notifications.map((item) => {
              const Icon = item.icon
              return (
                <div
                  key={item.id}
                  onClick={() => toggleRead(item.id)}
                  className={cn(
                    "flex items-start gap-3 p-3.5 text-left transition-colors cursor-pointer hover:bg-muted/60",
                    !item.isRead ? "bg-primary/[0.03] dark:bg-primary/[0.06]" : ""
                  )}
                  title="Click to toggle read status"
                >
                  <div
                    className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5",
                      item.iconColor
                    )}
                  >
                    <Icon className="w-4 h-4" />
                  </div>

                  <div className="flex-1 min-w-0 space-y-0.5">
                    <div className="flex items-center justify-between gap-2">
                      <p
                        className={cn(
                          "text-xs font-semibold truncate",
                          !item.isRead ? "text-foreground font-bold" : "text-muted-foreground"
                        )}
                      >
                        {item.title}
                      </p>
                      {!item.isRead && (
                        <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-normal line-clamp-2">
                      {item.description}
                    </p>
                    <p className="text-[10px] text-muted-foreground/80 pt-0.5">
                      {item.timestamp}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Footer */}
          <div className="px-4 py-2.5 bg-muted/40 dark:bg-[#14151B] border-t border-border/70 flex items-center justify-between text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-primary" />
              <span>Demo Alerts</span>
            </span>

            <Link
              to="/recruiter/settings"
              onClick={() => setIsOpen(false)}
              className="font-semibold text-primary hover:underline inline-flex items-center gap-1"
            >
              <span>Notification Settings</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

