import type { Metadata } from "next"
import Link from "next/link"
import { BuyButton } from "./BuyButton"

export const metadata: Metadata = {
  title: "Ship Kit — a system, not a pile of skills",
  description:
    "Six skills, one orchestrator, one shared project memory. Your agent learns what you're shipping and routes you to done. $99 once, updates through v1.x.",
  openGraph: {
    title: "Solid State Ship Kit",
    description:
      "Turn an agent into a product team that ships. Orchestrator + project memory + six skills. $99 once.",
    url: "https://solidstate.cc/ship-kit",
  },
}

const mono = "var(--font-jetbrains-mono), monospace"

const kicker: React.CSSProperties = {
  fontFamily: mono,
  fontSize: "11px",
  color: "var(--ink-4)",
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  marginBottom: "16px",
}

const h2: React.CSSProperties = {
  fontFamily: mono,
  fontSize: "24px",
  fontWeight: 700,
  letterSpacing: "-0.02em",
  margin: 0,
  marginBottom: "16px",
}

const body15: React.CSSProperties = {
  fontSize: "15px",
  color: "var(--ink-7)",
  lineHeight: 1.65,
}

const skills: Array<{ name: string; job: string; alone: string }> = [
  { name: "ship-start", job: "The orchestrator. Two questions, gap analysis, routes you.", alone: "—" },
  { name: ".solidstate/ memory", job: "Four files every skill reads and writes. Yours, in your repo.", alone: "—" },
  { name: "ship-positioning", job: "The angle, contrast pairs, the not-for list, hero lines.", alone: "—" },
  { name: "ship-audit", job: "Write-mode audit. Checks, patches, re-runs until READY.", alone: "—" },
  { name: "launch-list", job: "Dated venue plan, announcement, 14-day measurement window.", alone: "—" },
  { name: "niche-hunter", job: "Ranked sub-niches: commission, SERP gap, trend, difficulty.", alone: "$19" },
  { name: "hyper-rational-brief", job: "Evidence-graded decision memos. Anti-slop filtered.", alone: "$29" },
  { name: "competitor-brief", job: "Graded competitive intel. Folds in on release — included.", alone: "$29" },
  { name: "geo-audit", job: "AI-citation visibility report. Folds in on release — included.", alone: "$29" },
]

const chains = [
  { say: '"I\'m starting from zero"', run: "intake → positioning → audit → launch" },
  { say: '"I need to validate this"', run: "niche-hunter → hyper-rational-brief (go / no-go)" },
  { say: '"I need an angle"', run: "ship-positioning → launch-list" },
  { say: '"I need to ship this week"', run: "ship-audit → launch-list" },
]

const notFor = [
  "You want marketing prompts. This is a shipping workflow, not a copy library.",
  "You want autopilot. You make the calls; the skills carry frameworks and memory.",
  "Your tool can't read and write files. The memory needs Claude Code, Cowork, Cursor, OpenClaw, or Hermes — paste-only chat runs a degraded mode.",
]

