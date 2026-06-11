import type { Metadata } from "next"

// Checkout-cancel page. Transactional, no search value.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default function BuyCancelLayout({ children }: { children: React.ReactNode }) {
  return children
}
