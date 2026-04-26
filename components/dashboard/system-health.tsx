"use client"

import { Cpu, MemoryStick, Network, Timer, Activity } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { mockStats } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

interface GaugeProps {
  label: string
  value: number
  icon: React.ElementType
}

function getTone(value: number) {
  if (value >= 85) return { color: "oklch(0.62 0.245 25)", text: "text-destructive", bg: "bg-destructive/10", border: "border-destructive/30" }
  if (value >= 70) return { color: "oklch(0.78 0.14 75)", text: "text-amber-300", bg: "bg-amber-500/10", border: "border-amber-500/30" }
  return { color: "oklch(0.72 0.18 150)", text: "text-emerald-300", bg: "bg-emerald-500/10", border: "border-emerald-500/30" }
}

function RadialGauge({ label, value, icon: Icon }: GaugeProps) {
  const tone = getTone(value)
  const radius = 32
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (value / 100) * circumference
  return (
    <div className="flex items-center gap-4 p-4 rounded-xl border border-border/60 bg-background/40">
      <div className="relative shrink-0">
        <svg width="80" height="80" viewBox="0 0 80 80" className="-rotate-90">
          <circle
            cx="40"
            cy="40"
            r={radius}
            fill="none"
            stroke="oklch(0.22 0.012 270)"
            strokeWidth="6"
          />
          <circle
            cx="40"
            cy="40"
            r={radius}
            fill="none"
            stroke={tone.color}
            strokeWidth="6"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 0.6s ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn("font-mono font-extrabold text-base tabular-nums leading-none", tone.text)}>
            {value}
          </span>
          <span className="text-[9px] text-muted-foreground leading-none mt-0.5">٪</span>
        </div>
      </div>
      <div className="min-w-0 flex-1">
        <div
          className={cn(
            "inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-[10px] font-bold",
            tone.bg,
            tone.border,
            tone.text,
          )}
        >
          <Icon className="size-3" />
          {label}
        </div>
        <p className="text-[11px] text-muted-foreground mt-2 leading-relaxed">
          {value < 50
            ? "ممتاز — استخدام منخفض"
            : value < 70
              ? "طبيعي — في النطاق الآمن"
              : value < 85
                ? "مرتفع — راقب الاستخدام"
                : "حرج — ينصح بالصيانة"}
        </p>
      </div>
    </div>
  )
}

export function SystemHealth() {
  return (
    <Card className="relative overflow-hidden border-border/60 bg-card/60 doom-hairline">
      <CardContent className="p-5 sm:p-6">
        <header className="flex items-center justify-between gap-3 mb-5 flex-wrap">
          <div>
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider font-bold text-muted-foreground/80 mb-1">
              <Activity className="size-3.5 text-primary" />
              صحة النظام
            </div>
            <h2 className="text-base font-bold leading-tight">المؤشرات الحيوية</h2>
          </div>
          <div className="inline-flex items-center gap-2 rounded-lg border border-border/60 bg-background/40 px-3 py-1.5">
            <Timer className="size-3.5 text-muted-foreground" />
            <span className="text-[11px] text-muted-foreground">وقت التشغيل</span>
            <span className="text-[11px] font-mono font-bold tabular-nums text-foreground">
              {mockStats.uptime}
            </span>
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <RadialGauge label="المعالج" value={mockStats.cpuUsage} icon={Cpu} />
          <RadialGauge label="الذاكرة" value={mockStats.ramUsage} icon={MemoryStick} />
          <RadialGauge label="عرض النطاق" value={mockStats.bandwidth} icon={Network} />
        </div>
      </CardContent>
    </Card>
  )
}
