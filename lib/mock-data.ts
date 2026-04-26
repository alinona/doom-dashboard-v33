// Mock data for Doom VIP Control Panel
// Note: dates are intentionally generic / relative — replaced later by real backend

export type PackageType =
  | "sports"
  | "movies"
  | "series"
  | "news"
  | "kids"
  | "adults"
  | "variety"
  | "other"

export const packageTypeLabels: Record<PackageType, string> = {
  sports: "رياضة",
  movies: "أفلام",
  series: "مسلسلات",
  news: "أخبار",
  kids: "أطفال",
  adults: "للكبار",
  variety: "منوعات",
  other: "أخرى",
}

export const packageTypeColors: Record<PackageType, string> = {
  sports: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  movies: "bg-violet-500/15 text-violet-300 border-violet-500/30",
  series: "bg-blue-500/15 text-blue-300 border-blue-500/30",
  news: "bg-yellow-500/15 text-yellow-300 border-yellow-500/30",
  kids: "bg-pink-500/15 text-pink-300 border-pink-500/30",
  adults: "bg-red-500/15 text-red-300 border-red-500/30",
  variety: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
  other: "bg-zinc-500/15 text-zinc-300 border-zinc-500/30",
}

// =============== Packages ===============
export interface Package {
  id: number
  category_id: string
  originalName: string
  arabicLabel: string
  type: PackageType
  visible: boolean
  channelCount: number
  status: "ok" | "warning" | "error"
}

export const mockPackages: Package[] = [
  { id: 1, category_id: "1001", originalName: "BEIN SPORTS", arabicLabel: "رياضة", type: "sports", visible: true, channelCount: 24, status: "ok" },
  { id: 2, category_id: "1002", originalName: "MBC", arabicLabel: "ام بي سي", type: "variety", visible: true, channelCount: 18, status: "ok" },
  { id: 3, category_id: "1003", originalName: "STC TV 4K", arabicLabel: "اس تي سي 4 كيه", type: "variety", visible: false, channelCount: 12, status: "warning" },
  { id: 4, category_id: "1004", originalName: "Adults XXX", arabicLabel: "للكبار", type: "adults", visible: false, channelCount: 8, status: "ok" },
  { id: 5, category_id: "1005", originalName: "AF | NEWS", arabicLabel: "أخبار أفريقية", type: "news", visible: true, channelCount: 15, status: "ok" },
  { id: 6, category_id: "1006", originalName: "DSTV | MOVIES", arabicLabel: "أفلام", type: "movies", visible: true, channelCount: 32, status: "ok" },
  { id: 7, category_id: "1007", originalName: "DSTV | KIDS", arabicLabel: "أطفال", type: "kids", visible: true, channelCount: 11, status: "ok" },
  { id: 8, category_id: "1008", originalName: "Arabic 4K", arabicLabel: "عربي 4K", type: "variety", visible: true, channelCount: 22, status: "ok" },
  { id: 9, category_id: "1009", originalName: "OSN Series HD", arabicLabel: "مسلسلات", type: "series", visible: true, channelCount: 19, status: "ok" },
  { id: 10, category_id: "1010", originalName: "Sky News Arabia", arabicLabel: "سكاي نيوز", type: "news", visible: true, channelCount: 6, status: "ok" },
]

// =============== Channels ===============
export interface Channel {
  id: number
  channelId: string
  originalName: string
  displayName: string
  arabicLabel: string
  packageId: number
  packageName: string
  streamStatus: "ok" | "testing" | "failed"
  visible: boolean
}

