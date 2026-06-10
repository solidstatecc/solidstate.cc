"use client"

import Link from "next/link"
import { useRef } from "react"
import { ThemeToggle } from "@/components/ThemeToggle"

const LINKS = [
  { href: "/skills", label: "Skills" },
  { href: "/ship-kit", label: "Ship Kit" },
  { href: "/agents", label: "Agents" },
  { href: "/models", label: "Models" },
  { href: "/docs", label: "Docs" },
  { href: "/official", label: "Official" },
  { href: "/audits", label: "Audits" },
  { href: "/glossary", label: "Glossary" },
  { href: "/manifesto", label: "Manifesto" },
]

const linkStyle = {
  fontFamily: "var(--font-jetbrains-mono), monospace",
  fontSize: "12px",
  color: "var(--fg)",
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  padding: "6px 10px",
} as const

const ctaStyle = {
  fontFamily: "var(--font-jetbrains-mono), monospace",
  fontSize: "12px",
  color: "var(--bg)",
  backgroundColor: "var(--fg)",
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  padding: "8px 14px",
  marginLeft: "8px",
} as const

export function Nav() {
  const menuRef = useRef<HTMLDetailsElement>(null)
  const closeMenu = () => {
    if (menuRef.current) menuRef.current.open = false
  }

  return (
    <header
      style={{
        borderBottom: "1px solid var(--border)",
        padding: "0 32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: "56px",
        position: "sticky",
        top: 0,
        backgroundColor: "var(--bg)",
        zIndex: 50,
      }}
    >
      <Link
        href="/"
        aria-label="Solid State — home"
        style={{
          fontFamily: "var(--font-jetbrains-mono), monospace",
          fontSize: "13px",
          fontWeight: 700,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          display: "flex",
          alignItems: "center",
          gap: "7px",
        }}
      >
        <svg
          aria-hidden
          width="20"
          height="20"
          viewBox="0 0 32 32"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
          style={{ display: "block", flexShrink: 0 }}
        >
          <rect x="4" y="6" width="6" height="20" rx="1" />
          <rect x="13" y="6" width="6" height="20" rx="1" />
          <rect x="22" y="6" width="6" height="20" rx="1" />
        </svg>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo-white.png" alt="Solid State" className="ss-invertible" style={{ display: "block", height: "19px", width: "auto" }} />
      </Link>

      <nav aria-label="Primary" style={{ display: "flex", alignItems: "center" }}>
        {/* Desktop link row (hidden ≤768px via .ss-nav-desktop) */}
        <div className="ss-nav-desktop">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} style={linkStyle}>
              {l.label}
            </Link>
          ))}
          <Link href="/submit" style={ctaStyle}>
            Submit →
          </Link>
          <ThemeToggle />
        </div>

        {/* Mobile: toggle sits beside the disclosure menu (shown ≤768px) */}
        <details className="ss-nav-mobile" ref={menuRef}>
          <summary aria-label="Open menu">Menu</summary>
          <div className="ss-nav-menu">
            {LINKS.map((l) => (
              <Link key={l.href} href={l.href} onClick={closeMenu}>
                {l.label}
              </Link>
            ))}
            <Link href="/submit" onClick={closeMenu}>Submit →</Link>
          </div>
        </details>
        <span className="ss-nav-mobile-toggle">
          <ThemeToggle />
        </span>
      </nav>
    </header>
  )
}
