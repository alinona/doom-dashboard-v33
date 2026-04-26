"use client"

// ============================================================
// Keys page — source of truth: `mockKeys` (data.js).
// `keys` is an optimistic UI copy so the user sees visual feedback.
// Sensitive fields (id, deviceCount, lastIp, lastSeen) are NEVER
// editable from the UI — they are display-only and would be sent
// from the backend in a real implementation.
// All mutations are Mock — TODO BACKEND endpoints noted on each.
// ============================================================

import { useMemo, useState } from "react"
import {
  Check,
  Clock,
  Copy,
  FlaskConical,
  Globe,
  Key,
  MapPin,
  Phone,
  Plus,
  Search,
  ShieldAlert,
  User,
} from "lucide-react"
import { toast } from "sonner"
import { PageHeader } from "@/components/dashboard/page-header"
import { ConfirmDialog } from "@/components/dashboard/confirm-dialog"
import { KeyCard } from "@/components/dashboard/key-card"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
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
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { mockKeys, expireOptions, type ApiKey } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

// ─── Trial Key helpers ─────────────────────────────────────────────────────────
const trialHourOptions = [3, 6, 12, 24, 48, 72] as const
type TrialHours = (typeof trialHourOptions)[number]

function formatTrialExpiry(hours: TrialHours): string {
  const d = new Date()
  d.setHours(d.getHours() + hours)
  return d.toLocaleString("ar-EG", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function generateTrialCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
  const seg = () =>
    Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join("")
  return `TRIAL-${seg()}-${seg()}-${seg()}`
}
// ──────────────────────────────────────────────────────────────────────────────

const emptyForm: Omit<ApiKey, "id" | "deviceCount" | "lastIp" | "lastSeen"> = {
  code: "",
  status: "active",
  expireDate: expireOptions[3],
  maxDevices: 2,
  subscriberName: "",
  phone: "",
  address: "",
  note: "",
}

function copy(text: string) {
  if (typeof navigator !== "undefined" && navigator.clipboard) {
    navigator.clipboard.writeText(text)
    toast.success("تم النسخ")
  }
}

export default function KeysPage() {
  const [keys, setKeys] = useState<ApiKey[]>(mockKeys)

  const [query, setQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const [editing, setEditing] = useState<ApiKey | null>(null)
  const [editForm, setEditForm] = useState<ApiKey | null>(null)

  const [adding, setAdding] = useState(false)
  const [addForm, setAddForm] = useState({ ...emptyForm })

  // ── Trial Key state ──────────────────────────────────────────────────────────
  const [trialOpen, setTrialOpen] = useState(false)
  const [trialHours, setTrialHours] = useState<TrialHours>(24)
  const [trialName, setTrialName] = useState("")
  const [trialPhone, setTrialPhone] = useState("")
  const [trialCode, setTrialCode] = useState<string>(() => generateTrialCode())
  // ────────────────────────────────────────────────────────────────────────────

  const [confirmDelete, setConfirmDelete] = useState<ApiKey | null>(null)
  const [confirmReset, setConfirmReset] = useState<ApiKey | null>(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return keys.filter((k) => {
      const matchesQuery =
        !q ||
        k.code.toLowerCase().includes(q) ||
        k.subscriberName.toLowerCase().includes(q) ||
        k.phone.includes(q) ||
        k.lastIp.includes(q)
      const matchesStatus = statusFilter === "all" || k.status === statusFilter
      return matchesQuery && matchesStatus
    })
  }, [keys, query, statusFilter])

  function openEdit(k: ApiKey) {
    setEditing(k)
    setEditForm({ ...k })
  }

  function saveEdit() {
    if (!editForm) return
    if (!editForm.subscriberName.trim()) {
      toast.error("اسم المشترك مطلوب")
      return
    }
    // TODO BACKEND: PUT /api/keys/{id}
    setKeys((prev) =>
      prev.map((k) =>
        k.id === editForm.id
          ? {
              ...k,
              subscriberName: editForm.subscriberName.trim(),
              phone: editForm.phone.trim(),
              address: editForm.address.trim(),
              note: editForm.note,
              status: editForm.status,
              expireDate: editForm.expireDate,
              maxDevices: editForm.maxDevices,
            }
          : k,
      ),
    )
    toast.success("تم حفظ التعديلات")
    setEditing(null)
    setEditForm(null)
  }

  function addKey() {
    if (!addForm.code.trim()) {
      toast.error("أدخل كود التفعيل")
      return
    }
    if (!addForm.subscriberName.trim()) {
      toast.error("أدخل اسم المشترك")
      return
    }
    // TODO BACKEND: POST /api/keys
    const nextId = Math.max(0, ...keys.map((k) => k.id)) + 1
    const newKey: ApiKey = {
      ...addForm,
      id: nextId,
      deviceCount: 0,
      lastIp: "—",
      lastSeen: "لم يسجّل دخول بعد",
    }
    setKeys((prev) => [newKey, ...prev])
    toast.success("تم إنشاء المفتاح")
    setAdding(false)
    setAddForm({ ...emptyForm })
  }

  // ── Create Trial Key ─────────────────────────────────────────────────────────
  function openTrialDialog() {
    setTrialCode(generateTrialCode())
    setTrialHours(24)
    setTrialName("")
    setTrialPhone("")
    setTrialOpen(true)
  }

  function createTrialKey() {
    if (!trialName.trim()) {
      toast.error("أدخل اسم المشترك التجريبي")
      return
    }
    // TODO BACKEND: POST /api/keys/trial
    // body: { code, trialHours, subscriberName, phone }
    // Backend assigns expiry as (now + trialHours) and auto-expires the key
    const nextId = Math.max(0, ...keys.map((k) => k.id)) + 1
    const expiryLabel = `🧪 ينتهي ${formatTrialExpiry(trialHours)}`
    const newKey: ApiKey = {
      id: nextId,
      code: trialCode,
      status: "active",
      expireDate: expiryLabel,
      maxDevices: 1,
      deviceCount: 0,
      lastIp: "—",
      lastSeen: "لم يسجّل دخول بعد",
      subscriberName: trialName.trim(),
      phone: trialPhone.trim(),
      address: "—",
      note: `🧪 تجريبي ${trialHours}h`,
    }
    setKeys((prev) => [newKey, ...prev])
    copy(trialCode)
    toast.success(
      `✅ تم إنشاء مفتاح تجريبي لـ ${trialHours} ساعة — ${trialName.trim()} · الكود نُسخ تلقائياً`,
    )
    setTrialOpen(false)
  }
  // ────────────────────────────────────────────────────────────────────────────

  function deleteKey() {
    if (!confirmDelete) return
    // TODO BACKEND: DELETE /api/keys/{id}
    setKeys((prev) => prev.filter((k) => k.id !== confirmDelete.id))
    toast.success("تم حذف المفتاح")
    setConfirmDelete(null)
  }

  function resetDevices() {
    if (!confirmReset) return
    // TODO BACKEND: POST /api/keys/{id}/reset-devices
    setKeys((prev) =>
      prev.map((k) => (k.id === confirmReset.id ? { ...k, deviceCount: 0 } : k)),
    )
    toast.success("تم إعادة ضبط الأجهزة")
    setConfirmReset(null)
  }

  const counts = {
    all: keys.length,
    active: keys.filter((k) => k.status === "active").length,
    blocked: keys.filter((k) => k.status === "blocked").length,
    expired: keys.filter((k) => k.status === "expired").length,
  }

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title="المفاتيح"
        description="إدارة مفاتيح التفعيل والمشتركين"
        icon={<Key className="size-5 text-primary-foreground" />}
        actions={
          <div className="flex gap-2 flex-wrap">
            <Button
              variant="outline"
              onClick={openTrialDialog}
              className="border-amber-500/40 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 hover:text-amber-200 gap-1.5"
            >
              <FlaskConical className="size-4" />
              <span className="hidden sm:inline">مفتاح تجريبي</span>
              <span className="sm:hidden">تجريبي</span>
            </Button>
            <Button
              onClick={() => setAdding(true)}
              className="doom-gradient text-primary-foreground hover:opacity-90"
            >
              <Plus className="size-4 ml-1" />
              إضافة مفتاح
            </Button>
          </div>
        }
      />

      {/* Filters */}
      <Card className="border-border/60 bg-card/60">
        <CardContent className="p-3 sm:p-4 flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="ابحث بالاسم، الكود، الهاتف أو الـIP..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pr-10 h-10 bg-input/40"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-10 sm:w-[200px]">
                <SelectValue placeholder="الحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">كل الحالات ({counts.all})</SelectItem>
                <SelectItem value="active">فعّال ({counts.active})</SelectItem>
                <SelectItem value="blocked">محظور ({counts.blocked})</SelectItem>
                <SelectItem value="expired">منتهي الصلاحية ({counts.expired})</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
              فعّال: {counts.active}
            </span>
            <span className="px-2.5 py-1 rounded-full bg-destructive/15 text-destructive border border-destructive/30">
              محظور: {counts.blocked}
            </span>
            <span className="px-2.5 py-1 rounded-full bg-zinc-500/15 text-zinc-300 border border-zinc-500/30">
              منتهي الصلاحية: {counts.expired}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Keys list */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
          {filtered.map((k) => (
            <KeyCard
              key={k.id}
              apiKey={k}
              onCopy={copy}
              onEdit={openEdit}
              onReset={setConfirmReset}
              onDelete={setConfirmDelete}
            />
          ))}
        </div>
      ) : (
        <Empty className="border border-dashed border-border/60 bg-card/40 rounded-xl">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Key className="size-6" />
            </EmptyMedia>
            <EmptyTitle>لا توجد مفاتيح مطابقة</EmptyTitle>
            <EmptyDescription>جرّب تغيير الفلتر أو البحث، أو أضف مفتاحاً جديداً.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}

      {/* ========= TRIAL KEY DIALOG ========= */}
      <Dialog
        open={trialOpen}
        onOpenChange={(o) => {
          if (!o) setTrialOpen(false)
        }}
      >
        <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-lg max-h-[calc(100dvh-2rem)] overflow-y-auto p-0">
          {/* Amber header */}
          <div className="bg-amber-500/10 border-b border-amber-500/25 p-5 sm:p-6">
            <DialogHeader className="text-right">
              <div className="flex items-center gap-3">
                <div className="size-11 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center shrink-0">
                  <FlaskConical className="size-5 text-amber-300" />
                </div>
                <div className="min-w-0">
                  <DialogTitle className="text-amber-100 text-lg">مفتاح تجريبي بالساعات</DialogTitle>
                  <DialogDescription className="text-amber-300/80 text-xs">
                    ينتهي تلقائياً بعد المدة المحددة — Mock حالياً
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
          </div>

          <div className="p-5 sm:p-6 flex flex-col gap-5">

            {/* Hours picker */}
            <div className="flex flex-col gap-2.5">
              <Label className="text-xs font-bold flex items-center gap-1.5">
                <Clock className="size-3.5 text-amber-400" />
                مدة الصلاحية
              </Label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {trialHourOptions.map((h) => (
                  <button
                    key={h}
                    type="button"
                    onClick={() => setTrialHours(h)}
                    className={cn(
                      "rounded-xl border py-2.5 text-sm font-bold transition-all",
                      trialHours === h
                        ? "bg-amber-500/20 border-amber-500/60 text-amber-200 ring-1 ring-amber-500/40"
                        : "border-border/60 bg-muted/20 text-muted-foreground hover:border-amber-500/30 hover:text-amber-300",
                    )}
                  >
                    {h}h
                  </button>
                ))}
              </div>
              {/* Live expiry preview */}
              <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 flex items-center gap-2 text-xs text-amber-200">
                <Clock className="size-3.5 shrink-0" />
                <span>
                  ينتهي في:{" "}
                  <strong className="font-mono">{formatTrialExpiry(trialHours)}</strong>
                </span>
              </div>
            </div>

            {/* Subscriber info */}
            <div className="flex flex-col gap-3">
              <h4 className="text-xs font-bold text-muted-foreground flex items-center gap-1.5 uppercase tracking-wider">
                <User className="size-3.5" />
                بيانات المشترك
              </h4>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="trial-name" className="text-xs">
                  اسم المشترك <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="trial-name"
                  value={trialName}
                  onChange={(e) => setTrialName(e.target.value)}
                  placeholder="مثال: أحمد العبادي"
                  className="h-10"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="trial-phone" className="text-xs">
                  رقم الهاتف (اختياري)
                </Label>
                <div className="relative">
                  <Phone className="absolute right-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                  <Input
                    id="trial-phone"
                    value={trialPhone}
                    onChange={(e) => setTrialPhone(e.target.value)}
                    placeholder="+9647..."
                    className="h-10 pr-9 font-mono"
                    dir="ltr"
                  />
                </div>
              </div>
            </div>

            {/* Auto-generated code preview */}
            <div className="flex flex-col gap-2">
              <Label className="text-xs font-bold flex items-center gap-1.5">
                <Key className="size-3.5" />
                الكود المُولَّد تلقائياً
              </Label>
              <div className="flex items-center gap-2 rounded-xl border border-amber-500/30 bg-muted/30 px-3 py-2.5">
                <code className="font-mono text-sm flex-1 truncate text-amber-200" dir="ltr">
                  {trialCode}
                </code>
                <div className="flex gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => copy(trialCode)}
                    className="text-muted-foreground hover:text-amber-300 transition-colors p-1 rounded"
                    aria-label="نسخ الكود"
                    title="نسخ"
                  >
                    <Copy className="size-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setTrialCode(generateTrialCode())
                      toast.info("تم توليد كود تجريبي جديد")
                    }}
                    className="text-muted-foreground hover:text-amber-300 transition-colors p-1 rounded"
                    aria-label="توليد كود جديد"
                    title="توليد كود جديد"
                  >
                    <FlaskConical className="size-3.5" />
                  </button>
                </div>
              </div>
              <p className="text-[11px] text-muted-foreground">
                سيُنسخ الكود تلقائياً للحافظة عند الإنشاء
              </p>
            </div>

            {/* TODO BACKEND note */}
            <div className="rounded-lg border border-border/50 bg-muted/20 p-3 text-xs text-muted-foreground flex items-start gap-2">
              <ShieldAlert className="size-4 shrink-0 mt-0.5 text-amber-400" />
              <p className="leading-relaxed">
                <strong className="text-amber-300">TODO BACKEND:</strong> يجب أن يُسجّل السيرفر{" "}
                <code dir="ltr" className="text-[11px] bg-muted/60 px-1 rounded">
                  POST /api/keys/trial
                </code>{" "}
                وقت الإنشاء ويُبطل المفتاح تلقائياً بعد{" "}
                <strong>{trialHours}</strong> ساعة عبر Cron Job أو TTL.
              </p>
            </div>
          </div>

          <DialogFooter className="px-5 pb-5 sm:px-6 sm:pb-6 flex-row gap-2">
            <Button
              onClick={createTrialKey}
              className="bg-amber-500/20 border border-amber-500/50 text-amber-200 hover:bg-amber-500/30 flex-1 sm:flex-initial gap-1.5"
            >
              <FlaskConical className="size-4" />
              إنشاء المفتاح التجريبي
            </Button>
            <Button
              variant="outline"
              onClick={() => setTrialOpen(false)}
              className="flex-1 sm:flex-initial"
            >
              إلغاء
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ========= EDIT KEY DIALOG ========= */}
      <Dialog
        open={!!editing}
        onOpenChange={(o) => {
          if (!o) {
            setEditing(null)
            setEditForm(null)
          }
        }}
      >
        <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-xl max-h-[calc(100dvh-2rem)] overflow-y-auto p-0">
          <div className="doom-gradient p-5 sm:p-6">
            <DialogHeader className="text-right">
              <div className="flex items-center gap-3">
                <div className="size-11 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center shrink-0">
                  <Key className="size-5 text-white" />
                </div>
                <div className="min-w-0">
                  <DialogTitle className="text-white text-lg">تعديل المفتاح</DialogTitle>
                  <DialogDescription className="text-white/85 text-xs">
                    عدّل بيانات المشترك والصلاحيات. الحقول الحساسة للقراءة فقط.
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
          </div>

          {editForm && (
            <div className="p-5 sm:p-6 flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs text-muted-foreground">كود التفعيل (للقراءة فقط)</Label>
                <div className="flex items-center gap-2 rounded-lg border border-border/60 bg-muted/30 px-3 py-2.5">
                  <Key className="size-4 text-muted-foreground shrink-0" />
                  <code className="text-sm font-mono flex-1 truncate" dir="ltr">
                    {editForm.code}
                  </code>
                  <button
                    type="button"
                    onClick={() => copy(editForm.code)}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="نسخ"
                  >
                    <Copy className="size-3.5" />
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <h4 className="text-xs font-bold text-muted-foreground flex items-center gap-1.5 uppercase tracking-wider">
                  <User className="size-3.5" />
                  بيانات المشترك
                </h4>
                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs">اسم المشترك</Label>
                  <Input
                    value={editForm.subscriberName}
                    onChange={(e) =>
                      setEditForm({ ...editForm, subscriberName: e.target.value })
                    }
                    placeholder="مثال: أحمد العبادي"
                    className="h-10"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-xs">رقم الهاتف</Label>
                    <Input
                      value={editForm.phone}
                      onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                      placeholder="+9647..."
                      className="h-10 font-mono"
                      dir="ltr"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-xs">العنوان</Label>
                    <Input
                      value={editForm.address}
                      onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                      placeholder="المدينة - المنطقة"
                      className="h-10"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <h4 className="text-xs font-bold text-muted-foreground flex items-center gap-1.5 uppercase tracking-wider">
                  <ShieldAlert className="size-3.5" />
                  بيانات الاشتراك
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-xs">الحالة</Label>
                    <Select
                      value={editForm.status}
                      onValueChange={(v) =>
                        setEditForm({ ...editForm, status: v as ApiKey["status"] })
                      }
                    >
                      <SelectTrigger className="h-10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">فعّال</SelectItem>
                        <SelectItem value="blocked">محظور</SelectItem>
                        <SelectItem value="expired">منتهي الصلاحية</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-xs">الصلاحية</Label>
                    <Select
                      value={editForm.expireDate}
                      onValueChange={(v) => setEditForm({ ...editForm, expireDate: v })}
                    >
                      <SelectTrigger className="h-10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {expireOptions.map((o) => (
                          <SelectItem key={o} value={o}>
                            {o}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-xs">الحد الأقصى للأجهزة</Label>
                    <Input
                      type="number"
                      min={1}
                      value={editForm.maxDevices}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          maxDevices: Number(e.target.value) || 1,
                        })
                      }
                      className="h-10"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-xs text-muted-foreground">
                      الأجهزة المسجلة (للقراءة فقط)
                    </Label>
                    <div className="h-10 rounded-md border border-border/60 bg-muted/30 px-3 flex items-center justify-between">
                      <span className="text-sm font-mono tabular-nums">
                        {editForm.deviceCount}
                      </span>
                      <span className="text-[10px] text-muted-foreground">يُحدّث من الباك إند</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-border/60 bg-muted/20 p-3">
                <p className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground/80 mb-2 flex items-center gap-1.5">
                  <ShieldAlert className="size-3" />
                  بيانات النظام (للقراءة فقط)
                </p>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="flex items-start gap-2">
                    <Globe className="size-3.5 text-muted-foreground shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <p className="text-muted-foreground mb-0.5">آخر IP</p>
                      <p className="font-mono truncate" dir="ltr">{editForm.lastIp}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="size-3.5 text-muted-foreground shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <p className="text-muted-foreground mb-0.5">آخر اتصال</p>
                      <p className="truncate">{editForm.lastSeen}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label className="text-xs">ملاحظة (اختيارية)</Label>
                <Textarea
                  value={editForm.note ?? ""}
                  onChange={(e) => setEditForm({ ...editForm, note: e.target.value })}
                  placeholder="مثال: عميل مميز / VIP"
                  rows={2}
                  className="resize-none"
                />
              </div>

              <div className="flex items-start gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-200">
                <ShieldAlert className="size-4 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  أي تعديل على الحالة قد يؤثر على المشترك فوراً عند الربط بالسيرفر.
                </p>
              </div>
            </div>
          )}

          <DialogFooter className="px-5 pb-5 sm:px-6 sm:pb-6 flex-row gap-2">
            <Button
              onClick={saveEdit}
              className="doom-gradient text-primary-foreground hover:opacity-90 flex-1 sm:flex-initial"
            >
              <Check className="size-4 ml-1" />
              حفظ التعديلات
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setEditing(null)
                setEditForm(null)
              }}
              className="flex-1 sm:flex-initial"
            >
              إلغاء
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ========= ADD KEY DIALOG ========= */}
      <Dialog
        open={adding}
        onOpenChange={(o) => {
          if (!o) {
            setAdding(false)
            setAddForm({ ...emptyForm })
          }
        }}
      >
        <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-xl max-h-[calc(100dvh-2rem)] overflow-y-auto p-0">
          <div className="doom-gradient p-5 sm:p-6">
            <DialogHeader className="text-right">
              <div className="flex items-center gap-3">
                <div className="size-11 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center shrink-0">
                  <Plus className="size-5 text-white" />
                </div>
                <div className="min-w-0">
                  <DialogTitle className="text-white text-lg">إضافة مفتاح جديد</DialogTitle>
                  <DialogDescription className="text-white/85 text-xs">
                    أدخل بيانات المشترك وكود التفعيل
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
          </div>

          <div className="p-5 sm:p-6 flex flex-col gap-5">
            <div className="flex flex-col gap-3">
              <h4 className="text-xs font-bold text-muted-foreground flex items-center gap-1.5 uppercase tracking-wider">
                <User className="size-3.5" />
                بيانات المشترك
              </h4>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="add-name" className="text-xs">
                  اسم المشترك <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="add-name"
                  value={addForm.subscriberName}
                  onChange={(e) => setAddForm({ ...addForm, subscriberName: e.target.value })}
                  placeholder="مثال: أحمد العبادي"
                  className="h-10"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="add-phone" className="text-xs">رقم الهاتف</Label>
                  <div className="relative">
                    <Phone className="absolute right-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                    <Input
                      id="add-phone"
                      value={addForm.phone}
                      onChange={(e) => setAddForm({ ...addForm, phone: e.target.value })}
                      placeholder="+9647..."
                      className="h-10 pr-9 font-mono"
                      dir="ltr"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="add-address" className="text-xs">العنوان</Label>
                  <div className="relative">
                    <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                    <Input
                      id="add-address"
                      value={addForm.address}
                      onChange={(e) => setAddForm({ ...addForm, address: e.target.value })}
                      placeholder="المدينة - المنطقة"
                      className="h-10 pr-9"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <h4 className="text-xs font-bold text-muted-foreground flex items-center gap-1.5 uppercase tracking-wider">
                <Key className="size-3.5" />
                بيانات الاشتراك
              </h4>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="add-code" className="text-xs">
                  كود التفعيل <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="add-code"
                  value={addForm.code}
                  onChange={(e) => setAddForm({ ...addForm, code: e.target.value })}
                  placeholder="DOOM-XXXX-XXXX-XXXX"
                  className="h-10 font-mono"
                  dir="ltr"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs">الصلاحية</Label>
                  <Select
                    value={addForm.expireDate}
                    onValueChange={(v) => setAddForm({ ...addForm, expireDate: v })}
                  >
                    <SelectTrigger className="h-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {expireOptions.map((o) => (
                        <SelectItem key={o} value={o}>
                          {o}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs">الحد الأقصى للأجهزة</Label>
                  <Input
                    type="number"
                    min={1}
                    value={addForm.maxDevices}
                    onChange={(e) =>
                      setAddForm({ ...addForm, maxDevices: Number(e.target.value) || 1 })
                    }
                    className="h-10"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs">ملاحظة (اختيارية)</Label>
                <Textarea
                  value={addForm.note ?? ""}
                  onChange={(e) => setAddForm({ ...addForm, note: e.target.value })}
                  placeholder="مثال: عميل مميز"
                  rows={2}
                  className="resize-none"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="px-5 pb-5 sm:px-6 sm:pb-6 flex-row gap-2">
            <Button
              onClick={addKey}
              className="doom-gradient text-primary-foreground hover:opacity-90 flex-1 sm:flex-initial"
            >
              <Plus className="size-4 ml-1" />
              إنشاء المفتاح
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setAdding(false)
                setAddForm({ ...emptyForm })
              }}
              className="flex-1 sm:flex-initial"
            >
              إلغاء
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!confirmDelete}
        onOpenChange={(o) => !o && setConfirmDelete(null)}
        title="حذف المفتاح"
        description={
          <>
            سيتم حذف مفتاح المشترك <strong>{confirmDelete?.subscriberName}</strong> (
            <span className={cn("font-mono")}>{confirmDelete?.code}</span>) نهائياً. هذا الإجراء غير
            قابل للتراجع.
          </>
        }
        confirmLabel="نعم، حذف"
        destructive
        onConfirm={deleteKey}
      />

      <ConfirmDialog
        open={!!confirmReset}
        onOpenChange={(o) => !o && setConfirmReset(null)}
        title="إعادة ضبط الأجهزة"
        description="سيتم إخراج جميع الأجهزة المسجلة على هذا المفتاح. سيحتاج المشترك لإعادة التفعيل."
        confirmLabel="نعم، متابعة"
        onConfirm={resetDevices}
      />
    </div>
  )
}
