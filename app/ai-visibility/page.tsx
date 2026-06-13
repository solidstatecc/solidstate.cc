import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "AI Visibility Scorecard — where five engines cite us",
  description:
    "We ran our own AI SEO Kit on Solid State. The verdict, dated and unedited: 0 of 20 discovery citations across ChatGPT, Perplexity, Google AI Overviews, Claude, and Copilot. No fake numbers.",
  alternates: { canonical: "/ai-visibility" },
  openGraph: {
    title: "Solid State — AI Visibility Scorecard",
    description:
      "We ran our own kit on ourselves. 0 of 20 discovery citations across five AI engines, dated and unedited. The honest proof.",
    url: "https://solidstate.cc/ai-visibility",
    images: ["/opengraph-image.png"],
  },
}

const mono = "var(--font-jetbrains-mono), monospace"
const kicker: React.CSSProperties = { fontFamily: mono, fontSize: "11px", color: "var(--ink-4)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "16px" }
const h2: React.CSSProperties = { fontFamily: mono, fontSize: "22px", fontWeight: 700, letterSpacing: "-0.02em", margin: "0 0 16px" }
const body: React.CSSProperties = { fontSize: "15px", color: "var(--ink-7)", lineHeight: 1.65, maxWidth: "620px" }
const cell: React.CSSProperties = { fontFamily: mono, fontSize: "13px", padding: "10px 12px", borderBottom: "1px solid var(--border)" }
const head: React.CSSProperties = { ...cell, color: "var(--ink-4)", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.05em" }

const engines = [
  { e: "ChatGPT search", v: "PARTIAL", c: "1 / 6" },
  { e: "Perplexity", v: "PARTIAL", c: "2 / 6" },
  { e: "Google AI Overviews", v: "PARTIAL", c: "2 / 6" },
  { e: "Claude search", v: "PARTIAL", c: "1 / 6" },
  { e: "Copilot", v: "PARTIAL", c: "2 / 6" },
]

const split = [
  { t: "Discovery", q: "“best AI agent skills marketplace”", n: "0 of 5", tone: "bad" },
  { t: "Discovery", q: "“tools to audit a site for AI SEO”", n: "0 of 5", tone: "bad" },
  { t: "Navigational", q: "“Solid State skills marketplace”", n: "4 of 5", tone: "warn" },
  { t: "Navigational", q: "“solidstate.cc”", n: "5 of 5", tone: "ok" },
]
const toneColor: Record<string, string> = { ok: "var(--fg)", warn: "var(--ink-5)", bad: "var(--ink-4)" }

export default function AiVisibilityPage() {
  return (
    <div style={{ backgroundColor: "var(--bg)", minHeight: "100vh", color: "var(--fg)" }}>
      <div style={{ maxWidth: "820px", margin: "0 auto", padding: "96px 24px 64px" }}>
        <div style={kicker}>Solid State · AI Visibility Scorecard</div>
        <h1 style={{ fontFamily: mono, fontSize: "clamp(30px, 5vw, 44px)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.1, margin: "0 0 16px" }}>
          Where five AI engines cite us — and where they don&apos;t.
        </h1>
        <p style={{ fontFamily: mono, fontSize: "13px", color: "var(--ink-4)", marginBottom: "40px" }}>
          Snapshot 2026-06-13 · 6 queries × 5 engines · run with our own AI SEO Kit · re-run monthly
        </p>

        <div style={{ border: "1px solid var(--border)", backgroundColor: "var(--bg-2)", borderRadius: "8px", padding: "28px", marginBottom: "40px" }}>
          <div style={{ fontFamily: mono, fontSize: "44px", fontWeight: 700, letterSpacing: "-0.02em" }}>
            0 <span style={{ fontSize: "15px", color: "var(--ink-4)", fontWeight: 400 }}>/ 20 discovery citations</span>
          </div>
          <div style={{ fontFamily: mono, fontSize: "17px", fontWeight: 700, margin: "12px 0 8px" }}>
            Visible when you know us. Invisible when you don&apos;t.
          </div>
          <p style={{ ...body, color: "var(--ink-6)", margin: 0 }}>
            Across the four category queries — &ldquo;best AI agent skills marketplace,&rdquo; &ldquo;tools to audit a site for AI SEO,&rdquo; and two more — on all five engines, Solid State was named zero times. Every citation we earned came on a query that already contained our name. We ran this on ourselves. We publish it because the kit&apos;s whole promise is no fake numbers.
          </p>
        </div>

        <div style={kicker}>Per-engine verdict</div>
        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "12px" }}>
          <thead><tr><th style={head}>Engine</th><th style={head}>Verdict</th><th style={head}>Cited / tested</th><th style={head}>Best strength</th></tr></thead>
          <tbody>
            {engines.map((r) => (
              <tr key={r.e}>
                <td style={cell}>{r.e}</td>
                <td style={{ ...cell, color: "var(--ink-5)" }}>{r.v}</td>
                <td style={cell}>{r.c}</td>
                <td style={cell}>CITED</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p style={{ fontFamily: mono, fontSize: "12px", color: "var(--ink-4)", maxWidth: "620px", marginBottom: "40px" }}>
          No engine recommended Solid State for a job. The strongest result anywhere was CITED — and only on navigational queries.
        </p>

        <div style={kicker}>The split that matters</div>
        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "40px" }}>
          <thead><tr><th style={head}>Query type</th><th style={head}>Example</th><th style={head}>Engines citing us</th></tr></thead>
          <tbody>
            {split.map((r) => (
              <tr key={r.q}>
                <td style={cell}>{r.t}</td>
                <td style={{ ...cell, color: "var(--ink-6)" }}>{r.q}</td>
                <td style={{ ...cell, color: toneColor[r.tone], fontWeight: 700 }}>{r.n}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={kicker}>Where the gap is</div>
        <h2 style={h2}>Discovery, not retrieval.</h2>
        <p style={body}>
          The engines pull discovery answers from third-party roundups — kdnuggets, agensi.io, presenc.ai, awesome-agent-skills. Competitors named there get cited; we&apos;re in none of them. Retrieval already works: Perplexity quoted &ldquo;packaged judgment,&rdquo; Copilot quoted &ldquo;one install, three channels, no lock-in,&rdquo; Claude read our live catalog exactly. Once an engine reaches the site, it parses it correctly. The gap is being named in the sources engines trust — not the site itself.
        </p>

        <div style={{ marginTop: "48px", paddingTop: "32px", borderTop: "1px solid var(--border)" }}>
          <p style={{ ...body, marginBottom: "16px" }}>
            This scorecard is the output of one skill in the kit — <span style={{ fontFamily: mono }}>ai-visibility-check</span>. Same run, any site.
          </p>
          <Link href="/ai-seo-kit" style={{ display: "inline-block", fontFamily: mono, fontSize: "12px", fontWeight: 700, padding: "12px 22px", backgroundColor: "var(--fg)", color: "var(--bg)", borderRadius: "4px", textDecoration: "none", letterSpacing: "0.04em" }}>
            See the AI SEO Kit →
          </Link>
        </div>

        <p style={{ fontFamily: mono, fontSize: "11px", color: "var(--ink-4)", marginTop: "40px", lineHeight: 1.6 }}>
          Method: 6 queries × 5 engines, run 2026-06-13, scored from full transcripts including sources. Cells without transcripts are UNTESTED — none here. Nothing inferred. Citation shares move weekly; this is a dated snapshot, not a promise.
        </p>
      </div>
    </div>
  )
}
