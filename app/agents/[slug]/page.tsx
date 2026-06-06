import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { agents, getAgentBySlug, SURFACE_LABEL } from "@/lib/agents"
import { skills } from "@/lib/skills"

type Props = {
  params: Promise<{ slug: string }>
}

const mono = "var(--font-jetbrains-mono), monospace"
const sans = "var(--font-inter), system-ui, sans-serif"

export async function generateStaticParams() {
  return agents.map((a) => ({ slug: a.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const agent = getAgentBySlug(slug)
  if (!agent) return {}
  return {
    title: `${agent.name} skills`,
    description: `How skills install on ${agent.name}, and which Solid State catalog skills run there. ${agent.description}`,
  }
}

export default async function AgentPage({ params }: Props) {
  const { slug } = await params
  const agent = getAgentBySlug(slug)
  if (!agent) notFound()

  const matching = skills.filter((s) => s.platforms.includes(agent.catalogPlatform))

  return (
    <div style={{ backgroundColor: "#000000", minHeight: "100vh" }}>
      {/* Breadcrumb */}
      <div style={{ borderBottom: "1px solid #222222", padding: "14px 24px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <nav
            style={{
              fontFamily: mono,
              fontSize: "11px",
              color: "#555555",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <Link href="/agents" style={{ color: "#ffffff" }}>
              Agents
            </Link>
            <span>›</span>
            <span style={{ color: "#999999" }}>{agent.name}</span>
          </nav>
        </div>
      </div>

      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "64px 32px 96px",
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) 280px",
          gap: "64px",
          alignItems: "start",
        }}
      >
        {/* Main */}
        <article>
          <div
            style={{
              fontFamily: mono,
              fontSize: "11px",
              color: "#555555",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              marginBottom: "16px",
            }}
          >
            {agent.vendor} · {agent.surfaces.map((s) => SURFACE_LABEL[s]).join(" · ")}
            {agent.openSource ? " · Open source" : ""}
          </div>
          <h1
            style={{
              fontFamily: mono,
              fontSize: "clamp(36px, 6vw, 64px)",
              fontWeight: 700,
              lineHeight: 1,
              letterSpacing: "-0.03em",
              color: "#ffffff",
              marginBottom: "24px",
            }}
          >
            {agent.name}
          </h1>
          <p
            style={{
              fontFamily: sans,
              fontSize: "16px",
              color: "#cccccc",
              lineHeight: 1.8,
              marginBottom: "48px",
              maxWidth: "640px",
            }}
          >
            {agent.description}
          </p>

          <h2
            style={{
              fontFamily: mono,
              fontSize: "13px",
              fontWeight: 700,
              color: "#ffffff",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginBottom: "16px",
            }}
          >
            How skills install
          </h2>
          <p
            style={{
              fontFamily: sans,
              fontSize: "14px",
              color: "#999999",
              lineHeight: 1.8,
              marginBottom: agent.skillsDir ? "24px" : "48px",
              maxWidth: "640px",
            }}
          >
            {agent.skillInstall}
          </p>
          {agent.skillsDir && (
            <div
              style={{
                fontFamily: mono,
                fontSize: "13px",
                color: "#ffffff",
                backgroundColor: "#111111",
                border: "1px solid #222222",
                padding: "16px 20px",
                marginBottom: "48px",
                maxWidth: "640px",
              }}
            >
              {agent.skillsDir}
            </div>
          )}

          <h2
            style={{
              fontFamily: mono,
              fontSize: "13px",
              fontWeight: 700,
              color: "#ffffff",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginBottom: "16px",
            }}
          >
            Skills in the catalog
          </h2>
          <p
            style={{
              fontFamily: sans,
              fontSize: "14px",
              color: "#999999",
              lineHeight: 1.8,
              marginBottom: "24px",
              maxWidth: "640px",
            }}
          >
            {matching.length} indexed skills are tagged for this runtime
            {agent.catalogPlatform === "generic"
              ? " (spec-compliant, runtime-agnostic)."
              : "."}
          </p>
          <Link
            href={`/skills?platform=${agent.catalogPlatform}`}
            style={{
              display: "inline-block",
              fontFamily: mono,
              fontSize: "12px",
              color: "#000000",
              backgroundColor: "#ffffff",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              padding: "12px 20px",
              textDecoration: "none",
            }}
          >
            Browse {agent.name} skills →
          </Link>
        </article>

        {/* Sidebar */}
        <aside
          style={{
            border: "1px solid #222222",
            padding: "24px",
            position: "sticky",
            top: "80px",
          }}
        >
          <div
            style={{
              fontFamily: mono,
              fontSize: "10px",
              color: "#555555",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              marginBottom: "16px",
            }}
          >
            Links
          </div>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {agent.siteUrl && (
              <li style={{ marginBottom: "10px" }}>
                <a
                  href={agent.siteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontFamily: sans, fontSize: "13px", color: "#ffffff" }}
                >
                  Website ↗
                </a>
              </li>
            )}
            {agent.repoUrl && (
              <li style={{ marginBottom: "10px" }}>
                <a
                  href={agent.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontFamily: sans, fontSize: "13px", color: "#ffffff" }}
                >
                  Source ↗
                </a>
              </li>
            )}
            {agent.docsUrl && (
              <li style={{ marginBottom: "10px" }}>
                <a
                  href={agent.docsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontFamily: sans, fontSize: "13px", color: "#ffffff" }}
                >
                  Docs ↗
                </a>
              </li>
            )}
            <li style={{ marginBottom: "10px" }}>
              <a
                href="https://agentskills.io"
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontFamily: sans, fontSize: "13px", color: "#ffffff" }}
              >
                Agent Skills spec ↗
              </a>
            </li>
          </ul>

          <div
            style={{
              fontFamily: mono,
              fontSize: "10px",
              color: "#555555",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              margin: "24px 0 16px",
            }}
          >
            Other runtimes
          </div>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {agents
              .filter((a) => a.id !== agent.id)
              .map((a) => (
                <li key={a.id} style={{ marginBottom: "10px" }}>
                  <Link
                    href={`/agents/${a.slug}`}
                    style={{ fontFamily: sans, fontSize: "13px", color: "#999999" }}
                  >
                    {a.name}
                  </Link>
                </li>
              ))}
          </ul>
        </aside>
      </div>
    </div>
  )
}
