"use client"

import { useState } from "react"
import { CheckCircle2, Film, AlertTriangle, RefreshCw } from "lucide-react"
import { toast } from "sonner"
import { PageHeader } from "@/components/dashboard/page-header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { mockMoviesSeries } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

export default function MoviesSeriesPage() {
  const [refreshing, setRefreshing] = useState(false)

  function handleRefresh() {
    setRefreshing(true)
    // TODO BACKEND: GET /api/movies-series/sync — triggers a resync from the provider
    setTimeout(() => {
      setRefreshing(false)
      toast.success("تم تحديث بيانات الأفلام والمسلسلات (Mock)")
    }, 1200)
  }

  const movies = mockMoviesSeries.filter((c) => c.type === "movies")
  const series = mockMoviesSeries.filter((c) => c.type === "series")
  const totalMovies = movies.reduce((acc, c) => acc + c.count, 0)
  const totalSeries = series.reduce((acc, c) => acc + c.count, 0)

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title="الأفلام والمسلسلات"
        description="مراقبة فقط — لا تعديل ولا حذف"
        icon={<Film className="size-5 text-primary-foreground" />}
        actions={
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={refreshing}
            className="gap-2 border-border/60 bg-card/40"
          >
            <RefreshCw className={cn("size-4", refreshing && "animate-spin")} />
            {refreshing ? "جاري التحديث..." : "تحديث البيانات"}
          </Button>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <Card className="border-border/60 bg-card/60">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">تصنيفات الأفلام</p>
            <p className="text-2xl font-extrabold mt-1">{movies.length}</p>
          </CardContent>
        </Card>
        <Card className="border-border/60 bg-card/60">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">إجمالي الأفلام</p>
            <p className="text-2xl font-extrabold mt-1">{totalMovies}</p>
          </CardContent>
        </Card>
        <Card className="border-border/60 bg-card/60">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">تصنيفات المسلسلات</p>
            <p className="text-2xl font-extrabold mt-1">{series.length}</p>
          </CardContent>
        </Card>
        <Card className="border-border/60 bg-card/60">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">إجمالي المسلسلات</p>
            <p className="text-2xl font-extrabold mt-1">{totalSeries}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/60 bg-card/60 overflow-hidden">
        <CardContent className="p-0">
          {/* Desktop */}
          <div className="hidden md:block overflow-x-auto scrollbar-thin">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/60 bg-muted/30 text-muted-foreground">
                  <th className="text-right px-4 py-3 font-medium">التصنيف</th>
                  <th className="text-right px-4 py-3 font-medium">النوع</th>
                  <th className="text-right px-4 py-3 font-medium">العدد</th>
                  <th className="text-right px-4 py-3 font-medium">آخر تحديث</th>
                  <th className="text-right px-4 py-3 font-medium">الحالة</th>
                </tr>
              </thead>
              <tbody>
                {mockMoviesSeries.map((c) => (
                  <tr key={c.id} className="border-b border-border/40">
                    <td className="px-4 py-3">{c.name}</td>
                    <td className="px-4 py-3">
                      <Badge
                        variant="outline"
                        className={cn(
                          "border",
                          c.type === "movies"
                            ? "bg-violet-500/15 text-violet-300 border-violet-500/30"
                            : "bg-blue-500/15 text-blue-300 border-blue-500/30",
                        )}
                      >
                        {c.type === "movies" ? "أفلام" : "مسلسلات"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 font-mono">{c.count.toLocaleString("ar")}</td>
                    <td className="px-4 py-3 text-muted-foreground">{c.lastUpdate}</td>
                    <td className="px-4 py-3">
                      {c.status === "ok" ? (
                        <Badge className="bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                          <CheckCircle2 className="size-3 ml-1" />
                          سليم
                        </Badge>
                      ) : (
                        <Badge className="bg-amber-500/15 text-amber-300 border border-amber-500/30">
                          <AlertTriangle className="size-3 ml-1" />
                          تحذير
                        </Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile */}
          <ul className="md:hidden divide-y divide-border/40">
            {mockMoviesSeries.map((c) => (
              <li key={c.id} className="p-4 flex flex-col gap-2">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-medium truncate">{c.name}</p>
                  <Badge
                    variant="outline"
                    className={cn(
                      "border shrink-0",
                      c.type === "movies"
                        ? "bg-violet-500/15 text-violet-300 border-violet-500/30"
                        : "bg-blue-500/15 text-blue-300 border-blue-500/30",
                    )}
                  >
                    {c.type === "movies" ? "أفلام" : "مسلسلات"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">آخر تحديث: {c.lastUpdate}</span>
                  <span className="font-mono">{c.count.toLocaleString("ar")}</span>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <p className="text-xs text-muted-foreground text-center">
        صفحة عرض ومراقبة فقط — لا توجد إجراءات تعديل لهذا القسم.
      </p>
    </div>
  )
}
