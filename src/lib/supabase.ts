import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Replace these with your actual Supabase project URL and publishable key
// You can find these in your Supabase project settings
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || ''

let supabase: SupabaseClient

try {
  if (!supabaseUrl || !supabasePublishableKey) {
    console.warn('⚠️ Supabase configuration missing. Please check your .env file.')
    supabase = createClient('https://placeholder.supabase.co', 'placeholder-key')
  } else {
    supabase = createClient(supabaseUrl, supabasePublishableKey)
  }
} catch (error) {
  console.error('Error creating Supabase client:', error)
  supabase = createClient('https://placeholder.supabase.co', 'placeholder-key')
}

export { supabase }

