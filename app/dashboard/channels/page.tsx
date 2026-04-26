"use client"

import { useMemo, useState } from "react"
import { Eye, EyeOff, Pencil, PlayCircle, Search, Tv } from "lucide-react"
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { mockChannels, mockPackages, type Channel } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

const ARABIC_MAX = 20

function StreamStatusBadge({ status }: { status: Channel["streamStatus"] }) {
  if (status === "ok")
    return (
      <Badge className="bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/20">
        <span className="size-1.5 rounded-full bg-emerald-400 ml-1.5 inline-block" aria-hidden />
        يعمل
      </Badge>
    )
  if (status === "testing")
    return (
      <Badge className="bg-amber-500/15 text-amber-300 border border-amber-500/30 hover:bg-amber-500/20">
        <span className="size-1.5 rounded-full bg-amber-400 ml-1.5 inline-block animate-pulse" aria-hidden />
        قيد الاختبار
      </Badge>
    )
  return (
    <Badge className="bg-destructive/15 text-destructive border border-destructive/30 hover:bg-destructive/20">
      <span className="size-1.5 rounded-full bg-destructive ml-1.5 inline-block" aria-hidden />
      متوقف
    </Badge>
  )
}

function VisibilityBadge({ visible }: { visible: boolean }) {
  return visible ? (
    <Badge className="bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/20">
      ظاهرة
    </Badge>
  ) : (
    <Badge className="bg-zinc-500/15 text-zinc-300 border border-zinc-500/30 hover:bg-zinc-500/20">
      مخفية
    </Badge>
  )
}

