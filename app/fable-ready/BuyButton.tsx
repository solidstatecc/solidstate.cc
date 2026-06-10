"use client"

import { useState } from "react"
import { FABLE_READY_PAYMENT_LINK } from "@/lib/stripe"

const mono = "var(--font-jetbrains-mono), monospace"

/**
 * Buys via /api/checkout (USD-only). Falls back to the hosted payment link
 * if the API rail errors and a link is configured.
 */
export function BuyButton({ label }: { label: string }) {
  const [busy, setBusy] = useState(false)
  const [failed, setFailed] = useState(false)

  async function buy() {
    if (busy) return
    setBusy(true)
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sku: "fable-ready" }),
      })
      const data = (await res.json()) as { url?: string }
      if (data.url) {
        window.location.href = data.url
        return
      }
      throw new Error("no checkout url")
    } catch {
      if (FABLE_READY_PAYMENT_LINK) {
        window.location.href = FABLE_READY_PAYMENT_LINK
      } else {
        setFailed(true)
        setBusy(false)
      }
    }
  }

  return (
    <span>
      <button
        onClick={buy}
        disabled={busy}
        style={{
          display: "inline-block",
          padding: "16px 28px",
          backgroundColor: "var(--fg)",
          color: "var(--bg)",
          border: "none",
          cursor: busy ? "wait" : "pointer",
          fontFamily: mono,
          fontSize: "13px",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          opacity: busy ? 0.7 : 1,
        }}
      >
        {busy ? "Opening checkout…" : label}
      </button>
      {failed && (
        <span style={{ display: "block", fontFamily: mono, fontSize: "12px", color: "var(--ink-4)", marginTop: "12px" }}>
          Checkout hiccup. Email hi@solidstate.cc — we&apos;ll send a payment link within the hour.
        </span>
      )}
    </span>
  )
}
