import type { Metadata } from "next"
import { officialMakers, OFFICIAL_STATS, type OfficialMaker } from "@/lib/official"
import { officialExtras, OFFICIAL_EXTRAS_STATS, type OfficialExtra } from "@/lib/officialExtras"

export const metadata: Metadata = {
  title: "Official Makers",
  description:
    "Official agent skills from the companies that build the technology — the makers teaching you how to use their product. Indexed from skills.sh.",
}

const mono = "var(--font-jetbrains-mono), monospace"

type Maker = OfficialMaker | (OfficialExtra & { extra: true })

const allMakers: Maker[] = [
  ...officialMakers,
  ...officialExtras.map((m) => ({ ...m, extra: true as const })),
].sort((a, b) => b.skills - a.skills || a.owner.localeCompare(b.owner))

const TOTAL_MAKERS = OFFICIAL_STATS.makers + OFFICIAL_EXTRAS_STATS.makers
const TOTAL_SKILLS = OFFICIAL_STATS.totalSkills + OFFICIAL_EXTRAS_STATS.totalSkills

export default function OfficialPage() {
  return (
    <div style={{ backgroundColor: "var(--bg)", minHeight: "100vh" }}>
      {/* Header */}
      <section
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "96px 32px 48px",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div
          style={{
            fontFamily: mono,
            fontSize: "11px",
            color: "var(--ink-1)",
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            marginBottom: "20px",
          }}
        >
          Official
        </div>
        <h1
          style={{
            fontFamily: mono,
            fontSize: "clamp(40px, 7vw, 72px)",
            fontWeight: 700,
            lineHeight: 0.98,
            letterSpacing: "-0.03em",
            color: "var(--fg)",
            margin: "0 0 24px",
          }}
        >
          The makers,
          <br />
          first-party.
        </h1>
        <p style={{ fontSize: "15px", color: "var(--ink-4)", maxWidth: "560px", lineHeight: 1.6, margin: 0 }}>
          Skills from the companies and organizations that build the technology — the makers
          teaching you how to use their product. {TOTAL_MAKERS} makers,{" "}
          {TOTAL_SKILLS.toLocaleString("en-US")} skills. Counts indexed from{" "}
          <a href="https://www.skills.sh/official" style={{ color: "var(--ink-8)" }}>
            skills.sh
          </a>
          .
        </p>
      </section>

      {/* Maker grid */}
      <section style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px 96px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 220px), 1fr))",
            gap: "12px",
          }}
        >
          {allMakers.map((m) => {
            const extra = "extra" in m ? m : null
            const body = (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={m.avatar}
                  alt={m.owner}
                  width={40}
                  height={40}
                  style={{ borderRadius: "6px", flexShrink: 0, backgroundColor: "var(--bg-3)" }}
                />
                <div style={{ minWidth: 0 }}>
                  <div
                    style={{
                      fontFamily: mono,
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "var(--fg)",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {m.owner}
                  </div>
                  <div style={{ fontFamily: mono, fontSize: "11px", color: "var(--ink-2)", marginTop: "3px" }}>
                    {m.repos} {m.repos === 1 ? "repo" : "repos"} · {m.skills} skills
                  </div>
                  {extra?.product && (
                    <a
                      href={extra.product.url}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        position: "relative",
                        zIndex: 1,
                        display: "inline-block",
                        fontFamily: mono,
                        fontSize: "11px",
                        color: "var(--ink-8)",
                        marginTop: "3px",
                        textDecoration: "none",
                      }}
                    >
                      {extra.product.label} ↗
                    </a>
                  )}
                </div>
              </>
            )
            const cardStyle = {
              display: "flex",
              alignItems: "center",
              gap: "14px",
              padding: "16px",
              border: "1px solid var(--border)",
              textDecoration: "none",
              color: "inherit",
              transition: "border-color 0.1s",
            } as const
            return extra ? (
              <div key={m.owner} style={{ ...cardStyle, position: "relative" }}>
                <a
                  href={extra.site}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={m.owner}
                  style={{ position: "absolute", inset: 0 }}
                />
                {body}
              </div>
            ) : (
              <a key={m.owner} href={m.url} target="_blank" rel="noreferrer" style={cardStyle}>
                {body}
              </a>
            )
          })}
        </div>
      </section>
    </div>
  )
}
