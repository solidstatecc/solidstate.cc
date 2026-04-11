import { Platform } from "@/lib/types"

const PLATFORM_CONFIG: Record<
  Platform,
  { label: string; color: string; bg: string; border: string }
> = {
  openclaw: {
    label: "OpenClaw",
    color: "#47DE43",
    bg: "rgba(118, 185, 0, 0.1)",
    border: "rgba(118, 185, 0, 0.2)",
  },
  hermes: {
    label: "Hermes",
    color: "#a78bfa",
    bg: "rgba(167, 139, 250, 0.1)",
    border: "rgba(167, 139, 250, 0.2)",
  },
  antigravity: {
    label: "Antigravity",
    color: "#60a5fa",
    bg: "rgba(96, 165, 250, 0.1)",
    border: "rgba(96, 165, 250, 0.2)",
  },
  aura: {
    label: "Aura",
    color: "#fb923c",
    bg: "rgba(251, 146, 60, 0.1)",
    border: "rgba(251, 146, 60, 0.2)",
  },
  generic: {
    label: "Generic",
    color: "#888888",
    bg: "rgba(136, 136, 136, 0.1)",
    border: "rgba(136, 136, 136, 0.2)",
  },
}

interface PlatformBadgeProps {
  platform: Platform
  size?: "sm" | "md"
}

export function PlatformBadge({ platform, size = "sm" }: PlatformBadgeProps) {
  const config = PLATFORM_CONFIG[platform]
  const fontSize = size === "md" ? "11px" : "10px"
  const padding = size === "md" ? "3px 8px" : "2px 6px"

  return (
    <span
      style={{
        display: "inline-block",
        fontFamily: "var(--font-jetbrains-mono), monospace",
        fontSize,
        fontWeight: 500,
        color: config.color,
        backgroundColor: config.bg,
        border: `1px solid ${config.border}`,
        padding,
        borderRadius: "3px",
        letterSpacing: "0.03em",
        whiteSpace: "nowrap",
      }}
    >
      {config.label}
    </span>
  )
}
