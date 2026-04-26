"use client"

import type { ReactNode } from "react"
import { AlertTriangle } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (v: boolean) => void
  title: string
  description?: ReactNode
  confirmLabel?: string
  cancelLabel?: string
  destructive?: boolean
  onConfirm: () => void
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description = "هل أنت متأكد؟ هذا الإجراء قد يؤثر على المستخدمين.",
  confirmLabel = "نعم، تأكيد",
  cancelLabel = "إلغاء",
  destructive = false,
  onConfirm,
}: ConfirmDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <div
              className={`size-10 rounded-full flex items-center justify-center shrink-0 ${
                destructive ? "bg-destructive/15 text-destructive" : "bg-amber-500/15 text-amber-300"
              }`}
            >
              <AlertTriangle className="size-5" />
            </div>
            <AlertDialogTitle className="text-right">{title}</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-right pt-2 leading-relaxed">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-row-reverse sm:flex-row-reverse gap-2">
          <AlertDialogAction
            onClick={onConfirm}
            className={
              destructive
                ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                : "doom-gradient text-primary-foreground hover:opacity-90"
            }
          >
            {confirmLabel}
          </AlertDialogAction>
          <AlertDialogCancel className="mt-0">{cancelLabel}</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
