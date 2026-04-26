import { cn } from "@/lib/utils"

interface BrandProps {
  size?: "sm" | "md" | "lg" | "xl"
  showText?: boolean
  className?: string
}

const sizeMap = {
  sm: { box: "size-7", icon: "size-4", title: "text-sm", subtitle: "text-[10px]" },
  md: { box: "size-9", icon: "size-5", title: "text-base", subtitle: "text-[11px]" },
  lg: { box: "size-12", icon: "size-6", title: "text-lg", subtitle: "text-xs" },
  xl: { box: "size-16", icon: "size-8", title: "text-2xl", subtitle: "text-sm" },
}

/** Custom Doom monogram — a stylized D crossed with a vertical sword. */
function DoomMonogram({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M5 4h6a8 8 0 0 1 0 16H5z" />
      <path d="M16 3v18" strokeWidth="1.4" opacity="0.6" />
      <path d="M16 3l1.6 1.6" strokeWidth="1.4" opacity="0.6" />
      <path d="M16 3l-1.6 1.6" strokeWidth="1.4" opacity="0.6" />
    </svg>
  )
}

export function Brand({ size = "md", showText = true, className }: BrandProps) {
  const s = sizeMap[size]
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div className="relative shrink-0">
        <div
          className={cn(
            "rounded-xl doom-gradient flex items-center justify-center text-primary-foreground doom-shadow-glow ring-1 ring-white/10",
            s.box,
          )}
        >
          <DoomMonogram className={s.icon} />
        </div>
        {/* tiny glow underneath */}
        <div
          className="absolute -inset-1 -z-10 rounded-2xl doom-aurora opacity-70"
          aria-hidden
        />
      </div>
      {showText && (
        <div className="min-w-0">
          <h2 className={cn("font-extrabold leading-tight tracking-tight doom-gradient-text", s.title)}>
            Doom VIP
          </h2>
          <p className={cn("text-muted-foreground truncate leading-tight", s.subtitle)}>
            لوحة التحكم
          </p>
        </div>
      )}
    </div>
  )
}
