export type Platform = "openclaw" | "hermes" | "antigravity" | "aura" | "generic"

export interface Skill {
  id: string
  name: string
  slug: string
  description: string
  longDescription: string
  author: string
  version: string
  platforms: Platform[]
  categories: string[]
  installCommand: string
  repoUrl?: string
  docsUrl?: string
  price: "free" | number
  verified: boolean
  featured: boolean
  tags: string[]
  createdAt: string
  stats: { installs: number; stars: number }
}
