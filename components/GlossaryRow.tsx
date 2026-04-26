import Link from "next/link"
import type { GlossaryTerm } from "@/lib/types"
import { LEVEL_NAME } from "@/lib/types"

export function GlossaryRow({
  term,
  showLevel = false,
}: {
  term: GlossaryTerm
  showLevel?: boolean
}) {
  return (
    <Link
      href={`/glossary/${term.slug}`}
      style={{
        display: "grid",
        gridTemplateColumns: "1fr auto",
        alignItems: "baseline",
        padding: "20px 0",
        borderBottom: "1px solid #222222",
        gap: "24px",
      }}
    >
      <div>
        <span
          style={{
            fontFamily: "var(--font-jetbrains-mono), monospace",
            fontSize: "14px",
            fontWeight: 600,
            marginRight: "16px",
          }}
        >
          {term.term}
        </span>
        <span style={{ fontSize: "13px", color: "#999999" }}>{term.short}</span>
      </div>
      <div
        style={{
          fontFamily: "var(--font-jetbrains-mono), monospace",
          fontSize: "10px",
          color: "#555555",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          whiteSpace: "nowrap",
          display: "flex",
          gap: "12px",
          alignItems: "baseline",
        }}
      >
        {showLevel && <span>{LEVEL_NAME[term.level]}</span>}
        {term.readMinutes != null && <span>{term.readMinutes} min</span>}
        <span>→</span>
      </div>
    </Link>
  )
}
