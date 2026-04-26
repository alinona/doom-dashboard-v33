"use client"

// ============================================================
// Settings page — UI form fields are local state only.
// The admin password lives inside an Advanced section and requires
// confirmation before any save. Server address/port are READ ONLY.
// All saves are Mock + Toast. Persistence belongs to the backend.
// ============================================================

import { useState } from "react"
import {
  Bell,
  ChevronDown,
  Lock,
  Save,
  Server,
  Settings as SettingsIcon,
  ShieldAlert,
} from "lucide-react"
import { toast } from "sonner"
import { PageHeader } from "@/components/dashboard/page-header"
import { ConfirmDialog } from "@/components/dashboard/confirm-dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

interface SettingsSectionProps {
  icon: React.ElementType
  title: string
  description: string
  children: React.ReactNode
}

function SettingsSection({
  icon: Icon,
  title,
  description,
  children,
}: SettingsSectionProps) {
  return (
    <Card className="border-border/60 bg-card/60 doom-hairline">
      <CardContent className="p-5">
        <div className="flex items-start gap-3 mb-5 pb-4 border-b border-border/40">
          <div className="size-10 rounded-xl doom-gradient flex items-center justify-center shrink-0">
            <Icon className="size-5 text-primary-foreground" />
          </div>
          <div className="min-w-0">
            <h3 className="font-bold">{title}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
          </div>
        </div>
        {children}
      </CardContent>
    </Card>
  )
}

