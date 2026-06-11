import type { Metadata } from "next"

// Post-purchase page. Transactional, no search value.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default function ShipKitThanksLayout({ children }: { children: React.ReactNode }) {
  return children
}
