import { createPagesBrowserClient } from '@supabase/ssr'

// Menggunakan createPagesBrowserClient untuk membuat client di sisi browser
export const supabase = createPagesBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

