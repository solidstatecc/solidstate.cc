"use client"

import { useState, useMemo, useEffect } from "react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { Skill, Platform } from "@/lib/types"
import { SkillCard } from "@/components/SkillCard"
import { Leaderboard } from "@/components/Leaderboard"

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
  const [trendingOnly, setTrendingOnly] = useState(searchParams.get("trending") === "1")
  const [sortBy, setSortBy] = useState(searchParams.get("sort") ?? "installs")
  const [view, setView] = useState<"leaderboard" | "grid">(
    searchParams.get("view") === "grid" ? "grid" : "leaderboard"
  )

  // Sync URL params
  useEffect(() => {
    const params = new URLSearchParams()
    if (search) params.set("q", search)
    if (selectedCategory) params.set("category", selectedCategory)
    if (selectedPlatform) params.set("platform", selectedPlatform)
    if (priceFilter) params.set("price", priceFilter)
    if (verifiedOnly) params.set("verified", "1")
    if (trendingOnly) params.set("trending", "1")
    if (sortBy !== "installs") params.set("sort", sortBy)
    if (view !== "leaderboard") params.set("view", view)
    const query = params.toString()
    router.replace(pathname + (query ? "?" + query : ""), { scroll: false })
  }, [search, selectedCategory, selectedPlatform, priceFilter, verifiedOnly, trendingOnly, sortBy, view, router, pathname])

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
      result = result.filter((s) => s.provenance === "first-party" || s.provenance === "audited")
    }

    if (trendingOnly) {
      result = result.filter((s) => s.trending)
    }

    result.sort((a, b) => {
      if (sortBy === "installs") return (b.stats?.installs ?? 0) - (a.stats?.installs ?? 0)
      if (sortBy === "trend") {
        const t = Number(b.trending ?? false) - Number(a.trending ?? false)
        return t !== 0 ? t : (b.stats?.installs ?? 0) - (a.stats?.installs ?? 0)
      }
      if (sortBy === "stars") return (b.stats?.stars ?? 0) - (a.stats?.stars ?? 0)
      if (sortBy === "name") return a.name.localeCompare(b.name)
      if (sortBy === "newest") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      return 0
    })

    return result
  }, [skills, search, selectedCategory, selectedPlatform, priceFilter, verifiedOnly, trendingOnly, sortBy])

  function clearFilters() {
    setSearch("")
    setSelectedCategory("")
    setSelectedPlatform("")
    setPriceFilter("")
    setVerifiedOnly(false)
    setTrendingOnly(false)
    setSortBy("installs")
  }

  const hasFilters = search || selectedCategory || selectedPlatform || priceFilter || verifiedOnly || trendingOnly

  const inputStyle = {
    backgroundColor: "#000000",
    border: "1px solid #000000",
    borderRadius: "4px",
    color: "#ffffff",
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
    color: "#ffffff",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    display: "block",
    marginBottom: "6px",
  } as React.CSSProperties

  return (
    <div
      className="ss-browse-grid"
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
                  color: priceFilter === opt.value ? "#ffffff" : "#ffffff",
                }}
              >
                <input
                  type="radio"
                  name="price"
                  value={opt.value}
                  checked={priceFilter === opt.value}
                  onChange={() => setPriceFilter(opt.value)}
                  style={{ accentColor: "#ffffff" }}
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
              color: verifiedOnly ? "#ffffff" : "#ffffff",
            }}
          >
            <input
              type="checkbox"
              checked={verifiedOnly}
              onChange={(e) => setVerifiedOnly(e.target.checked)}
              style={{ accentColor: "#ffffff" }}
            />
            ✓ Trusted only
          </label>
        </div>

        {/* Trending */}
        <div style={{ marginBottom: "24px" }}>
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              cursor: "pointer",
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: "12px",
              color: "#ffffff",
            }}
          >
            <input
              type="checkbox"
              checked={trendingOnly}
              onChange={(e) => setTrendingOnly(e.target.checked)}
              style={{ accentColor: "#ffffff" }}
            />
            ↑ Trending now
          </label>
        </div>

        {/* Clear */}
        {hasFilters && (
          <button
            onClick={clearFilters}
            style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: "11px",
              color: "#ffffff",
              backgroundColor: "transparent",
              border: "1px solid #000000",
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
              color: "#ffffff",
            }}
          >
            {filtered.length} results
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            {/* View toggle */}
            <div style={{ display: "flex", border: "1px solid #222222", borderRadius: "4px", overflow: "hidden" }}>
              {(["leaderboard", "grid"] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  style={{
                    fontFamily: "var(--font-jetbrains-mono), monospace",
                    fontSize: "10px",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    padding: "5px 10px",
                    cursor: "pointer",
                    border: "none",
                    backgroundColor: view === v ? "#ffffff" : "transparent",
                    color: view === v ? "#000000" : "#888888",
                  }}
                >
                  {v === "leaderboard" ? "Board" : "Grid"}
                </button>
              ))}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span
                style={{
                  fontFamily: "var(--font-jetbrains-mono), monospace",
                  fontSize: "10px",
                  color: "#ffffff",
                  letterSpacing: "0.06em",
                }}
              >
                SORT
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  backgroundColor: "#000000",
                  border: "1px solid #000000",
                  borderRadius: "4px",
                  color: "#ffffff",
                  fontFamily: "var(--font-jetbrains-mono), monospace",
                  fontSize: "11px",
                  padding: "5px 8px",
                  cursor: "pointer",
                  outline: "none",
                }}
              >
                <option value="installs">Most installed</option>
                <option value="trend">Trending ↑</option>
                <option value="stars">Most starred</option>
                <option value="name">Name A–Z</option>
                <option value="newest">Newest</option>
              </select>
            </div>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div
            style={{
              padding: "64px 0",
              textAlign: "center",
              borderRadius: "6px",
              border: "1px solid #000000",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-jetbrains-mono), monospace",
                fontSize: "13px",
                color: "#ffffff",
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
                color: "#ffffff",
                backgroundColor: "transparent",
                border: "none",
                cursor: "pointer",
                letterSpacing: "0.05em",
              }}
            >
              Clear filters →
            </button>
          </div>
        ) : view === "leaderboard" ? (
          <Leaderboard skills={filtered} />
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
