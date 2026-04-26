"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Clock,
  HardDrive,
  Key,
  Package,
  Radio,
  Server,
  Tv,
} from "lucide-react"
import { StatCard } from "@/components/dashboard/stat-card"
import { TrafficChart } from "@/components/dashboard/traffic-chart"
import { KeysDistributionChart } from "@/components/dashboard/keys-distribution-chart"
import { SystemHealth } from "@/components/dashboard/system-health"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { mockLogs, mockStats, mockTrafficData } from "@/lib/mock-data"
import { getSession } from "@/lib/auth"
import { cn } from "@/lib/utils"

export default function DashboardPage() {
  const [username, setUsername] = useState("admin")
  const recent = mockLogs.slice(0, 6)

  useEffect(() => {
    const s = getSession()
    if (s) setUsername(s.username)
  }, [])

  const today = new Intl.DateTimeFormat("ar-EG-u-nu-latn", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date())

  const sparkStreams = mockTrafficData.map((d) => d.streams)
  const sparkLogins = mockTrafficData.map((d) => d.logins)
  const sparkErrors = [0, 1, 0, 2, 1, 3, 2, 3]
  const sparkKeys = [4, 4, 4, 4, 5, 5, 5, 5]

  return (
    <div className="flex flex-col gap-6">
      {/* HERO */}
      <div className="relative overflow-hidden rounded-2xl border border-border/60 doom-hairline">
        <div className="absolute inset-0 doom-dot-grid opacity-50" aria-hidden />
        <div className="absolute -top-24 right-10 size-72 doom-aurora opacity-80" aria-hidden />
        <div className="absolute -bottom-24 left-10 size-56 doom-aurora opacity-50" aria-hidden />

        <div className="relative p-5 sm:p-7 flex flex-col lg:flex-row gap-5 lg:items-center justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="size-3.5 text-muted-foreground" />
              <span className="text-[11px] uppercase tracking-[0.18em] font-bold text-muted-foreground/80">
                {today}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold leading-tight tracking-tight">
              أهلاً، <span className="doom-gradient-text">{username}</span>
            </h1>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed max-w-xl text-pretty">
              نظرة شاملة على حالة Doom Smarter Proxy والإحصائيات اللحظية. كل شيء يعمل ضمن النطاق الآمن.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 lg:shrink-0">
            <span className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/25 bg-emerald-500/[0.08] px-3 py-2 text-xs font-medium text-emerald-300">
              <span className="relative flex">
                <span className="size-1.5 rounded-full bg-emerald-400" />
                <span className="absolute inset-0 size-1.5 rounded-full bg-emerald-400 animate-ping opacity-70" />
              </span>
              السيرفر متصل
            </span>
            <span className="inline-flex items-center gap-2 rounded-xl border border-amber-500/25 bg-amber-500/[0.08] px-3 py-2 text-xs font-medium text-amber-300">
              <CheckCircle2 className="size-3.5" />
              Gold State
            </span>
            <Button asChild variant="outline" size="sm" className="h-9 rounded-xl border-border/60 bg-card/40">
              <Link href="/dashboard/logs" className="gap-1.5">
                النشاط الأخير
                <ArrowLeft className="size-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* SERVICE STATUS */}
      <section>
        <div className="flex items-center justify-between gap-3 mb-3">
          <h2 className="text-xs uppercase tracking-[0.18em] font-bold text-muted-foreground/80">
            حالة الخدمات
          </h2>
          <span className="text-[11px] text-muted-foreground">آخر تحديث: قبل دقائق</span>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <StatCard
            label="حالة السيرفر"
            value={mockStats.serverStatus === "online" ? "متصل" : "غير متصل"}
            icon={Server}
            tone={mockStats.serverStatus === "online" ? "success" : "danger"}
            hint="13.50.223.154:8888"
          />
          <StatCard
            label="Login API"
            value={mockStats.loginApi === "ok" ? "يعمل" : "خطأ"}
            icon={Activity}
            tone={mockStats.loginApi === "ok" ? "success" : "danger"}
            hint="status 101"
          />
          <StatCard
            label="البث المباشر"
            value={mockStats.liveStreaming === "ok" ? "يعمل" : "خطأ"}
            icon={Radio}
            tone={mockStats.liveStreaming === "ok" ? "success" : "danger"}
            hint="all routes ok"
          />
          <StatCard
            label="آخر نسخة احتياطية"
            value={mockStats.lastBackup}
            icon={HardDrive}
            tone="info"
            hint="stable_backup_v1"
          />
        </div>
      </section>

      {/* CONTENT STATS WITH SPARKLINES */}
      <section>
        <div className="flex items-center justify-between gap-3 mb-3">
          <h2 className="text-xs uppercase tracking-[0.18em] font-bold text-muted-foreground/80">
            إحصائيات المحتوى
          </h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <StatCard
            label="الباقات"
            value={mockStats.totalPackages}
            icon={Package}
            tone="primary"
            hint={`${mockStats.hiddenPackages} مخفية`}
            trend={{ value: 8.4, direction: "up" }}
            sparkData={sparkStreams}
          />
          <StatCard
            label="القنوات"
            value={mockStats.totalChannels}
            icon={Tv}
            tone="info"
            hint={`${mockStats.hiddenChannels} مخفية`}
            trend={{ value: 4.2, direction: "up" }}
            sparkData={sparkLogins}
          />
          <StatCard
            label="مفاتيح فعّالة"
            value={mockStats.activeKeys}
            icon={Key}
            tone="success"
            hint="من إجمالي 6"
            sparkData={sparkKeys}
          />
          <StatCard
            label="أخطاء اليوم"
            value={mockStats.errorsToday}
            icon={AlertTriangle}
            tone={mockStats.errorsToday > 0 ? "warning" : "success"}
            hint="آخر 24 ساعة"
            trend={{ value: 12.1, direction: "down" }}
            sparkData={sparkErrors}
          />
        </div>
      </section>

      {/* CHARTS */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-5">
        <div className="lg:col-span-2">
          <TrafficChart />
        </div>
        <div>
          <KeysDistributionChart />
        </div>
      </section>

      {/* SYSTEM HEALTH */}
      <SystemHealth />

      {/* ACTIVITY + QUICK ACTIONS */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-5">
        <Card className="border-border/60 bg-card/60 lg:col-span-2 doom-hairline">
          <CardContent className="p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div>
                <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider font-bold text-muted-foreground/80 mb-1">
                  <Activity className="size-3.5 text-primary" />
                  النشاط الأخير
                </div>
                <h3 className="text-base font-bold leading-tight">آخر العمليات على السيرفر</h3>
              </div>
              <Button asChild variant="ghost" size="sm" className="h-8 text-xs rounded-lg gap-1">
                <Link href="/dashboard/logs">
                  عرض الكل
                  <ArrowLeft className="size-3" />
                </Link>
              </Button>
            </div>
            <ul className="flex flex-col">
              {recent.map((log, i) => (
                <li
                  key={log.id}
                  className={cn(
                    "flex items-center gap-3 py-2.5",
                    i !== recent.length - 1 && "border-b border-border/40",
                  )}
                >
                  <span
                    className={cn(
                      "size-1.5 rounded-full shrink-0",
                      log.status === "ok" && "bg-emerald-400",
                      log.status === "warning" && "bg-amber-400",
                      log.status === "error" && "bg-destructive",
                    )}
                    aria-hidden
                  />
                  <span className="text-sm flex-1 truncate font-mono" dir="ltr">
                    {log.message}
                  </span>
                  <span className="text-[11px] text-muted-foreground shrink-0 tabular-nums">
                    {log.time}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/60 doom-hairline">
          <CardContent className="p-5 sm:p-6">
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider font-bold text-muted-foreground/80 mb-1">
              <Activity className="size-3.5 text-primary" />
              إجراءات سريعة
            </div>
            <h3 className="text-base font-bold leading-tight mb-4">اختصارات شائعة</h3>
            <div className="flex flex-col gap-2">
              <Button
                asChild
                className="doom-gradient text-primary-foreground hover:opacity-95 justify-start h-10 rounded-xl gap-2 doom-shadow-glow"
              >
                <Link href="/dashboard/keys">
                  <Key className="size-4" />
                  إضافة مفتاح جديد
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="justify-start h-10 rounded-xl border-border/60 bg-card/30 gap-2"
              >
                <Link href="/dashboard/backup">
                  <HardDrive className="size-4 text-muted-foreground" />
                  إنشاء نسخة احتياطية
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="justify-start h-10 rounded-xl border-border/60 bg-card/30 gap-2"
              >
                <Link href="/dashboard/channels">
                  <Tv className="size-4 text-muted-foreground" />
                  إدارة القنوات
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="justify-start h-10 rounded-xl border-border/60 bg-card/30 gap-2"
              >
                <Link href="/dashboard/logs">
                  <Activity className="size-4 text-muted-foreground" />
                  مراجعة السجلات
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
