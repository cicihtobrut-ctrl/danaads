import { createPagesBrowserClient } from '@supabase/ssr'

// Kita ekspor sebuah fungsi yang akan membuat client
// Ini mencegahnya dieksekusi di server saat di-import
export function createBrowserClient() {
  return createPagesBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
}

