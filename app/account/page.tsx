"use client"

/**
 * /account — the buyer library.
 *
 * Sign in with the email you used at checkout (magic link, no passwords).
 * Lists purchases from the `sales` table (RLS: you only see your own rows)
 * with download buttons that reuse the per-session verified download routes.
 *
 * Supabase config required (one-time, dashboard → Auth → URL Configuration):
 *   Site URL: https://solidstate.cc
 *   Redirect URLs: https://solidstate.cc/account
 */

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { createClient, type SupabaseClient, type Session } from "@supabase/supabase-js"

const mono = "var(--font-jetbrains-mono), monospace"

// SKU registry for display + delivery. Future products: add a row.
const SKU_INFO: Record<
  string,
  { name: string; version: string; downloadPath: (sessionId: string) => string }
> = {
  "ship-kit": {
    name: "Solid State Ship Kit",
    version: "v1.0.0",
    downloadPath: (sid) => `/api/ship-kit/download?session_id=${encodeURIComponent(sid)}`,
  },
  "fable-ready": {
    name: "Solid State fable-ready",
    version: "v1.0.1",
    downloadPath: (sid) => `/api/fable-ready/download?session_id=${encodeURIComponent(sid)}`,
  },
}

type Sale = {
  stripe_event_id: string
  stripe_session_id: string
  sku: string
  amount_cents: number
  currency: string
  status: string
  created_at: string
}

const label: React.CSSProperties = {
  fontFamily: mono,
  fontSize: "11px",
  color: "var(--ink-4)",
  letterSpacing: "0.1em",
  textTransform: "uppercase",
}

const input: React.CSSProperties = {
  fontFamily: mono,
  fontSize: "14px",
  padding: "12px 14px",
  backgroundColor: "var(--bg-2)",
  border: "1px solid var(--border)",
  color: "var(--fg)",
  width: "100%",
  maxWidth: "360px",
  outline: "none",
}

const button: React.CSSProperties = {
  padding: "12px 20px",
  backgroundColor: "var(--fg)",
  color: "var(--bg)",
  border: "none",
  cursor: "pointer",
  fontFamily: mono,
  fontSize: "12px",
  letterSpacing: "0.08em",
  textTransform: "uppercase",
}

