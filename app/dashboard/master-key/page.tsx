"use client"

// ============================================================
// Master Key page — READ-ONLY by default.
// The full key is NEVER displayed in the UI (always masked).
// Changing the key is gated behind an Advanced section + double confirm.
// All actions are Mock + Toast; real rotation belongs to the backend.
// ============================================================

import { useState } from "react"
import {
  CheckCircle2,
  ChevronDown,
  KeyRound,
  Lock,
  RefreshCw,
  ShieldAlert,
} from "lucide-react"
import { toast } from "sonner"
import { PageHeader } from "@/components/dashboard/page-header"
import { ConfirmDialog } from "@/components/dashboard/confirm-dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Badge } from "@/components/ui/badge"

// Sensitive: master key is only displayed as a 4-char tail mask.
// The real value never reaches the client UI.
const MASTER_KEY_MASK = "•••• •••• •••• 1234"

export default function MasterKeyPage() {
  const [advancedOpen, setAdvancedOpen] = useState(false)
  const [newKey, setNewKey] = useState("")
  const [confirmNewKey, setConfirmNewKey] = useState("")
  const [confirmChange, setConfirmChange] = useState(false)
  const [lastTest, setLastTest] = useState("ناجح — قبل ساعة")
  const [testing, setTesting] = useState(false)

  function runTest() {
    setTesting(true)
    // TODO BACKEND: POST /api/master-key/test
    setTimeout(() => {
      setLastTest("ناجح — الآن")
      toast.success("تم اختبار المفتاح الأساسي بنجاح (Mock)")
      setTesting(false)
    }, 900)
  }

  function startChange() {
    if (!newKey || newKey.length < 6) {
      toast.error("المفتاح الجديد قصير جداً (6 أحرف على الأقل)")
      return
    }
    if (newKey !== confirmNewKey) {
      toast.error("المفتاحان غير متطابقين")
      return
    }
    setConfirmChange(true)
  }

  function applyChange() {
    // TODO BACKEND: POST /api/master-key/rotate
    // body: { newKey } — sent over HTTPS, never logged.
    toast.success("تم إرسال طلب تغيير المفتاح (Mock — يحتاج Backend)")
    setNewKey("")
    setConfirmNewKey("")
    setConfirmChange(false)
    setAdvancedOpen(false)
  }

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title="المفتاح الأساسي"
        description="إدارة Master Key الذي يعتمد عليه النظام"
        icon={<KeyRound className="size-5 text-primary-foreground" />}
      />

      {/* Status overview */}
      <Card className="border-border/60 bg-card/60 doom-hairline">
        <CardContent className="p-5 flex flex-col gap-5">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div>
              <p className="text-xs text-muted-foreground mb-1">الحالة</p>
              <Badge className="bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                <CheckCircle2 className="size-3 ml-1" />
                يعمل بشكل صحيح
              </Badge>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground mb-1">آخر اختبار</p>
              <p className="text-sm">{lastTest}</p>
            </div>
          </div>

          {/* Masked display — never reveals the full key */}
          <div className="rounded-xl border border-border/60 bg-muted/20 p-4">
            <div className="flex items-center justify-between gap-3 mb-2">
              <p className="text-xs text-muted-foreground">المفتاح الحالي</p>
              <Badge
                variant="outline"
                className="text-[10px] border-border/60 bg-background/40"
              >
                <Lock className="size-2.5 ml-1" />
                مقنّع
              </Badge>
            </div>
            <code
              className="font-mono text-lg block tracking-widest text-foreground/90 select-none"
              dir="ltr"
              aria-label="المفتاح الأساسي مقنّع"
            >
              {MASTER_KEY_MASK}
            </code>
            <p className="text-[11px] text-muted-foreground mt-2 leading-relaxed">
              لأمانك، لا يتم عرض المفتاح كاملاً في الواجهة على الإطلاق. لتدوير المفتاح، استخدم
              قسم &quot;الإعدادات المتقدمة&quot; أدناه.
            </p>
          </div>

          {/* Safe action: test */}
          <div>
            <Button onClick={runTest} disabled={testing} variant="outline">
              <RefreshCw className={testing ? "size-4 ml-1 animate-spin" : "size-4 ml-1"} />
              اختبار المفتاح
            </Button>
          </div>

          <div className="flex items-start gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-200">
            <ShieldAlert className="size-4 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              تغيير المفتاح الأساسي قد يوقف الخدمة مؤقتاً إذا كان غير صحيح. تأكد من حفظ نسخة
              احتياطية قبل المتابعة.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Advanced — gated dangerous action */}
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
                      تغيير المفتاح الأساسي — إجراء حساس يحتاج تأكيداً مزدوجاً
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
                    تدوير المفتاح إجراء غير قابل للتراجع. أنشئ نسخة احتياطية أولاً.
                  </p>
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="new-mk" className="text-xs">
                    المفتاح الجديد
                  </Label>
                  <Input
                    id="new-mk"
                    type="password"
                    value={newKey}
                    onChange={(e) => setNewKey(e.target.value)}
                    className="h-10 font-mono"
                    placeholder="••••••••"
                    dir="ltr"
                    autoComplete="new-password"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="confirm-mk" className="text-xs">
                    تأكيد المفتاح الجديد
                  </Label>
                  <Input
                    id="confirm-mk"
                    type="password"
                    value={confirmNewKey}
                    onChange={(e) => setConfirmNewKey(e.target.value)}
                    className="h-10 font-mono"
                    placeholder="••••••••"
                    dir="ltr"
                    autoComplete="new-password"
                  />
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  <Button
                    onClick={startChange}
                    className="doom-gradient text-primary-foreground hover:opacity-90"
                    disabled={!newKey || !confirmNewKey}
                  >
                    <KeyRound className="size-4 ml-1" />
                    تدوير المفتاح
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setNewKey("")
                      setConfirmNewKey("")
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
        open={confirmChange}
        onOpenChange={setConfirmChange}
        title="تأكيد تغيير المفتاح الأساسي"
        description="بعد التغيير، يجب أن يستخدم النظام المفتاح الجديد. هذا الإجراء غير قابل للتراجع — هل أنت متأكد؟"
        confirmLabel="نعم، تغيير"
        destructive
        onConfirm={applyChange}
      />
    </div>
  )
}
