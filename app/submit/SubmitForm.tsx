"use client"

import { useState } from "react"
import { CATEGORIES, PLATFORMS } from "@/lib/skills"

type FormState = "idle" | "submitting" | "success" | "error"

export function SubmitForm() {
  const [state, setState] = useState<FormState>("idle")
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])

  function togglePlatform(p: string) {
    setSelectedPlatforms((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]
    )
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setState("submitting")
    // Simulate review submission delay
    await new Promise((r) => setTimeout(r, 1200))
    setState("success")
  }

  const inputStyle = {
    display: "block",
    width: "100%",
    backgroundColor: "#000000",
    border: "1px solid #000000",
    borderRadius: "4px",
    color: "#ffffff",
    fontFamily: "var(--font-jetbrains-mono), monospace",
    fontSize: "13px",
    padding: "10px 12px",
    outline: "none",
    transition: "border-color 0.15s",
  } as React.CSSProperties

  const labelStyle = {
    display: "block",
    fontFamily: "var(--font-jetbrains-mono), monospace",
    fontSize: "10px",
    fontWeight: 600,
    color: "#ffffff",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    marginBottom: "6px",
  } as React.CSSProperties

  const fieldStyle = {
    marginBottom: "24px",
  } as React.CSSProperties

  const hintStyle = {
    fontFamily: "var(--font-jetbrains-mono), monospace",
    fontSize: "10px",
    color: "#000000",
    marginTop: "5px",
  } as React.CSSProperties

  if (state === "success") {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "64px 24px",
          backgroundColor: "#000000",
          border: "1px solid #000000",
          borderRadius: "8px",
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-jetbrains-mono), monospace",
            fontSize: "32px",
            color: "#ffffff",
            marginBottom: "16px",
          }}
        >
          ✓
        </div>
        <h2
          style={{
            fontFamily: "var(--font-jetbrains-mono), monospace",
            fontSize: "18px",
            fontWeight: 700,
            color: "#ffffff",
            letterSpacing: "-0.02em",
            margin: "0 0 8px",
          }}
        >
          Submission received.
        </h2>
        <p style={{ fontSize: "14px", color: "#ffffff", margin: 0 }}>
          We'll review your skill and reach out via email within 2–5 business days.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Basic info */}
      <div
        style={{
          fontFamily: "var(--font-jetbrains-mono), monospace",
          fontSize: "11px",
          fontWeight: 600,
          color: "#ffffff",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          marginBottom: "20px",
        }}
      >
        Basic Info
      </div>

      <div style={fieldStyle}>
        <label style={labelStyle}>Skill name *</label>
        <input required type="text" placeholder="e.g. Deep Research Pro" style={inputStyle} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "24px" }}>
        <div>
          <label style={labelStyle}>Your name / handle *</label>
          <input required type="text" placeholder="e.g. solidstate" style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Email *</label>
          <input required type="email" placeholder="you@example.com" style={inputStyle} />
        </div>
      </div>

      <div style={fieldStyle}>
        <label style={labelStyle}>Short description *</label>
        <input
          required
          type="text"
          maxLength={120}
          placeholder="One-line summary of what the skill does"
          style={inputStyle}
        />
        <div style={hintStyle}>Max 120 characters</div>
      </div>

      <div style={fieldStyle}>
        <label style={labelStyle}>Long description *</label>
        <textarea
          required
          rows={6}
          placeholder="Detailed description, key capabilities, use cases. Markdown supported."
          style={{
            ...inputStyle,
            resize: "vertical",
            lineHeight: "1.6",
            minHeight: "120px",
          }}
        />
        <div style={hintStyle}>Markdown supported. Be specific about what the skill does.</div>
      </div>

      {/* Technical */}
      <div
        style={{
          fontFamily: "var(--font-jetbrains-mono), monospace",
          fontSize: "11px",
          fontWeight: 600,
          color: "#ffffff",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          marginBottom: "20px",
          paddingTop: "24px",
          borderTop: "1px solid #000000",
        }}
      >
        Technical Details
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "24px" }}>
        <div>
          <label style={labelStyle}>Version *</label>
          <input required type="text" placeholder="e.g. 1.0.0" style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Category *</label>
          <select
            required
            style={{ ...inputStyle, cursor: "pointer" }}
          >
            <option value="">Select category</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      <div style={fieldStyle}>
        <label style={labelStyle}>Install command *</label>
        <input
          required
          type="text"
          placeholder="e.g. openclaw skill install my-skill"
          style={{ ...inputStyle, fontFamily: "var(--font-jetbrains-mono), monospace" }}
        />
      </div>

      <div style={fieldStyle}>
        <label style={labelStyle}>Compatible platforms *</label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "4px" }}>
          {PLATFORMS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => togglePlatform(p)}
              style={{
                fontFamily: "var(--font-jetbrains-mono), monospace",
                fontSize: "11px",
                fontWeight: 500,
                color: selectedPlatforms.includes(p) ? "#ffffff" : "#ffffff",
                backgroundColor: selectedPlatforms.includes(p) ? "rgba(118,185,0,0.1)" : "#000000",
                border: `1px solid ${selectedPlatforms.includes(p) ? "#ffffff" : "#000000"}`,
                padding: "6px 12px",
                borderRadius: "4px",
                cursor: "pointer",
                transition: "all 0.15s",
                letterSpacing: "0.03em",
              }}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "24px" }}>
        <div>
          <label style={labelStyle}>Repository URL</label>
          <input type="url" placeholder="https://github.com/…" style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Documentation URL</label>
          <input type="url" placeholder="https://docs.example.com/…" style={inputStyle} />
        </div>
      </div>

      {/* Pricing */}
      <div
        style={{
          fontFamily: "var(--font-jetbrains-mono), monospace",
          fontSize: "11px",
          fontWeight: 600,
          color: "#ffffff",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          marginBottom: "20px",
          paddingTop: "24px",
          borderTop: "1px solid #000000",
        }}
      >
        Pricing
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "32px" }}>
        <div>
          <label style={labelStyle}>Pricing model *</label>
          <select required style={{ ...inputStyle, cursor: "pointer" }}>
            <option value="free">Free</option>
            <option value="paid">Paid</option>
          </select>
        </div>
        <div>
          <label style={labelStyle}>Price (USD, if paid)</label>
          <input type="number" min="1" max="999" placeholder="e.g. 29" style={inputStyle} />
          <div style={hintStyle}>Leave blank for free skills</div>
        </div>
      </div>

      {/* Tags */}
      <div style={fieldStyle}>
        <label style={labelStyle}>Tags</label>
        <input
          type="text"
          placeholder="e.g. research, web-search, citations (comma separated)"
          style={inputStyle}
        />
        <div style={hintStyle}>Comma-separated. Helps with discoverability.</div>
      </div>

      {/* Submit */}
      <div
        style={{
          paddingTop: "24px",
          borderTop: "1px solid #000000",
          display: "flex",
          alignItems: "center",
          gap: "16px",
          flexWrap: "wrap",
        }}
      >
        <button
          type="submit"
          disabled={state === "submitting"}
          style={{
            fontFamily: "var(--font-jetbrains-mono), monospace",
            fontSize: "12px",
            fontWeight: 700,
            color: "#000000",
            backgroundColor: state === "submitting" ? "#000000" : "#ffffff",
            border: "none",
            padding: "11px 24px",
            borderRadius: "4px",
            cursor: state === "submitting" ? "wait" : "pointer",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            transition: "background-color 0.15s",
          }}
        >
          {state === "submitting" ? "Submitting…" : "Submit for Review →"}
        </button>
        <span
          style={{
            fontFamily: "var(--font-jetbrains-mono), monospace",
            fontSize: "10px",
            color: "#000000",
          }}
        >
          All submissions are reviewed by the Solid State team.
        </span>
      </div>
    </form>
  )
}