export default function AccountPage() {
  const supabase: SupabaseClient | null = useMemo(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!url || !key) return null
    return createClient(url, key) // default: persistSession + detectSessionInUrl
  }, [])

  const [session, setSession] = useState<Session | null>(null)
  const [ready, setReady] = useState(false)
  const [email, setEmail] = useState("")
  const [sent, setSent] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const [sales, setSales] = useState<Sale[] | null>(null)

  // Footer links land here from the bottom of long pages. The page renders a
  // short loading state first, so the browser clamps scroll to its bottom and
  // stays there once content loads. Force top on mount.
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    if (!supabase) return
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setReady(true)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => sub.subscription.unsubscribe()
  }, [supabase])

  useEffect(() => {
    if (!supabase || !session) return
    supabase
      .from("sales")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) setErr(error.message)
        else setSales((data as Sale[]) ?? [])
      })
  }, [supabase, session])

  async function sendLink(e: React.FormEvent) {
    e.preventDefault()
    if (!supabase) return
    setErr(null)
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim().toLowerCase(),
      options: { emailRedirectTo: "https://solidstate.cc/account" },
    })
    if (error) setErr(error.message)
    else setSent(true)
  }

  return (
    <div style={{ backgroundColor: "var(--bg)", minHeight: "100vh", color: "var(--fg)" }}>
      <div style={{ maxWidth: "720px", margin: "0 auto", padding: "96px 24px" }}>
        <div style={{ ...label, marginBottom: "16px" }}>Account</div>
        <h1
          style={{
            fontFamily: mono,
            fontSize: "34px",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            margin: "0 0 12px",
          }}
        >
          Your library.
        </h1>

        {!supabase && (
          <p style={{ fontSize: "15px", color: "var(--ink-7)" }}>
            Account system is not configured on this deployment.
          </p>
        )}

        {supabase && !ready && <p style={{ color: "var(--ink-4)", fontFamily: mono }}>Loading…</p>}

        {/* Signed out */}
        {supabase && ready && !session && (
          <>
            <p style={{ fontSize: "15px", color: "var(--ink-7)", lineHeight: 1.6, maxWidth: "480px", marginBottom: "28px" }}>
              Sign in with the email you used at checkout. We send a one-time link — no passwords,
              nothing to remember.
            </p>
            {sent ? (
              <p style={{ fontFamily: mono, fontSize: "14px", color: "var(--fg)" }}>
                Link sent. Check {email.trim().toLowerCase()} — it signs you straight in.
              </p>
            ) : (
              <form onSubmit={sendLink} style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
                <input
                  style={input}
                  type="email"
                  required
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button type="submit" style={button}>
                  Send sign-in link
                </button>
              </form>
            )}
            {err && (
              <p style={{ fontFamily: mono, fontSize: "13px", color: "var(--ink-7)", marginTop: "16px" }}>
                {err}
              </p>
            )}
          </>
        )}

        {/* Signed in */}
        {supabase && session && (
          <>
            <p style={{ fontFamily: mono, fontSize: "13px", color: "var(--ink-4)", marginBottom: "32px" }}>
              {session.user.email}
              {" · "}
              <button
                onClick={() => supabase.auth.signOut()}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--ink-6)",
                  cursor: "pointer",
                  fontFamily: mono,
                  fontSize: "13px",
                  padding: 0,
                  textDecoration: "underline",
                }}
              >
                sign out
              </button>
            </p>

            {sales === null && !err && (
              <p style={{ color: "var(--ink-4)", fontFamily: mono }}>Loading purchases…</p>
            )}
            {err && (
              <p style={{ fontFamily: mono, fontSize: "13px", color: "var(--ink-7)" }}>{err}</p>
            )}

            {sales && sales.length === 0 && (
              <div>
                <p style={{ fontSize: "15px", color: "var(--ink-7)", lineHeight: 1.6, maxWidth: "480px" }}>
                  No purchases under this email. If you bought with a different address, sign in
                  with that one — or forward your receipt to hi@solidstate.cc and we&apos;ll move it.
                </p>
                <p style={{ marginTop: "20px" }}>
                  <Link href="/ship-kit" style={{ color: "var(--fg)", fontFamily: mono, fontSize: "13px" }}>
                    → The Ship Kit, $99
                  </Link>
                </p>
              </div>
            )}

            {sales && sales.length > 0 && (
              <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr)", gap: "12px" }}>
                {sales.map((s) => {
                  const info = SKU_INFO[s.sku]
                  return (
                    <div
                      key={s.stripe_event_id}
                      style={{
                        border: "1px solid var(--border)",
                        backgroundColor: "var(--bg-2)",
                        padding: "20px 24px",
                        display: "flex",
                        flexWrap: "wrap",
                        alignItems: "center",
                        gap: "16px",
                        justifyContent: "space-between",
                      }}
                    >
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontFamily: mono, fontSize: "15px", fontWeight: 700 }}>
                          {info?.name ?? s.sku}
                        </div>
                        <div style={{ fontFamily: mono, fontSize: "12px", color: "var(--ink-4)", marginTop: "4px" }}>
                          {info ? `current: ${info.version} · ` : ""}
                          purchased {new Date(s.created_at).toLocaleDateString()} · $
                          {(s.amount_cents / 100).toFixed(0)}
                        </div>
                      </div>
                      {info ? (
                        <a href={info.downloadPath(s.stripe_session_id)} style={{ ...button, textDecoration: "none" }}>
                          Download {info.version}
                        </a>
                      ) : (
                        <span style={{ fontFamily: mono, fontSize: "12px", color: "var(--ink-4)" }}>
                          delivered by email
                        </span>
                      )}
                    </div>
                  )
                })}
              </div>
            )}

            <p style={{ fontFamily: mono, fontSize: "12px", color: "var(--ink-4)", marginTop: "40px" }}>
              Downloads always serve the current v1.x build — updates included with your purchase.
            </p>
          </>
        )}
      </div>
    </div>
  )
}
