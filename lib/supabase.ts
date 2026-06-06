import { createClient, type SupabaseClient } from "@supabase/supabase-js"

/**
 * Public Supabase client. Uses the publishable (anon) key — safe for
 * client-side use. RLS policies enforce what each role can do.
 *
 * Lazy-initialized so module evaluation never throws at build time
 * (Next.js "Collecting page data" evaluates API routes; a missing env
 * var in Preview builds must not kill the build). The client is only
 * created on first actual use, at request time.
 *
 * Env vars set in Vercel project settings (Production AND Preview):
 *   NEXT_PUBLIC_SUPABASE_URL
 *   NEXT_PUBLIC_SUPABASE_ANON_KEY
 */

let _client: SupabaseClient | null = null

function getClient(): SupabaseClient {
  if (_client) return _client
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) {
    throw new Error(
      "Supabase env vars missing (NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY)."
    )
  }
  _client = createClient(url, key, { auth: { persistSession: false } })
  return _client
}

export const supabase: SupabaseClient = new Proxy({} as SupabaseClient, {
  get(_target, prop, receiver) {
    const client = getClient()
    const value = Reflect.get(client, prop, receiver)
    return typeof value === "function" ? value.bind(client) : value
  },
})
