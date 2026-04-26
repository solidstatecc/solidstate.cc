"use client"

import Link from "next/link"

const LINKS = [
  { href: "/skills", label: "Skills" },
  { href: "/glossary", label: "Glossary" },
  { href: "/manifesto", label: "Manifesto" },
]

export function Nav() {
  return (
    <nav
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
        <span
          aria-hidden
          style={{
            display: "inline-block",
            width: "10px",
            height: "10px",
            backgroundColor: "#ffffff",
          }}
        />
        SolidState
      </Link>

      <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
        {LINKS.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: "12px",
              color: "#ffffff",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              padding: "6px 10px",
            }}
          >
            {l.label}
          </Link>
        ))}
        <Link
          href="/submit"
          style={{
            fontFamily: "var(--font-jetbrains-mono), monospace",
            fontSize: "12px",
            color: "#000000",
            backgroundColor: "#ffffff",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            padding: "8px 14px",
            marginLeft: "8px",
          }}
        >
          Submit →
        </Link>
      </div>
    </nav>
  )
}
