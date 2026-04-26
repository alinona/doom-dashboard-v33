"use client"

import {
  Ban,
  CheckCircle2,
  Clock,
  Copy,
  Globe,
  MapPin,
  Pencil,
  Phone,
  RefreshCw,
  Smartphone,
  Trash2,
  User,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { ApiKey } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

interface KeyCardProps {
  apiKey: ApiKey
  onCopy: (code: string) => void
  onEdit: (k: ApiKey) => void
  onReset: (k: ApiKey) => void
  onDelete: (k: ApiKey) => void
}

export function StatusBadge({ status }: { status: ApiKey["status"] }) {
  if (status === "active")
    return (
      <Badge className="bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/20">
        <CheckCircle2 className="size-3 ml-1" />
        فعّال
      </Badge>
    )
  if (status === "blocked")
    return (
      <Badge className="bg-destructive/15 text-destructive border border-destructive/30 hover:bg-destructive/20">
        <Ban className="size-3 ml-1" />
        محظور
      </Badge>
    )
  return (
    <Badge className="bg-zinc-500/15 text-zinc-300 border border-zinc-500/30 hover:bg-zinc-500/20">
      <Clock className="size-3 ml-1" />
      منتهي الصلاحية
    </Badge>
  )
}

function getInitials(name: string) {
  if (!name) return "؟"
  const parts = name.trim().split(/\s+/)
  return (parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")
}

export function KeyCard({ apiKey: k, onCopy, onEdit, onReset, onDelete }: KeyCardProps) {
  const devicesPercent = Math.min(100, (k.deviceCount / Math.max(k.maxDevices, 1)) * 100)

  return (
    <Card className="border-border/60 bg-card/60 hover:bg-card hover:border-primary/30 transition-all overflow-hidden group">
      <CardContent className="p-0">
        {/* Header row with subscriber */}
        <div className="p-4 flex items-start gap-3 border-b border-border/40">
          <div className="size-11 rounded-xl doom-gradient flex items-center justify-center shrink-0 shadow-md shadow-primary/20 text-primary-foreground font-bold">
            {getInitials(k.subscriberName)}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-bold text-sm truncate">{k.subscriberName}</p>
              <StatusBadge status={k.status} />
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-muted-foreground">
              <Phone className="size-3 shrink-0" />
              <span className="truncate font-mono" dir="ltr">
                {k.phone}
              </span>
            </div>
          </div>
        </div>

        {/* Code */}
        <div className="px-4 pt-3 flex items-center gap-2">
          <code
            className="font-mono text-xs font-medium flex-1 truncate text-foreground/90 bg-muted/30 rounded-md px-2.5 py-1.5 border border-border/40"
            title={k.code}
            dir="ltr"
          >
            {k.code}
          </code>
          <Button
            size="icon"
            variant="ghost"
            className="size-8 shrink-0"
            onClick={() => onCopy(k.code)}
            aria-label="نسخ المفتاح"
          >
            <Copy className="size-3.5" />
          </Button>
        </div>

        {/* Info grid */}
        <div className="px-4 pt-3 pb-3 grid grid-cols-2 gap-x-3 gap-y-2 text-xs">
          <div className="flex items-center gap-1.5 text-muted-foreground min-w-0">
            <Clock className="size-3.5 shrink-0 text-primary/80" />
            <span className="truncate">{k.expireDate}</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground min-w-0">
            <MapPin className="size-3.5 shrink-0 text-primary/80" />
            <span className="truncate">{k.address}</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground min-w-0">
            <Globe className="size-3.5 shrink-0 text-primary/80" />
            <span className="truncate font-mono" dir="ltr">
              {k.lastIp}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground min-w-0">
            <RefreshCw className="size-3.5 shrink-0 text-primary/80" />
            <span className="truncate">{k.lastSeen}</span>
          </div>
        </div>

        {/* Devices progress */}
        <div className="px-4 pb-3">
          <div className="flex items-center justify-between text-[11px] mb-1.5">
            <span className="flex items-center gap-1 text-muted-foreground">
              <Smartphone className="size-3" />
              الأجهزة المسجّلة
            </span>
            <span className="font-mono text-foreground/80">
              {k.deviceCount} / {k.maxDevices}
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-muted/50 overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all",
                devicesPercent >= 100
                  ? "bg-destructive"
                  : devicesPercent >= 75
                    ? "bg-amber-400"
                    : "doom-gradient",
              )}
              style={{ width: `${devicesPercent}%` }}
              aria-hidden="true"
            />
          </div>
        </div>

        {/* Note */}
        {k.note && (
          <div className="mx-4 mb-3 rounded-md border border-amber-500/30 bg-amber-500/10 px-2.5 py-1.5 flex items-center gap-2 text-[11px] text-amber-200">
            <User className="size-3 shrink-0" />
            <span className="truncate">{k.note}</span>
          </div>
        )}

        {/* Actions */}
        <div className="px-3 pb-3 pt-2 border-t border-border/40 flex flex-wrap gap-2">
          <Button
            size="sm"
            onClick={() => onEdit(k)}
            className="doom-gradient text-primary-foreground hover:opacity-90 flex-1 min-w-[90px]"
          >
            <Pencil className="size-3.5 ml-1" />
            تعديل
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onReset(k)}
            className="flex-1 min-w-[90px]"
          >
            <RefreshCw className="size-3.5 ml-1" />
            إعادة ضبط
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onDelete(k)}
            className="text-destructive hover:text-destructive hover:bg-destructive/10 hover:border-destructive/40 px-3"
            aria-label="حذف المفتاح"
          >
            <Trash2 className="size-3.5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
