"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"

const mono = "var(--font-jetbrains-mono), monospace"

function ThanksInner() {
  const params = useSearchParams()
  const sessionId = params.get("session_id")

  return (
    <section style={{ maxWidth: "640px", margin: "0 auto", padding: "120px 32px" }}>
      <div
        style={{
          fontFamily: mono,
          fontSize: "11px",
          color: "var(--ink-4)",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          marginBottom: "24px",
        }}
      >
        {sessionId ? "Paid" : "Missing session"}
      </div>

      <h1
        style={{
          fontFamily: mono,
          fontSize: "40px",
          fontWeight: 700,
          margin: 0,
          marginBottom: "16px",
          letterSpacing: "-0.02em",
        }}
      >
        fable-ready is yours.
      </h1>

      {sessionId ? (
        <>
          <p style={{ fontSize: "15px", color: "var(--ink-7)", lineHeight: 1.6, marginBottom: "32px" }}>
            One zip. The skill, the rules, the scanner.
            <br />
            Unzip into your tool, point it at your repo, approve the patches.
            <br />
            We also emailed you this download link — it works whenever you need it again.
          </p>
          <a
            href={`/api/fable-ready/download?session_id=${encodeURIComponent(sessionId)}`}
            style={{
              display: "inline-block",
              padding: "14px 24px",
              backgroundColor: "var(--fg)",
              color: "var(--bg)",
              textDecoration: "none",
              fontFamily: mono,
              fontSize: "13px",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Download fable-ready-v1.0.0.zip
          </a>
          <p style={{ fontSize: "13px", color: "var(--ink-4)", lineHeight: 1.6, marginTop: "24px" }}>
            Install help: INSTALL.md in the zip covers Claude Code, Cowork, Cursor, OpenClaw, Hermes.
            <br />
            Re-downloads and rules updates: <Link href="/account" style={{ color: "var(--ink-6)" }}>your library</Link> — sign in with your checkout email.
            <br />
            Stuck? hi@solidstate.cc — include your tool and OS.
          </p>
        </>
      ) : (
        <p style={{ fontSize: "15px", color: "var(--ink-7)", lineHeight: 1.6, marginBottom: "32px" }}>
          No checkout session found. Use the link from your receipt email,
          <br />
          or buy at <Link href="/fable-ready" style={{ color: "var(--fg)" }}>/fable-ready</Link>.
        </p>
      )}
    </section>
  )
}

export default function FableReadyThanksPage() {
  return (
    <div style={{ backgroundColor: "var(--bg)", minHeight: "100vh", color: "var(--fg)" }}>
      <Suspense
        fallback={
          <section style={{ maxWidth: "640px", margin: "0 auto", padding: "120px 32px" }}>
            <div style={{ color: "var(--ink-4)" }}>Loading…</div>
          </section>
        }
      >
        <ThanksInner />
      </Suspense>
    </div>
  )
}
