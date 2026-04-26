import { Platform } from "@/lib/types"

const PLATFORM_CONFIG: Record<Platform, { label: string }> = {
  openclaw: { label: "OpenClaw" },
  nemoclaw: { label: "NemoClaw" },
  antigravity: { label: "Antigravity" },
  generic: { label: "Generic" },
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
        color: "#ffffff",
        backgroundColor: "#000000",
        border: "1px solid #ffffff",
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
