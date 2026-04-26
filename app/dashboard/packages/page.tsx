"use client"

import { useMemo, useState } from "react"
import { Eye, EyeOff, Package, Pencil, PlayCircle, Search } from "lucide-react"
import { toast } from "sonner"
import { PageHeader } from "@/components/dashboard/page-header"
import { ConfirmDialog } from "@/components/dashboard/confirm-dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  mockPackages,
  packageTypeColors,
  packageTypeLabels,
  type Package as Pkg,
} from "@/lib/mock-data"
import { cn } from "@/lib/utils"

const ARABIC_MAX = 20

// Source of truth: `mockPackages` from data.js (lib/mock-data.ts).
// `packages` is an optimistic UI copy so the user sees visual feedback.
// All mutations are MOCK — they do NOT persist anywhere. Real persistence
// happens via the TODO BACKEND endpoints noted on each action.
export default function PackagesPage() {
  const [packages, setPackages] = useState<Pkg[]>(mockPackages)

  const [query, setQuery] = useState("")
  const [editing, setEditing] = useState<Pkg | null>(null)
  const [editLabel, setEditLabel] = useState("")
  const [confirmHide, setConfirmHide] = useState<Pkg | null>(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return packages
    return packages.filter(
      (p) => p.originalName.toLowerCase().includes(q) || p.arabicLabel.toLowerCase().includes(q),
    )
  }, [packages, query])

  function toggleVisibility(pkg: Pkg) {
    if (pkg.visible) {
      // Hiding requires confirmation
      setConfirmHide(pkg)
    } else {
      // Showing is a safe action — flip immediately (optimistic UI)
      // TODO BACKEND: POST /api/packages/{id}/show
      setPackages((prev) =>
        prev.map((p) => (p.id === pkg.id ? { ...p, visible: true } : p)),
      )
      toast.success(`تم إظهار "${pkg.arabicLabel || pkg.originalName}"`)
    }
  }

  function confirmHidePackage() {
    if (!confirmHide) return
    // TODO BACKEND: POST /api/packages/{id}/hide
    setPackages((prev) =>
      prev.map((p) => (p.id === confirmHide.id ? { ...p, visible: false } : p)),
    )
    toast.success(`تم إخفاء "${confirmHide.arabicLabel || confirmHide.originalName}"`)
    setConfirmHide(null)
  }

  function openEdit(pkg: Pkg) {
    setEditing(pkg)
    setEditLabel(pkg.arabicLabel)
  }

  function saveEdit() {
    if (!editing) return
    // TODO BACKEND: PATCH /api/packages/{id}  body: { arabicLabel }
    setPackages((prev) =>
      prev.map((p) => (p.id === editing.id ? { ...p, arabicLabel: editLabel.trim() } : p)),
    )
    toast.success("تم حفظ التسمية العربية")
    setEditing(null)
  }

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title="الباقات"
        description="إدارة الباقات وتسمياتها العربية وإظهارها أو إخفائها"
        icon={<Package className="size-5 text-primary-foreground" />}
      />

      {/* Search */}
      <Card className="border-border/60 bg-card/60">
        <CardContent className="p-3 sm:p-4">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="ابحث عن باقة..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pr-10 h-10 bg-input/40"
            />
          </div>
        </CardContent>
      </Card>

      {/* Table - responsive: cards on mobile, table on desktop */}
      <Card className="border-border/60 bg-card/60 overflow-hidden">
        <CardContent className="p-0">
          {/* Desktop table */}
          <div className="hidden lg:block overflow-x-auto scrollbar-thin">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/60 bg-muted/30 text-muted-foreground">
                  <th className="text-right px-4 py-3 font-medium">الاسم الأصلي</th>
                  <th className="text-right px-4 py-3 font-medium">التسمية العربية</th>
                  <th className="text-right px-4 py-3 font-medium">النوع</th>
                  <th className="text-right px-4 py-3 font-medium">القنوات</th>
                  <th className="text-right px-4 py-3 font-medium">الظهور</th>
                  <th className="text-right px-4 py-3 font-medium">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((pkg) => (
                  <tr key={pkg.id} className="border-b border-border/40 hover:bg-muted/20">
                    <td className="px-4 py-3 max-w-[220px]">
                      <span className="block truncate font-medium" title={pkg.originalName} dir="ltr">
                        {pkg.originalName}
                      </span>
                      <span className="text-[11px] text-muted-foreground">id: {pkg.category_id}</span>
                    </td>
                    <td className="px-4 py-3 max-w-[180px]">
                      <span className="block truncate" title={pkg.arabicLabel}>
                        {pkg.arabicLabel || "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className={cn("border", packageTypeColors[pkg.type])}>
                        {packageTypeLabels[pkg.type]}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">{pkg.channelCount}</td>
                    <td className="px-4 py-3">
                      {pkg.visible ? (
                        <Badge className="bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/20">
                          ظاهرة
                        </Badge>
                      ) : (
                        <Badge className="bg-zinc-500/15 text-zinc-300 border border-zinc-500/30 hover:bg-zinc-500/20">
                          مخفية
                        </Badge>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="size-8"
                          onClick={() => openEdit(pkg)}
                          aria-label="تعديل التسمية"
                        >
                          <Pencil className="size-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="size-8"
                          onClick={() => toggleVisibility(pkg)}
                          aria-label={pkg.visible ? "إخفاء" : "إظهار"}
                        >
                          {pkg.visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="size-8"
                          aria-label="معاينة قناة"
                          onClick={() => toast.info(`جاري اختبار قناة عشوائية من "${pkg.arabicLabel || pkg.originalName}"...`)}
                        >
                          <PlayCircle className="size-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <ul className="lg:hidden divide-y divide-border/40">
            {filtered.map((pkg) => (
              <li key={pkg.id} className="p-3 sm:p-4 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium truncate" dir="ltr">
                      {pkg.originalName}
                    </p>
                    <p className="text-sm text-muted-foreground truncate">
                      {pkg.arabicLabel || "بدون تسمية"}
                    </p>
                  </div>
                  {pkg.visible ? (
                    <Badge className="bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shrink-0">
                      ظاهرة
                    </Badge>
                  ) : (
                    <Badge className="bg-zinc-500/15 text-zinc-300 border border-zinc-500/30 shrink-0">
                      مخفية
                    </Badge>
                  )}
                </div>
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="outline" className={cn("border", packageTypeColors[pkg.type])}>
                    {packageTypeLabels[pkg.type]}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{pkg.channelCount} قناة</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" className="flex-1" onClick={() => openEdit(pkg)}>
                    <Pencil className="size-3.5 ml-1" />
                    تعديل
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => toggleVisibility(pkg)}
                  >
                    {pkg.visible ? (
                      <>
                        <EyeOff className="size-3.5 ml-1" /> إخفاء
                      </>
                    ) : (
                      <>
                        <Eye className="size-3.5 ml-1" /> إظهار
                      </>
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="px-3"
                    onClick={() => toast.info(`جاري اختبار قناة عشوائية من "${pkg.arabicLabel || pkg.originalName}"...`)}
                    aria-label="اختبار قناة"
                  >
                    <PlayCircle className="size-3.5" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>

          {filtered.length === 0 && (
            <div className="py-10 text-center text-sm text-muted-foreground">لا توجد نتائج مطابقة</div>
          )}
        </CardContent>
      </Card>

      {/* Edit dialog */}
      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-md max-h-[calc(100dvh-2rem)] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-right">تعديل التسمية العربية</DialogTitle>
            <DialogDescription className="text-right">
              لن يتم تعديل الاسم الأصلي، فقط التسمية العربية المعروضة.
            </DialogDescription>
          </DialogHeader>
          {editing && (
            <div className="flex flex-col gap-4">
              <div className="rounded-lg bg-muted/40 p-3 border border-border/50">
                <p className="text-[11px] text-muted-foreground">الاسم الأصلي</p>
                <p className="font-mono text-sm truncate" dir="ltr">
                  {editing.originalName}
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="ar-label">التسمية العربية</Label>
                <Input
                  id="ar-label"
                  value={editLabel}
                  onChange={(e) => setEditLabel(e.target.value)}
                  placeholder="مثال: ام بي سي 1"
                  className="h-10"
                />
                <div className="flex items-center justify-between text-[11px]">
                  <span
                    className={cn(
                      "text-muted-foreground",
                      editLabel.length > ARABIC_MAX && "text-amber-400",
                    )}
                  >
                    {editLabel.length} / {ARABIC_MAX} حرف موصى به
                  </span>
                  {editLabel.length > ARABIC_MAX && (
                    <span className="text-amber-400">قد يظهر مقطوعاً داخل التطبيق</span>
                  )}
                </div>
              </div>
              <div className="rounded-lg border border-border/50 p-3 bg-background/40">
                <p className="text-[11px] text-muted-foreground mb-1">معاينة</p>
                <p className="text-sm font-medium truncate">
                  {editLabel || editing.originalName}
                </p>
              </div>
            </div>
          )}
          <DialogFooter className="flex-row gap-2">
            <Button
              onClick={saveEdit}
              className="doom-gradient text-primary-foreground hover:opacity-90 flex-1 sm:flex-initial"
            >
              حفظ
            </Button>
            <Button variant="outline" onClick={() => setEditing(null)} className="flex-1 sm:flex-initial">
              إلغاء
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!confirmHide}
        onOpenChange={(o) => !o && setConfirmHide(null)}
        title="إخفاء الباقة"
        description={
          <>
            سيتم إخفاء باقة <strong>{confirmHide?.originalName}</strong> من التطبيق. يمكنك إعادة إظهارها
            في أي وقت.
          </>
        }
        confirmLabel="نعم، إخفاء"
        onConfirm={confirmHidePackage}
      />
    </div>
  )
}
