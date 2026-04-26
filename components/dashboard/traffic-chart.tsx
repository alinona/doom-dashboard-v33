"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Card, CardContent } from "@/components/ui/card"
import { Activity, TrendingUp } from "lucide-react"
import { mockTrafficData } from "@/lib/mock-data"

const chartConfig = {
  streams: { label: "البث", color: "var(--chart-1)" },
  logins: { label: "تسجيلات الدخول", color: "var(--chart-2)" },
} satisfies ChartConfig

export function TrafficChart() {
  const totalStreams = mockTrafficData.reduce((sum, d) => sum + d.streams, 0)
  const totalLogins = mockTrafficData.reduce((sum, d) => sum + d.logins, 0)

  return (
    <Card className="relative overflow-hidden border-border/60 bg-card/60 doom-hairline">
      <CardContent className="p-5 sm:p-6">
        <header className="flex items-start justify-between gap-3 mb-5 flex-wrap">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider font-bold text-muted-foreground/80 mb-1">
              <Activity className="size-3.5 text-primary" />
              حركة البث
            </div>
            <h2 className="text-base font-bold leading-tight">آخر 24 ساعة</h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-[var(--chart-1)]" />
                <span className="text-[11px] text-muted-foreground">البث</span>
              </div>
              <p className="font-mono font-extrabold tabular-nums text-base mt-0.5">
                {totalStreams.toLocaleString("ar-EG")}
              </p>
            </div>
            <div className="h-9 w-px bg-border/60" aria-hidden />
            <div className="text-right">
              <div className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-[var(--chart-2)]" />
                <span className="text-[11px] text-muted-foreground">دخول</span>
              </div>
              <p className="font-mono font-extrabold tabular-nums text-base mt-0.5">
                {totalLogins.toLocaleString("ar-EG")}
              </p>
            </div>
            <div className="hidden sm:flex h-9 w-px bg-border/60" aria-hidden />
            <div className="hidden sm:flex items-center gap-1 text-[11px] font-bold text-emerald-400">
              <TrendingUp className="size-3" />
              +12.4%
            </div>
          </div>
        </header>

        <ChartContainer config={chartConfig} className="aspect-auto h-[240px] w-full">
          <AreaChart
            accessibilityLayer
            data={mockTrafficData}
            margin={{ top: 10, right: 8, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="fillStreams" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-streams)" stopOpacity={0.5} />
                <stop offset="100%" stopColor="var(--color-streams)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="fillLogins" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-logins)" stopOpacity={0.4} />
                <stop offset="100%" stopColor="var(--color-logins)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              vertical={false}
              stroke="oklch(0.22 0.012 270)"
              strokeDasharray="3 6"
            />
            <XAxis
              dataKey="hour"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              fontSize={11}
              stroke="oklch(0.55 0.012 270)"
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={6}
              fontSize={11}
              width={32}
              stroke="oklch(0.55 0.012 270)"
            />
            <ChartTooltip
              cursor={{ stroke: "var(--border)", strokeWidth: 1, strokeDasharray: "3 3" }}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Area
              dataKey="logins"
              type="monotone"
              fill="url(#fillLogins)"
              stroke="var(--color-logins)"
              strokeWidth={2}
            />
            <Area
              dataKey="streams"
              type="monotone"
              fill="url(#fillStreams)"
              stroke="var(--color-streams)"
              strokeWidth={2.5}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
