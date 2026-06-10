"use client"

import { useState } from "react"
import { CATEGORIES, PLATFORMS } from "@/lib/skills"
import { Platform, PLATFORM_LABEL } from "@/lib/types"

// Submitters can also tag a skill "generic" (any spec-compliant runtime).
const SUBMIT_PLATFORMS: Platform[] = [...PLATFORMS, "generic"]

type FormState = "idle" | "submitting" | "success" | "error"

export function SubmitForm() {
  const [state, setState] = useState<FormState>("idle")
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])

  function togglePlatform(p: string) {
    setSelectedPlatforms((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]
    )
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setErrorMsg(null)

    if (selectedPlatforms.length === 0) {
      setErrorMsg("Pick at least one compatible platform.")
      return
    }

    setState("submitting")

    const form = e.currentTarget
    const data = new FormData(form)

    const get = (k: string) => (data.get(k) as string | null)?.trim() || ""
    const priceRaw = get("price_usd")
    const tagsRaw = get("tags")

    const submission = {
      submitter_name: get("submitter_name"),
      submitter_email: get("submitter_email"),
      skill_name: get("skill_name"),
      short_description: get("short_description"),
      long_description: get("long_description"),
      version: get("version"),
      category: get("category"),
      install_command: get("install_command"),
      platforms: selectedPlatforms,
      repo_url: get("repo_url") || null,
      docs_url: get("docs_url") || null,
      pricing_model: get("pricing_model") || "free",
      price_usd: priceRaw ? Number(priceRaw) : null,
      tags: tagsRaw
        ? tagsRaw.split(",").map((t) => t.trim()).filter(Boolean)
        : [],
    }

    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submission),
      })
      if (!res.ok) {
        const { error } = await res.json().catch(() => ({ error: null }))
        setErrorMsg(error || "Something went wrong. Try again.")
        setState("error")
        return
      }
    } catch {
      setErrorMsg("Network error. Try again.")
      setState("error")
      return
    }

    setState("success")
  }

  const inputStyle = {
    display: "block",
    width: "100%",
    backgroundColor: "var(--bg-2)",
    border: "1px solid var(--border-2)",
    borderRadius: "4px",
    color: "var(--fg)",
    fontFamily: "var(--font-jetbrains-mono), monospace",
    fontSize: "13px",
    padding: "10px 12px",
    outline: "none",
    transition: "border-color 0.15s",
  } as React.CSSProperties

  // Visible focus state: brighten the border when a field is active.
  const focusBorder = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.currentTarget.style.borderColor = "var(--fg)"
  }
  const blurBorder = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.currentTarget.style.borderColor = "var(--border-2)"
  }

  const labelStyle = {
    display: "block",
    fontFamily: "var(--font-jetbrains-mono), monospace",
    fontSize: "10px",
    fontWeight: 600,
    color: "var(--fg)",
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
    color: "var(--ink-2)",
    marginTop: "5px",
  } as React.CSSProperties

  if (state === "success") {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "64px 24px",
          backgroundColor: "var(--bg)",
          border: "1px solid var(--border)",
          borderRadius: "8px",
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-jetbrains-mono), monospace",
            fontSize: "32px",
            color: "var(--fg)",
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
            color: "var(--fg)",
            letterSpacing: "-0.02em",
            margin: "0 0 8px",
          }}
        >
          Submission received.
        </h2>
        <p style={{ fontSize: "14px", color: "var(--fg)", margin: 0 }}>
          We’ll review your skill and reach out via email within 2–5 business days.
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
          color: "var(--fg)",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          marginBottom: "20px",
        }}
      >
        Basic Info
      </div>

      <div style={fieldStyle}>
        <label style={labelStyle}>Skill name *</label>
        <input
          required
          name="skill_name"
          type="text"
          placeholder="e.g. Deep Research Pro"
          style={inputStyle}
          onFocus={focusBorder}
          onBlur={blurBorder}
        />
      </div>

      <div className="ss-form-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "24px" }}>
        <div>
          <label style={labelStyle}>Your name / handle *</label>
          <input
            required
            name="submitter_name"
            type="text"
            placeholder="e.g. solidstate"
            style={inputStyle}
          onFocus={focusBorder}
          onBlur={blurBorder}
          />
        </div>
        <div>
          <label style={labelStyle}>Email *</label>
          <input
            required
            name="submitter_email"
            type="email"
            placeholder="you@example.com"
            style={inputStyle}
          onFocus={focusBorder}
          onBlur={blurBorder}
          />
        </div>
      </div>

      <div style={fieldStyle}>
        <label style={labelStyle}>Short description *</label>
        <input
          required
          name="short_description"
          type="text"
          maxLength={120}
          placeholder="One-line summary of what the skill does"
          style={inputStyle}
          onFocus={focusBorder}
          onBlur={blurBorder}
        />
        <div style={hintStyle}>Max 120 characters</div>
      </div>

      <div style={fieldStyle}>
        <label style={labelStyle}>Long description *</label>
        <textarea
          required
          name="long_description"
          rows={6}
          placeholder="Detailed description, key capabilities, use cases. Markdown supported."
          style={{
            ...inputStyle,
            resize: "vertical",
            lineHeight: "1.6",
            minHeight: "120px",
          }}
          onFocus={focusBorder}
          onBlur={blurBorder}
        />
        <div style={hintStyle}>Markdown supported. Be specific about what the skill does.</div>
      </div>

      {/* Technical */}
      <div
        style={{
          fontFamily: "var(--font-jetbrains-mono), monospace",
          fontSize: "11px",
          fontWeight: 600,
          color: "var(--fg)",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          marginBottom: "20px",
          paddingTop: "24px",
          borderTop: "1px solid var(--border)",
        }}
      >
        Technical Details
      </div>

      <div className="ss-form-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "24px" }}>
        <div>
          <label style={labelStyle}>Version *</label>
          <input
            required
            name="version"
            type="text"
            placeholder="e.g. 1.0.0"
            style={inputStyle}
          onFocus={focusBorder}
          onBlur={blurBorder}
          />
        </div>
        <div>
          <label style={labelStyle}>Category *</label>
          <select
            required
            name="category"
            defaultValue=""
            style={{ ...inputStyle, cursor: "pointer" }}
            onFocus={focusBorder}
            onBlur={blurBorder}
          >
            <option value="" disabled>Select category</option>
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
          name="install_command"
          type="text"
          placeholder="e.g. openclaw skill install my-skill"
          style={{ ...inputStyle, fontFamily: "var(--font-jetbrains-mono), monospace" }}
          onFocus={focusBorder}
          onBlur={blurBorder}
        />
      </div>

      <div style={fieldStyle}>
        <label style={labelStyle}>Compatible platforms *</label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "4px" }}>
          {SUBMIT_PLATFORMS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => togglePlatform(p)}
              style={{
                fontFamily: "var(--font-jetbrains-mono), monospace",
                fontSize: "11px",
                fontWeight: 500,
                color: "var(--fg)",
                backgroundColor: selectedPlatforms.includes(p) ? "rgba(var(--fg-rgb), 0.1)" : "var(--bg)",
                border: `1px solid ${selectedPlatforms.includes(p) ? "var(--fg)" : "var(--border)"}`,
                padding: "6px 12px",
                borderRadius: "4px",
                cursor: "pointer",
                transition: "all 0.15s",
                letterSpacing: "0.03em",
              }}
            >
              {PLATFORM_LABEL[p]}
            </button>
          ))}
        </div>
      </div>

      <div className="ss-form-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "24px" }}>
        <div>
          <label style={labelStyle}>Repository URL</label>
          <input
            name="repo_url"
            type="url"
            placeholder="https://github.com/…"
            style={inputStyle}
          onFocus={focusBorder}
          onBlur={blurBorder}
          />
        </div>
        <div>
          <label style={labelStyle}>Documentation URL</label>
          <input
            name="docs_url"
            type="url"
            placeholder="https://docs.example.com/…"
            style={inputStyle}
          onFocus={focusBorder}
          onBlur={blurBorder}
          />
        </div>
      </div>

      {/* Pricing */}
      <div
        style={{
          fontFamily: "var(--font-jetbrains-mono), monospace",
          fontSize: "11px",
          fontWeight: 600,
          color: "var(--fg)",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          marginBottom: "20px",
          paddingTop: "24px",
          borderTop: "1px solid var(--border)",
        }}
      >
        Pricing
      </div>

      <div className="ss-form-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "32px" }}>
        <div>
          <label style={labelStyle}>Pricing model *</label>
          <select
            required
            name="pricing_model"
            defaultValue="free"
            style={{ ...inputStyle, cursor: "pointer" }}
            onFocus={focusBorder}
            onBlur={blurBorder}
          >
            <option value="free">Free</option>
            <option value="paid">Paid</option>
          </select>
        </div>
        <div>
          <label style={labelStyle}>Price (USD, if paid)</label>
          <input
            name="price_usd"
            type="number"
            min="1"
            max="999"
            placeholder="e.g. 29"
            style={inputStyle}
          onFocus={focusBorder}
          onBlur={blurBorder}
          />
          <div style={hintStyle}>Leave blank for free skills</div>
        </div>
      </div>

      {/* Tags */}
      <div style={fieldStyle}>
        <label style={labelStyle}>Tags</label>
        <input
          name="tags"
          type="text"
          placeholder="e.g. research, web-search, citations (comma separated)"
          style={inputStyle}
          onFocus={focusBorder}
          onBlur={blurBorder}
        />
        <div style={hintStyle}>Comma-separated. Helps with discoverability.</div>
      </div>

      {/* Error */}
      {errorMsg && (
        <div
          style={{
            fontFamily: "var(--font-jetbrains-mono), monospace",
            fontSize: "12px",
            color: "var(--fg)",
            backgroundColor: "rgba(var(--fg-rgb), 0.05)",
            border: "1px solid rgba(var(--fg-rgb), 0.3)",
            padding: "10px 12px",
            borderRadius: "4px",
            marginBottom: "16px",
          }}
        >
          {errorMsg}
        </div>
      )}

      {/* Submit */}
      <div
        style={{
          paddingTop: "24px",
          borderTop: "1px solid var(--border)",
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
            color: "var(--bg)",
            backgroundColor: state === "submitting" ? "var(--ink-2)" : "var(--fg)",
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
            color: "var(--fg)",
          }}
        >
          Every submission is reviewed by the Solid State team.
        </span>
      </div>
    </form>
  )
}
