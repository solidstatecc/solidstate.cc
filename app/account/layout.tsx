import type { Metadata } from "next"

// Auth-gated portal. Nothing here belongs in a search index.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return children
}
