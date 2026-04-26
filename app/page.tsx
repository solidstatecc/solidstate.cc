"use client"
import Link from "next/link"
import { skills, getFeaturedSkills, STATS } from "@/lib/skills"

export default function HomePage() {
  const featured = getFeaturedSkills()

  return (
    <div style={{ backgroundColor: "#000000", minHeight: "100vh" }}>

      {/* Hero */}
      <section style={{
        padding: "120px 32px 80px",
        borderBottom: "1px solid #222222",
        maxWidth: "1200px",
        margin: "0 auto",
      }}>
        <h1 style={{
          fontFamily: "monospace",
          fontSize: "clamp(48px, 10vw, 120px)",
          fontWeight: 700,
          lineHeight: 0.95,
          letterSpacing: "-0.03em",
          marginBottom: "48px",
          color: "#ffffff",
        }}>
          Solid<br />State
        </h1>

        <p style={{
          fontFamily: "monospace",
          fontSize: "14px",
          color: "#555555",
          letterSpacing: "0.04em",
          marginBottom: "64px",
          maxWidth: "480px",
          lineHeight: 1.7,
        }}>
          The skills marketplace for AI agents.<br />
          One install. Three channels. No lock-in.
        </p>

        {/* Stats */}
        <div style={{
          display: "flex",
          gap: "0",
          borderTop: "1px solid #222222",
        }}>
          {[
            { n: STATS.totalSkills, label: "skills" },
            { n: STATS.totalPlatforms, label: "platforms" },
            { n: STATS.totalInstalls.toLocaleString(), label: "installs" },
          ].map((s, i) => (
            <div key={i} style={{
              flex: 1,
              padding: "24px 0",
              borderRight: i < 2 ? "1px solid #222222" : "none",
              paddingRight: i < 2 ? "32px" : "0",
              paddingLeft: i > 0 ? "32px" : "0",
            }}>
              <div style={{
                fontFamily: "monospace",
                fontSize: "clamp(24px, 4vw, 48px)",
                fontWeight: 700,
                color: "#ffffff",
                letterSpacing: "-0.02em",
              }}>
                {s.n}
              </div>
              <div style={{
                fontFamily: "monospace",
                fontSize: "11px",
                color: "#555555",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                marginTop: "4px",
              }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "64px 32px",
        borderBottom: "1px solid #222222",
      }}>
        <div style={{
          fontFamily: "monospace",
          fontSize: "11px",
          color: "#555555",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          marginBottom: "32px",
        }}>
          Featured
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: "0",
        }}>
          {featured.map((skill, i) => (
            <Link key={skill.id} href={`/skills/${skill.slug}`} style={{
              display: "block",
              padding: "32px",
              borderRight: "1px solid #222222",
              borderBottom: "1px solid #222222",
              borderLeft: i === 0 ? "1px solid #222222" : "none",
              transition: "background 0.1s",
            }}
            onMouseEnter={e => (e.currentTarget.style.background = "#0a0a0a")}
            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
            >
              <div style={{
                fontFamily: "monospace",
                fontSize: "13px",
                fontWeight: 700,
                marginBottom: "8px",
                letterSpacing: "-0.01em",
              }}>
                {skill.name}
              </div>
              <div style={{
                fontSize: "13px",
                color: "#555555",
                lineHeight: 1.6,
                marginBottom: "24px",
              }}>
                {skill.description}
              </div>
              <div style={{
                fontFamily: "monospace",
                fontSize: "11px",
                color: "#333333",
                backgroundColor: "#0d0d0d",
                padding: "8px 12px",
                letterSpacing: "0.02em",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                marginBottom: "16px",
              }}>
                {skill.installCommand}
              </div>
              <div style={{
                fontFamily: "monospace",
                fontSize: "11px",
                color: skill.price === 0 ? "#ffffff" : "#555555",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}>
                {skill.price === 0 ? "Free" : `$${skill.price}`}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* All Skills — zine index */}
      <section style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "64px 32px",
      }}>
        <div style={{
          fontFamily: "monospace",
          fontSize: "11px",
          color: "#555555",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          marginBottom: "32px",
        }}>
          All Skills
        </div>

        <div>
          {skills.map((skill, i) => (
            <Link key={skill.id} href={`/skills/${skill.slug}`} style={{
              display: "grid",
              gridTemplateColumns: "1fr auto",
              alignItems: "baseline",
              padding: "20px 0",
              borderBottom: "1px solid #222222",
              gap: "24px",
            }}>
              <div>
                <span style={{
                  fontFamily: "monospace",
                  fontSize: "14px",
                  fontWeight: 600,
                  marginRight: "16px",
                }}>
                  {skill.name}
                </span>
                <span style={{
                  fontSize: "13px",
                  color: "#555555",
                }}>
                  {skill.description}
                </span>
              </div>
              <div style={{
                fontFamily: "monospace",
                fontSize: "11px",
                color: "#555555",
                letterSpacing: "0.06em",
                whiteSpace: "nowrap",
              }}>
                {skill.price === 0 ? "Free" : `$${skill.price}`}
              </div>
            </Link>
          ))}
        </div>
      </section>

    </div>
  )
}
