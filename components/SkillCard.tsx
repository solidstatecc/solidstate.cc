"use client"
import Link from "next/link"
import type { Skill } from "@/lib/types"

export function SkillCard({ skill }: { skill: Skill }) {
  const price = skill.price === 0 || skill.price === "free" ? "Free" : `$${skill.price}`

  return (
    <Link href={`/skills/${skill.slug}`} style={{
      display: "block",
      padding: "28px",
      border: "1px solid #222222",
      textDecoration: "none",
      transition: "border-color 0.1s",
    }}
    onMouseEnter={e => (e.currentTarget.style.borderColor = "#ffffff")}
    onMouseLeave={e => (e.currentTarget.style.borderColor = "#222222")}
    >
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: "10px",
      }}>
        <span style={{
          fontFamily: "monospace",
          fontSize: "13px",
          fontWeight: 700,
          letterSpacing: "-0.01em",
        }}>
          {skill.name}
        </span>
        <span style={{
          fontFamily: "monospace",
          fontSize: "11px",
          color: skill.price === 0 || skill.price === "free" ? "#ffffff" : "#555555",
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          marginLeft: "12px",
          flexShrink: 0,
        }}>
          {price}
        </span>
      </div>

      <p style={{
        fontSize: "13px",
        color: "#555555",
        lineHeight: 1.6,
        marginBottom: "20px",
      }}>
        {skill.description}
      </p>

      <div style={{
        fontFamily: "monospace",
        fontSize: "11px",
        color: "#333333",
        backgroundColor: "#080808",
        padding: "7px 10px",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        marginBottom: "16px",
      }}>
        {skill.installCommand}
      </div>

      <div style={{
        display: "flex",
        gap: "6px",
        flexWrap: "wrap",
      }}>
        {skill.platforms.map(p => (
          <span key={p} style={{
            fontFamily: "monospace",
            fontSize: "10px",
            color: "#444444",
            letterSpacing: "0.04em",
            textTransform: "uppercase",
          }}>
            {p}
          </span>
        ))}
      </div>
    </Link>
  )
}
