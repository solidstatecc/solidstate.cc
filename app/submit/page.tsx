import type { Metadata } from "next"
import { SubmitForm } from "./SubmitForm"

export const metadata: Metadata = {
  title: "Submit a Skill",
  description: "Submit your AI agent skill to the Solid State registry for review.",
}

export default function SubmitPage() {
  return (
    <div style={{ backgroundColor: "#000000", minHeight: "100vh" }}>
      {/* Header */}
      <div
        style={{
          borderBottom: "1px solid #000000",
          padding: "40px 24px 32px",
        }}
      >
        <div style={{ maxWidth: "720px", margin: "0 auto" }}>
          <h1
            style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: "24px",
              fontWeight: 700,
              color: "#ffffff",
              letterSpacing: "-0.02em",
              margin: "0 0 8px",
            }}
          >
            Submit a Skill
          </h1>
          <p style={{ fontSize: "14px", color: "#ffffff", margin: 0, lineHeight: "1.6" }}>
            Every submission gets reviewed. Approved skills get the ✓ badge and a featured slot.
            Two to five business days.
          </p>
        </div>
      </div>

      {/* Process */}
      <div
        style={{
          borderBottom: "1px solid #000000",
          backgroundColor: "#000000",
        }}
      >
        <div
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
                  color: "#ffffff",
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
                  color: "#ffffff",
                  marginBottom: "4px",
                }}
              >
                {label}
              </div>
              <div style={{ fontSize: "12px", color: "#ffffff", lineHeight: "1.5" }}>
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
    </div>
  )
}
