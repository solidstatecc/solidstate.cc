"use client"

import { useState } from "react"

/**
 * /buy — single-page pricing.
 * Shows the three current SKUs and routes to Stripe Checkout via the API.
 * Lives off the main nav for now (revealed when revenue path is ready).
 */

type Sku = {
  id: "operator-pack" | "front-door-pdf" | "founder-briefing"
  name: string
  price: string
  cadence: string
  hook: string
  bullets: string[]
  primary?: boolean
}

const SKUS: Sku[] = [
  {
    id: "operator-pack",
    name: "Operator Pack",
    price: "$200",
    cadence: "one-time",
    hook: "10,000 oracle calls. No subscription. No token.",
    bullets: [
      "Prepaid credit — yours to spend.",
      "Routes through Solid State's runtime.",
      "Receipts logged. No vendor lock-in.",
    ],
    primary: true,
  },
  {
    id: "front-door-pdf",
    name: "Run an Agent Without Buying a Course",
    price: "$29",
    cadence: "one-time",
    hook: "The whole playbook. 20 pages. No upsell.",
    bullets: [
      "How to ship one agent on Base.",
      "What to build first, what to skip.",
      "Stack, tools, and the trap list.",
    ],
  },
  {
    id: "founder-briefing",
    name: "Founder Briefing",
    price: "$1",
    cadence: "per run",
    hook: "forest + audit + oracle. One run. One dollar.",
    bullets: [
      "Run as a one-off here.",
      "Use it before pitching anything.",
    ],
  },
]

export default function BuyPage() {
  const [busy, setBusy] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function buy(sku: Sku["id"]) {
    setError(null)
    setBusy(sku)
    try {
      const r = await fetch("/api/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ sku }),
      })
      const data = await r.json()
      if (!r.ok || !data.url) {
        setError(data.error ?? "Checkout failed")
        setBusy(null)
        return
      }
      window.location.href = data.url
    } catch (e) {
      setError(e instanceof Error ? e.message : "Network error")
      setBusy(null)
    }
  }

  return (
    <div style={{ backgroundColor: "#000000", minHeight: "100vh", color: "#ffffff" }}>
      <section style={{ maxWidth: "1100px", margin: "0 auto", padding: "96px 32px 48px" }}>
        <h1
          style={{
            fontFamily: "var(--font-jetbrains-mono), monospace",
            fontSize: "48px",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            margin: 0,
            marginBottom: "16px",
          }}
        >
          Buy.
        </h1>
        <p
          style={{
            fontFamily: "var(--font-jetbrains-mono), monospace",
            fontSize: "14px",
            color: "#888888",
            letterSpacing: "0.04em",
            margin: 0,
            marginBottom: "48px",
            maxWidth: "560px",
          }}
        >
          Three things. Two one-offs and a per-run.<br />
          No subscription. No token gate. No course.
        </p>

        {error && (
          <div
            style={{
              border: "1px solid #ffffff",
              color: "#ffffff",
              padding: "12px 16px",
              marginBottom: "32px",
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: "12px",
            }}
          >
            {error}
          </div>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "0",
            border: "1px solid #222222",
          }}
        >
          {SKUS.map((s, i) => (
            <div
              key={s.id}
              style={{
                padding: "32px",
                borderRight: i < SKUS.length - 1 ? "1px solid #222222" : "none",
                background: s.primary ? "#0a0a0a" : "transparent",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-jetbrains-mono), monospace",
                  fontSize: "11px",
                  color: "#888888",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  marginBottom: "16px",
                }}
              >
                {s.primary ? "Most direct" : s.cadence}
              </div>
              <h2
                style={{
                  fontFamily: "var(--font-jetbrains-mono), monospace",
                  fontSize: "20px",
                  fontWeight: 700,
                  margin: 0,
                  marginBottom: "8px",
                  letterSpacing: "-0.01em",
                }}
              >
                {s.name}
              </h2>
              <div
                style={{
                  fontFamily: "var(--font-jetbrains-mono), monospace",
                  fontSize: "32px",
                  fontWeight: 700,
                  margin: "16px 0 4px",
                }}
              >
                {s.price}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-jetbrains-mono), monospace",
                  fontSize: "11px",
                  color: "#888888",
                  marginBottom: "20px",
                  letterSpacing: "0.04em",
                }}
              >
                {s.cadence}
              </div>
              <p style={{ fontSize: "14px", color: "#bbbbbb", lineHeight: 1.6, marginBottom: "20px" }}>
                {s.hook}
              </p>
              <ul style={{ paddingLeft: "0", listStyle: "none", marginBottom: "28px" }}>
                {s.bullets.map((b) => (
                  <li
                    key={b}
                    style={{
                      fontSize: "13px",
                      color: "#888888",
                      lineHeight: 1.6,
                      marginBottom: "8px",
                      paddingLeft: "16px",
                      position: "relative",
                    }}
                  >
                    <span style={{ position: "absolute", left: 0, color: "#555" }}>—</span>
                    {b}
                  </li>
                ))}
              </ul>
              <button
                disabled={busy === s.id}
                onClick={() => buy(s.id)}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  background: s.primary ? "#ffffff" : "transparent",
                  color: s.primary ? "#000000" : "#ffffff",
                  border: `1px solid ${s.primary ? "#ffffff" : "#333333"}`,
                  fontFamily: "var(--font-jetbrains-mono), monospace",
                  fontSize: "12px",
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  cursor: busy === s.id ? "wait" : "pointer",
                  opacity: busy === s.id ? 0.5 : 1,
                }}
              >
                {busy === s.id ? "Loading…" : "Checkout"}
              </button>
            </div>
          ))}
        </div>

        <p
          style={{
            marginTop: "32px",
            fontFamily: "var(--font-jetbrains-mono), monospace",
            fontSize: "11px",
            color: "#555555",
            letterSpacing: "0.04em",
          }}
        >
          Payments by Stripe. USD only at launch. Refunds on request, no theatre.
        </p>
      </section>
    </div>
  )
}
