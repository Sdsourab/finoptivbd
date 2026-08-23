import { createClient } from "@supabase/supabase-js";

// Falls back to harmless placeholders when the real env vars aren't set yet
// (local dev before Supabase is connected, or a build running without
// secrets) — createClient() throws immediately on an empty URL, which would
// otherwise crash the entire `next build`, not just the admin page. With a
// placeholder, the build succeeds and only actual sign-in attempts fail
// (with a clear network error) until the real values are set.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

// Frontend-side Supabase Auth only — used solely by the /admin login flow.
// This client never sees the service-role key and never bypasses RLS.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
