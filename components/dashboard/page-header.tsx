import type { ReactNode } from "react"

interface PageHeaderProps {
  title: string
  description?: string
  icon?: ReactNode
  actions?: ReactNode
  eyebrow?: string
}

export function PageHeader({ title, description, icon, actions, eyebrow }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
      <div className="flex items-start gap-3.5 min-w-0">
        {icon && (
          <div className="relative shrink-0">
            <div className="size-11 rounded-xl doom-gradient flex items-center justify-center doom-shadow-glow ring-1 ring-white/10">
              {icon}
            </div>
            <div className="absolute -inset-2 -z-10 rounded-2xl doom-aurora opacity-50" aria-hidden />
          </div>
        )}
        <div className="min-w-0">
          {eyebrow && (
            <p className="text-[10px] uppercase tracking-[0.18em] font-bold text-muted-foreground/70 mb-1">
              {eyebrow}
            </p>
          )}
          <h1 className="text-2xl sm:text-[26px] font-extrabold text-balance leading-tight tracking-tight">
            {title}
          </h1>
          {description && (
            <p className="text-sm text-muted-foreground mt-1.5 text-pretty leading-relaxed max-w-xl">
              {description}
            </p>
          )}
        </div>
      </div>
      {actions && <div className="flex flex-wrap gap-2 shrink-0">{actions}</div>}
    </div>
  )
}
