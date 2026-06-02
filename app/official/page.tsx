import type { Metadata } from "next"
import { officialMakers, OFFICIAL_STATS } from "@/lib/official"

export const metadata: Metadata = {
  title: "Official Makers",
  description:
    "Official agent skills from the companies that build the technology — the makers teaching you how to use their product. Indexed from skills.sh.",
}

// Match /skills: cap edge TTL so maker/skill counts refresh within an hour of a deploy.
export const revalidate = 3600

const mono = "var(--font-jetbrains-mono), monospace"

export default function OfficialPage() {
  return (
    <div style={{ backgroundColor: "#000000", minHeight: "100vh" }}>
      {/* Header */}
      <section
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "96px 32px 48px",
          borderBottom: "1px solid #222222",
        }}
      >
        <div
          style={{
            fontFamily: mono,
            fontSize: "11px",
            color: "#555555",
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
            color: "#ffffff",
            margin: "0 0 24px",
          }}
        >
          The makers,
          <br />
          first-party.
        </h1>
        <p style={{ fontSize: "15px", color: "#888888", maxWidth: "560px", lineHeight: 1.6, margin: 0 }}>
          Skills from the companies and organizations that build the technology — the makers
          teaching you how to use their product. {OFFICIAL_STATS.makers} makers,{" "}
          {OFFICIAL_STATS.totalSkills.toLocaleString("en-US")} skills. Counts indexed from{" "}
          <a href="https://www.skills.sh/official" style={{ color: "#cccccc" }}>
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
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: "12px",
          }}
        >
          {officialMakers.map((m) => (
            <a
              key={m.owner}
              href={m.url}
              target="_blank"
              rel="noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
                padding: "16px",
                border: "1px solid #222222",
                textDecoration: "none",
                color: "inherit",
                transition: "border-color 0.1s",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={m.avatar}
                alt={m.owner}
                width={40}
                height={40}
                style={{ borderRadius: "6px", flexShrink: 0, backgroundColor: "#111" }}
              />
              <div style={{ minWidth: 0 }}>
                <div
                  style={{
                    fontFamily: mono,
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "#ffffff",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {m.owner}
                </div>
                <div style={{ fontFamily: mono, fontSize: "11px", color: "#666666", marginTop: "3px" }}>
                  {m.repos} {m.repos === 1 ? "repo" : "repos"} · {m.skills} skills
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>
    </div>
  )
}
