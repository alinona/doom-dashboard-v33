"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Package,
  Tv,
  Film,
  Key,
  KeyRound,
  Wrench,
  HardDriveDownload,
  ScrollText,
  Settings,
  Sparkles,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { mockStats } from "@/lib/mock-data"
import { Brand } from "./brand"

type NavItem = {
  href: string
  label: string
  icon: typeof LayoutDashboard
  badge: number | null
  badgeVariant?: "primary" | "error" | "muted"
  group: "main" | "content" | "system"
}

const navItems: NavItem[] = [
  { href: "/dashboard", label: "الرئيسية", icon: LayoutDashboard, badge: null, group: "main" },

  { href: "/dashboard/packages", label: "الباقات", icon: Package, badge: mockStats.totalPackages, group: "content" },
  { href: "/dashboard/channels", label: "القنوات", icon: Tv, badge: mockStats.totalChannels, group: "content" },
  { href: "/dashboard/movies-series", label: "الأفلام والمسلسلات", icon: Film, badge: null, group: "content" },

  { href: "/dashboard/keys", label: "المفاتيح", icon: Key, badge: mockStats.activeKeys, group: "system" },
  { href: "/dashboard/master-key", label: "المفتاح الأساسي", icon: KeyRound, badge: null, group: "system" },
  { href: "/dashboard/maintenance", label: "الصيانة", icon: Wrench, badge: null, group: "system" },
  { href: "/dashboard/backup", label: "النسخ الاحتياطي", icon: HardDriveDownload, badge: null, group: "system" },
  { href: "/dashboard/logs", label: "السجلات", icon: ScrollText, badge: mockStats.errorsToday, badgeVariant: "error", group: "system" },
  { href: "/dashboard/settings", label: "الإعدادات", icon: Settings, badge: null, group: "system" },
]

const groupLabels: Record<NavItem["group"], string | null> = {
  main: null,
  content: "المحتوى",
  system: "النظام",
}

interface SidebarNavProps {
  onItemClick?: () => void
}

export function SidebarNav({ onItemClick }: SidebarNavProps) {
  const pathname = usePathname()

  // Group items
  const groups: Record<NavItem["group"], NavItem[]> = {
    main: [],
    content: [],
    system: [],
  }
  for (const item of navItems) groups[item.group].push(item)

  return (
    <div className="flex h-full flex-col bg-sidebar">
      {/* Brand */}
      <div className="flex items-center justify-between gap-3 px-5 h-16 border-b border-sidebar-border/60">
        <Brand size="md" />
      </div>

      {/* Nav */}
      <nav
        className="flex-1 overflow-y-auto scrollbar-thin px-3 py-4 flex flex-col gap-5"
        aria-label="القائمة الرئيسية"
      >
        {(Object.keys(groups) as NavItem["group"][]).map((groupKey) => {
          const items = groups[groupKey]
          if (items.length === 0) return null
          const label = groupLabels[groupKey]
          return (
            <div key={groupKey} className="flex flex-col gap-1">
              {label && (
                <div className="px-3 pb-1.5">
                  <span className="text-[10px] uppercase tracking-[0.18em] font-bold text-muted-foreground/70">
                    {label}
                  </span>
                </div>
              )}
              <ul className="flex flex-col gap-0.5">
                {items.map((item) => {
                  const Icon = item.icon
                  const isActive =
                    item.href === "/dashboard"
                      ? pathname === "/dashboard"
                      : pathname.startsWith(item.href)
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={onItemClick}
                        aria-current={isActive ? "page" : undefined}
                        className={cn(
                          "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                          isActive
                            ? "bg-primary/10 text-foreground"
                            : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground",
                        )}
                      >
                        {/* Active indicator bar (right side for RTL) */}
                        {isActive && (
                          <span
                            className="absolute right-0 top-1/2 -translate-y-1/2 h-6 w-[3px] rounded-l-full doom-gradient"
                            aria-hidden
                          />
                        )}
                        <Icon
                          className={cn(
                            "size-[18px] shrink-0 transition-colors",
                            isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground",
                          )}
                          aria-hidden="true"
                        />
                        <span className="flex-1 truncate">{item.label}</span>
                        {item.badge !== null && (
                          <span
                            className={cn(
                              "shrink-0 inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-md text-[10px] font-bold tabular-nums",
                              item.badgeVariant === "error"
                                ? "bg-destructive/15 text-destructive"
                                : isActive
                                  ? "bg-primary/20 text-primary"
                                  : "bg-sidebar-accent text-foreground/70 group-hover:bg-sidebar-accent group-hover:text-foreground",
                            )}
                          >
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          )
        })}
      </nav>

      {/* Footer status card */}
      <div className="p-3 border-t border-sidebar-border/60">
        <div className="relative overflow-hidden rounded-xl border border-amber-500/25 bg-gradient-to-br from-amber-500/[0.08] to-primary/[0.05] p-3 doom-hairline">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="relative flex">
              <span className="size-2 rounded-full bg-amber-400" />
              <span className="absolute inset-0 size-2 rounded-full bg-amber-400 animate-ping opacity-60" />
            </span>
            <span className="text-[11px] font-bold text-amber-300 tracking-wide">
              Gold State
            </span>
            <Sparkles className="size-3 text-amber-300/80 mr-auto" />
          </div>
          <p className="text-[10.5px] text-muted-foreground leading-relaxed">
            النظام في وضع آمن. أي إجراء حساس يحتاج تأكيداً.
          </p>
        </div>
      </div>
    </div>
  )
}
