import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { sourceGroups, getSourceBySlug } from "@/lib/sources"
import { formatInstalls } from "@/lib/format"
import { CopyButton } from "@/components/CopyButton"
import { SkillCard } from "@/components/SkillCard"
import { JsonLd } from "@/components/JsonLd"
import { skillListJsonLd } from "@/lib/seo"

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return sourceGroups.map((g) => ({ slug: g.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const group = getSourceBySlug(slug)
  if (!group) return {}
  const title = `${group.source} — skill pack`
  const description = `All ${group.skills.length} agent skills from ${group.source}, indexed on Solid State. One install command, every skill listed.`
  return {
    title,
    description,
    alternates: { canonical: `/source/${group.slug}` },
    openGraph: {
      type: "website",
      siteName: "Solid State",
      url: `https://solidstate.cc/source/${group.slug}`,
      title,
      description,
      images: ["/opengraph-image.png"],
    },
  }
}

const mono = "var(--font-jetbrains-mono), monospace"

export default async function SourcePage({ params }: Props) {
  const { slug } = await params
  const group = getSourceBySlug(slug)
  if (!group) notFound()

  const fetchedAt = group.skills.find((s) => s.stats?.fetchedAt)?.stats?.fetchedAt

  return (
    <div style={{ backgroundColor: "var(--bg)", minHeight: "100vh" }}>
      <JsonLd
        data={skillListJsonLd(
          `${group.source} — skill pack`,
          `/source/${group.slug}`,
          group.skills
        )}
      />
      {/* Breadcrumb */}
      <div style={{ borderBottom: "1px solid var(--bg)", padding: "14px 24px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <nav
            style={{
              fontFamily: mono,
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
            <span style={{ color: "var(--ink-4)" }}>Source</span>
            <span>›</span>
            <span style={{ color: "var(--fg)" }}>{group.source}</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 24px" }}>
        {/* Header */}
        <div style={{ marginBottom: "40px", maxWidth: "720px" }}>
          <div
            style={{
              fontFamily: mono,
              fontSize: "10px",
              color: "var(--ink-4)",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginBottom: "12px",
            }}
          >
            Skill pack · Indexed
          </div>
          <h1
            style={{
              fontFamily: mono,
              fontSize: "28px",
              fontWeight: 700,
              color: "var(--fg)",
              letterSpacing: "-0.02em",
              margin: "0 0 16px",
            }}
          >
            {group.source}
          </h1>

          <div
            style={{
              fontFamily: mono,
              fontSize: "11px",
              color: "var(--ink-4)",
              display: "flex",
              flexWrap: "wrap",
              gap: "12px",
              marginBottom: "20px",
            }}
          >
            <span style={{ color: "var(--fg)" }}>{group.skills.length} skills</span>
            {group.totalInstalls > 0 && (
              <>
                <span>·</span>
                <span>{formatInstalls(group.totalInstalls)} installs across the pack</span>
              </>
            )}
            {group.trendingCount > 0 && (
              <>
                <span>·</span>
                <span>{group.trendingCount} trending</span>
              </>
            )}
            {group.repoUrl && (
              <>
                <span>·</span>
                <a
                  href={group.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "var(--fg)", textDecoration: "underline" }}
                >
                  Source repo →
                </a>
              </>
            )}
          </div>

          {/* Pack-level install */}
          {group.installCommand && (
            <div
              style={{
                backgroundColor: "var(--bg-2)",
                border: "1px solid var(--border)",
                borderRadius: "6px",
                padding: "16px 20px",
              }}
            >
              <div
                style={{
                  fontFamily: mono,
                  fontSize: "10px",
                  fontWeight: 600,
                  color: "var(--ink-4)",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  marginBottom: "10px",
                }}
              >
                Install the pack
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <code
                  style={{
                    fontFamily: mono,
                    fontSize: "13px",
                    color: "var(--fg)",
                    flex: 1,
                    wordBreak: "break-all",
                  }}
                >
                  {group.installCommand}
                </code>
                <CopyButton text={group.installCommand} label="Copy" />
              </div>
            </div>
          )}

          <p
            style={{
              fontFamily: mono,
              fontSize: "11px",
              color: "var(--ink-1)",
              lineHeight: 1.6,
              marginTop: "16px",
            }}
          >
            Indexed for discovery — not audited or authored by Solid State.
            {group.totalInstalls > 0 && fetchedAt && (
              <> Install counts are real, sourced from skills.sh public telemetry (fetched {fetchedAt}).</>
            )}
          </p>
        </div>

        {/* Member skills */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 320px), 1fr))",
            gap: "16px",
          }}
        >
          {group.skills.map((s) => (
            <SkillCard key={s.id} skill={s} />
          ))}
        </div>
      </div>
    </div>
  )
}
