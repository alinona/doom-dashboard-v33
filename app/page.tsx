"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { getSession } from "@/lib/auth"

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    const session = getSession()
    router.replace(session ? "/dashboard" : "/login")
  }, [router])

  return (
    <main className="min-h-dvh flex items-center justify-center bg-background">
      <div className="size-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
    </main>
  )
}
