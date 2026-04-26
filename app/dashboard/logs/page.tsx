"use client"

import { useMemo, useState } from "react"
import {
  AlertTriangle,
  Download,
  LogIn,
  Radio,
  ScrollText,
  Settings2,
  Trash2,
  X,
} from "lucide-react"
import { toast } from "sonner"
import { PageHeader } from "@/components/dashboard/page-header"
import { ConfirmDialog } from "@/components/dashboard/confirm-dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { mockLogs, type LogEntry } from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

type FilterKey = "all" | LogEntry["type"]

const typeMeta: Record<
  LogEntry["type"],
  { label: string; icon: React.ElementType; chip: string; dot: string }
> = {
  login: {
    label: "تسجيل دخول",
    icon: LogIn,
    chip: "bg-sky-500/10 text-sky-300 border-sky-500/30",
    dot: "bg-sky-400",
  },
  stream: {
    label: "بث",
    icon: Radio,
    chip: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
    dot: "bg-emerald-400",
  },
  error: {
    label: "أخطاء",
    icon: AlertTriangle,
    chip: "bg-destructive/10 text-destructive border-destructive/30",
    dot: "bg-destructive",
  },
  admin: {
    label: "إجراءات",
    icon: Settings2,
    chip: "bg-amber-500/10 text-amber-300 border-amber-500/30",
    dot: "bg-amber-400",
  },
}

// Source of truth: `mockLogs` from data.js. `logs` is an optimistic UI copy
// so the user can clear/delete entries with instant feedback. Real persistence
// (and log retention) is handled by the backend.
export default function LogsPage() {
  const [logs, setLogs] = useState<LogEntry[]>(mockLogs)
  const [filter, setFilter] = useState<FilterKey>("all")
  const [confirmClear, setConfirmClear] = useState(false)

  const counts = useMemo(() => {
    const base: Record<FilterKey, number> = { all: logs.length, login: 0, stream: 0, error: 0, admin: 0 }
    for (const l of logs) base[l.type]++
    return base
  }, [logs])

  const filtered = useMemo(() => {
    if (filter === "all") return logs
    return logs.filter((l) => l.type === filter)
  }, [logs, filter])

  function deleteOne(id: number) {
    // TODO BACKEND: DELETE /api/logs/{id}
    setLogs((prev) => prev.filter((l) => l.id !== id))
    toast.success("تم حذف السجل")
  }

  function clearAll() {
    // TODO BACKEND: DELETE /api/logs  (clear all)
    setLogs([])
    setConfirmClear(false)
    toast.success("تم مسح جميع السجلات")
  }

  function exportLogs() {
    const text = logs
      .map((l) => `[${l.time}] [${typeMeta[l.type].label}] ${l.message}`)
      .join("\n")
    const blob = new Blob([text], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `doom-logs-${Date.now()}.txt`
    a.click()
    URL.revokeObjectURL(url)
    toast.success("تم تصدير السجلات")
  }

  const filterChips: { key: FilterKey; label: string; icon?: React.ElementType }[] = [
    { key: "all", label: "الكل" },
    { key: "login", label: "تسجيل دخول", icon: LogIn },
    { key: "stream", label: "بث", icon: Radio },
    { key: "error", label: "أخطاء", icon: AlertTriangle },
    { key: "admin", label: "إجراءات", icon: Settings2 },
  ]

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        eyebrow="مراقبة"
        title="السجلات"
        description="آخر العمليات والأخطاء على السيرفر."
        icon={<ScrollText className="size-5 text-primary-foreground" />}
        actions={
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={exportLogs}
              disabled={logs.length === 0}
              className="gap-1.5 rounded-xl border-border/60 bg-card/40"
            >
              <Download className="size-4" />
              <span className="hidden sm:inline">تصدير</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => setConfirmClear(true)}
              disabled={logs.length === 0}
              className="text-destructive hover:text-destructive hover:bg-destructive/10 hover:border-destructive/40 gap-1.5 rounded-xl border-border/60 bg-card/40"
            >
              <Trash2 className="size-4" />
              <span className="hidden sm:inline">مسح الكل</span>
            </Button>
          </div>
        }
      />

      {/* RTL filter pills (custom — no Tabs component to guarantee correct direction) */}
      <div
        role="tablist"
        aria-label="فلاتر السجلات"
        className="flex flex-wrap items-center gap-2"
      >
        {filterChips.map(({ key, label, icon: Icon }) => {
          const isActive = filter === key
          const count = counts[key]
          return (
            <button
              key={key}
              role="tab"
              aria-selected={isActive}
              onClick={() => setFilter(key)}
              className={cn(
                "inline-flex items-center gap-2 h-9 px-3.5 rounded-xl border text-xs font-bold transition-all",
                isActive
                  ? "bg-primary/15 text-foreground border-primary/40 doom-shadow-glow"
                  : "bg-card/40 text-muted-foreground border-border/60 hover:bg-card/70 hover:text-foreground",
              )}
            >
              {Icon && <Icon className="size-3.5" />}
              <span>{label}</span>
              <span
                className={cn(
                  "inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-md text-[10px] font-bold tabular-nums",
                  isActive
                    ? "bg-primary/20 text-primary"
                    : "bg-muted/60 text-foreground/70",
                )}
              >
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {filtered.length > 0 ? (
        <Card className="border-border/60 bg-card/50 doom-hairline">
          <CardContent className="p-0">
            <ul className="divide-y divide-border/40">
              {filtered.map((log) => {
                const meta = typeMeta[log.type]
                const Icon = meta.icon
                return (
                  <li
                    key={log.id}
                    className="px-3 sm:px-4 py-3 flex items-center gap-3 group hover:bg-muted/15 transition-colors"
                  >
                    <span
                      className={cn(
                        "size-2 rounded-full shrink-0",
                        log.status === "ok" && "bg-emerald-400",
                        log.status === "warning" && "bg-amber-400",
                        log.status === "error" && "bg-destructive",
                      )}
                      aria-hidden
                    />
                    <Badge
                      variant="outline"
                      className={cn(
                        "shrink-0 text-[10px] gap-1 font-bold rounded-md py-0.5 border",
                        meta.chip,
                      )}
                    >
                      <Icon className="size-3" />
                      {meta.label}
                    </Badge>
                    <span className="text-sm flex-1 truncate font-mono" dir="ltr">
                      {log.message}
                    </span>
                    <span className="text-[11px] text-muted-foreground shrink-0 tabular-nums">
                      {log.time}
                    </span>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => deleteOne(log.id)}
                      aria-label="حذف السجل"
                      className="size-7 shrink-0 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 text-muted-foreground hover:text-destructive transition-opacity"
                    >
                      <X className="size-3.5" />
                    </Button>
                  </li>
                )
              })}
            </ul>
          </CardContent>
        </Card>
      ) : (
        <Empty className="border border-dashed border-border/60 bg-card/40 rounded-2xl">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <ScrollText className="size-6" />
            </EmptyMedia>
            <EmptyTitle>لا توجد سجلات</EmptyTitle>
            <EmptyDescription>
              {logs.length === 0
                ? "تم مسح جميع السجلات. ستظهر السجلات الجديدة هنا تلقائياً."
                : "لا توجد سجلات مطابقة لهذا التصنيف."}
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}

      <ConfirmDialog
        open={confirmClear}
        onOpenChange={setConfirmClear}
        title="مسح جميع السجلات"
        description="سيتم حذف جميع السجلات نهائياً. هذا الإجراء غير قابل للتراجع."
        confirmLabel="نعم، مسح الكل"
        destructive
        onConfirm={clearAll}
      />
    </div>
  )
}
