import { ArrowDownRight, ArrowUpRight, type LucideIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Sparkline } from "./sparkline"
import { cn } from "@/lib/utils"

interface StatCardProps {
  label: string
  value: string | number
  icon: LucideIcon
  hint?: string
  tone?: "primary" | "success" | "warning" | "danger" | "neutral" | "info"
  trend?: { value: number; direction: "up" | "down" }
  sparkData?: number[]
}

const toneStyles: Record<
  NonNullable<StatCardProps["tone"]>,
  { iconBg: string; iconColor: string; sparkColor: string; glow: string }
> = {
  primary: {
    iconBg: "bg-primary/10 border-primary/20",
    iconColor: "text-primary",
    sparkColor: "var(--primary)",
    glow: "from-primary/20",
  },
  success: {
    iconBg: "bg-emerald-500/10 border-emerald-500/20",
    iconColor: "text-emerald-300",
    sparkColor: "oklch(0.7 0.18 150)",
    glow: "from-emerald-500/20",
  },
  warning: {
    iconBg: "bg-amber-500/10 border-amber-500/20",
    iconColor: "text-amber-300",
    sparkColor: "oklch(0.78 0.14 75)",
    glow: "from-amber-500/20",
  },
  danger: {
    iconBg: "bg-destructive/10 border-destructive/20",
    iconColor: "text-destructive",
    sparkColor: "var(--destructive)",
    glow: "from-destructive/20",
  },
  info: {
    iconBg: "bg-sky-500/10 border-sky-500/20",
    iconColor: "text-sky-300",
    sparkColor: "oklch(0.7 0.15 220)",
    glow: "from-sky-500/20",
  },
  neutral: {
    iconBg: "bg-muted border-border",
    iconColor: "text-muted-foreground",
    sparkColor: "oklch(0.5 0.01 270)",
    glow: "from-muted/40",
  },
}

export function StatCard({
  label,
  value,
  icon: Icon,
  hint,
  tone = "primary",
  trend,
  sparkData,
}: StatCardProps) {
  const styles = toneStyles[tone]

  return (
    <Card className="relative overflow-hidden border-border/60 bg-card/60 doom-hairline transition-colors hover:bg-card group">
      {/* Subtle tone glow in corner */}
      <div
        className={cn(
          "absolute -top-12 -left-12 size-32 rounded-full bg-gradient-to-br to-transparent opacity-50 group-hover:opacity-80 transition-opacity blur-2xl pointer-events-none",
          styles.glow,
        )}
        aria-hidden
      />

      <CardContent className="relative p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground/80 truncate">
              {label}
            </p>
            <p className="text-2xl sm:text-[28px] font-extrabold mt-2 leading-none tabular-nums tracking-tight">
              {value}
            </p>
            <div className="flex items-center gap-2 mt-2.5 min-h-[18px]">
              {trend && (
                <span
                  className={cn(
                    "inline-flex items-center gap-0.5 text-[11px] font-bold tabular-nums",
                    trend.direction === "up" ? "text-emerald-400" : "text-destructive",
                  )}
                >
                  {trend.direction === "up" ? (
                    <ArrowUpRight className="size-3" />
                  ) : (
                    <ArrowDownRight className="size-3" />
                  )}
                  {trend.value}%
                </span>
              )}
              {hint && (
                <p className="text-[11px] text-muted-foreground truncate">{hint}</p>
              )}
            </div>
          </div>

          <div
            className={cn(
              "size-10 rounded-xl border flex items-center justify-center shrink-0",
              styles.iconBg,
            )}
          >
            <Icon className={cn("size-[18px]", styles.iconColor)} aria-hidden />
          </div>
        </div>

        {sparkData && sparkData.length > 1 && (
          <div className="mt-3 -mb-1" style={{ color: styles.sparkColor }}>
            <Sparkline
              data={sparkData}
              width={220}
              height={32}
              stroke={styles.sparkColor}
              fill={styles.sparkColor}
              className="w-full h-8"
            />
          </div>
        )}
      </CardContent>
    </Card>
  )
}
