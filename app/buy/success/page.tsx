"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"

function SuccessInner() {
  const params = useSearchParams()
  const sku = params.get("sku")
  const sessionId = params.get("session_id")
  const [confirmed, setConfirmed] = useState(false)

  useEffect(() => {
    if (sessionId) setConfirmed(true)
  }, [sessionId])

  return (
    <section style={{ maxWidth: "640px", margin: "0 auto", padding: "120px 32px" }}>
      <div
        style={{
          fontFamily: "var(--font-jetbrains-mono), monospace",
          fontSize: "11px",
          color: "var(--ink-4)",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          marginBottom: "24px",
        }}
      >
        {confirmed ? "Paid" : "Confirming"}
      </div>
      <h1
        style={{
          fontFamily: "var(--font-jetbrains-mono), monospace",
          fontSize: "40px",
          fontWeight: 700,
          margin: 0,
          marginBottom: "16px",
          letterSpacing: "-0.02em",
        }}
      >
        You bought {sku ?? "something"}.
      </h1>
      <p
        style={{
          fontSize: "15px",
          color: "var(--ink-7)",
          lineHeight: 1.6,
          marginBottom: "32px",
        }}
      >
        Receipt is in your inbox.<br />
        We&apos;ll email delivery details within minutes.<br />
        If something is off, reply to that email.
      </p>
      <Link
        href="/"
        style={{
          display: "inline-block",
          padding: "12px 20px",
          border: "1px solid var(--fg)",
          color: "var(--fg)",
          textDecoration: "none",
          fontFamily: "var(--font-jetbrains-mono), monospace",
          fontSize: "12px",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}
      >
        Back to home
      </Link>
    </section>
  )
}

export default function SuccessPage() {
  return (
    <div style={{ backgroundColor: "var(--bg)", minHeight: "100vh", color: "var(--fg)" }}>
      <Suspense
        fallback={
          <section style={{ maxWidth: "640px", margin: "0 auto", padding: "120px 32px" }}>
            <div style={{ color: "var(--ink-4)" }}>Loading…</div>
          </section>
        }
      >
        <SuccessInner />
      </Suspense>
    </div>
  )
}
