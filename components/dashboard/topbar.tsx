"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  Bell,
  LogOut,
  Menu,
  Search,
  ShieldCheck,
  X,
} from "lucide-react"
import { NotificationsMenu } from "./notifications-menu"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { SidebarNav } from "./sidebar-nav"
import { Brand } from "./brand"
import { clearSession, getSession } from "@/lib/auth"
import { toast } from "sonner"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Kbd } from "@/components/ui/kbd"

export function Topbar() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [username, setUsername] = useState<string>("")

  useEffect(() => {
    const s = getSession()
    if (s) setUsername(s.username)
  }, [])

  function handleLogout() {
    clearSession()
    toast.success("تم تسجيل الخروج بنجاح")
    router.push("/login")
  }

  return (
    <header className="sticky top-0 z-30 w-full border-b border-border/60 bg-background/75 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center gap-3 px-3 sm:px-5 lg:px-7">
        {/* Mobile menu trigger */}
        <Sheet open={open} onOpenChange={setOpen}>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden shrink-0 -mr-1"
            onClick={() => setOpen(true)}
            aria-label="فتح القائمة"
          >
            <Menu className="size-5" />
          </Button>
          <SheetContent
            side="right"
            className="w-[min(86vw,320px)] p-0 bg-sidebar text-sidebar-foreground border-l-sidebar-border [&>button]:hidden"
          >
            <SheetHeader className="sr-only">
              <SheetTitle>قائمة التنقل</SheetTitle>
              <SheetDescription>روابط أقسام لوحة التحكم</SheetDescription>
            </SheetHeader>
            <div className="absolute top-3.5 left-3 z-10">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setOpen(false)}
                aria-label="إغلاق القائمة"
                className="size-8 hover:bg-sidebar-accent"
              >
                <X className="size-4" />
              </Button>
            </div>
            <SidebarNav onItemClick={() => setOpen(false)} />
          </SheetContent>
        </Sheet>

        {/* Mobile brand */}
        <div className="lg:hidden">
          <Brand size="sm" />
        </div>

        {/* Search (desktop) */}
        <div className="hidden md:flex flex-1 max-w-md mr-auto lg:mr-0">
          <InputGroup className="w-full bg-card/50 border-border/60 rounded-xl">
            <InputGroupAddon>
              <Search className="size-4 text-muted-foreground" aria-hidden />
            </InputGroupAddon>
            <InputGroupInput
              type="search"
              placeholder="ابحث في الباقات، القنوات، المفاتيح..."
              className="h-10 text-sm"
              onFocus={() => toast.info("البحث العام — TODO BACKEND: GET /api/search?q=...")}
              readOnly
            />
            <InputGroupAddon align="inline-end" className="hidden lg:flex">
              <Kbd className="text-[10px]">⌘ K</Kbd>
            </InputGroupAddon>
          </InputGroup>
        </div>

        <div className="flex-1 md:hidden" />

        {/* Action group */}
        <div className="flex items-center gap-1.5">
          {/* Notifications */}
          <NotificationsMenu />

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="gap-2 h-9 px-1.5 sm:px-2 rounded-lg hover:bg-card/60"
                aria-label="قائمة المستخدم"
              >
                <div className="relative">
                  <div className="size-7 rounded-md doom-gradient flex items-center justify-center text-[11px] font-extrabold text-primary-foreground ring-1 ring-white/10">
                    {(username || "A").charAt(0).toUpperCase()}
                  </div>
                  <span
                    className="absolute -bottom-0.5 -left-0.5 size-2.5 rounded-full bg-emerald-400 ring-2 ring-background"
                    aria-hidden
                  />
                </div>
                <div className="hidden sm:flex flex-col text-right leading-tight">
                  <span className="text-xs font-bold">{username || "admin"}</span>
                  <span className="text-[10px] text-muted-foreground">مسؤول</span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <div className="flex items-center gap-3 p-2.5">
                <div className="size-9 rounded-lg doom-gradient flex items-center justify-center text-sm font-extrabold text-primary-foreground ring-1 ring-white/10 shrink-0">
                  {(username || "A").charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold truncate">{username || "admin"}</p>
                  <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                    <ShieldCheck className="size-3 text-emerald-400" />
                    مسؤول رئيسي
                  </p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-bold">
                الحساب
              </DropdownMenuLabel>
              <DropdownMenuItem
                onClick={handleLogout}
                className="text-destructive focus:text-destructive cursor-pointer gap-2"
              >
                <LogOut className="size-4" />
                تسجيل الخروج
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
