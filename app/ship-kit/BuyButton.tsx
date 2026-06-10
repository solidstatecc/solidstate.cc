"use client"

import { useState } from "react"
import { SHIP_KIT_PAYMENT_LINK } from "@/lib/stripe"

const mono = "var(--font-jetbrains-mono), monospace"

/**
 * Buys via /api/checkout (USD-only — adaptive pricing disabled for Checkout
 * sessions). Falls back to the hosted payment link if the API rail errors.
 */
export function BuyButton({ label }: { label: string }) {
  const [busy, setBusy] = useState(false)

  async function buy() {
    if (busy) return
    setBusy(true)
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sku: "ship-kit" }),
      })
      const data = (await res.json()) as { url?: string }
      window.location.href = data.url ?? SHIP_KIT_PAYMENT_LINK
    } catch {
      window.location.href = SHIP_KIT_PAYMENT_LINK
    }
  }

  return (
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
  )
}