export const mockChannels: Channel[] = [
  { id: 1, channelId: "437263", originalName: "MBC 1 HD", displayName: "MBC 1 HD", arabicLabel: "ام بي سي 1", packageId: 2, packageName: "MBC", streamStatus: "ok", visible: true },
  { id: 2, channelId: "437264", originalName: "MBC 2 HD", displayName: "MBC 2 HD", arabicLabel: "ام بي سي 2", packageId: 2, packageName: "MBC", streamStatus: "ok", visible: true },
  { id: 3, channelId: "437265", originalName: "BEIN SPORT 1 HD", displayName: "BEIN SPORT 1 HD", arabicLabel: "بي ان سبورت 1", packageId: 1, packageName: "BEIN SPORTS", streamStatus: "ok", visible: true },
  { id: 4, channelId: "437266", originalName: "BEIN SPORT 2 HD", displayName: "BEIN SPORT 2 HD", arabicLabel: "بي ان سبورت 2", packageId: 1, packageName: "BEIN SPORTS", streamStatus: "ok", visible: true },
  { id: 5, channelId: "437267", originalName: "STC 4K 01", displayName: "STC 4K 01", arabicLabel: "اس تي سي 1", packageId: 3, packageName: "STC TV 4K", streamStatus: "failed", visible: false },
  { id: 6, channelId: "437268", originalName: "AF NEWS 01", displayName: "AF NEWS 01", arabicLabel: "أخبار أفريقية 1", packageId: 5, packageName: "AF | NEWS", streamStatus: "ok", visible: true },
  { id: 7, channelId: "437269", originalName: "Kids Channel", displayName: "Kids Channel", arabicLabel: "قناة الأطفال", packageId: 7, packageName: "DSTV | KIDS", streamStatus: "ok", visible: true },
  { id: 8, channelId: "437270", originalName: "Adults Sample", displayName: "Adults Sample", arabicLabel: "للكبار", packageId: 4, packageName: "Adults XXX", streamStatus: "ok", visible: false },
  { id: 9, channelId: "437271", originalName: "DSTV Movies HD", displayName: "DSTV Movies HD", arabicLabel: "دي اس تي في أفلام", packageId: 6, packageName: "DSTV | MOVIES", streamStatus: "ok", visible: true },
  { id: 10, channelId: "437272", originalName: "OSN Drama", displayName: "OSN Drama", arabicLabel: "أو اس ان دراما", packageId: 9, packageName: "OSN Series HD", streamStatus: "testing", visible: true },
]

// =============== Keys / Subscribers ===============
export interface ApiKey {
  id: number
  code: string
  status: "active" | "blocked" | "expired"
  expireDate: string
  deviceCount: number
  maxDevices: number
  lastIp: string
  lastSeen: string
  /** اسم المشترك */
  subscriberName: string
  /** رقم هاتف المشترك */
  phone: string
  /** عنوان المشترك */
  address: string
  /** ملاحظة إضافية */
  note?: string
}

export const expireOptions = [
  "خلال أسبوع",
  "خلال شهر",
  "خلال شهرين",
  "خلال 3 أشهر",
  "خلال 6 أشهر",
  "خلال سنة",
  "منتهي الصلاحية",
]

