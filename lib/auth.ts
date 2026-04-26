// ⚠️ Mock authentication — frontend-only.
// All sensitive logic (real password check, session signing, password rotation)
// must be wired to the backend. This file ONLY proves the UI flow works.
//
// TODO BACKEND: replace mockLogin with POST /api/auth/login
// TODO BACKEND: replace localStorage session with HttpOnly secure cookie

const AUTH_KEY = "doom_admin_session"

/**
 * Mock credentials — kept here ONLY because the rules ask to centralize
 * demo creds in one obvious place. Never ship this to production.
 * The real check belongs to the backend.
 */
export const MOCK_CREDENTIALS = {
  username: "admin",
  password: "admin",
} as const

export interface AdminSession {
  username: string
  loggedInAt: string
}

export function getSession(): AdminSession | null {
  if (typeof window === "undefined") return null
  try {
    const raw = window.localStorage.getItem(AUTH_KEY)
    if (!raw) return null
    return JSON.parse(raw) as AdminSession
  } catch {
    return null
  }
}

export function setSession(username: string) {
  if (typeof window === "undefined") return
  const session: AdminSession = {
    username,
    loggedInAt: new Date().toISOString(),
  }
  window.localStorage.setItem(AUTH_KEY, JSON.stringify(session))
}

export function clearSession() {
  if (typeof window === "undefined") return
  window.localStorage.removeItem(AUTH_KEY)
}

/** Mock credential check — UI only. Real auth lives on the backend. */
export function mockLogin(username: string, password: string): boolean {
  return (
    username.trim() === MOCK_CREDENTIALS.username &&
    password === MOCK_CREDENTIALS.password
  )
}
