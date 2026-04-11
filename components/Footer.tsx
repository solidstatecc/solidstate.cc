import Link from "next/link"

export function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid #1a1a1a",
        backgroundColor: "#0a0a0a",
        padding: "40px 24px",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ color: "#47DE43", fontSize: "12px" }}>▪</span>
          <span
            style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: "12px",
              fontWeight: 700,
              color: "#555555",
              letterSpacing: "-0.01em",
            }}
          >
            SOLID STATE
          </span>
          <span
            style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: "11px",
              color: "#333333",
              marginLeft: "8px",
            }}
          >
            solidstate.cc
          </span>
        </div>

        <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
          {[
            { href: "/skills", label: "Browse" },
            { href: "/submit", label: "Submit a Skill" },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              style={{
                fontFamily: "var(--font-jetbrains-mono), monospace",
                fontSize: "11px",
                color: "#555555",
                textDecoration: "none",
                letterSpacing: "0.03em",
              }}
            >
              {label}
            </Link>
          ))}
        </div>

        <span
          style={{
            fontFamily: "var(--font-jetbrains-mono), monospace",
            fontSize: "11px",
            color: "#333333",
          }}
        >
          © {new Date().getFullYear()} Solid State
        </span>
      </div>
    </footer>
  )
}
