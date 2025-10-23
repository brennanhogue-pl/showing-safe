import { createClient } from '@supabase/supabase-js';

// Client-side Supabase client - use only in browser/client components
if (typeof window === 'undefined') {
  console.warn('⚠️ Client-side Supabase client imported in server context');
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
