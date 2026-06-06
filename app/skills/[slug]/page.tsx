import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { skills, getSkillBySlug } from "@/lib/skills"
import { getSourceForSkill } from "@/lib/sources"
import { LICENSE_LABEL } from "@/lib/types"
import { priceDisplay } from "@/lib/x402"
import { PlatformBadge } from "@/components/PlatformBadge"
import { CopyButton } from "@/components/CopyButton"
import { SkillCard } from "@/components/SkillCard"

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return skills.map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const skill = getSkillBySlug(slug)
  if (!skill) return {}
  return {
    title: skill.name,
    description: skill.description,
  }
}

export default async function SkillDetailPage({ params }: Props) {
  const { slug } = await params
  const skill = getSkillBySlug(slug)
  if (!skill) notFound()

  const related = skills
    .filter(
      (s) =>
        s.slug !== skill.slug &&
        s.categories.some((c) => skill.categories.includes(c))
    )
    .slice(0, 3)

  const isClawhub = skill.source?.startsWith("clawhub:") ?? false
  // Pack page for this skill's upstream source, if it has one.
  const sourceGroup = getSourceForSkill(skill)
  const licenseUnstated = skill.license === "undeclared" || skill.license === "unknown"
  const showProvenanceNote = skill.provenance === "indexed" && (licenseUnstated || isClawhub)

  const priceLabel = priceDisplay(skill)
  const isFreeLabel = priceLabel === "Free"
  const isUnpricedLabel = priceLabel === "—"
  const priceDisplayLabel = isFreeLabel ? "FREE" : priceLabel
  const priceColor = isUnpricedLabel ? "#666666" : "#ffffff"
  // Every skill links to its real source (repo, then docs). Falls back to the
  // skills directory if neither is set.
  const ctaHref = skill.repoUrl ?? skill.docsUrl ?? "/skills"

  return (
    <div style={{ backgroundColor: "#000000", minHeight: "100vh" }}>
      {/* Breadcrumb */}
      <div
        style={{
          borderBottom: "1px solid #000000",
          padding: "14px 24px",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <nav
            style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: "11px",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <Link href="/skills" style={{ color: "#ffffff", textDecoration: "none" }}>
              Skills
            </Link>
            <span>›</span>
            <span style={{ color: "#ffffff" }}>{skill.name}</span>
          </nav>
        </div>
      </div>

      <div
        className="ss-detail-grid"
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "40px 24px",
          display: "grid",
          gridTemplateColumns: "1fr 300px",
          gap: "48px",
          alignItems: "start",
        }}
      >
        {/* Main content */}
        <div>
          {/* Header */}
          <div style={{ marginBottom: "32px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "16px",
                flexWrap: "wrap",
                marginBottom: "12px",
              }}
            >
              <h1
                style={{
                  fontFamily: "var(--font-jetbrains-mono), monospace",
                  fontSize: "28px",
                  fontWeight: 700,
                  color: "#ffffff",
                  letterSpacing: "-0.02em",
                  margin: 0,
                  flex: 1,
                  minWidth: "200px",
                }}
              >
                {skill.name}
              </h1>
              {(skill.provenance === "first-party" || skill.provenance === "audited") && (
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                    backgroundColor: "#000000",
                    color: "#ffffff",
                    fontFamily: "var(--font-jetbrains-mono), monospace",
                    fontSize: "10px",
                    fontWeight: 600,
                    padding: "4px 10px",
                    borderRadius: "4px",
                    border: "1px solid #ffffff",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    whiteSpace: "nowrap",
                    marginTop: "4px",
                  }}
                >
                  ✓ VERIFIED
                </div>
              )}
            </div>

            <div
              style={{
                fontFamily: "var(--font-jetbrains-mono), monospace",
                fontSize: "11px",
                color: "#ffffff",
                marginBottom: "16px",
                display: "flex",
                flexWrap: "wrap",
                gap: "12px",
              }}
            >
              {sourceGroup ? (
                <span>
                  by{" "}
                  <Link
                    href={`/source/${sourceGroup.slug}`}
                    style={{ color: "#ffffff", textDecoration: "underline" }}
                    title={`All ${sourceGroup.skills.length} skills from ${sourceGroup.source}`}
                  >
                    {skill.author}
                  </Link>
                </span>
              ) : (
                <span>by {skill.author}</span>
              )}
              <span>·</span>
              <span>v{skill.version}</span>
              <span>·</span>
              <span>{new Date(skill.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })}</span>
            </div>

            <p
              style={{
                fontSize: "15px",
                color: "#ffffff",
                lineHeight: "1.6",
                margin: "0 0 16px",
                maxWidth: "640px",
              }}
            >
              {skill.description}
            </p>

            {/* Platform badges */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {skill.platforms.map((p) => (
                <PlatformBadge key={p} platform={p} size="md" />
              ))}
            </div>
          </div>

          {/* Install command */}
          <div
            style={{
              backgroundColor: "#000000",
              border: "1px solid #000000",
              borderRadius: "6px",
              padding: "16px 20px",
              marginBottom: "32px",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-jetbrains-mono), monospace",
                fontSize: "10px",
                fontWeight: 600,
                color: "#ffffff",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                marginBottom: "10px",
              }}
            >
              Install
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              {skill.installCommand ? (
                <>
                  <code
                    style={{
                      fontFamily: "var(--font-jetbrains-mono), monospace",
                      fontSize: "13px",
                      color: "#ffffff",
                      flex: 1,
                      wordBreak: "break-all",
                    }}
                  >
                    {skill.installCommand}
                  </code>
                  <CopyButton text={skill.installCommand} label="Copy" />
                </>
              ) : skill.repoUrl ? (
                <a
                  href={skill.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontFamily: "var(--font-jetbrains-mono), monospace",
                    fontSize: "13px",
                    color: "#888888",
                    flex: 1,
                    wordBreak: "break-all",
                    textDecoration: "none",
                  }}
                >
                  Install from the source repository ↗
                </a>
              ) : (
                <code
                  style={{
                    fontFamily: "var(--font-jetbrains-mono), monospace",
                    fontSize: "13px",
                    color: "#888888",
                    flex: 1,
                  }}
                >
                  Not yet published for one-line install
                </code>
              )}
            </div>
          </div>

          {/* Provenance / license honesty note (indexed third-party skills) */}
          {showProvenanceNote && (
            <div
              style={{
                border: "1px solid #333333",
                borderRadius: "6px",
                padding: "14px 18px",
                marginBottom: "32px",
              }}
            >
              {isClawhub && (
                <div
                  style={{
                    fontFamily: "var(--font-jetbrains-mono), monospace",
                    fontSize: "10px",
                    fontWeight: 600,
                    color: "#ffffff",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    marginBottom: "8px",
                  }}
                >
                  Indexed from ClawHub · not audited by Solid State
                </div>
              )}
              {licenseUnstated && (
                <p
                  style={{
                    fontSize: "12px",
                    color: "#888888",
                    lineHeight: 1.6,
                    margin: 0,
                  }}
                >
                  The author hasn&apos;t declared a license upstream. No usage rights are
                  granted by default — verify with the source before commercial use.
                </p>
              )}
            </div>
          )}

          {/* Long description */}
          <div
            style={{
              borderTop: "1px solid #000000",
              paddingTop: "32px",
              marginBottom: "48px",
            }}
          >
            <h2
              style={{
                fontFamily: "var(--font-jetbrains-mono), monospace",
                fontSize: "12px",
                fontWeight: 600,
                color: "#ffffff",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                marginBottom: "20px",
              }}
            >
              About
            </h2>
            <div
              style={{
                fontSize: "14px",
                color: "#ffffff",
                lineHeight: "1.75",
                maxWidth: "640px",
              }}
              dangerouslySetInnerHTML={{
                __html: skill.longDescription
                  .replace(/\n\n/g, "</p><p style=\"margin:0 0 16px\">")
                  .replace(/\*\*([^*]+)\*\*/g, "<strong style=\"color:#ffffff\">$1</strong>")
                  .replace(/^- (.+)$/gm, "<li style=\"margin-bottom:4px\">$1</li>")
                  .replace(/<\/li>\n<li/g, "</li><li")
                  .replace(/(<li[^>]*>.*<\/li>)/gs, "<ul style=\"margin:0 0 16px;padding-left:20px;list-style:none\">$1</ul>")
                  .replace(/^/, "<p style=\"margin:0 0 16px\">")
                  .replace(/$/, "</p>"),
              }}
            />
          </div>

          {/* Tags */}
          {skill.tags.length > 0 && (
            <div style={{ marginBottom: "32px" }}>
              <div
                style={{
                  fontFamily: "var(--font-jetbrains-mono), monospace",
                  fontSize: "10px",
                  fontWeight: 600,
                  color: "#ffffff",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  marginBottom: "10px",
                }}
              >
                Tags
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {skill.tags.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      fontFamily: "var(--font-jetbrains-mono), monospace",
                      fontSize: "11px",
                      color: "#ffffff",
                      backgroundColor: "#000000",
                      border: "1px solid #000000",
                      padding: "3px 8px",
                      borderRadius: "3px",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Related */}
          {related.length > 0 && (
            <div>
              <div
                style={{
                  fontFamily: "var(--font-jetbrains-mono), monospace",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#ffffff",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  marginBottom: "16px",
                  paddingTop: "32px",
                  borderTop: "1px solid #000000",
                }}
              >
                Related
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
                  gap: "12px",
                }}
              >
                {related.map((s) => (
                  <SkillCard key={s.id} skill={s} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside style={{ position: "sticky", top: "72px" }}>
          {/* Price card */}
          <div
            style={{
              backgroundColor: "#000000",
              border: "1px solid #000000",
              borderRadius: "6px",
              padding: "24px",
              marginBottom: "16px",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-jetbrains-mono), monospace",
                fontSize: "28px",
                fontWeight: 700,
                color: priceColor,
                marginBottom: "16px",
                letterSpacing: "-0.02em",
              }}
            >
              {priceDisplayLabel}
            </div>

            <a
              href={ctaHref}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "block",
                textAlign: "center",
                backgroundColor: "#ffffff",
                color: "#000000",
                fontFamily: "var(--font-jetbrains-mono), monospace",
                fontSize: "12px",
                fontWeight: 700,
                padding: "10px",
                borderRadius: "4px",
                textDecoration: "none",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                marginBottom: "12px",
              }}
            >
              {isFreeLabel ? "Install Free →" : "View Source →"}
            </a>

            <div
              style={{
                fontFamily: "var(--font-jetbrains-mono), monospace",
                fontSize: "10px",
                color: "#ffffff",
                textAlign: "center",
              }}
            >
              {isFreeLabel
                ? "No account required"
                : isUnpricedLabel
                ? "Hosted upstream · follow repo for install"
                : "One-time purchase · unlimited installs"}
            </div>
          </div>

          {/* Metadata */}
          <div
            style={{
              backgroundColor: "#000000",
              border: "1px solid #000000",
              borderRadius: "6px",
              padding: "20px",
            }}
          >
            {[
              { label: "Author", value: skill.author },
              { label: "Version", value: `v${skill.version}` },
              { label: "Category", value: skill.categories.join(", ") },
              { label: "License", value: LICENSE_LABEL[skill.license] },
              {
                label: "Installs",
                value: skill.stats?.installs?.toLocaleString() ?? "—",
              },
              { label: "Stars", value: skill.stats?.stars?.toLocaleString() ?? "—" },
              {
                label: "Published",
                value: new Date(skill.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                }),
              },
            ].map(({ label, value }) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: "8px",
                  padding: "8px 0",
                  borderBottom: "1px solid #000000",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-jetbrains-mono), monospace",
                    fontSize: "10px",
                    color: "#ffffff",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    flexShrink: 0,
                  }}
                >
                  {label}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-jetbrains-mono), monospace",
                    fontSize: "11px",
                    color: "#ffffff",
                    textAlign: "right",
                  }}
                >
                  {value}
                </span>
              </div>
            ))}

            {skill.stats?.fetchedAt && (
              <div
                style={{
                  marginTop: "10px",
                  fontFamily: "var(--font-jetbrains-mono), monospace",
                  fontSize: "9px",
                  color: "#666666",
                  letterSpacing: "0.04em",
                }}
              >
                Stats as of{" "}
                {new Date(skill.stats.fetchedAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </div>
            )}

            {/* Links */}
            <div style={{ marginTop: "12px", display: "flex", flexDirection: "column", gap: "6px" }}>
              {skill.repoUrl && (
                <a
                  href={skill.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontFamily: "var(--font-jetbrains-mono), monospace",
                    fontSize: "11px",
                    color: "#ffffff",
                    textDecoration: "none",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  ↗ Repository
                </a>
              )}
              {skill.docsUrl && (
                <a
                  href={skill.docsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontFamily: "var(--font-jetbrains-mono), monospace",
                    fontSize: "11px",
                    color: "#ffffff",
                    textDecoration: "none",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  ↗ {isClawhub ? "ClawHub listing" : "Documentation"}
                </a>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
