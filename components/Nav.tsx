"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export function Nav() {
  const pathname = usePathname()

  return (
    <nav
      style={{
        backgroundColor: "#0a0a0a",
        borderBottom: "1px solid #1a1a1a",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "56px",
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          style={{
            fontFamily: "var(--font-jetbrains-mono), monospace",
            fontSize: "15px",
            fontWeight: 700,
            color: "#f0f0f0",
            textDecoration: "none",
            letterSpacing: "-0.02em",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <span style={{ color: "#47DE43" }}>▪</span>
          SOLID STATE
        </Link>

        {/* Nav links */}
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          {[
            { href: "/skills", label: "Browse" },
            { href: "/submit", label: "Submit" },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              style={{
                fontFamily: "var(--font-jetbrains-mono), monospace",
                fontSize: "12px",
                fontWeight: 500,
                color: pathname === href ? "#f0f0f0" : "#888888",
                textDecoration: "none",
                padding: "6px 12px",
                borderRadius: "4px",
                backgroundColor: pathname === href ? "#1a1a1a" : "transparent",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                transition: "color 0.15s, background-color 0.15s",
              }}
            >
              {label}
            </Link>
          ))}
          <Link
            href="/skills"
            style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: "11px",
              fontWeight: 600,
              color: "#0a0a0a",
              backgroundColor: "#47DE43",
              textDecoration: "none",
              padding: "6px 14px",
              borderRadius: "4px",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              marginLeft: "8px",
            }}
          >
            Get Skills
          </Link>
        </div>
      </div>
    </nav>
  )
}
