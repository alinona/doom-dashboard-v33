"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getSession } from "@/lib/auth"
import { SidebarNav } from "@/components/dashboard/sidebar-nav"
import { Topbar } from "@/components/dashboard/topbar"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    if (!getSession()) {
      router.replace("/login")
    } else {
      setChecked(true)
    }
  }, [router])

  if (!checked) {
    return (
      <main className="min-h-dvh flex items-center justify-center bg-background">
        <div className="size-10 rounded-full border-[3px] border-primary/30 border-t-primary animate-spin" />
      </main>
    )
  }

  return (
    <div className="min-h-dvh bg-background relative">
      {/* Ambient glow at top of page */}
      <div
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 size-[600px] doom-aurora opacity-30"
        aria-hidden
      />

      {/* Desktop sidebar */}
      <aside
        className="hidden lg:flex fixed top-0 right-0 bottom-0 w-64 z-20 border-l border-sidebar-border/60"
        aria-label="القائمة الجانبية"
      >
        <div className="w-full">
          <SidebarNav />
        </div>
      </aside>

      {/* Main column */}
      <div className="lg:pr-64 min-h-dvh flex flex-col relative">
        <Topbar />
        <main className="flex-1 px-3 sm:px-5 lg:px-7 py-5 sm:py-6 lg:py-8 max-w-full overflow-x-hidden">
          <div className="doom-fade-in">{children}</div>
        </main>
      </div>
    </div>
  )
}
