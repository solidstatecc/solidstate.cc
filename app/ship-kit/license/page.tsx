import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Ship Kit — license",
  description: "One purchase, one operator, unlimited own projects. The Ship Kit license in plain language.",
}

const mono = "var(--font-jetbrains-mono), monospace"

const h2: React.CSSProperties = {
  fontFamily: mono,
  fontSize: "18px",
  fontWeight: 700,
  margin: "32px 0 12px",
}

const p: React.CSSProperties = {
  fontSize: "15px",
  color: "var(--ink-7)",
  lineHeight: 1.65,
  margin: "0 0 12px",
  maxWidth: "640px",
}

export default function ShipKitLicensePage() {
  return (
    <div style={{ backgroundColor: "var(--bg)", minHeight: "100vh", color: "var(--fg)" }}>
      <div style={{ maxWidth: "880px", margin: "0 auto", padding: "96px 24px" }}>
        <div
          style={{
            fontFamily: mono,
            fontSize: "11px",
            color: "var(--ink-4)",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            marginBottom: "16px",
          }}
        >
          <Link href="/ship-kit" style={{ color: "var(--ink-4)", textDecoration: "none" }}>
            Ship Kit
          </Link>{" "}
          / license
        </div>
        <h1 style={{ fontFamily: mono, fontSize: "34px", fontWeight: 700, letterSpacing: "-0.02em", margin: 0 }}>
          The honest license.
        </h1>

        <h2 style={h2}>You may</h2>
        <p style={p}>
          Use the kit on any number of your own projects, commercial or personal. Modify any file —
          it&apos;s markdown, make it yours. Keep everything it writes: the memory, the briefs, the
          plans, the patches. Your outputs are yours. Use it inside client work you deliver, as a
          tool you operate.
        </p>

        <h2 style={h2}>You may not</h2>
        <p style={p}>
          Redistribute, resell, sublicense, or publicly post the kit or any skill in it, modified or
          not. Bundle it into a product, marketplace listing, template pack, or course. Share your
          purchase download link.
        </p>

        <h2 style={h2}>Scope</h2>
        <p style={p}>
          One purchase = one operator. A team where three people run the kit = three licenses.
          Honest math, honestly priced.
        </p>

        <h2 style={h2}>Updates</h2>
        <p style={p}>
          Updates through v1.x are included. Major versions are new products — v1 buyers get a
          discount, not an obligation. Your <code style={{ fontFamily: mono }}>.solidstate/</code>{" "}
          memory is never touched by updates.
        </p>

        <h2 style={h2}>The parts that stay free</h2>
        <p style={p}>
          niche-hunter and hyper-rational-brief also exist standalone under MIT — those stay MIT.
          This license covers the kit packaging, the system skills, and the memory spec as
          integrated here. The free Solid State skills stay free in{" "}
          <Link href="/skills" style={{ color: "var(--ink-6)" }}>
            the directory
          </Link>
          .
        </p>

        <p style={{ ...p, fontFamily: mono, fontSize: "13px", marginTop: "32px" }}>
          Questions: hi@solidstate.cc
        </p>
      </div>
    </div>
  )
}
