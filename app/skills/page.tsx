import type { Metadata } from "next"
import { Suspense } from "react"
import { skills, CATEGORIES, PLATFORMS } from "@/lib/skills"
import { SkillsBrowser } from "./SkillsBrowser"

export const metadata: Metadata = {
  title: "Browse Skills",
  description: "Browse and filter AI agent skills for OpenClaw, Hermes, Antigravity, Aura, and more.",
}

export default function SkillsPage() {
  return (
    <div style={{ backgroundColor: "#000000", minHeight: "100vh" }}>
      {/* Header */}
      <div
        style={{
          borderBottom: "1px solid #000000",
          padding: "40px 24px 32px",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <h1
            style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: "24px",
              fontWeight: 700,
              color: "#ffffff",
              letterSpacing: "-0.02em",
              margin: "0 0 6px",
            }}
          >
            Browse Skills
          </h1>
          <p style={{ fontSize: "14px", color: "#ffffff", margin: 0 }}>
            {skills.length} skills across {PLATFORMS.length} platforms
          </p>
        </div>
      </div>

      <Suspense
        fallback={
          <div
            style={{
              maxWidth: "1200px",
              margin: "0 auto",
              padding: "48px 24px",
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: "12px",
              color: "#ffffff",
            }}
          >
            Loading…
          </div>
        }
      >
        <SkillsBrowser
          skills={skills}
          categories={CATEGORIES}
          platforms={[...PLATFORMS]}
        />
      </Suspense>
    </div>
  )
}
