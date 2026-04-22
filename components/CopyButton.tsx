"use client"

import { useState } from "react"

interface CopyButtonProps {
  text: string
  label?: string
}

export function CopyButton({ text, label = "Copy" }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback
    }
  }

  return (
    <button
      onClick={handleCopy}
      style={{
        fontFamily: "var(--font-jetbrains-mono), monospace",
        fontSize: "11px",
        fontWeight: 600,
        color: copied ? "#ffffff" : "#ffffff",
        backgroundColor: "transparent",
        border: `1px solid ${copied ? "#ffffff" : "#000000"}`,
        padding: "5px 10px",
        borderRadius: "4px",
        cursor: "pointer",
        letterSpacing: "0.05em",
        textTransform: "uppercase",
        transition: "color 0.15s, border-color 0.15s",
        whiteSpace: "nowrap",
        flexShrink: 0,
      }}
    >
      {copied ? "✓ COPIED" : label}
    </button>
  )
}
