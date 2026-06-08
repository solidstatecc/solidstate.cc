import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { glossary, getTermBySlug } from "@/lib/glossary"
import { LEVEL_LABEL, LEVEL_NAME } from "@/lib/types"

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return glossary.map((t) => ({ slug: t.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const term = getTermBySlug(slug)
  if (!term) return {}
  return {
    title: term.term,
    description: term.short,
  }
}

export default async function GlossaryTermPage({ params }: Props) {
  const { slug } = await params
  const term = getTermBySlug(slug)
  if (!term) notFound()

  const related = (term.related ?? [])
    .map((s) => getTermBySlug(s))
    .filter((t): t is NonNullable<typeof t> => Boolean(t))

  return (
    <div style={{ backgroundColor: "var(--bg)", minHeight: "100vh" }}>
      {/* Breadcrumb */}
      <div
        style={{
          borderBottom: "1px solid var(--border)",
          padding: "14px 24px",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <nav
            style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: "11px",
              color: "var(--ink-1)",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <Link href="/glossary" style={{ color: "var(--fg)" }}>
              Glossary
            </Link>
            <span>›</span>
            <span style={{ color: "var(--ink-5)" }}>{term.term}</span>
          </nav>
        </div>
      </div>

      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "64px 32px",
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) 280px",
          gap: "64px",
          alignItems: "start",
        }}
      >
        {/* Main */}
        <article>
          <div
            style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: "11px",
              color: "var(--ink-1)",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              marginBottom: "16px",
            }}
          >
            {LEVEL_LABEL[term.level]} · {LEVEL_NAME[term.level]}
            {term.readMinutes ? ` · ${term.readMinutes} min` : ""}
          </div>

          <h1
            style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: "clamp(40px, 7vw, 72px)",
              fontWeight: 700,
              lineHeight: 0.95,
              letterSpacing: "-0.03em",
              color: "var(--fg)",
              marginBottom: "32px",
            }}
          >
            {term.term}
          </h1>

          <p
            style={{
              fontFamily: "var(--font-inter), system-ui, sans-serif",
              fontSize: "20px",
              lineHeight: 1.55,
              color: "var(--fg)",
              maxWidth: "640px",
              marginBottom: "32px",
            }}
          >
            {term.short}
          </p>

          {term.long && (
            <div
              style={{
                fontFamily: "var(--font-inter), system-ui, sans-serif",
                fontSize: "16px",
                lineHeight: 1.75,
                color: "var(--ink-8)",
                maxWidth: "640px",
                paddingTop: "32px",
                borderTop: "1px solid var(--border)",
                whiteSpace: "pre-wrap",
              }}
            >
              {term.long}
            </div>
          )}
        </article>

        {/* Sidebar: related */}
        <aside style={{ position: "sticky", top: "80px" }}>
          {related.length > 0 && (
            <div
              style={{
                border: "1px solid var(--border)",
                padding: "20px",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-jetbrains-mono), monospace",
                  fontSize: "10px",
                  color: "var(--ink-1)",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  marginBottom: "16px",
                }}
              >
                Related
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {related.map((r) => (
                  <li
                    key={r.slug}
                    style={{
                      paddingBottom: "10px",
                      marginBottom: "10px",
                      borderBottom: "1px solid var(--bg-4)",
                    }}
                  >
                    <Link
                      href={`/glossary/${r.slug}`}
                      style={{
                        display: "block",
                        fontFamily: "var(--font-jetbrains-mono), monospace",
                        fontSize: "13px",
                        fontWeight: 600,
                        color: "var(--fg)",
                        marginBottom: "4px",
                      }}
                    >
                      {r.term}
                    </Link>
                    <span style={{ fontSize: "12px", color: "var(--ink-3)", lineHeight: 1.5 }}>
                      {r.short}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div style={{ marginTop: "16px" }}>
            <Link
              href="/glossary"
              style={{
                fontFamily: "var(--font-jetbrains-mono), monospace",
                fontSize: "11px",
                color: "var(--ink-5)",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              ← Back to glossary
            </Link>
          </div>
        </aside>
      </div>
    </div>
  )
}
