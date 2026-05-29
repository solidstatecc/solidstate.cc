"use client"

import Link from "next/link"

const LINKS = [
  { href: "/skills", label: "Skills" },
  { href: "/official", label: "Official" },
  { href: "/audits", label: "Audits" },
  { href: "/glossary", label: "Glossary" },
  { href: "/manifesto", label: "Manifesto" },
]

const linkStyle = {
  fontFamily: "var(--font-jetbrains-mono), monospace",
  fontSize: "12px",
  color: "#ffffff",
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  padding: "6px 10px",
} as const

const ctaStyle = {
  fontFamily: "var(--font-jetbrains-mono), monospace",
  fontSize: "12px",
  color: "#000000",
  backgroundColor: "#ffffff",
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  padding: "8px 14px",
  marginLeft: "8px",
} as const

export function Nav() {
  return (
    <header
      style={{
        borderBottom: "1px solid #222222",
        padding: "0 32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: "56px",
        position: "sticky",
        top: 0,
        backgroundColor: "#000000",
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
          gap: "10px",
        }}
      >
        <svg
          aria-hidden
          width="14"
          height="18"
          viewBox="0 0 18 24"
          fill="#ffffff"
          xmlns="http://www.w3.org/2000/svg"
          style={{ display: "block", flexShrink: 0 }}
        >
          <rect x="0" y="0" width="4" height="24" rx="1" />
          <rect x="7" y="0" width="4" height="24" rx="1" />
          <rect x="14" y="0" width="4" height="24" rx="1" />
        </svg>
        SolidState
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
        </div>

        {/* Mobile disclosure menu (shown ≤768px via .ss-nav-mobile) */}
        <details className="ss-nav-mobile">
          <summary aria-label="Open menu">Menu</summary>
          <div className="ss-nav-menu">
            {LINKS.map((l) => (
              <Link key={l.href} href={l.href}>
                {l.label}
              </Link>
            ))}
            <Link href="/submit">Submit →</Link>
          </div>
        </details>
      </nav>
    </header>
  )
}
