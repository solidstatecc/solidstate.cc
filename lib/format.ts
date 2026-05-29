/** Format an install count like skills.sh: 1700000 -> "1.7M", 24800 -> "24.8K". */
export function formatInstalls(n: number): string {
  if (n >= 1_000_000) {
    const v = n / 1_000_000
    return (v >= 10 ? Math.round(v).toString() : v.toFixed(1).replace(/\.0$/, "")) + "M"
  }
  if (n >= 1_000) {
    const v = n / 1_000
    return (v >= 100 ? Math.round(v).toString() : v.toFixed(1).replace(/\.0$/, "")) + "K"
  }
  return n.toLocaleString("en-US")
}
