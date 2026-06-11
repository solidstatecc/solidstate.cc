import type { Metadata } from "next"

// Receipt page. Reachable from old order emails only — keep out of the index.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default function BuySuccessLayout({ children }: { children: React.ReactNode }) {
  return children
}
