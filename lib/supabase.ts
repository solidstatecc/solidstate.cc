import { createClient } from "@supabase/supabase-js"

/**
 * Public Supabase client. Uses the publishable (anon) key — safe for
 * client-side use. RLS policies enforce what each role can do.
 *
 * Env vars set in Vercel project settings:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   NEXT_PUBLIC_SUPABASE_ANON_KEY
 */

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

export const supabase = createClient(url, key, {
  auth: { persistSession: false },
})
