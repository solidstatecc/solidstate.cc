import type { Metadata } from "next"
import { SubmitForm } from "./SubmitForm"

export const metadata: Metadata = {
  title: "Submit a Skill",
  description: "Submit your AI agent skill to the Solid State registry for review.",
}

export default function SubmitPage() {
  return (
    <div style={{ backgroundColor: "var(--bg)", minHeight: "100vh" }}>
      {/* Header */}
      <div
        style={{
          borderBottom: "1px solid var(--bg)",
          padding: "40px 24px 32px",
        }}
      >
        <div style={{ maxWidth: "720px", margin: "0 auto" }}>
          <h1
            style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: "24px",
              fontWeight: 700,
              color: "var(--fg)",
              letterSpacing: "-0.02em",
              margin: "0 0 8px",
            }}
          >
            Submit a Skill
          </h1>
          <p style={{ fontSize: "14px", color: "var(--fg)", margin: 0, lineHeight: "1.6" }}>
            Every submission gets reviewed. Approved skills get the ✓ badge and a featured slot.
            Two to five business days.
          </p>
        </div>
      </div>

      {/* Process */}
      <div
        style={{
          borderBottom: "1px solid var(--bg)",
          backgroundColor: "var(--bg)",
        }}
      >
        <div
          className="ss-steps-grid"
          style={{
            maxWidth: "720px",
            margin: "0 auto",
            padding: "24px",
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "24px",
          }}
        >
          {[
            {
              step: "01",
              label: "Submit",
              desc: "Fill in the form. We review every submission.",
            },
            {
              step: "02",
              label: "Review",
              desc: "Our team tests on live platforms, checks security.",
            },
            {
              step: "03",
              label: "Publish",
              desc: "Approved skills go live within 5 business days.",
            },
          ].map(({ step, label, desc }) => (
            <div key={step}>
              <div
                style={{
                  fontFamily: "var(--font-jetbrains-mono), monospace",
                  fontSize: "10px",
                  color: "var(--fg)",
                  letterSpacing: "0.1em",
                  marginBottom: "4px",
                }}
              >
                {step}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-jetbrains-mono), monospace",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "var(--fg)",
                  marginBottom: "4px",
                }}
              >
                {label}
              </div>
              <div style={{ fontSize: "12px", color: "var(--fg)", lineHeight: "1.5" }}>
                {desc}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Form */}
      <div style={{ maxWidth: "720px", margin: "0 auto", padding: "40px 24px" }}>
        <SubmitForm />
      </div>

      {/* Badge */}
      <div style={{ borderTop: "1px solid var(--border)" }}>
        <div style={{ maxWidth: "720px", margin: "0 auto", padding: "40px 24px 64px" }}>
          <h2
            style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: "14px",
              fontWeight: 700,
              color: "var(--fg)",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              margin: "0 0 8px",
            }}
          >
            Listed? Show it.
          </h2>
          <p style={{ fontSize: "13px", color: "var(--ink-5)", margin: "0 0 20px", lineHeight: 1.6 }}>
            Drop the badge in your README. Links back to your listing.
          </p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/badge-listed-on-solid-state.svg"
            alt="Listed on Solid State"
            width={184}
            height={30}
            style={{ display: "block", marginBottom: "20px" }}
          />
          <pre
            style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: "12px",
              color: "var(--ink-8)",
              backgroundColor: "var(--bg-3)",
              border: "1px solid var(--border)",
              padding: "16px 20px",
              overflowX: "auto",
              whiteSpace: "pre-wrap",
              wordBreak: "break-all",
              margin: 0,
            }}
          >
            {`[![Listed on Solid State](https://solidstate.cc/badge-listed-on-solid-state.svg)](https://solidstate.cc/skills/YOUR-SKILL-SLUG)`}
          </pre>
          <p style={{ fontSize: "12px", color: "var(--ink-1)", margin: "12px 0 0", lineHeight: 1.6 }}>
            Light variant: /badge-listed-on-solid-state-light.svg
          </p>
        </div>
      </div>
    </div>
  )
}
