"use client"

import { useState } from "react"
import { CATEGORIES, PLATFORMS } from "@/lib/skills"
import {
  validateSubmission,
  hasErrors,
  type FieldErrors,
  type SubmissionInput,
} from "@/lib/submission"

type FormState = "idle" | "submitting" | "success" | "error"

export function SubmitForm() {
  const [state, setState] = useState<FormState>("idle")
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])

  function togglePlatform(p: string) {
    setSelectedPlatforms((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]
    )
    // Clear the platform error the moment the user acts on it.
    setFieldErrors((prev) => {
      if (!prev.platforms) return prev
      const next = { ...prev }
      delete next.platforms
      return next
    })
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setErrorMsg(null)

    const form = e.currentTarget
    const data = new FormData(form)

    const get = (k: string) => (data.get(k) as string | null)?.trim() || ""
    const priceRaw = get("price_usd")
    const tagsRaw = get("tags")

    const submission: SubmissionInput = {
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

    // Same rules the server enforces — fail fast, no round-trip.
    const clientErrors = validateSubmission(submission)
    if (hasErrors(clientErrors)) {
      setFieldErrors(clientErrors)
      setErrorMsg("A few fields need fixing before this can ship.")
      setState("error")
      return
    }

    setFieldErrors({})
    setState("submitting")

    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submission),
      })
      if (!res.ok) {
        const { error, errors } = await res
          .json()
          .catch(() => ({ error: null, errors: null }))
        if (errors) setFieldErrors(errors as FieldErrors)
        setErrorMsg(error || "Something went wrong. Try again.")
        setState("error")
        return
      }
    } catch {
      setErrorMsg("Network dropped. Check your connection and try again.")
      setState("error")
      return
    }

    setState("success")
  }

  const inputStyle = {
    display: "block",
    width: "100%",
    backgroundColor: "#0a0a0a",
    border: "1px solid #333333",
    borderRadius: "4px",
    color: "#ffffff",
    fontFamily: "var(--font-jetbrains-mono), monospace",
    fontSize: "13px",
    padding: "10px 12px",
    outline: "none",
    transition: "border-color 0.15s",
  } as React.CSSProperties

  // Visible focus state: brighten the border when a field is active.
  const focusBorder = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.currentTarget.style.borderColor = "#ffffff"
  }
  const blurBorder = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.currentTarget.style.borderColor = "#333333"
  }

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
    color: "#666666",
    marginTop: "5px",
  } as React.CSSProperties

  const errStyle = {
    fontFamily: "var(--font-jetbrains-mono), monospace",
    fontSize: "10px",
    color: "#ff5c5c",
    marginTop: "5px",
  } as React.CSSProperties

  // Inline, field-level error under an input. Renders nothing when clean.
  const fieldError = (name: keyof FieldErrors) =>
    fieldErrors[name] ? <div style={errStyle}>{fieldErrors[name]}</div> : null

  if (state === "success") {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "64px 24px",
          backgroundColor: "#000000",
          border: "1px solid #222222",
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
        <input
          required
          name="skill_name"
          type="text"
          placeholder="e.g. Deep Research Pro"
          style={inputStyle}
          onFocus={focusBorder}
          onBlur={blurBorder}
        />
        {fieldError("skill_name")}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "24px" }}>
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
          {fieldError("submitter_name")}
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
          {fieldError("submitter_email")}
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
        {fieldError("short_description")}
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
        {fieldError("long_description")}
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
          borderTop: "1px solid #222222",
        }}
      >
        Technical Details
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "24px" }}>
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
          {fieldError("version")}
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
          {fieldError("category")}
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
        {fieldError("install_command")}
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
                color: "#ffffff",
                backgroundColor: selectedPlatforms.includes(p) ? "rgba(255,255,255,0.1)" : "#000000",
                border: `1px solid ${selectedPlatforms.includes(p) ? "#ffffff" : "#222222"}`,
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
        {fieldError("platforms")}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "24px" }}>
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
          {fieldError("repo_url")}
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
          {fieldError("docs_url")}
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
          borderTop: "1px solid #222222",
        }}
      >
        Pricing
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "32px" }}>
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
          {fieldError("price_usd")}
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
        {fieldError("tags")}
      </div>

      {/* Error */}
      {errorMsg && (
        <div
          role="alert"
          style={{
            fontFamily: "var(--font-jetbrains-mono), monospace",
            fontSize: "12px",
            color: "#ff5c5c",
            backgroundColor: "rgba(255,92,92,0.08)",
            border: "1px solid rgba(255,92,92,0.4)",
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
          borderTop: "1px solid #222222",
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
            backgroundColor: state === "submitting" ? "#666666" : "#ffffff",
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
            color: "#ffffff",
          }}
        >
          Every submission is reviewed by the Solid State team.
        </span>
      </div>
    </form>
  )
}
