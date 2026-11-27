import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let supabaseClient: SupabaseClient | undefined

export function getSupabaseClient(): SupabaseClient {
  if (!supabaseClient) {
    const url = import.meta.env.VITE_SUPABASE_URL?.trim()
    const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim()

    if (!url || !publishableKey) {
      throw new Error(
        'Supabase configuration is missing. Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in .env.local, then restart Vite.',
      )
    }

    supabaseClient = createClient(url, publishableKey)
  }

  return supabaseClient
}
