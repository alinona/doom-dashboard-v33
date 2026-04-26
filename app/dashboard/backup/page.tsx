"use client"

import { useState } from "react"
import {
  Download,
  HardDriveDownload,
  Plus,
  RotateCcw,
  Star,
  Trash2,
  FileArchive,
} from "lucide-react"
import { toast } from "sonner"
import { PageHeader } from "@/components/dashboard/page-header"
import { ConfirmDialog } from "@/components/dashboard/confirm-dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { mockBackups, type Backup } from "@/lib/mock-data"

// Source of truth: `mockBackups` from data.js. `backups` is an optimistic UI
// copy so the admin sees instant feedback when creating/deleting a snapshot.
// Real archive creation and restore happen on the backend.
export default function BackupPage() {
  const [backups, setBackups] = useState<Backup[]>(mockBackups)
  const [confirmRestore, setConfirmRestore] = useState<Backup | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<Backup | null>(null)

  function createBackup() {
    // TODO BACKEND: POST /api/backups  → backend returns new backup metadata
    const nextId = Math.max(0, ...backups.map((b) => b.id)) + 1
    const newBackup: Backup = {
      id: nextId,
      name: `backup_routine_${nextId}.tar.gz`,
      size: "4.0 MB",
      date: "الآن",
      recommended: false,
    }
    setBackups((prev) => [newBackup, ...prev])
    toast.success("تم إنشاء نسخة احتياطية")
  }

  function applyRestore() {
    if (!confirmRestore) return
    // TODO BACKEND: POST /api/backups/{id}/restore
    toast.success(`تم استعادة ${confirmRestore.name}`)
    setConfirmRestore(null)
  }

  function applyDelete() {
    if (!confirmDelete) return
    // TODO BACKEND: DELETE /api/backups/{id}
    setBackups((prev) => prev.filter((b) => b.id !== confirmDelete.id))
    toast.success("تم حذف النسخة الاحتياطية")
    setConfirmDelete(null)
  }

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title="النسخ الاحتياطي"
        description="إدارة النسخ الاحتياطية واستعادتها"
        icon={<HardDriveDownload className="size-5 text-primary-foreground" />}
        actions={
          <Button
            onClick={createBackup}
            className="doom-gradient text-primary-foreground hover:opacity-90"
          >
            <Plus className="size-4 ml-1" />
            إنشاء نسخة
          </Button>
        }
      />

      {/* Quick info banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="border-border/60 bg-card/60">
          <CardContent className="p-3 sm:p-4">
            <p className="text-xs text-muted-foreground">إجمالي النسخ</p>
            <p className="text-2xl font-extrabold mt-1">{backups.length}</p>
          </CardContent>
        </Card>
        <Card className="border-border/60 bg-card/60">
          <CardContent className="p-3 sm:p-4">
            <p className="text-xs text-muted-foreground">نسخ موصى بها</p>
            <p className="text-2xl font-extrabold mt-1 text-amber-300">
              {backups.filter((b) => b.recommended).length}
            </p>
          </CardContent>
        </Card>
        <Card className="border-border/60 bg-card/60">
          <CardContent className="p-3 sm:p-4">
            <p className="text-xs text-muted-foreground">آخر نسخة</p>
            <p className="text-sm font-bold mt-1 truncate">{backups[0]?.date ?? "—"}</p>
          </CardContent>
        </Card>
        <Card className="border-border/60 bg-card/60">
          <CardContent className="p-3 sm:p-4">
            <p className="text-xs text-muted-foreground">إجمالي الحجم</p>
            <p className="text-sm font-bold mt-1">~12 MB</p>
          </CardContent>
        </Card>
      </div>

      {backups.length > 0 ? (
        <ul className="flex flex-col gap-3">
          {backups.map((b) => (
            <Card
              key={b.id}
              className="border-border/60 bg-card/60 hover:border-primary/30 transition-colors"
            >
              <CardContent className="p-4 flex items-center gap-3 flex-wrap sm:flex-nowrap">
                <div className="size-10 rounded-lg bg-muted/40 border border-border/40 flex items-center justify-center shrink-0">
                  <FileArchive className="size-5 text-muted-foreground" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <p className="font-mono text-sm font-medium truncate" dir="ltr">
                      {b.name}
                    </p>
                    {b.recommended && (
                      <Badge className="bg-amber-500/15 text-amber-300 border border-amber-500/30 hover:bg-amber-500/20">
                        <Star className="size-3 ml-1" />
                        Gold State
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {b.size} · {b.date}
                  </p>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toast.success("بدأ التحميل")}
                    className="flex-1 sm:flex-initial"
                  >
                    <Download className="size-3.5 ml-1" />
                    تحميل
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => setConfirmRestore(b)}
                    className="doom-gradient text-primary-foreground hover:opacity-90 flex-1 sm:flex-initial"
                  >
                    <RotateCcw className="size-3.5 ml-1" />
                    استعادة
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setConfirmDelete(b)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10 hover:border-destructive/40 px-3"
                    aria-label="حذف النسخة"
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </ul>
      ) : (
        <Empty className="border border-dashed border-border/60 bg-card/40 rounded-xl">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <HardDriveDownload className="size-6" />
            </EmptyMedia>
            <EmptyTitle>لا توجد نسخ احتياطية</EmptyTitle>
            <EmptyDescription>أنشئ أول نسخة احتياطية لحفظ حالة النظام الحالية.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}

      <ConfirmDialog
        open={!!confirmRestore}
        onOpenChange={(o) => !o && setConfirmRestore(null)}
        title="استعادة النسخة الاحتياطية"
        description={
          <>
            سيتم استبدال الحالة الحالية بـ <strong>{confirmRestore?.name}</strong>. هذا الإجراء قد
            يؤدي لتوقف الخدمة مؤقتاً.
          </>
        }
        confirmLabel="نعم، استعادة"
        destructive
        onConfirm={applyRestore}
      />

      <ConfirmDialog
        open={!!confirmDelete}
        onOpenChange={(o) => !o && setConfirmDelete(null)}
        title="حذف النسخة الاحتياطية"
        description={
          <>
            سيتم حذف <strong>{confirmDelete?.name}</strong> نهائياً. لا يمكن التراجع عن هذا الإجراء.
          </>
        }
        confirmLabel="نعم، حذف"
        destructive
        onConfirm={applyDelete}
      />
    </div>
  )
}
