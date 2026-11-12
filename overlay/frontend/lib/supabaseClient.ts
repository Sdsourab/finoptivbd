import { createClient } from "@supabase/supabase-js";

// Current Supabase publishable key first; legacy anon key remains supported
// so existing projects can migrate without changing their login accounts.
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "placeholder-public-key";

// Browser-side client only. The server-only SUPABASE_SECRET_KEY is never read
// here and must never be prefixed with NEXT_PUBLIC_.
export const supabase = createClient(supabaseUrl, supabaseKey);