export default function ShipKitPage() {
  return (
    <div style={{ backgroundColor: "var(--bg)", minHeight: "100vh", color: "var(--fg)" }}>
      <div style={{ maxWidth: "880px", margin: "0 auto", padding: "96px 24px 64px" }}>
        {/* Hero */}
        <div style={kicker}>Solid State Original · System</div>
        <h1
          style={{
            fontFamily: mono,
            fontSize: "clamp(34px, 6vw, 52px)",
            fontWeight: 700,
            letterSpacing: "-0.03em",
            lineHeight: 1.08,
            margin: 0,
            marginBottom: "20px",
          }}
        >
          A system,
          <br />
          not a pile of skills.
        </h1>
        <p style={{ ...body15, fontSize: "16px", maxWidth: "560px", marginBottom: "40px" }}>
          Six skills, one orchestrator, one shared project memory. The kit lives in your repo —
          every session, your agent already knows what you&apos;re shipping, who it&apos;s for, and
          what&apos;s blocking it.
        </p>

        {/* The artifact, before the explanation */}
        <pre
          style={{
            fontFamily: mono,
            fontSize: "13px",
            lineHeight: 1.7,
            backgroundColor: "var(--bg-2)",
            border: "1px solid var(--border)",
            padding: "20px 24px",
            overflowX: "auto",
            marginBottom: "40px",
            color: "var(--ink-8)",
          }}
        >
          {`> /ship-start

Read .solidstate/ — project: changelog→release-notes skill, goal: 10 sales.
build-log: SKILL.md drafted 06-08. No audit verdict.

Gap: artifact exists, never audited.
→ ship-audit. Write mode is on — it patches what it flags.`}
        </pre>

        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "20px", marginBottom: "8px" }}>
          <BuyButton label="Get the kit — $99" />
          <span style={{ fontFamily: mono, fontSize: "12px", color: "var(--ink-4)" }}>
            once · updates through v1.x · zip → unzip → shipping
          </span>
        </div>
      </div>

      {/* What's inside */}
      <div style={{ borderTop: "1px solid var(--border)" }}>
        <div style={{ maxWidth: "880px", margin: "0 auto", padding: "64px 24px" }}>
          <div style={kicker}>01 — What&apos;s inside</div>
          <h2 style={h2}>The glue is the product.</h2>
          <p style={{ ...body15, maxWidth: "560px", marginBottom: "32px" }}>
            The skills do the work. The orchestrator and the memory make them one system — every
            skill reads the same project files and hands its output to the next.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr)", gap: "0" }}>
            {skills.map((s, i) => (
              <div
                key={s.name}
                className="ss-kit-row"
                style={{
                  display: "grid",
                  gridTemplateColumns: "minmax(0, 200px) minmax(0, 1fr) minmax(0, 56px)",
                  gap: "16px",
                  padding: "14px 0",
                  borderTop: i === 0 ? "1px solid var(--border)" : "1px solid var(--border)",
                  alignItems: "baseline",
                }}
              >
                <span style={{ fontFamily: mono, fontSize: "13px", color: "var(--fg)" }}>{s.name}</span>
                <span style={{ fontSize: "14px", color: "var(--ink-6)", lineHeight: 1.5 }}>{s.job}</span>
                <span style={{ fontFamily: mono, fontSize: "12px", color: "var(--ink-4)", textAlign: "right" }}>
                  {s.alone}
                </span>
              </div>
            ))}
          </div>

          <p style={{ fontFamily: mono, fontSize: "13px", color: "var(--ink-7)", marginTop: "24px" }}>
            Parts sold separately: $106+. The kit: $99 — with the glue the parts don&apos;t have.
          </p>
        </div>
      </div>

      {/* Chains */}
      <div style={{ borderTop: "1px solid var(--border)" }}>
        <div style={{ maxWidth: "880px", margin: "0 auto", padding: "64px 24px" }}>
          <div style={kicker}>02 — Chains</div>
          <h2 style={h2}>Name the goal. The system picks the route.</h2>
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr)", gap: "12px", marginTop: "24px" }}>
            {chains.map((c) => (
              <div
                key={c.say}
                className="ss-kit-chain"
                style={{
                  display: "grid",
                  gridTemplateColumns: "minmax(0, 220px) minmax(0, 1fr)",
                  gap: "16px",
                  padding: "12px 16px",
                  border: "1px solid var(--border)",
                  backgroundColor: "var(--bg-2)",
                  alignItems: "baseline",
                }}
              >
                <span style={{ fontSize: "14px", color: "var(--fg)" }}>{c.say}</span>
                <span style={{ fontFamily: mono, fontSize: "12px", color: "var(--ink-6)" }}>{c.run}</span>
              </div>
            ))}
          </div>
          <p style={{ ...body15, marginTop: "24px", maxWidth: "560px" }}>
            Each skill hands its artifact and the updated memory to the next. Your project knowledge
            lives in four plain-markdown files in your repo — readable forever, with or without us.
          </p>
        </div>
      </div>

      {/* First session */}
      <div style={{ borderTop: "1px solid var(--border)" }}>
        <div style={{ maxWidth: "880px", margin: "0 auto", padding: "64px 24px" }}>
          <div style={kicker}>03 — First session</div>
          <h2 style={h2}>The first run ends with an artifact.</h2>
          <div style={{ fontFamily: mono, fontSize: "13px", lineHeight: 2.1, color: "var(--ink-7)", marginTop: "16px" }}>
            <div>unzip into your tool — Claude Code, Cowork, Cursor, OpenClaw, Hermes</div>
            <div>run /ship-start in your project</div>
            <div>answer two questions: what are you shipping, what&apos;s the goal</div>
            <div>.solidstate/ memory written · gap named · route announced</div>
            <div>→ positioning brief, patched audit, or dated launch plan. On disk.</div>
          </div>
          <p style={{ ...body15, marginTop: "20px", maxWidth: "560px" }}>
            Not a tutorial. Not a setup wizard. The session ends with something you can ship.
          </p>
        </div>
      </div>

      {/* Not for */}
      <div style={{ borderTop: "1px solid var(--border)" }}>
        <div style={{ maxWidth: "880px", margin: "0 auto", padding: "64px 24px" }}>
          <div style={kicker}>04 — Not for everyone</div>
          <h2 style={h2}>Skip this if:</h2>
          <div style={{ marginTop: "16px" }}>
            {notFor.map((n) => (
              <p key={n} style={{ ...body15, maxWidth: "640px", margin: "0 0 12px" }}>
                {n}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* Provenance + price */}
      <div style={{ borderTop: "1px solid var(--border)" }}>
        <div style={{ maxWidth: "880px", margin: "0 auto", padding: "64px 24px 96px" }}>
          <div style={kicker}>05 — Provenance</div>
          <h2 style={h2}>No borrowed testimonials. Receipts instead.</h2>
          <p style={{ ...body15, maxWidth: "600px", marginBottom: "8px" }}>
            Written and audited by Claude (Fable 5) on the production line behind solidstate.cc.
            Same line ships the free Skill Auditor — it passed ClawHub&apos;s security scan on
            first upload. Every bundled script ran before it shipped. The purchase rail took a
            real card before it took yours. Solid State&apos;s four-agent Skill Production Squad
            maintains the kit from here.
          </p>
          <p style={{ ...body15, maxWidth: "600px", marginBottom: "40px" }}>
            The arithmetic is the pitch: $106+ of parts, $99 for the system, and the orchestrator +
            memory layer exist nowhere else.
          </p>

          <div
            style={{
              border: "1px solid var(--border)",
              backgroundColor: "var(--bg-2)",
              padding: "32px",
              maxWidth: "480px",
            }}
          >
            <div style={{ fontFamily: mono, fontSize: "40px", fontWeight: 700, marginBottom: "4px" }}>
              $99
            </div>
            <div style={{ fontFamily: mono, fontSize: "12px", color: "var(--ink-4)", marginBottom: "24px" }}>
              once · updates through v1.x · no subscription
            </div>
            <BuyButton label="Get the kit" />
            <div style={{ fontFamily: mono, fontSize: "11px", color: "var(--ink-4)", marginTop: "16px" }}>
              Stripe checkout → instant zip download. One purchase, one operator,{" "}
              <Link href="/ship-kit/license" style={{ color: "var(--ink-6)" }}>
                honest license
              </Link>
              .
            </div>
          </div>

          <p style={{ fontFamily: mono, fontSize: "12px", color: "var(--ink-4)", marginTop: "40px" }}>
            The free skills (geo-check, install-triage, the voice tools) stay free —{" "}
            <Link href="/skills" style={{ color: "var(--ink-6)" }}>
              in the directory
            </Link>
            . This kit is the system around them, not a paywall in front of them.
          </p>
        </div>
      </div>
    </div>
  )
}
