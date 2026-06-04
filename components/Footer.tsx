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
      { href: "/llms.txt", label: "llms.txt", external: true },
      { href: "/llms-full.txt", label: "llms-full.txt", external: true },
    ],
  },
  {
    title: "Channels",
    links: [
      { href: "https://agentic.market/", label: "Agentic Market", external: true },
      { href: "https://www.shopclawmart.com/", label: "Claw Mart", external: true },
      { href: "https://clawhub.ai/user/solidstate", label: "ClawHub", external: true },
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
          className="ss-footer-grid"
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
              <svg
                aria-hidden
                width="16"
                height="16"
                viewBox="0 0 32 32"
                fill="#ffffff"
                xmlns="http://www.w3.org/2000/svg"
                style={{ display: "block", flexShrink: 0 }}
              >
                <rect x="4" y="6" width="6" height="20" rx="1" />
                <rect x="13" y="6" width="6" height="20" rx="1" />
                <rect x="22" y="6" width="6" height="20" rx="1" />
              </svg>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo-white.png" alt="Solid State" style={{ display: "block", height: "15px", width: "auto" }} />
            </div>
            <p
              style={{
                fontSize: "13px",
                color: "var(--muted)",
                lineHeight: 1.7,
                marginTop: "16px",
                maxWidth: "300px",
              }}
            >
              Working skills for AI agents. Verified. Operator-grade. Built by{" "}
              <a
                href="https://visionaire.co"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#ffffff", textDecoration: "none" }}
              >
                Visionaire Labs
              </a>.
            </p>
          </div>

          {COLS.map((col) => (
            <div key={col.title}>
              <div
                style={{
                  fontFamily: "var(--font-jetbrains-mono), monospace",
                  fontSize: "10px",
                  color: "var(--muted)",
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
              color: "var(--muted)",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            © {new Date().getFullYear()} Solid State ·{" "}
            <a
              href="https://visionaire.co"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "inherit", textDecoration: "none" }}
            >
              Visionaire Labs ↗
            </a>
          </span>
          <span
            style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: "11px",
              color: "var(--muted)",
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
