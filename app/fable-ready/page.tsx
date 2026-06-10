import type { Metadata } from "next"
import Link from "next/link"
import { BuyButton } from "./BuyButton"

export const metadata: Metadata = {
  title: "fable-ready — your setup, ready for Fable 5",
  description:
    "Write-mode readiness audit for Claude Fable 5. Five documented breakage families, scanned and patched in your repo, ending in a dated FABLE-READY verdict. $49 once.",
  openGraph: {
    title: "Solid State fable-ready",
    description:
      "Fable 5 changed the rules underneath your setup. The patch, not the reading list. $49 once.",
    url: "https://solidstate.cc/fable-ready",
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

const families: Array<{ id: string; name: string; breaks: string; sev: string }> = [
  { id: "F1", name: "Reasoning-display triggers", breaks: "“Show your reasoning” prompts hit a refusal category that returns HTTP 200 — your pipeline reads it as success.", sev: "blocker" },
  { id: "F2", name: "Prescriptive step-lists", breaks: "Opus-era leashes degrade Fable output. Anthropic's own guidance: rewrite to intent + boundaries.", sev: "blocker" },
  { id: "F3", name: "Missing output discipline", breaks: "Fable narrates at high effort. No brevity rule means paying output prices for prose you delete.", sev: "warn" },
  { id: "F4", name: "Missing boundaries", breaks: "Fable acts on initiative — drafts the email, cuts the branch. No do/don't block means surprises.", sev: "warn" },
  { id: "F5", name: "Mechanics drift", breaks: "Manual thinking budgets now 400-error. Stale model strings run the old model silently. Timeouts tuned to Opus turns break mid-run.", sev: "blocker" },
]

const notFor = [
  "You don't have a CLAUDE.md or custom skills yet. There's nothing to audit — start with the free skills.",
  "You only use chat. Write-mode patches need a file-capable tool: Claude Code, Cowork, Cursor, OpenClaw, Hermes. Paste-only runs report-only.",
  "You want a spend meter. This audits files, not bills — the cost arithmetic ships as a reference, the dashboard doesn't.",
]

export default function FableReadyPage() {
  return (
    <div style={{ backgroundColor: "var(--bg)", minHeight: "100vh", color: "var(--fg)" }}>
      <div style={{ maxWidth: "880px", margin: "0 auto", padding: "96px 24px 64px" }}>
        {/* Hero */}
        <div style={kicker}>Solid State Original · Write-mode audit</div>
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
          Your setup,
          <br />
          ready for Fable 5.
        </h1>
        <p style={{ ...body15, fontSize: "16px", maxWidth: "560px", marginBottom: "40px" }}>
          Fable 5 changed the rules underneath Opus-era setups. Instructions that helped now hurt.
          Prompts that worked now end in refusals that look like success. fable-ready scans your
          repo, patches what you approve, and stamps a dated verdict.
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
          {`> fable-ready --target . --apply ask

F1  skills/research/SKILL.md:12   "show your full reasoning"   blocker
    PATCH → "state conclusions, list the evidence"             [apply? y]
F5  agents/researcher.json:4      "budget_tokens": 8000        blocker
    PATCH → remove; Fable rejects manual thinking budgets      [apply? y]

Re-scan: 0 blockers.
VERDICT: FABLE-READY (2026-06-12) → FABLE-READY.md`}
        </pre>

        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "20px", marginBottom: "8px" }}>
          <BuyButton label="Get fable-ready — $49" />
          <span style={{ fontFamily: mono, fontSize: "12px", color: "var(--ink-4)" }}>
            once · rules updates through v1.x · zip → unzip → verdict
          </span>
        </div>
      </div>

      {/* The five families */}
      <div style={{ borderTop: "1px solid var(--border)" }}>
        <div style={{ maxWidth: "880px", margin: "0 auto", padding: "64px 24px" }}>
          <div style={kicker}>01 — What breaks</div>
          <h2 style={h2}>Five families. Sourced, not vibed.</h2>
          <p style={{ ...body15, maxWidth: "560px", marginBottom: "32px" }}>
            Every rule carries an evidence grade and a source — an Anthropic doc, or a flagged
            community report. The worst failures return HTTP 200 and look like success. That&apos;s
            why this is a scan, not a checklist.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr)", gap: "0" }}>
            {families.map((f) => (
              <div
                key={f.id}
                className="ss-kit-row"
                style={{
                  display: "grid",
                  gridTemplateColumns: "minmax(0, 200px) minmax(0, 1fr) minmax(0, 64px)",
                  gap: "16px",
                  padding: "14px 0",
                  borderTop: "1px solid var(--border)",
                  alignItems: "baseline",
                }}
              >
                <span style={{ fontFamily: mono, fontSize: "13px", color: "var(--fg)" }}>
                  {f.id} · {f.name}
                </span>
                <span style={{ fontSize: "14px", color: "var(--ink-6)", lineHeight: 1.5 }}>{f.breaks}</span>
                <span style={{ fontFamily: mono, fontSize: "12px", color: "var(--ink-4)", textAlign: "right" }}>
                  {f.sev}
                </span>
              </div>
            ))}
          </div>

          <p style={{ fontFamily: mono, fontSize: "13px", color: "var(--ink-7)", marginTop: "24px" }}>
            Also in the zip: effort-map.md (task type → effort level, with the cost math),
            long-run.md, memory-bootstrap.md.
          </p>
        </div>
      </div>

      {/* How it runs */}
      <div style={{ borderTop: "1px solid var(--border)" }}>
        <div style={{ maxWidth: "880px", margin: "0 auto", padding: "64px 24px" }}>
          <div style={kicker}>02 — How it runs</div>
          <h2 style={h2}>Scan. Patch. Verdict.</h2>
          <div style={{ fontFamily: mono, fontSize: "13px", lineHeight: 2.1, color: "var(--ink-7)", marginTop: "16px" }}>
            <div>scan.py walks CLAUDE.md, skills, commands, agent configs — deterministic, stdlib, no network</div>
            <div>the model drafts the exact rewrite per finding, from the playbooks</div>
            <div>you approve each patch — meaning-changing patches are never auto-applied</div>
            <div>re-scan → FABLE-READY.md: dated verdict, rules version printed</div>
            <div>.solidstate/ present? The verdict logs itself. Ship Kit interop, not dependency.</div>
          </div>
          <p style={{ ...body15, marginTop: "20px", maxWidth: "560px" }}>
            The scanner catches what regexes can catch — reproducibly. The model judges what
            regexes can&apos;t. A flagged line is a question, not a conviction.
          </p>
        </div>
      </div>

      {/* Not for */}
      <div style={{ borderTop: "1px solid var(--border)" }}>
        <div style={{ maxWidth: "880px", margin: "0 auto", padding: "64px 24px" }}>
          <div style={kicker}>03 — Not for everyone</div>
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
          <div style={kicker}>04 — Provenance</div>
          <h2 style={h2}>Fable 5 patched its own migration.</h2>
          <p style={{ ...body15, maxWidth: "600px", marginBottom: "8px" }}>
            Written and audited by Claude (Fable 5) on the production line behind solidstate.cc —
            validated, positioned, audited, and launched with Ship Kit, on camera. The scanner ran
            on its own fixtures before it shipped; the example report in the zip is real output.
            The full run is published as a case study, receipts included.
          </p>
          <p style={{ ...body15, maxWidth: "600px", marginBottom: "40px" }}>
            Dated honesty: the rules are graded against the Fable 5 docs of 2026-06. Rules move;
            v1.x updates are included, and every report prints its rules version.
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
              $49
            </div>
            <div style={{ fontFamily: mono, fontSize: "12px", color: "var(--ink-4)", marginBottom: "24px" }}>
              once · rules updates through v1.x · no subscription
            </div>
            <BuyButton label="Get fable-ready" />
            <div style={{ fontFamily: mono, fontSize: "11px", color: "var(--ink-4)", marginTop: "16px" }}>
              Stripe checkout → instant zip download. One purchase, one operator — same honest
              terms as the <Link href="/ship-kit" style={{ color: "var(--ink-6)" }}>Ship Kit</Link>.
            </div>
          </div>

          <p style={{ fontFamily: mono, fontSize: "12px", color: "var(--ink-4)", marginTop: "40px" }}>
            Shipping a product, not just migrating one? The{" "}
            <Link href="/ship-kit" style={{ color: "var(--ink-6)" }}>
              Ship Kit
            </Link>{" "}
            is the system this skill was built with.
          </p>
        </div>
      </div>
    </div>
  )
}
