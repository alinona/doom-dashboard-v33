"use client"

import { useState } from "react"
import { Save, Wrench } from "lucide-react"
import { toast } from "sonner"
import { PageHeader } from "@/components/dashboard/page-header"
import { ConfirmDialog } from "@/components/dashboard/confirm-dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

const presets = [
  "الخدمة متوقفة مؤقتاً للصيانة",
  "القناة غير متاحة حالياً",
  "اشتراكك منتهي",
  "حسابك موقوف مؤقتاً",
]

// Local UI state only — actual maintenance toggle and message
// persistence belong to the backend. Visual state is for preview.
export default function MaintenancePage() {
  const [enabled, setEnabled] = useState(false)
  const [confirmEnable, setConfirmEnable] = useState(false)
  const [message, setMessage] = useState(presets[0])

  function applyEnable() {
    // TODO BACKEND: POST /api/maintenance/enable
    setEnabled(true)
    toast.success("تم إرسال طلب تفعيل الصيانة (Mock — يحتاج Backend)")
    setConfirmEnable(false)
  }

  function toggle(v: boolean) {
    if (v) {
      setConfirmEnable(true)
    } else {
      // TODO BACKEND: POST /api/maintenance/disable
      setEnabled(false)
      toast.success("تم إرسال طلب إلغاء الصيانة (Mock — يحتاج Backend)")
    }
  }

  function saveMessage() {
    // TODO BACKEND: PUT /api/maintenance/message  body: { message }
    toast.success("تم إرسال طلب حفظ الرسالة (Mock — يحتاج Backend)")
  }

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title="الصيانة"
        description="تفعيل وضع الصيانة وإدارة رسائل المستخدم داخل التطبيق"
        icon={<Wrench className="size-5 text-primary-foreground" />}
      />

      <Card className="border-border/60 bg-card/60">
        <CardContent className="p-5 flex items-center justify-between gap-3 flex-wrap">
          <div>
            <p className="font-medium">وضع الصيانة</p>
            <p className="text-xs text-muted-foreground mt-1">
              عند التفعيل، يوقف تسجيل الدخول والبث للمستخدمين الجدد.
            </p>
          </div>
          <div className="flex items-center gap-3">
            {enabled ? (
              <Badge className="bg-amber-500/15 text-amber-300 border border-amber-500/30">مفعّل</Badge>
            ) : (
              <Badge className="bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                معطّل
              </Badge>
            )}
            <Switch checked={enabled} onCheckedChange={toggle} />
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/60 bg-card/60">
        <CardContent className="p-5 flex flex-col gap-4">
          <div>
            <h3 className="font-medium">رسائل المستخدم داخل التطبيق</h3>
            <p className="text-xs text-muted-foreground mt-1">
              تظهر للمستخدم كـ Popup وتختفي تلقائياً.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {presets.map((p) => (
              <Button
                key={p}
                variant="outline"
                size="sm"
                onClick={() => {
                  setMessage(p)
                  toast.info(`تم اختيار الرسالة: "${p}"`)
                }}
                className="text-xs"
              >
                {p}
              </Button>
            ))}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="msg">نص الرسالة</Label>
            <Textarea
              id="msg"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              className="resize-none"
            />
          </div>

          <div className="rounded-lg border border-border/60 bg-background/40 p-4">
            <p className="text-[11px] text-muted-foreground mb-2">معاينة Popup</p>
            <div className="rounded-xl doom-gradient p-4 text-center">
              <p className="text-white font-medium text-balance">{message}</p>
            </div>
          </div>

          <Button
            onClick={saveMessage}
            className="doom-gradient text-primary-foreground hover:opacity-90 self-start"
          >
            <Save className="size-4 ml-1" />
            حفظ
          </Button>
        </CardContent>
      </Card>

      <ConfirmDialog
        open={confirmEnable}
        onOpenChange={setConfirmEnable}
        title="تفعيل وضع الصيانة"
        description="سيؤدي ذلك إلى إيقاف تسجيل الدخول والبث للمستخدمين. هل تريد المتابعة؟"
        confirmLabel="نعم، تفعيل"
        onConfirm={applyEnable}
      />
    </div>
  )
}
