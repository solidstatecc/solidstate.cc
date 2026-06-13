import type { Metadata } from "next"
import Link from "next/link"
import { BuyButton } from "./BuyButton"
import { JsonLd } from "@/components/JsonLd"
import { productJsonLd } from "@/lib/seo"

export const metadata: Metadata = {
  title: "AI SEO Kit — AEO & GEO for AI engine visibility",
  description:
    "Answer and generative engine optimization (AEO / GEO) for any site. Nine agent skills make you legible to AI engines: audit, patch, verify. Dated verdicts, zero API keys. $149 once.",
  alternates: { canonical: "/ai-seo-kit" },
  openGraph: {
    title: "Solid State AI SEO Kit",
    description:
      "Audit your AI search visibility, patch the gaps, verify the fix. Nine skills, one proof run, dated verdicts. $149 once.",
    url: "https://solidstate.cc/ai-seo-kit",
    images: ["/opengraph-image.png"],
  },
}

const aiSeoKitProduct = productJsonLd({
  name: "Solid State AI SEO Kit",
  description:
    "Nine agent skills that make a site legible to AI engines. Audit, patch, verify. Every output dated and re-checkable. Zero API keys. $149 once.",
  path: "/ai-seo-kit",
  price: 149,
})

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

const skills: Array<{ id: string; name: string; job: string; output: string }> = [
  {
    id: "01",
    name: "seo-orchestrator",
    job: "Routes the work. Holds shared memory. Sequences runs.",
    output: "seo-memory.md + a run plan",
  },
  {
    id: "02",
    name: "ai-seo-audit",
    job: "Crawls the live site. Scores what AI engines see.",
    output: "Evidence-tiered findings, every row re-checkable",
  },
  {
    id: "03",
    name: "schema-patcher",
    job: "Writes JSON-LD into your codebase, in your stack's idiom.",
    output: "Patched files + green build + validated schema",
  },
  {
    id: "04",
    name: "agent-files",
    job: "Generates llms.txt, llms-full.txt, pricing.md, robots.txt AI groups.",
    output: "Four files, every link verified live",
  },
  {
    id: "05",
    name: "ai-visibility-check",
    job: "Runs your money queries across five AI engines.",
    output: "visibility-verdict-YYYY-MM-DD.md + optional scorecard page",
  },
  {
    id: "06",
    name: "index-rail",
    job: "Gets sitemap, canonicals, GSC, and IndexNow true.",
    output: "Logged checks + capped request-indexing list",
  },
  {
    id: "07",
    name: "brand-clarity-check",
    job: "Diagnoses the gap between what AI says you are and what you are.",
    output: "clarity-verdict-YYYY-MM-DD.md + fix worklist",
  },
  {
    id: "08",
    name: "authority-map",
    job: "Identifies which third-party domains AI engines cite in your category.",
    output: "authority-map-YYYY-MM-DD.md + placement worklist",
  },
  {
    id: "09",
    name: "ninety-day-rail",
    job: "Turns audit findings into a dated 90-day operating plan.",
    output: "ninety-day-plan-YYYY-MM-DD.md, every item source-traced",
  },
]

const notFor = [
  "You want content writing, keyword research, or backlinks. Those are different tools — this kit does none of them.",
  "You want a live dashboard or rank tracker. Every output is a dated file. Check it again by re-running the skill.",
  "You want a subscription. One purchase, one download, updates through v1.x — no recurring billing.",
]

