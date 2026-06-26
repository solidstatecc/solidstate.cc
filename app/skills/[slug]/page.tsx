import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { skills, getSkillBySlug } from "@/lib/skills"
import { getSourceForSkill } from "@/lib/sources"
import { LICENSE_LABEL } from "@/lib/types"
import { getGrokBundle } from "@/lib/grokBundles"
import { priceDisplay } from "@/lib/x402"
import { PlatformBadge } from "@/components/PlatformBadge"
import { CopyButton } from "@/components/CopyButton"
import { SkillCard } from "@/components/SkillCard"
import { JsonLd } from "@/components/JsonLd"
import { skillJsonLd, breadcrumbsJsonLd } from "@/lib/seo"

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
  const title = `${skill.name} — AI agent skill`
  return {
    title,
    description: skill.description,
    alternates: { canonical: `/skills/${skill.slug}` },
    openGraph: {
      type: "website",
      siteName: "Solid State",
      url: `https://solidstate.cc/skills/${skill.slug}`,
      title,
      description: skill.description,
      images: ["/opengraph-image.png"],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: skill.description,
      images: ["/opengraph-image.png"],
    },
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
  const priceColor = isUnpricedLabel ? "var(--ink-2)" : "var(--fg)"
  // Every skill links to its real source (repo, then docs). Falls back to the
  // skills directory if neither is set.
  const ctaHref = skill.repoUrl ?? skill.docsUrl ?? "/skills"

  return (
    <div style={{ backgroundColor: "var(--bg)", minHeight: "100vh" }}>
      <JsonLd
        data={[
          skillJsonLd(skill),
          breadcrumbsJsonLd([
            ["Skills", "/skills"],
            [skill.name],
          ]),
        ]}
      />
      {/* Breadcrumb */}
      <div
        style={{
          borderBottom: "1px solid var(--bg)",
          padding: "14px 24px",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <nav
            style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: "11px",
              color: "var(--fg)",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <Link href="/skills" style={{ color: "var(--fg)", textDecoration: "none" }}>
              Skills
            </Link>
            <span>›</span>
            <span style={{ color: "var(--fg)" }}>{skill.name}</span>
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
          gap: "32px 48px",
          alignItems: "start",
        }}
      >
        {/* Header — own grid child so the sidebar can follow it in source
            order: on phones the buy box stacks right under the header
            instead of below Related. */}
        <div>
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
                  color: "var(--fg)",
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
                    backgroundColor: "var(--bg)",
                    color: "var(--fg)",
                    fontFamily: "var(--font-jetbrains-mono), monospace",
                    fontSize: "10px",
                    fontWeight: 600,
                    padding: "4px 10px",
                    borderRadius: "4px",
                    border: "1px solid var(--fg)",
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
                color: "var(--fg)",
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
                    style={{ color: "var(--fg)", textDecoration: "underline" }}
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
                color: "var(--fg)",
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

        {/* Sidebar — second in source order so price + CTA stack right
            under the header on phones. Desktop pins it to column 2
            spanning both rows (.ss-detail-aside in globals.css). */}
        <aside className="ss-detail-aside" style={{ position: "sticky", top: "72px" }}>
          {/* Price card */}
          <div
            style={{
              backgroundColor: "var(--bg)",
              border: "1px solid var(--bg)",
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
                backgroundColor: "var(--fg)",
                color: "var(--bg)",
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
                color: "var(--fg)",
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
              backgroundColor: "var(--bg)",
              border: "1px solid var(--bg)",
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
                  borderBottom: "1px solid var(--bg)",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-jetbrains-mono), monospace",
                    fontSize: "10px",
                    color: "var(--fg)",
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
                    color: "var(--fg)",
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
                  color: "var(--ink-2)",
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
                    color: "var(--fg)",
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
                    color: "var(--fg)",
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

        {/* Main body */}
        <div>
          {/* Install command */}
          <div
            style={{
              backgroundColor: "var(--bg)",
              border: "1px solid var(--bg)",
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
                color: "var(--fg)",
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
                      color: "var(--fg)",
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
                    color: "var(--ink-4)",
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
                    color: "var(--ink-4)",
                    flex: 1,
                  }}
                >
                  Not yet published for one-line install
                </code>
              )}
            </div>
          </div>

          {/* Add to Grok -- consumer app install (flat .skill upload) */}
          {getGrokBundle(skill.slug) && (
            <div style={{ backgroundColor: "var(--bg)", border: "1px solid var(--bg)", borderRadius: "6px", padding: "16px 20px", marginBottom: "32px" }}>
              <div style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: "10px", fontWeight: 600, color: "var(--fg)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "10px" }}>
                Add to Grok
              </div>
              <a href={`/skills/${skill.slug}/grok.skill`} download style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: "13px", color: "var(--fg)", textDecoration: "none" }}>
                Download .skill &#8595;
              </a>
              <div style={{ fontSize: "12px", color: "var(--ink-4)", marginTop: "10px", lineHeight: 1.6 }}>
                Then in the Grok app: grok.com/skills &rarr; New Skill &rarr; Upload skill file &rarr; drop the file. Runs on web, iOS, and Android. Skills is a paid feature (SuperGrok / X Premium+).
              </div>
            </div>
          )}

          {/* Provenance / license honesty note (indexed third-party skills) */}
          {showProvenanceNote && (
            <div
              style={{
                border: "1px solid var(--border-2)",
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
                    color: "var(--fg)",
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
                    color: "var(--ink-4)",
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
              borderTop: "1px solid var(--bg)",
              paddingTop: "32px",
              marginBottom: "48px",
            }}
          >
            <h2
              style={{
                fontFamily: "var(--font-jetbrains-mono), monospace",
                fontSize: "12px",
                fontWeight: 600,
                color: "var(--fg)",
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
                color: "var(--fg)",
                lineHeight: "1.75",
                maxWidth: "640px",
              }}
              dangerouslySetInnerHTML={{
                __html: skill.longDescription
                  .replace(/\n\n/g, "</p><p style=\"margin:0 0 16px\">")
                  .replace(/\*\*([^*]+)\*\*/g, "<strong style=\"color:var(--fg)\">$1</strong>")
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
                  color: "var(--fg)",
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
                      color: "var(--fg)",
                      backgroundColor: "var(--bg)",
                      border: "1px solid var(--bg)",
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
                  color: "var(--fg)",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  marginBottom: "16px",
                  paddingTop: "32px",
                  borderTop: "1px solid var(--bg)",
                }}
              >
                Related
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 240px), 1fr))",
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

      </div>
    </div>
  )
}
