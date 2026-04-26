"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  Activity,
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Lock,
  Radio,
  Shield,
  User,
} from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import { Brand } from "@/components/dashboard/brand"
import { mockLogin, setSession, getSession } from "@/lib/auth"
import { cn } from "@/lib/utils"

const features = [
  {
    icon: KeyRound,
    title: "إدارة المفاتيح",
    desc: "كل بيانات المشتركين في مكان واحد",
  },
  {
    icon: Radio,
    title: "بث ذكي",
    desc: "مراقبة لحظية لحالة كل قناة",
  },
  {
    icon: Shield,
    title: "حماية متقدمة",
    desc: "تأكيد لكل إجراء حساس",
  },
]

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (getSession()) {
      router.replace("/dashboard")
    }
  }, [router])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      if (mockLogin(username, password)) {
        setSession(username)
        toast.success("تم تسجيل الدخول بنجاح")
        router.push("/dashboard")
      } else {
        toast.error("اسم المستخدم أو كلمة المرور غير صحيحة")
        setLoading(false)
      }
    }, 600)
  }

  return (
    <main className="relative min-h-dvh overflow-hidden bg-background doom-grain">
      {/* Background layers */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute inset-0 doom-dot-grid opacity-60" />
        <div className="absolute -top-32 right-1/4 size-[640px] doom-aurora" />
        <div className="absolute -bottom-40 -left-32 size-[560px] doom-aurora opacity-70" />
        <div className="absolute top-1/3 left-0 h-px w-full bg-gradient-to-r from-transparent via-border/40 to-transparent" />
      </div>

      <div className="relative grid lg:grid-cols-[1fr_minmax(0,500px)] min-h-dvh">
        {/* Left side — brand showcase (desktop only) */}
        <aside className="hidden lg:flex flex-col justify-between p-10 xl:p-14 relative">
          <div className="relative z-10">
            <Brand size="lg" />
          </div>

          <div className="relative z-10 max-w-lg">
            <p className="text-[11px] uppercase tracking-[0.22em] font-bold text-primary/80 mb-4">
              Doom Smarter Proxy
            </p>
            <h1 className="text-4xl xl:text-5xl font-extrabold leading-[1.15] tracking-tight text-balance">
              تحكّم كامل،
              <br />
              <span className="doom-gradient-text">بأناقة لا تتزعزع.</span>
            </h1>
            <p className="text-sm text-muted-foreground mt-5 leading-relaxed text-pretty">
              لوحة احترافية لإدارة الباقات والقنوات والمفاتيح، مصمّمة لتكون سريعة، آمنة، وسهلة في الاستخدام اليومي.
            </p>

            <div className="mt-8 space-y-3">
              {features.map(({ icon: Icon, title, desc }) => (
                <div
                  key={title}
                  className="flex items-start gap-3 rounded-xl border border-border/60 bg-card/40 backdrop-blur p-3 doom-hairline"
                >
                  <div className="size-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                    <Icon className="size-[18px] text-primary" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold leading-tight">{title}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10 flex items-center gap-4 text-[11px] text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <span className="relative flex">
                <span className="size-1.5 rounded-full bg-emerald-400" />
                <span className="absolute inset-0 size-1.5 rounded-full bg-emerald-400 animate-ping opacity-60" />
              </span>
              السيرفر متصل
            </span>
            <span className="size-1 rounded-full bg-border" />
            <span>Build v1.0 — Gold State</span>
          </div>
        </aside>

        {/* Right side — login card */}
        <section className="flex items-center justify-center px-4 sm:px-6 lg:px-10 py-10 lg:border-r lg:border-border/40 lg:bg-card/20 lg:backdrop-blur-xl">
          <div className="w-full max-w-md flex flex-col gap-7">
            {/* Mobile brand */}
            <div className="flex justify-center lg:hidden">
              <Brand size="lg" />
            </div>

            {/* Form heading */}
            <div className="text-center lg:text-right">
              <p className="text-[11px] uppercase tracking-[0.18em] font-bold text-muted-foreground/80 mb-2">
                مرحباً بعودتك
              </p>
              <h2 className="text-2xl sm:text-[28px] font-extrabold leading-tight">
                تسجيل دخول المسؤول
              </h2>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                أدخل بياناتك للوصول إلى لوحة التحكم.
              </p>
            </div>

            {/* Form card */}
            <div
              className={cn(
                "rounded-2xl border border-border/60 bg-card/70 backdrop-blur-xl p-6 sm:p-7",
                "doom-hairline doom-shadow-glow",
              )}
            >
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="username" className="text-xs font-bold">
                    اسم المستخدم
                  </Label>
                  <div className="relative">
                    <User
                      className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground"
                      aria-hidden
                    />
                    <Input
                      id="username"
                      name="username"
                      type="text"
                      autoComplete="username"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="admin"
                      className="pr-10 h-11 bg-input/60 border-border/60 rounded-xl"
                      dir="ltr"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-xs font-bold">
                      كلمة المرور
                    </Label>
                    <button
                      type="button"
                      className="text-[11px] text-primary hover:text-primary/80 transition-colors font-medium"
                      onClick={() => toast.info("ميزة استعادة كلمة المرور غير متاحة بعد — تواصل مع المسؤول مباشرةً")}
                    >
                      هل نسيت كلمة المرور؟
                    </button>
                  </div>
                  <div className="relative">
                    <Lock
                      className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground"
                      aria-hidden
                    />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="pr-10 pl-10 h-11 bg-input/60 border-border/60 rounded-xl font-mono"
                      dir="ltr"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
                    >
                      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="h-11 mt-2 doom-gradient text-primary-foreground font-bold hover:opacity-95 transition-all shadow-lg shadow-primary/30 rounded-xl gap-2 doom-shadow-glow"
                >
                  {loading ? (
                    <>
                      <Spinner className="size-4" />
                      جارِ التحقق...
                    </>
                  ) : (
                    <>
                      دخول إلى اللوحة
                      <ArrowLeft className="size-4" />
                    </>
                  )}
                </Button>

                <div className="rounded-xl border border-dashed border-border/60 bg-muted/20 p-3 mt-1">
                  <p className="text-[11px] font-bold text-foreground mb-1">بيانات تجريبية</p>
                  <p className="text-[11px] text-muted-foreground leading-relaxed" dir="ltr">
                    <span className="text-foreground/80">user:</span>{" "}
                    <span className="font-mono text-accent">admin</span>
                    {"  ·  "}
                    <span className="text-foreground/80">pass:</span>{" "}
                    <span className="font-mono text-accent">admin</span>
                  </p>
                </div>
              </form>
            </div>

            {/* Status row */}
            <div className="grid grid-cols-3 gap-2">
              <StatusChip
                icon={Activity}
                label="السيرفر"
                value="متصل"
                tone="success"
              />
              <StatusChip
                icon={CheckCircle2}
                label="Gold State"
                value="نشط"
                tone="warning"
              />
              <StatusChip icon={Radio} label="البث" value="يعمل" tone="primary" />
            </div>

            <p className="text-center text-[11px] text-muted-foreground">
              تسجيل دخول وهمي لواجهة فقط — سيتم ربطه بالسيرفر لاحقاً.
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}

function StatusChip({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: React.ElementType
  label: string
  value: string
  tone: "success" | "warning" | "primary"
}) {
  const styles = {
    success: "border-emerald-500/25 bg-emerald-500/[0.06] text-emerald-300",
    warning: "border-amber-500/25 bg-amber-500/[0.06] text-amber-300",
    primary: "border-primary/25 bg-primary/[0.06] text-primary",
  }[tone]

  return (
    <div className={cn("rounded-xl border px-3 py-2.5 flex items-center gap-2.5", styles)}>
      <Icon className="size-4 shrink-0" aria-hidden />
      <div className="min-w-0">
        <p className="text-[10px] text-muted-foreground leading-none">{label}</p>
        <p className="text-[11px] font-bold mt-1 leading-none">{value}</p>
      </div>
    </div>
  )
}
