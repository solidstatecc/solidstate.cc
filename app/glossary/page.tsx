import type { Metadata } from "next"
import Link from "next/link"
import {
  glossary,
  termsByLevel,
  termsByLetter,
  ALPHABET,
  LEVELS_IN_ORDER,
  GLOSSARY_STATS,
} from "@/lib/glossary"
import { LEVEL_LABEL, LEVEL_NAME } from "@/lib/types"
import { GlossaryRow } from "@/components/GlossaryRow"

export const metadata: Metadata = {
  title: "Glossary",
  description:
    "A working glossary of AI terms. Beginner to expert. Researched and written by Solid State.",
}

export default function GlossaryPage() {
  const byLetter = termsByLetter()
  const lettersWithTerms = new Set(Object.keys(byLetter))

  return (
    <div style={{ backgroundColor: "var(--bg)", minHeight: "100vh" }}>
      {/* Header */}
      <section
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "120px 32px 64px",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-jetbrains-mono), monospace",
            fontSize: "11px",
            color: "var(--ink-1)",
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            marginBottom: "24px",
          }}
        >
          Glossary
        </div>
        <h1
          style={{
            fontFamily: "var(--font-jetbrains-mono), monospace",
            fontSize: "clamp(48px, 9vw, 96px)",
            fontWeight: 700,
            lineHeight: 0.95,
            letterSpacing: "-0.03em",
            color: "var(--fg)",
            marginBottom: "32px",
          }}
        >
          AI, in
          <br />
          working
          <br />
          terms.
        </h1>
        <p
          style={{
            fontFamily: "var(--font-inter), system-ui, sans-serif",
            fontSize: "15px",
            color: "var(--ink-5)",
            lineHeight: 1.7,
            maxWidth: "560px",
            marginBottom: "48px",
          }}
        >
          {GLOSSARY_STATS.totalTerms} terms across {GLOSSARY_STATS.totalLevels} levels.
          Written for operators who use AI to ship work, not for the discourse.
        </p>

        {/* Stats */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            borderTop: "1px solid var(--border)",
          }}
        >
          {[
            { n: GLOSSARY_STATS.totalTerms, label: "terms" },
            { n: GLOSSARY_STATS.totalLevels, label: "levels" },
          ].map((s, i) => (
            <div
              key={i}
              style={{
                padding: "24px 0",
                borderRight: i === 0 ? "1px solid var(--border)" : "none",
                paddingRight: i === 0 ? "32px" : "0",
                paddingLeft: i > 0 ? "32px" : "0",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-jetbrains-mono), monospace",
                  fontSize: "clamp(24px, 4vw, 48px)",
                  fontWeight: 700,
                  color: "var(--fg)",
                  letterSpacing: "-0.02em",
                }}
              >
                {s.n}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-jetbrains-mono), monospace",
                  fontSize: "11px",
                  color: "var(--ink-1)",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  marginTop: "4px",
                }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Levels view */}
      <section
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "64px 32px 32px",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            marginBottom: "32px",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: "11px",
              color: "var(--ink-1)",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            By Level
          </div>
          <a
            href="#alphabetical"
            style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: "11px",
              color: "var(--ink-5)",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Jump to alphabetical ↓
          </a>
        </div>

        {LEVELS_IN_ORDER.map((level) => {
          const terms = termsByLevel(level)
          if (terms.length === 0) return null
          return (
            <div key={level} style={{ marginBottom: "48px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: "16px",
                  marginBottom: "16px",
                  paddingBottom: "12px",
                  borderBottom: "1px solid var(--fg)",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-jetbrains-mono), monospace",
                    fontSize: "11px",
                    color: "var(--ink-1)",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                  }}
                >
                  {LEVEL_LABEL[level]}
                </div>
                <h2
                  style={{
                    fontFamily: "var(--font-jetbrains-mono), monospace",
                    fontSize: "20px",
                    fontWeight: 700,
                    color: "var(--fg)",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {LEVEL_NAME[level]}
                </h2>
                <div
                  style={{
                    marginLeft: "auto",
                    fontFamily: "var(--font-jetbrains-mono), monospace",
                    fontSize: "11px",
                    color: "var(--ink-1)",
                    letterSpacing: "0.08em",
                  }}
                >
                  {terms.length} term{terms.length === 1 ? "" : "s"}
                </div>
              </div>
              <div>
                {terms.map((t) => (
                  <GlossaryRow key={t.slug} term={t} />
                ))}
              </div>
            </div>
          )
        })}
      </section>

      {/* Alphabetical view */}
      <section
        id="alphabetical"
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "64px 32px",
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-jetbrains-mono), monospace",
            fontSize: "11px",
            color: "var(--ink-1)",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            marginBottom: "32px",
          }}
        >
          Alphabetical
        </div>

        {/* Letter index */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0",
            marginBottom: "48px",
            paddingBottom: "24px",
            borderBottom: "1px solid var(--border)",
          }}
        >
          {ALPHABET.map((letter) => {
            const has = lettersWithTerms.has(letter)
            const inner = (
              <span
                style={{
                  display: "inline-block",
                  width: "32px",
                  height: "32px",
                  textAlign: "center",
                  lineHeight: "32px",
                  fontFamily: "var(--font-jetbrains-mono), monospace",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: has ? "var(--fg)" : "var(--border-2)",
                  borderRight: "1px solid var(--border)",
                  letterSpacing: "0.04em",
                }}
              >
                {letter}
              </span>
            )
            return has ? (
              <a key={letter} href={`#letter-${letter}`}>
                {inner}
              </a>
            ) : (
              <span key={letter} aria-disabled>
                {inner}
              </span>
            )
          })}
        </div>

        {/* Letter sections */}
        {Object.keys(byLetter)
          .sort()
          .map((letter) => (
            <div
              key={letter}
              id={`letter-${letter}`}
              style={{ marginBottom: "48px", scrollMarginTop: "80px" }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: "16px",
                  marginBottom: "8px",
                  paddingBottom: "12px",
                  borderBottom: "1px solid var(--fg)",
                }}
              >
                <h2
                  style={{
                    fontFamily: "var(--font-jetbrains-mono), monospace",
                    fontSize: "32px",
                    fontWeight: 700,
                    color: "var(--fg)",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {letter}
                </h2>
                <div
                  style={{
                    marginLeft: "auto",
                    fontFamily: "var(--font-jetbrains-mono), monospace",
                    fontSize: "11px",
                    color: "var(--ink-1)",
                    letterSpacing: "0.08em",
                  }}
                >
                  {byLetter[letter].length} term
                  {byLetter[letter].length === 1 ? "" : "s"}
                </div>
              </div>
              <div>
                {byLetter[letter].map((t) => (
                  <GlossaryRow key={t.slug} term={t} showLevel />
                ))}
              </div>
            </div>
          ))}
      </section>
    </div>
  )
}
