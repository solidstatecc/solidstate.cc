"use client"

import { useState, useMemo, useEffect } from "react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { Skill, Platform } from "@/lib/types"
import { SkillCard } from "@/components/SkillCard"

interface SkillsBrowserProps {
  skills: Skill[]
  categories: string[]
  platforms: string[]
}

export function SkillsBrowser({ skills, categories, platforms }: SkillsBrowserProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const [search, setSearch] = useState(searchParams.get("q") ?? "")
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") ?? "")
  const [selectedPlatform, setSelectedPlatform] = useState(searchParams.get("platform") ?? "")
  const [priceFilter, setPriceFilter] = useState(searchParams.get("price") ?? "")
  const [verifiedOnly, setVerifiedOnly] = useState(searchParams.get("verified") === "1")
  const [sortBy, setSortBy] = useState(searchParams.get("sort") ?? "installs")

  // Sync URL params
  useEffect(() => {
    const params = new URLSearchParams()
    if (search) params.set("q", search)
    if (selectedCategory) params.set("category", selectedCategory)
    if (selectedPlatform) params.set("platform", selectedPlatform)
    if (priceFilter) params.set("price", priceFilter)
    if (verifiedOnly) params.set("verified", "1")
    if (sortBy !== "installs") params.set("sort", sortBy)
    const query = params.toString()
    router.replace(pathname + (query ? "?" + query : ""), { scroll: false })
  }, [search, selectedCategory, selectedPlatform, priceFilter, verifiedOnly, sortBy, router, pathname])

  const filtered = useMemo(() => {
    let result = [...skills]

    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          s.tags.some((t) => t.toLowerCase().includes(q)) ||
          s.categories.some((c) => c.toLowerCase().includes(q)) ||
          s.author.toLowerCase().includes(q)
      )
    }

    if (selectedCategory) {
      result = result.filter((s) => s.categories.includes(selectedCategory))
    }

    if (selectedPlatform) {
      result = result.filter((s) => s.platforms.includes(selectedPlatform as Platform))
    }

    if (priceFilter === "free") {
      result = result.filter((s) => s.price === "free")
    } else if (priceFilter === "paid") {
      result = result.filter((s) => s.price !== "free")
    }

    if (verifiedOnly) {
      result = result.filter((s) => s.verified)
    }

    result.sort((a, b) => {
      if (sortBy === "installs") return b.stats.installs - a.stats.installs
      if (sortBy === "stars") return b.stats.stars - a.stats.stars
      if (sortBy === "name") return a.name.localeCompare(b.name)
      if (sortBy === "newest") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      return 0
    })

    return result
  }, [skills, search, selectedCategory, selectedPlatform, priceFilter, verifiedOnly, sortBy])

  function clearFilters() {
    setSearch("")
    setSelectedCategory("")
    setSelectedPlatform("")
    setPriceFilter("")
    setVerifiedOnly(false)
    setSortBy("installs")
  }

  const hasFilters = search || selectedCategory || selectedPlatform || priceFilter || verifiedOnly

  const inputStyle = {
    backgroundColor: "#111111",
    border: "1px solid #222222",
    borderRadius: "4px",
    color: "#f0f0f0",
    fontFamily: "var(--font-jetbrains-mono), monospace",
    fontSize: "12px",
    padding: "7px 10px",
    outline: "none",
    width: "100%",
  } as React.CSSProperties

  const labelStyle = {
    fontFamily: "var(--font-jetbrains-mono), monospace",
    fontSize: "10px",
    fontWeight: 600,
    color: "#555555",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    display: "block",
    marginBottom: "6px",
  } as React.CSSProperties

  return (
    <div
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "32px 24px",
        display: "grid",
        gridTemplateColumns: "220px 1fr",
        gap: "32px",
        alignItems: "start",
      }}
    >
      {/* Sidebar filters */}
      <aside style={{ position: "sticky", top: "72px" }}>
        {/* Search */}
        <div style={{ marginBottom: "24px" }}>
          <label style={labelStyle}>Search</label>
          <input
            type="text"
            placeholder="skill name, tag, author…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={inputStyle}
          />
        </div>

        {/* Category */}
        <div style={{ marginBottom: "24px" }}>
          <label style={labelStyle}>Category</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{ ...inputStyle, cursor: "pointer" }}
          >
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Platform */}
        <div style={{ marginBottom: "24px" }}>
          <label style={labelStyle}>Platform</label>
          <select
            value={selectedPlatform}
            onChange={(e) => setSelectedPlatform(e.target.value)}
            style={{ ...inputStyle, cursor: "pointer" }}
          >
            <option value="">All platforms</option>
            {platforms.map((p) => (
              <option key={p} value={p}>
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Price */}
        <div style={{ marginBottom: "24px" }}>
          <label style={labelStyle}>Price</label>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {[
              { value: "", label: "Any price" },
              { value: "free", label: "Free only" },
              { value: "paid", label: "Paid only" },
            ].map((opt) => (
              <label
                key={opt.value}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  cursor: "pointer",
                  fontFamily: "var(--font-jetbrains-mono), monospace",
                  fontSize: "12px",
                  color: priceFilter === opt.value ? "#f0f0f0" : "#888888",
                }}
              >
                <input
                  type="radio"
                  name="price"
                  value={opt.value}
                  checked={priceFilter === opt.value}
                  onChange={() => setPriceFilter(opt.value)}
                  style={{ accentColor: "#47DE43" }}
                />
                {opt.label}
              </label>
            ))}
          </div>
        </div>

        {/* Verified */}
        <div style={{ marginBottom: "24px" }}>
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              cursor: "pointer",
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: "12px",
              color: verifiedOnly ? "#47DE43" : "#888888",
            }}
          >
            <input
              type="checkbox"
              checked={verifiedOnly}
              onChange={(e) => setVerifiedOnly(e.target.checked)}
              style={{ accentColor: "#47DE43" }}
            />
            ✓ Verified only
          </label>
        </div>

        {/* Clear */}
        {hasFilters && (
          <button
            onClick={clearFilters}
            style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: "11px",
              color: "#888888",
              backgroundColor: "transparent",
              border: "1px solid #222222",
              borderRadius: "4px",
              padding: "6px 12px",
              cursor: "pointer",
              letterSpacing: "0.05em",
              width: "100%",
            }}
          >
            Clear filters
          </button>
        )}
      </aside>

      {/* Main grid */}
      <div>
        {/* Sort + count row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "20px",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: "12px",
              color: "#555555",
            }}
          >
            {filtered.length} results
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span
              style={{
                fontFamily: "var(--font-jetbrains-mono), monospace",
                fontSize: "10px",
                color: "#555555",
                letterSpacing: "0.06em",
              }}
            >
              SORT
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                backgroundColor: "#111111",
                border: "1px solid #222222",
                borderRadius: "4px",
                color: "#f0f0f0",
                fontFamily: "var(--font-jetbrains-mono), monospace",
                fontSize: "11px",
                padding: "5px 8px",
                cursor: "pointer",
                outline: "none",
              }}
            >
              <option value="installs">Most installed</option>
              <option value="stars">Most starred</option>
              <option value="name">Name A–Z</option>
              <option value="newest">Newest</option>
            </select>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div
            style={{
              padding: "64px 0",
              textAlign: "center",
              borderRadius: "6px",
              border: "1px solid #1a1a1a",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-jetbrains-mono), monospace",
                fontSize: "13px",
                color: "#555555",
                marginBottom: "12px",
              }}
            >
              No skills match your filters.
            </div>
            <button
              onClick={clearFilters}
              style={{
                fontFamily: "var(--font-jetbrains-mono), monospace",
                fontSize: "11px",
                color: "#47DE43",
                backgroundColor: "transparent",
                border: "none",
                cursor: "pointer",
                letterSpacing: "0.05em",
              }}
            >
              Clear filters →
            </button>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))",
              gap: "12px",
            }}
          >
            {filtered.map((skill) => (
              <SkillCard key={skill.id} skill={skill} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
