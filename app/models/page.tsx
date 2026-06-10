import type { Metadata } from "next"
import { MODELS_META } from "@/lib/modelsMeta"
import { ModelsBrowser } from "./ModelsBrowser"

export const metadata: Metadata = {
  title: "Model Index",
  description:
    "Every AI model your agent can run — context windows, pricing, reasoning and tool support. Indexed from the open models.dev database.",
}

const mono = "var(--font-jetbrains-mono), monospace"

export default function ModelsPage() {
  return (
    <div style={{ backgroundColor: "var(--bg)", minHeight: "100vh" }}>
      {/* Header */}
      <section
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "96px 32px 48px",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div
          style={{
            fontFamily: mono,
            fontSize: "11px",
            color: "var(--ink-1)",
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            marginBottom: "20px",
          }}
        >
          Models
        </div>
        <h1
          style={{
            fontFamily: mono,
            fontSize: "clamp(40px, 7vw, 72px)",
            fontWeight: 700,
            lineHeight: 0.98,
            letterSpacing: "-0.03em",
            color: "var(--fg)",
            margin: "0 0 24px",
          }}
        >
          Every model,
          <br />
          one table.
        </h1>
        <p style={{ fontSize: "15px", color: "var(--ink-4)", maxWidth: "580px", lineHeight: 1.6, margin: 0 }}>
          Skills run on models. This is the catalog —{" "}
          {MODELS_META.models.toLocaleString("en-US")} models from {MODELS_META.labs} labs,
          served across {MODELS_META.providers} providers. Context, capabilities, and the
          maker&apos;s first-party price. Rows link to{" "}
          <a href="https://models.dev" style={{ color: "var(--ink-8)" }}>
            models.dev
          </a>{" "}
          for full provider pricing. Refreshed weekly — last capture {MODELS_META.captured}.
        </p>
      </section>

      {/* Browser */}
      <section style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 32px 96px" }}>
        <ModelsBrowser />
      </section>
    </div>
  )
}