export const mockKeys: ApiKey[] = [
  {
    id: 1,
    code: "DOOM-AX9F-2K7M-PL3Q",
    status: "active",
    expireDate: "خلال 6 أشهر",
    deviceCount: 2,
    maxDevices: 3,
    lastIp: "192.168.1.45",
    lastSeen: "قبل دقيقتين",
    subscriberName: "أحمد العبادي",
    phone: "+9647701234567",
    address: "بغداد - الكرادة",
    note: "عميل مميز",
  },
  {
    id: 2,
    code: "DOOM-BV4K-9X2N-MQ8R",
    status: "active",
    expireDate: "خلال شهرين",
    deviceCount: 1,
    maxDevices: 2,
    lastIp: "10.0.0.12",
    lastSeen: "قبل ساعة",
    subscriberName: "محمد حسين",
    phone: "+9647809876543",
    address: "البصرة - العشار",
  },
  {
    id: 3,
    code: "DOOM-CN7P-3T5L-WX1S",
    status: "blocked",
    expireDate: "خلال شهر",
    deviceCount: 0,
    maxDevices: 2,
    lastIp: "172.16.5.88",
    lastSeen: "قبل 3 أيام",
    subscriberName: "كريم ناصر",
    phone: "+9647712223344",
    address: "الموصل - الأيسر",
    note: "محظور لمخالفات",
  },
  {
    id: 4,
    code: "DOOM-DM2J-8R4Y-VB6T",
    status: "expired",
    expireDate: "منتهي الصلاحية",
    deviceCount: 0,
    maxDevices: 1,
    lastIp: "203.45.67.190",
    lastSeen: "قبل أسبوع",
    subscriberName: "سعد جاسم",
    phone: "+9647505556677",
    address: "أربيل - عينكاوة",
  },
  {
    id: 5,
    code: "DOOM-EP5H-1N6Q-ZK9U",
    status: "active",
    expireDate: "خلال سنة",
    deviceCount: 3,
    maxDevices: 5,
    lastIp: "8.8.4.4",
    lastSeen: "قبل 5 دقائق",
    subscriberName: "حيدر علي",
    phone: "+9647818889900",
    address: "النجف - الكوفة",
    note: "VIP",
  },
  {
    id: 6,
    code: "DOOM-FQ8G-7M2X-CL4V",
    status: "active",
    expireDate: "خلال 3 أشهر",
    deviceCount: 1,
    maxDevices: 2,
    lastIp: "45.12.78.34",
    lastSeen: "قبل 30 دقيقة",
    subscriberName: "عمر فاضل",
    phone: "+9647901112233",
    address: "كركوك - شارع الجمهورية",
  },
]

// =============== Backups ===============
export interface Backup {
  id: number
  name: string
  size: string
  date: string
  recommended: boolean
}

export const mockBackups: Backup[] = [
  { id: 1, name: "doom_minimal_proxy_STABLE.py", size: "84 KB", date: "اليوم", recommended: true },
  { id: 2, name: "stable_backup_v1.tar.gz", size: "4.2 MB", date: "أمس", recommended: true },
  { id: 3, name: "backup_pre_gold_state.tar.gz", size: "3.8 MB", date: "قبل 3 أيام", recommended: false },
  { id: 4, name: "backup_routine_weekly.tar.gz", size: "4.1 MB", date: "قبل أسبوع", recommended: false },
]

// =============== Logs ===============
export interface LogEntry {
  id: number
  time: string
  type: "login" | "stream" | "error" | "admin"
  message: string
  status: "ok" | "warning" | "error"
}

export const mockLogs: LogEntry[] = [
  { id: 1, time: "قبل لحظات", type: "login", message: "Login status 101", status: "ok" },
  { id: 2, time: "قبل دقيقة", type: "stream", message: "GET /user/pass/437263 OK", status: "ok" },
  { id: 3, time: "قبل دقيقتين", type: "error", message: "Broken pipe", status: "warning" },
  { id: 4, time: "قبل 5 دقائق", type: "stream", message: "GET /user/pass/437264 OK", status: "ok" },
  { id: 5, time: "قبل 10 دقائق", type: "error", message: "Connection reset", status: "warning" },
  { id: 6, time: "قبل 15 دقيقة", type: "admin", message: "Package hidden: STC TV 4K", status: "ok" },
  { id: 7, time: "قبل 30 دقيقة", type: "admin", message: "Key blocked: DOOM-CN7P-3T5L-WX1S", status: "ok" },
  { id: 8, time: "قبل ساعة", type: "admin", message: "Backup created: stable_backup_v1.tar.gz", status: "ok" },
  { id: 9, time: "قبل ساعتين", type: "login", message: "Login status 101", status: "ok" },
  { id: 10, time: "قبل 3 ساعات", type: "error", message: "Stream timeout", status: "error" },
]

