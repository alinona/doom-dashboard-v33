"use client"

// ============================================================
// Notifications dropdown — reads from mockNotifications (data.js).
// Local state holds an optimistic UI copy so "mark as read" /
// "clear all" give instant feedback. Real persistence belongs to
// the backend (TODO BACKEND endpoints noted on each action).
// ============================================================

import { useMemo, useState } from "react"
import { Bell, Check, CheckCheck, AlertTriangle, Info, AlertCircle, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { mockNotifications, type Notification } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

const typeConfig: Record<
  Notification["type"],
  { icon: React.ElementType; color: string; bg: string }
> = {
  info: {
    icon: Info,
    color: "text-sky-300",
    bg: "bg-sky-500/15 border-sky-500/30",
  },
  warning: {
    icon: AlertTriangle,
    color: "text-amber-300",
    bg: "bg-amber-500/15 border-amber-500/30",
  },
  error: {
    icon: AlertCircle,
    color: "text-destructive",
    bg: "bg-destructive/15 border-destructive/30",
  },
  success: {
    icon: Check,
    color: "text-emerald-300",
    bg: "bg-emerald-500/15 border-emerald-500/30",
  },
}

export function NotificationsMenu() {
  // Source of truth: mockNotifications. Local state for instant UI feedback.
  const [items, setItems] = useState<Notification[]>(mockNotifications)
  const [open, setOpen] = useState(false)

  const unreadCount = useMemo(() => items.filter((n) => !n.read).length, [items])

  function markAsRead(id: number) {
    // TODO BACKEND: POST /api/notifications/{id}/read
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  function markAllAsRead() {
    // TODO BACKEND: POST /api/notifications/read-all
    setItems((prev) => prev.map((n) => ({ ...n, read: true })))
    toast.success("تم تحديد جميع الإشعارات كمقروءة")
  }

  function clearAll() {
    // TODO BACKEND: DELETE /api/notifications
    setItems([])
    toast.success("تم مسح جميع الإشعارات")
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative size-9 rounded-lg hover:bg-card/60"
          aria-label={`الإشعارات${unreadCount > 0 ? ` (${unreadCount} غير مقروءة)` : ""}`}
        >
          <Bell className="size-[18px]" />
          {unreadCount > 0 && (
            <span
              className="absolute top-1 left-1 min-w-[16px] h-[16px] px-1 rounded-full bg-destructive ring-2 ring-background flex items-center justify-center text-[9px] font-extrabold text-white tabular-nums"
              aria-hidden
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        sideOffset={8}
        className="w-[min(92vw,360px)] p-0 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-2 px-4 py-3 border-b border-border/60 bg-card/40">
          <div className="flex items-center gap-2 min-w-0">
            <div className="size-7 rounded-lg doom-gradient flex items-center justify-center shrink-0">
              <Bell className="size-3.5 text-primary-foreground" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold leading-none">الإشعارات</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                {unreadCount > 0 ? `${unreadCount} غير مقروءة` : "كل شيء مقروء"}
              </p>
            </div>
          </div>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="h-7 px-2 gap-1 text-[10px] hover:bg-card/80 shrink-0"
            >
              <CheckCheck className="size-3" />
              تحديد كمقروءة
            </Button>
          )}
        </div>

        {/* List */}
        {items.length > 0 ? (
          <ul
            className="max-h-[60vh] overflow-y-auto scrollbar-thin divide-y divide-border/40"
            role="list"
          >
            {items.map((n) => {
              const cfg = typeConfig[n.type]
              const Icon = cfg.icon
              return (
                <li key={n.id}>
                  <button
                    type="button"
                    onClick={() => markAsRead(n.id)}
                    className={cn(
                      "w-full flex items-start gap-3 px-4 py-3 text-right transition-colors hover:bg-muted/30",
                      !n.read && "bg-primary/[0.04]",
                    )}
                  >
                    <div
                      className={cn(
                        "size-8 rounded-lg border flex items-center justify-center shrink-0",
                        cfg.bg,
                      )}
                    >
                      <Icon className={cn("size-4", cfg.color)} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2 mb-0.5">
                        <p className="text-sm font-bold truncate">{n.title}</p>
                        {!n.read && (
                          <span
                            className="size-1.5 rounded-full bg-primary mt-1.5 shrink-0"
                            aria-label="غير مقروءة"
                          />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {n.message}
                      </p>
                      <p className="text-[10px] text-muted-foreground/70 mt-1">{n.time}</p>
                    </div>
                  </button>
                </li>
              )
            })}
          </ul>
        ) : (
          <div className="py-10 px-4 flex flex-col items-center gap-2 text-center">
            <div className="size-10 rounded-xl bg-muted/30 border border-border/60 flex items-center justify-center">
              <Bell className="size-4 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium">لا توجد إشعارات</p>
            <p className="text-[11px] text-muted-foreground">
              ستظهر التنبيهات الجديدة هنا تلقائياً.
            </p>
          </div>
        )}

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-border/60 bg-card/40 px-2 py-2 flex items-center justify-between gap-2">
            <Badge variant="outline" className="text-[10px] border-border/60 bg-background/40">
              {items.length} {items.length === 1 ? "إشعار" : "إشعارات"}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAll}
              className="h-7 px-2 gap-1 text-[10px] text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="size-3" />
              مسح الكل
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
