import { Platform, PLATFORM_LABEL } from "@/lib/types"

interface PlatformBadgeProps {
  platform: Platform
  size?: "sm" | "md"
}

export function PlatformBadge({ platform, size = "sm" }: PlatformBadgeProps) {
  const label = PLATFORM_LABEL[platform] ?? platform
  const fontSize = size === "md" ? "11px" : "10px"
  const padding = size === "md" ? "3px 8px" : "2px 6px"

  return (
    <span
      style={{
        display: "inline-block",
        fontFamily: "var(--font-jetbrains-mono), monospace",
        fontSize,
        fontWeight: 500,
        color: "var(--fg)",
        backgroundColor: "var(--bg)",
        border: "1px solid var(--fg)",
        padding,
        borderRadius: "3px",
        letterSpacing: "0.03em",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </span>
  )
}
