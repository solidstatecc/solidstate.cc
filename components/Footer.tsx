import Link from "next/link"

const COLS: Array<{
  title: string
  links: Array<{ href: string; label: string; external?: boolean }>
}> = [
  {
    title: "Product",
    links: [
      { href: "/skills", label: "Skills directory" },
      { href: "/glossary", label: "Glossary" },
      { href: "/manifesto", label: "Manifesto" },
      { href: "/submit", label: "Submit a skill" },
    ],
  },
  {
    title: "Channels",
    links: [
      { href: "https://agentic.market/", label: "Agentic Market", external: true },
      { href: "https://www.shopclawmart.com/", label: "Claw Mart", external: true },
      { href: "https://x.com/solidstate_cc", label: "X", external: true },
      { href: "https://github.com/solidstatecc", label: "GitHub", external: true },
      { href: "https://solidstate.beehiiv.com/subscribe", label: "Newsletter", external: true },
    ],
  },
  {
    title: "Contact",
    links: [{ href: "mailto:hi@solidstate.cc", label: "hi@solidstate.cc" }],
  },
]

export function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid #222222",
        backgroundColor: "#000000",
        color: "#ffffff",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "56px 32px 32px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.4fr repeat(3, 1fr)",
            gap: "32px",
            marginBottom: "48px",
          }}
        >
          <div>
            <div
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
            </div>
            <p
              style={{
                fontSize: "13px",
                color: "#555555",
                lineHeight: 1.7,
                marginTop: "16px",
                maxWidth: "300px",
              }}
            >
              Hyper-rational AI market intelligence. Skills, directory, glossary. Built by Visionaire Labs.
            </p>
          </div>

          {COLS.map((col) => (
            <div key={col.title}>
              <div
                style={{
                  fontFamily: "var(--font-jetbrains-mono), monospace",
                  fontSize: "10px",
                  color: "#555555",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  marginBottom: "16px",
                }}
              >
                {col.title}
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {col.links.map((l) => (
                  <li key={l.href} style={{ marginBottom: "8px" }}>
                    <Link
                      href={l.href}
                      target={l.external ? "_blank" : undefined}
                      rel={l.external ? "noopener noreferrer" : undefined}
                      style={{ fontSize: "13px", color: "#ffffff" }}
                    >
                      {l.label} {l.external ? "↗" : ""}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div
          style={{
            borderTop: "1px solid #222222",
            paddingTop: "24px",
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: "11px",
              color: "#555555",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            © {new Date().getFullYear()} Solid State · Visionaire Labs
          </span>
          <span
            style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: "11px",
              color: "#555555",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            solidstate.cc
          </span>
        </div>
      </div>
    </footer>
  )
}
