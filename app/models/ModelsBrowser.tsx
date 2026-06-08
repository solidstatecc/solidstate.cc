"use client"

import { useState, useMemo, useEffect } from "react"

interface ModelRow {
  provider: string
  providerName: string
  id: string
  name: string
  family: string | null
  reasoning: boolean
  toolCall: boolean
  attachment: boolean
  openWeights: boolean
  context: number | null
  maxOutput: number | null
  costIn: number | null
  costOut: number | null
  released: string | null
  updated: string | null
  knowledge: string | null
  modIn: string[]
  modOut: string[]
}

interface ModelsData {
  captured: string
  providers: string[]
  rows: ModelRow[]
}

const mono = "var(--font-jetbrains-mono), monospace"
const PAGE = 100

function fmtContext(n: number | null): string {
  if (!n) return "—"
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1)}M`
  if (n >= 1_000) return `${Math.round(n / 1_000)}K`
  return String(n)
}

function fmtCost(n: number | null): string {
  if (n === null || n === undefined) return "—"
  if (n === 0) return "free"
  return `$${n}`
}

const inputStyle = {
  backgroundColor: "var(--bg)",
  border: "1px solid var(--border)",
  color: "var(--fg)",
  fontFamily: mono,
  fontSize: "13px",
  padding: "10px 12px",
  outline: "none",
} as const

const selectStyle = { ...inputStyle, cursor: "pointer" } as const

function Toggle({
  on,
  label,
  onClick,
}: {
  on: boolean
  label: string
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      style={{
        fontFamily: mono,
        fontSize: "11px",
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        padding: "10px 12px",
        cursor: "pointer",
        border: `1px solid ${on ? "var(--fg)" : "var(--border)"}`,
        backgroundColor: on ? "var(--fg)" : "var(--bg)",
        color: on ? "var(--bg)" : "var(--ink-4)",
      }}
    >
      {label}
    </button>
  )
}

export function ModelsBrowser() {
  const [data, setData] = useState<ModelsData | null>(null)
  const [error, setError] = useState(false)
  const [search, setSearch] = useState("")
  const [provider, setProvider] = useState("")
  const [reasoningOnly, setReasoningOnly] = useState(false)
  const [toolsOnly, setToolsOnly] = useState(false)
  const [openOnly, setOpenOnly] = useState(false)
  const [sortBy, setSortBy] = useState("newest")
  const [limit, setLimit] = useState(PAGE)

  useEffect(() => {
    fetch("/data/models.json")
      .then((r) => r.json())
      .then(setData)
      .catch(() => setError(true))
  }, [])

  const filtered = useMemo(() => {
    if (!data) return []
    let result = data.rows

    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.id.toLowerCase().includes(q) ||
          m.providerName.toLowerCase().includes(q) ||
          (m.family ?? "").toLowerCase().includes(q)
      )
    }
    if (provider) result = result.filter((m) => m.providerName === provider)
    if (reasoningOnly) result = result.filter((m) => m.reasoning)
    if (toolsOnly) result = result.filter((m) => m.toolCall)
    if (openOnly) result = result.filter((m) => m.openWeights)

    if (sortBy !== "newest") {
      result = [...result]
      if (sortBy === "context") result.sort((a, b) => (b.context ?? 0) - (a.context ?? 0))
      if (sortBy === "cheapest")
        result.sort(
          (a, b) => (a.costIn ?? Infinity) - (b.costIn ?? Infinity)
        )
      if (sortBy === "priciest") result.sort((a, b) => (b.costIn ?? 0) - (a.costIn ?? 0))
      if (sortBy === "name") result.sort((a, b) => a.name.localeCompare(b.name))
    }
    return result
  }, [data, search, provider, reasoningOnly, toolsOnly, openOnly, sortBy])

  // Any filter change resets paging.
  function setAndReset<T>(setter: (v: T) => void) {
    return (v: T) => {
      setter(v)
      setLimit(PAGE)
    }
  }
  const updateSearch = setAndReset(setSearch)
  const updateProvider = setAndReset(setProvider)
  const updateSort = setAndReset(setSortBy)
  const toggleReasoning = () => {
    setReasoningOnly(!reasoningOnly)
    setLimit(PAGE)
  }
  const toggleTools = () => {
    setToolsOnly(!toolsOnly)
    setLimit(PAGE)
  }
  const toggleOpen = () => {
    setOpenOnly(!openOnly)
    setLimit(PAGE)
  }

  if (error) {
    return (
      <p style={{ fontFamily: mono, color: "var(--ink-4)", fontSize: "13px", padding: "48px 0" }}>
        Couldn&apos;t load the model index. Refresh to retry.
      </p>
    )
  }

  if (!data) {
    return (
      <p style={{ fontFamily: mono, color: "var(--ink-1)", fontSize: "13px", padding: "48px 0" }}>
        Loading {""}index…
      </p>
    )
  }

  const visible = filtered.slice(0, limit)

  const th = {
    fontFamily: mono,
    fontSize: "10px",
    color: "var(--ink-1)",
    letterSpacing: "0.12em",
    textTransform: "uppercase" as const,
    textAlign: "left" as const,
    padding: "10px 12px",
    borderBottom: "1px solid var(--border)",
    whiteSpace: "nowrap" as const,
  }
  const td = {
    fontFamily: mono,
    fontSize: "12px",
    color: "var(--ink-8)",
    padding: "10px 12px",
    borderBottom: "1px solid var(--bg-3)",
    whiteSpace: "nowrap" as const,
  }

  return (
    <div>
      {/* Controls */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "24px" }}>
        <input
          type="text"
          placeholder="Search models, providers, families…"
          value={search}
          onChange={(e) => updateSearch(e.target.value)}
          style={{ ...inputStyle, flex: "1 1 260px", borderColor: "var(--border)" }}
        />
        <select value={provider} onChange={(e) => updateProvider(e.target.value)} style={selectStyle}>
          <option value="">All providers</option>
          {data.providers.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
        <select value={sortBy} onChange={(e) => updateSort(e.target.value)} style={selectStyle}>
          <option value="newest">Newest</option>
          <option value="context">Longest context</option>
          <option value="cheapest">Cheapest input</option>
          <option value="priciest">Priciest input</option>
          <option value="name">Name A–Z</option>
        </select>
        <Toggle on={reasoningOnly} label="Reasoning" onClick={toggleReasoning} />
        <Toggle on={toolsOnly} label="Tools" onClick={toggleTools} />
        <Toggle on={openOnly} label="Open weights" onClick={toggleOpen} />
      </div>

      {/* Count */}
      <div
        style={{
          fontFamily: mono,
          fontSize: "11px",
          color: "var(--ink-1)",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          marginBottom: "12px",
        }}
      >
        {filtered.length.toLocaleString("en-US")} models
      </div>

      {/* Table */}
      <div style={{ overflowX: "auto", border: "1px solid var(--border)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={th}>Model</th>
              <th style={th}>Provider</th>
              <th style={th}>Context</th>
              <th style={th}>In $/M</th>
              <th style={th}>Out $/M</th>
              <th style={th}>Caps</th>
              <th style={th}>Modalities</th>
              <th style={th}>Released</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((m) => (
              <tr key={`${m.provider}/${m.id}`}>
                <td style={{ ...td, color: "var(--fg)", maxWidth: "320px", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {m.name}
                  {m.openWeights && (
                    <span style={{ color: "var(--ink-1)", marginLeft: "8px", fontSize: "10px" }}>OW</span>
                  )}
                </td>
                <td style={{ ...td, color: "var(--ink-4)" }}>{m.providerName}</td>
                <td style={td}>{fmtContext(m.context)}</td>
                <td style={td}>{fmtCost(m.costIn)}</td>
                <td style={td}>{fmtCost(m.costOut)}</td>
                <td style={{ ...td, color: "var(--ink-4)", fontSize: "10px", letterSpacing: "0.06em" }}>
                  {[m.reasoning && "RSN", m.toolCall && "TOOL", m.attachment && "FILE"]
                    .filter(Boolean)
                    .join(" · ") || "—"}
                </td>
                <td style={{ ...td, color: "var(--ink-4)", fontSize: "10px" }}>
                  {m.modIn.join("+")}→{m.modOut.join("+")}
                </td>
                <td style={{ ...td, color: "var(--ink-4)" }}>{m.released ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {limit < filtered.length && (
        <button
          onClick={() => setLimit(limit + PAGE)}
          style={{
            fontFamily: mono,
            fontSize: "11px",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            padding: "12px 24px",
            marginTop: "16px",
            cursor: "pointer",
            border: "1px solid var(--border)",
            backgroundColor: "var(--bg)",
            color: "var(--fg)",
          }}
        >
          Show more ({(filtered.length - limit).toLocaleString("en-US")} left)
        </button>
      )}
    </div>
  )
}
