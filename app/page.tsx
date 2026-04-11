import Link from "next/link"
import { skills, getFeaturedSkills, STATS, CATEGORIES } from "@/lib/skills"
import { SkillCard } from "@/components/SkillCard"

export default function HomePage() {
  const featured = getFeaturedSkills()

  return (
    <div style={{ backgroundColor: "#0a0a0a" }}>
      <style>{`
        .cat-link { border: 1px solid #1a1a1a !important; transition: border-color 0.15s; }
        .cat-link:hover { border-color: #333333 !important; }
        .hero-cta-secondary:hover { border-color: #555555 !important; color: #f0f0f0 !important; }
      `}</style>

      {/* Hero */}
      <section
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "80px 24px 64px",
          borderBottom: "1px solid #1a1a1a",
        }}
      >
        {/* Eyebrow */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "28px",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: "10px",
              fontWeight: 600,
              color: "#76b900",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            Skills Marketplace
          </span>
          <span style={{ color: "#333333", fontSize: "10px" }}>·</span>
          <span
            style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: "10px",
              color: "#555555",
              letterSpacing: "0.06em",
            }}
          >
            multi-platform · verified · operator-grade
          </span>
        </div>

        {/* Headline */}
        <h1
          style={{
            fontFamily: "var(--font-jetbrains-mono), monospace",
            fontSize: "clamp(28px, 5vw, 52px)",
            fontWeight: 700,
            color: "#f0f0f0",
            letterSpacing: "-0.03em",
            lineHeight: "1.1",
            maxWidth: "720px",
            margin: "0 0 20px",
          }}
        >
          The skills registry for AI agents.
        </h1>

        <p
          style={{
            fontSize: "16px",
            color: "#888888",
            lineHeight: "1.6",
            maxWidth: "520px",
            margin: "0 0 36px",
          }}
        >
          Browse, install, and publish skills for OpenClaw, Hermes, Google
          Antigravity, Aura, and more. Every skill tested. No bloat.
        </p>

        {/* CTA */}
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <Link
            href="/skills"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              backgroundColor: "#76b900",
              color: "#0a0a0a",
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: "12px",
              fontWeight: 700,
              padding: "10px 20px",
              borderRadius: "4px",
              textDecoration: "none",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            Browse Skills →
          </Link>
          <Link
            href="/submit"
            className="hero-cta-secondary"
            style={{
              display: "inline-flex",
              alignItems: "center",
              backgroundColor: "transparent",
              color: "#888888",
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: "12px",
              fontWeight: 500,
              padding: "10px 20px",
              borderRadius: "4px",
              textDecoration: "none",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              border: "1px solid #333333",
            }}
          >
            Submit a Skill
          </Link>
        </div>
      </section>

      {/* Stats bar */}
      <section
        style={{
          borderBottom: "1px solid #1a1a1a",
          backgroundColor: "#0d0d0d",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "0 24px",
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          {[
            { value: STATS.totalSkills, label: "skills" },
            { value: STATS.totalPlatforms, label: "platforms" },
            {
              value: Math.round(STATS.totalInstalls / 1000) + "k+",
              label: "installs",
            },
          ].map((stat, i) => (
            <div
              key={stat.label}
              style={{
                padding: "20px 40px 20px 0",
                marginRight: i < 2 ? "40px" : 0,
                borderRight: i < 2 ? "1px solid #1a1a1a" : "none",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-jetbrains-mono), monospace",
                  fontSize: "22px",
                  fontWeight: 700,
                  color: "#f0f0f0",
                  letterSpacing: "-0.02em",
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-jetbrains-mono), monospace",
                  fontSize: "10px",
                  color: "#555555",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  marginTop: "2px",
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured skills */}
      <section
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "56px 24px",
          borderBottom: "1px solid #1a1a1a",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "24px",
          }}
        >
          <h2
            style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: "13px",
              fontWeight: 600,
              color: "#f0f0f0",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              margin: 0,
            }}
          >
            Featured
          </h2>
          <Link
            href="/skills"
            style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: "11px",
              color: "#76b900",
              textDecoration: "none",
              letterSpacing: "0.04em",
            }}
          >
            View all →
          </Link>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "12px",
          }}
        >
          {featured.map((skill) => (
            <SkillCard key={skill.id} skill={skill} />
          ))}
        </div>
      </section>

      {/* Categories */}
      <section
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "56px 24px",
          borderBottom: "1px solid #1a1a1a",
        }}
      >
        <h2
          style={{
            fontFamily: "var(--font-jetbrains-mono), monospace",
            fontSize: "13px",
            fontWeight: 600,
            color: "#f0f0f0",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            margin: "0 0 20px",
          }}
        >
          Categories
        </h2>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {CATEGORIES.map((cat) => {
            const count = skills.filter((s) => s.categories.includes(cat)).length
            return (
              <Link
                key={cat}
                href={`/skills?category=${encodeURIComponent(cat)}`}
                className="cat-link"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  backgroundColor: "#111111",
                  borderRadius: "4px",
                  padding: "10px 16px",
                  textDecoration: "none",
                  color: "inherit",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-jetbrains-mono), monospace",
                    fontSize: "12px",
                    fontWeight: 500,
                    color: "#f0f0f0",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {cat}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-jetbrains-mono), monospace",
                    fontSize: "10px",
                    color: "#555555",
                    backgroundColor: "#1a1a1a",
                    padding: "1px 5px",
                    borderRadius: "2px",
                  }}
                >
                  {count}
                </span>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Recent / all skills */}
      <section
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "56px 24px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "24px",
          }}
        >
          <h2
            style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: "13px",
              fontWeight: 600,
              color: "#f0f0f0",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              margin: 0,
            }}
          >
            Recent
          </h2>
          <Link
            href="/skills"
            style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: "11px",
              color: "#76b900",
              textDecoration: "none",
              letterSpacing: "0.04em",
            }}
          >
            Browse all →
          </Link>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "12px",
          }}
        >
          {skills.slice(0, 9).map((skill) => (
            <SkillCard key={skill.id} skill={skill} compact />
          ))}
        </div>
      </section>

      {/* Submit CTA */}
      <section
        style={{
          borderTop: "1px solid #1a1a1a",
          backgroundColor: "#0d0d0d",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "64px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "32px",
            flexWrap: "wrap",
          }}
        >
          <div>
            <h2
              style={{
                fontFamily: "var(--font-jetbrains-mono), monospace",
                fontSize: "20px",
                fontWeight: 700,
                color: "#f0f0f0",
                letterSpacing: "-0.02em",
                margin: "0 0 8px",
              }}
            >
              Built a skill?
            </h2>
            <p style={{ fontSize: "14px", color: "#888888", margin: 0 }}>
              Submit it to the registry. Get installs. Get paid.
            </p>
          </div>
          <Link
            href="/submit"
            style={{
              display: "inline-flex",
              alignItems: "center",
              backgroundColor: "#76b900",
              color: "#0a0a0a",
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: "12px",
              fontWeight: 700,
              padding: "10px 20px",
              borderRadius: "4px",
              textDecoration: "none",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              whiteSpace: "nowrap",
            }}
          >
            Submit a Skill →
          </Link>
        </div>
      </section>
    </div>
  )
}
