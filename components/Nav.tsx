"use client"

import Link from "next/link"

export function Nav() {
  return (
    <nav style={{
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
    }}>
      <Link href="/" style={{
        fontFamily: "monospace",
        fontSize: "13px",
        fontWeight: 700,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
      }}>
        SolidState
      </Link>
      <Link href="/submit" style={{
        fontFamily: "monospace",
        fontSize: "12px",
        color: "#555555",
        letterSpacing: "0.04em",
      }}>
        Submit a skill →
      </Link>
    </nav>
  )
}