export default function SettingsPage() {
  const [logLevel, setLogLevel] = useState("info")
  const [goldLock, setGoldLock] = useState(true)
  const [notifyErrors, setNotifyErrors] = useState(true)
  const [notifyLogins, setNotifyLogins] = useState(false)
  const [autoBackup, setAutoBackup] = useState(true)

  // Advanced (sensitive) — admin password
  const [advancedOpen, setAdvancedOpen] = useState(false)
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [confirmPwdChange, setConfirmPwdChange] = useState(false)

  function saveSettings() {
    // TODO BACKEND: PUT /api/settings
    // body: { logLevel, goldLock, notifyErrors, notifyLogins, autoBackup }
    // The admin password is NEVER sent through this endpoint.
    toast.success("تم حفظ الإعدادات بنجاح (Mock — يحتاج Backend)")
  }

  function toggleGoldLock(v: boolean) {
    setGoldLock(v)
    toast.success(v ? "تم تفعيل قفل Gold State" : "تم إلغاء قفل Gold State")
  }

  function toggleNotifyErrors(v: boolean) {
    setNotifyErrors(v)
    toast.success(v ? "تم تفعيل إشعارات الأخطاء" : "تم إيقاف إشعارات الأخطاء")
  }

  function toggleNotifyLogins(v: boolean) {
    setNotifyLogins(v)
    toast.success(v ? "تم تفعيل إشعارات تسجيل الدخول" : "تم إيقاف إشعارات تسجيل الدخول")
  }

  function toggleAutoBackup(v: boolean) {
    setAutoBackup(v)
    toast.success(v ? "تم تفعيل النسخ الاحتياطي التلقائي" : "تم إيقاف النسخ الاحتياطي التلقائي")
  }

  function validatePassword(): boolean {
    if (!newPassword || newPassword.length < 8) {
      toast.error("كلمة المرور قصيرة جداً (8 أحرف على الأقل)")
      return false
    }
    if (newPassword !== confirmPassword) {
      toast.error("كلمتا المرور غير متطابقتين")
      return false
    }
    return true
  }

  function startPasswordChange() {
    if (!validatePassword()) return
    setConfirmPwdChange(true)
  }

  function applyPasswordChange() {
    // TODO BACKEND: POST /api/admin/change-password
    // body: { newPassword } — sent over HTTPS to a dedicated endpoint.
    toast.success("تم إرسال طلب تغيير كلمة المرور (Mock — يحتاج Backend)")
    setNewPassword("")
    setConfirmPassword("")
    setAdvancedOpen(false)
    setConfirmPwdChange(false)
  }

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title="الإعدادات"
        description="إعدادات السيرفر العامة والأمان"
        icon={<SettingsIcon className="size-5 text-primary-foreground" />}
      />

      {/* Server settings — host & port READ ONLY (system fields) */}
      <SettingsSection
        icon={Server}
        title="إعدادات السيرفر"
        description="عنوان السيرفر ومستوى السجلات"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-muted-foreground">عنوان السيرفر (للقراءة فقط)</Label>
            <Input value="13.50.223.154" readOnly className="font-mono bg-muted/30" dir="ltr" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-muted-foreground">المنفذ (للقراءة فقط)</Label>
            <Input value="8888" readOnly className="font-mono bg-muted/30" dir="ltr" />
          </div>
          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <Label className="text-xs">مستوى السجلات</Label>
            <Select value={logLevel} onValueChange={setLogLevel}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="debug">Debug — أكبر قدر من التفاصيل</SelectItem>
                <SelectItem value="info">Info — افتراضي</SelectItem>
                <SelectItem value="warn">Warning — التحذيرات فقط</SelectItem>
                <SelectItem value="error">Error — الأخطاء فقط</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </SettingsSection>

      {/* Security — Gold State only. Password is gated in Advanced section below. */}
      <SettingsSection
        icon={Lock}
        title="الأمان"
        description="قفل Gold State لحماية الإجراءات الخطيرة"
      >
        <div className="flex items-center justify-between gap-3 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3">
          <div className="flex items-start gap-2 min-w-0">
            <ShieldAlert className="size-4 text-amber-300 shrink-0 mt-0.5" />
            <div className="min-w-0">
              <p className="font-medium text-sm">قفل Gold State</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                يمنع تنفيذ الإجراءات الخطيرة بدون تأكيد إضافي.
              </p>
            </div>
          </div>
          <Switch checked={goldLock} onCheckedChange={toggleGoldLock} />
        </div>
      </SettingsSection>

      {/* Notifications */}
      <SettingsSection
        icon={Bell}
        title="الإشعارات"
        description="تحكّم بالأحداث التي تستدعي تنبيهاً"
      >
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-3 rounded-lg border border-border/60 bg-muted/20 p-3">
            <div className="min-w-0">
              <p className="font-medium text-sm">إشعار عند الأخطاء</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                إرسال تنبيه فوري عند حدوث خطأ في السيرفر.
              </p>
            </div>
            <Switch checked={notifyErrors} onCheckedChange={toggleNotifyErrors} />
          </div>
          <div className="flex items-center justify-between gap-3 rounded-lg border border-border/60 bg-muted/20 p-3">
            <div className="min-w-0">
              <p className="font-medium text-sm">إشعار عند تسجيل دخول جديد</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                تنبيه عند ربط جهاز جديد بأي مفتاح.
              </p>
            </div>
            <Switch checked={notifyLogins} onCheckedChange={toggleNotifyLogins} />
          </div>
          <div className="flex items-center justify-between gap-3 rounded-lg border border-border/60 bg-muted/20 p-3">
            <div className="min-w-0">
              <p className="font-medium text-sm">نسخ احتياطي تلقائي يومي</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                إنشاء نسخة احتياطية تلقائية كل يوم في الـ 03:00 صباحاً.
              </p>
            </div>
            <Switch checked={autoBackup} onCheckedChange={toggleAutoBackup} />
          </div>
        </div>
      </SettingsSection>

      <Button
        onClick={saveSettings}
        className="doom-gradient text-primary-foreground hover:opacity-90 self-start"
      >
        <Save className="size-4 ml-1" />
        حفظ الإعدادات
      </Button>

      {/* ============================================================
          ADVANCED — admin password rotation (sensitive).
          Hidden by default. Requires double confirmation before save.
          ============================================================ */}
      <Card className="border-amber-500/25 bg-amber-500/[0.04]">
        <CardContent className="p-0">
          <Collapsible open={advancedOpen} onOpenChange={setAdvancedOpen}>
            <CollapsibleTrigger asChild>
              <button
                type="button"
                className="w-full flex items-center justify-between gap-3 p-4 sm:p-5 text-right hover:bg-amber-500/[0.04] transition-colors rounded-xl"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="size-9 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shrink-0">
                    <ShieldAlert className="size-4 text-amber-300" />
                  </div>
                  <div className="min-w-0 text-right">
                    <p className="font-bold text-sm">إعدادات متقدمة</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      تغيير كلمة مرور المسؤول — حقل حساس مخفي افتراضياً
                    </p>
                  </div>
                </div>
                <ChevronDown
                  className={`size-4 text-muted-foreground shrink-0 transition-transform ${
                    advancedOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
            </CollapsibleTrigger>

            <CollapsibleContent>
              <div className="border-t border-amber-500/20 p-4 sm:p-5 flex flex-col gap-4">
                <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive flex items-start gap-2">
                  <ShieldAlert className="size-4 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    تغيير كلمة مرور المسؤول يُسجّل خروج جميع الجلسات النشطة. تأكد من حفظ كلمة
                    المرور الجديدة في مكان آمن.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="new-pwd" className="text-xs">
                      كلمة مرور جديدة
                    </Label>
                    <Input
                      id="new-pwd"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      autoComplete="new-password"
                      dir="ltr"
                      className="font-mono"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="confirm-pwd" className="text-xs">
                      تأكيد كلمة المرور
                    </Label>
                    <Input
                      id="confirm-pwd"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      autoComplete="new-password"
                      dir="ltr"
                      className="font-mono"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  <Button
                    onClick={startPasswordChange}
                    className="doom-gradient text-primary-foreground hover:opacity-90"
                    disabled={!newPassword || !confirmPassword}
                  >
                    <Lock className="size-4 ml-1" />
                    تغيير كلمة المرور
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setNewPassword("")
                      setConfirmPassword("")
                      setAdvancedOpen(false)
                    }}
                  >
                    إلغاء
                  </Button>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </CardContent>
      </Card>

      <ConfirmDialog
        open={confirmPwdChange}
        onOpenChange={setConfirmPwdChange}
        title="تأكيد تغيير كلمة المرور"
        description="سيُسجَّل خروج جميع الجلسات النشطة فور التغيير. هل أنت متأكد؟"
        confirmLabel="نعم، تغيير"
        destructive
        onConfirm={applyPasswordChange}
      />
    </div>
  )
}