export default function AiSeoKitPage() {
  return (
    <div style={{ backgroundColor: "var(--bg)", minHeight: "100vh", color: "var(--fg)" }}>
      <JsonLd data={aiSeoKitProduct} />
      <div style={{ maxWidth: "880px", margin: "0 auto", padding: "96px 24px 64px" }}>
        {/* Hero */}
        <div style={kicker}>Solid State Original · AI search visibility</div>
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
          Nine skills.
          <br />
          Your site, legible to AI.
        </h1>
        <p style={{ ...body15, fontSize: "16px", maxWidth: "560px", marginBottom: "40px" }}>
          AI engines don&apos;t rank pages — they cite sources they can read, trust, and verify.
          Some call this AEO or GEO — answer engine optimization, generative engine optimization.
          Same goal: get cited. This kit audits your site against that standard, patches the gaps,
          and stamps a dated verdict. Audit, patch, verify. Every output re-checkable with one command.
        </p>

        {/* Artifact before explanation */}
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
          {`> audit my AI SEO

[seo-orchestrator] Reading seo-memory.md … not found. First run.
[ai-seo-audit] Crawling solidstate.cc …

FINDINGS (2026-06-11)
  F01  Zero JSON-LD sitewide                          critical
  F02  No canonicals                                  critical
  F03  Sitemap: "Couldn't fetch" since Jun 7 in GSC   high
  F04  No og:image — broken shares on X               high
  F05  /account and /thanks pages indexable            medium
  … 5 more

[schema-patcher] Patching Organization + WebSite + Product …  done
[index-rail] Resubmitting sitemap in GSC …                    done
[ai-visibility-check] Running 5 engines …

VERDICT (2026-06-11): 8/10 faults fixed. 2 structural, 0 schema.
Saved → visibility-verdict-2026-06-11.md`}
        </pre>

        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "20px", marginBottom: "8px" }}>
          <BuyButton label="Get AI SEO Kit — $149" />
          <span style={{ fontFamily: mono, fontSize: "12px", color: "var(--ink-4)" }}>
            once · updates through v1.x · zip → unzip → run
          </span>
        </div>
      </div>

      {/* The nine skills */}
      <div style={{ borderTop: "1px solid var(--border)" }}>
        <div style={{ maxWidth: "880px", margin: "0 auto", padding: "64px 24px" }}>
          <div style={kicker}>01 — What you get</div>
          <h2 style={h2}>Nine skills. One sequenced workflow.</h2>
          <p style={{ ...body15, maxWidth: "560px", marginBottom: "32px" }}>
            The orchestrator routes the work. Each skill does one job. Every output is a
            dated file you can re-check. Nothing patches before the audit runs.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr)", gap: "0" }}>
            {skills.map((s) => (
              <div
                key={s.id}
                className="ss-kit-row"
                style={{
                  display: "grid",
                  gridTemplateColumns: "minmax(0, 210px) minmax(0, 1fr) minmax(0, 200px)",
                  gap: "16px",
                  padding: "14px 0",
                  borderTop: "1px solid var(--border)",
                  alignItems: "baseline",
                }}
              >
                <span style={{ fontFamily: mono, fontSize: "13px", color: "var(--fg)", whiteSpace: "nowrap" }}>
                  {s.id} · {s.name}
                </span>
                <span style={{ fontSize: "14px", color: "var(--ink-6)", lineHeight: 1.5 }}>{s.job}</span>
                <span style={{ fontFamily: mono, fontSize: "12px", color: "var(--ink-4)" }}>{s.output}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* The proof run */}
      <div style={{ borderTop: "1px solid var(--border)" }}>
        <div style={{ maxWidth: "880px", margin: "0 auto", padding: "64px 24px" }}>
          <div style={kicker}>02 — The proof run</div>
          <h2 style={h2}>solidstate.cc, 2026-06-11. One session.</h2>
          <p style={{ ...body15, maxWidth: "600px", marginBottom: "24px" }}>
            This kit ran on our own site before we sold it. The numbers below come from
            that run — no estimates, no projections.
          </p>

          <div
            style={{
              backgroundColor: "var(--bg-2)",
              border: "1px solid var(--border)",
              padding: "24px",
              maxWidth: "640px",
              marginBottom: "24px",
            }}
          >
            <div style={{ fontFamily: mono, fontSize: "13px", lineHeight: 2, color: "var(--ink-7)" }}>
              <div>Starting state: DR 2.2 · 5 clicks (3 months) · 1,860 impressions</div>
              <div>Sitemap: &quot;Couldn&apos;t fetch&quot; since Jun 7 · 66 of 412 URLs indexed</div>
              <div>Zero JSON-LD sitewide · no canonicals · no og:image</div>
              <div style={{ borderTop: "1px solid var(--border)", marginTop: "12px", paddingTop: "12px" }}>
                Ten faults found. Fourteen fixes shipped same session.
              </div>
              <div>431/431 static pages built clean after patching.</div>
              <div>Sitemap resubmitted in GSC — status pending recheck.</div>
            </div>
          </div>

          <p style={{ ...body15, maxWidth: "600px", marginBottom: "12px" }}>
            One fix: <Link href="/pricing.md" style={{ color: "var(--ink-6)" }}>/pricing.md</Link> — a machine-readable
            pricing file for agent buyers, generated from the same lib data as the site.
            No separate file to maintain. No drift surface added.
          </p>

          <p style={{ fontFamily: mono, fontSize: "13px", color: "var(--ink-4)", maxWidth: "600px" }}>
            What&apos;s not measured: citation lift, ranking movement, traffic change.
            Same-day runs can&apos;t measure those. The structural state is verified.
            Outcomes take weeks and a follow-up ai-visibility-check run.
          </p>

          <p style={{ ...body15, maxWidth: "600px", marginTop: "24px" }}>
            We also ran the visibility check on ourselves and published the result, unedited:{" "}
            <Link href="/ai-visibility" style={{ color: "var(--ink-6)" }}>0 of 20 discovery citations</Link>{" "}
            across five AI engines. The honest scorecard — same skill, any site.
          </p>
        </div>
      </div>

      {/* The four layers */}
      <div style={{ borderTop: "1px solid var(--border)" }}>
        <div style={{ maxWidth: "880px", margin: "0 auto", padding: "64px 24px" }}>
          <div style={kicker}>03 — The framework</div>
          <h2 style={h2}>Four layers. Discoverability, Clarity, Authority, Trust.</h2>
          <p style={{ ...body15, maxWidth: "600px", marginBottom: "24px" }}>
            The framework is the AI Search OS model, published by Semrush (ai-search.semrush.com,
            retrieved 2026-06-12). They named it DCAT. We built the toolchain.
            Their courses sell a Semrush stack — this kit needs none of it.
          </p>
          <div style={{ fontFamily: mono, fontSize: "13px", lineHeight: 2.0, color: "var(--ink-7)" }}>
            <div><span style={{ color: "var(--fg)" }}>Discoverability</span> — can AI fetch you at all? → ai-seo-audit, schema-patcher, agent-files, index-rail</div>
            <div><span style={{ color: "var(--fg)" }}>Clarity</span> — retrieved ≠ described correctly → brand-clarity-check</div>
            <div><span style={{ color: "var(--fg)" }}>Authority</span> — AI infers trust from third-party citations → authority-map</div>
            <div><span style={{ color: "var(--fg)" }}>Trust</span> — cited ≠ recommended. Measure recommendation strength → ai-visibility-check</div>
          </div>
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

      {/* Price block */}
      <div style={{ borderTop: "1px solid var(--border)" }}>
        <div style={{ maxWidth: "880px", margin: "0 auto", padding: "64px 24px 96px" }}>
          <div style={kicker}>05 — Get it</div>
          <h2 style={h2}>Verified on our own site first.</h2>
          <p style={{ ...body15, maxWidth: "600px", marginBottom: "8px" }}>
            Written, run, and audited on the Solid State production site — 2026-06-11.
            Ten faults found by the audit skill. Fourteen fixes shipped same session.
            The eval fixtures ship with the kit: the same ten faults seeded in a mini-site,
            a clean twin, and canned engine transcripts.
          </p>
          <p style={{ ...body15, maxWidth: "600px", marginBottom: "40px" }}>
            Evidence tiers on every platform claim. No fabrication.
            No FAQ schema without a visible FAQ. No ratings we don&apos;t have.
            These are hard rules inside the skills, not marketing copy.
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
              $149
            </div>
            <div style={{ fontFamily: mono, fontSize: "12px", color: "var(--ink-4)", marginBottom: "24px" }}>
              once · updates through v1.x · no subscription
            </div>
            <BuyButton label="Get AI SEO Kit" />
            <div style={{ fontFamily: mono, fontSize: "11px", color: "var(--ink-4)", marginTop: "16px" }}>
              Stripe checkout → instant zip download. Nine skills, the eval fixtures, README, CASE-STUDY.
              Same honest terms as{" "}
              <Link href="/ship-kit" style={{ color: "var(--ink-6)" }}>Ship Kit</Link>{" "}
              and{" "}
              <Link href="/fable-ready" style={{ color: "var(--ink-6)" }}>fable-ready</Link>.
            </div>
          </div>

          <p style={{ fontFamily: mono, fontSize: "12px", color: "var(--ink-4)", marginTop: "40px" }}>
            Shipping a product, not just fixing your SEO? The{" "}
            <Link href="/ship-kit" style={{ color: "var(--ink-6)" }}>
              Ship Kit
            </Link>{" "}
            is the system that runs the production line behind this kit.
          </p>
        </div>
      </div>
    </div>
  )
}
