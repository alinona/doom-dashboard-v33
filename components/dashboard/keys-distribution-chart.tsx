"use client"

import { Cell, Pie, PieChart, Label } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Card, CardContent } from "@/components/ui/card"
import { Key } from "lucide-react"
import { mockKeysDistribution } from "@/lib/mock-data"

const COLORS: Record<string, string> = {
  active: "oklch(0.72 0.18 150)",
  blocked: "oklch(0.62 0.245 25)",
  expired: "oklch(0.55 0.012 270)",
}

const chartConfig = {
  value: { label: "العدد" },
  active: { label: "فعّال" },
  blocked: { label: "محظور" },
  expired: { label: "منتهي الصلاحية" },
} satisfies ChartConfig

export function KeysDistributionChart() {
  const total = mockKeysDistribution.reduce((sum, d) => sum + d.value, 0)

  return (
    <Card className="relative overflow-hidden border-border/60 bg-card/60 doom-hairline h-full">
      <CardContent className="p-5 sm:p-6 flex flex-col h-full">
        <header className="mb-3">
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider font-bold text-muted-foreground/80 mb-1">
            <Key className="size-3.5 text-primary" />
            توزيع المفاتيح
          </div>
          <h2 className="text-base font-bold leading-tight">حسب الحالة</h2>
        </header>

        <div className="flex items-center gap-5 flex-1">
          <ChartContainer config={chartConfig} className="aspect-square h-[180px] shrink-0">
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel nameKey="name" />}
              />
              <Pie
                data={mockKeysDistribution}
                dataKey="value"
                nameKey="name"
                innerRadius={56}
                outerRadius={82}
                strokeWidth={3}
                stroke="oklch(0.125 0.01 270)"
                paddingAngle={3}
              >
                {mockKeysDistribution.map((entry) => (
                  <Cell key={entry.key} fill={COLORS[entry.key]} />
                ))}
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy as number) - 6}
                            className="fill-foreground font-extrabold text-2xl tabular-nums"
                          >
                            {total}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy as number) + 14}
                            className="fill-muted-foreground text-[10px]"
                          >
                            مفتاح
                          </tspan>
                        </text>
                      )
                    }
                    return null
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>

          <div className="flex-1 min-w-0 flex flex-col gap-2.5">
            {mockKeysDistribution.map((d) => {
              const pct = total > 0 ? Math.round((d.value / total) * 100) : 0
              return (
                <div key={d.key} className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-xs">
                    <span
                      className="size-2.5 rounded-sm shrink-0"
                      style={{ background: COLORS[d.key] }}
                    />
                    <span className="text-muted-foreground truncate flex-1">{d.name}</span>
                    <span className="font-mono font-bold tabular-nums">{d.value}</span>
                  </div>
                  <div className="h-1 rounded-full bg-muted/50 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${pct}%`, background: COLORS[d.key] }}
                      aria-hidden
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