// Source of truth: `mockChannels` from data.js (lib/mock-data.ts).
// `channels` is an optimistic UI copy so the user sees visual feedback.
// Sensitive fields (channelId, stream_url) are NEVER editable from UI.
// All mutations are MOCK — real persistence happens via TODO BACKEND endpoints.
export default function ChannelsPage() {
  const [channels, setChannels] = useState<Channel[]>(mockChannels)

  const [query, setQuery] = useState("")
  const [packageFilter, setPackageFilter] = useState<string>("all")
  const [editing, setEditing] = useState<Channel | null>(null)
  const [editLabel, setEditLabel] = useState("")
  const [confirmHide, setConfirmHide] = useState<Channel | null>(null)
  const [preview, setPreview] = useState<Channel | null>(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return channels.filter((c) => {
      const matchesQuery =
        !q ||
        c.originalName.toLowerCase().includes(q) ||
        c.arabicLabel.toLowerCase().includes(q) ||
        c.channelId.includes(q)
      const matchesPkg = packageFilter === "all" || c.packageId.toString() === packageFilter
      return matchesQuery && matchesPkg
    })
  }, [channels, query, packageFilter])

  function toggleVisibility(ch: Channel) {
    if (ch.visible) {
      // Hiding requires confirmation
      setConfirmHide(ch)
    } else {
      // Showing is a safe action — flip immediately (optimistic UI)
      // TODO BACKEND: POST /api/channels/{id}/show
      setChannels((prev) =>
        prev.map((c) => (c.id === ch.id ? { ...c, visible: true } : c)),
      )
      toast.success(`تم إظهار "${ch.arabicLabel || ch.originalName}"`)
    }
  }

  function confirmHideChannel() {
    if (!confirmHide) return
    // TODO BACKEND: POST /api/channels/{id}/hide
    setChannels((prev) =>
      prev.map((c) => (c.id === confirmHide.id ? { ...c, visible: false } : c)),
    )
    toast.success(`تم إخفاء "${confirmHide.arabicLabel || confirmHide.originalName}"`)
    setConfirmHide(null)
  }

  function openEdit(ch: Channel) {
    setEditing(ch)
    setEditLabel(ch.arabicLabel)
  }

  function saveEdit() {
    if (!editing) return
    // TODO BACKEND: PATCH /api/channels/{id}  body: { arabicLabel }
    setChannels((prev) =>
      prev.map((c) => (c.id === editing.id ? { ...c, arabicLabel: editLabel.trim() } : c)),
    )
    toast.success("تم حفظ التسمية العربية")
    setEditing(null)
  }

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title="القنوات"
        description="إدارة القنوات وحالة البث والظهور"
        icon={<Tv className="size-5 text-primary-foreground" />}
      />

      {/* Filters */}
      <Card className="border-border/60 bg-card/60">
        <CardContent className="p-3 sm:p-4 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="ابحث عن قناة بالاسم أو الـID..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pr-10 h-10 bg-input/40"
            />
          </div>
          <Select value={packageFilter} onValueChange={setPackageFilter}>
            <SelectTrigger className="h-10 sm:w-[220px]">
              <SelectValue placeholder="فلتر بالباقة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">كل الباقات</SelectItem>
              {mockPackages.map((p) => (
                <SelectItem key={p.id} value={p.id.toString()}>
                  {p.arabicLabel || p.originalName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Table / cards */}
      <Card className="border-border/60 bg-card/60 overflow-hidden">
        <CardContent className="p-0">
          {/* Desktop table */}
          <div className="hidden lg:block overflow-x-auto scrollbar-thin">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/60 bg-muted/30 text-muted-foreground">
                  <th className="text-right px-4 py-3 font-medium">القناة</th>
                  <th className="text-right px-4 py-3 font-medium">التسمية العربية</th>
                  <th className="text-right px-4 py-3 font-medium">الباقة</th>
                  <th className="text-right px-4 py-3 font-medium">الظهور</th>
                  <th className="text-right px-4 py-3 font-medium">حالة البث</th>
                  <th className="text-right px-4 py-3 font-medium">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((ch) => (
                  <tr key={ch.id} className="border-b border-border/40 hover:bg-muted/20">
                    <td className="px-4 py-3 max-w-[220px]">
                      <span className="block truncate font-medium" title={ch.originalName} dir="ltr">
                        {ch.originalName}
                      </span>
                      <span className="text-[11px] text-muted-foreground font-mono">
                        id: {ch.channelId}
                      </span>
                    </td>
                    <td className="px-4 py-3 max-w-[180px]">
                      <span className="block truncate" title={ch.arabicLabel}>
                        {ch.arabicLabel || "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3 max-w-[160px]">
                      <span className="block truncate text-muted-foreground" title={ch.packageName}>
                        {ch.packageName}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <VisibilityBadge visible={ch.visible} />
                    </td>
                    <td className="px-4 py-3">
                      <StreamStatusBadge status={ch.streamStatus} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="size-8"
                          onClick={() => setPreview(ch)}
                          aria-label="معاينة"
                        >
                          <PlayCircle className="size-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="size-8"
                          onClick={() => openEdit(ch)}
                          aria-label="تعديل التسمية"
                        >
                          <Pencil className="size-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="size-8"
                          onClick={() => toggleVisibility(ch)}
                          aria-label={ch.visible ? "إخفاء" : "إظهار"}
                        >
                          {ch.visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
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
            {filtered.map((ch) => (
              <li key={ch.id} className="p-3 sm:p-4 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium truncate" dir="ltr">
                      {ch.originalName}
                    </p>
                    <p className="text-sm text-muted-foreground truncate">
                      {ch.arabicLabel || "بدون تسمية"} · {ch.packageName}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] text-muted-foreground">الظهور:</span>
                    <VisibilityBadge visible={ch.visible} />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] text-muted-foreground">حالة البث:</span>
                    <StreamStatusBadge status={ch.streamStatus} />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" className="flex-1" onClick={() => setPreview(ch)}>
                    <PlayCircle className="size-3.5 ml-1" />
                    معاينة
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1" onClick={() => openEdit(ch)}>
                    <Pencil className="size-3.5 ml-1" />
                    تعديل
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => toggleVisibility(ch)}
                  >
                    {ch.visible ? (
                      <>
                        <EyeOff className="size-3.5 ml-1" /> إخفاء
                      </>
                    ) : (
                      <>
                        <Eye className="size-3.5 ml-1" /> إظهار
                      </>
                    )}
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
              لن يتم تعديل الاسم الأصلي، فقط التسمية العربية.
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
                </div>
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
            <Button
              variant="outline"
              onClick={() => setEditing(null)}
              className="flex-1 sm:flex-initial"
            >
              إلغاء
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview dialog */}
      <Dialog open={!!preview} onOpenChange={(o) => !o && setPreview(null)}>
        <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-lg max-h-[calc(100dvh-2rem)] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-right">معاينة القناة</DialogTitle>
            <DialogDescription className="text-right">
              معاينة وهمية فقط — لا يتم بث حقيقي.
            </DialogDescription>
          </DialogHeader>
          {preview && (
            <div className="flex flex-col gap-3">
              <div className="aspect-video rounded-lg bg-black/60 border border-border/50 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 doom-gradient opacity-10" />
                <div className="relative flex flex-col items-center gap-2 text-center px-4">
                  <PlayCircle className="size-12 text-primary" />
                  <p className="text-sm font-medium truncate max-w-full" dir="ltr">
                    {preview.originalName}
                  </p>
                  <p className="text-[11px] text-muted-foreground">Mock Player Placeholder</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="rounded-lg border border-border/50 p-3 bg-background/40">
                  <p className="text-[11px] text-muted-foreground">الباقة</p>
                  <p className="truncate">{preview.packageName}</p>
                </div>
                <div className="rounded-lg border border-border/50 p-3 bg-background/40">
                  <p className="text-[11px] text-muted-foreground">حالة البث</p>
                  <StreamStatusBadge status={preview.streamStatus} />
                </div>
                <div className="rounded-lg border border-border/50 p-3 bg-background/40">
                  <p className="text-[11px] text-muted-foreground">Content-Type</p>
                  <p className="font-mono text-xs">application/vnd.apple.mpegurl</p>
                </div>
                <div className="rounded-lg border border-border/50 p-3 bg-background/40">
                  <p className="text-[11px] text-muted-foreground">زمن الاستجابة</p>
                  <p className="font-mono text-xs">142 ms</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setPreview(null)} className="w-full sm:w-auto">
              إغلاق
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!confirmHide}
        onOpenChange={(o) => !o && setConfirmHide(null)}
        title="إخفاء القناة"
        description={
          <>
            سيتم إخفاء قناة <strong>{confirmHide?.originalName}</strong> من التطبيق. يمكن إظهارها لاحقاً.
          </>
        }
        confirmLabel="نعم، إخفاء"
        onConfirm={confirmHideChannel}
      />
    </div>
  )
}
