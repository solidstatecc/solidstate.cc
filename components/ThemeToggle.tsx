"use client"

import { useEffect, useState } from "react"

type Theme = "dark" | "light"

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme
  try {
    localStorage.setItem("ss-theme", theme)
  } catch {
    /* private mode — theme still applies for the session */
  }
}

/* Stark half-circle glyph. Rotates 180° between themes; the mark itself
   stays monochrome so it reads in both. */
function Glyph({ theme }: { theme: Theme }) {
  return (
    <svg
      aria-hidden
      width="14"
      height="14"
      viewBox="0 0 14 14"
      style={{
        display: "block",
        transform: theme === "light" ? "rotate(180deg)" : "none",
        transition: "transform 200ms cubic-bezier(0.22, 1, 0.36, 1)",
      }}
    >
      <circle cx="7" cy="7" r="6" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M 7 1 A 6 6 0 0 1 7 13 Z" fill="currentColor" />
    </svg>
  )
}

export function ThemeToggle() {
  // Render nothing theme-specific until mounted: the server doesn't know
  // the stored choice, and a wrong-direction glyph would flash.
  const [theme, setTheme] = useState<Theme | null>(null)

  useEffect(() => {
    setTheme(document.documentElement.dataset.theme === "light" ? "light" : "dark")
  }, [])

  const next: Theme = theme === "light" ? "dark" : "light"

  return (
    <button
      type="button"
      className="ss-theme-toggle"
      aria-label={theme ? `Switch to ${next} mode` : "Switch theme"}
      title={theme ? `Switch to ${next} mode` : undefined}
      onClick={() => {
        if (!theme) return
        setTheme(next)
        applyTheme(next)
      }}
    >
      <Glyph theme={theme ?? "dark"} />
    </button>
  )
}
