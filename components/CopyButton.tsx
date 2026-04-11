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
        color: copied ? "#47DE43" : "#888888",
        backgroundColor: "transparent",
        border: `1px solid ${copied ? "rgba(118,185,0,0.3)" : "#333333"}`,
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
