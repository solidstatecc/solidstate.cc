import type { Metadata } from "next"
import { JetBrains_Mono, Inter } from "next/font/google"
import "./globals.css"
import { Nav } from "@/components/Nav"
import { Footer } from "@/components/Footer"

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
})

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: {
    default: "Solid State — AI Agent Skills Marketplace",
    template: "%s | Solid State",
  },
  description:
    "The skills marketplace for AI agents. Browse, install, and publish skills for OpenClaw, Hermes, Google Antigravity, Aura, and more.",
  keywords: ["AI agent skills", "OpenClaw", "Hermes", "skills marketplace", "agent tools"],
  metadataBase: new URL("https://solidstate.cc"),
  openGraph: {
    type: "website",
    siteName: "Solid State",
    title: "Solid State — AI Agent Skills Marketplace",
    description: "The skills marketplace for AI agents. Multi-platform. Verified. Operator-grade.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Solid State — AI Agent Skills Marketplace",
    description: "The skills marketplace for AI agents. Multi-platform. Verified. Operator-grade.",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${jetbrainsMono.variable} ${inter.variable} h-full`}
      style={{ fontFamily: "var(--font-inter), ui-sans-serif, system-ui, sans-serif" }}
    >
      <body className="min-h-full flex flex-col" style={{ backgroundColor: "#0a0a0a", color: "#f0f0f0" }}>
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