// =============== Stats / Charts ===============
export const mockStats = {
  serverStatus: "online" as "online" | "offline",
  goldState: true,
  loginApi: "ok" as "ok" | "error",
  liveStreaming: "ok" as "ok" | "error",
  totalPackages: mockPackages.length,
  totalChannels: mockChannels.length,
  activeKeys: mockKeys.filter((k) => k.status === "active").length,
  hiddenPackages: mockPackages.filter((p) => !p.visible).length,
  hiddenChannels: mockChannels.filter((c) => !c.visible).length,
  lastBackup: "اليوم",
  errorsToday: 3,
  cpuUsage: 34,
  ramUsage: 58,
  bandwidth: 72,
  uptime: "12 يوم 4 ساعات",
}

/** بيانات منحنى نشاط البث على آخر 24 ساعة */
export const mockTrafficData = [
  { hour: "00:00", streams: 42, logins: 18 },
  { hour: "03:00", streams: 28, logins: 12 },
  { hour: "06:00", streams: 35, logins: 24 },
  { hour: "09:00", streams: 88, logins: 64 },
  { hour: "12:00", streams: 124, logins: 92 },
  { hour: "15:00", streams: 156, logins: 110 },
  { hour: "18:00", streams: 198, logins: 142 },
  { hour: "21:00", streams: 232, logins: 168 },
]

/** توزيع المفاتيح حسب الحالة */
export const mockKeysDistribution = [
  { name: "فعّال", value: mockKeys.filter((k) => k.status === "active").length, key: "active" as const },
  { name: "محظور", value: mockKeys.filter((k) => k.status === "blocked").length, key: "blocked" as const },
  { name: "منتهي الصلاحية", value: mockKeys.filter((k) => k.status === "expired").length, key: "expired" as const },
]

export const mockBlockedIps = [
  { ip: "45.221.18.99", failedAttempts: 12, blockUntil: "خلال 30 دقيقة" },
  { ip: "103.45.78.201", failedAttempts: 8, blockUntil: "خلال ساعة" },
]

// =============== Notifications ===============
export interface Notification {
  id: number
  title: string
  message: string
  time: string
  type: "info" | "warning" | "error" | "success"
  read: boolean
}

export const mockNotifications: Notification[] = [
  {
    id: 1,
    title: "تنبيه أمان",
    message: "محاولة دخول فاشلة من 45.221.18.99 — تم الحظر تلقائياً",
    time: "قبل 5 دقائق",
    type: "warning",
    read: false,
  },
  {
    id: 2,
    title: "نسخة احتياطية",
    message: "تم إنشاء النسخة اليومية بنجاح: stable_backup_v1.tar.gz",
    time: "قبل ساعة",
    type: "success",
    read: false,
  },
  {
    id: 3,
    title: "خطأ في البث",
    message: "Stream timeout على القناة BEIN SPORT 1 HD",
    time: "قبل ساعتين",
    type: "error",
    read: false,
  },
  {
    id: 4,
    title: "مفتاح جديد",
    message: "تم تفعيل مفتاح للمشترك: حيدر علي",
    time: "قبل 3 ساعات",
    type: "info",
    read: true,
  },
  {
    id: 5,
    title: "تحديث متاح",
    message: "إصدار جديد من Smarter Proxy متاح للترقية",
    time: "أمس",
    type: "info",
    read: true,
  },
]

export const mockMoviesSeries = [
  { id: 1, name: "أحدث الأفلام", type: "movies" as const, count: 1248, lastUpdate: "اليوم", status: "ok" as const },
  { id: 2, name: "الأكثر مشاهدة", type: "movies" as const, count: 320, lastUpdate: "اليوم", status: "ok" as const },
  { id: 3, name: "أفلام عربية", type: "movies" as const, count: 540, lastUpdate: "أمس", status: "ok" as const },
  { id: 4, name: "أحدث المسلسلات", type: "series" as const, count: 412, lastUpdate: "اليوم", status: "ok" as const },
  { id: 5, name: "مسلسلات تركية", type: "series" as const, count: 186, lastUpdate: "اليوم", status: "ok" as const },
  { id: 6, name: "نتفليكس", type: "series" as const, count: 95, lastUpdate: "قبل ساعتين", status: "warning" as const },
]
