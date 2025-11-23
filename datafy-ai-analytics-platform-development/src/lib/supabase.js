import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const supabaseUrl = 'https://zonlbhvwpidyaohaivnm.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpvbmxiaHZ3cGlkeWFvaGFpdm5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM5Mjg2MTMsImV4cCI6MjA3OTUwNDYxM30.nTc_eSy8P2cPW3PqRQ1B_J2uJLdMt1qPE70i5Zi7iCk'

// Validate configuration
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
})

export default supabase