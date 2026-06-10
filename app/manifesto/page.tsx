import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Manifesto",
  description:
    "Solid State exists to put AI to work. Not in a deck. Not in a pilot. In production, today.",
}

// Provenance, not decoration. FOUNDED never changes. Bump REVISED only when
// the words above the sign-off change — same commit, every time.
const FOUNDED = "Apr 2026"
const REVISED = "Jun 2026"

const SECTIONS: Array<{ heading: string; body: string }> = [
  {
    heading: "Agent-first is happening.",
    body: "Software was desktop-first, then mobile-first. Now it is agent-first. We don't argue the shift. We build on it, the way 2010 built on mobile.",
  },
  {
    heading: "A skill is packaged judgment.",
    body: "Instructions that teach an agent how to think when it hits a task it has seen before. Physically: a folder with a SKILL.md inside. The judgment is the product. The format is open.",
  },
  {
    heading: "Working code, not wrappers.",
    body: "AI is a tool. The job is to ship work. Solid State packages narrow, working capabilities. Each one does one thing, costs what it costs, and runs today.",
  },
  {
    heading: "Compute is cheap. Bad output is not.",
    body: "Agents that ship wrong work cost more than agents that admit they cannot. Every Solid State skill is built around verification first, capability second.",
  },
  {
    heading: "No theater.",
    body: "No mysticism, no manifesto theater inside a skill. The agent shows up, does the work, returns a result. If it cannot, it says so and stops.",
  },
  {
    heading: "Operators, not users.",
    body: "We build for the people who run the work, not the people who watch the work. Founders, ops leads, solo operators, lean teams. The brief is always: get to ship.",
  },
  {
    heading: "Open where it's free. Paid where it isn't.",
    body: "Install free skills from the directory. Buy the Ship Kit when you want the system around them. Open formats, open sources cited, open data where we can. We will not pretend a thing is free that costs us to run. One brand, no lock-in.",
  },
]

export default function ManifestoPage() {
  return (
    <div style={{ backgroundColor: "var(--bg)", minHeight: "100vh" }}>
      {/* Header */}
      <section
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "120px 32px 80px",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-jetbrains-mono), monospace",
            fontSize: "11px",
            color: "var(--ink-1)",
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            marginBottom: "24px",
          }}
        >
          Manifesto
        </div>
        <h1
          style={{
            fontFamily: "var(--font-jetbrains-mono), monospace",
            fontSize: "clamp(56px, 11vw, 128px)",
            fontWeight: 700,
            lineHeight: 0.92,
            letterSpacing: "-0.04em",
            color: "var(--fg)",
            marginBottom: "40px",
          }}
        >
          Ship the
          <br />
          work.
        </h1>
        <p
          style={{
            fontFamily: "var(--font-inter), system-ui, sans-serif",
            fontSize: "18px",
            lineHeight: 1.6,
            color: "var(--ink-5)",
            maxWidth: "640px",
          }}
        >
          Solid State exists to put AI to work. Not in a deck. Not in a pilot. In production, today.
        </p>
      </section>

      {/* Sections */}
      <section
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "80px 32px 120px",
        }}
      >
        {SECTIONS.map((s, i) => (
          <div
            key={i}
            style={{
              display: "grid",
              gridTemplateColumns: "80px 1fr",
              gap: "32px",
              padding: "40px 0",
              borderBottom:
                i < SECTIONS.length - 1 ? "1px solid var(--border)" : "none",
              alignItems: "baseline",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-jetbrains-mono), monospace",
                fontSize: "13px",
                color: "var(--ink-1)",
                letterSpacing: "0.04em",
              }}
            >
              {String(i + 1).padStart(2, "0")}
            </div>
            <div>
              <h2
                style={{
                  fontFamily: "var(--font-jetbrains-mono), monospace",
                  fontSize: "clamp(28px, 4vw, 44px)",
                  fontWeight: 700,
                  lineHeight: 1.05,
                  letterSpacing: "-0.025em",
                  color: "var(--fg)",
                  marginBottom: "20px",
                }}
              >
                {s.heading}
              </h2>
              <p
                style={{
                  fontFamily: "var(--font-inter), system-ui, sans-serif",
                  fontSize: "17px",
                  lineHeight: 1.65,
                  color: "var(--ink-8)",
                  maxWidth: "640px",
                }}
              >
                {s.body}
              </p>
            </div>
          </div>
        ))}

        {/* Sign-off */}
        <div
          style={{
            marginTop: "80px",
            paddingTop: "40px",
            borderTop: "1px solid var(--border)",
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "24px",
            alignItems: "baseline",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: "12px",
              color: "var(--ink-1)",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Solid State · Visionaire Labs · {FOUNDED} · rev {REVISED}
          </div>
          <Link
            href="/skills"
            style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: "12px",
              color: "var(--bg)",
              backgroundColor: "var(--fg)",
              padding: "12px 20px",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            See the work →
          </Link>
        </div>
      </section>
    </div>
  )
}
