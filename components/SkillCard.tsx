"use client"

import Link from "next/link"
import { Skill } from "@/lib/types"
import { PlatformBadge } from "./PlatformBadge"

interface SkillCardProps {
  skill: Skill
  compact?: boolean
}

export function SkillCard({ skill, compact = false }: SkillCardProps) {
  const priceLabel =
    skill.price === "free" ? "FREE" : `$${skill.price}`
  const priceColor =
    skill.price === "free" ? "#47DE43" : "#f0f0f0"

  return (
    <Link
      href={`/skills/${skill.slug}`}
      style={{
        display: "block",
        backgroundColor: "#111111",
        border: "1px solid #1a1a1a",
        borderRadius: "6px",
        padding: compact ? "16px" : "20px",
        textDecoration: "none",
        color: "inherit",
        transition: "border-color 0.15s, background-color 0.15s",
        position: "relative",
        overflow: "hidden",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget
        el.style.borderColor = "#333333"
        el.style.backgroundColor = "#141414"
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget
        el.style.borderColor = "#1a1a1a"
        el.style.backgroundColor = "#111111"
      }}
    >
      {/* Featured accent */}
      {skill.featured && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "2px",
            backgroundColor: "#47DE43",
          }}
        />
      )}

      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: "12px",
          marginBottom: "10px",
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
            <span
              style={{
                fontFamily: "var(--font-jetbrains-mono), monospace",
                fontSize: "13px",
                fontWeight: 600,
                color: "#f0f0f0",
                letterSpacing: "-0.01em",
              }}
            >
              {skill.name}
            </span>
            {skill.verified && (
              <span
                title="Verified by Solid State"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "3px",
                  backgroundColor: "rgba(118, 185, 0, 0.12)",
                  color: "#47DE43",
                  fontSize: "9px",
                  fontFamily: "var(--font-jetbrains-mono), monospace",
                  fontWeight: 600,
                  padding: "2px 6px",
                  borderRadius: "3px",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  border: "1px solid rgba(118, 185, 0, 0.25)",
                }}
              >
                ✓ VERIFIED
              </span>
            )}
          </div>
          <div
            style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: "10px",
              color: "#555555",
              marginTop: "3px",
              letterSpacing: "0.02em",
            }}
          >
            {skill.author} · v{skill.version}
          </div>
        </div>

        <div
          style={{
            fontFamily: "var(--font-jetbrains-mono), monospace",
            fontSize: "12px",
            fontWeight: 700,
            color: priceColor,
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          {priceLabel}
        </div>
      </div>

      {/* Description */}
      <p
        style={{
          fontSize: "13px",
          color: "#888888",
          lineHeight: "1.5",
          margin: "0 0 12px",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {skill.description}
      </p>

      {/* Platform badges */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "5px", marginBottom: "12px" }}>
        {skill.platforms.map((p) => (
          <PlatformBadge key={p} platform={p} />
        ))}
      </div>

      {/* Footer stats */}
      {!compact && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            borderTop: "1px solid #1a1a1a",
            paddingTop: "10px",
            marginTop: "4px",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: "10px",
              color: "#555555",
            }}
          >
            ↓ {skill.stats.installs.toLocaleString()}
          </span>
          <span
            style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: "10px",
              color: "#555555",
            }}
          >
            ★ {skill.stats.stars.toLocaleString()}
          </span>
          <span
            style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: "10px",
              color: "#555555",
              marginLeft: "auto",
            }}
          >
            {skill.categories[0]}
          </span>
        </div>
      )}
    </Link>
  )
}
