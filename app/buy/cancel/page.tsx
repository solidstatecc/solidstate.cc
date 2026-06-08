import Link from "next/link"

export default function CancelPage() {
  return (
    <div style={{ backgroundColor: "var(--bg)", minHeight: "100vh", color: "var(--fg)" }}>
      <section style={{ maxWidth: "640px", margin: "0 auto", padding: "120px 32px" }}>
        <div
          style={{
            fontFamily: "var(--font-jetbrains-mono), monospace",
            fontSize: "11px",
            color: "var(--ink-4)",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            marginBottom: "24px",
          }}
        >
          Cancelled
        </div>
        <h1
          style={{
            fontFamily: "var(--font-jetbrains-mono), monospace",
            fontSize: "40px",
            fontWeight: 700,
            margin: 0,
            marginBottom: "16px",
            letterSpacing: "-0.02em",
          }}
        >
          No charge.
        </h1>
        <p style={{ fontSize: "15px", color: "var(--ink-7)", lineHeight: 1.6, marginBottom: "32px" }}>
          Cart cleared. Try again whenever.
        </p>
        <Link
          href="/buy"
          style={{
            display: "inline-block",
            padding: "12px 20px",
            border: "1px solid var(--fg)",
            color: "var(--fg)",
            textDecoration: "none",
            fontFamily: "var(--font-jetbrains-mono), monospace",
            fontSize: "12px",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          Back to buy
        </Link>
      </section>
    </div>
  )
}
