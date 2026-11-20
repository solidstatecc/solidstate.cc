// Email capture. Plain GET form to the beehiiv subscribe page, which takes
// the address as a query param and finishes the signup there. No API key,
// no client JS, no table to maintain. Swap for the beehiiv API when the
// list earns it.
const mono = "var(--font-jetbrains-mono), monospace"

export function Subscribe({
  line = "New skills, when they ship.",
  sub = "One email when something is worth installing. No digest, no drip.",
}: {
  line?: string
  sub?: string
}) {
  return (
    <form
      action="https://solidstate.beehiiv.com/subscribe"
      method="get"
      target="_blank"
      style={{
        border: "1px solid var(--border)",
        padding: "24px",
        display: "flex",
        flexWrap: "wrap",
        gap: "16px",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <div style={{ flex: "1 1 260px", minWidth: 0 }}>
        <div style={{ fontFamily: mono, fontSize: "14px", fontWeight: 700, color: "var(--fg)" }}>{line}</div>
        <div style={{ fontSize: "13px", color: "var(--ink-4)", marginTop: "6px", lineHeight: 1.5 }}>{sub}</div>
      </div>
      <div style={{ display: "flex", gap: "8px", flex: "1 1 300px", minWidth: 0 }}>
        <input
          type="email"
          name="email"
          required
          placeholder="you@domain.com"
          aria-label="Email address"
          autoComplete="email"
          style={{
            flex: 1,
            minWidth: 0,
            fontFamily: mono,
            fontSize: "13px",
            padding: "11px 12px",
            backgroundColor: "var(--bg)",
            color: "var(--fg)",
            border: "1px solid var(--border)",
            borderRadius: 0,
          }}
        />
        <input type="hidden" name="utm_source" value="solidstate.cc" />
        <button
          type="submit"
          style={{
            fontFamily: mono,
            fontSize: "12px",
            fontWeight: 700,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            padding: "11px 18px",
            backgroundColor: "var(--fg)",
            color: "var(--bg)",
            border: "1px solid var(--fg)",
            cursor: "pointer",
            whiteSpace: "nowrap",
          }}
        >
          Subscribe →
        </button>
      </div>
    </form>
  )
}
