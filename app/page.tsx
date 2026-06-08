"use client"
import Link from "next/link"
import { skills, getFeaturedSkills, getTopByCategory, STATS } from "@/lib/skills"
import { getRankedAgents, AGENT_STATS, SURFACE_LABEL } from "@/lib/agents"
import { priceDisplay } from "@/lib/x402"
import { formatInstalls } from "@/lib/format"

const BOARD_CATEGORIES = ["Engineering", "Marketing", "Productivity", "Design & UI"]

export default function HomePage() {
  const featured = getFeaturedSkills()
  const rankedAgents = getRankedAgents(skills)
  const heroAgents = rankedAgents.slice(0, 4)
  const boards = BOARD_CATEGORIES.map(c => ({ category: c, top: getTopByCategory(c, 5) }))
    .filter(b => b.top.length >= 3)

  return (
    <div style={{ backgroundColor: "var(--bg)", minHeight: "100vh" }}>

      {/* Hero */}
      <section style={{
        padding: "120px 32px 80px",
        borderBottom: "1px solid var(--border)",
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
          color: "var(--fg)",
        }}>
          Solid<br />State
        </h1>

        <p style={{
          fontFamily: "monospace",
          fontSize: "14px",
          color: "var(--muted)",
          letterSpacing: "0.04em",
          marginBottom: "64px",
          maxWidth: "480px",
          lineHeight: 1.7,
        }}>
          The skills marketplace for AI agents.<br />
          Real sources. Verified. No fake installs.
        </p>

        {/* Stats */}
        <div className="ss-stats" style={{
          display: "flex",
          gap: "0",
          borderTop: "1px solid var(--border)",
        }}>
          {[
            { n: STATS.totalSkills, label: "skills" },
            { n: STATS.originals, label: "originals" },
            { n: STATS.listings, label: "listings" },
            { n: AGENT_STATS.totalAgents, label: "agents" },
          ].map((s, i, arr) => (
            <div key={i} className="ss-stat" style={{
              flex: 1,
              padding: "24px 0",
              borderRight: i < arr.length - 1 ? "1px solid var(--border)" : "none",
              paddingRight: i < arr.length - 1 ? "32px" : "0",
              paddingLeft: i > 0 ? "32px" : "0",
            }}>
              <div style={{
                fontFamily: "monospace",
                fontSize: "clamp(24px, 4vw, 48px)",
                fontWeight: 700,
                color: "var(--fg)",
                letterSpacing: "-0.02em",
              }}>
                {s.n}
              </div>
              <div style={{
                fontFamily: "monospace",
                fontSize: "11px",
                color: "var(--muted)",
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
        borderBottom: "1px solid var(--border)",
      }}>
        <div style={{
          fontFamily: "monospace",
          fontSize: "11px",
          color: "var(--muted)",
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
              borderRight: "1px solid var(--border)",
              borderBottom: "1px solid var(--border)",
              borderLeft: i === 0 ? "1px solid var(--border)" : "none",
              transition: "background 0.1s",
            }}
            onMouseEnter={e => (e.currentTarget.style.background = "var(--bg-2)")}
            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
            >
              <div style={{
                fontFamily: "monospace",
                fontSize: "13px",
                fontWeight: 700,
                marginBottom: "4px",
                letterSpacing: "-0.01em",
              }}>
                {skill.name}
              </div>
              <div style={{
                fontFamily: "monospace",
                fontSize: "10px",
                color: "var(--ink-4)",
                letterSpacing: "0.04em",
                marginBottom: "16px",
              }}>
                by {skill.author}
              </div>
              <div style={{
                fontSize: "13px",
                color: "var(--muted)",
                lineHeight: 1.6,
                marginBottom: "24px",
              }}>
                {skill.description}
              </div>
              <div style={{
                fontFamily: "monospace",
                fontSize: "11px",
                color: "var(--muted-dim)",
                backgroundColor: "var(--bg-2)",
                padding: "8px 12px",
                letterSpacing: "0.02em",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                marginBottom: "16px",
              }}>
                {skill.installCommand}
              </div>
              {(() => {
                const label = priceDisplay(skill)
                return (
                  <div style={{
                    fontFamily: "monospace",
                    fontSize: "11px",
                    color: label === "Free" ? "var(--fg)" : label === "—" ? "var(--muted-dim)" : "var(--muted)",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                  }}>
                    {label}
                  </div>
                )
              })()}
            </Link>
          ))}
        </div>
      </section>

      {/* Agents — ranked by catalog coverage */}
      <section style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "64px 32px",
        borderBottom: "1px solid var(--border)",
      }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginBottom: "32px",
        }}>
          <div style={{
            fontFamily: "monospace",
            fontSize: "11px",
            color: "var(--muted)",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}>
            Agents — ranked by catalog coverage
          </div>
          <Link href="/agents" style={{
            fontFamily: "monospace",
            fontSize: "11px",
            color: "var(--muted)",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}>
            All agents →
          </Link>
        </div>

        {/* Hero cards — top 4 runtimes */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          gap: "1px",
          backgroundColor: "var(--border)",
          border: "1px solid var(--border)",
          marginBottom: "48px",
        }}>
          {heroAgents.map(({ agent, skillCount }) => (
            <Link key={agent.id} href={`/agents/${agent.slug}`} style={{
              display: "block",
              backgroundColor: "var(--bg)",
              padding: "24px",
              transition: "background 0.1s",
            }}
            onMouseEnter={e => (e.currentTarget.style.background = "var(--bg-2)")}
            onMouseLeave={e => (e.currentTarget.style.background = "var(--bg)")}
            >
              <div style={{
                fontFamily: "monospace",
                fontSize: "10px",
                color: "var(--ink-1)",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                marginBottom: "12px",
              }}>
                {agent.vendor}{agent.openSource ? " · OSS" : ""}
              </div>
              <div style={{
                fontFamily: "monospace",
                fontSize: "16px",
                fontWeight: 700,
                color: "var(--fg)",
                letterSpacing: "-0.01em",
                marginBottom: "8px",
              }}>
                {agent.name}
              </div>
              <div style={{
                fontSize: "12px",
                color: "var(--muted)",
                lineHeight: 1.6,
                marginBottom: "16px",
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}>
                {agent.description}
              </div>
              <div style={{
                fontFamily: "monospace",
                fontSize: "11px",
                color: "var(--muted)",
                letterSpacing: "0.04em",
              }}>
                {skillCount} <span style={{ color: "var(--muted-dim)", fontSize: "10px" }}>skills</span>
              </div>
            </Link>
          ))}
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(420px, 1fr))",
          columnGap: "64px",
          rowGap: "0",
        }}>
          {rankedAgents.map(({ agent, skillCount }, i) => (
            <Link key={agent.id} href={`/agents/${agent.slug}`} style={{
              display: "grid",
              gridTemplateColumns: "32px 1fr auto",
              alignItems: "baseline",
              gap: "16px",
              padding: "16px 0",
              borderBottom: "1px solid var(--border)",
              transition: "background 0.1s",
            }}
            onMouseEnter={e => (e.currentTarget.style.background = "var(--bg-2)")}
            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
            >
              <span style={{
                fontFamily: "monospace",
                fontSize: "12px",
                color: "var(--muted-dim)",
              }}>
                {i + 1}.
              </span>
              <span>
                <span style={{
                  fontFamily: "monospace",
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "var(--fg)",
                  marginRight: "12px",
                }}>
                  {agent.name}
                </span>
                <span style={{
                  fontFamily: "monospace",
                  fontSize: "10px",
                  color: "var(--ink-4)",
                  letterSpacing: "0.04em",
                }}>
                  {agent.vendor} · {agent.surfaces.map(s => SURFACE_LABEL[s]).join(" · ")}
                  {agent.openSource ? " · OSS" : ""}
                </span>
              </span>
              <span style={{
                fontFamily: "monospace",
                fontSize: "12px",
                color: "var(--muted)",
                whiteSpace: "nowrap",
              }}>
                {skillCount} <span style={{ color: "var(--muted-dim)", fontSize: "10px" }}>skills</span>
              </span>
            </Link>
          ))}
        </div>

        <div style={{
          fontFamily: "monospace",
          fontSize: "11px",
          color: "var(--muted-dim)",
          letterSpacing: "0.04em",
          marginTop: "24px",
        }}>
          {`${AGENT_STATS.totalAgents} runtimes · ${AGENT_STATS.openSource} open source · counts = catalog skills that run on each runtime. No usage numbers we haven't measured.`}
        </div>
      </section>

      {/* Category boards — top skills by measured installs */}
      <section style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "64px 32px",
        borderBottom: "1px solid var(--border)",
      }}>
        <div style={{
          fontFamily: "monospace",
          fontSize: "11px",
          color: "var(--muted)",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          marginBottom: "32px",
        }}>
          Top skills by category — skills.sh installs
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(420px, 1fr))",
          gap: "1px",
          backgroundColor: "var(--border)",
          border: "1px solid var(--border)",
        }}>
          {boards.map(({ category, top }) => (
            <div key={category} style={{ backgroundColor: "var(--bg)", padding: "32px" }}>
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                marginBottom: "20px",
              }}>
                <span style={{
                  fontFamily: "monospace",
                  fontSize: "13px",
                  fontWeight: 700,
                  color: "var(--fg)",
                  letterSpacing: "0.02em",
                }}>
                  Top {category}
                </span>
                <Link href={`/skills?category=${encodeURIComponent(category)}`} style={{
                  fontFamily: "monospace",
                  fontSize: "10px",
                  color: "var(--muted-dim)",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                }}>
                  View all →
                </Link>
              </div>
              {top.map((skill, i) => (
                <Link key={skill.id} href={`/skills/${skill.slug}`} style={{
                  display: "grid",
                  gridTemplateColumns: "24px 1fr auto",
                  alignItems: "baseline",
                  gap: "12px",
                  padding: "10px 0",
                  borderBottom: i < top.length - 1 ? "1px solid var(--bg-4)" : "none",
                  transition: "background 0.1s",
                }}
                onMouseEnter={e => (e.currentTarget.style.background = "var(--bg-2)")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                >
                  <span style={{
                    fontFamily: "monospace",
                    fontSize: "11px",
                    color: "var(--muted-dim)",
                  }}>
                    {i + 1}.
                  </span>
                  <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    <span style={{
                      fontFamily: "monospace",
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "var(--fg)",
                      marginRight: "10px",
                    }}>
                      {skill.name}
                    </span>
                    <span style={{
                      fontFamily: "monospace",
                      fontSize: "10px",
                      color: "var(--ink-4)",
                    }}>
                      {skill.author}
                    </span>
                  </span>
                  <span style={{
                    fontFamily: "monospace",
                    fontSize: "11px",
                    color: "var(--muted)",
                    whiteSpace: "nowrap",
                  }}>
                    {formatInstalls(skill.stats!.installs!)} <span style={{ color: "var(--muted-dim)", fontSize: "10px" }}>installs</span>
                  </span>
                </Link>
              ))}
            </div>
          ))}
        </div>

        <div style={{
          fontFamily: "monospace",
          fontSize: "11px",
          color: "var(--muted-dim)",
          letterSpacing: "0.04em",
          marginTop: "24px",
        }}>
          {`Install counts are real — skills.sh public telemetry. Skills without telemetry don't rank.`}
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
          color: "var(--muted)",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          marginBottom: "32px",
        }}>
          More
        </div>

        <ul role="list" style={{ listStyle: "none", margin: 0, padding: 0 }}>
          {skills.filter(s => !s.featured).map((skill, i) => (
            <li key={skill.id}>
            <Link href={`/skills/${skill.slug}`} style={{
              display: "grid",
              gridTemplateColumns: "1fr auto",
              alignItems: "baseline",
              padding: "20px 0",
              borderBottom: "1px solid var(--border)",
              gap: "24px",
            }}>
              <div>
                <span style={{
                  fontFamily: "monospace",
                  fontSize: "14px",
                  fontWeight: 600,
                  marginRight: "12px",
                }}>
                  {skill.name}
                </span>
                <span style={{
                  fontFamily: "monospace",
                  fontSize: "11px",
                  color: "var(--ink-4)",
                  marginRight: "16px",
                }}>
                  by {skill.author}
                </span>
                <span style={{
                  fontSize: "13px",
                  color: "var(--muted)",
                }}>
                  {skill.description}
                </span>
              </div>
              {(() => {
                const label = priceDisplay(skill)
                return (
                  <div style={{
                    fontFamily: "monospace",
                    fontSize: "11px",
                    color: label === "Free" ? "var(--ink-7)" : label === "—" ? "var(--muted-dim)" : "var(--muted)",
                    letterSpacing: "0.06em",
                    whiteSpace: "nowrap",
                  }}>
                    {label}
                  </div>
                )
              })()}
            </Link>
            </li>
          ))}
        </ul>
      </section>

    </div>
  )
}
